-- Create project_stages table to track project development stages
CREATE TABLE IF NOT EXISTS project_stages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'planned', 'delayed')),
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  dependencies TEXT[],
  owner TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table to track tasks within project stages
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'planned', 'blocked')),
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  assignee TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_hours NUMERIC,
  actual_hours NUMERIC,
  stage_id UUID NOT NULL REFERENCES project_stages(id) ON DELETE CASCADE,
  tags TEXT[]
);

-- Create git_commits table to track commit activity
CREATE TABLE IF NOT EXISTS git_commits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commit_hash TEXT NOT NULL,
  author TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  files_changed INTEGER,
  additions INTEGER,
  deletions INTEGER,
  branch TEXT,
  repository TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create module_progress table to track progress by module
CREATE TABLE IF NOT EXISTS module_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module TEXT NOT NULL UNIQUE,
  completed_tasks INTEGER NOT NULL DEFAULT 0,
  total_tasks INTEGER NOT NULL DEFAULT 0,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  last_activity TIMESTAMP WITH TIME ZONE,
  contributors TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_recommendations table to store AI-generated recommendations
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  category TEXT NOT NULL CHECK (category IN ('performance', 'security', 'ux', 'code-quality', 'feature')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('new', 'in-review', 'accepted', 'rejected', 'implemented')),
  implementation_difficulty TEXT CHECK (implementation_difficulty IN ('easy', 'medium', 'hard')),
  estimated_hours NUMERIC,
  related_module TEXT,
  code_snippet TEXT,
  feedback TEXT
);

-- Create project_metrics table to store overall project metrics
CREATE TABLE IF NOT EXISTS project_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_commits INTEGER NOT NULL DEFAULT 0,
  total_files INTEGER NOT NULL DEFAULT 0,
  total_lines INTEGER NOT NULL DEFAULT 0,
  contributors INTEGER NOT NULL DEFAULT 0,
  open_issues INTEGER NOT NULL DEFAULT 0,
  closed_issues INTEGER NOT NULL DEFAULT 0,
  pull_requests INTEGER NOT NULL DEFAULT 0,
  merged_pull_requests INTEGER NOT NULL DEFAULT 0,
  average_issue_resolution_time NUMERIC,
  code_quality JSONB,
  velocity NUMERIC,
  burndown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milestones table to track project milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  progress INTEGER NOT NULL CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'planned', 'delayed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create releases table to track project releases
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT NOT NULL,
  name TEXT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('released', 'planned', 'in-development')),
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security on all tables
ALTER TABLE project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE git_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
DROP POLICY IF EXISTS "Authenticated users can read project_stages" ON project_stages;
CREATE POLICY "Authenticated users can read project_stages"
ON project_stages FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read tasks" ON tasks;
CREATE POLICY "Authenticated users can read tasks"
ON tasks FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read git_commits" ON git_commits;
CREATE POLICY "Authenticated users can read git_commits"
ON git_commits FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read module_progress" ON module_progress;
CREATE POLICY "Authenticated users can read module_progress"
ON module_progress FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read ai_recommendations" ON ai_recommendations;
CREATE POLICY "Authenticated users can read ai_recommendations"
ON ai_recommendations FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read project_metrics" ON project_metrics;
CREATE POLICY "Authenticated users can read project_metrics"
ON project_metrics FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read milestones" ON milestones;
CREATE POLICY "Authenticated users can read milestones"
ON milestones FOR SELECT
USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read releases" ON releases;
CREATE POLICY "Authenticated users can read releases"
ON releases FOR SELECT
USING (auth.role() = 'authenticated');

-- Add tables to realtime publication
alter publication supabase_realtime add table project_stages;
alter publication supabase_realtime add table tasks;
alter publication supabase_realtime add table git_commits;
alter publication supabase_realtime add table module_progress;
alter publication supabase_realtime add table ai_recommendations;
alter publication supabase_realtime add table project_metrics;
alter publication supabase_realtime add table milestones;
alter publication supabase_realtime add table releases;
