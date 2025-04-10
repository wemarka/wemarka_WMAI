-- Create table for storing code analysis results
CREATE TABLE IF NOT EXISTS code_analysis_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  repository_url TEXT,
  branch TEXT,
  file_path TEXT,
  code_snippet TEXT,
  analysis_type TEXT NOT NULL,
  code_quality_score SMALLINT,
  performance_score SMALLINT,
  security_score SMALLINT,
  summary TEXT,
  analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing AI development recommendations
CREATE TABLE IF NOT EXISTS ai_development_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  analysis_id UUID REFERENCES code_analysis_results(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  implementation_difficulty TEXT,
  estimated_hours SMALLINT,
  related_module TEXT,
  code_snippet TEXT,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing development roadmaps
CREATE TABLE IF NOT EXISTS development_roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_completion DATE,
  focus_areas JSONB,
  risks JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing roadmap phases
CREATE TABLE IF NOT EXISTS roadmap_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roadmap_id UUID REFERENCES development_roadmaps(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  priority TEXT NOT NULL,
  dependencies JSONB,
  order_index SMALLINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing roadmap tasks
CREATE TABLE IF NOT EXISTS roadmap_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID REFERENCES roadmap_phases(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  assignee UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_index SMALLINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE code_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_development_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE development_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for code_analysis_results
DROP POLICY IF EXISTS "Users can view their own code analysis results" ON code_analysis_results;
CREATE POLICY "Users can view their own code analysis results"
  ON code_analysis_results FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own code analysis results" ON code_analysis_results;
CREATE POLICY "Users can insert their own code analysis results"
  ON code_analysis_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for ai_development_recommendations
DROP POLICY IF EXISTS "Users can view recommendations for their analyses" ON ai_development_recommendations;
CREATE POLICY "Users can view recommendations for their analyses"
  ON ai_development_recommendations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM code_analysis_results
    WHERE code_analysis_results.id = ai_development_recommendations.analysis_id
    AND code_analysis_results.user_id = auth.uid()
  ));

-- Create policies for development_roadmaps
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON development_roadmaps;
CREATE POLICY "Users can view their own roadmaps"
  ON development_roadmaps FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own roadmaps" ON development_roadmaps;
CREATE POLICY "Users can insert their own roadmaps"
  ON development_roadmaps FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for roadmap_phases
DROP POLICY IF EXISTS "Users can view phases for their roadmaps" ON roadmap_phases;
CREATE POLICY "Users can view phases for their roadmaps"
  ON roadmap_phases FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM development_roadmaps
    WHERE development_roadmaps.id = roadmap_phases.roadmap_id
    AND development_roadmaps.user_id = auth.uid()
  ));

-- Create policies for roadmap_tasks
DROP POLICY IF EXISTS "Users can view tasks for their roadmap phases" ON roadmap_tasks;
CREATE POLICY "Users can view tasks for their roadmap phases"
  ON roadmap_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roadmap_phases
    JOIN development_roadmaps ON roadmap_phases.roadmap_id = development_roadmaps.id
    WHERE roadmap_phases.id = roadmap_tasks.phase_id
    AND development_roadmaps.user_id = auth.uid()
  ));

-- Add realtime support
alter publication supabase_realtime add table code_analysis_results;
alter publication supabase_realtime add table ai_development_recommendations;
alter publication supabase_realtime add table development_roadmaps;
alter publication supabase_realtime add table roadmap_phases;
alter publication supabase_realtime add table roadmap_tasks;
