-- Fix the sql_operations_count table query issue
ALTER TABLE IF EXISTS sql_operations_count
ADD COLUMN IF NOT EXISTS avg_execution_time FLOAT DEFAULT 200,
ADD COLUMN IF NOT EXISTS min_execution_time FLOAT DEFAULT 50,
ADD COLUMN IF NOT EXISTS max_execution_time FLOAT DEFAULT 500;

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

-- Add some sample diagnostic logs
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

-- Enable realtime for diagnostic_logs
ALTER PUBLICATION supabase_realtime ADD TABLE diagnostic_logs;

-- Fix system_health table query issue by adding a single row query function
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
