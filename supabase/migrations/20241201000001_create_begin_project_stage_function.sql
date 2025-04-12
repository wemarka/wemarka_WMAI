-- Create a function to begin a project stage (set to in-progress) and reset other stages
CREATE OR REPLACE FUNCTION begin_project_stage(stage_id TEXT)
RETURNS VOID AS $$
BEGIN
  -- First, update any current in-progress stages to planned
  UPDATE project_stages
  SET status = 'planned'
  WHERE status = 'in-progress';
  
  -- Then set the requested stage to in-progress
  UPDATE project_stages
  SET status = 'in-progress'
  WHERE id = stage_id;
  
  -- Update the last_updated timestamp if it exists
  BEGIN
    UPDATE project_stages
    SET updated_at = NOW()
    WHERE id = stage_id;
  EXCEPTION
    WHEN undefined_column THEN
      -- Column doesn't exist, ignore
      NULL;
  END;
END;
$$ LANGUAGE plpgsql;
