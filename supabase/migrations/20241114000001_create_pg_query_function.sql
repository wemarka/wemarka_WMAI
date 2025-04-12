-- Drop any existing pg_query functions to avoid conflicts
DROP FUNCTION IF EXISTS pg_query(text);

-- Create the pg_query function with the exact signature as requested
CREATE OR REPLACE FUNCTION pg_query(sql text)
RETURNS TABLE(result json)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY EXECUTE sql;
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION pg_query(text) TO anon, authenticated;

-- Add a comment for documentation
COMMENT ON FUNCTION pg_query IS 'Executes a SQL query and returns the result as a table';
