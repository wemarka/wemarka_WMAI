-- Add Row Level Security (RLS) policies

-- Enable RLS on tables
ALTER TABLE module_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_integration ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_help_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE code_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_layouts ENABLE ROW LEVEL SECURITY;

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.user_has_role(role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND user_roles.role = user_has_role.role
  );
END;
$$;

-- Create a function to check if a user is a superadmin
CREATE OR REPLACE FUNCTION public.is_superadmin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN user_has_role('superadmin');
END;
$$;

-- Module Integrations Policies
DROP POLICY IF EXISTS "Admins and developers can manage module integrations" ON module_integrations;
CREATE POLICY "Admins and developers can manage module integrations"
  ON module_integrations
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer'));

DROP POLICY IF EXISTS "All authenticated users can view module integrations" ON module_integrations;
CREATE POLICY "All authenticated users can view module integrations"
  ON module_integrations
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Project Roadmaps Policies
DROP POLICY IF EXISTS "Admins and developers can manage project roadmaps" ON project_roadmaps;
CREATE POLICY "Admins and developers can manage project roadmaps"
  ON project_roadmaps
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer') OR created_by = auth.uid());

DROP POLICY IF EXISTS "All authenticated users can view project roadmaps" ON project_roadmaps;
CREATE POLICY "All authenticated users can view project roadmaps"
  ON project_roadmaps
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Roadmap Integration Policies
DROP POLICY IF EXISTS "Admins and developers can manage roadmap integrations" ON roadmap_integration;
CREATE POLICY "Admins and developers can manage roadmap integrations"
  ON roadmap_integration
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer'));

DROP POLICY IF EXISTS "All authenticated users can view roadmap integrations" ON roadmap_integration;
CREATE POLICY "All authenticated users can view roadmap integrations"
  ON roadmap_integration
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Roadmap Analytics Policies
DROP POLICY IF EXISTS "Admins and developers can manage roadmap analytics" ON roadmap_analytics;
CREATE POLICY "Admins and developers can manage roadmap analytics"
  ON roadmap_analytics
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer'));

DROP POLICY IF EXISTS "All authenticated users can view roadmap analytics" ON roadmap_analytics;
CREATE POLICY "All authenticated users can view roadmap analytics"
  ON roadmap_analytics
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Project Analysis Policies
DROP POLICY IF EXISTS "Admins and developers can manage project analysis" ON project_analysis;
CREATE POLICY "Admins and developers can manage project analysis"
  ON project_analysis
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer') OR created_by = auth.uid());

DROP POLICY IF EXISTS "All authenticated users can view project analysis" ON project_analysis;
CREATE POLICY "All authenticated users can view project analysis"
  ON project_analysis
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- User Roles Policies
DROP POLICY IF EXISTS "Superadmins can manage user roles" ON user_roles;
CREATE POLICY "Superadmins can manage user roles"
  ON user_roles
  USING (is_superadmin());

DROP POLICY IF EXISTS "Admins can view user roles" ON user_roles;
CREATE POLICY "Admins can view user roles"
  ON user_roles
  FOR SELECT
  USING (is_superadmin() OR user_has_role('admin'));

DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles"
  ON user_roles
  FOR SELECT
  USING (user_id = auth.uid());

-- Products Policies
DROP POLICY IF EXISTS "Admins and staff can manage products" ON products;
CREATE POLICY "Admins and staff can manage products"
  ON products
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('staff'));

DROP POLICY IF EXISTS "All users can view products" ON products;
CREATE POLICY "All users can view products"
  ON products
  FOR SELECT
  USING (true);

-- Invoices Policies
DROP POLICY IF EXISTS "Admins and staff can manage all invoices" ON invoices;
CREATE POLICY "Admins and staff can manage all invoices"
  ON invoices
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('staff'));

DROP POLICY IF EXISTS "Customers can view their own invoices" ON invoices;
CREATE POLICY "Customers can view their own invoices"
  ON invoices
  FOR SELECT
  USING (customer_id = auth.uid());

-- User Feedback Policies
DROP POLICY IF EXISTS "Users can manage their own feedback" ON user_feedback;
CREATE POLICY "Users can manage their own feedback"
  ON user_feedback
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all feedback" ON user_feedback;
CREATE POLICY "Admins can view all feedback"
  ON user_feedback
  FOR SELECT
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('support'));

-- FAQs Policies
DROP POLICY IF EXISTS "Admins and support can manage FAQs" ON faqs;
CREATE POLICY "Admins and support can manage FAQs"
  ON faqs
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('support'));

DROP POLICY IF EXISTS "All users can view FAQs" ON faqs;
CREATE POLICY "All users can view FAQs"
  ON faqs
  FOR SELECT
  USING (true);

-- Docs Policies
DROP POLICY IF EXISTS "Admins and developers can manage docs" ON docs;
CREATE POLICY "Admins and developers can manage docs"
  ON docs
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer'));

DROP POLICY IF EXISTS "All authenticated users can view docs" ON docs;
CREATE POLICY "All authenticated users can view docs"
  ON docs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- AI Help Logs Policies
DROP POLICY IF EXISTS "Users can view their own AI help logs" ON ai_help_logs;
CREATE POLICY "Users can view their own AI help logs"
  ON ai_help_logs
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own AI help logs" ON ai_help_logs;
CREATE POLICY "Users can create their own AI help logs"
  ON ai_help_logs
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all AI help logs" ON ai_help_logs;
CREATE POLICY "Admins can view all AI help logs"
  ON ai_help_logs
  FOR SELECT
  USING (is_superadmin() OR user_has_role('admin'));

-- Test Logs Policies
DROP POLICY IF EXISTS "Admins and developers can manage test logs" ON test_logs;
CREATE POLICY "Admins and developers can manage test logs"
  ON test_logs
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer'));

DROP POLICY IF EXISTS "All authenticated users can view test logs" ON test_logs;
CREATE POLICY "All authenticated users can view test logs"
  ON test_logs
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- FAQ Feedback Policies
DROP POLICY IF EXISTS "Users can manage their own FAQ feedback" ON faq_feedback;
CREATE POLICY "Users can manage their own FAQ feedback"
  ON faq_feedback
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins and support can view all FAQ feedback" ON faq_feedback;
CREATE POLICY "Admins and support can view all FAQ feedback"
  ON faq_feedback
  FOR SELECT
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('support'));

-- User Analytics Policies
DROP POLICY IF EXISTS "Users can view their own analytics" ON user_analytics;
CREATE POLICY "Users can view their own analytics"
  ON user_analytics
  FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "System can insert user analytics" ON user_analytics;
CREATE POLICY "System can insert user analytics"
  ON user_analytics
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admins can view all user analytics" ON user_analytics;
CREATE POLICY "Admins can view all user analytics"
  ON user_analytics
  FOR SELECT
  USING (is_superadmin() OR user_has_role('admin'));

-- Code Analysis Policies
DROP POLICY IF EXISTS "Admins and developers can manage code analysis" ON code_analysis;
CREATE POLICY "Admins and developers can manage code analysis"
  ON code_analysis
  USING (is_superadmin() OR user_has_role('admin') OR user_has_role('developer'));

DROP POLICY IF EXISTS "All authenticated users can view code analysis" ON code_analysis;
CREATE POLICY "All authenticated users can view code analysis"
  ON code_analysis
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Homepage Layouts Policies
DROP POLICY IF EXISTS "Admins can manage homepage layouts" ON homepage_layouts;
CREATE POLICY "Admins can manage homepage layouts"
  ON homepage_layouts
  USING (is_superadmin() OR user_has_role('admin'));

DROP POLICY IF EXISTS "All users can view homepage layouts" ON homepage_layouts;
CREATE POLICY "All users can view homepage layouts"
  ON homepage_layouts
  FOR SELECT
  USING (true);

-- Enable realtime subscriptions for dynamic tables
BEGIN;
  -- Drop from publication if it exists (to avoid errors)
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS module_integrations;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS invoices;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS user_feedback;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS ai_help_logs;
  
  -- Add tables to realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE module_integrations;
  ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
  ALTER PUBLICATION supabase_realtime ADD TABLE user_feedback;
  ALTER PUBLICATION supabase_realtime ADD TABLE ai_help_logs;
COMMIT;
