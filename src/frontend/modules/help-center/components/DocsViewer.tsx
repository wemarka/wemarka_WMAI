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
import {
  getAllDocs,
  getDocCategories,
  submitDocFeedback,
} from "@/frontend/services/docsService";
import { Doc, DocCategory, DocFeedback } from "@/frontend/types/docs";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import FeedbackButtons from "@/frontend/components/help-center/FeedbackButtons";

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
  }, [currentLang, isRTL]);

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

  // Use mock docs as fallback if the API call fails
  const getMockDocs = (): Doc[] => {
    return [
      {
        id: "doc-1",
        title: isRTL
          ? "مقدمة إلى Wemarka WMAI"
          : "Introduction to Wemarka WMAI",
        description: isRTL
          ? "نظرة عامة على النظام وميزاته الرئيسية"
          : "An overview of the system and its key features",
        category: "getting-started",
        lang: currentLang,
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
      // Additional mock docs would be here
    ];
  };

  // Handle category change
  useEffect(() => {
    const fetchCategoryDocs = async () => {
      if (!activeCategory) return;

      setIsLoading(true);
      setError(null);
      try {
        // Fetch docs by category
        const categoryDocs = await getDocsByCategory(
          activeCategory,
          currentLang,
        );
        setDocs(categoryDocs);
      } catch (err) {
        console.error("Error fetching docs by category:", err);
        setError(
          isRTL
            ? "حدث خطأ أثناء تحميل الوثائق. يرجى المحاولة مرة أخرى لاحقًا."
            : "An error occurred while loading documentation. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (activeCategory) {
      fetchCategoryDocs();
    }
  }, [activeCategory, currentLang, isRTL]);

  // Filter docs based on search query
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

    setFilteredDocs(filtered);

    // If we have an initialDocId, make sure it's selected
    if (initialDocId && !activeDocId) {
      setActiveDocId(initialDocId);
    }

    // If we have filtered docs but no active doc, select the first one
    if (filtered.length > 0 && !activeDocId) {
      setActiveDocId(filtered[0].id);
    }
  }, [searchQuery, docs, initialDocId, activeDocId]);

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
                  {activeDoc && (
                    <FeedbackButtons
                      itemId={activeDoc.id}
                      itemType="doc"
                      onSubmitFeedback={async (helpful, comment) => {
                        const feedback: DocFeedback = {
                          doc_id: activeDoc.id,
                          helpful,
                          comment,
                        };
                        await submitDocFeedback(feedback);
                      }}
                      className="mt-8"
                    />
                  )}
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
