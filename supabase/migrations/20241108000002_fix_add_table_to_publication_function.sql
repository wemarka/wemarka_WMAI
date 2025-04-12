-- Fix the add_table_to_publication function by properly dropping it first

-- Drop the existing function
DROP FUNCTION IF EXISTS add_table_to_publication(text, text);

-- Recreate the function with the same or updated return type
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
GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO anon;

-- Add function description
COMMENT ON FUNCTION add_table_to_publication(text, text) IS 'Safely adds a table to a publication with proper error handling | يضيف بأمان جدولًا إلى منشور مع معالجة الأخطاء بشكل صحيح';
