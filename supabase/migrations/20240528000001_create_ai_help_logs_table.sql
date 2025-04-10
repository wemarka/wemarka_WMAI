-- Create ai_help_logs table
CREATE TABLE IF NOT EXISTS ai_help_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE ai_help_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own logs
DROP POLICY IF EXISTS "Users can view their own logs" ON ai_help_logs;
CREATE POLICY "Users can view their own logs"
ON ai_help_logs FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to insert their own logs
DROP POLICY IF EXISTS "Users can insert their own logs" ON ai_help_logs;
CREATE POLICY "Users can insert their own logs"
ON ai_help_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table ai_help_logs;
