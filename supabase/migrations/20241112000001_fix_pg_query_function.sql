-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS pg_query(text);

-- Create pg_query function
CREATE FUNCTION pg_query(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE query_text INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE,
    'query', query_text
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION pg_query TO authenticated;
GRANT EXECUTE ON FUNCTION pg_query TO anon;

-- Add function to realtime publication
COMMENT ON FUNCTION pg_query IS 'Executes a SQL query and returns the result as JSONB';
