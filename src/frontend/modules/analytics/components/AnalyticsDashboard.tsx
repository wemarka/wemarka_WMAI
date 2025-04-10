import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  PercentIcon,
  Loader2,
} from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  getAnalyticsSummary,
  getMockAnalyticsData,
} from "@/frontend/services/analyticsService";
import { AnalyticsSummary } from "@/frontend/types/analytics";
import WeeklySalesChart from "./WeeklySalesChart";
import TicketDistributionChart from "./TicketDistributionChart";
import StatCard from "./StatCard";

interface AnalyticsDashboardProps {
  isRTL?: boolean;
}

const AnalyticsDashboard = ({ isRTL = false }: AnalyticsDashboardProps) => {
  const { direction, language } = useLanguage();
  const rtl = isRTL || direction === "rtl";

  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a production environment, we would use the real data
        // const data = await getAnalyticsSummary();

        // For development/demo, use mock data
        const data = getMockAnalyticsData();
        setAnalyticsData(data);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError(
          rtl
            ? "حدث خطأ أثناء جلب بيانات التحليلات. يرجى المحاولة مرة أخرى."
            : "An error occurred while fetching analytics data. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [rtl]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format time (seconds to minutes and seconds)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <ModuleLayout moduleName={rtl ? "التحليلات" : "Analytics"}>
        <div className="h-full flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">
              {rtl ? "جاري تحميل البيانات..." : "Loading data..."}
            </p>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout moduleName={rtl ? "التحليلات" : "Analytics"}>
        <div className="h-full flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{error}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout moduleName={rtl ? "التحليلات" : "Analytics"}>
      <div className="h-full bg-background">
        <div className="overflow-auto p-6">
          <h1 className="text-2xl font-bold mb-4">
            {rtl ? "لوحة التحليلات" : "Analytics Dashboard"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {rtl
              ? "نظرة عامة على أداء الأعمال والمبيعات والمستخدمين"
              : "Overview of business performance, sales, and user metrics"}
          </p>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title={rtl ? "الإيرادات الشهرية" : "Monthly Revenue"}
              value={formatCurrency(analyticsData?.monthlyRevenue || 0)}
              description={
                rtl ? "إجمالي المبيعات هذا الشهر" : "Total sales this month"
              }
              icon={<DollarSign className="h-5 w-5 text-primary" />}
              trend={{ value: 12.5, isPositive: true }}
            />

            <StatCard
              title={rtl ? "معدل التحويل" : "Conversion Rate"}
              value={`${(analyticsData?.conversionRate || 0).toFixed(2)}%`}
              description={
                rtl
                  ? "نسبة الزيارات التي تحولت إلى مبيعات"
                  : "Percentage of visits resulting in sales"
              }
              icon={<PercentIcon className="h-5 w-5 text-primary" />}
              trend={{ value: 3.2, isPositive: true }}
            />

            <StatCard
              title={rtl ? "متوسط وقت الجلسة" : "Avg. Session Time"}
              value={formatTime(analyticsData?.avgSessionTime || 0)}
              description={
                rtl
                  ? "المدة التي يقضيها المستخدمون في الموقع"
                  : "Time users spend on site"
              }
              icon={<Clock className="h-5 w-5 text-primary" />}
              trend={{ value: 1.8, isPositive: false }}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <WeeklySalesChart data={analyticsData?.salesData || []} />
            <TicketDistributionChart data={analyticsData?.ticketData || []} />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {rtl ? "المستخدمون النشطون" : "Active Users"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {analyticsData?.usersData[
                      analyticsData.usersData.length - 1
                    ]?.user_count || 0}
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {rtl ? "اليوم" : "Today"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {rtl ? "متوسط قيمة الطلب" : "Avg. Order Value"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {formatCurrency(
                      analyticsData?.salesData[
                        analyticsData.salesData.length - 1
                      ]?.avg_order_value || 0,
                    )}
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {rtl ? "اليوم" : "Today"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {rtl ? "عدد الطلبات" : "Order Count"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {analyticsData?.salesData[
                      analyticsData.salesData.length - 1
                    ]?.order_count || 0}
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {rtl ? "اليوم" : "Today"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {rtl ? "معدل حل التذاكر" : "Ticket Resolution Rate"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">
                    {`${(
                      analyticsData?.ticketData.reduce(
                        (sum, ticket) => sum + ticket.resolution_rate,
                        0,
                      ) / (analyticsData?.ticketData.length || 1)
                    ).toFixed(1)}%`}
                  </div>
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                    <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {rtl ? "متوسط جميع الفئات" : "Average across all categories"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default AnalyticsDashboard;
