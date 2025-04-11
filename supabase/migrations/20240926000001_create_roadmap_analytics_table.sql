-- Create a table to store roadmap analytics data
CREATE TABLE IF NOT EXISTS roadmap_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID REFERENCES project_roadmaps(id),
  user_id UUID,
  action_type TEXT NOT NULL,
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS roadmap_analytics_roadmap_id_idx ON roadmap_analytics(roadmap_id);
CREATE INDEX IF NOT EXISTS roadmap_analytics_user_id_idx ON roadmap_analytics(user_id);
CREATE INDEX IF NOT EXISTS roadmap_analytics_action_type_idx ON roadmap_analytics(action_type);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE roadmap_analytics;

-- Create a view for roadmap usage statistics
CREATE OR REPLACE VIEW roadmap_usage_stats AS
SELECT
  r.id AS roadmap_id,
  r.name AS roadmap_name,
  r.created_at AS roadmap_created_at,
  COUNT(DISTINCT ra.user_id) AS unique_users,
  COUNT(ra.id) AS total_interactions,
  COUNT(CASE WHEN ra.action_type = 'view' THEN 1 END) AS view_count,
  COUNT(CASE WHEN ra.action_type = 'edit' THEN 1 END) AS edit_count,
  COUNT(CASE WHEN ra.action_type = 'export' THEN 1 END) AS export_count,
  MAX(ra.created_at) AS last_interaction_at
FROM
  project_roadmaps r
LEFT JOIN
  roadmap_analytics ra ON r.id = ra.roadmap_id
WHERE
  r.status = 'active'
GROUP BY
  r.id, r.name, r.created_at
ORDER BY
  total_interactions DESC;
