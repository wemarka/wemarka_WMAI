import { supabase } from "@/lib/supabase";
import { runSqlDirectly } from "./migrationRunner";

/**
 * Apply the module_integrations table update migration
 */
export async function applyModuleIntegrationsUpdate(): Promise<{
  success: boolean;
  error?: any;
}> {
  // SQL content from the migration file
  const sqlContent = `
-- Add created_at and updated_at columns with default values
ALTER TABLE module_integrations 
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_module_integrations_source_module ON module_integrations(source_module_id);
CREATE INDEX IF NOT EXISTS idx_module_integrations_target_module ON module_integrations(target_module_id);
CREATE INDEX IF NOT EXISTS idx_module_integrations_type ON module_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_module_integrations_status ON module_integrations(status);

-- Create a view for integration statistics
CREATE OR REPLACE VIEW module_integration_stats AS
SELECT
  COUNT(*) AS total_integrations,
  COUNT(*) FILTER (WHERE status = 'active') AS active_integrations,
  COUNT(*) FILTER (WHERE status = 'inactive') AS inactive_integrations,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_integrations,
  jsonb_object_agg(integration_type, type_count) AS integration_types,
  jsonb_object_agg(module_name, module_count) AS module_connections
FROM (
  -- Count by integration type
  SELECT 
    integration_type,
    COUNT(*) AS type_count
  FROM module_integrations
  GROUP BY integration_type
) AS type_counts,
(
  -- Count by module (both source and target)
  SELECT 
    module_name,
    COUNT(*) AS module_count
  FROM (
    SELECT source_module_name AS module_name FROM module_integrations
    UNION ALL
    SELECT target_module_name AS module_name FROM module_integrations
  ) AS all_modules
  GROUP BY module_name
) AS module_counts;

-- Create a trigger function to update the updated_at column
CREATE OR REPLACE FUNCTION update_module_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_module_integrations_updated_at'
  ) THEN
    CREATE TRIGGER set_module_integrations_updated_at
    BEFORE UPDATE ON module_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_module_integrations_updated_at();
  END IF;
END;
$$;
  `;

  return await runSqlDirectly(sqlContent);
}

/**
 * Apply the fix for bilingual descriptions migration
 */
export async function applyFixBilingualDescriptions(): Promise<{
  success: boolean;
  error?: any;
}> {
  // SQL content from the migration file
  const sqlContent = `
-- Fix bilingual descriptions for support_tickets table
-- This migration adds conditional checks for column existence before adding comments

DO $$
BEGIN
  -- Check if support_tickets table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
    -- Add comments to columns only if they exist
    
    -- Table comment
    COMMENT ON TABLE support_tickets IS 'Support tickets submitted by users | تذاكر الدعم المقدمة من المستخدمين';
    
    -- Column comments - only if the column exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'id') THEN
      COMMENT ON COLUMN support_tickets.id IS 'Unique identifier for the support ticket | معرف فريد لتذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN support_tickets.user_id IS 'ID of the user who created the ticket | معرف المستخدم الذي أنشأ التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'subject') THEN
      COMMENT ON COLUMN support_tickets.subject IS 'Subject of the support ticket | موضوع تذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'description') THEN
      COMMENT ON COLUMN support_tickets.description IS 'Detailed description of the issue | وصف مفصل للمشكلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'status') THEN
      COMMENT ON COLUMN support_tickets.status IS 'Current status of the ticket (open, in_progress, resolved, closed) | الحالة الحالية للتذكرة (مفتوحة، قيد التقدم، تم حلها، مغلقة)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'priority') THEN
      COMMENT ON COLUMN support_tickets.priority IS 'Priority level of the ticket (low, medium, high, urgent) | مستوى أولوية التذكرة (منخفض، متوسط، مرتفع، عاجل)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'category') THEN
      COMMENT ON COLUMN support_tickets.category IS 'Category of the support issue | فئة مشكلة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'assigned_to') THEN
      COMMENT ON COLUMN support_tickets.assigned_to IS 'ID of the staff member assigned to the ticket | معرف الموظف المكلف بالتذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN support_tickets.created_at IS 'Timestamp when the ticket was created | الطابع الزمني عند إنشاء التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'updated_at') THEN
      COMMENT ON COLUMN support_tickets.updated_at IS 'Timestamp when the ticket was last updated | الطابع الزمني عند آخر تحديث للتذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolved_at') THEN
      COMMENT ON COLUMN support_tickets.resolved_at IS 'Timestamp when the ticket was resolved | الطابع الزمني عند حل التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolution_notes') THEN
      COMMENT ON COLUMN support_tickets.resolution_notes IS 'Notes about how the issue was resolved | ملاحظات حول كيفية حل المشكلة';
    END IF;
  END IF;
  
  -- Add similar conditional checks for other tables and columns as needed
  
END;
$$;
  `;

  return await runSqlDirectly(sqlContent);
}
