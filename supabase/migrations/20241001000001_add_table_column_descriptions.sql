-- Add descriptions to tables and columns in English and Arabic

-- Module Integrations Table
COMMENT ON TABLE module_integrations IS 'Stores connections between different modules in the system | يخزن الروابط بين الوحدات المختلفة في النظام';
COMMENT ON COLUMN module_integrations.id IS 'Unique identifier for the integration | المعرف الفريد للتكامل';
COMMENT ON COLUMN module_integrations.source_module_id IS 'ID of the source module | معرف الوحدة المصدر';
COMMENT ON COLUMN module_integrations.source_module_name IS 'Name of the source module | اسم الوحدة المصدر';
COMMENT ON COLUMN module_integrations.target_module_id IS 'ID of the target module | معرف الوحدة الهدف';
COMMENT ON COLUMN module_integrations.target_module_name IS 'Name of the target module | اسم الوحدة الهدف';
COMMENT ON COLUMN module_integrations.integration_type IS 'Type of integration (data, navigation, workflow, notification) | نوع التكامل (بيانات، تنقل، سير العمل، إشعارات)';
COMMENT ON COLUMN module_integrations.integration_details IS 'JSON details specific to the integration | تفاصيل JSON خاصة بالتكامل';
COMMENT ON COLUMN module_integrations.status IS 'Status of the integration (active, inactive, pending) | حالة التكامل (نشط، غير نشط، قيد الانتظار)';
COMMENT ON COLUMN module_integrations.created_at IS 'Timestamp when the integration was created | الطابع الزمني عند إنشاء التكامل';
COMMENT ON COLUMN module_integrations.updated_at IS 'Timestamp when the integration was last updated | الطابع الزمني عند آخر تحديث للتكامل';

-- Project Roadmaps Table
COMMENT ON TABLE project_roadmaps IS 'Stores development roadmaps for projects | يخزن خرائط طريق التطوير للمشاريع';
COMMENT ON COLUMN project_roadmaps.id IS 'Unique identifier for the roadmap | المعرف الفريد لخريطة الطريق';
COMMENT ON COLUMN project_roadmaps.name IS 'Name of the roadmap | اسم خريطة الطريق';
COMMENT ON COLUMN project_roadmaps.description IS 'Description of the roadmap | وصف خريطة الطريق';
COMMENT ON COLUMN project_roadmaps.content IS 'JSON content of the roadmap | محتوى JSON لخريطة الطريق';
COMMENT ON COLUMN project_roadmaps.status IS 'Status of the roadmap (draft, active, completed, archived) | حالة خريطة الطريق (مسودة، نشطة، مكتملة، مؤرشفة)';
COMMENT ON COLUMN project_roadmaps.created_by IS 'User ID who created the roadmap | معرف المستخدم الذي أنشأ خريطة الطريق';
COMMENT ON COLUMN project_roadmaps.created_at IS 'Timestamp when the roadmap was created | الطابع الزمني عند إنشاء خريطة الطريق';
COMMENT ON COLUMN project_roadmaps.updated_at IS 'Timestamp when the roadmap was last updated | الطابع الزمني عند آخر تحديث لخريطة الطريق';

-- Roadmap Integration Table
COMMENT ON TABLE roadmap_integration IS 'Connects roadmaps with module integrations | يربط خرائط الطريق مع تكاملات الوحدات';
COMMENT ON COLUMN roadmap_integration.id IS 'Unique identifier for the roadmap integration | المعرف الفريد لتكامل خريطة الطريق';
COMMENT ON COLUMN roadmap_integration.roadmap_id IS 'Reference to the project roadmap | إشارة إلى خريطة طريق المشروع';
COMMENT ON COLUMN roadmap_integration.module_integration_id IS 'Reference to the module integration | إشارة إلى تكامل الوحدة';
COMMENT ON COLUMN roadmap_integration.integration_type IS 'Type of integration between roadmap and module | نوع التكامل بين خريطة الطريق والوحدة';
COMMENT ON COLUMN roadmap_integration.status IS 'Status of the integration (planned, in_progress, completed) | حالة التكامل (مخطط، قيد التنفيذ، مكتمل)';
COMMENT ON COLUMN roadmap_integration.created_at IS 'Timestamp when the integration was created | الطابع الزمني عند إنشاء التكامل';
COMMENT ON COLUMN roadmap_integration.updated_at IS 'Timestamp when the integration was last updated | الطابع الزمني عند آخر تحديث للتكامل';

-- Roadmap Analytics Table
COMMENT ON TABLE roadmap_analytics IS 'Stores analytics data for roadmaps | يخزن بيانات التحليلات لخرائط الطريق';
COMMENT ON COLUMN roadmap_analytics.id IS 'Unique identifier for the analytics entry | المعرف الفريد لإدخال التحليلات';
COMMENT ON COLUMN roadmap_analytics.roadmap_id IS 'Reference to the project roadmap | إشارة إلى خريطة طريق المشروع';
COMMENT ON COLUMN roadmap_analytics.metric_type IS 'Type of metric being tracked | نوع المقياس الذي يتم تتبعه';
COMMENT ON COLUMN roadmap_analytics.metric_value IS 'Value of the metric | قيمة المقياس';
COMMENT ON COLUMN roadmap_analytics.timestamp IS 'Timestamp when the metric was recorded | الطابع الزمني عند تسجيل المقياس';
COMMENT ON COLUMN roadmap_analytics.created_at IS 'Timestamp when the analytics entry was created | الطابع الزمني عند إنشاء إدخال التحليلات';

-- Project Analysis Tables
COMMENT ON TABLE project_analysis IS 'Stores analysis data for projects | يخزن بيانات التحليل للمشاريع';
COMMENT ON COLUMN project_analysis.id IS 'Unique identifier for the analysis | المعرف الفريد للتحليل';
COMMENT ON COLUMN project_analysis.project_name IS 'Name of the analyzed project | اسم المشروع المحلل';
COMMENT ON COLUMN project_analysis.analysis_type IS 'Type of analysis performed | نوع التحليل المنفذ';
COMMENT ON COLUMN project_analysis.analysis_data IS 'JSON data containing the analysis results | بيانات JSON تحتوي على نتائج التحليل';
COMMENT ON COLUMN project_analysis.created_by IS 'User ID who created the analysis | معرف المستخدم الذي أنشأ التحليل';
COMMENT ON COLUMN project_analysis.created_at IS 'Timestamp when the analysis was created | الطابع الزمني عند إنشاء التحليل';
COMMENT ON COLUMN project_analysis.updated_at IS 'Timestamp when the analysis was last updated | الطابع الزمني عند آخر تحديث للتحليل';

-- User Roles Table
COMMENT ON TABLE user_roles IS 'Stores user role assignments | يخزن تعيينات أدوار المستخدمين';
COMMENT ON COLUMN user_roles.id IS 'Unique identifier for the role assignment | المعرف الفريد لتعيين الدور';
COMMENT ON COLUMN user_roles.user_id IS 'Reference to the user | إشارة إلى المستخدم';
COMMENT ON COLUMN user_roles.role IS 'Role assigned to the user | الدور المعين للمستخدم';
COMMENT ON COLUMN user_roles.created_at IS 'Timestamp when the role was assigned | الطابع الزمني عند تعيين الدور';

-- Products Table
COMMENT ON TABLE products IS 'Stores product information | يخزن معلومات المنتجات';
COMMENT ON COLUMN products.id IS 'Unique identifier for the product | المعرف الفريد للمنتج';
COMMENT ON COLUMN products.name IS 'Name of the product | اسم المنتج';
COMMENT ON COLUMN products.description IS 'Description of the product | وصف المنتج';
COMMENT ON COLUMN products.price IS 'Price of the product | سعر المنتج';
COMMENT ON COLUMN products.image_url IS 'URL to the product image | رابط صورة المنتج';
COMMENT ON COLUMN products.category IS 'Category of the product | فئة المنتج';
COMMENT ON COLUMN products.created_at IS 'Timestamp when the product was created | الطابع الزمني عند إنشاء المنتج';
COMMENT ON COLUMN products.updated_at IS 'Timestamp when the product was last updated | الطابع الزمني عند آخر تحديث للمنتج';

-- Invoices Table
COMMENT ON TABLE invoices IS 'Stores invoice information | يخزن معلومات الفواتير';
COMMENT ON COLUMN invoices.id IS 'Unique identifier for the invoice | المعرف الفريد للفاتورة';
COMMENT ON COLUMN invoices.customer_id IS 'Reference to the customer | إشارة إلى العميل';
COMMENT ON COLUMN invoices.amount IS 'Total amount of the invoice | المبلغ الإجمالي للفاتورة';
COMMENT ON COLUMN invoices.status IS 'Status of the invoice (draft, sent, paid, overdue) | حالة الفاتورة (مسودة، مرسلة، مدفوعة، متأخرة)';
COMMENT ON COLUMN invoices.due_date IS 'Due date for payment | تاريخ استحقاق الدفع';
COMMENT ON COLUMN invoices.items IS 'JSON array of invoice items | مصفوفة JSON لعناصر الفاتورة';
COMMENT ON COLUMN invoices.created_at IS 'Timestamp when the invoice was created | الطابع الزمني عند إنشاء الفاتورة';
COMMENT ON COLUMN invoices.updated_at IS 'Timestamp when the invoice was last updated | الطابع الزمني عند آخر تحديث للفاتورة';

-- User Feedback Table
COMMENT ON TABLE user_feedback IS 'Stores user feedback | يخزن ملاحظات المستخدمين';
COMMENT ON COLUMN user_feedback.id IS 'Unique identifier for the feedback | المعرف الفريد للملاحظات';
COMMENT ON COLUMN user_feedback.user_id IS 'Reference to the user | إشارة إلى المستخدم';
COMMENT ON COLUMN user_feedback.feedback_type IS 'Type of feedback | نوع الملاحظات';
COMMENT ON COLUMN user_feedback.content IS 'Content of the feedback | محتوى الملاحظات';
COMMENT ON COLUMN user_feedback.rating IS 'Rating given by the user | التقييم المقدم من المستخدم';
COMMENT ON COLUMN user_feedback.created_at IS 'Timestamp when the feedback was submitted | الطابع الزمني عند تقديم الملاحظات';

-- FAQs Table
COMMENT ON TABLE faqs IS 'Stores frequently asked questions | يخزن الأسئلة المتكررة';
COMMENT ON COLUMN faqs.id IS 'Unique identifier for the FAQ | المعرف الفريد للسؤال المتكرر';
COMMENT ON COLUMN faqs.question IS 'The question | السؤال';
COMMENT ON COLUMN faqs.answer IS 'The answer to the question | الإجابة على السؤال';
COMMENT ON COLUMN faqs.category IS 'Category of the FAQ | فئة السؤال المتكرر';
COMMENT ON COLUMN faqs.created_at IS 'Timestamp when the FAQ was created | الطابع الزمني عند إنشاء السؤال المتكرر';
COMMENT ON COLUMN faqs.updated_at IS 'Timestamp when the FAQ was last updated | الطابع الزمني عند آخر تحديث للسؤال المتكرر';

-- Docs Table
COMMENT ON TABLE docs IS 'Stores documentation | يخزن الوثائق';
COMMENT ON COLUMN docs.id IS 'Unique identifier for the document | المعرف الفريد للوثيقة';
COMMENT ON COLUMN docs.title IS 'Title of the document | عنوان الوثيقة';
COMMENT ON COLUMN docs.content IS 'Content of the document | محتوى الوثيقة';
COMMENT ON COLUMN docs.category IS 'Category of the document | فئة الوثيقة';
COMMENT ON COLUMN docs.created_at IS 'Timestamp when the document was created | الطابع الزمني عند إنشاء الوثيقة';
COMMENT ON COLUMN docs.updated_at IS 'Timestamp when the document was last updated | الطابع الزمني عند آخر تحديث للوثيقة';

-- AI Help Logs Table
COMMENT ON TABLE ai_help_logs IS 'Stores logs of AI assistance | يخزن سجلات المساعدة بالذكاء الاصطناعي';
COMMENT ON COLUMN ai_help_logs.id IS 'Unique identifier for the log entry | المعرف الفريد لإدخال السجل';
COMMENT ON COLUMN ai_help_logs.user_id IS 'Reference to the user | إشارة إلى المستخدم';
COMMENT ON COLUMN ai_help_logs.query IS 'User query to the AI | استعلام المستخدم للذكاء الاصطناعي';
COMMENT ON COLUMN ai_help_logs.response IS 'AI response to the query | استجابة الذكاء الاصطناعي للاستعلام';
COMMENT ON COLUMN ai_help_logs.module IS 'Module where the interaction occurred | الوحدة التي حدث فيها التفاعل';
COMMENT ON COLUMN ai_help_logs.created_at IS 'Timestamp when the interaction occurred | الطابع الزمني عند حدوث التفاعل';

-- Test Logs Table
COMMENT ON TABLE test_logs IS 'Stores test execution logs | يخزن سجلات تنفيذ الاختبارات';
COMMENT ON COLUMN test_logs.id IS 'Unique identifier for the test log | المعرف الفريد لسجل الاختبار';
COMMENT ON COLUMN test_logs.test_name IS 'Name of the test | اسم الاختبار';
COMMENT ON COLUMN test_logs.status IS 'Status of the test (passed, failed) | حالة الاختبار (ناجح، فاشل)';
COMMENT ON COLUMN test_logs.duration IS 'Duration of the test in milliseconds | مدة الاختبار بالميلي ثانية';
COMMENT ON COLUMN test_logs.error_message IS 'Error message if the test failed | رسالة الخطأ إذا فشل الاختبار';
COMMENT ON COLUMN test_logs.created_at IS 'Timestamp when the test was executed | الطابع الزمني عند تنفيذ الاختبار';

-- FAQ Feedback Table
COMMENT ON TABLE faq_feedback IS 'Stores feedback on FAQs | يخزن الملاحظات على الأسئلة المتكررة';
COMMENT ON COLUMN faq_feedback.id IS 'Unique identifier for the feedback | المعرف الفريد للملاحظات';
COMMENT ON COLUMN faq_feedback.faq_id IS 'Reference to the FAQ | إشارة إلى السؤال المتكرر';
COMMENT ON COLUMN faq_feedback.user_id IS 'Reference to the user | إشارة إلى المستخدم';
COMMENT ON COLUMN faq_feedback.helpful IS 'Whether the FAQ was helpful | ما إذا كان السؤال المتكرر مفيدًا';
COMMENT ON COLUMN faq_feedback.comment IS 'Optional comment on the FAQ | تعليق اختياري على السؤال المتكرر';
COMMENT ON COLUMN faq_feedback.created_at IS 'Timestamp when the feedback was submitted | الطابع الزمني عند تقديم الملاحظات';

-- User Analytics Tables
COMMENT ON TABLE user_analytics IS 'Stores user analytics data | يخزن بيانات تحليلات المستخدم';
COMMENT ON COLUMN user_analytics.id IS 'Unique identifier for the analytics entry | المعرف الفريد لإدخال التحليلات';
COMMENT ON COLUMN user_analytics.user_id IS 'Reference to the user | إشارة إلى المستخدم';
COMMENT ON COLUMN user_analytics.event_type IS 'Type of event | نوع الحدث';
COMMENT ON COLUMN user_analytics.event_data IS 'JSON data about the event | بيانات JSON حول الحدث';
COMMENT ON COLUMN user_analytics.module IS 'Module where the event occurred | الوحدة التي حدث فيها الحدث';
COMMENT ON COLUMN user_analytics.created_at IS 'Timestamp when the event occurred | الطابع الزمني عند حدوث الحدث';

-- Code Analysis Tables
COMMENT ON TABLE code_analysis IS 'Stores code analysis results | يخزن نتائج تحليل الكود';
COMMENT ON COLUMN code_analysis.id IS 'Unique identifier for the analysis | المعرف الفريد للتحليل';
COMMENT ON COLUMN code_analysis.project_id IS 'Reference to the project | إشارة إلى المشروع';
COMMENT ON COLUMN code_analysis.file_path IS 'Path to the analyzed file | مسار الملف المحلل';
COMMENT ON COLUMN code_analysis.analysis_type IS 'Type of analysis performed | نوع التحليل المنفذ';
COMMENT ON COLUMN code_analysis.results IS 'JSON results of the analysis | نتائج JSON للتحليل';
COMMENT ON COLUMN code_analysis.created_at IS 'Timestamp when the analysis was performed | الطابع الزمني عند إجراء التحليل';

-- Homepage Layouts Table
COMMENT ON TABLE homepage_layouts IS 'Stores homepage layout configurations | يخزن تكوينات تخطيط الصفحة الرئيسية';
COMMENT ON COLUMN homepage_layouts.id IS 'Unique identifier for the layout | المعرف الفريد للتخطيط';
COMMENT ON COLUMN homepage_layouts.name IS 'Name of the layout | اسم التخطيط';
COMMENT ON COLUMN homepage_layouts.layout_data IS 'JSON data defining the layout | بيانات JSON تحدد التخطيط';
COMMENT ON COLUMN homepage_layouts.is_active IS 'Whether the layout is currently active | ما إذا كان التخطيط نشطًا حاليًا';
COMMENT ON COLUMN homepage_layouts.created_at IS 'Timestamp when the layout was created | الطابع الزمني عند إنشاء التخطيط';
COMMENT ON COLUMN homepage_layouts.updated_at IS 'Timestamp when the layout was last updated | الطابع الزمني عند آخر تحديث للتخطيط';
