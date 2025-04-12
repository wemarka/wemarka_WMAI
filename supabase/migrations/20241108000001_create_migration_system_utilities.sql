-- Create utility functions for the migration system

-- Function to check if a table is already in a publication
CREATE OR REPLACE FUNCTION is_table_in_publication(publication_name text, table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
  publication_exists boolean;
  is_in_publication boolean;
BEGIN
  -- Check if the table exists
  SELECT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = table_name
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    RAISE NOTICE 'Table % does not exist', table_name;
    RETURN false;
  END IF;
  
  -- Check if the publication exists
  SELECT EXISTS (
    SELECT 1 FROM pg_publication 
    WHERE pubname = publication_name
  ) INTO publication_exists;
  
  IF NOT publication_exists THEN
    RAISE NOTICE 'Publication % does not exist', publication_name;
    RETURN false;
  END IF;
  
  -- Check if the table is in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = publication_name 
    AND schemaname = 'public' 
    AND tablename = table_name
  ) INTO is_in_publication;
  
  RETURN is_in_publication;
END;
$$;

-- Function to safely add a table to a publication
CREATE OR REPLACE FUNCTION add_table_to_publication(publication_name text, table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  table_exists boolean;
  publication_exists boolean;
  is_in_publication boolean;
BEGIN
  -- Check if the table exists
  SELECT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = table_name
  ) INTO table_exists;
  
  IF NOT table_exists THEN
    RAISE NOTICE 'Table % does not exist', table_name;
    RETURN false;
  END IF;
  
  -- Check if the publication exists
  SELECT EXISTS (
    SELECT 1 FROM pg_publication 
    WHERE pubname = publication_name
  ) INTO publication_exists;
  
  IF NOT publication_exists THEN
    RAISE NOTICE 'Publication % does not exist', publication_name;
    RETURN false;
  END IF;
  
  -- Check if the table is already in the publication
  SELECT is_table_in_publication(publication_name, table_name) INTO is_in_publication;
  
  IF is_in_publication THEN
    RAISE NOTICE 'Table % is already in publication %', table_name, publication_name;
    RETURN true;
  END IF;
  
  -- Add the table to the publication
  EXECUTE format('ALTER PUBLICATION %I ADD TABLE %I.%I', 
                 publication_name, 'public', table_name);
  
  RAISE NOTICE 'Added table % to publication %', table_name, publication_name;
  RETURN true;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Error adding table % to publication %: %', 
               table_name, publication_name, SQLERRM;
  RETURN false;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION is_table_in_publication(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION is_table_in_publication(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION is_table_in_publication(text, text) TO anon;

GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO anon;

-- Add function descriptions
COMMENT ON FUNCTION is_table_in_publication(text, text) IS 'Safely checks if a table is already in a publication | يتحقق بأمان مما إذا كان الجدول موجودًا بالفعل في منشور';
COMMENT ON FUNCTION add_table_to_publication(text, text) IS 'Safely adds a table to a publication with proper error handling | يضيف بأمان جدولًا إلى منشور مع معالجة الأخطاء بشكل صحيح';

-- Create a function to check migration system status
CREATE OR REPLACE FUNCTION check_migration_system_status()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  pg_query_exists boolean;
  exec_sql_exists boolean;
  migration_logs_exists boolean;
  utility_functions_exist boolean;
  realtime_enabled boolean;
  rls_enabled boolean;
  policies_exist boolean;
BEGIN
  -- Check if pg_query function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'pg_query' AND pronamespace = 'public'::regnamespace
  ) INTO pg_query_exists;
  
  -- Check if exec_sql function exists
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'exec_sql' AND pronamespace = 'public'::regnamespace
  ) INTO exec_sql_exists;
  
  -- Check if migration_logs table exists
  SELECT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'migration_logs'
  ) INTO migration_logs_exists;
  
  -- Check if utility functions exist
  SELECT EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'is_table_in_publication' AND pronamespace = 'public'::regnamespace
  ) AND EXISTS (
    SELECT 1 FROM pg_proc 
    WHERE proname = 'add_table_to_publication' AND pronamespace = 'public'::regnamespace
  ) INTO utility_functions_exist;
  
  -- Check if realtime is enabled for migration_logs
  IF migration_logs_exists THEN
    SELECT is_table_in_publication('supabase_realtime', 'migration_logs') INTO realtime_enabled;
  ELSE
    realtime_enabled := false;
  END IF;
  
  -- Check if RLS is enabled for migration_logs
  IF migration_logs_exists THEN
    SELECT relrowsecurity FROM pg_class 
    WHERE relname = 'migration_logs' AND relnamespace = 'public'::regnamespace 
    INTO rls_enabled;
  ELSE
    rls_enabled := false;
  END IF;
  
  -- Check if policies exist for migration_logs
  IF migration_logs_exists THEN
    SELECT EXISTS (
      SELECT 1 FROM pg_policy 
      WHERE polrelid = 'public.migration_logs'::regclass
    ) INTO policies_exist;
  ELSE
    policies_exist := false;
  END IF;
  
  -- Build result JSON
  result := jsonb_build_object(
    'timestamp', now(),
    'status', CASE 
      WHEN pg_query_exists AND exec_sql_exists AND migration_logs_exists AND utility_functions_exist 
      THEN 'complete' 
      ELSE 'incomplete' 
    END,
    'components', jsonb_build_object(
      'pg_query_function', pg_query_exists,
      'exec_sql_function', exec_sql_exists,
      'migration_logs_table', migration_logs_exists,
      'utility_functions', utility_functions_exist,
      'realtime_enabled', realtime_enabled,
      'rls_enabled', rls_enabled,
      'policies_exist', policies_exist
    ),
    'missing_components', (
      SELECT jsonb_agg(component) FROM (
        SELECT 'pg_query_function' as component WHERE NOT pg_query_exists
        UNION ALL
        SELECT 'exec_sql_function' as component WHERE NOT exec_sql_exists
        UNION ALL
        SELECT 'migration_logs_table' as component WHERE NOT migration_logs_exists
        UNION ALL
        SELECT 'utility_functions' as component WHERE NOT utility_functions_exist
        UNION ALL
        SELECT 'realtime_enabled' as component WHERE migration_logs_exists AND NOT realtime_enabled
        UNION ALL
        SELECT 'rls_enabled' as component WHERE migration_logs_exists AND NOT rls_enabled
        UNION ALL
        SELECT 'policies_exist' as component WHERE migration_logs_exists AND NOT policies_exist
      ) as missing
    )
  );
  
  RETURN result;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION check_migration_system_status() TO service_role;
GRANT EXECUTE ON FUNCTION check_migration_system_status() TO authenticated;
GRANT EXECUTE ON FUNCTION check_migration_system_status() TO anon;

-- Add function description
COMMENT ON FUNCTION check_migration_system_status() IS 'Checks the status of the migration system components | يتحقق من حالة مكونات نظام الترحيل';
