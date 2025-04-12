-- Create system_health table if it doesn't exist already
CREATE TABLE IF NOT EXISTS public.system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'down')),
  uptime BIGINT NOT NULL,
  last_restart TIMESTAMP WITH TIME ZONE NOT NULL,
  version TEXT NOT NULL,
  environment TEXT NOT NULL,
  response_time_ms INTEGER NOT NULL,
  cpu_usage NUMERIC(5,2) NOT NULL,
  memory_usage NUMERIC(5,2) NOT NULL,
  disk_usage NUMERIC(5,2) NOT NULL,
  database_status TEXT DEFAULT 'connected',
  query_performance_ms NUMERIC(10,2),
  rpc_functions_status TEXT DEFAULT 'healthy',
  edge_functions_status TEXT DEFAULT 'healthy',
  api_status TEXT DEFAULT 'healthy',
  storage_status TEXT DEFAULT 'healthy',
  realtime_status TEXT DEFAULT 'healthy',
  auth_status TEXT DEFAULT 'healthy'
);

-- Add comment to table
COMMENT ON TABLE public.system_health IS 'Stores system health metrics for monitoring';

-- Add comments to columns
COMMENT ON COLUMN public.system_health.status IS 'Overall system status: healthy, degraded, or down';
COMMENT ON COLUMN public.system_health.uptime IS 'System uptime in seconds';
COMMENT ON COLUMN public.system_health.last_restart IS 'Timestamp of the last system restart';
COMMENT ON COLUMN public.system_health.version IS 'System version number';
COMMENT ON COLUMN public.system_health.environment IS 'Deployment environment (production, staging, etc.)';
COMMENT ON COLUMN public.system_health.response_time_ms IS 'API response time in milliseconds';
COMMENT ON COLUMN public.system_health.cpu_usage IS 'CPU usage percentage';
COMMENT ON COLUMN public.system_health.memory_usage IS 'Memory usage percentage';
COMMENT ON COLUMN public.system_health.disk_usage IS 'Disk usage percentage';
COMMENT ON COLUMN public.system_health.database_status IS 'Status of the database connection';
COMMENT ON COLUMN public.system_health.query_performance_ms IS 'Average query execution time in milliseconds';
COMMENT ON COLUMN public.system_health.rpc_functions_status IS 'Status of RPC functions';
COMMENT ON COLUMN public.system_health.edge_functions_status IS 'Status of Edge functions';
COMMENT ON COLUMN public.system_health.api_status IS 'Status of the API';
COMMENT ON COLUMN public.system_health.storage_status IS 'Status of the storage system';
COMMENT ON COLUMN public.system_health.realtime_status IS 'Status of the realtime system';
COMMENT ON COLUMN public.system_health.auth_status IS 'Status of the authentication system';

-- Create index on created_at for efficient time-based queries
CREATE INDEX IF NOT EXISTS system_health_created_at_idx ON public.system_health (created_at DESC);

-- Enable row-level security
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Create policy for read access
DROP POLICY IF EXISTS "Allow read access to system_health" ON public.system_health;
CREATE POLICY "Allow read access to system_health"
  ON public.system_health
  FOR SELECT
  USING (true);

-- Create policy for insert access (restricted to authenticated users)
DROP POLICY IF EXISTS "Allow insert access to system_health" ON public.system_health;
CREATE POLICY "Allow insert access to system_health"
  ON public.system_health
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Enable realtime subscriptions
alter publication supabase_realtime add table system_health;

-- Insert sample data if the table is empty
INSERT INTO public.system_health (status, uptime, last_restart, version, environment, response_time_ms, cpu_usage, memory_usage, disk_usage)
SELECT 'healthy', 86400, now() - interval '1 day', '1.0.0', 'production', 150, 45.5, 60.2, 72.8
WHERE NOT EXISTS (SELECT 1 FROM public.system_health LIMIT 1);
