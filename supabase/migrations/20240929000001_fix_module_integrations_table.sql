-- Add created_at and updated_at columns if they don't exist
ALTER TABLE module_integrations ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE module_integrations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_module_integrations_source_module ON module_integrations(source_module_name);
CREATE INDEX IF NOT EXISTS idx_module_integrations_target_module ON module_integrations(target_module_name);
CREATE INDEX IF NOT EXISTS idx_module_integrations_type ON module_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_module_integrations_status ON module_integrations(status);

-- Create a view for integration statistics
CREATE OR REPLACE VIEW module_integration_stats AS
SELECT
    COUNT(*) as total_integrations,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_integrations,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_integrations,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_integrations,
    COUNT(DISTINCT source_module_name) + COUNT(DISTINCT target_module_name) - 
    COUNT(DISTINCT source_module_name INTERSECT SELECT DISTINCT target_module_name FROM module_integrations) as connected_modules,
    COUNT(DISTINCT integration_type) as integration_type_count
FROM module_integrations;

-- Create a view for roadmap integrations
CREATE OR REPLACE VIEW roadmap_module_integrations AS
SELECT
    r.id as roadmap_id,
    r.name as roadmap_name,
    r.created_at as roadmap_created_at,
    m.id as integration_id,
    m.source_module_name,
    m.target_module_name,
    m.integration_type,
    m.status as integration_status
FROM
    project_roadmaps r
CROSS JOIN
    module_integrations m
WHERE
    r.status = 'active' AND m.status = 'active';
