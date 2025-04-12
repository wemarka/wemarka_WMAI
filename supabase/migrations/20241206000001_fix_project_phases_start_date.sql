-- Check if the project_phases table exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_phases') THEN
        CREATE TABLE public.project_phases (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            phase INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            progress INTEGER NOT NULL DEFAULT 0,
            start_date TEXT,
            completion_date TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    END IF;
END
$$;

-- Check if the start_date column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'project_phases' 
                   AND column_name = 'start_date') THEN
        ALTER TABLE public.project_phases ADD COLUMN start_date TEXT;
    END IF;
END
$$;

-- Check if the progress_percentage column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'project_phases' 
                   AND column_name = 'progress_percentage') THEN
        ALTER TABLE public.project_phases ADD COLUMN progress_percentage INTEGER;
        
        -- Update progress_percentage from progress if it exists
        UPDATE public.project_phases SET progress_percentage = progress;
    END IF;
END
$$;

-- Ensure the table is added to the realtime publication
SELECT add_table_to_publication_if_not_exists('project_phases');

-- Only insert sample data if the table is empty
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.project_phases LIMIT 1) THEN
        INSERT INTO public.project_phases (phase, name, description, status, progress, start_date) 
        VALUES 
        (1, 'Infrastructure Setup', 'Setting up the core infrastructure and environment', 'completed', 100, '2024-05-15'),
        (2, 'Core Functionality', 'Implementing the essential features and modules', 'completed', 100, '2024-06-02'),
        (3, 'Monitoring & Analytics', 'Adding monitoring systems and analytics dashboards', 'completed', 100, '2024-07-16'),
        (4, 'AI Integration', 'Integrating AI capabilities across the platform', 'pending', 0, '2024-08-01');
    END IF;
END
$$;
