-- Fix exec_sql function with enhanced security and error handling

-- First drop the function if it exists to ensure a clean recreation
DROP FUNCTION IF EXISTS exec_sql(text);

-- Create the exec_sql function with enhanced security and error handling
CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Execute the SQL with exception handling
  BEGIN
    EXECUTE sql_text;
  EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'SQL execution error: %', SQLERRM;
  END;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;

-- Add function description
COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';

-- Create a test function to verify exec_sql works
CREATE OR REPLACE FUNCTION test_exec_sql()
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  test_result boolean;
BEGIN
  -- Create a temporary table
  PERFORM exec_sql('CREATE TEMP TABLE IF NOT EXISTS _test_exec_sql_temp (id int, value text)');
  
  -- Insert a test value
  PERFORM exec_sql('INSERT INTO _test_exec_sql_temp VALUES (1, ''test successful'')');
  
  -- Check if the value was inserted correctly
  EXECUTE 'SELECT EXISTS(SELECT 1 FROM _test_exec_sql_temp WHERE id = 1 AND value = ''test successful'')' INTO test_result;
  
  -- Clean up
  PERFORM exec_sql('DROP TABLE IF EXISTS _test_exec_sql_temp');
  
  RETURN test_result;
EXCEPTION WHEN OTHERS THEN
  -- Clean up on error
  PERFORM exec_sql('DROP TABLE IF EXISTS _test_exec_sql_temp');
  RETURN false;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION test_exec_sql() TO service_role;

-- Add function description
COMMENT ON FUNCTION test_exec_sql() IS 'Tests if the exec_sql function is working correctly | يختبر ما إذا كانت وظيفة exec_sql تعمل بشكل صحيح';
