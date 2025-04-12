-- Create pg_query function if it doesn't exist
CREATE OR REPLACE FUNCTION pg_query(query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE query INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE,
    'query', query
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION pg_query TO authenticated;
GRANT EXECUTE ON FUNCTION pg_query TO anon;

-- Add function to realtime publication
COMMENT ON FUNCTION pg_query IS 'Executes a SQL query and returns the result as JSONB';
