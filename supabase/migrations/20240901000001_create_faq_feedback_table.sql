-- Create FAQ feedback table
CREATE TABLE IF NOT EXISTS faq_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faq_id UUID NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  helpful BOOLEAN NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create doc feedback table
CREATE TABLE IF NOT EXISTS doc_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doc_id UUID NOT NULL REFERENCES docs(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  helpful BOOLEAN NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create view for FAQ feedback statistics
CREATE OR REPLACE VIEW faq_feedback_stats AS
SELECT
  faq_id,
  COUNT(*) AS total_votes,
  SUM(CASE WHEN helpful THEN 1 ELSE 0 END) AS helpful_votes,
  SUM(CASE WHEN NOT helpful THEN 1 ELSE 0 END) AS unhelpful_votes,
  ROUND((SUM(CASE WHEN helpful THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100, 2) AS helpful_percentage
FROM faq_feedback
GROUP BY faq_id;

-- Create view for doc feedback statistics
CREATE OR REPLACE VIEW doc_feedback_stats AS
SELECT
  doc_id,
  COUNT(*) AS total_votes,
  SUM(CASE WHEN helpful THEN 1 ELSE 0 END) AS helpful_votes,
  SUM(CASE WHEN NOT helpful THEN 1 ELSE 0 END) AS unhelpful_votes,
  ROUND((SUM(CASE WHEN helpful THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)) * 100, 2) AS helpful_percentage
FROM doc_feedback
GROUP BY doc_id;

-- Enable RLS on feedback tables
ALTER TABLE faq_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE doc_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback tables
DROP POLICY IF EXISTS "Users can view all feedback" ON faq_feedback;
CREATE POLICY "Users can view all feedback"
  ON faq_feedback FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own feedback" ON faq_feedback;
CREATE POLICY "Users can insert their own feedback"
  ON faq_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own feedback" ON faq_feedback;
CREATE POLICY "Users can update their own feedback"
  ON faq_feedback FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all feedback" ON doc_feedback;
CREATE POLICY "Users can view all feedback"
  ON doc_feedback FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own feedback" ON doc_feedback;
CREATE POLICY "Users can insert their own feedback"
  ON doc_feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own feedback" ON doc_feedback;
CREATE POLICY "Users can update their own feedback"
  ON doc_feedback FOR UPDATE
  USING (auth.uid() = user_id);

-- Add realtime for feedback tables
alter publication supabase_realtime add table faq_feedback;
alter publication supabase_realtime add table doc_feedback;
