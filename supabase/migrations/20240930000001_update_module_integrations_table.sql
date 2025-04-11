-- Add created_at and updated_at columns to module_integrations table
ALTER TABLE module_integrations
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_module_integrations_source_module_id ON module_integrations(source_module_id);
CREATE INDEX IF NOT EXISTS idx_module_integrations_target_module_id ON module_integrations(target_module_id);
CREATE INDEX IF NOT EXISTS idx_module_integrations_status ON module_integrations(status);
CREATE INDEX IF NOT EXISTS idx_module_integrations_integration_type ON module_integrations(integration_type);

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
  SELECT integration_type, COUNT(*) AS type_count
  FROM module_integrations
  GROUP BY integration_type
) AS integration_type_counts,
LATERAL (
  SELECT jsonb_object_agg(module_name, module_count) AS module_connections
  FROM (
    SELECT module_name, COUNT(*) AS module_count
    FROM (
      SELECT source_module_name AS module_name FROM module_integrations
      UNION ALL
      SELECT target_module_name AS module_name FROM module_integrations
    ) AS all_modules
    GROUP BY module_name
  ) AS module_counts
) AS module_connections_subquery;

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_module_integrations_updated_at ON module_integrations;

CREATE TRIGGER update_module_integrations_updated_at
BEFORE UPDATE ON module_integrations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
