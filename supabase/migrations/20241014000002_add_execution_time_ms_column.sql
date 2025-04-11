-- Add execution_time_ms column to migration_logs table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'execution_time_ms') THEN
    ALTER TABLE migration_logs ADD COLUMN execution_time_ms INTEGER;
    COMMENT ON COLUMN migration_logs.execution_time_ms IS 'Execution time in milliseconds | وقت التنفيذ بالمللي ثانية';
  END IF;
END $$;