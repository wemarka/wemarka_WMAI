-- First check if project_phases table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_phases') THEN
        CREATE TABLE public.project_phases (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            phase INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            progress_percentage INTEGER NOT NULL DEFAULT 0,
            start_date TIMESTAMP WITH TIME ZONE,
            completion_date TIMESTAMP WITH TIME ZONE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
        
        -- Add table to realtime publication
        PERFORM add_table_to_publication_if_not_exists('project_phases');
    ELSE
        -- If table exists but is missing the name column, add it
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'project_phases' 
            AND column_name = 'name'
        ) THEN
            ALTER TABLE public.project_phases ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed Phase';
        END IF;
        
        -- If table exists but is missing the progress_percentage column, add it
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'project_phases' 
            AND column_name = 'progress_percentage'
        ) THEN
            ALTER TABLE public.project_phases ADD COLUMN progress_percentage INTEGER NOT NULL DEFAULT 0;
        END IF;
    END IF;
END
$$;

-- Create the add_table_to_publication_if_not_exists function if it doesn't exist
CREATE OR REPLACE FUNCTION add_table_to_publication_if_not_exists(table_name text)
RETURNS void AS $$
BEGIN
    -- Check if the table is already in the publication
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND schemaname = 'public' 
        AND tablename = table_name
    ) THEN
        -- Add the table to the publication
        EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Add the table to the publication outside of the DO block
SELECT add_table_to_publication_if_not_exists('project_phases');

-- Insert sample data if the table is empty
INSERT INTO public.project_phases (phase, name, description, status, progress_percentage, start_date)
SELECT 1, 'Infrastructure Setup', 'Setting up the core infrastructure components', 'completed', 100, '2024-05-15'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM public.project_phases WHERE phase = 1);

INSERT INTO public.project_phases (phase, name, description, status, progress_percentage, start_date, completion_date)
SELECT 2, 'Core Functionality', 'Implementing the core business logic and features', 'completed', 100, '2024-06-02'::TIMESTAMP WITH TIME ZONE, '2024-07-15'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM public.project_phases WHERE phase = 2);

INSERT INTO public.project_phases (phase, name, description, status, progress_percentage, start_date, completion_date)
SELECT 3, 'Monitoring & Analytics', 'Adding monitoring, logging, and analytics capabilities', 'completed', 100, '2024-07-16'::TIMESTAMP WITH TIME ZONE, '2024-11-30'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM public.project_phases WHERE phase = 3);

INSERT INTO public.project_phases (phase, name, description, status, progress_percentage, start_date)
SELECT 4, 'AI Integration', 'Integrating AI capabilities across the platform', 'pending', 0, '2024-08-01'::TIMESTAMP WITH TIME ZONE
WHERE NOT EXISTS (SELECT 1 FROM public.project_phases WHERE phase = 4);

-- Make sure the monitor-sql-execution edge function has the correct CORS headers
COMMENT ON FUNCTION public.execute_sql IS 'Executes SQL queries with proper error handling and returns results as JSON';