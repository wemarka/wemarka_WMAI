-- Check if users table exists before adding comments
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        -- Add bilingual comments for users table
        COMMENT ON TABLE users IS 'Users of the application | مستخدمو التطبيق';
        COMMENT ON COLUMN users.id IS 'Unique identifier for the user | معرف فريد للمستخدم';
        COMMENT ON COLUMN users.email IS 'Email address of the user | عنوان البريد الإلكتروني للمستخدم';
        COMMENT ON COLUMN users.created_at IS 'Timestamp when the user was created | الطابع الزمني عند إنشاء المستخدم';
        COMMENT ON COLUMN users.updated_at IS 'Timestamp when the user was last updated | الطابع الزمني عند آخر تحديث للمستخدم';
        
        -- Enable realtime for users table if it exists and not already in publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'users'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE users;
        END IF;
    END IF;
END
$$;

-- Check if other tables exist before adding comments
DO $$ 
BEGIN
    -- Add bilingual comments for other tables that might exist
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        COMMENT ON TABLE products IS 'Products available in the store | المنتجات المتوفرة في المتجر';
        COMMENT ON COLUMN products.id IS 'Unique identifier for the product | معرف فريد للمنتج';
        COMMENT ON COLUMN products.name IS 'Name of the product | اسم المنتج';
        COMMENT ON COLUMN products.description IS 'Description of the product | وصف المنتج';
        COMMENT ON COLUMN products.price IS 'Price of the product | سعر المنتج';
        COMMENT ON COLUMN products.stock IS 'Current stock level of the product | مستوى المخزون الحالي للمنتج';
        COMMENT ON COLUMN products.created_at IS 'Timestamp when the product was created | الطابع الزمني عند إنشاء المنتج';
        COMMENT ON COLUMN products.updated_at IS 'Timestamp when the product was last updated | الطابع الزمني عند آخر تحديث للمنتج';
        
        -- Enable realtime for products table if not already in publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'products'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE products;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invoices') THEN
        COMMENT ON TABLE invoices IS 'Invoices for customer purchases | فواتير مشتريات العملاء';
        COMMENT ON COLUMN invoices.id IS 'Unique identifier for the invoice | معرف فريد للفاتورة';
        COMMENT ON COLUMN invoices.user_id IS 'ID of the user who created the invoice | معرف المستخدم الذي أنشأ الفاتورة';
        COMMENT ON COLUMN invoices.amount IS 'Total amount of the invoice | المبلغ الإجمالي للفاتورة';
        COMMENT ON COLUMN invoices.status IS 'Current status of the invoice | الحالة الحالية للفاتورة';
        COMMENT ON COLUMN invoices.created_at IS 'Timestamp when the invoice was created | الطابع الزمني عند إنشاء الفاتورة';
        COMMENT ON COLUMN invoices.updated_at IS 'Timestamp when the invoice was last updated | الطابع الزمني عند آخر تحديث للفاتورة';
        
        -- Enable realtime for invoices table if not already in publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'invoices'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_feedback') THEN
        COMMENT ON TABLE user_feedback IS 'Feedback provided by users | التعليقات المقدمة من المستخدمين';
        COMMENT ON COLUMN user_feedback.id IS 'Unique identifier for the feedback | معرف فريد للتعليق';
        COMMENT ON COLUMN user_feedback.user_id IS 'ID of the user who provided the feedback | معرف المستخدم الذي قدم التعليق';
        COMMENT ON COLUMN user_feedback.rating IS 'Rating given by the user | التقييم المقدم من المستخدم';
        COMMENT ON COLUMN user_feedback.comment IS 'Comment provided by the user | التعليق المقدم من المستخدم';
        COMMENT ON COLUMN user_feedback.created_at IS 'Timestamp when the feedback was created | الطابع الزمني عند إنشاء التعليق';
        
        -- Enable realtime for user_feedback table if not already in publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'user_feedback'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE user_feedback;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'faqs') THEN
        COMMENT ON TABLE faqs IS 'Frequently asked questions | الأسئلة المتكررة';
        COMMENT ON COLUMN faqs.id IS 'Unique identifier for the FAQ | معرف فريد للسؤال المتكرر';
        COMMENT ON COLUMN faqs.question IS 'The question | السؤال';
        COMMENT ON COLUMN faqs.answer IS 'The answer to the question | الإجابة على السؤال';
        COMMENT ON COLUMN faqs.category IS 'Category of the FAQ | فئة السؤال المتكرر';
        COMMENT ON COLUMN faqs.created_at IS 'Timestamp when the FAQ was created | الطابع الزمني عند إنشاء السؤال المتكرر';
        COMMENT ON COLUMN faqs.updated_at IS 'Timestamp when the FAQ was last updated | الطابع الزمني عند آخر تحديث للسؤال المتكرر';
        
        -- Enable realtime for faqs table if not already in publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'faqs'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE faqs;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'docs') THEN
        COMMENT ON TABLE docs IS 'Documentation articles | مقالات التوثيق';
        COMMENT ON COLUMN docs.id IS 'Unique identifier for the document | معرف فريد للوثيقة';
        COMMENT ON COLUMN docs.title IS 'Title of the document | عنوان الوثيقة';
        COMMENT ON COLUMN docs.content IS 'Content of the document | محتوى الوثيقة';
        COMMENT ON COLUMN docs.category IS 'Category of the document | فئة الوثيقة';
        COMMENT ON COLUMN docs.created_at IS 'Timestamp when the document was created | الطابع الزمني عند إنشاء الوثيقة';
        COMMENT ON COLUMN docs.updated_at IS 'Timestamp when the document was last updated | الطابع الزمني عند آخر تحديث للوثيقة';
        
        -- Enable realtime for docs table if not already in publication
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'docs'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE docs;
        END IF;
    END IF;
    
    -- Marketing module tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'marketing_campaigns') THEN
        COMMENT ON TABLE marketing_campaigns IS 'Marketing campaigns | حملات التسويق';
        COMMENT ON COLUMN marketing_campaigns.id IS 'Unique identifier for the campaign | معرف فريد للحملة';
        COMMENT ON COLUMN marketing_campaigns.name IS 'Name of the campaign | اسم الحملة';
        COMMENT ON COLUMN marketing_campaigns.description IS 'Description of the campaign | وصف الحملة';
        COMMENT ON COLUMN marketing_campaigns.status IS 'Status of the campaign | حالة الحملة';
        COMMENT ON COLUMN marketing_campaigns.start_date IS 'Start date of the campaign | تاريخ بدء الحملة';
        COMMENT ON COLUMN marketing_campaigns.end_date IS 'End date of the campaign | تاريخ انتهاء الحملة';
        COMMENT ON COLUMN marketing_campaigns.created_at IS 'Timestamp when the campaign was created | الطابع الزمني عند إنشاء الحملة';
        COMMENT ON COLUMN marketing_campaigns.updated_at IS 'Timestamp when the campaign was last updated | الطابع الزمني عند آخر تحديث للحملة';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'marketing_campaigns'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE marketing_campaigns;
        END IF;
    END IF;
    
    -- Customer service module tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
        COMMENT ON TABLE support_tickets IS 'Customer support tickets | تذاكر دعم العملاء';
        COMMENT ON COLUMN support_tickets.id IS 'Unique identifier for the ticket | معرف فريد للتذكرة';
        COMMENT ON COLUMN support_tickets.user_id IS 'ID of the user who created the ticket | معرف المستخدم الذي أنشأ التذكرة';
        
        -- Check if subject column exists before commenting
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'subject') THEN
            COMMENT ON COLUMN support_tickets.subject IS 'Subject of the ticket | موضوع التذكرة';
        END IF;
        
        -- Check if description column exists before commenting
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'description') THEN
            COMMENT ON COLUMN support_tickets.description IS 'Description of the issue | وصف المشكلة';
        END IF;
        COMMENT ON COLUMN support_tickets.status IS 'Current status of the ticket | الحالة الحالية للتذكرة';
        
        -- Check if priority column exists before commenting
        IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'priority') THEN
            COMMENT ON COLUMN support_tickets.priority IS 'Priority level of the ticket | مستوى أولوية التذكرة';
        END IF;
        COMMENT ON COLUMN support_tickets.created_at IS 'Timestamp when the ticket was created | الطابع الزمني عند إنشاء التذكرة';
        COMMENT ON COLUMN support_tickets.updated_at IS 'Timestamp when the ticket was last updated | الطابع الزمني عند آخر تحديث للتذكرة';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'support_tickets'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE support_tickets;
        END IF;
    END IF;
    
    -- Analytics module tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_analytics') THEN
        COMMENT ON TABLE user_analytics IS 'User analytics data | بيانات تحليلات المستخدم';
        COMMENT ON COLUMN user_analytics.id IS 'Unique identifier for the analytics record | معرف فريد لسجل التحليلات';
        COMMENT ON COLUMN user_analytics.user_id IS 'ID of the user | معرف المستخدم';
        COMMENT ON COLUMN user_analytics.page_visited IS 'Page visited by the user | الصفحة التي زارها المستخدم';
        COMMENT ON COLUMN user_analytics.time_spent IS 'Time spent on the page in seconds | الوقت المستغرق على الصفحة بالثواني';
        COMMENT ON COLUMN user_analytics.created_at IS 'Timestamp when the record was created | الطابع الزمني عند إنشاء السجل';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'user_analytics'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE user_analytics;
        END IF;
    END IF;
    
    -- Project analysis tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_analysis') THEN
        COMMENT ON TABLE project_analysis IS 'Project analysis data | بيانات تحليل المشروع';
        COMMENT ON COLUMN project_analysis.id IS 'Unique identifier for the analysis | معرف فريد للتحليل';
        COMMENT ON COLUMN project_analysis.project_id IS 'ID of the project | معرف المشروع';
        COMMENT ON COLUMN project_analysis.analysis_data IS 'Analysis data in JSON format | بيانات التحليل بتنسيق JSON';
        COMMENT ON COLUMN project_analysis.created_at IS 'Timestamp when the analysis was created | الطابع الزمني عند إنشاء التحليل';
        COMMENT ON COLUMN project_analysis.updated_at IS 'Timestamp when the analysis was last updated | الطابع الزمني عند آخر تحديث للتحليل';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'project_analysis'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE project_analysis;
        END IF;
    END IF;
    
    -- Roadmap tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_roadmaps') THEN
        COMMENT ON TABLE project_roadmaps IS 'Project roadmaps | خرائط طريق المشروع';
        COMMENT ON COLUMN project_roadmaps.id IS 'Unique identifier for the roadmap | معرف فريد لخريطة الطريق';
        COMMENT ON COLUMN project_roadmaps.project_id IS 'ID of the project | معرف المشروع';
        COMMENT ON COLUMN project_roadmaps.title IS 'Title of the roadmap | عنوان خريطة الطريق';
        COMMENT ON COLUMN project_roadmaps.description IS 'Description of the roadmap | وصف خريطة الطريق';
        COMMENT ON COLUMN project_roadmaps.roadmap_data IS 'Roadmap data in JSON format | بيانات خريطة الطريق بتنسيق JSON';
        COMMENT ON COLUMN project_roadmaps.created_at IS 'Timestamp when the roadmap was created | الطابع الزمني عند إنشاء خريطة الطريق';
        COMMENT ON COLUMN project_roadmaps.updated_at IS 'Timestamp when the roadmap was last updated | الطابع الزمني عند آخر تحديث لخريطة الطريق';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'project_roadmaps'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE project_roadmaps;
        END IF;
    END IF;
    
    -- Module integrations tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'module_integrations') THEN
        COMMENT ON TABLE module_integrations IS 'Module integrations | تكاملات الوحدات';
        COMMENT ON COLUMN module_integrations.id IS 'Unique identifier for the integration | معرف فريد للتكامل';
        COMMENT ON COLUMN module_integrations.source_module IS 'Source module name | اسم الوحدة المصدر';
        COMMENT ON COLUMN module_integrations.target_module IS 'Target module name | اسم الوحدة الهدف';
        COMMENT ON COLUMN module_integrations.integration_type IS 'Type of integration | نوع التكامل';
        COMMENT ON COLUMN module_integrations.configuration IS 'Integration configuration in JSON format | تكوين التكامل بتنسيق JSON';
        COMMENT ON COLUMN module_integrations.status IS 'Status of the integration | حالة التكامل';
        COMMENT ON COLUMN module_integrations.created_at IS 'Timestamp when the integration was created | الطابع الزمني عند إنشاء التكامل';
        COMMENT ON COLUMN module_integrations.updated_at IS 'Timestamp when the integration was last updated | الطابع الزمني عند آخر تحديث للتكامل';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'module_integrations'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE module_integrations;
        END IF;
    END IF;
    
    -- AI help logs tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_help_logs') THEN
        COMMENT ON TABLE ai_help_logs IS 'AI help interaction logs | سجلات تفاعل المساعدة بالذكاء الاصطناعي';
        COMMENT ON COLUMN ai_help_logs.id IS 'Unique identifier for the log | معرف فريد للسجل';
        COMMENT ON COLUMN ai_help_logs.user_id IS 'ID of the user | معرف المستخدم';
        COMMENT ON COLUMN ai_help_logs.query IS 'User query | استعلام المستخدم';
        COMMENT ON COLUMN ai_help_logs.response IS 'AI response | استجابة الذكاء الاصطناعي';
        COMMENT ON COLUMN ai_help_logs.module IS 'Module where the interaction occurred | الوحدة التي حدث فيها التفاعل';
        COMMENT ON COLUMN ai_help_logs.created_at IS 'Timestamp when the log was created | الطابع الزمني عند إنشاء السجل';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'ai_help_logs'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE ai_help_logs;
        END IF;
    END IF;
    
    -- Roles and permissions tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'roles') THEN
        COMMENT ON TABLE roles IS 'User roles | أدوار المستخدمين';
        COMMENT ON COLUMN roles.id IS 'Unique identifier for the role | معرف فريد للدور';
        COMMENT ON COLUMN roles.name IS 'Name of the role | اسم الدور';
        COMMENT ON COLUMN roles.description IS 'Description of the role | وصف الدور';
        COMMENT ON COLUMN roles.created_at IS 'Timestamp when the role was created | الطابع الزمني عند إنشاء الدور';
        COMMENT ON COLUMN roles.updated_at IS 'Timestamp when the role was last updated | الطابع الزمني عند آخر تحديث للدور';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'roles'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE roles;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'permissions') THEN
        COMMENT ON TABLE permissions IS 'User permissions | أذونات المستخدمين';
        COMMENT ON COLUMN permissions.id IS 'Unique identifier for the permission | معرف فريد للإذن';
        COMMENT ON COLUMN permissions.name IS 'Name of the permission | اسم الإذن';
        COMMENT ON COLUMN permissions.description IS 'Description of the permission | وصف الإذن';
        COMMENT ON COLUMN permissions.created_at IS 'Timestamp when the permission was created | الطابع الزمني عند إنشاء الإذن';
        COMMENT ON COLUMN permissions.updated_at IS 'Timestamp when the permission was last updated | الطابع الزمني عند آخر تحديث للإذن';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'permissions'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE permissions;
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_roles') THEN
        COMMENT ON TABLE user_roles IS 'User role assignments | تعيينات أدوار المستخدمين';
        COMMENT ON COLUMN user_roles.id IS 'Unique identifier for the user role assignment | معرف فريد لتعيين دور المستخدم';
        COMMENT ON COLUMN user_roles.user_id IS 'ID of the user | معرف المستخدم';
        COMMENT ON COLUMN user_roles.role_id IS 'ID of the role | معرف الدور';
        COMMENT ON COLUMN user_roles.created_at IS 'Timestamp when the assignment was created | الطابع الزمني عند إنشاء التعيين';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'user_roles'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE user_roles;
        END IF;
    END IF;
    
    -- Homepage layouts tables
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'homepage_layouts') THEN
        COMMENT ON TABLE homepage_layouts IS 'Homepage layout configurations | تكوينات تخطيط الصفحة الرئيسية';
        COMMENT ON COLUMN homepage_layouts.id IS 'Unique identifier for the layout | معرف فريد للتخطيط';
        COMMENT ON COLUMN homepage_layouts.user_id IS 'ID of the user | معرف المستخدم';
        COMMENT ON COLUMN homepage_layouts.layout_data IS 'Layout configuration in JSON format | تكوين التخطيط بتنسيق JSON';
        COMMENT ON COLUMN homepage_layouts.is_active IS 'Whether the layout is active | ما إذا كان التخطيط نشطًا';
        COMMENT ON COLUMN homepage_layouts.created_at IS 'Timestamp when the layout was created | الطابع الزمني عند إنشاء التخطيط';
        COMMENT ON COLUMN homepage_layouts.updated_at IS 'Timestamp when the layout was last updated | الطابع الزمني عند آخر تحديث للتخطيط';
        
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'homepage_layouts'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE homepage_layouts;
        END IF;
    END IF;
END
$$;
