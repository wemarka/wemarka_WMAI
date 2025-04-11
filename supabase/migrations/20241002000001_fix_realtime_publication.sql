-- Fix the syntax error in the realtime publication statement

BEGIN;
  -- Check if table exists in the publication first
  DO $$
  DECLARE
    table_exists BOOLEAN;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'module_integrations'
    ) INTO table_exists;
    
    IF table_exists THEN
      -- If table exists in publication, drop it properly
      ALTER PUBLICATION supabase_realtime DROP TABLE module_integrations;
    END IF;
    
    -- Add the table to the publication
    ALTER PUBLICATION supabase_realtime ADD TABLE module_integrations;
  END
  $$;
  
  -- Do the same for other tables
  DO $$
  DECLARE
    table_exists BOOLEAN;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'invoices'
    ) INTO table_exists;
    
    IF table_exists THEN
      ALTER PUBLICATION supabase_realtime DROP TABLE invoices;
    END IF;
    
    ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
  END
  $$;
  
  DO $$
  DECLARE
    table_exists BOOLEAN;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'user_feedback'
    ) INTO table_exists;
    
    IF table_exists THEN
      ALTER PUBLICATION supabase_realtime DROP TABLE user_feedback;
    END IF;
    
    ALTER PUBLICATION supabase_realtime ADD TABLE user_feedback;
  END
  $$;
  
  DO $$
  DECLARE
    table_exists BOOLEAN;
  BEGIN
    SELECT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'ai_help_logs'
    ) INTO table_exists;
    
    IF table_exists THEN
      ALTER PUBLICATION supabase_realtime DROP TABLE ai_help_logs;
    END IF;
    
    ALTER PUBLICATION supabase_realtime ADD TABLE ai_help_logs;
  END
  $$;
COMMIT;