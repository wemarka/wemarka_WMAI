-- Create the pg_query function if it doesn't exist
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
  -- If the query doesn't return JSON, try to execute it without capturing results
  BEGIN
    EXECUTE query;
    RETURN json_build_object('success', true)::JSONB;
  EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', json_build_object(
        'message', SQLERRM,
        'detail', SQLSTATE
      )
    )::JSONB;
  END;
END;
$$;

-- Add function comment
COMMENT ON FUNCTION pg_query(TEXT) IS 'Executes arbitrary SQL with proper error handling and returns results as JSONB | ينفذ SQL عشوائي مع معالجة الأخطاء بشكل صحيح ويعيد النتائج كـ JSONB';

-- Create the exec_sql function if it doesn't exist
CREATE OR REPLACE FUNCTION exec_sql(sql_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql_text;
  result := json_build_object('success', true)::JSONB;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := json_build_object(
    'success', false,
    'error', json_build_object(
      'message', SQLERRM,
      'detail', SQLSTATE
    )
  )::JSONB;
  RETURN result;
END;
$$;

-- Add function comment
COMMENT ON FUNCTION exec_sql(TEXT) IS 'Executes arbitrary SQL with proper error handling | ينفذ SQL عشوائي مع معالجة الأخطاء بشكل صحيح';
