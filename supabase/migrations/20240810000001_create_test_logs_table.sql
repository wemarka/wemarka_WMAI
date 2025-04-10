-- Create test_logs table to store test execution results
CREATE TABLE IF NOT EXISTS test_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  test_id TEXT NOT NULL,
  test_name TEXT NOT NULL,
  module TEXT NOT NULL,
  status TEXT NOT NULL,
  duration FLOAT NOT NULL,
  error TEXT,
  logs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on module and created_at for faster queries
CREATE INDEX IF NOT EXISTS test_logs_module_created_at_idx ON test_logs (module, created_at);

-- Create view for test summary statistics
CREATE OR REPLACE VIEW test_summary_view AS
WITH latest_runs AS (
  SELECT DISTINCT ON (test_id) 
    id,
    test_id,
    test_name,
    module,
    status,
    created_at
  FROM test_logs
  ORDER BY test_id, created_at DESC
)
SELECT 
  module,
  COUNT(*) AS total_tests,
  SUM(CASE WHEN status = 'pass' THEN 1 ELSE 0 END) AS passed,
  SUM(CASE WHEN status = 'fail' THEN 1 ELSE 0 END) AS failed,
  MAX(created_at) AS last_run,
  ROUND((SUM(CASE WHEN status = 'pass' THEN 1 ELSE 0 END)::FLOAT / COUNT(*)) * 100) AS coverage
FROM latest_runs
GROUP BY module;

-- Enable row level security
ALTER TABLE test_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON test_logs;
CREATE POLICY "Allow all operations for authenticated users"
ON test_logs
FOR ALL
TO authenticated
USING (true);

-- Enable realtime for test_logs table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'test_logs'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE test_logs;
  END IF;
END
$$;