import React, { useState, useEffect } from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAuth } from "@/frontend/contexts/AuthContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { AIActionButton } from "@/frontend/modules/ai";
import AIAssistantPanel from "@/frontend/modules/ai/AIAssistantPanel";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import WidgetGrid from "./WidgetGrid";
import QuickStats from "./QuickStats";
import RecentActivity from "./RecentActivity";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Toaster } from "@/frontend/components/ui/toast";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  ShoppingBag,
  CreditCard,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  Sparkles,
  Bell,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  RefreshCw,
  ChevronRight,
  PieChart,
  Target,
  Search,
} from "lucide-react";

interface DashboardModuleCard {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const MainDashboard: React.FC = () => {
  const { direction } = useLanguage();
  const { user } = useAuth();
  const { promptAIAssistant, isAIAssistantOpen, closeAIAssistant } = useAI();
  const { toast } = useToast();
  const rtl = direction === "rtl";
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredModules, setFilteredModules] = useState<DashboardModuleCard[]>(
    [],
  );
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const displayName = user?.user_metadata?.full_name || "User";

  const dashboardModules: DashboardModuleCard[] = [
    {
      title: "Store",
      titleAr: "المتجر",
      description: "Manage products, orders, and inventory",
      descriptionAr: "إدارة المنتجات والطلبات والمخزون",
      icon: <ShoppingBag className="h-6 w-6" />,
      path: "/dashboard/store",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      title: "Accounting",
      titleAr: "المحاسبة",
      description: "Track finances, invoices, and expenses",
      descriptionAr: "تتبع الأموال والفواتير والمصروفات",
      icon: <CreditCard className="h-6 w-6" />,
      path: "/dashboard/accounting",
      color:
        "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },
    {
      title: "Marketing",
      titleAr: "التسويق",
      description: "Create campaigns and track performance",
      descriptionAr: "إنشاء الحملات وتتبع الأداء",
      icon: <BarChart3 className="h-6 w-6" />,
      path: "/dashboard/marketing",
      color:
        "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    },
    {
      title: "Inbox",
      titleAr: "البريد الوارد",
      description: "Manage messages from all channels",
      descriptionAr: "إدارة الرسائل من جميع القنوات",
      icon: <MessageSquare className="h-6 w-6" />,
      path: "/dashboard/inbox",
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
    },
    {
      title: "Documents",
      titleAr: "المستندات",
      description: "Create and manage business documents",
      descriptionAr: "إنشاء وإدارة مستندات العمل",
      icon: <FileText className="h-6 w-6" />,
      path: "/dashboard/documents",
      color: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
    },
    {
      title: "Settings",
      titleAr: "الإعدادات",
      description: "Configure system and user preferences",
      descriptionAr: "تكوين تفضيلات النظام والمستخدم",
      icon: <Settings className="h-6 w-6" />,
      path: "/dashboard/settings",
      color: "bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
    },
  ];

  // Filter modules based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredModules(dashboardModules);
      return;
    }

    const filtered = dashboardModules.filter((module) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        module.title.toLowerCase().includes(searchLower) ||
        module.description.toLowerCase().includes(searchLower)
      );
    });

    setFilteredModules(filtered);
  }, [searchQuery, dashboardModules]);

  // Function to handle AI analysis
  const handleAIAnalysis = (
    prompt: string,
    toastTitle: string,
    toastDescription: string,
  ) => {
    setIsAnalyzing(true);
    promptAIAssistant(prompt);
    toast({
      title: toastTitle,
      description: toastDescription,
    });

    // Simulate analysis completion
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastUpdated(new Date());
      toast({
        title: rtl ? "اكتمل التحليل" : "Analysis Complete",
        description: rtl
          ? "تم تحديث البيانات بنجاح"
          : "Data has been successfully updated",
        variant: "success",
      });
    }, 2500);
  };

  // Function to handle AI recommendations
  const handleAIRecommendations = (
    prompt: string,
    toastTitle: string,
    toastDescription: string,
  ) => {
    setIsLoadingRecommendations(true);
    promptAIAssistant(prompt);
    toast({
      title: toastTitle,
      description: toastDescription,
    });

    // Simulate recommendations completion
    setTimeout(() => {
      setIsLoadingRecommendations(false);
      setLastUpdated(new Date());
      toast({
        title: rtl ? "تم تحديث التوصيات" : "Recommendations Updated",
        description: rtl
          ? "تم تحديث التوصيات بنجاح"
          : "Your recommendations have been successfully updated",
        variant: "success",
      });
    }, 3000);
  };

  // Show welcome toast on first load
  useEffect(() => {
    if (showWelcomeMessage) {
      toast({
        title: rtl
          ? "مرحباً بك في لوحة تحكم Wemarka WMAI"
          : "Welcome to Wemarka WMAI Dashboard",
        description: rtl
          ? "تم تحميل البيانات بنجاح. يمكنك استخدام المساعد الذكي بالنقر على زر WMAI"
          : "Your data has been successfully loaded. You can use the AI assistant by clicking the WMAI button",
        duration: 5000,
      });
      setShowWelcomeMessage(false);
    }
  }, [showWelcomeMessage, toast, rtl]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8 relative">
      <div
        className={`fixed top-24 ${rtl ? "left-6" : "right-6"} z-50 transition-all duration-300 transform ${isAIAssistantOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
      >
        {isAIAssistantOpen && (
          <AIAssistantPanel
            onClose={closeAIAssistant}
            currentSystem={rtl ? "لوحة التحكم" : "Dashboard"}
            initialPrompt={
              rtl
                ? "مرحباً، أريد تحليل أداء المبيعات في لوحة التحكم وتقديم توصيات لتحسين الأداء وزيادة المبيعات. ما هي الاتجاهات الحالية وكيف يمكنني تحسين استراتيجيات التسويق؟"
                : "Hello, I'd like to analyze sales performance in the Dashboard and get recommendations for improvement and increasing sales. What are the current trends and how can I improve my marketing strategies?"
            }
          />
        )}
      </div>
      <Toaster />
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">
            {rtl
              ? "مرحباً بك في لوحة تحكم Wemarka WMAI"
              : "Welcome to Wemarka WMAI Dashboard"}
          </h1>
          <div className="text-lg font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-4 py-2 rounded-lg shadow-sm">
            {format(
              currentTime,
              rtl
                ? "EEEE، d MMMM yyyy، h:mm:ss a"
                : "EEEE, d MMMM yyyy, h:mm:ss a",
              {
                locale: rtl ? ar : undefined,
              },
            )}
          </div>
        </div>
        <p className="text-muted-foreground">
          {rtl
            ? `مرحباً ${displayName}، هذه نظرة عامة على أداء عملك.`
            : `Hello ${displayName}, here's an overview of your business performance.`}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={
              rtl ? "البحث في لوحة القيادة..." : "Search dashboard..."
            }
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={() => setSearchQuery("")}
            >
              {rtl ? "مسح" : "Clear"}
            </Button>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {rtl ? "المقاييس الرئيسية" : "Key Metrics"}
          </h2>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {rtl ? "آخر تحديث:" : "Last updated:"}{" "}
              {lastUpdated.toLocaleTimeString()}
            </div>
            <AIActionButton
              onClick={() => {
                promptAIAssistant(
                  "Analyze my current business metrics and provide insights",
                );
              }}
              label={rtl ? "تحليل ذكي" : "AI Analysis"}
              tooltipText={
                rtl
                  ? "تحليل البيانات باستخدام الذكاء الاصطناعي"
                  : "Analyze data with AI"
              }
              variant="outline"
              size="sm"
            />
          </div>
        </div>
        <QuickStats />
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {rtl ? "النشاط الأخير" : "Recent Activity"}
          </h2>
          <div className="flex items-center gap-2">
            <AIActionButton
              onClick={() => {
                promptAIAssistant(
                  "Show me a detailed breakdown of recent activity",
                );
              }}
              label={rtl ? "عرض المزيد" : "View More"}
              tooltipText={
                rtl ? "عرض المزيد من النشاطات" : "View more activities"
              }
              variant="outline"
              size="sm"
            />
          </div>
        </div>
        <RecentActivity />
      </section>

      {/* AI Insights Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {rtl ? "رؤى الذكاء الاصطناعي" : "AI Insights"}
          </h2>
          <div className="flex items-center gap-2">
            <AIActionButton
              onClick={() => {
                promptAIAssistant(
                  "Generate fresh AI insights for my business dashboard",
                );
              }}
              label={rtl ? "تحديث" : "Refresh"}
              tooltipText={rtl ? "تحديث الرؤى" : "Refresh Insights"}
              variant="outline"
              size="sm"
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => {
                promptAIAssistant(
                  "Show me all available AI insights for my business",
                );
              }}
            >
              {rtl ? "عرض الكل" : "View All"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
            <CardHeader className="p-4 pb-2 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                    <Bell className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">
                    {rtl ? "تنبيه المخزون" : "Inventory Alert"}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/50 dark:bg-gray-800/50"
                >
                  {rtl ? "عالي الأهمية" : "High Priority"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                {rtl
                  ? "5 منتجات على وشك النفاد من المخزون. يوصى بإعادة الطلب."
                  : "5 products are running low on inventory. Reorder recommended."}
              </p>
              <AIActionButton
                onClick={() => {
                  promptAIAssistant(
                    "Generate a reorder list for low inventory products",
                  );
                  toast({
                    title: rtl
                      ? "جاري إنشاء قائمة إعادة الطلب"
                      : "Generating Reorder List",
                    description: rtl
                      ? "جاري تحليل المخزون..."
                      : "Analyzing inventory levels...",
                  });
                }}
                label={
                  rtl ? "إنشاء قائمة إعادة الطلب" : "Generate Reorder List"
                }
                variant="outline"
                size="sm"
                tooltipText={
                  rtl
                    ? "إنشاء قائمة بالمنتجات التي تحتاج إعادة طلب"
                    : "Create a list of products that need reordering"
                }
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
            <CardHeader className="p-4 pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">
                    {rtl ? "توقعات المبيعات" : "Sales Forecast"}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/50 dark:bg-gray-800/50"
                >
                  {rtl ? "تحليل ذكي" : "AI Analysis"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                {rtl
                  ? "من المتوقع زيادة المبيعات بنسبة 12٪ في الأسبوع القادم بناءً على اتجاهات الموسم."
                  : "Sales expected to increase by 12% next week based on seasonal trends."}
              </p>
              <AIActionButton
                onClick={() => {
                  promptAIAssistant(
                    "Generate a detailed sales forecast for the next month",
                  );
                  toast({
                    title: rtl
                      ? "جاري إنشاء توقعات مفصلة"
                      : "Generating Detailed Forecast",
                    description: rtl
                      ? "جاري تحليل البيانات..."
                      : "Analyzing sales data...",
                  });
                }}
                label={rtl ? "عرض التفاصيل" : "View Details"}
                variant="outline"
                size="sm"
                tooltipText={
                  rtl
                    ? "عرض توقعات مفصلة للمبيعات"
                    : "View detailed sales forecast"
                }
              />
            </CardContent>
          </Card>

          <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
            <CardHeader className="p-4 pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400">
                    <Target className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">
                    {rtl ? "فرص التحسين" : "Optimization Opportunities"}
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs bg-white/50 dark:bg-gray-800/50"
                >
                  {rtl ? "3 فرص" : "3 Opportunities"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">
                {rtl
                  ? "تم تحديد فرص لتحسين تكاليف التشغيل وكفاءة التسويق."
                  : "Opportunities identified to optimize operational costs and marketing efficiency."}
              </p>
              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span>
                    {rtl
                      ? "تقليل تكاليف الشحن بنسبة 15٪"
                      : "Reduce shipping costs by 15%"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                  <span>
                    {rtl ? "تحسين استهداف الإعلانات" : "Improve ad targeting"}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span>
                    {rtl
                      ? "أتمتة عمليات المخزون"
                      : "Automate inventory processes"}
                  </span>
                </div>
              </div>
              <AIActionButton
                onClick={() => {
                  promptAIAssistant(
                    "Identify optimization opportunities for my business operations",
                  );
                  toast({
                    title: rtl
                      ? "جاري تحليل فرص التحسين"
                      : "Analyzing Optimization Opportunities",
                    description: rtl
                      ? "جاري تحليل العمليات..."
                      : "Analyzing business operations...",
                  });
                }}
                label={rtl ? "استكشاف الفرص" : "Explore Opportunities"}
                variant="outline"
                size="sm"
                tooltipText={
                  rtl
                    ? "استكشاف فرص تحسين العمليات"
                    : "Explore opportunities to optimize operations"
                }
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Business Performance Predictions */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {rtl ? "توقعات أداء الأعمال" : "Business Performance Predictions"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => {
              promptAIAssistant(
                "Generate detailed business performance predictions for the next quarter",
              );
            }}
          >
            {rtl ? "عرض التفاصيل" : "View Details"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="hover">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {rtl ? "توقعات المبيعات" : "Sales Forecast"}
                  </CardTitle>
                  <CardDescription>
                    {rtl ? "الربع القادم" : "Next Quarter"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  +18.5%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {rtl
                    ? "زيادة متوقعة عن الربع السابق"
                    : "Projected increase from previous quarter"}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "المنتجات الرقمية" : "Digital Products"}</span>
                  <span className="font-medium">+24%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "المنتجات المادية" : "Physical Products"}</span>
                  <span className="font-medium">+12%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "الخدمات" : "Services"}</span>
                  <span className="font-medium">+15%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <AIActionButton
                onClick={() => {
                  promptAIAssistant(
                    "Generate detailed sales forecast for the next quarter",
                  );
                }}
                label={rtl ? "تحليل مفصل" : "Detailed Analysis"}
                variant="outline"
                size="sm"
                tooltipText={
                  rtl ? "تحليل مفصل للمبيعات" : "Detailed sales analysis"
                }
              />
            </CardFooter>
          </Card>

          <Card variant="hover">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {rtl ? "نمو العملاء" : "Customer Growth"}
                  </CardTitle>
                  <CardDescription>
                    {rtl ? "90 يوم القادمة" : "Next 90 Days"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  +22%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {rtl ? "معدل نمو قاعدة العملاء" : "Customer base growth rate"}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "عملاء جدد" : "New Customers"}</span>
                  <span className="font-medium">+245</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "معدل الاحتفاظ" : "Retention Rate"}</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "متوسط قيمة الطلب" : "Avg. Order Value"}</span>
                  <span className="font-medium">+8%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <AIActionButton
                onClick={() => {
                  promptAIAssistant(
                    "Generate customer growth strategies for the next quarter",
                  );
                }}
                label={rtl ? "استراتيجيات النمو" : "Growth Strategies"}
                variant="outline"
                size="sm"
                tooltipText={
                  rtl
                    ? "استراتيجيات لنمو العملاء"
                    : "Customer growth strategies"
                }
              />
            </CardFooter>
          </Card>

          <Card variant="hover">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    {rtl ? "كفاءة التشغيل" : "Operational Efficiency"}
                  </CardTitle>
                  <CardDescription>
                    {rtl ? "توقعات التحسين" : "Improvement Forecast"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  +31%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {rtl
                    ? "تحسين الكفاءة المتوقع"
                    : "Projected efficiency improvement"}
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "وقت المعالجة" : "Processing Time"}</span>
                  <span className="font-medium">-35%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "تكاليف التشغيل" : "Operating Costs"}</span>
                  <span className="font-medium">-18%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>{rtl ? "رضا العملاء" : "Customer Satisfaction"}</span>
                  <span className="font-medium">+15%</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <AIActionButton
                onClick={() => {
                  promptAIAssistant(
                    "Generate operational efficiency improvement plan",
                  );
                }}
                label={rtl ? "خطة التحسين" : "Improvement Plan"}
                variant="outline"
                size="sm"
                tooltipText={
                  rtl
                    ? "خطة لتحسين كفاءة العمليات"
                    : "Operational efficiency improvement plan"
                }
              />
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {rtl ? "توصيات الذكاء الاصطناعي" : "AI Recommendations"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            disabled={isLoadingRecommendations}
            onClick={() => {
              handleAIRecommendations(
                "Generate personalized business recommendations based on my data",
                rtl ? "جاري إنشاء توصيات" : "Generating Recommendations",
                rtl
                  ? "جاري تحليل بيانات عملك..."
                  : "Analyzing your business data...",
              );
            }}
          >
            {rtl ? "عرض المزيد" : "View More"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <Card className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-200">
          <CardHeader className="p-4 pb-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-800/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">
                  {rtl ? "توصيات مخصصة" : "Personalized Recommendations"}
                </CardTitle>
              </div>
              <Badge
                variant="outline"
                className="text-xs bg-white/50 dark:bg-gray-800/50"
              >
                {rtl ? "مدعوم بالذكاء الاصطناعي" : "AI Powered"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {isLoadingRecommendations ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  {rtl
                    ? "جاري تحليل بيانات عملك..."
                    : "Analyzing your business data..."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-blue-100 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-900/10">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 mt-0.5">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        {rtl ? "زيادة المبيعات" : "Increase Sales"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {rtl
                          ? "تحليل البيانات يشير إلى أن تقديم خصم 10٪ على المنتجات الرقمية قد يزيد المبيعات بنسبة 25٪."
                          : "Data analysis suggests offering a 10% discount on digital products could increase sales by 25%."}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-1"
                        onClick={() => {
                          promptAIAssistant(
                            "Generate a detailed plan for implementing a 10% discount on digital products",
                          );
                        }}
                      >
                        {rtl ? "عرض التفاصيل" : "View Details"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-green-100 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400 mt-0.5">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        {rtl
                          ? "تحسين تجربة العملاء"
                          : "Improve Customer Experience"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {rtl
                          ? "إضافة نظام مكافآت للعملاء المتكررين يمكن أن يزيد معدل الاحتفاظ بالعملاء بنسبة 30٪."
                          : "Adding a rewards system for repeat customers could increase customer retention by 30%."}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-1"
                        onClick={() => {
                          promptAIAssistant(
                            "Design a customer rewards system for my business",
                          );
                        }}
                      >
                        {rtl ? "عرض التفاصيل" : "View Details"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-purple-100 bg-purple-50 dark:border-purple-900/30 dark:bg-purple-900/10">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400 mt-0.5">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        {rtl ? "تحسين كفاءة التشغيل" : "Optimize Operations"}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {rtl
                          ? "أتمتة عمليات إدارة المخزون يمكن أن توفر 15 ساعة أسبوعياً وتقلل الأخطاء بنسبة 40٪."
                          : "Automating inventory management processes could save 15 hours weekly and reduce errors by 40%."}
                      </p>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 mt-1"
                        onClick={() => {
                          promptAIAssistant(
                            "Create an automation plan for inventory management",
                          );
                        }}
                      >
                        {rtl ? "عرض التفاصيل" : "View Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <AIActionButton
              onClick={() => {
                handleAIRecommendations(
                  "Generate new personalized business recommendations based on my current data",
                  rtl
                    ? "جاري إنشاء توصيات جديدة"
                    : "Generating New Recommendations",
                  rtl
                    ? "جاري تحليل بيانات عملك..."
                    : "Analyzing your business data...",
                );
              }}
              label={
                isLoadingRecommendations
                  ? rtl
                    ? "جاري التحليل..."
                    : "Analyzing..."
                  : rtl
                    ? "تحديث التوصيات"
                    : "Refresh Recommendations"
              }
              variant="outline"
              size="sm"
              disabled={isLoadingRecommendations}
              tooltipText={
                rtl
                  ? "الحصول على توصيات جديدة بناءً على بياناتك الحالية"
                  : "Get fresh recommendations based on your current data"
              }
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default MainDashboard;
