-- Create diagnostic_logs table for tracking system diagnostics
CREATE TABLE IF NOT EXISTS diagnostic_logs (
  id SERIAL PRIMARY KEY,
  operation_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  status TEXT NOT NULL,
  method_used TEXT NOT NULL,
  execution_time_ms INTEGER NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_diagnostic_logs_operation_id ON diagnostic_logs(operation_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_logs_status ON diagnostic_logs(status);
CREATE INDEX IF NOT EXISTS idx_diagnostic_logs_created_at ON diagnostic_logs(created_at);

-- Add table and column descriptions
COMMENT ON TABLE diagnostic_logs IS 'Logs of system diagnostic operations | سجلات عمليات تشخيص النظام';
COMMENT ON COLUMN diagnostic_logs.id IS 'Unique identifier for the log entry | معرف فريد لإدخال السجل';
COMMENT ON COLUMN diagnostic_logs.operation_id IS 'Unique identifier for the operation | معرف فريد للعملية';
COMMENT ON COLUMN diagnostic_logs.operation_type IS 'Type of diagnostic operation | نوع عملية التشخيص';
COMMENT ON COLUMN diagnostic_logs.status IS 'Status of the operation (success, failed, error) | حالة العملية (نجاح، فشل، خطأ)';
COMMENT ON COLUMN diagnostic_logs.method_used IS 'Method used for the diagnostic | الطريقة المستخدمة للتشخيص';
COMMENT ON COLUMN diagnostic_logs.execution_time_ms IS 'Execution time in milliseconds | وقت التنفيذ بالمللي ثانية';
COMMENT ON COLUMN diagnostic_logs.details IS 'Additional details about the operation | تفاصيل إضافية حول العملية';
COMMENT ON COLUMN diagnostic_logs.created_at IS 'Timestamp when the log was created | الطابع الزمني عند إنشاء السجل';

-- Enable row-level security but allow all operations for authenticated users
ALTER TABLE diagnostic_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON diagnostic_logs;
DROP POLICY IF EXISTS "Allow select for anonymous users" ON diagnostic_logs;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
  ON diagnostic_logs
  FOR ALL
  TO authenticated
  USING (true);
  
-- Create policy to allow select for anonymous users
CREATE POLICY "Allow select for anonymous users"
  ON diagnostic_logs
  FOR SELECT
  TO anon
  USING (true);
  
-- Enable realtime for this table
alter publication supabase_realtime add table diagnostic_logs;
