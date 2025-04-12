-- Create project phases table for tracking development progress
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase INTEGER NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'pending')),
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create view to count SQL operations
CREATE OR REPLACE VIEW sql_operations_count AS
SELECT COUNT(*) as count FROM (
  SELECT 1 FROM pg_stat_activity
  WHERE query NOT LIKE '%pg_stat_activity%'
  LIMIT 1000
) subquery;

-- Insert sample data for project phases
INSERT INTO project_phases (phase, name, status, progress, start_date, completion_date)
VALUES
  (1, 'Infrastructure Setup', 'completed', 100, '2024-05-15', '2024-06-01'),
  (2, 'Core Functionality', 'completed', 100, '2024-06-02', '2024-07-15'),
  (3, 'Monitoring & Analytics', 'completed', 100, '2024-07-16', '2024-11-30'),
  (4, 'AI Integration', 'pending', 0, '2024-08-01', NULL)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for project_phases table
ALTER PUBLICATION supabase_realtime ADD TABLE project_phases;
