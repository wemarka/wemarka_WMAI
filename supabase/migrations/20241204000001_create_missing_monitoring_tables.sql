-- Create project_phases table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  progress INTEGER NOT NULL,
  start_date TEXT NOT NULL,
  completion_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sql_operations_count table if it doesn't exist
CREATE TABLE IF NOT EXISTS sql_operations_count (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  method TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  avg_execution_time FLOAT DEFAULT 200,
  min_execution_time FLOAT DEFAULT 50,
  max_execution_time FLOAT DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_health table if it doesn't exist
CREATE TABLE IF NOT EXISTS system_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status TEXT NOT NULL,
  uptime FLOAT NOT NULL,
  last_restart TIMESTAMP WITH TIME ZONE NOT NULL,
  version TEXT NOT NULL,
  environment TEXT NOT NULL,
  response_time_ms FLOAT NOT NULL,
  cpu_usage FLOAT NOT NULL,
  memory_usage FLOAT NOT NULL,
  disk_usage FLOAT NOT NULL,
  database_status TEXT,
  query_performance_ms FLOAT,
  rpc_functions_status TEXT,
  edge_functions_status TEXT,
  api_status TEXT,
  storage_status TEXT,
  realtime_status TEXT,
  auth_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create diagnostic_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS diagnostic_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operation_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  status TEXT NOT NULL,
  method_used TEXT NOT NULL,
  execution_time_ms FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB,
  error TEXT,
  query TEXT
);

-- Insert sample data into project_phases if empty
INSERT INTO project_phases (phase, name, status, progress, start_date, completion_date)
SELECT * FROM (
  VALUES 
    (1, 'Infrastructure Setup', 'completed', 100, '2024-05-15', '2024-06-01'),
    (2, 'Core Functionality', 'completed', 100, '2024-06-02', '2024-07-15'),
    (3, 'Monitoring & Analytics', 'completed', 100, '2024-07-16', '2024-11-30'),
    (4, 'AI Integration', 'pending', 0, '2024-08-01', NULL)
) AS data(phase, name, status, progress, start_date, completion_date)
WHERE NOT EXISTS (SELECT 1 FROM project_phases LIMIT 1);

-- Insert sample data into sql_operations_count if empty
INSERT INTO sql_operations_count (method, count, avg_execution_time, min_execution_time, max_execution_time)
SELECT * FROM (
  VALUES 
    ('execute_sql', 42, 245.67, 120.5, 890.3),
    ('pg_query', 28, 189.32, 95.1, 450.8),
    ('edge-function', 15, 310.45, 180.2, 950.7)
) AS data(method, count, avg_execution_time, min_execution_time, max_execution_time)
WHERE NOT EXISTS (SELECT 1 FROM sql_operations_count LIMIT 1);

-- Insert sample data into system_health if empty
INSERT INTO system_health (status, uptime, last_restart, version, environment, response_time_ms, cpu_usage, memory_usage, disk_usage, database_status, rpc_functions_status, edge_functions_status)
SELECT * FROM (
  VALUES 
    ('healthy', 1209600, NOW() - INTERVAL '14 days', '1.0.42', 'production', 120, 45, 60, 70, 'connected', 'healthy', 'healthy')
) AS data(status, uptime, last_restart, version, environment, response_time_ms, cpu_usage, memory_usage, disk_usage, database_status, rpc_functions_status, edge_functions_status)
WHERE NOT EXISTS (SELECT 1 FROM system_health LIMIT 1);

-- Insert sample data into diagnostic_logs if empty
INSERT INTO diagnostic_logs (operation_id, operation_type, status, method_used, execution_time_ms, details)
SELECT 
  'op-' || gen_random_uuid() as operation_id,
  'sql_query' as operation_type,
  CASE WHEN random() > 0.8 THEN 'error' ELSE 'success' END as status,
  CASE 
    WHEN i % 3 = 0 THEN 'execute_sql'
    WHEN i % 3 = 1 THEN 'pg_query'
    ELSE 'edge-function'
  END as method_used,
  (random() * 1000 + 50) as execution_time_ms,
  jsonb_build_object('query', 'SELECT * FROM users LIMIT 10') as details
FROM generate_series(1, 20) i
WHERE NOT EXISTS (SELECT 1 FROM diagnostic_logs LIMIT 1);

-- Create function to get latest system health record
CREATE OR REPLACE FUNCTION get_latest_system_health()
RETURNS TABLE (id UUID, status TEXT, uptime FLOAT, last_restart TIMESTAMP WITH TIME ZONE, 
               version TEXT, environment TEXT, response_time_ms FLOAT, 
               cpu_usage FLOAT, memory_usage FLOAT, disk_usage FLOAT,
               database_status TEXT, query_performance_ms FLOAT,
               rpc_functions_status TEXT, edge_functions_status TEXT,
               api_status TEXT, storage_status TEXT, realtime_status TEXT,
               auth_status TEXT, created_at TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY 
  SELECT * FROM system_health
  ORDER BY created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Enable realtime for all monitoring tables
ALTER PUBLICATION supabase_realtime ADD TABLE project_phases;
ALTER PUBLICATION supabase_realtime ADD TABLE sql_operations_count;
ALTER PUBLICATION supabase_realtime ADD TABLE system_health;
ALTER PUBLICATION supabase_realtime ADD TABLE diagnostic_logs;
