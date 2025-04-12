-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS pg_query(text);

-- Create pg_query function
CREATE OR REPLACE FUNCTION pg_query(sql text)
RETURNS TABLE(result json)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION pg_query(text) TO anon, authenticated;

-- Add function to realtime publication
COMMENT ON FUNCTION pg_query IS 'Executes a SQL query and returns the result as a table';
