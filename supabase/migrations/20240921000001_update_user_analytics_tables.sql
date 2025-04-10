-- Create user_sessions table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL,
  session_end TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  device VARCHAR(50),
  browser VARCHAR(50),
  os VARCHAR(50),
  country VARCHAR(100),
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create module_access table if it doesn't exist
CREATE TABLE IF NOT EXISTS module_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  module VARCHAR(50) NOT NULL,
  access_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create feature_usage table if it doesn't exist
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
  module VARCHAR(50) NOT NULL,
  feature VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_start ON user_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_module_access_user_id ON module_access(user_id);
CREATE INDEX IF NOT EXISTS idx_module_access_session_id ON module_access(session_id);
CREATE INDEX IF NOT EXISTS idx_module_access_module ON module_access(module);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_id ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_session_id ON feature_usage(session_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_module ON feature_usage(module);

-- Enable row level security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
DROP POLICY IF EXISTS "Users can view their own sessions" ON user_sessions;
CREATE POLICY "Users can view their own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all sessions" ON user_sessions;
CREATE POLICY "Admins can view all sessions"
  ON user_sessions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for module_access
DROP POLICY IF EXISTS "Users can view their own module access" ON module_access;
CREATE POLICY "Users can view their own module access"
  ON module_access FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all module access" ON module_access;
CREATE POLICY "Admins can view all module access"
  ON module_access FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create policies for feature_usage
DROP POLICY IF EXISTS "Users can view their own feature usage" ON feature_usage;
CREATE POLICY "Users can view their own feature usage"
  ON feature_usage FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all feature usage" ON feature_usage;
CREATE POLICY "Admins can view all feature usage"
  ON feature_usage FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Add tables to realtime publication
alter publication supabase_realtime add table user_sessions;
alter publication supabase_realtime add table module_access;
alter publication supabase_realtime add table feature_usage;
