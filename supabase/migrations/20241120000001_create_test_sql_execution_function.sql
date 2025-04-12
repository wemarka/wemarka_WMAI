-- Create a function to test SQL execution with various methods
CREATE OR REPLACE FUNCTION test_sql_execution(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  start_time TIMESTAMPTZ;
  end_time TIMESTAMPTZ;
  execution_time_ms FLOAT;
  error_message TEXT;
  success BOOLEAN;
BEGIN
  -- Record start time
  start_time := clock_timestamp();
  
  BEGIN
    -- Execute the query dynamically and capture the result
    EXECUTE 'SELECT to_jsonb(t) FROM (' || query_text || ') t' INTO result;
    success := TRUE;
  EXCEPTION WHEN OTHERS THEN
    -- Capture error information
    error_message := SQLERRM;
    success := FALSE;
  END;
  
  -- Record end time and calculate execution time
  end_time := clock_timestamp();
  execution_time_ms := EXTRACT(EPOCH FROM (end_time - start_time)) * 1000;
  
  -- Return a structured result
  IF success THEN
    RETURN jsonb_build_object(
      'success', TRUE,
      'data', result,
      'execution_time_ms', execution_time_ms,
      'query', query_text
    );
  ELSE
    RETURN jsonb_build_object(
      'success', FALSE,
      'error', error_message,
      'execution_time_ms', execution_time_ms,
      'query', query_text
    );
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION test_sql_execution(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION test_sql_execution(TEXT) TO anon;

-- Add function to realtime publication
COMMENT ON FUNCTION test_sql_execution(TEXT) IS 'Tests SQL execution and returns results with timing information';
