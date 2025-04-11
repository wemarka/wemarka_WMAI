-- Drop the table if it exists to avoid conflicts
DROP TABLE IF EXISTS module_integrations;

-- Create module_integrations table
CREATE TABLE IF NOT EXISTS module_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_name VARCHAR(255) NOT NULL,
  target_module VARCHAR(255) NOT NULL,
  integration_type VARCHAR(100) NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Add bilingual descriptions
COMMENT ON TABLE module_integrations IS 'Integrations between different modules in the system (EN) | التكاملات بين الوحدات المختلفة في النظام (AR)';
COMMENT ON COLUMN module_integrations.id IS 'Unique identifier for the module integration (EN) | معرف فريد لتكامل الوحدة (AR)';
COMMENT ON COLUMN module_integrations.module_name IS 'Name of the source module (EN) | اسم الوحدة المصدر (AR)';
COMMENT ON COLUMN module_integrations.target_module IS 'Name of the target module (EN) | اسم الوحدة الهدف (AR)';
COMMENT ON COLUMN module_integrations.integration_type IS 'Type of integration (data, UI, workflow, etc.) (EN) | نوع التكامل (بيانات، واجهة مستخدم، سير عمل، إلخ) (AR)';
COMMENT ON COLUMN module_integrations.config IS 'JSON configuration for the integration (EN) | تكوين JSON للتكامل (AR)';
COMMENT ON COLUMN module_integrations.is_active IS 'Whether the integration is currently active (EN) | ما إذا كان التكامل نشطًا حاليًا (AR)';
COMMENT ON COLUMN module_integrations.created_at IS 'Timestamp when the integration was created (EN) | الطابع الزمني عند إنشاء التكامل (AR)';
COMMENT ON COLUMN module_integrations.updated_at IS 'Timestamp when the integration was last updated (EN) | الطابع الزمني عند آخر تحديث للتكامل (AR)';
COMMENT ON COLUMN module_integrations.created_by IS 'User who created the integration (EN) | المستخدم الذي أنشأ التكامل (AR)';
COMMENT ON COLUMN module_integrations.updated_by IS 'User who last updated the integration (EN) | المستخدم الذي قام بآخر تحديث للتكامل (AR)';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_module_integrations_module_name ON module_integrations(module_name);
CREATE INDEX IF NOT EXISTS idx_module_integrations_target_module ON module_integrations(target_module);
CREATE INDEX IF NOT EXISTS idx_module_integrations_integration_type ON module_integrations(integration_type);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE module_integrations;
