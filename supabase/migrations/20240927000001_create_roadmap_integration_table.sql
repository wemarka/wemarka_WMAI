-- Create a table to track roadmap integrations with other modules
CREATE TABLE IF NOT EXISTS roadmap_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID NOT NULL REFERENCES project_roadmaps(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  integration_details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active'
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS roadmap_integrations_roadmap_id_idx ON roadmap_integrations(roadmap_id);
CREATE INDEX IF NOT EXISTS roadmap_integrations_module_name_idx ON roadmap_integrations(module_name);

-- Enable realtime
alter publication supabase_realtime add table roadmap_integrations;

-- Create a view to show roadmap integrations with module details
CREATE OR REPLACE VIEW roadmap_module_integrations AS
SELECT
  ri.id,
  ri.roadmap_id,
  pr.name AS roadmap_name,
  ri.module_name,
  ri.integration_type,
  ri.integration_details,
  ri.created_at,
  ri.status,
  u.email AS created_by_email
FROM
  roadmap_integrations ri
JOIN
  project_roadmaps pr ON ri.roadmap_id = pr.id
LEFT JOIN
  auth.users u ON ri.created_by = u.id
WHERE
  ri.status = 'active';
