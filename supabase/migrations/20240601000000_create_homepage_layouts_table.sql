-- Create homepage_layouts table
CREATE TABLE IF NOT EXISTS homepage_layouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sections JSONB NOT NULL,
  theme_settings JSONB,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE homepage_layouts ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own layouts" ON homepage_layouts;
CREATE POLICY "Users can view their own layouts"
  ON homepage_layouts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own layouts" ON homepage_layouts;
CREATE POLICY "Users can insert their own layouts"
  ON homepage_layouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own layouts" ON homepage_layouts;
CREATE POLICY "Users can update their own layouts"
  ON homepage_layouts FOR UPDATE
  USING (auth.uid() = user_id);

-- Add to realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'homepage_layouts'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE homepage_layouts;
  END IF;
END
$$;