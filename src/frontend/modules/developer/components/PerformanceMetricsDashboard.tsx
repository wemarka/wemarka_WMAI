import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Alert, AlertDescription } from "@/frontend/components/ui/alert";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Progress } from "@/frontend/components/ui/progress";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Separator } from "@/frontend/components/ui/separator";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/frontend/components/ui/popover";
import { Calendar } from "@/frontend/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Zap,
  Search,
  Calendar as CalendarIcon,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Info,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Cpu,
  Memory,
  HardDrive,
  Network,
  Timer,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Gauge,
  BarChart2,
  TrendingUp,
  Layers,
  Maximize2,
  Minimize2,
  RotateCw,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { format } from "date-fns";

interface PerformanceMetric {
  id: string;
  timestamp: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  trend: "up" | "down" | "stable";
  threshold?: number;
  status?: "normal" | "warning" | "critical";
}

interface ResourceUsage {
  timestamp: string;
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface ResponseTime {
  timestamp: string;
  api: number;
  database: number;
  frontend: number;
  total: number;
}

interface EndpointPerformance {
  endpoint: string;
  avgResponseTime: number;
  p95ResponseTime: number;
  requestCount: number;
  errorRate: number;
  category: string;
}

interface PerformanceMetricsDashboardProps {
  isRTL?: boolean;
  showDetailedMetrics?: boolean;
}

export const PerformanceMetricsDashboard: React.FC<
  PerformanceMetricsDashboardProps
> = ({ isRTL = false, showDetailedMetrics = true }) => {
  const { direction } = useLanguage();
  const effectiveRTL = isRTL || direction === "rtl";

  // State for date range
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  });

  // State for metrics
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);

  // State for resource usage
  const [resourceUsage, setResourceUsage] = useState<ResourceUsage[]>([]);
  const [resourceUsageLoading, setResourceUsageLoading] = useState(true);

  // State for response times
  const [responseTimes, setResponseTimes] = useState<ResponseTime[]>([]);
  const [responseTimesLoading, setResponseTimesLoading] = useState(true);

  // State for endpoint performance
  const [endpointPerformance, setEndpointPerformance] = useState<
    EndpointPerformance[]
  >([]);
  const [endpointPerformanceLoading, setEndpointPerformanceLoading] =
    useState(true);

  // State for metric filters
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined,
  );
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );

  // State for time interval
  const [timeInterval, setTimeInterval] = useState<string>("daily");

  // State for expanded metric
  const [expandedMetricId, setExpandedMetricId] = useState<string | null>(null);

  // Fetch performance metrics
  useEffect(() => {
    const fetchPerformanceMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError(null);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockMetrics = getMockPerformanceMetrics();
        setMetrics(mockMetrics);
      } catch (error) {
        console.error("Error fetching performance metrics:", error);
        setMetricsError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب بيانات الأداء"
            : "An error occurred while fetching performance metrics",
        );
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchPerformanceMetrics();
    // Refresh metrics every 60 seconds
    const intervalId = setInterval(fetchPerformanceMetrics, 60000);
    return () => clearInterval(intervalId);
  }, [effectiveRTL, dateRange, categoryFilter, statusFilter]);

  // Fetch resource usage
  useEffect(() => {
    const fetchResourceUsage = async () => {
      setResourceUsageLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockResourceUsage = getMockResourceUsage(timeInterval);
        setResourceUsage(mockResourceUsage);
      } catch (error) {
        console.error("Error fetching resource usage:", error);
      } finally {
        setResourceUsageLoading(false);
      }
    };

    fetchResourceUsage();
  }, [timeInterval, dateRange]);

  // Fetch response times
  useEffect(() => {
    const fetchResponseTimes = async () => {
      setResponseTimesLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockResponseTimes = getMockResponseTimes(timeInterval);
        setResponseTimes(mockResponseTimes);
      } catch (error) {
        console.error("Error fetching response times:", error);
      } finally {
        setResponseTimesLoading(false);
      }
    };

    fetchResponseTimes();
  }, [timeInterval, dateRange]);

  // Fetch endpoint performance
  useEffect(() => {
    const fetchEndpointPerformance = async () => {
      setEndpointPerformanceLoading(true);
      try {
        // In a real implementation, this would fetch from an API
        // For now, we'll use mock data
        const mockEndpointPerformance = getMockEndpointPerformance();
        setEndpointPerformance(mockEndpointPerformance);
      } catch (error) {
        console.error("Error fetching endpoint performance:", error);
      } finally {
        setEndpointPerformanceLoading(false);
      }
    };

    fetchEndpointPerformance();
  }, [dateRange]);

  // Handle refresh all data
  const handleRefreshAll = async () => {
    setMetricsLoading(true);
    setResourceUsageLoading(true);
    setResponseTimesLoading(true);
    setEndpointPerformanceLoading(true);

    try {
      const mockMetrics = getMockPerformanceMetrics();
      const mockResourceUsage = getMockResourceUsage(timeInterval);
      const mockResponseTimes = getMockResponseTimes(timeInterval);
      const mockEndpointPerformance = getMockEndpointPerformance();

      setMetrics(mockMetrics);
      setResourceUsage(mockResourceUsage);
      setResponseTimes(mockResponseTimes);
      setEndpointPerformance(mockEndpointPerformance);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setMetricsLoading(false);
      setResourceUsageLoading(false);
      setResponseTimesLoading(false);
      setEndpointPerformanceLoading(false);
    }
  };

  // Export data as JSON
  const handleExportData = (data: any, filename: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Get metric status color
  const getMetricStatusColor = (status: string): string => {
    switch (status) {
      case "normal":
        return "text-green-500";
      case "warning":
        return "text-yellow-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string, value: number, threshold?: number) => {
    const isNegative =
      threshold !== undefined
        ? trend === "up"
          ? value > threshold
          : value < threshold
        : false;

    switch (trend) {
      case "up":
        return (
          <ArrowUpRight
            className={`h-4 w-4 ${isNegative ? "text-red-500" : "text-green-500"}`}
          />
        );
      case "down":
        return (
          <ArrowDownRight
            className={`h-4 w-4 ${isNegative ? "text-red-500" : "text-green-500"}`}
          />
        );
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Get available metric categories
  const availableCategories = Array.from(
    new Set(metrics.map((metric) => metric.category)),
  ).sort();

  // Get available metric statuses
  const availableStatuses = Array.from(
    new Set(
      metrics
        .filter((metric) => metric.status !== undefined)
        .map((metric) => metric.status),
    ),
  ).sort();

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

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {effectiveRTL ? "لوحة قياس الأداء" : "Performance Metrics Dashboard"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={
              metricsLoading ||
              resourceUsageLoading ||
              responseTimesLoading ||
              endpointPerformanceLoading
            }
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 ${metricsLoading || resourceUsageLoading || responseTimesLoading || endpointPerformanceLoading ? "animate-spin" : ""}`}
            />
            {effectiveRTL ? "تحديث الكل" : "Refresh All"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Gauge className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "استخدام الموارد" : "Resource Usage"}
          </TabsTrigger>
          <TabsTrigger value="response">
            <Timer className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "وقت الاستجابة" : "Response Times"}
          </TabsTrigger>
          <TabsTrigger value="endpoints">
            <Network className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "أداء نقاط النهاية" : "Endpoint Performance"}
          </TabsTrigger>
          {showDetailedMetrics && (
            <TabsTrigger value="detailed">
              <Layers className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "مقاييس مفصلة" : "Detailed Metrics"}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Key Performance Indicators */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {effectiveRTL ? "متوسط وقت الاستجابة" : "Avg Response Time"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Timer className="h-5 w-5 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
                  <div>
                    <div className="text-2xl font-bold">245 ms</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">12%</span> vs
                      last week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {effectiveRTL
                    ? "استخدام وحدة المعالجة المركزية"
                    : "CPU Usage"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Cpu className="h-5 w-5 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
                  <div>
                    <div className="text-2xl font-bold">42%</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 text-yellow-500 mr-1" />
                      <span className="text-yellow-500 font-medium">8%</span> vs
                      last week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {effectiveRTL ? "معدل الخطأ" : "Error Rate"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
                  <div>
                    <div className="text-2xl font-bold">0.8%</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowDownRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">
                        0.3%
                      </span>{" "}
                      vs last week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {effectiveRTL ? "المستخدمون النشطون" : "Active Users"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
                  <div>
                    <div className="text-2xl font-bold">1,245</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">18%</span> vs
                      last week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Response Time Trend */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {effectiveRTL ? "اتجاه وقت الاستجابة" : "Response Time Trend"}
                </CardTitle>
                <CardDescription>
                  {effectiveRTL
                    ? "متوسط وقت الاستجابة عبر الوقت"
                    : "Average response time over time"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {responseTimesLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={responseTimes}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="total"
                          name={effectiveRTL ? "الإجمالي" : "Total"}
                          stroke="#8884d8"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="api"
                          name="API"
                          stroke="#82ca9d"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="database"
                          name={effectiveRTL ? "قاعدة البيانات" : "Database"}
                          stroke="#ffc658"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resource Usage Trend */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {effectiveRTL
                    ? "اتجاه استخدام الموارد"
                    : "Resource Usage Trend"}
                </CardTitle>
                <CardDescription>
                  {effectiveRTL
                    ? "استخدام وحدة المعالجة المركزية والذاكرة والقرص عبر الوقت"
                    : "CPU, memory, and disk usage over time"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resourceUsageLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={resourceUsage}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="cpu"
                          name="CPU %"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="memory"
                          name={effectiveRTL ? "الذاكرة %" : "Memory %"}
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="disk"
                          name={effectiveRTL ? "القرص %" : "Disk %"}
                          stroke="#ffc658"
                          fill="#ffc658"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportData(
                  { responseTimes, resourceUsage },
                  "performance-overview",
                )
              }
            >
              <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "تصدير البيانات" : "Export Data"}
            </Button>
          </div>
        </TabsContent>

        {/* Resource Usage Tab */}
        <TabsContent value="resources" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Label htmlFor="time-interval">
                {effectiveRTL ? "الفاصل الزمني:" : "Time Interval:"}
              </Label>
              <Select value={timeInterval} onValueChange={setTimeInterval}>
                <SelectTrigger id="time-interval" className="w-[180px]">
                  <SelectValue
                    placeholder={
                      effectiveRTL ? "اختر الفاصل الزمني" : "Select interval"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">
                    {effectiveRTL ? "كل ساعة" : "Hourly"}
                  </SelectItem>
                  <SelectItem value="daily">
                    {effectiveRTL ? "يومي" : "Daily"}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {effectiveRTL ? "أسبوعي" : "Weekly"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Label htmlFor="date-range">
                {effectiveRTL ? "نطاق التاريخ:" : "Date range:"}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range"
                    variant="outline"
                    className="w-[240px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>
                        {effectiveRTL
                          ? "اختر نطاق التاريخ"
                          : "Pick a date range"}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={{
                      from: dateRange?.from,
                      to: dateRange?.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {resourceUsageLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CPU Usage Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "استخدام وحدة المعالجة المركزية"
                        : "CPU Usage"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={resourceUsage}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="cpu"
                            name="CPU %"
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Memory Usage Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL ? "استخدام الذاكرة" : "Memory Usage"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={resourceUsage}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="memory"
                            name={effectiveRTL ? "الذاكرة %" : "Memory %"}
                            stroke="#82ca9d"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Disk Usage Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL ? "استخدام القرص" : "Disk Usage"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={resourceUsage}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="disk"
                            name={effectiveRTL ? "القرص %" : "Disk %"}
                            stroke="#ffc658"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Network Usage Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL ? "استخدام الشبكة" : "Network Usage"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={resourceUsage}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="timestamp" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="network"
                            name={
                              effectiveRTL ? "الشبكة (MB/s)" : "Network (MB/s)"
                            }
                            stroke="#ff8042"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExportData(resourceUsage, "resource-usage")
                  }
                >
                  <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "تصدير البيانات" : "Export Data"}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Response Times Tab */}
        <TabsContent value="response" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Label htmlFor="response-time-interval">
                {effectiveRTL ? "الفاصل الزمني:" : "Time Interval:"}
              </Label>
              <Select value={timeInterval} onValueChange={setTimeInterval}>
                <SelectTrigger
                  id="response-time-interval"
                  className="w-[180px]"
                >
                  <SelectValue
                    placeholder={
                      effectiveRTL ? "اختر الفاصل الزمني" : "Select interval"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">
                    {effectiveRTL ? "كل ساعة" : "Hourly"}
                  </SelectItem>
                  <SelectItem value="daily">
                    {effectiveRTL ? "يومي" : "Daily"}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {effectiveRTL ? "أسبوعي" : "Weekly"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {responseTimesLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL
                      ? "تحليل وقت الاستجابة"
                      : "Response Time Analysis"}
                  </CardTitle>
                  <CardDescription>
                    {effectiveRTL
                      ? "تفصيل وقت الاستجابة حسب طبقة التطبيق"
                      : "Breakdown of response time by application layer"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={responseTimes}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                          dataKey="api"
                          name="API"
                          stackId="a"
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="database"
                          name={effectiveRTL ? "قاعدة البيانات" : "Database"}
                          stackId="a"
                          fill="#82ca9d"
                        />
                        <Bar
                          dataKey="frontend"
                          name={effectiveRTL ? "واجهة المستخدم" : "Frontend"}
                          stackId="a"
                          fill="#ffc658"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {effectiveRTL ? "وقت استجابة API" : "API Response Time"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {responseTimes.length > 0
                        ? `${responseTimes[responseTimes.length - 1].api} ms`
                        : "N/A"}
                    </div>
                    <Progress
                      value={70}
                      className="h-2 mt-2"
                      indicatorClassName="bg-indigo-500"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {effectiveRTL
                        ? "وقت استجابة قاعدة البيانات"
                        : "Database Response Time"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {responseTimes.length > 0
                        ? `${responseTimes[responseTimes.length - 1].database} ms`
                        : "N/A"}
                    </div>
                    <Progress
                      value={45}
                      className="h-2 mt-2"
                      indicatorClassName="bg-green-500"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {effectiveRTL
                        ? "وقت استجابة واجهة المستخدم"
                        : "Frontend Response Time"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {responseTimes.length > 0
                        ? `${responseTimes[responseTimes.length - 1].frontend} ms`
                        : "N/A"}
                    </div>
                    <Progress
                      value={30}
                      className="h-2 mt-2"
                      indicatorClassName="bg-yellow-500"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExportData(responseTimes, "response-times")
                  }
                >
                  <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "تصدير البيانات" : "Export Data"}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Endpoint Performance Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          {endpointPerformanceLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "متوسط وقت الاستجابة حسب نقطة النهاية"
                        : "Average Response Time by Endpoint"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={endpointPerformance.sort(
                            (a, b) => b.avgResponseTime - a.avgResponseTime,
                          )}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="endpoint" />
                          <RechartsTooltip />
                          <Legend />
                          <Bar
                            dataKey="avgResponseTime"
                            name={
                              effectiveRTL
                                ? "متوسط وقت الاستجابة (مللي ثانية)"
                                : "Avg Response Time (ms)"
                            }
                            fill="#8884d8"
                          />
                          <Bar
                            dataKey="p95ResponseTime"
                            name={
                              effectiveRTL
                                ? "وقت الاستجابة P95 (مللي ثانية)"
                                : "P95 Response Time (ms)"
                            }
                            fill="#82ca9d"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "عدد الطلبات ومعدل الخطأ"
                        : "Request Count & Error Rate"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={endpointPerformance.sort(
                            (a, b) => b.requestCount - a.requestCount,
                          )}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="endpoint" />
                          <RechartsTooltip />
                          <Legend />
                          <Bar
                            dataKey="requestCount"
                            name={
                              effectiveRTL ? "عدد الطلبات" : "Request Count"
                            }
                            fill="#8884d8"
                          />
                          <Bar
                            dataKey="errorRate"
                            name={
                              effectiveRTL ? "معدل الخطأ (%)" : "Error Rate (%)"
                            }
                            fill="#ff8042"
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
                      ? "تفاصيل أداء نقاط النهاية"
                      : "Endpoint Performance Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="p-4">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4">
                              {effectiveRTL ? "نقطة النهاية" : "Endpoint"}
                            </th>
                            <th className="text-left py-3 px-4">
                              {effectiveRTL ? "الفئة" : "Category"}
                            </th>
                            <th className="text-right py-3 px-4">
                              {effectiveRTL
                                ? "متوسط وقت الاستجابة"
                                : "Avg Response Time"}
                            </th>
                            <th className="text-right py-3 px-4">
                              {effectiveRTL
                                ? "وقت الاستجابة P95"
                                : "P95 Response Time"}
                            </th>
                            <th className="text-right py-3 px-4">
                              {effectiveRTL ? "عدد الطلبات" : "Request Count"}
                            </th>
                            <th className="text-right py-3 px-4">
                              {effectiveRTL ? "معدل الخطأ" : "Error Rate"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpointPerformance.map((endpoint) => (
                            <tr
                              key={endpoint.endpoint}
                              className="border-b hover:bg-muted/50"
                            >
                              <td className="py-3 px-4">{endpoint.endpoint}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline">
                                  {endpoint.category}
                                </Badge>
                              </td>
                              <td className="text-right py-3 px-4">
                                {endpoint.avgResponseTime} ms
                              </td>
                              <td className="text-right py-3 px-4">
                                {endpoint.p95ResponseTime} ms
                              </td>
                              <td className="text-right py-3 px-4">
                                {endpoint.requestCount.toLocaleString()}
                              </td>
                              <td className="text-right py-3 px-4">
                                <span
                                  className={
                                    endpoint.errorRate > 5
                                      ? "text-red-500"
                                      : endpoint.errorRate > 1
                                        ? "text-yellow-500"
                                        : "text-green-500"
                                  }
                                >
                                  {endpoint.errorRate}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExportData(
                      endpointPerformance,
                      "endpoint-performance",
                    )
                  }
                >
                  <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "تصدير البيانات" : "Export Data"}
                </Button>
              </div>
            </>
          )}
        </TabsContent>

        {/* Detailed Metrics Tab */}
        {showDetailedMetrics && (
          <TabsContent value="detailed" className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Label htmlFor="category-filter">
                    {effectiveRTL ? "تصفية حسب الفئة:" : "Filter by category:"}
                  </Label>
                  <Select
                    value={categoryFilter || "all"}
                    onValueChange={(value) =>
                      setCategoryFilter(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger id="category-filter" className="w-[180px]">
                      <SelectValue
                        placeholder={
                          effectiveRTL ? "جميع الفئات" : "All Categories"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {effectiveRTL ? "جميع الفئات" : "All Categories"}
                      </SelectItem>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Label htmlFor="status-filter">
                    {effectiveRTL ? "تصفية حسب الحالة:" : "Filter by status:"}
                  </Label>
                  <Select
                    value={statusFilter || "all"}
                    onValueChange={(value) =>
                      setStatusFilter(value === "all" ? undefined : value)
                    }
                  >
                    <SelectTrigger id="status-filter" className="w-[180px]">
                      <SelectValue
                        placeholder={
                          effectiveRTL ? "جميع الحالات" : "All Statuses"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {effectiveRTL ? "جميع الحالات" : "All Statuses"}
                      </SelectItem>
                      {availableStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status === "normal"
                            ? effectiveRTL
                              ? "طبيعي"
                              : "Normal"
                            : status === "warning"
                              ? effectiveRTL
                                ? "تحذير"
                                : "Warning"
                              : effectiveRTL
                                ? "حرج"
                                : "Critical"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData(metrics, "detailed-metrics")}
              >
                <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {effectiveRTL ? "تصدير المقاييس" : "Export Metrics"}
              </Button>
            </div>

            {metricsLoading ? (
              <div className="flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  {effectiveRTL ? "جاري التحميل..." : "Loading..."}
                </span>
              </div>
            ) : metricsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{metricsError}</AlertDescription>
              </Alert>
            ) : metrics.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {effectiveRTL ? "لا توجد مقاييس" : "No Metrics Found"}
                </h3>
                <p className="text-muted-foreground">
                  {effectiveRTL
                    ? "لم يتم العثور على مقاييس أداء تطابق معايير التصفية الخاصة بك"
                    : "No performance metrics found matching your filter criteria"}
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-4 space-y-2">
                      {metrics.map((metric) => (
                        <div
                          key={metric.id}
                          className="border rounded-md overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              setExpandedMetricId(
                                expandedMetricId === metric.id
                                  ? null
                                  : metric.id,
                              )
                            }
                          >
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Activity className="h-4 w-4 text-primary" />
                              <div>
                                <div className="font-medium">{metric.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {metric.category} -{" "}
                                  {new Date(metric.timestamp).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <div className="text-right">
                                <div className="font-medium">
                                  {metric.value} {metric.unit}
                                </div>
                                <div className="flex items-center justify-end text-xs">
                                  {getTrendIcon(
                                    metric.trend,
                                    metric.value,
                                    metric.threshold,
                                  )}
                                  <span
                                    className={
                                      metric.status === "critical"
                                        ? "text-red-500"
                                        : metric.status === "warning"
                                          ? "text-yellow-500"
                                          : "text-green-500"
                                    }
                                  >
                                    {metric.status === "normal"
                                      ? effectiveRTL
                                        ? "طبيعي"
                                        : "Normal"
                                      : metric.status === "warning"
                                        ? effectiveRTL
                                          ? "تحذير"
                                          : "Warning"
                                        : effectiveRTL
                                          ? "حرج"
                                          : "Critical"}
                                  </span>
                                </div>
                              </div>
                              {expandedMetricId === metric.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {expandedMetricId === metric.id && (
                            <div className="p-3 border-t bg-muted/10">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-sm font-medium mb-1">
                                    {effectiveRTL
                                      ? "تفاصيل المقياس:"
                                      : "Metric Details:"}
                                  </h5>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {effectiveRTL ? "الفئة:" : "Category:"}
                                      </span>
                                      <span className="text-sm font-medium">
                                        {metric.category}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {effectiveRTL
                                          ? "القيمة الحالية:"
                                          : "Current Value:"}
                                      </span>
                                      <span className="text-sm font-medium">
                                        {metric.value} {metric.unit}
                                      </span>
                                    </div>
                                    {metric.threshold && (
                                      <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                          {effectiveRTL
                                            ? "عتبة:"
                                            : "Threshold:"}
                                        </span>
                                        <span className="text-sm font-medium">
                                          {metric.threshold} {metric.unit}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {effectiveRTL ? "الاتجاه:" : "Trend:"}
                                      </span>
                                      <span className="text-sm font-medium flex items-center">
                                        {getTrendIcon(
                                          metric.trend,
                                          metric.value,
                                          metric.threshold,
                                        )}
                                        <span className="ml-1">
                                          {metric.trend === "up"
                                            ? effectiveRTL
                                              ? "تصاعدي"
                                              : "Upward"
                                            : metric.trend === "down"
                                              ? effectiveRTL
                                                ? "تنازلي"
                                                : "Downward"
                                              : effectiveRTL
                                                ? "مستقر"
                                                : "Stable"}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium mb-1">
                                    {effectiveRTL
                                      ? "الحالة والتوصيات:"
                                      : "Status & Recommendations:"}
                                  </h5>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm text-muted-foreground">
                                        {effectiveRTL ? "الحالة:" : "Status:"}
                                      </span>
                                      <span
                                        className={`text-sm font-medium ${metric.status === "critical" ? "text-red-500" : metric.status === "warning" ? "text-yellow-500" : "text-green-500"}`}
                                      >
                                        {metric.status === "normal"
                                          ? effectiveRTL
                                            ? "طبيعي"
                                            : "Normal"
                                          : metric.status === "warning"
                                            ? effectiveRTL
                                              ? "تحذير"
                                              : "Warning"
                                            : effectiveRTL
                                              ? "حرج"
                                              : "Critical"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-sm text-muted-foreground">
                                        {effectiveRTL
                                          ? "توصيات:"
                                          : "Recommendations:"}
                                      </span>
                                      <p className="text-sm mt-1">
                                        {metric.status === "critical"
                                          ? effectiveRTL
                                            ? "يجب اتخاذ إجراء فوري. راجع الأنظمة المرتبطة وقم بتحسين الأداء."
                                            : "Immediate action required. Review related systems and optimize performance."
                                          : metric.status === "warning"
                                            ? effectiveRTL
                                              ? "مراقبة الوضع عن كثب. قد تكون هناك حاجة للتحسينات."
                                              : "Monitor the situation closely. Optimizations may be needed."
                                            : effectiveRTL
                                              ? "لا يلزم اتخاذ أي إجراء. الأداء ضمن النطاق المتوقع."
                                              : "No action needed. Performance is within expected range."}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Mock data generators
const getMockPerformanceMetrics = (): PerformanceMetric[] => {
  const categories = [
    "API",
    "Database",
    "Frontend",
    "System",
    "Network",
    "Cache",
  ];
  const metricNames = [
    "Response Time",
    "CPU Usage",
    "Memory Usage",
    "Disk I/O",
    "Network Latency",
    "Error Rate",
    "Cache Hit Ratio",
    "Database Connections",
    "Active Users",
    "Request Rate",
  ];
  const units = ["ms", "%", "MB", "req/s", "conn", "users"];

  return Array.from({ length: 50 }, (_, i) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const name = metricNames[Math.floor(Math.random() * metricNames.length)];
    const unit = units[Math.floor(Math.random() * units.length)];
    const value = Math.floor(Math.random() * 100);
    const threshold = Math.floor(Math.random() * 100);
    const trend =
      Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable";
    let status: "normal" | "warning" | "critical";

    if (value > threshold * 1.2) {
      status = "critical";
    } else if (value > threshold * 0.8) {
      status = "warning";
    } else {
      status = "normal";
    }

    return {
      id: `metric-${i}`,
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      name: `${category} ${name}`,
      value,
      unit,
      category,
      trend,
      threshold,
      status,
    };
  });
};

const getMockResourceUsage = (interval: string): ResourceUsage[] => {
  let dataPoints: number;
  let timeIncrement: number;

  switch (interval) {
    case "hourly":
      dataPoints = 24;
      timeIncrement = 60 * 60 * 1000; // 1 hour
      break;
    case "weekly":
      dataPoints = 7;
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "daily":
    default:
      dataPoints = 14;
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day
      break;
  }

  return Array.from({ length: dataPoints }, (_, i) => {
    const date = new Date(Date.now() - (dataPoints - i) * timeIncrement);
    const formattedDate =
      interval === "hourly"
        ? `${date.getHours()}:00`
        : interval === "weekly"
          ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
          : `${date.getMonth() + 1}/${date.getDate()}`;

    return {
      timestamp: formattedDate,
      cpu: Math.floor(Math.random() * 100),
      memory: Math.floor(Math.random() * 100),
      disk: Math.floor(Math.random() * 100),
      network: Math.floor(Math.random() * 10),
    };
  });
};

const getMockResponseTimes = (interval: string): ResponseTime[] => {
  let dataPoints: number;
  let timeIncrement: number;

  switch (interval) {
    case "hourly":
      dataPoints = 24;
      timeIncrement = 60 * 60 * 1000; // 1 hour
      break;
    case "weekly":
      dataPoints = 7;
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day
      break;
    case "daily":
    default:
      dataPoints = 14;
      timeIncrement = 24 * 60 * 60 * 1000; // 1 day
      break;
  }

  return Array.from({ length: dataPoints }, (_, i) => {
    const date = new Date(Date.now() - (dataPoints - i) * timeIncrement);
    const formattedDate =
      interval === "hourly"
        ? `${date.getHours()}:00`
        : interval === "weekly"
          ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
          : `${date.getMonth() + 1}/${date.getDate()}`;

    const api = Math.floor(Math.random() * 200) + 50;
    const database = Math.floor(Math.random() * 150) + 30;
    const frontend = Math.floor(Math.random() * 100) + 20;

    return {
      timestamp: formattedDate,
      api,
      database,
      frontend,
      total: api + database + frontend,
    };
  });
};

const getMockEndpointPerformance = (): EndpointPerformance[] => {
  const endpoints = [
    "/api/users",
    "/api/products",
    "/api/orders",
    "/api/auth/login",
    "/api/auth/register",
    "/api/dashboard",
    "/api/analytics",
    "/api/settings",
    "/api/search",
    "/api/notifications",
  ];

  const categories = ["auth", "data", "analytics", "system"];

  return endpoints.map((endpoint) => {
    const avgResponseTime = Math.floor(Math.random() * 500) + 50;
    return {
      endpoint,
      avgResponseTime,
      p95ResponseTime: avgResponseTime * 1.5,
      requestCount: Math.floor(Math.random() * 10000) + 100,
      errorRate: Math.random() * 10,
      category: categories[Math.floor(Math.random() * categories.length)],
    };
  });
};

// Missing Minus icon component
const Minus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// Default export
export default PerformanceMetricsDashboard;
