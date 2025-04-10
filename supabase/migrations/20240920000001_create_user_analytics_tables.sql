-- Create user_sessions table to track user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  device VARCHAR,
  browser VARCHAR,
  os VARCHAR,
  country VARCHAR,
  ip_address VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create module_access table to track which modules users access
CREATE TABLE IF NOT EXISTS module_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  module VARCHAR NOT NULL,
  access_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feature_usage table to track which features users use
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  module VARCHAR NOT NULL,
  feature VARCHAR NOT NULL,
  usage_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_retention view to calculate retention rates
CREATE OR REPLACE VIEW user_retention AS
WITH user_activity AS (
  SELECT 
    user_id,
    MIN(session_start) AS first_seen,
    MAX(session_start) AS last_seen,
    COUNT(DISTINCT DATE(session_start)) AS active_days
  FROM user_sessions
  GROUP BY user_id
),
retention_periods AS (
  SELECT 
    user_id,
    first_seen,
    last_seen,
    active_days,
    CASE 
      WHEN last_seen >= first_seen + INTERVAL '1 day' THEN TRUE ELSE FALSE 
    END AS day_1,
    CASE 
      WHEN last_seen >= first_seen + INTERVAL '3 days' THEN TRUE ELSE FALSE 
    END AS day_3,
    CASE 
      WHEN last_seen >= first_seen + INTERVAL '7 days' THEN TRUE ELSE FALSE 
    END AS day_7,
    CASE 
      WHEN last_seen >= first_seen + INTERVAL '14 days' THEN TRUE ELSE FALSE 
    END AS day_14,
    CASE 
      WHEN last_seen >= first_seen + INTERVAL '30 days' THEN TRUE ELSE FALSE 
    END AS day_30
  FROM user_activity
)
SELECT
  DATE_TRUNC('day', first_seen) AS cohort_date,
  COUNT(user_id) AS cohort_size,
  SUM(CASE WHEN day_1 THEN 1 ELSE 0 END)::FLOAT / COUNT(user_id) * 100 AS day_1_retention,
  SUM(CASE WHEN day_3 THEN 1 ELSE 0 END)::FLOAT / COUNT(user_id) * 100 AS day_3_retention,
  SUM(CASE WHEN day_7 THEN 1 ELSE 0 END)::FLOAT / COUNT(user_id) * 100 AS day_7_retention,
  SUM(CASE WHEN day_14 THEN 1 ELSE 0 END)::FLOAT / COUNT(user_id) * 100 AS day_14_retention,
  SUM(CASE WHEN day_30 THEN 1 ELSE 0 END)::FLOAT / COUNT(user_id) * 100 AS day_30_retention
FROM retention_periods
GROUP BY cohort_date
ORDER BY cohort_date DESC;

-- Create daily_active_users view
CREATE OR REPLACE VIEW daily_active_users AS
SELECT
  DATE_TRUNC('day', session_start) AS date,
  COUNT(DISTINCT user_id) AS active_users,
  COUNT(*) AS total_sessions,
  AVG(duration)::INTEGER AS avg_session_duration
FROM user_sessions
GROUP BY DATE_TRUNC('day', session_start)
ORDER BY date DESC;

-- Create module_usage_stats view
CREATE OR REPLACE VIEW module_usage_stats AS
SELECT
  module,
  COUNT(*) AS access_count,
  COUNT(DISTINCT user_id) AS unique_users,
  AVG(duration)::INTEGER AS avg_duration
FROM module_access
GROUP BY module
ORDER BY access_count DESC;

-- Create feature_usage_stats view
CREATE OR REPLACE VIEW feature_usage_stats AS
SELECT
  module,
  feature,
  COUNT(*) AS usage_count,
  COUNT(DISTINCT user_id) AS unique_users
FROM feature_usage
GROUP BY module, feature
ORDER BY usage_count DESC;

-- Create device_browser_stats view
CREATE OR REPLACE VIEW device_browser_stats AS
SELECT
  device,
  browser,
  os,
  COUNT(*) AS session_count,
  COUNT(DISTINCT user_id) AS unique_users
FROM user_sessions
GROUP BY device, browser, os
ORDER BY session_count DESC;

-- Create country_stats view
CREATE OR REPLACE VIEW country_stats AS
SELECT
  country,
  COUNT(*) AS session_count,
  COUNT(DISTINCT user_id) AS unique_users
FROM user_sessions
WHERE country IS NOT NULL
GROUP BY country
ORDER BY session_count DESC;

-- Create hourly_usage_stats view
CREATE OR REPLACE VIEW hourly_usage_stats AS
SELECT
  EXTRACT(HOUR FROM session_start) AS hour,
  COUNT(*) AS session_count,
  AVG(duration)::INTEGER AS avg_duration
FROM user_sessions
GROUP BY EXTRACT(HOUR FROM session_start)
ORDER BY hour;

-- Enable row level security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can read all user_sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

CREATE POLICY "Users can read their own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all module_access"
  ON module_access FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

CREATE POLICY "Users can read their own module_access"
  ON module_access FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all feature_usage"
  ON feature_usage FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));

CREATE POLICY "Users can read their own feature_usage"
  ON feature_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Add these tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE user_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE module_access;
ALTER PUBLICATION supabase_realtime ADD TABLE feature_usage;
