-- Create project_phases table for tracking project phases
CREATE TABLE IF NOT EXISTS project_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  description TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sql_operations_count table for tracking SQL operations
CREATE TABLE IF NOT EXISTS sql_operations_count (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  method VARCHAR(50) NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add some initial data to project_phases
INSERT INTO project_phases (phase, status, description)
VALUES 
  ('planning', 'completed', 'Initial project planning phase'),
  ('development', 'in_progress', 'Main development phase'),
  ('testing', 'pending', 'Testing and quality assurance'),
  ('deployment', 'pending', 'Production deployment phase');

-- Add initial data to sql_operations_count
INSERT INTO sql_operations_count (method, count)
VALUES 
  ('execute_sql', 0),
  ('pg_query', 0),
  ('edge-function', 0);

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE project_phases;
ALTER PUBLICATION supabase_realtime ADD TABLE sql_operations_count;
