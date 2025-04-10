-- Create weekly_sales view
CREATE OR REPLACE VIEW weekly_sales AS
SELECT
  date_trunc('day', created_at)::date AS date,
  SUM(amount) AS total_amount,
  COUNT(*) AS order_count,
  CASE WHEN COUNT(*) > 0 THEN SUM(amount) / COUNT(*) ELSE 0 END AS avg_order_value
FROM orders
GROUP BY date_trunc('day', created_at)::date
ORDER BY date;

-- Create ticket_resolution_time view
CREATE OR REPLACE VIEW ticket_resolution_time AS
SELECT
  category,
  COUNT(*) AS ticket_count,
  AVG(EXTRACT(EPOCH FROM (first_response_at - created_at))) AS avg_resolution_time,
  (COUNT(CASE WHEN status = 'resolved' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) AS resolution_rate,
  date_trunc('day', created_at)::date AS date
FROM support_tickets
GROUP BY category, date_trunc('day', created_at)::date;

-- Create product_sales view (for top products)
CREATE OR REPLACE VIEW product_sales AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  SUM(o.amount) AS total_sales,
  COUNT(o.id) AS units_sold,
  p.image_url,
  date_trunc('day', o.created_at)::date AS date,
  'Product' AS category
FROM products p
JOIN orders o ON o.product_id = p.id
GROUP BY p.id, p.name, p.image_url, date_trunc('day', o.created_at)::date;

-- Create agent_performance view (for top agents)
CREATE OR REPLACE VIEW agent_performance AS
SELECT
  agent_id,
  u.user_metadata->>'full_name' AS agent_name,
  COUNT(t.id) AS tickets_resolved,
  AVG(EXTRACT(EPOCH FROM (t.first_response_at - t.created_at))) AS avg_resolution_time,
  AVG(f.rating) * 20 AS satisfaction_rate,
  date_trunc('day', t.created_at)::date AS date
FROM support_tickets t
JOIN auth.users u ON t.agent_id = u.id
LEFT JOIN user_feedback f ON f.ticket_id = t.id
WHERE t.status = 'resolved'
GROUP BY agent_id, u.user_metadata->>'full_name', date_trunc('day', t.created_at)::date;

-- Create page_bounce_rates view
CREATE OR REPLACE VIEW page_bounce_rates AS
SELECT
  date_trunc('day', s.created_at)::date AS date,
  s.page_path,
  COUNT(*) AS visits,
  COUNT(CASE WHEN s.session_duration < 10 THEN 1 END) AS bounces,
  (COUNT(CASE WHEN s.session_duration < 10 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)) AS bounce_rate
FROM user_sessions s
GROUP BY date_trunc('day', s.created_at)::date, s.page_path;

-- Create analytics_categories view
CREATE OR REPLACE VIEW analytics_categories AS
SELECT DISTINCT category AS category_name FROM support_tickets
UNION
SELECT 'Product' AS category_name
UNION
SELECT 'Technical' AS category_name
UNION
SELECT 'Billing' AS category_name
UNION
SELECT 'General' AS category_name
UNION
SELECT 'Shipping' AS category_name;

-- Add realtime support for these views
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE user_feedback;
