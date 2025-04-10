-- This migration fixes the previous migration by not attempting to add tables to supabase_realtime if they already exist

-- Check if permissions table exists, if not create it
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  allowed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role_id, module, action)
);

-- Enable RLS on permissions table
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

-- Create policy for permissions table
DROP POLICY IF EXISTS "Permissions are viewable by authenticated users" ON permissions;
CREATE POLICY "Permissions are viewable by authenticated users"
  ON permissions FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Permissions are editable by authenticated users" ON permissions;
CREATE POLICY "Permissions are editable by authenticated users"
  ON permissions FOR ALL
  USING (auth.role() = 'authenticated');
