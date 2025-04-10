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
import { Button } from "@/frontend/components/ui/button";
import { Progress } from "@/frontend/components/ui/progress";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Activity,
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  UserCircle,
  MousePointer,
  Smartphone,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { getUserAnalytics } from "@/frontend/services/analyticsService";
import { UserAnalytics } from "@/frontend/types/analytics";

interface UserAnalyticsDashboardProps {
  isRTL?: boolean;
}

const UserAnalyticsDashboard: React.FC<UserAnalyticsDashboardProps> = ({
  isRTL = false,
}) => {
  const { direction } = useLanguage();
  const effectiveRTL = isRTL || direction === "rtl";

  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");

  // Date range for filtering
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to 30 days ago
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  // Update date range when the dateRange selector changes
  useEffect(() => {
    const now = new Date();
    const start = new Date();

    if (dateRange === "7d") {
      start.setDate(now.getDate() - 7);
    } else if (dateRange === "30d") {
      start.setDate(now.getDate() - 30);
    } else if (dateRange === "90d") {
      start.setDate(now.getDate() - 90);
    }

    setStartDate(start);
    setEndDate(now);
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserAnalytics(startDate, endDate);
      setAnalytics(data);
    } catch (err) {
      console.error("Error fetching user analytics:", err);
      setError(
        effectiveRTL
          ? "حدث خطأ أثناء جلب بيانات تحليلات المستخدم. يرجى المحاولة مرة أخرى."
          : "An error occurred while fetching user analytics data. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // COLORS for charts
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  // Export data as JSON
  const handleExportData = () => {
    if (!analytics) return;

    const dataStr = JSON.stringify(analytics, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `user-analytics-${startDate.toISOString().slice(0, 10)}-to-${endDate.toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <ModuleLayout
      moduleName={effectiveRTL ? "تحليلات المستخدم" : "User Analytics"}
      breadcrumbItems={[
        {
          label: effectiveRTL ? "لوحة التحكم" : "Dashboard",
          path: "/dashboard",
          icon: <Activity className="h-3.5 w-3.5" />,
        },
        {
          label: effectiveRTL ? "تحليلات المستخدم" : "User Analytics",
          path: "/dashboard/admin/user-analytics",
          icon: <Users className="h-3.5 w-3.5" />,
        },
      ]}
    >
      <div className="container mx-auto p-6 bg-background">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {effectiveRTL ? "تحليلات المستخدم" : "User Analytics"}
            </h1>
            <p className="text-muted-foreground">
              {effectiveRTL
                ? "تحليل سلوك المستخدم واستخدام النظام"
                : "Analyze user behavior and system usage"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={dateRange}
              onValueChange={(value) =>
                setDateRange(value as "7d" | "30d" | "90d")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={
                    effectiveRTL ? "اختر نطاق زمني" : "Select date range"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">
                  {effectiveRTL ? "آخر 7 أيام" : "Last 7 days"}
                </SelectItem>
                <SelectItem value="30d">
                  {effectiveRTL ? "آخر 30 يوم" : "Last 30 days"}
                </SelectItem>
                <SelectItem value="90d">
                  {effectiveRTL ? "آخر 90 يوم" : "Last 90 days"}
                </SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAnalytics}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              {effectiveRTL ? "تحديث" : "Refresh"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              disabled={isLoading || !analytics}
            >
              <Download className="h-4 w-4 mr-2" />
              {effectiveRTL ? "تصدير" : "Export"}
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">{error}</h3>
                  <Button onClick={fetchAnalytics}>
                    {effectiveRTL ? "إعادة المحاولة" : "Try Again"}
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
                  {effectiveRTL ? "جاري تحميل البيانات..." : "Loading data..."}
                </span>
              </div>
            </CardContent>
          </Card>
        ) : analytics ? (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {effectiveRTL ? "المستخدمون النشطون" : "Active Users"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {analytics.activeUsers.toLocaleString()}
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {effectiveRTL
                      ? `${analytics.userGrowthRate > 0 ? "+" : ""}${analytics.userGrowthRate}% مقارنة بالفترة السابقة`
                      : `${analytics.userGrowthRate > 0 ? "+" : ""}${analytics.userGrowthRate}% vs previous period`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {effectiveRTL ? "متوسط وقت الجلسة" : "Avg. Session Time"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {Math.round(analytics.avgSessionDuration / 60)}{" "}
                      {effectiveRTL ? "دقيقة" : "min"}
                    </div>
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {effectiveRTL
                      ? `${analytics.sessionDurationChange > 0 ? "+" : ""}${analytics.sessionDurationChange}% مقارنة بالفترة السابقة`
                      : `${analytics.sessionDurationChange > 0 ? "+" : ""}${analytics.sessionDurationChange}% vs previous period`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {effectiveRTL ? "معدل التفاعل" : "Engagement Rate"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {analytics.engagementRate}%
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {effectiveRTL
                      ? `${analytics.engagementChange > 0 ? "+" : ""}${analytics.engagementChange}% مقارنة بالفترة السابقة`
                      : `${analytics.engagementChange > 0 ? "+" : ""}${analytics.engagementChange}% vs previous period`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {effectiveRTL ? "معدل الاحتفاظ" : "Retention Rate"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">
                      {analytics.retentionRate}%
                    </div>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <UserCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {effectiveRTL
                      ? `${analytics.retentionChange > 0 ? "+" : ""}${analytics.retentionChange}% مقارنة بالفترة السابقة`
                      : `${analytics.retentionChange > 0 ? "+" : ""}${analytics.retentionChange}% vs previous period`}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="usage" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="usage">
                  <BarChart3 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "استخدام النظام" : "System Usage"}
                </TabsTrigger>
                <TabsTrigger value="modules">
                  <PieChartIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "استخدام الوحدات" : "Module Usage"}
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <LineChartIcon className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "اتجاهات المستخدم" : "User Trends"}
                </TabsTrigger>
                <TabsTrigger value="devices">
                  <Smartphone className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "الأجهزة والمتصفحات" : "Devices & Browsers"}
                </TabsTrigger>
              </TabsList>

              {/* System Usage Tab */}
              <TabsContent value="usage" className="space-y-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "نشاط المستخدم اليومي"
                        : "Daily User Activity"}
                    </CardTitle>
                    <CardDescription>
                      {effectiveRTL
                        ? "عدد المستخدمين النشطين والجلسات يومياً"
                        : "Number of active users and sessions per day"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analytics.dailyActivity}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="activeUsers"
                            name={
                              effectiveRTL
                                ? "المستخدمون النشطون"
                                : "Active Users"
                            }
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="sessions"
                            name={effectiveRTL ? "الجلسات" : "Sessions"}
                            stroke="#82ca9d"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "توزيع وقت الاستخدام"
                        : "Usage Time Distribution"}
                    </CardTitle>
                    <CardDescription>
                      {effectiveRTL
                        ? "متوسط وقت الاستخدام حسب ساعات اليوم"
                        : "Average usage time by hour of day"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analytics.hourlyUsage}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="avgMinutes"
                            name={
                              effectiveRTL ? "متوسط الدقائق" : "Avg. Minutes"
                            }
                            fill="#8884d8"
                          />
                          <Bar
                            dataKey="sessions"
                            name={effectiveRTL ? "الجلسات" : "Sessions"}
                            fill="#82ca9d"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Module Usage Tab */}
              <TabsContent value="modules" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {effectiveRTL ? "استخدام الوحدات" : "Module Usage"}
                      </CardTitle>
                      <CardDescription>
                        {effectiveRTL
                          ? "توزيع استخدام الوحدات المختلفة"
                          : "Distribution of different module usage"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.moduleUsage}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="usage"
                              nameKey="module"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {analytics.moduleUsage.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {effectiveRTL
                          ? "الوحدات الأكثر استخداماً"
                          : "Most Used Modules"}
                      </CardTitle>
                      <CardDescription>
                        {effectiveRTL
                          ? "ترتيب الوحدات حسب الاستخدام"
                          : "Ranking of modules by usage"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={analytics.moduleUsage.sort(
                              (a, b) => b.usage - a.usage,
                            )}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="module" />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="usage"
                              name={effectiveRTL ? "نسبة الاستخدام" : "Usage %"}
                              fill="#8884d8"
                            />
                            <Bar
                              dataKey="avgTimeSpent"
                              name={
                                effectiveRTL
                                  ? "متوسط الوقت (دقائق)"
                                  : "Avg. Time (min)"
                              }
                              fill="#82ca9d"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "أكثر الميزات استخداماً"
                        : "Most Used Features"}
                    </CardTitle>
                    <CardDescription>
                      {effectiveRTL
                        ? "الميزات الأكثر استخداماً عبر جميع الوحدات"
                        : "Most used features across all modules"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.topFeatures.map((feature, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{feature.name}</span>
                            <span className="text-sm">
                              {feature.usagePercent}%
                            </span>
                          </div>
                          <Progress
                            value={feature.usagePercent}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* User Trends Tab */}
              <TabsContent value="trends" className="space-y-6">
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "اتجاهات نمو المستخدمين"
                        : "User Growth Trends"}
                    </CardTitle>
                    <CardDescription>
                      {effectiveRTL
                        ? "المستخدمين الجدد والنشطين عبر الزمن"
                        : "New and active users over time"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analytics.userGrowth}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="newUsers"
                            name={effectiveRTL ? "مستخدمون جدد" : "New Users"}
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            type="monotone"
                            dataKey="activeUsers"
                            name={
                              effectiveRTL ? "مستخدمون نشطون" : "Active Users"
                            }
                            stroke="#82ca9d"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL ? "تحليل الاحتفاظ" : "Retention Analysis"}
                    </CardTitle>
                    <CardDescription>
                      {effectiveRTL
                        ? "معدلات الاحتفاظ بالمستخدمين عبر الوقت"
                        : "User retention rates over time"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={analytics.retentionData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="rate"
                            name={
                              effectiveRTL
                                ? "معدل الاحتفاظ %"
                                : "Retention Rate %"
                            }
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Devices & Browsers Tab */}
              <TabsContent value="devices" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {effectiveRTL ? "توزيع الأجهزة" : "Device Distribution"}
                      </CardTitle>
                      <CardDescription>
                        {effectiveRTL
                          ? "أنواع الأجهزة المستخدمة للوصول إلى النظام"
                          : "Types of devices used to access the system"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.deviceDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="percentage"
                              nameKey="device"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {analytics.deviceDistribution.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ),
                              )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {effectiveRTL
                          ? "توزيع المتصفحات"
                          : "Browser Distribution"}
                      </CardTitle>
                      <CardDescription>
                        {effectiveRTL
                          ? "المتصفحات المستخدمة للوصول إلى النظام"
                          : "Browsers used to access the system"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={analytics.browserDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              fill="#8884d8"
                              dataKey="percentage"
                              nameKey="browser"
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {analytics.browserDistribution.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                ),
                              )}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL ? "توزيع الدول" : "Country Distribution"}
                    </CardTitle>
                    <CardDescription>
                      {effectiveRTL
                        ? "البلدان التي يصل منها المستخدمون إلى النظام"
                        : "Countries from which users access the system"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={analytics.countryDistribution
                            .sort((a, b) => b.percentage - a.percentage)
                            .slice(0, 10)}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="country" />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="percentage"
                            name={
                              effectiveRTL ? "النسبة المئوية" : "Percentage"
                            }
                            fill="#8884d8"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : null}
      </div>
    </ModuleLayout>
  );
};

export default UserAnalyticsDashboard;
