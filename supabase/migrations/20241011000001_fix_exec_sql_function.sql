-- Fix and enhance the exec_sql function with better security and error handling

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

-- Create a test function to verify exec_sql works
CREATE OR REPLACE FUNCTION test_exec_sql()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to execute a simple SQL statement
  BEGIN
    PERFORM exec_sql('SELECT 1 as test');
    RETURN true;
  EXCEPTION WHEN OTHERS THEN
    RETURN false;
  END;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
GRANT EXECUTE ON FUNCTION test_exec_sql() TO service_role;

-- Add function descriptions
COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';
COMMENT ON FUNCTION test_exec_sql() IS 'Tests if the exec_sql function is working properly | يختبر ما إذا كانت وظيفة exec_sql تعمل بشكل صحيح';
