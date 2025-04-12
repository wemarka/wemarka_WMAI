-- Drop existing function if it exists
DROP FUNCTION IF EXISTS pg_query(text);

-- Create the pg_query function with proper RETURNS type and SECURITY DEFINER
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

-- Grant execute permissions to public (includes anon and authenticated roles)
GRANT EXECUTE ON FUNCTION pg_query(text) TO public;

-- Add comment for documentation
COMMENT ON FUNCTION pg_query(text) IS 'Executes a SQL query and returns the result as JSONB. Security definer ensures it runs with the privileges of the function creator.';
