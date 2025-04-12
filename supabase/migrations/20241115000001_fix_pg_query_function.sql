-- Drop any existing pg_query functions to avoid conflicts
DROP FUNCTION IF EXISTS pg_query(text);

-- Create the pg_query function with the exact signature
CREATE OR REPLACE FUNCTION pg_query(sql text)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE,
    'query', sql
  );
END;
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION pg_query(text) TO anon, authenticated;

-- Add a comment for documentation
COMMENT ON FUNCTION pg_query IS 'Executes a SQL query and returns the result as JSONB';
