-- Fix project_phases table structure
DO $$
BEGIN
    -- Create the project_phases table if it doesn't exist
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_phases') THEN
        CREATE TABLE public.project_phases (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            phase INTEGER NOT NULL,
            name TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'pending',
            progress INTEGER NOT NULL DEFAULT 0,
            start_date TEXT,
            completion_date TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    ELSE
        -- Add missing columns if they don't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'progress') THEN
            -- Check if progress_percentage exists and rename it to progress
            IF EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'progress_percentage') THEN
                ALTER TABLE public.project_phases RENAME COLUMN progress_percentage TO progress;
            ELSE
                -- Add progress column if neither exists
                ALTER TABLE public.project_phases ADD COLUMN progress INTEGER NOT NULL DEFAULT 0;
            END IF;
        END IF;

        -- Add start_date column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'start_date') THEN
            ALTER TABLE public.project_phases ADD COLUMN start_date TEXT;
        END IF;

        -- Add completion_date column if it doesn't exist
        IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.project_phases'::regclass AND attname = 'completion_date') THEN
            ALTER TABLE public.project_phases ADD COLUMN completion_date TEXT;
        END IF;
    END IF;

    -- Clear existing data and insert sample data
    DELETE FROM public.project_phases;
    
    INSERT INTO public.project_phases (phase, name, status, progress, start_date, completion_date)
    VALUES 
        (1, 'Infrastructure Setup', 'completed', 100, '2024-05-15', '2024-06-01'),
        (2, 'Core Functionality', 'completed', 100, '2024-06-02', '2024-07-15'),
        (3, 'Monitoring & Analytics', 'completed', 100, '2024-07-16', '2024-11-30'),
        (4, 'AI Integration', 'pending', 0, '2024-08-01', NULL);

END;
$$;

-- Add table to publication for real-time updates
SELECT add_table_to_publication_if_not_exists('project_phases');
