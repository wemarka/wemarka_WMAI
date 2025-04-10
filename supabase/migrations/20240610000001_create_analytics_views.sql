-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

-- Create user_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  session_duration INTEGER NOT NULL, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create support_tickets table if it doesn't exist
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  category TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  first_response_at TIMESTAMP WITH TIME ZONE
);

-- Create sales_summary view
CREATE OR REPLACE VIEW sales_summary AS
SELECT
  DATE_TRUNC('day', created_at)::date AS date,
  SUM(amount) AS total_amount,
  COUNT(*) AS order_count,
  CASE 
    WHEN COUNT(*) > 0 THEN SUM(amount) / COUNT(*) 
    ELSE 0 
  END AS avg_order_value
FROM orders
GROUP BY DATE_TRUNC('day', created_at)::date
ORDER BY date;

-- Create active_users view
CREATE OR REPLACE VIEW active_users AS
SELECT
  DATE_TRUNC('day', created_at)::date AS date,
  COUNT(DISTINCT user_id) AS user_count,
  COUNT(*) AS visit_count,
  AVG(session_duration) AS avg_session_time
FROM user_sessions
GROUP BY DATE_TRUNC('day', created_at)::date
ORDER BY date;

-- Create ticket_response_rate view
CREATE OR REPLACE VIEW ticket_response_rate AS
SELECT
  category,
  COUNT(*) AS ticket_count,
  AVG(EXTRACT(EPOCH FROM (first_response_at - created_at)) / 3600) AS avg_response_time,
  (SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS resolution_rate
FROM support_tickets
GROUP BY category;

-- Enable realtime for the tables
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;
