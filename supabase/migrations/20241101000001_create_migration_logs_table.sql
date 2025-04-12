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

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_migration_logs_operation_id ON migration_logs(operation_id);
CREATE INDEX IF NOT EXISTS idx_migration_logs_status ON migration_logs(status);
CREATE INDEX IF NOT EXISTS idx_migration_logs_created_at ON migration_logs(created_at);

-- Add table and column descriptions
COMMENT ON TABLE migration_logs IS 'Logs of SQL migration operations | سجلات عمليات ترحيل SQL';
COMMENT ON COLUMN migration_logs.id IS 'Unique identifier for the log entry | معرف فريد لإدخال السجل';
COMMENT ON COLUMN migration_logs.operation_id IS 'Unique identifier for the operation | معرف فريد للعملية';
COMMENT ON COLUMN migration_logs.operation_type IS 'Type of migration operation | نوع عملية الترحيل';
COMMENT ON COLUMN migration_logs.sql_content IS 'SQL content executed | محتوى SQL المنفذ';
COMMENT ON COLUMN migration_logs.sql_preview IS 'Preview of SQL content for display | معاينة محتوى SQL للعرض';
COMMENT ON COLUMN migration_logs.sql_hash IS 'Hash of SQL content for deduplication | تجزئة محتوى SQL لإزالة التكرار';
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
alter publication supabase_realtime add table migration_logs;