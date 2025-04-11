-- Add bilingual descriptions to all tables and columns
-- This migration adds conditional checks for table and column existence before adding comments

DO $$
BEGIN
  -- ai_development_recommendations table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_development_recommendations') THEN
    COMMENT ON TABLE ai_development_recommendations IS 'AI-generated development recommendations | توصيات التطوير المولدة بالذكاء الاصطناعي';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'id') THEN
      COMMENT ON COLUMN ai_development_recommendations.id IS 'Unique identifier for the recommendation | معرف فريد للتوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'title') THEN
      COMMENT ON COLUMN ai_development_recommendations.title IS 'Title of the recommendation | عنوان التوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'description') THEN
      COMMENT ON COLUMN ai_development_recommendations.description IS 'Detailed description of the recommendation | وصف مفصل للتوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN ai_development_recommendations.created_at IS 'Timestamp when the recommendation was created | الطابع الزمني عند إنشاء التوصية';
    END IF;
  END IF;
  
  -- ai_help_logs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_help_logs') THEN
    COMMENT ON TABLE ai_help_logs IS 'Logs of AI help interactions | سجلات تفاعلات المساعدة بالذكاء الاصطناعي';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'id') THEN
      COMMENT ON COLUMN ai_help_logs.id IS 'Unique identifier for the help log | معرف فريد لسجل المساعدة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN ai_help_logs.user_id IS 'ID of the user who requested help | معرف المستخدم الذي طلب المساعدة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'query') THEN
      COMMENT ON COLUMN ai_help_logs.query IS 'User query or question | استفسار أو سؤال المستخدم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'response') THEN
      COMMENT ON COLUMN ai_help_logs.response IS 'AI response to the query | رد الذكاء الاصطناعي على الاستفسار';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_help_logs' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN ai_help_logs.created_at IS 'Timestamp when the help interaction occurred | الطابع الزمني عند حدوث تفاعل المساعدة';
    END IF;
  END IF;
  
  -- ai_recommendations table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_recommendations') THEN
    COMMENT ON TABLE ai_recommendations IS 'AI-generated recommendations | التوصيات المولدة بالذكاء الاصطناعي';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'id') THEN
      COMMENT ON COLUMN ai_recommendations.id IS 'Unique identifier for the recommendation | معرف فريد للتوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN ai_recommendations.user_id IS 'ID of the user who received the recommendation | معرف المستخدم الذي تلقى التوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'content') THEN
      COMMENT ON COLUMN ai_recommendations.content IS 'Content of the recommendation | محتوى التوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_recommendations' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN ai_recommendations.created_at IS 'Timestamp when the recommendation was created | الطابع الزمني عند إنشاء التوصية';
    END IF;
  END IF;
  
  -- cart_items table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cart_items') THEN
    COMMENT ON TABLE cart_items IS 'Items in shopping carts | العناصر في سلات التسوق';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cart_items' AND column_name = 'id') THEN
      COMMENT ON COLUMN cart_items.id IS 'Unique identifier for the cart item | معرف فريد لعنصر السلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cart_items' AND column_name = 'cart_id') THEN
      COMMENT ON COLUMN cart_items.cart_id IS 'ID of the cart this item belongs to | معرف السلة التي ينتمي إليها هذا العنصر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cart_items' AND column_name = 'product_id') THEN
      COMMENT ON COLUMN cart_items.product_id IS 'ID of the product in the cart | معرف المنتج في السلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cart_items' AND column_name = 'quantity') THEN
      COMMENT ON COLUMN cart_items.quantity IS 'Quantity of the product in the cart | كمية المنتج في السلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'cart_items' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN cart_items.created_at IS 'Timestamp when the item was added to the cart | الطابع الزمني عند إضافة العنصر إلى السلة';
    END IF;
  END IF;
  
  -- carts table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'carts') THEN
    COMMENT ON TABLE carts IS 'Shopping carts for users | سلات التسوق للمستخدمين';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'carts' AND column_name = 'id') THEN
      COMMENT ON COLUMN carts.id IS 'Unique identifier for the cart | معرف فريد للسلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'carts' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN carts.user_id IS 'ID of the user who owns the cart | معرف المستخدم الذي يملك السلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'carts' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN carts.created_at IS 'Timestamp when the cart was created | الطابع الزمني عند إنشاء السلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'carts' AND column_name = 'updated_at') THEN
      COMMENT ON COLUMN carts.updated_at IS 'Timestamp when the cart was last updated | الطابع الزمني عند آخر تحديث للسلة';
    END IF;
  END IF;
  
  -- code_analysis_results table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'code_analysis_results') THEN
    COMMENT ON TABLE code_analysis_results IS 'Results of code analysis | نتائج تحليل الشفرة';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'code_analysis_results' AND column_name = 'id') THEN
      COMMENT ON COLUMN code_analysis_results.id IS 'Unique identifier for the analysis result | معرف فريد لنتيجة التحليل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'code_analysis_results' AND column_name = 'project_id') THEN
      COMMENT ON COLUMN code_analysis_results.project_id IS 'ID of the project being analyzed | معرف المشروع الذي يتم تحليله';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'code_analysis_results' AND column_name = 'analysis_data') THEN
      COMMENT ON COLUMN code_analysis_results.analysis_data IS 'Data from the code analysis | بيانات من تحليل الشفرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'code_analysis_results' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN code_analysis_results.created_at IS 'Timestamp when the analysis was performed | الطابع الزمني عند إجراء التحليل';
    END IF;
  END IF;
  
  -- development_roadmaps table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'development_roadmaps') THEN
    COMMENT ON TABLE development_roadmaps IS 'Development roadmaps for projects | خرائط طريق التطوير للمشاريع';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'development_roadmaps' AND column_name = 'id') THEN
      COMMENT ON COLUMN development_roadmaps.id IS 'Unique identifier for the roadmap | معرف فريد لخريطة الطريق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'development_roadmaps' AND column_name = 'name') THEN
      COMMENT ON COLUMN development_roadmaps.name IS 'Name of the roadmap | اسم خريطة الطريق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'development_roadmaps' AND column_name = 'description') THEN
      COMMENT ON COLUMN development_roadmaps.description IS 'Description of the roadmap | وصف خريطة الطريق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'development_roadmaps' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN development_roadmaps.created_at IS 'Timestamp when the roadmap was created | الطابع الزمني عند إنشاء خريطة الطريق';
    END IF;
  END IF;
  
  -- doc_feedback table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'doc_feedback') THEN
    COMMENT ON TABLE doc_feedback IS 'Feedback on documentation | التعليقات على الوثائق';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'doc_feedback' AND column_name = 'id') THEN
      COMMENT ON COLUMN doc_feedback.id IS 'Unique identifier for the feedback | معرف فريد للتعليق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'doc_feedback' AND column_name = 'doc_id') THEN
      COMMENT ON COLUMN doc_feedback.doc_id IS 'ID of the documentation being rated | معرف الوثيقة التي يتم تقييمها';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'doc_feedback' AND column_name = 'rating') THEN
      COMMENT ON COLUMN doc_feedback.rating IS 'Rating given to the documentation | التقييم المعطى للوثيقة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'doc_feedback' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN doc_feedback.created_at IS 'Timestamp when the feedback was submitted | الطابع الزمني عند تقديم التعليق';
    END IF;
  END IF;
  
  -- docs table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'docs') THEN
    COMMENT ON TABLE docs IS 'Documentation articles | مقالات التوثيق';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'id') THEN
      COMMENT ON COLUMN docs.id IS 'Unique identifier for the documentation article | معرف فريد لمقالة التوثيق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'title') THEN
      COMMENT ON COLUMN docs.title IS 'Title of the documentation article | عنوان مقالة التوثيق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'content') THEN
      COMMENT ON COLUMN docs.content IS 'Content of the documentation article | محتوى مقالة التوثيق';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'docs' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN docs.created_at IS 'Timestamp when the article was created | الطابع الزمني عند إنشاء المقالة';
    END IF;
  END IF;
  
  -- module_integrations table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'module_integrations') THEN
    COMMENT ON TABLE module_integrations IS 'Integrations between different modules | التكاملات بين الوحدات المختلفة';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'id') THEN
      COMMENT ON COLUMN module_integrations.id IS 'Unique identifier for the integration | معرف فريد للتكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'source_module_id') THEN
      COMMENT ON COLUMN module_integrations.source_module_id IS 'ID of the source module | معرف الوحدة المصدر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'source_module_name') THEN
      COMMENT ON COLUMN module_integrations.source_module_name IS 'Name of the source module | اسم الوحدة المصدر';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'target_module_id') THEN
      COMMENT ON COLUMN module_integrations.target_module_id IS 'ID of the target module | معرف الوحدة الهدف';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'target_module_name') THEN
      COMMENT ON COLUMN module_integrations.target_module_name IS 'Name of the target module | اسم الوحدة الهدف';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'integration_type') THEN
      COMMENT ON COLUMN module_integrations.integration_type IS 'Type of integration | نوع التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'integration_details') THEN
      COMMENT ON COLUMN module_integrations.integration_details IS 'Details of the integration | تفاصيل التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'status') THEN
      COMMENT ON COLUMN module_integrations.status IS 'Status of the integration | حالة التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN module_integrations.created_at IS 'Timestamp when the integration was created | الطابع الزمني عند إنشاء التكامل';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'updated_at') THEN
      COMMENT ON COLUMN module_integrations.updated_at IS 'Timestamp when the integration was last updated | الطابع الزمني عند آخر تحديث للتكامل';
    END IF;
  END IF;
  
  -- orders table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'orders') THEN
    COMMENT ON TABLE orders IS 'Customer orders with status and details | طلبات العملاء مع الحالة والتفاصيل';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'id') THEN
      COMMENT ON COLUMN orders.id IS 'Unique identifier for the order | معرف فريد للطلب';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN orders.user_id IS 'ID of the user who placed the order | معرف المستخدم الذي قدم الطلب';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'status') THEN
      COMMENT ON COLUMN orders.status IS 'Current status of the order | الحالة الحالية للطلب';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'total') THEN
      COMMENT ON COLUMN orders.total IS 'Total amount of the order | المبلغ الإجمالي للطلب';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN orders.created_at IS 'Timestamp when the order was created | الطابع الزمني عند إنشاء الطلب';
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
      COMMENT ON COLUMN products.image_url IS 'URL to the product image | رابط صورة المنتج';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN products.created_at IS 'Timestamp when the product was created | الطابع الزمني عند إنشاء المنتج';
    END IF;
  END IF;
  
  -- invoices table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'invoices') THEN
    COMMENT ON TABLE invoices IS 'Invoices for customer purchases | فواتير مشتريات العملاء';
    
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
      COMMENT ON COLUMN invoices.status IS 'Status of the invoice (draft, sent, paid, overdue) | حالة الفاتورة (مسودة، مرسلة، مدفوعة، متأخرة)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'due_date') THEN
      COMMENT ON COLUMN invoices.due_date IS 'Due date for payment | تاريخ استحقاق الدفع';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invoices' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN invoices.created_at IS 'Timestamp when the invoice was created | الطابع الزمني عند إنشاء الفاتورة';
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
  
END;
$$;