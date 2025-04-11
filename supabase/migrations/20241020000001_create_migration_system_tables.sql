-- Create migration_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_logs (
  id SERIAL PRIMARY KEY,
  operation_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  sql_content TEXT NOT NULL,
  status TEXT NOT NULL,
  method_used TEXT NOT NULL,
  execution_time_ms INTEGER NOT NULL DEFAULT 0,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_migration_logs_operation_id ON migration_logs(operation_id);
CREATE INDEX IF NOT EXISTS idx_migration_logs_status ON migration_logs(status);
CREATE INDEX IF NOT EXISTS idx_migration_logs_created_at ON migration_logs(created_at);

-- Add table and column descriptions (bilingual)
COMMENT ON TABLE migration_logs IS 'Logs of SQL migration operations | سجلات عمليات ترحيل SQL';
COMMENT ON COLUMN migration_logs.id IS 'Unique identifier for the log entry | معرف فريد لإدخال السجل';
COMMENT ON COLUMN migration_logs.operation_id IS 'Unique identifier for the operation | معرف فريد للعملية';
COMMENT ON COLUMN migration_logs.operation_type IS 'Type of migration operation | نوع عملية الترحيل';
COMMENT ON COLUMN migration_logs.sql_content IS 'SQL content executed | محتوى SQL المنفذ';
COMMENT ON COLUMN migration_logs.status IS 'Status of the operation (success, failed, error) | حالة العملية (نجاح، فشل، خطأ)';
COMMENT ON COLUMN migration_logs.method_used IS 'Method used to execute the SQL | الطريقة المستخدمة لتنفيذ SQL';
COMMENT ON COLUMN migration_logs.execution_time_ms IS 'Execution time in milliseconds | وقت التنفيذ بالمللي ثانية';
COMMENT ON COLUMN migration_logs.details IS 'Additional details about the operation | تفاصيل إضافية حول العملية';
COMMENT ON COLUMN migration_logs.created_at IS 'Timestamp when the log was created | الطابع الزمني عند إنشاء السجل';

-- Enable row-level security but allow all operations for authenticated users
ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON migration_logs;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
  ON migration_logs
  FOR ALL
  TO authenticated
  USING (true);
  
-- Enable realtime for this table
BEGIN;
  SELECT FROM pg_publication WHERE pubname = 'supabase_realtime';
  IF FOUND THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE migration_logs;
  END IF;
EXCEPTION WHEN undefined_table THEN
  -- Publication doesn't exist, do nothing
END;

-- Create the exec_sql function if it doesn't exist
CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
BEGIN
  -- Execute the SQL with exception handling
  BEGIN
    EXECUTE sql_text;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'SQL execution error: %', SQLERRM;
  END;
END;
$func$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;

-- Add function description
COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';

-- Create a view for migration statistics
CREATE OR REPLACE VIEW migration_stats AS
SELECT
  COUNT(*) AS total_migrations,
  COUNT(*) FILTER (WHERE status = 'success') AS successful_migrations,
  COUNT(*) FILTER (WHERE status = 'failed' OR status = 'error') AS failed_migrations,
  AVG(execution_time_ms) AS avg_execution_time_ms,
  MAX(execution_time_ms) AS max_execution_time_ms,
  MIN(execution_time_ms) AS min_execution_time_ms,
  COUNT(DISTINCT operation_type) AS operation_types_count,
  jsonb_object_agg(operation_type, type_count) AS operation_type_counts,
  MAX(created_at) AS latest_migration_time
FROM (
  SELECT
    status,
    execution_time_ms,
    operation_type,
    created_at
  FROM migration_logs
) AS ml,
(
  SELECT
    operation_type,
    COUNT(*) AS type_count
  FROM migration_logs
  GROUP BY operation_type
) AS type_counts;

-- Add view description
COMMENT ON VIEW migration_stats IS 'Statistics about database migrations | إحصائيات حول ترحيلات قاعدة البيانات';
