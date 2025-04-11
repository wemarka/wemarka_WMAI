-- Add created_at and updated_at columns to module_integrations table
ALTER TABLE module_integrations
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS update_module_integrations_updated_at ON module_integrations;

-- Create the trigger
CREATE TRIGGER update_module_integrations_updated_at
BEFORE UPDATE ON module_integrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create an index on source_module_name and target_module_name for faster queries
CREATE INDEX IF NOT EXISTS idx_module_integrations_source_module_name ON module_integrations(source_module_name);
CREATE INDEX IF NOT EXISTS idx_module_integrations_target_module_name ON module_integrations(target_module_name);
CREATE INDEX IF NOT EXISTS idx_module_integrations_status ON module_integrations(status);

-- Create a view for integration statistics
CREATE OR REPLACE VIEW module_integration_stats AS
SELECT
    COUNT(*) AS total_integrations,
    COUNT(CASE WHEN status = 'active' THEN 1 END) AS active_integrations,
    COUNT(CASE WHEN status = 'inactive' THEN 1 END) AS inactive_integrations,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_integrations,
    COUNT(DISTINCT integration_type) AS integration_types_count,
    COUNT(DISTINCT source_module_name) + COUNT(DISTINCT target_module_name) - 
    COUNT(DISTINCT source_module_name INTERSECT SELECT DISTINCT target_module_name FROM module_integrations) AS connected_modules_count
FROM module_integrations;

-- Enable realtime for module_integrations table
alter publication supabase_realtime add table module_integrations;