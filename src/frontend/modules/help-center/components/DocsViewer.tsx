import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Button } from "@/frontend/components/ui/button";
import {
  ChevronRight,
  BookOpen,
  FileText,
  Layers,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { getAllDocs, getDocCategories } from "@/frontend/services/docsService";
import { Doc, DocCategory } from "@/frontend/types/docs";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface DocsViewerProps {
  searchQuery?: string;
  initialDocId?: string;
}

const DocsViewer: React.FC<DocsViewerProps> = ({
  searchQuery = "",
  initialDocId,
}) => {
  const { direction, language } = useLanguage();
  const isRTL = direction === "rtl";
  const currentLang = isRTL ? "ar" : "en";

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(
    initialDocId || null,
  );
  const [filteredDocs, setFilteredDocs] = useState<Doc[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [categories, setCategories] = useState<DocCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch docs and categories from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch docs
        const docsData = await getAllDocs(currentLang);
        setDocs(docsData);

        // Fetch unique categories
        const categoryIds = await getDocCategories(currentLang);

        // Create category objects with icons
        const categoryObjects: DocCategory[] = categoryIds.map((id) => ({
          id,
          name: getCategoryName(id, isRTL),
          icon: getCategoryIcon(id),
        }));

        setCategories(categoryObjects);

        // Set default active category if none is selected
        if (!activeCategory && categoryObjects.length > 0) {
          setActiveCategory(categoryObjects[0].id);
        }
      } catch (err) {
        console.error("Error fetching documentation data:", err);
        setError(
          isRTL
            ? "حدث خطأ أثناء تحميل الوثائق. يرجى المحاولة مرة أخرى لاحقًا."
            : "An error occurred while loading documentation. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentLang, isRTL, activeCategory]);

  // Helper function to get localized category names
  const getCategoryName = (categoryId: string, isRTL: boolean): string => {
    const categoryMap: Record<string, { en: string; ar: string }> = {
      "getting-started": { en: "Getting Started", ar: "البدء" },
      "how-to": { en: "How-to Guides", ar: "كيفية" },
      features: { en: "Features", ar: "الميزات" },
      tutorials: { en: "Tutorials", ar: "دروس" },
      api: { en: "API Reference", ar: "مرجع API" },
      troubleshooting: {
        en: "Troubleshooting",
        ar: "استكشاف الأخطاء وإصلاحها",
      },
    };

    return categoryMap[categoryId]
      ? isRTL
        ? categoryMap[categoryId].ar
        : categoryMap[categoryId].en
      : categoryId; // Fallback to the ID if no mapping exists
  };

  // Helper function to get category icons
  const getCategoryIcon = (categoryId: string): React.ReactNode => {
    const iconMap: Record<string, React.ReactNode> = {
      "getting-started": <BookOpen className="h-4 w-4" />,
      "how-to": <FileText className="h-4 w-4" />,
      features: <Layers className="h-4 w-4" />,
      tutorials: <FileText className="h-4 w-4" />,
      api: <FileText className="h-4 w-4" />,
      troubleshooting: <AlertCircle className="h-4 w-4" />,
    };

    return iconMap[categoryId] || <FileText className="h-4 w-4" />;
  };

  // Mock documentation data for development/testing
  // This will be removed once the Supabase integration is complete
  const mockDocs: Doc[] = [
    {
      id: "doc-1",
      title: isRTL ? "مقدمة إلى Wemarka WMAI" : "Introduction to Wemarka WMAI",
      description: isRTL
        ? "نظرة عامة على النظام وميزاته الرئيسية"
        : "An overview of the system and its key features",
      category: "getting-started",
      content: isRTL
        ? `<h1>مرحبًا بك في Wemarka WMAI</h1>
          <p>Wemarka WMAI هو نظام تشغيل أعمال موحد مدعوم بالذكاء الاصطناعي، مصمم لمساعدتك في إدارة جميع جوانب عملك من منصة واحدة.</p>
          <h2>الميزات الرئيسية</h2>
          <ul>
            <li><strong>لوحة القيادة الموحدة:</strong> عرض شامل لجميع أنشطة عملك في مكان واحد.</li>
            <li><strong>مساعد الذكاء الاصطناعي:</strong> مساعد ذكي متاح في كل وحدة لمساعدتك في المهام والتحليلات.</li>
            <li><strong>إدارة المتجر:</strong> إدارة المنتجات والمخزون والطلبات بسهولة.</li>
            <li><strong>المحاسبة الذكية:</strong> تتبع الفواتير والمصروفات والتقارير المالية.</li>
            <li><strong>مركز التسويق:</strong> إنشاء وإدارة الحملات التسويقية عبر منصات متعددة.</li>
            <li><strong>صندوق الوارد الموحد:</strong> إدارة جميع اتصالات العملاء في مكان واحد.</li>
          </ul>
          <p>استكشف الأدلة الأخرى لمعرفة المزيد حول كيفية استخدام كل ميزة.</p>`
        : `<h1>Welcome to Wemarka WMAI</h1>
          <p>Wemarka WMAI is an AI-powered unified business operating system designed to help you manage all aspects of your business from a single platform.</p>
          <h2>Key Features</h2>
          <ul>
            <li><strong>Unified Dashboard:</strong> A comprehensive view of all your business activities in one place.</li>
            <li><strong>AI Assistant:</strong> An intelligent assistant available in every module to help you with tasks and analytics.</li>
            <li><strong>Store Management:</strong> Manage products, inventory, and orders with ease.</li>
            <li><strong>Smart Accounting:</strong> Track invoices, expenses, and financial reports.</li>
            <li><strong>Marketing Hub:</strong> Create and manage marketing campaigns across multiple platforms.</li>
            <li><strong>Unified Inbox:</strong> Manage all customer communications in one place.</li>
          </ul>
          <p>Explore the other guides to learn more about how to use each feature.</p>`,
    },
    {
      id: "doc-2",
      title: isRTL ? "إعداد حسابك" : "Setting Up Your Account",
      description: isRTL
        ? "خطوات لإعداد حسابك وتخصيصه"
        : "Steps to set up and customize your account",
      category: "getting-started",
      content: isRTL
        ? `<h1>إعداد حسابك</h1>
          <p>اتبع هذه الخطوات لإعداد حسابك في Wemarka WMAI:</p>
          <h2>1. إنشاء حساب</h2>
          <p>انقر على زر "تسجيل" وأدخل معلوماتك الأساسية مثل الاسم والبريد الإلكتروني وكلمة المرور.</p>
          <h2>2. إكمال ملفك الشخصي</h2>
          <p>أضف معلومات شركتك، بما في ذلك الاسم والشعار وتفاصيل الاتصال.</p>
          <h2>3. تكوين الإعدادات</h2>
          <p>قم بتخصيص إعدادات النظام الخاصة بك، مثل العملة والمنطقة الزمنية واللغة.</p>
          <h2>4. دعوة أعضاء الفريق</h2>
          <p>أضف أعضاء فريقك وقم بتعيين الأدوار والأذونات المناسبة.</p>
          <h2>5. استكشاف النظام</h2>
          <p>خذ جولة في النظام للتعرف على الميزات المختلفة والوحدات المتاحة.</p>`
        : `<h1>Setting Up Your Account</h1>
          <p>Follow these steps to set up your account in Wemarka WMAI:</p>
          <h2>1. Create an Account</h2>
          <p>Click the "Register" button and enter your basic information such as name, email, and password.</p>
          <h2>2. Complete Your Profile</h2>
          <p>Add your company information, including name, logo, and contact details.</p>
          <h2>3. Configure Settings</h2>
          <p>Customize your system settings, such as currency, timezone, and language.</p>
          <h2>4. Invite Team Members</h2>
          <p>Add your team members and assign appropriate roles and permissions.</p>
          <h2>5. Explore the System</h2>
          <p>Take a tour of the system to familiarize yourself with the different features and modules available.</p>`,
    },
    {
      id: "doc-3",
      title: isRTL ? "إدارة المنتجات" : "Managing Products",
      description: isRTL
        ? "كيفية إضافة وتحرير وتنظيم المنتجات في متجرك"
        : "How to add, edit, and organize products in your store",
      category: "how-to",
      content: isRTL
        ? `<h1>إدارة المنتجات</h1>
          <p>تعلم كيفية إدارة المنتجات في متجرك:</p>
          <h2>إضافة منتج جديد</h2>
          <ol>
            <li>انتقل إلى قسم "المتجر" في لوحة القيادة.</li>
            <li>انقر على "إدارة المنتجات".</li>
            <li>انقر على زر "إضافة منتج جديد".</li>
            <li>أدخل تفاصيل المنتج مثل الاسم والوصف والسعر.</li>
            <li>قم بتحميل صور المنتج.</li>
            <li>حدد الفئة والعلامات ذات الصلة.</li>
            <li>قم بتكوين خيارات المنتج (إذا كانت متوفرة).</li>
            <li>حدد حالة المخزون والكمية.</li>
            <li>انقر على "حفظ" لإضافة المنتج.</li>
          </ol>
          <h2>تحرير منتج موجود</h2>
          <ol>
            <li>ابحث عن المنتج في قائمة المنتجات.</li>
            <li>انقر على زر "تحرير" بجوار المنتج.</li>
            <li>قم بتحديث التفاصيل حسب الحاجة.</li>
            <li>انقر على "حفظ التغييرات".</li>
          </ol>
          <h2>تنظيم المنتجات في فئات</h2>
          <ol>
            <li>انتقل إلى قسم "الفئات" في إدارة المنتجات.</li>
            <li>أنشئ فئات وفئات فرعية جديدة حسب الحاجة.</li>
            <li>قم بتعيين المنتجات إلى الفئات المناسبة.</li>
          </ol>`
        : `<h1>Managing Products</h1>
          <p>Learn how to manage products in your store:</p>
          <h2>Adding a New Product</h2>
          <ol>
            <li>Go to the "Store" section in the dashboard.</li>
            <li>Click on "Product Manager".</li>
            <li>Click the "Add New Product" button.</li>
            <li>Enter product details such as name, description, and price.</li>
            <li>Upload product images.</li>
            <li>Select the category and relevant tags.</li>
            <li>Configure product options (if available).</li>
            <li>Set inventory status and quantity.</li>
            <li>Click "Save" to add the product.</li>
          </ol>
          <h2>Editing an Existing Product</h2>
          <ol>
            <li>Find the product in the product list.</li>
            <li>Click the "Edit" button next to the product.</li>
            <li>Update the details as needed.</li>
            <li>Click "Save Changes".</li>
          </ol>
          <h2>Organizing Products into Categories</h2>
          <ol>
            <li>Go to the "Categories" section in the Product Manager.</li>
            <li>Create new categories and subcategories as needed.</li>
            <li>Assign products to the appropriate categories.</li>
          </ol>`,
    },
    {
      id: "doc-4",
      title: isRTL ? "إنشاء حملة تسويقية" : "Creating a Marketing Campaign",
      description: isRTL
        ? "دليل خطوة بخطوة لإنشاء وإدارة الحملات التسويقية"
        : "Step-by-step guide to creating and managing marketing campaigns",
      category: "how-to",
      content: isRTL
        ? `<h1>إنشاء حملة تسويقية</h1>
          <p>اتبع هذا الدليل لإنشاء حملة تسويقية فعالة:</p>
          <h2>1. تحديد أهداف الحملة</h2>
          <p>حدد بوضوح ما تريد تحقيقه من الحملة (زيادة المبيعات، زيادة الوعي بالعلامة التجارية، إلخ).</p>
          <h2>2. تحديد الجمهور المستهدف</h2>
          <p>حدد من تريد الوصول إليه بناءً على الديموغرافيا والاهتمامات والسلوك.</p>
          <h2>3. اختيار قنوات التسويق</h2>
          <p>حدد المنصات التي ستستخدمها (وسائل التواصل الاجتماعي، البريد الإلكتروني، الإعلانات المدفوعة، إلخ).</p>
          <h2>4. إنشاء المحتوى</h2>
          <p>قم بإنشاء محتوى جذاب يتوافق مع أهدافك وجمهورك. استخدم مساعد الذكاء الاصطناعي للحصول على اقتراحات.</p>
          <h2>5. تحديد الميزانية والجدول الزمني</h2>
          <p>حدد ميزانيتك وحدد متى ستبدأ الحملة ومتى ستنتهي.</p>
          <h2>6. إطلاق الحملة</h2>
          <p>قم بتنفيذ الحملة عبر القنوات المختارة.</p>
          <h2>7. مراقبة الأداء</h2>
          <p>تتبع مقاييس الأداء الرئيسية وقم بإجراء تعديلات حسب الحاجة.</p>
          <h2>8. تحليل النتائج</h2>
          <p>بعد انتهاء الحملة، قم بتحليل النتائج لتحديد ما نجح وما يمكن تحسينه في المستقبل.</p>`
        : `<h1>Creating a Marketing Campaign</h1>
          <p>Follow this guide to create an effective marketing campaign:</p>
          <h2>1. Define Campaign Objectives</h2>
          <p>Clearly define what you want to achieve with the campaign (increase sales, raise brand awareness, etc.).</p>
          <h2>2. Identify Target Audience</h2>
          <p>Determine who you want to reach based on demographics, interests, and behavior.</p>
          <h2>3. Choose Marketing Channels</h2>
          <p>Select the platforms you'll use (social media, email, paid ads, etc.).</p>
          <h2>4. Create Content</h2>
          <p>Develop engaging content that aligns with your objectives and audience. Use the AI assistant for suggestions.</p>
          <h2>5. Set Budget and Timeline</h2>
          <p>Determine your budget and define when the campaign will start and end.</p>
          <h2>6. Launch the Campaign</h2>
          <p>Execute the campaign across your chosen channels.</p>
          <h2>7. Monitor Performance</h2>
          <p>Track key performance metrics and make adjustments as needed.</p>
          <h2>8. Analyze Results</h2>
          <p>After the campaign ends, analyze the results to determine what worked and what can be improved in the future.</p>`,
    },
    {
      id: "doc-5",
      title: isRTL
        ? "استخدام مساعد الذكاء الاصطناعي"
        : "Using the AI Assistant",
      description: isRTL
        ? "كيفية الاستفادة من مساعد الذكاء الاصطناعي في مختلف الوحدات"
        : "How to leverage the AI assistant across different modules",
      category: "features",
      content: isRTL
        ? `<h1>استخدام مساعد الذكاء الاصطناعي</h1>
          <p>مساعد الذكاء الاصطناعي هو أداة قوية يمكنها مساعدتك في مختلف المهام عبر النظام. إليك كيفية استخدامه بفعالية:</p>
          <h2>الوصول إلى المساعد</h2>
          <p>يمكنك الوصول إلى مساعد الذكاء الاصطناعي بالنقر على زر الشرارة في الزاوية السفلية اليمنى من أي شاشة.</p>
          <h2>طرح الأسئلة</h2>
          <p>يمكنك طرح أسئلة بلغة طبيعية حول أي جانب من جوانب النظام أو عملك.</p>
          <h2>إنشاء المحتوى</h2>
          <p>اطلب من المساعد إنشاء محتوى مثل أوصاف المنتجات، ورسائل البريد الإلكتروني التسويقية، ومنشورات وسائل التواصل الاجتماعي.</p>
          <h2>تحليل البيانات</h2>
          <p>اطلب من المساعد تحليل بياناتك وتقديم رؤى حول الأداء والاتجاهات.</p>
          <h2>اقتراحات الإجراءات</h2>
          <p>سيقدم المساعد اقتراحات استباقية بناءً على بياناتك وسلوكك في النظام.</p>
          <h2>المساعدة السياقية</h2>
          <p>يدرك المساعد الوحدة التي تستخدمها حاليًا ويقدم مساعدة مخصصة بناءً على ذلك.</p>
          <h2>أمثلة على الاستخدام</h2>
          <ul>
            <li><strong>في المتجر:</strong> "اقترح أوصاف منتجات لمجموعة الصيف الجديدة"</li>
            <li><strong>في التسويق:</strong> "أنشئ حملة بريد إلكتروني للعملاء غير النشطين"</li>
            <li><strong>في المحاسبة:</strong> "حلل مصروفاتي للربع الأخير وحدد مجالات خفض التكاليف"</li>
            <li><strong>في التحليلات:</strong> "لخص اتجاهات المبيعات للأشهر الثلاثة الماضية"</li>
          </ul>`
        : `<h1>Using the AI Assistant</h1>
          <p>The AI assistant is a powerful tool that can help you with various tasks across the system. Here's how to use it effectively:</p>
          <h2>Accessing the Assistant</h2>
          <p>You can access the AI assistant by clicking the sparkle button in the bottom right corner of any screen.</p>
          <h2>Asking Questions</h2>
          <p>You can ask natural language questions about any aspect of the system or your business.</p>
          <h2>Generating Content</h2>
          <p>Ask the assistant to generate content such as product descriptions, marketing emails, and social media posts.</p>
          <h2>Analyzing Data</h2>
          <p>Ask the assistant to analyze your data and provide insights on performance and trends.</p>
          <h2>Action Suggestions</h2>
          <p>The assistant will provide proactive suggestions based on your data and behavior in the system.</p>
          <h2>Contextual Help</h2>
          <p>The assistant is aware of the module you're currently using and provides tailored assistance based on that.</p>
          <h2>Usage Examples</h2>
          <ul>
            <li><strong>In Store:</strong> "Suggest product descriptions for the new summer collection"</li>
            <li><strong>In Marketing:</strong> "Create an email campaign for inactive customers"</li>
            <li><strong>In Accounting:</strong> "Analyze my expenses for the last quarter and identify areas for cost reduction"</li>
            <li><strong>In Analytics:</strong> "Summarize sales trends for the past three months"</li>
          </ul>`,
    },
    {
      id: "doc-6",
      title: isRTL ? "إدارة صندوق الوارد الموحد" : "Managing the Unified Inbox",
      description: isRTL
        ? "كيفية التعامل مع رسائل العملاء من مصادر متعددة"
        : "How to handle customer messages from multiple sources",
      category: "features",
      content: isRTL
        ? `<h1>إدارة صندوق الوارد الموحد</h1>
          <p>صندوق الوارد الموحد يجمع جميع اتصالات العملاء في مكان واحد. إليك كيفية استخدامه بفعالية:</p>
          <h2>فهم صندوق الوارد الموحد</h2>
          <p>يجمع صندوق الوارد الموحد الرسائل من:</p>
          <ul>
            <li>البريد الإلكتروني</li>
            <li>واتساب</li>
            <li>فيسبوك ماسنجر</li>
            <li>انستغرام</li>
            <li>الدردشة المباشرة على موقعك</li>
          </ul>
          <h2>الرد على الرسائل</h2>
          <ol>
            <li>انقر على رسالة لفتحها.</li>
            <li>اقرأ سجل المحادثة الكامل.</li>
            <li>اكتب ردك في مربع النص.</li>
            <li>انقر على "إرسال" لإرسال ردك عبر نفس القناة التي وردت منها الرسالة.</li>
          </ol>
          <h2>تعيين الرسائل</h2>
          <p>يمكنك تعيين الرسائل إلى أعضاء فريقك:</p>
          <ol>
            <li>افتح الرسالة.</li>
            <li>انقر على قائمة "تعيين إلى".</li>
            <li>اختر عضو الفريق المناسب.</li>
          </ol>
          <h2>استخدام العلامات والتصنيفات</h2>
          <p>نظم الرسائل باستخدام العلامات والتصنيفات:</p>
          <ol>
            <li>افتح الرسالة.</li>
            <li>انقر على "إضافة علامة".</li>
            <li>اختر علامة موجودة أو أنشئ علامة جديدة.</li>
          </ol>
          <h2>استخدام الردود المعدة مسبقًا</h2>
          <p>وفر الوقت باستخدام الردود المعدة مسبقًا:</p>
          <ol>
            <li>انقر على زر "الردود المعدة مسبقًا".</li>
            <li>اختر رد من القائمة.</li>
            <li>قم بتخصيص الرد حسب الحاجة.</li>
            <li>انقر على "إرسال".</li>
          </ol>
          <h2>استخدام مساعد الذكاء الاصطناعي</h2>
          <p>اطلب من مساعد الذكاء الاصطناعي المساعدة في صياغة الردود أو تلخيص المحادثات.</p>`
        : `<h1>Managing the Unified Inbox</h1>
          <p>The unified inbox brings all customer communications into one place. Here's how to use it effectively:</p>
          <h2>Understanding the Unified Inbox</h2>
          <p>The unified inbox collects messages from:</p>
          <ul>
            <li>Email</li>
            <li>WhatsApp</li>
            <li>Facebook Messenger</li>
            <li>Instagram</li>
            <li>Live chat on your website</li>
          </ul>
          <h2>Responding to Messages</h2>
          <ol>
            <li>Click on a message to open it.</li>
            <li>Read the full conversation history.</li>
            <li>Type your response in the text box.</li>
            <li>Click "Send" to send your reply through the same channel the message came from.</li>
          </ol>
          <h2>Assigning Messages</h2>
          <p>You can assign messages to your team members:</p>
          <ol>
            <li>Open the message.</li>
            <li>Click on the "Assign to" dropdown.</li>
            <li>Select the appropriate team member.</li>
          </ol>
          <h2>Using Tags and Categories</h2>
          <p>Organize messages using tags and categories:</p>
          <ol>
            <li>Open the message.</li>
            <li>Click on "Add tag".</li>
            <li>Choose an existing tag or create a new one.</li>
          </ol>
          <h2>Using Canned Responses</h2>
          <p>Save time by using canned responses:</p>
          <ol>
            <li>Click on the "Canned Responses" button.</li>
            <li>Select a response from the list.</li>
            <li>Customize the response as needed.</li>
            <li>Click "Send".</li>
          </ol>
          <h2>Using the AI Assistant</h2>
          <p>Ask the AI assistant to help draft responses or summarize conversations.</p>`,
    },
  ];

  // Filter docs based on search query and active category
  useEffect(() => {
    if (docs.length === 0) return;

    let filtered = docs;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(lowerCaseQuery) ||
          (doc.description &&
            doc.description.toLowerCase().includes(lowerCaseQuery)) ||
          doc.content.toLowerCase().includes(lowerCaseQuery),
      );
    }

    if (activeCategory) {
      filtered = filtered.filter((doc) => doc.category === activeCategory);
    }

    setFilteredDocs(filtered);

    // If we have an initialDocId, make sure it's selected
    if (initialDocId && !activeDocId) {
      setActiveDocId(initialDocId);
    }

    // If we have filtered docs but no active doc, select the first one
    if (filtered.length > 0 && !activeDocId) {
      setActiveDocId(filtered[0].id);
    }
  }, [searchQuery, activeCategory, docs, initialDocId, activeDocId]);

  // Get the active doc
  const activeDoc = docs.find((doc) => doc.id === activeDocId);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">
          {isRTL ? "جاري التحميل..." : "Loading..."}
        </span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {isRTL ? "حدث خطأ" : "Error"}
        </h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>{isRTL ? "الأدلة" : "Guides"}</CardTitle>
            <CardDescription>
              {isRTL ? "استكشف أدلة المساعدة" : "Explore help guides"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs
              defaultValue={activeCategory}
              onValueChange={setActiveCategory}
              className="w-full"
            >
              <TabsList
                className="grid w-full"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(categories.length, 3)}, 1fr)`,
                }}
              >
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    {category.icon}
                    <span className="hidden sm:inline">{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent
                  key={category.id}
                  value={category.id}
                  className="m-0"
                >
                  <ScrollArea className="h-[60vh]">
                    <div className="space-y-1 p-2">
                      {filteredDocs
                        .filter((doc) => doc.category === category.id)
                        .map((doc) => (
                          <Button
                            key={doc.id}
                            variant={
                              activeDocId === doc.id ? "default" : "ghost"
                            }
                            className={`w-full justify-start text-left h-auto py-3 ${isRTL ? "text-right" : "text-left"}`}
                            onClick={() => setActiveDocId(doc.id)}
                          >
                            <div>
                              <div className="font-medium">{doc.title}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {doc.description}
                              </div>
                            </div>
                            <ChevronRight
                              className={`ml-auto h-4 w-4 ${isRTL ? "rotate-180" : ""}`}
                            />
                          </Button>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="md:col-span-2">
        <Card className="h-full">
          {activeDoc ? (
            <>
              <CardHeader>
                <CardTitle>{activeDoc.title}</CardTitle>
                <CardDescription>{activeDoc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh]">
                  <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw, rehypeSanitize]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {activeDoc.content}
                    </ReactMarkdown>
                  </div>
                </ScrollArea>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {isRTL ? "لم يتم العثور على أدلة" : "No guides found"}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL
                    ? "حاول استخدام كلمات مفتاحية مختلفة أو تصفح فئة أخرى"
                    : "Try using different keywords or browse another category"}
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DocsViewer;
