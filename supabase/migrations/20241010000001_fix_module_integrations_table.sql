-- Fix module_integrations table if it exists

DO $$
BEGIN
  -- Check if the table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'module_integrations') THEN
    -- Add created_at and updated_at columns if they don't exist
    ALTER TABLE module_integrations 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

    -- Create indexes for better query performance if they don't exist
    CREATE INDEX IF NOT EXISTS idx_module_integrations_source_module ON module_integrations(source_module_id);
    CREATE INDEX IF NOT EXISTS idx_module_integrations_target_module ON module_integrations(target_module_id);
    CREATE INDEX IF NOT EXISTS idx_module_integrations_type ON module_integrations(integration_type);
    CREATE INDEX IF NOT EXISTS idx_module_integrations_status ON module_integrations(status);

    -- Add bilingual descriptions
    COMMENT ON TABLE module_integrations IS 'Integrations between different modules | التكاملات بين الوحدات المختلفة';
    
    -- Add column comments if the columns exist
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'id') THEN
      COMMENT ON COLUMN module_integrations.id IS 'Unique identifier for the integration | معرف فريد للتكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'source_module_id') THEN
      COMMENT ON COLUMN module_integrations.source_module_id IS 'ID of the source module | معرف الوحدة المصدر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'target_module_id') THEN
      COMMENT ON COLUMN module_integrations.target_module_id IS 'ID of the target module | معرف الوحدة الهدف';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'integration_type') THEN
      COMMENT ON COLUMN module_integrations.integration_type IS 'Type of integration | نوع التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'status') THEN
      COMMENT ON COLUMN module_integrations.status IS 'Status of the integration | حالة التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN module_integrations.created_at IS 'Timestamp when the integration was created | الطابع الزمني عند إنشاء التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'updated_at') THEN
      COMMENT ON COLUMN module_integrations.updated_at IS 'Timestamp when the integration was last updated | الطابع الزمني عند آخر تحديث للتكامل';
    END IF;
    
    -- Create a trigger function to update the updated_at column if it doesn't exist
    CREATE OR REPLACE FUNCTION update_module_integrations_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Create the trigger if it doesn't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_trigger WHERE tgname = 'set_module_integrations_updated_at'
    ) THEN
      CREATE TRIGGER set_module_integrations_updated_at
      BEFORE UPDATE ON module_integrations
      FOR EACH ROW
      EXECUTE FUNCTION update_module_integrations_updated_at();
    END IF;
    
    -- Enable realtime for the table
    PERFORM pg_notify('supabase_realtime', 'ALTER PUBLICATION supabase_realtime ADD TABLE module_integrations');
  END IF;
END;
$$;