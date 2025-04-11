-- Create a table to track SQL migration execution results

CREATE TABLE IF NOT EXISTS migration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sql_preview TEXT NOT NULL,
  sql_hash TEXT NOT NULL,
  execution_method TEXT NOT NULL,
  status TEXT NOT NULL,
  execution_time_ms INTEGER,
  error_message TEXT,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_migration_logs_status ON migration_logs(status);
CREATE INDEX IF NOT EXISTS idx_migration_logs_created_at ON migration_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_migration_logs_user_id ON migration_logs(user_id);

-- Add table and column descriptions
COMMENT ON TABLE migration_logs IS 'Logs of SQL migration executions | سجلات تنفيذ ترحيل SQL';
COMMENT ON COLUMN migration_logs.id IS 'Unique identifier for the log entry | معرف فريد لإدخال السجل';
COMMENT ON COLUMN migration_logs.sql_preview IS 'Preview of the SQL that was executed (truncated) | معاينة لـ SQL الذي تم تنفيذه (مختصر)';
COMMENT ON COLUMN migration_logs.sql_hash IS 'Hash of the full SQL for reference without storing the complete text | تجزئة النص الكامل للـ SQL للرجوع إليها دون تخزين النص الكامل';
COMMENT ON COLUMN migration_logs.execution_method IS 'Method used to execute the SQL (edge-function, client-side, etc.) | الطريقة المستخدمة لتنفيذ SQL (وظيفة حافة، جانب العميل، إلخ)';
COMMENT ON COLUMN migration_logs.status IS 'Status of the execution (success, error) | حالة التنفيذ (نجاح، خطأ)';
COMMENT ON COLUMN migration_logs.execution_time_ms IS 'Time taken to execute the SQL in milliseconds | الوقت المستغرق لتنفيذ SQL بالمللي ثانية';
COMMENT ON COLUMN migration_logs.error_message IS 'Error message if execution failed | رسالة الخطأ إذا فشل التنفيذ';
COMMENT ON COLUMN migration_logs.user_id IS 'ID of the user who executed the SQL | معرف المستخدم الذي نفذ SQL';
COMMENT ON COLUMN migration_logs.created_at IS 'Timestamp when the log was created | الطابع الزمني عند إنشاء السجل';
COMMENT ON COLUMN migration_logs.metadata IS 'Additional metadata about the execution | بيانات وصفية إضافية حول التنفيذ';

-- Enable row-level security
ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Admins can see all migration logs" ON migration_logs;
CREATE POLICY "Admins can see all migration logs"
  ON migration_logs FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'superadmin');

DROP POLICY IF EXISTS "Users can see their own migration logs" ON migration_logs;
CREATE POLICY "Users can see their own migration logs"
  ON migration_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can insert migration logs" ON migration_logs;
CREATE POLICY "Admins can insert migration logs"
  ON migration_logs FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'superadmin');

DROP POLICY IF EXISTS "Service role can manage all migration logs" ON migration_logs;
CREATE POLICY "Service role can manage all migration logs"
  ON migration_logs
  USING (true)
  WITH CHECK (true);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE migration_logs;
