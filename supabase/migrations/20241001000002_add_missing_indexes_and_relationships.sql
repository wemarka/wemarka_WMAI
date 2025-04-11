-- Add missing indexes and relationships

-- Add indexes to improve query performance

-- Module Integrations Table
CREATE INDEX IF NOT EXISTS idx_module_integrations_created_at ON module_integrations(created_at);

-- Project Roadmaps Table
CREATE INDEX IF NOT EXISTS idx_project_roadmaps_created_by ON project_roadmaps(created_by);
CREATE INDEX IF NOT EXISTS idx_project_roadmaps_status ON project_roadmaps(status);
CREATE INDEX IF NOT EXISTS idx_project_roadmaps_created_at ON project_roadmaps(created_at);

-- Roadmap Integration Table
CREATE INDEX IF NOT EXISTS idx_roadmap_integration_roadmap_id ON roadmap_integration(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_integration_module_integration_id ON roadmap_integration(module_integration_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_integration_status ON roadmap_integration(status);

-- Roadmap Analytics Table
CREATE INDEX IF NOT EXISTS idx_roadmap_analytics_roadmap_id ON roadmap_analytics(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_analytics_metric_type ON roadmap_analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_roadmap_analytics_timestamp ON roadmap_analytics(timestamp);

-- Project Analysis Table
CREATE INDEX IF NOT EXISTS idx_project_analysis_project_name ON project_analysis(project_name);
CREATE INDEX IF NOT EXISTS idx_project_analysis_analysis_type ON project_analysis(analysis_type);
CREATE INDEX IF NOT EXISTS idx_project_analysis_created_by ON project_analysis(created_by);
CREATE INDEX IF NOT EXISTS idx_project_analysis_created_at ON project_analysis(created_at);

-- User Roles Table
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Products Table
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Invoices Table
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- User Feedback Table
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_feedback_type ON user_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at);

-- FAQs Table
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);

-- Docs Table
CREATE INDEX IF NOT EXISTS idx_docs_category ON docs(category);

-- AI Help Logs Table
CREATE INDEX IF NOT EXISTS idx_ai_help_logs_user_id ON ai_help_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_help_logs_module ON ai_help_logs(module);
CREATE INDEX IF NOT EXISTS idx_ai_help_logs_created_at ON ai_help_logs(created_at);

-- Test Logs Table
CREATE INDEX IF NOT EXISTS idx_test_logs_test_name ON test_logs(test_name);
CREATE INDEX IF NOT EXISTS idx_test_logs_status ON test_logs(status);
CREATE INDEX IF NOT EXISTS idx_test_logs_created_at ON test_logs(created_at);

-- FAQ Feedback Table
CREATE INDEX IF NOT EXISTS idx_faq_feedback_faq_id ON faq_feedback(faq_id);
CREATE INDEX IF NOT EXISTS idx_faq_feedback_user_id ON faq_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_faq_feedback_helpful ON faq_feedback(helpful);

-- User Analytics Table
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_type ON user_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_user_analytics_module ON user_analytics(module);
CREATE INDEX IF NOT EXISTS idx_user_analytics_created_at ON user_analytics(created_at);

-- Code Analysis Table
CREATE INDEX IF NOT EXISTS idx_code_analysis_project_id ON code_analysis(project_id);
CREATE INDEX IF NOT EXISTS idx_code_analysis_file_path ON code_analysis(file_path);
CREATE INDEX IF NOT EXISTS idx_code_analysis_analysis_type ON code_analysis(analysis_type);
CREATE INDEX IF NOT EXISTS idx_code_analysis_created_at ON code_analysis(created_at);

-- Homepage Layouts Table
CREATE INDEX IF NOT EXISTS idx_homepage_layouts_is_active ON homepage_layouts(is_active);

-- Add foreign key relationships

-- Roadmap Integration Table
ALTER TABLE roadmap_integration
  DROP CONSTRAINT IF EXISTS fk_roadmap_integration_roadmap_id,
  ADD CONSTRAINT fk_roadmap_integration_roadmap_id
  FOREIGN KEY (roadmap_id)
  REFERENCES project_roadmaps(id)
  ON DELETE CASCADE;

ALTER TABLE roadmap_integration
  DROP CONSTRAINT IF EXISTS fk_roadmap_integration_module_integration_id,
  ADD CONSTRAINT fk_roadmap_integration_module_integration_id
  FOREIGN KEY (module_integration_id)
  REFERENCES module_integrations(id)
  ON DELETE CASCADE;

-- Roadmap Analytics Table
ALTER TABLE roadmap_analytics
  DROP CONSTRAINT IF EXISTS fk_roadmap_analytics_roadmap_id,
  ADD CONSTRAINT fk_roadmap_analytics_roadmap_id
  FOREIGN KEY (roadmap_id)
  REFERENCES project_roadmaps(id)
  ON DELETE CASCADE;

-- FAQ Feedback Table
ALTER TABLE faq_feedback
  DROP CONSTRAINT IF EXISTS fk_faq_feedback_faq_id,
  ADD CONSTRAINT fk_faq_feedback_faq_id
  FOREIGN KEY (faq_id)
  REFERENCES faqs(id)
  ON DELETE CASCADE;

-- User Roles Table (assuming auth.users table exists)
ALTER TABLE user_roles
  DROP CONSTRAINT IF EXISTS fk_user_roles_user_id,
  ADD CONSTRAINT fk_user_roles_user_id
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- User Feedback Table (assuming auth.users table exists)
ALTER TABLE user_feedback
  DROP CONSTRAINT IF EXISTS fk_user_feedback_user_id,
  ADD CONSTRAINT fk_user_feedback_user_id
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- AI Help Logs Table (assuming auth.users table exists)
ALTER TABLE ai_help_logs
  DROP CONSTRAINT IF EXISTS fk_ai_help_logs_user_id,
  ADD CONSTRAINT fk_ai_help_logs_user_id
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- User Analytics Table (assuming auth.users table exists)
ALTER TABLE user_analytics
  DROP CONSTRAINT IF EXISTS fk_user_analytics_user_id,
  ADD CONSTRAINT fk_user_analytics_user_id
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;
