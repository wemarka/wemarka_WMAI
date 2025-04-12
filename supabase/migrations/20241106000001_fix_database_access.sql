-- Create the pg_query function with proper permissions
CREATE OR REPLACE FUNCTION pg_query(query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE query INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  -- If the query doesn't return JSON, try to execute it without capturing results
  BEGIN
    EXECUTE query;
    RETURN json_build_object('success', true)::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', json_build_object(
        'message', SQLERRM,
        'detail', SQLSTATE
      )
    )::JSONB;
  END;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION pg_query(text) TO service_role;
GRANT EXECUTE ON FUNCTION pg_query(text) TO authenticated;
GRANT EXECUTE ON FUNCTION pg_query(text) TO anon;

-- Add function description
COMMENT ON FUNCTION pg_query(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';

-- Drop existing exec_sql function if it exists
DROP FUNCTION IF EXISTS exec_sql(text);

-- Create the exec_sql function with proper permissions
CREATE OR REPLACE FUNCTION exec_sql(sql_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql_text;
  result := json_build_object('success', true)::JSONB;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := json_build_object(
    'success', false,
    'error', json_build_object(
      'message', SQLERRM,
      'detail', SQLSTATE
    )
  )::JSONB;
  RETURN result;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;

-- Add function description
COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';

-- Create migration_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS migration_logs (
  id SERIAL PRIMARY KEY,
  operation_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  sql_content TEXT NOT NULL,
  sql_preview TEXT,
  sql_hash TEXT,
  status TEXT NOT NULL,
  method_used TEXT NOT NULL,
  execution_time_ms INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add table and column descriptions
COMMENT ON TABLE migration_logs IS 'Logs of SQL migration operations | سجلات عمليات ترحيل SQL';
COMMENT ON COLUMN migration_logs.operation_id IS 'Unique identifier for the operation | معرف فريد للعملية';
COMMENT ON COLUMN migration_logs.operation_type IS 'Type of operation (migration, query, etc) | نوع العملية (ترحيل، استعلام، إلخ)';
COMMENT ON COLUMN migration_logs.sql_content IS 'Full SQL content executed | محتوى SQL الكامل المنفذ';
COMMENT ON COLUMN migration_logs.sql_preview IS 'Preview of SQL content (truncated) | معاينة محتوى SQL (مختصر)';
COMMENT ON COLUMN migration_logs.sql_hash IS 'Hash of SQL content for tracking | تجزئة محتوى SQL للتتبع';
COMMENT ON COLUMN migration_logs.status IS 'Status of operation (success, error) | حالة العملية (نجاح، خطأ)';
COMMENT ON COLUMN migration_logs.method_used IS 'Method used to execute SQL | الطريقة المستخدمة لتنفيذ SQL';
COMMENT ON COLUMN migration_logs.execution_time_ms IS 'Execution time in milliseconds | وقت التنفيذ بالميلي ثانية';
COMMENT ON COLUMN migration_logs.details IS 'Additional details about the operation | تفاصيل إضافية حول العملية';
COMMENT ON COLUMN migration_logs.created_at IS 'Timestamp when the log was created | الطابع الزمني عند إنشاء السجل';

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_migration_logs_operation_id ON migration_logs(operation_id);
CREATE INDEX IF NOT EXISTS idx_migration_logs_status ON migration_logs(status);
CREATE INDEX IF NOT EXISTS idx_migration_logs_created_at ON migration_logs(created_at);

-- Grant permissions for information schema access
GRANT USAGE ON SCHEMA information_schema TO authenticated;
GRANT USAGE ON SCHEMA information_schema TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO anon;

-- Enable RLS but allow all operations for authenticated users
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
DO $$
BEGIN
  -- First check if the publication exists
  PERFORM 1 FROM pg_publication WHERE pubname = 'supabase_realtime';
  IF FOUND THEN
    -- Then check if the table is already in the publication
    PERFORM 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'migration_logs';
    
    -- Only add if not already in the publication
    IF NOT FOUND THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE migration_logs;
    END IF;
  END IF;
EXCEPTION WHEN undefined_table THEN
  -- Publication doesn't exist, do nothing
END;
$$;