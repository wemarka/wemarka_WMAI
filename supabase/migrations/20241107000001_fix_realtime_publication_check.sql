-- This migration fixes the issue with adding tables to the supabase_realtime publication
-- by properly checking if the table is already a member of the publication

-- Create or replace the function to check if a table is a member of a publication
CREATE OR REPLACE FUNCTION is_table_in_publication(publication_name TEXT, table_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = publication_name 
    AND schemaname = 'public' 
    AND tablename = table_name
  ) INTO table_exists;
  
  RETURN table_exists;
END;
$$;

-- Add comment to the function
COMMENT ON FUNCTION is_table_in_publication(TEXT, TEXT) IS 'Checks if a table is a member of a publication | يتحقق مما إذا كان الجدول عضوًا في منشور';

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION is_table_in_publication(TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION is_table_in_publication(TEXT, TEXT) TO authenticated;

-- Create or replace a safer function to add a table to a publication
CREATE OR REPLACE FUNCTION add_table_to_publication(publication_name TEXT, table_name TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  publication_exists BOOLEAN;
  result JSONB;
BEGIN
  -- Check if publication exists
  SELECT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = publication_name
  ) INTO publication_exists;
  
  IF NOT publication_exists THEN
    result := json_build_object(
      'success', false,
      'message', 'Publication does not exist',
      'publication', publication_name
    )::JSONB;
    RETURN result;
  END IF;
  
  -- Check if table is already in publication
  IF is_table_in_publication(publication_name, table_name) THEN
    result := json_build_object(
      'success', true,
      'message', 'Table is already in publication',
      'publication', publication_name,
      'table', table_name
    )::JSONB;
    RETURN result;
  END IF;
  
  -- Add table to publication
  EXECUTE format('ALTER PUBLICATION %I ADD TABLE %I.%I', 
                 publication_name, 'public', table_name);
  
  result := json_build_object(
    'success', true,
    'message', 'Table added to publication',
    'publication', publication_name,
    'table', table_name
  )::JSONB;
  
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  result := json_build_object(
    'success', false,
    'message', SQLERRM,
    'detail', SQLSTATE,
    'publication', publication_name,
    'table', table_name
  )::JSONB;
  
  RETURN result;
END;
$$;

-- Add comment to the function
COMMENT ON FUNCTION add_table_to_publication(TEXT, TEXT) IS 'Safely adds a table to a publication with proper checks | يضيف جدولًا إلى منشور بشكل آمن مع إجراء الفحوصات المناسبة';

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION add_table_to_publication(TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION add_table_to_publication(TEXT, TEXT) TO authenticated;
