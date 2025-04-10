-- Update roles table (skip adding to realtime since it's already there)

-- Create permissions table if it doesn't exist
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add permissions table to realtime publication
alter publication supabase_realtime add table permissions;

-- Create unique constraint on role_id, module, action
ALTER TABLE permissions ADD CONSTRAINT unique_role_module_action UNIQUE (role_id, module, action);
