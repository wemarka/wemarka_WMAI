-- Create a function to execute SQL queries safely
CREATE OR REPLACE FUNCTION public.execute_sql(query_text TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE 'WITH query_result AS (' || query_text || ') SELECT jsonb_agg(row_to_json(query_result)) FROM query_result' INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM, 'detail', SQLSTATE);
END;
$$;