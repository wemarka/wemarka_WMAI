-- First, let's check if the project_phases table exists and create it if it doesn't
DO $$
BEGIN
    -- Create the table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_phases') THEN
        CREATE TABLE public.project_phases (
            id SERIAL PRIMARY KEY,
            phase INTEGER NOT NULL,
            phase_name TEXT NOT NULL,  -- Using phase_name instead of name
            status TEXT NOT NULL,
            progress INTEGER NOT NULL,
            start_date DATE,
            completion_date DATE
        );
    ELSE
        -- If the table exists, make sure it has all the required columns
        -- Add phase_name column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'phase_name') THEN
            ALTER TABLE public.project_phases ADD COLUMN phase_name TEXT;
        END IF;
        
        -- Add phase column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'phase') THEN
            ALTER TABLE public.project_phases ADD COLUMN phase INTEGER;
        END IF;
        
        -- Add status column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'status') THEN
            ALTER TABLE public.project_phases ADD COLUMN status TEXT;
        END IF;
        
        -- Add progress column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'progress') THEN
            ALTER TABLE public.project_phases ADD COLUMN progress INTEGER;
        END IF;
        
        -- Add start_date column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'start_date') THEN
            ALTER TABLE public.project_phases ADD COLUMN start_date DATE;
        END IF;
        
        -- Add completion_date column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'completion_date') THEN
            ALTER TABLE public.project_phases ADD COLUMN completion_date DATE;
        END IF;
    END IF;
    
    -- Clear existing data
    TRUNCATE public.project_phases;
    
    -- Insert sample data using phase_name instead of name
    INSERT INTO public.project_phases (phase, phase_name, status, progress, start_date, completion_date)
    VALUES 
        (1, 'Infrastructure Setup', 'completed', 100, '2024-05-15', '2024-06-01'),
        (2, 'Core Functionality', 'completed', 100, '2024-06-02', '2024-07-15'),
        (3, 'Monitoring & Analytics', 'completed', 100, '2024-07-16', '2024-11-30'),
        (4, 'AI Integration', 'pending', 0, '2024-08-01', NULL);
    
    -- Add the table to the publication for real-time updates if it's not already there
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'project_phases') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.project_phases;
    END IF;
END;
$$;