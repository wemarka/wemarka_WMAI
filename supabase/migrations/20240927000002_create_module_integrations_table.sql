-- Create a table to track integrations between different modules
CREATE TABLE IF NOT EXISTS module_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_module_id TEXT NOT NULL,
  source_module_name TEXT NOT NULL,
  target_module_id TEXT NOT NULL,
  target_module_name TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  integration_details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS module_integrations_source_module_name_idx ON module_integrations(source_module_name);
CREATE INDEX IF NOT EXISTS module_integrations_target_module_name_idx ON module_integrations(target_module_name);

-- Enable realtime
alter publication supabase_realtime add table module_integrations;

-- Create a view to show module integrations with additional details
CREATE OR REPLACE VIEW module_integration_details AS
SELECT
  mi.id,
  mi.source_module_id,
  mi.source_module_name,
  mi.target_module_id,
  mi.target_module_name,
  mi.integration_type,
  mi.integration_details,
  mi.created_at,
  mi.status,
  u.email AS created_by_email
FROM
  module_integrations mi
LEFT JOIN
  auth.users u ON mi.created_by = u.id
WHERE
  mi.status = 'active';
