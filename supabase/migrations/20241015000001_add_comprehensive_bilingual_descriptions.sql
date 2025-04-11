-- Add comprehensive bilingual descriptions to all tables and columns
-- This migration adds conditional checks for table and column existence before adding comments

DO $$
BEGIN
  -- module_integrations table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'module_integrations') THEN
    COMMENT ON TABLE module_integrations IS 'Integrations between different modules | التكاملات بين الوحدات المختلفة';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'id') THEN
      COMMENT ON COLUMN module_integrations.id IS 'Unique identifier for the integration | معرف فريد للتكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'source_module_id') THEN
      COMMENT ON COLUMN module_integrations.source_module_id IS 'ID of the source module | معرف الوحدة المصدر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'target_module_id') THEN
      COMMENT ON COLUMN module_integrations.target_module_id IS 'ID of the target module | معرف الوحدة الهدف';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'source_module_name') THEN
      COMMENT ON COLUMN module_integrations.source_module_name IS 'Name of the source module | اسم الوحدة المصدر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'target_module_name') THEN
      COMMENT ON COLUMN module_integrations.target_module_name IS 'Name of the target module | اسم الوحدة الهدف';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'integration_type') THEN
      COMMENT ON COLUMN module_integrations.integration_type IS 'Type of integration (data, ui, api, etc.) | نوع التكامل (بيانات، واجهة مستخدم، واجهة برمجة، إلخ)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'status') THEN
      COMMENT ON COLUMN module_integrations.status IS 'Status of the integration (active, inactive, pending) | حالة التكامل (نشط، غير نشط، قيد الانتظار)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN module_integrations.created_at IS 'Timestamp when the integration was created | الطابع الزمني عند إنشاء التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'updated_at') THEN
      COMMENT ON COLUMN module_integrations.updated_at IS 'Timestamp when the integration was last updated | الطابع الزمني عند آخر تحديث للتكامل';
    END IF;
  END IF;
  
  -- migration_logs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'migration_logs') THEN
    COMMENT ON TABLE migration_logs IS 'Logs of SQL migration operations | سجلات عمليات ترحيل SQL';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'id') THEN
      COMMENT ON COLUMN migration_logs.id IS 'Unique identifier for the log entry | معرف فريد لإدخال السجل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'operation_id') THEN
      COMMENT ON COLUMN migration_logs.operation_id IS 'Unique identifier for the operation | معرف فريد للعملية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'operation_type') THEN
      COMMENT ON COLUMN migration_logs.operation_type IS 'Type of migration operation | نوع عملية الترحيل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'sql_content') THEN
      COMMENT ON COLUMN migration_logs.sql_content IS 'SQL content executed | محتوى SQL المنفذ';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'status') THEN
      COMMENT ON COLUMN migration_logs.status IS 'Status of the operation (success, failed, error) | حالة العملية (نجاح، فشل، خطأ)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'method_used') THEN
      COMMENT ON COLUMN migration_logs.method_used IS 'Method used to execute the SQL | الطريقة المستخدمة لتنفيذ SQL';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'execution_time_ms') THEN
      COMMENT ON COLUMN migration_logs.execution_time_ms IS 'Execution time in milliseconds | وقت التنفيذ بالمللي ثانية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'details') THEN
      COMMENT ON COLUMN migration_logs.details IS 'Additional details about the operation | تفاصيل إضافية حول العملية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'migration_logs' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN migration_logs.created_at IS 'Timestamp when the log was created | الطابع الزمني عند إنشاء السجل';
    END IF;
  END IF;
  
  -- products table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    COMMENT ON TABLE products IS 'Products available in the store | المنتجات المتاحة في المتجر';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'id') THEN
      COMMENT ON COLUMN products.id IS 'Unique identifier for the product | معرف فريد للمنتج';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'name') THEN
      COMMENT ON COLUMN products.name IS 'Name of the product | اسم المنتج';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'description') THEN
      COMMENT ON COLUMN products.description IS 'Description of the product | وصف المنتج';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'price') THEN
      COMMENT ON COLUMN products.price IS 'Price of the product | سعر المنتج';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'image_url') THEN
      COMMENT ON COLUMN products.image_url IS 'URL of the product image | رابط صورة المنتج';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN products.created_at IS 'Timestamp when the product was created | الطابع الزمني عند إنشاء المنتج';
    END IF;
  END IF;
  
  -- invoices table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invoices') THEN
    COMMENT ON TABLE invoices IS 'Customer invoices for purchases | فواتير العملاء للمشتريات';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'id') THEN
      COMMENT ON COLUMN invoices.id IS 'Unique identifier for the invoice | معرف فريد للفاتورة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'customer_id') THEN
      COMMENT ON COLUMN invoices.customer_id IS 'ID of the customer | معرف العميل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'amount') THEN
      COMMENT ON COLUMN invoices.amount IS 'Total amount of the invoice | المبلغ الإجمالي للفاتورة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'status') THEN
      COMMENT ON COLUMN invoices.status IS 'Status of the invoice (paid, pending, overdue) | حالة الفاتورة (مدفوعة، قيد الانتظار، متأخرة)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN invoices.created_at IS 'Timestamp when the invoice was created | الطابع الزمني عند إنشاء الفاتورة';
    END IF;
  END IF;
  
  -- user_roles table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
    COMMENT ON TABLE user_roles IS 'Roles assigned to users | الأدوار المسندة للمستخدمين';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'id') THEN
      COMMENT ON COLUMN user_roles.id IS 'Unique identifier for the user role | معرف فريد لدور المستخدم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN user_roles.user_id IS 'ID of the user | معرف المستخدم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'role') THEN
      COMMENT ON COLUMN user_roles.role IS 'Role name (admin, user, manager, etc.) | اسم الدور (مدير، مستخدم، مشرف، إلخ)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_roles' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN user_roles.created_at IS 'Timestamp when the role was assigned | الطابع الزمني عند إسناد الدور';
    END IF;
  END IF;
  
  -- support_tickets table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
    COMMENT ON TABLE support_tickets IS 'Support tickets submitted by users | تذاكر الدعم المقدمة من المستخدمين';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'id') THEN
      COMMENT ON COLUMN support_tickets.id IS 'Unique identifier for the support ticket | معرف فريد لتذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN support_tickets.user_id IS 'ID of the user who created the ticket | معرف المستخدم الذي أنشأ التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'subject') THEN
      COMMENT ON COLUMN support_tickets.subject IS 'Subject of the support ticket | موضوع تذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'description') THEN
      COMMENT ON COLUMN support_tickets.description IS 'Detailed description of the issue | وصف مفصل للمشكلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'status') THEN
      COMMENT ON COLUMN support_tickets.status IS 'Current status of the ticket (open, in_progress, resolved, closed) | الحالة الحالية للتذكرة (مفتوحة، قيد التقدم، تم حلها، مغلقة)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'priority') THEN
      COMMENT ON COLUMN support_tickets.priority IS 'Priority level of the ticket (low, medium, high, urgent) | مستوى أولوية التذكرة (منخفض، متوسط، مرتفع، عاجل)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN support_tickets.created_at IS 'Timestamp when the ticket was created | الطابع الزمني عند إنشاء التذكرة';
    END IF;
  END IF;
  
  -- user_feedback table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_feedback') THEN
    COMMENT ON TABLE user_feedback IS 'Feedback submitted by users | التعليقات المقدمة من المستخدمين';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_feedback' AND column_name = 'id') THEN
      COMMENT ON COLUMN user_feedback.id IS 'Unique identifier for the feedback | معرف فريد للتعليق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_feedback' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN user_feedback.user_id IS 'ID of the user who submitted the feedback | معرف المستخدم الذي قدم التعليق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_feedback' AND column_name = 'rating') THEN
      COMMENT ON COLUMN user_feedback.rating IS 'Rating given by the user (1-5) | التقييم المقدم من المستخدم (1-5)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_feedback' AND column_name = 'comments') THEN
      COMMENT ON COLUMN user_feedback.comments IS 'Additional comments provided by the user | تعليقات إضافية مقدمة من المستخدم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_feedback' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN user_feedback.created_at IS 'Timestamp when the feedback was submitted | الطابع الزمني عند تقديم التعليق';
    END IF;
  END IF;
  
  -- faqs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'faqs') THEN
    COMMENT ON TABLE faqs IS 'Frequently asked questions | الأسئلة المتكررة';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'faqs' AND column_name = 'id') THEN
      COMMENT ON COLUMN faqs.id IS 'Unique identifier for the FAQ | معرف فريد للسؤال المتكرر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'faqs' AND column_name = 'question') THEN
      COMMENT ON COLUMN faqs.question IS 'The question | السؤال';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'faqs' AND column_name = 'answer') THEN
      COMMENT ON COLUMN faqs.answer IS 'The answer to the question | الإجابة على السؤال';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'faqs' AND column_name = 'category') THEN
      COMMENT ON COLUMN faqs.category IS 'Category of the FAQ | فئة السؤال المتكرر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'faqs' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN faqs.created_at IS 'Timestamp when the FAQ was created | الطابع الزمني عند إنشاء السؤال المتكرر';
    END IF;
  END IF;
  
  -- docs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'docs') THEN
    COMMENT ON TABLE docs IS 'Documentation articles | مقالات التوثيق';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'id') THEN
      COMMENT ON COLUMN docs.id IS 'Unique identifier for the documentation article | معرف فريد لمقال التوثيق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'title') THEN
      COMMENT ON COLUMN docs.title IS 'Title of the article | عنوان المقال';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'content') THEN
      COMMENT ON COLUMN docs.content IS 'Content of the article | محتوى المقال';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'category') THEN
      COMMENT ON COLUMN docs.category IS 'Category of the article | فئة المقال';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN docs.created_at IS 'Timestamp when the article was created | الطابع الزمني عند إنشاء المقال';
    END IF;
  END IF;
  
  -- ai_help_logs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_help_logs') THEN
    COMMENT ON TABLE ai_help_logs IS 'Logs of AI assistant interactions | سجلات تفاعلات المساعد الذكي';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'id') THEN
      COMMENT ON COLUMN ai_help_logs.id IS 'Unique identifier for the log entry | معرف فريد لإدخال السجل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN ai_help_logs.user_id IS 'ID of the user who interacted with the AI | معرف المستخدم الذي تفاعل مع الذكاء الاصطناعي';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'query') THEN
      COMMENT ON COLUMN ai_help_logs.query IS 'User query to the AI | استعلام المستخدم للذكاء الاصطناعي';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'response') THEN
      COMMENT ON COLUMN ai_help_logs.response IS 'AI response to the query | استجابة الذكاء الاصطناعي للاستعلام';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN ai_help_logs.created_at IS 'Timestamp when the interaction occurred | الطابع الزمني عند حدوث التفاعل';
    END IF;
  END IF;
  
  -- project_analysis table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_analysis') THEN
    COMMENT ON TABLE project_analysis IS 'Analysis of development projects | تحليل مشاريع التطوير';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_analysis' AND column_name = 'id') THEN
      COMMENT ON COLUMN project_analysis.id IS 'Unique identifier for the analysis | معرف فريد للتحليل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_analysis' AND column_name = 'project_name') THEN
      COMMENT ON COLUMN project_analysis.project_name IS 'Name of the project | اسم المشروع';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_analysis' AND column_name = 'analysis_data') THEN
      COMMENT ON COLUMN project_analysis.analysis_data IS 'Analysis data in JSON format | بيانات التحليل بتنسيق JSON';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_analysis' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN project_analysis.created_at IS 'Timestamp when the analysis was created | الطابع الزمني عند إنشاء التحليل';
    END IF;
  END IF;
  
  -- project_roadmaps table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_roadmaps') THEN
    COMMENT ON TABLE project_roadmaps IS 'Development roadmaps for projects | خرائط طريق التطوير للمشاريع';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_roadmaps' AND column_name = 'id') THEN
      COMMENT ON COLUMN project_roadmaps.id IS 'Unique identifier for the roadmap | معرف فريد لخريطة الطريق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_roadmaps' AND column_name = 'project_id') THEN
      COMMENT ON COLUMN project_roadmaps.project_id IS 'ID of the project | معرف المشروع';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_roadmaps' AND column_name = 'title') THEN
      COMMENT ON COLUMN project_roadmaps.title IS 'Title of the roadmap | عنوان خريطة الطريق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_roadmaps' AND column_name = 'roadmap_data') THEN
      COMMENT ON COLUMN project_roadmaps.roadmap_data IS 'Roadmap data in JSON format | بيانات خريطة الطريق بتنسيق JSON';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'project_roadmaps' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN project_roadmaps.created_at IS 'Timestamp when the roadmap was created | الطابع الزمني عند إنشاء خريطة الطريق';
    END IF;
  END IF;
  
  -- roadmap_analytics table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'roadmap_analytics') THEN
    COMMENT ON TABLE roadmap_analytics IS 'Analytics for project roadmaps | تحليلات خرائط طريق المشاريع';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'roadmap_analytics' AND column_name = 'id') THEN
      COMMENT ON COLUMN roadmap_analytics.id IS 'Unique identifier for the analytics entry | معرف فريد لإدخال التحليلات';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'roadmap_analytics' AND column_name = 'roadmap_id') THEN
      COMMENT ON COLUMN roadmap_analytics.roadmap_id IS 'ID of the roadmap | معرف خريطة الطريق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'roadmap_analytics' AND column_name = 'analytics_data') THEN
      COMMENT ON COLUMN roadmap_analytics.analytics_data IS 'Analytics data in JSON format | بيانات التحليلات بتنسيق JSON';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'roadmap_analytics' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN roadmap_analytics.created_at IS 'Timestamp when the analytics were created | الطابع الزمني عند إنشاء التحليلات';
    END IF;
  END IF;
  
  -- test_logs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'test_logs') THEN
    COMMENT ON TABLE test_logs IS 'Logs of test executions | سجلات تنفيذ الاختبارات';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'test_logs' AND column_name = 'id') THEN
      COMMENT ON COLUMN test_logs.id IS 'Unique identifier for the test log | معرف فريد لسجل الاختبار';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'test_logs' AND column_name = 'test_name') THEN
      COMMENT ON COLUMN test_logs.test_name IS 'Name of the test | اسم الاختبار';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'test_logs' AND column_name = 'status') THEN
      COMMENT ON COLUMN test_logs.status IS 'Status of the test (passed, failed) | حالة الاختبار (نجح، فشل)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'test_logs' AND column_name = 'execution_time') THEN
      COMMENT ON COLUMN test_logs.execution_time IS 'Execution time of the test in milliseconds | وقت تنفيذ الاختبار بالمللي ثانية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'test_logs' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN test_logs.created_at IS 'Timestamp when the test was executed | الطابع الزمني عند تنفيذ الاختبار';
    END IF;
  END IF;
  
  -- user_analytics table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_analytics') THEN
    COMMENT ON TABLE user_analytics IS 'Analytics data for user behavior | بيانات تحليلية لسلوك المستخدم';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_analytics' AND column_name = 'id') THEN
      COMMENT ON COLUMN user_analytics.id IS 'Unique identifier for the analytics entry | معرف فريد لإدخال التحليلات';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_analytics' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN user_analytics.user_id IS 'ID of the user | معرف المستخدم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_analytics' AND column_name = 'event_type') THEN
      COMMENT ON COLUMN user_analytics.event_type IS 'Type of event (page_view, click, etc.) | نوع الحدث (مشاهدة صفحة، نقرة، إلخ)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_analytics' AND column_name = 'event_data') THEN
      COMMENT ON COLUMN user_analytics.event_data IS 'Event data in JSON format | بيانات الحدث بتنسيق JSON';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_analytics' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN user_analytics.created_at IS 'Timestamp when the event occurred | الطابع الزمني عند حدوث الحدث';
    END IF;
  END IF;
  
  -- homepage_layouts table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'homepage_layouts') THEN
    COMMENT ON TABLE homepage_layouts IS 'Layouts for the homepage | تخطيطات الصفحة الرئيسية';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'homepage_layouts' AND column_name = 'id') THEN
      COMMENT ON COLUMN homepage_layouts.id IS 'Unique identifier for the layout | معرف فريد للتخطيط';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'homepage_layouts' AND column_name = 'name') THEN
      COMMENT ON COLUMN homepage_layouts.name IS 'Name of the layout | اسم التخطيط';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'homepage_layouts' AND column_name = 'layout_data') THEN
      COMMENT ON COLUMN homepage_layouts.layout_data IS 'Layout data in JSON format | بيانات التخطيط بتنسيق JSON';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'homepage_layouts' AND column_name = 'is_active') THEN
      COMMENT ON COLUMN homepage_layouts.is_active IS 'Whether the layout is active | ما إذا كان التخطيط نشطًا';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'homepage_layouts' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN homepage_layouts.created_at IS 'Timestamp when the layout was created | الطابع الزمني عند إنشاء التخطيط';
    END IF;
  END IF;
  
  -- Add more tables as needed
  
END;
$$;
