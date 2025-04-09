-- Create tables for homepage layouts
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS homepage_draft_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sections JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_published_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sections JSONB NOT NULL,
  draft_id UUID REFERENCES homepage_draft_layouts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE homepage_draft_layouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_published_layouts ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own draft layouts" ON homepage_draft_layouts;
CREATE POLICY "Users can view their own draft layouts"
  ON homepage_draft_layouts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own draft layouts" ON homepage_draft_layouts;
CREATE POLICY "Users can insert their own draft layouts"
  ON homepage_draft_layouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own draft layouts" ON homepage_draft_layouts;
CREATE POLICY "Users can update their own draft layouts"
  ON homepage_draft_layouts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own published layouts" ON homepage_published_layouts;
CREATE POLICY "Users can view their own published layouts"
  ON homepage_published_layouts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own published layouts" ON homepage_published_layouts;
CREATE POLICY "Users can insert their own published layouts"
  ON homepage_published_layouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own published layouts" ON homepage_published_layouts;
CREATE POLICY "Users can update their own published layouts"
  ON homepage_published_layouts FOR UPDATE
  USING (auth.uid() = user_id);

-- Add to realtime publication
alter publication supabase_realtime add table homepage_draft_layouts;
alter publication supabase_realtime add table homepage_published_layouts;