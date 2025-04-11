-- Create module_integrations table if it doesn't exist

CREATE TABLE IF NOT EXISTS module_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_module_id TEXT NOT NULL,
  source_module_name TEXT NOT NULL,
  target_module_id TEXT NOT NULL,
  target_module_name TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  integration_details JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add table to realtime publication
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    -- Only try to add to publication if the publication exists
    ALTER PUBLICATION supabase_realtime ADD TABLE module_integrations;
  END IF;
END
$$;