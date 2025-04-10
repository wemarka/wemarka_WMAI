import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";
import { Progress } from "@/frontend/components/ui/progress";
import {
  HelpCircle,
  Search,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  getSupportAnalytics,
  getMockSupportAnalytics,
} from "@/frontend/services/faqService";
import { SupportAnalytics } from "@/frontend/types/faq";

interface HelpCenterDashboardProps {
  initialTab?: string;
}

const HelpCenterDashboard: React.FC<HelpCenterDashboardProps> = ({
  initialTab = "overview",
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [analytics, setAnalytics] = useState<SupportAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a production environment, we would use the real data
      // const data = await getSupportAnalytics();

      // For development/demo, use mock data
      const data = getMockSupportAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching support analytics:", err);
      setError(
        isRTL
          ? "حدث خطأ أثناء جلب بيانات التحليلات. يرجى المحاولة مرة أخرى."
          : "An error occurred while fetching analytics data. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total feedback responses
  const totalFeedbackCount =
    analytics?.feedbackByRating?.reduce((sum, item) => sum + item.count, 0) ||
    0;

  return (
    <ModuleLayout
      moduleName={isRTL ? "تحليلات الدعم" : "Support Analytics"}
      breadcrumbItems={[
        {
          label: isRTL ? "مركز المساعدة" : "Help Center",
          path: "/dashboard/help-center",
          icon: <HelpCircle className="h-3.5 w-3.5" />,
        },
        {
          label: isRTL ? "تحليلات الدعم" : "Support Analytics",
          path: "/dashboard/help-center/analytics",
          icon: <BarChart3 className="h-3.5 w-3.5" />,
        },
      ]}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {isRTL ? "تحليلات الدعم" : "Support Analytics"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL
                ? "نظرة عامة على أداء مركز المساعدة والدعم"
                : "Overview of help center and support performance"}
            </p>
          </div>
          <Button
            onClick={fetchAnalytics}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isRTL ? "تحديث البيانات" : "Refresh Data"}
          </Button>
        </div>

        {error ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{error}</h3>
                  <Button onClick={fetchAnalytics}>
                    {isRTL ? "إعادة المحاولة" : "Try Again"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span className="text-lg">
                  {isRTL ? "جاري تحميل البيانات..." : "Loading data..."}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total FAQs Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? "إجمالي الأسئلة الشائعة" : "Total FAQs"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {analytics?.totalFAQs}
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <HelpCircle className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isRTL
                      ? "عبر جميع الفئات واللغات"
                      : "Across all categories and languages"}
                  </p>
                </CardContent>
              </Card>

              {/* Active Searches Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? "عمليات البحث النشطة" : "Active Searches"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {analytics?.activeSearches}
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isRTL ? "في آخر 30 يومًا" : "In the last 30 days"}
                  </p>
                </CardContent>
              </Card>

              {/* Feedback Responses Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? "ردود الملاحظات" : "Feedback Responses"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {analytics?.feedbackResponses}
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <ThumbsUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isRTL ? "معدل الرضا 4.2/5" : "Satisfaction rate 4.2/5"}
                  </p>
                </CardContent>
              </Card>

              {/* Unanswered Questions Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {isRTL ? "أسئلة بدون إجابة" : "Unanswered Questions"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {analytics?.unansweredQuestions}
                    </div>
                    <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                      <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isRTL ? "تحتاج إلى مراجعة" : "Require review"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Searches by Day Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    {isRTL ? "عمليات البحث حسب اليوم" : "Searches by Day"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "آخر 14 يومًا" : "Last 14 days"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-2">
                    {analytics?.searchesByDay?.map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="bg-primary/80 hover:bg-primary w-8 rounded-t-md transition-all"
                          style={{ height: `${(item.count / 50) * 200}px` }}
                        ></div>
                        <span className="text-xs text-muted-foreground mt-2">
                          {new Date(item.date).toLocaleDateString(undefined, {
                            day: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feedback by Rating Chart */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    {isRTL ? "الملاحظات حسب التقييم" : "Feedback by Rating"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL
                      ? "توزيع تقييمات المستخدمين"
                      : "Distribution of user ratings"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.feedbackByRating?.map((item) => (
                      <div key={item.rating} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">
                              {item.rating} ★
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {item.count} {isRTL ? "تقييمات" : "ratings"}
                            </span>
                          </div>
                          <span className="text-sm font-medium">
                            {totalFeedbackCount > 0
                              ? `${Math.round((item.count / totalFeedbackCount) * 100)}%`
                              : "0%"}
                          </span>
                        </div>
                        <Progress
                          value={
                            totalFeedbackCount > 0
                              ? (item.count / totalFeedbackCount) * 100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Search Terms */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    {isRTL ? "أكثر مصطلحات البحث شيوعًا" : "Top Search Terms"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL ? "المصطلحات الأكثر بحثًا" : "Most searched terms"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topSearchTerms?.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="w-6 h-6 flex items-center justify-center p-0"
                          >
                            {index + 1}
                          </Badge>
                          <span className="font-medium">{item.term}</span>
                        </div>
                        <Badge variant="secondary">{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>
                    {isRTL ? "توزيع الفئات" : "Category Distribution"}
                  </CardTitle>
                  <CardDescription>
                    {isRTL
                      ? "عدد الأسئلة الشائعة حسب الفئة"
                      : "Number of FAQs by category"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.categoryDistribution?.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.category}</span>
                          <span className="text-sm">{item.count} FAQs</span>
                        </div>
                        <Progress
                          value={
                            analytics.totalFAQs > 0
                              ? (item.count / analytics.totalFAQs) * 100
                              : 0
                          }
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </ModuleLayout>
  );
};

export default HelpCenterDashboard;
