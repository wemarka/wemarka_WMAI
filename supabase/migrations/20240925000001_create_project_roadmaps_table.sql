-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create project_roadmaps table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  roadmap_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted'))
);

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE project_roadmaps;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS project_roadmaps_created_by_idx ON project_roadmaps(created_by);
CREATE INDEX IF NOT EXISTS project_roadmaps_status_idx ON project_roadmaps(status);
CREATE INDEX IF NOT EXISTS project_roadmaps_created_at_idx ON project_roadmaps(created_at);

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON project_roadmaps TO authenticated;
