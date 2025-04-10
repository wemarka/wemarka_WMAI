-- Create FAQs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row-level security
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DROP POLICY IF EXISTS "Public read access" ON faqs;
CREATE POLICY "Public read access"
  ON faqs FOR SELECT
  USING (true);

-- Add some sample data
INSERT INTO faqs (question, answer, category, lang) VALUES
('How do I create a new account?', 'To create a new account, click the "Register" button in the top right corner of the screen. You''ll need to provide your email, create a password, and fill in your basic profile information.', 'account', 'en'),
('How do I reset my password?', 'To reset your password, click the "Forgot Password" link on the login page. An email will be sent to you with instructions on how to reset your password.', 'account', 'en'),
('How do I add a new product to my store?', 'To add a new product, go to the "Store" section in the dashboard, then click on "Product Manager". Click the "Add New Product" button and fill in the required details such as name, description, price, and images.', 'store', 'en'),
('How do I create a new marketing campaign?', 'To create a new marketing campaign, go to the "Marketing" section in the dashboard, then click on "Campaign Manager". Click the "Create New Campaign" button and follow the steps to define your target audience, budget, and content.', 'marketing', 'en'),
('How do I create a new invoice?', 'To create a new invoice, go to the "Accounting" section in the dashboard, then click on "Invoices". Click the "Create New Invoice" button and add customer details, products or services, and prices.', 'accounting', 'en'),
('How do I respond to customer messages?', 'To respond to customer messages, go to the "Customer Service" or "Inbox" section in the dashboard. You''ll find all incoming messages sorted by date. Click on a message to open it and reply.', 'customer-service', 'en'),
('What is the AI assistant and how can I use it?', 'The AI assistant is an AI-powered tool that helps you with various tasks across the system. You can access it by clicking the sparkle button in the bottom right corner of any screen. It can help you generate content, analyze data, suggest actions, and answer questions.', 'general', 'en'),
('How can I customize my dashboard?', 'To customize your dashboard, click the "Settings" button in the sidebar, then choose "Customize Dashboard". You can add or remove widgets, change their order, and customize colors and appearance.', 'general', 'en'),

-- Arabic translations
('كيف يمكنني إنشاء حساب جديد؟', 'لإنشاء حساب جديد، انقر على زر "تسجيل" في الزاوية العلوية اليمنى من الشاشة. ستحتاج إلى تقديم بريدك الإلكتروني وإنشاء كلمة مرور وملء معلومات ملفك الشخصية الأساسية.', 'account', 'ar'),
('كيف يمكنني إعادة تعيين كلمة المرور الخاصة بي؟', 'لإعادة تعيين كلمة المرور الخاصة بك، انقر على رابط "نسيت كلمة المرور" في صفحة تسجيل الدخول. سيتم إرسال بريد إلكتروني إليك مع تعليمات حول كيفية إعادة تعيين كلمة المرور الخاصة بك.', 'account', 'ar'),
('كيف يمكنني إضافة منتج جديد إلى متجري؟', 'لإضافة منتج جديد، انتقل إلى قسم "المتجر" في لوحة القيادة، ثم انقر على "إدارة المنتجات". انقر على زر "إضافة منتج جديد" وقم بملء التفاصيل المطلوبة مثل الاسم والوصف والسعر والصور.', 'store', 'ar'),
('كيف يمكنني إنشاء حملة تسويقية جديدة؟', 'لإنشاء حملة تسويقية جديدة، انتقل إلى قسم "التسويق" في لوحة القيادة، ثم انقر على "إدارة الحملات". انقر على زر "إنشاء حملة جديدة" واتبع الخطوات لتحديد الجمهور المستهدف والميزانية والمحتوى.', 'marketing', 'ar'),
('كيف يمكنني إنشاء فاتورة جديدة؟', 'لإنشاء فاتورة جديدة، انتقل إلى قسم "المحاسبة" في لوحة القيادة، ثم انقر على "الفواتير". انقر على زر "إنشاء فاتورة جديدة" وأضف تفاصيل العميل والمنتجات أو الخدمات والأسعار.', 'accounting', 'ar'),
('كيف يمكنني الرد على رسائل العملاء؟', 'للرد على رسائل العملاء، انتقل إلى قسم "خدمة العملاء" أو "صندوق الوارد" في لوحة القيادة. ستجد جميع الرسائل الواردة مرتبة حسب التاريخ. انقر على رسالة لفتحها والرد عليها.', 'customer-service', 'ar'),
('ما هو مساعد الذكاء الاصطناعي وكيف يمكنني استخدامه؟', 'مساعد الذكاء الاصطناعي هو أداة مدعومة بالذكاء الاصطناعي تساعدك في مختلف المهام عبر النظام. يمكنك الوصول إليه بالنقر على زر الشرارة في الزاوية السفلية اليمنى من أي شاشة. يمكنه مساعدتك في إنشاء المحتوى، وتحليل البيانات، واقتراح الإجراءات، والإجابة على الأسئلة.', 'general', 'ar'),
('كيف يمكنني تخصيص لوحة القيادة الخاصة بي؟', 'لتخصيص لوحة القيادة الخاصة بك، انقر على زر "الإعدادات" في الشريط الجانبي، ثم اختر "تخصيص لوحة القيادة". يمكنك إضافة أو إزالة الأدوات، وتغيير ترتيبها، وتخصيص الألوان والمظهر.', 'general', 'ar');

-- Enable realtime for this table
alter publication supabase_realtime add table faqs;
