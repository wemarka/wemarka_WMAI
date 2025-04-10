-- Create search_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  query TEXT NOT NULL,
  results_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on search_logs
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for search_logs
DROP POLICY IF EXISTS "Users can view their own search logs" ON search_logs;
CREATE POLICY "Users can view their own search logs"
  ON search_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own search logs" ON search_logs;
CREATE POLICY "Users can insert their own search logs"
  ON search_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add realtime for search_logs
ALTER PUBLICATION supabase_realtime ADD TABLE search_logs;

-- Add has_answer column to ai_help_logs if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ai_help_logs' AND column_name = 'has_answer') THEN
    ALTER TABLE ai_help_logs ADD COLUMN has_answer BOOLEAN DEFAULT TRUE;
  END IF;
END$$;

-- Create view for searches by day
CREATE OR REPLACE VIEW search_logs_by_day AS
SELECT 
  DATE_TRUNC('day', created_at)::date as date,
  COUNT(*) as count
FROM search_logs
GROUP BY DATE_TRUNC('day', created_at)::date
ORDER BY date;

-- Create view for feedback by rating
CREATE OR REPLACE VIEW feedback_by_rating AS
SELECT 
  rating,
  COUNT(*) as count
FROM user_feedback
GROUP BY rating
ORDER BY rating;

-- Create view for top search terms
CREATE OR REPLACE VIEW top_search_terms AS
SELECT 
  query as term,
  COUNT(*) as count
FROM search_logs
GROUP BY query
ORDER BY count DESC;

-- Create view for FAQ category distribution
CREATE OR REPLACE VIEW faq_category_distribution AS
SELECT 
  category,
  COUNT(*) as count
FROM faqs
GROUP BY category
ORDER BY count DESC;