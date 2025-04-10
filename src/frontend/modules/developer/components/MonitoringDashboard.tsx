import React, { useState, useEffect, useMemo } from "react";
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
import { Checkbox } from "@/frontend/components/ui/checkbox";
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
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Clock,
  Database,
  Download,
  HardDrive,
  RefreshCw,
  Server,
  Users,
  Zap,
  Search,
  Calendar as CalendarIcon,
  Filter,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  RotateCw,
  BrainCircuit,
  Sparkles,
  ArrowUpDown,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Repeat,
  Trash2,
  ExternalLink,
  CalendarDays,
  Layers,
  Cpu,
  Flame,
  Lightbulb,
  Wrench,
  Webhook,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { format } from "date-fns";
import {
  getSystemHealth,
  getErrorLogs,
  getSlowQueries,
  getUsageMetrics,
  getModuleUsage,
  getErrorTrends,
  getErrorsByModule,
  getRepeatedErrors,
  retryFailedJob,
  getSupabaseLogs,
  SystemHealth,
  ErrorLog,
  SlowQuery,
  UsageMetric,
  ModuleUsage,
  ErrorTrend,
  ModuleError,
  RepeatedError,
  SupabaseLog,
  ErrorSeverity,
} from "@/frontend/services/monitoringService";

interface MonitoringDashboardProps {
  isRTL?: boolean;
  showSupabaseLogs?: boolean;
  showSentryLogs?: boolean;
}

export const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({
  isRTL = false,
  showSupabaseLogs = true,
  showSentryLogs = false,
}) => {
  const { direction } = useLanguage();
  const { promptAIAssistant } = useAI();
  const effectiveRTL = isRTL || direction === "rtl";

  // State for system health
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  // State for error logs
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [errorLogsLoading, setErrorLogsLoading] = useState(true);
  const [errorLogsError, setErrorLogsError] = useState<string | null>(null);
  const [errorLogFilter, setErrorLogFilter] = useState<
    ErrorSeverity | undefined
  >(undefined);
  const [moduleFilter, setModuleFilter] = useState<string | undefined>(
    undefined,
  );
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    to: new Date(),
  });

  // State for error trends and module errors
  const [errorTrends, setErrorTrends] = useState<ErrorTrend[]>([]);
  const [errorTrendsLoading, setErrorTrendsLoading] = useState(true);
  const [moduleErrors, setModuleErrors] = useState<ModuleError[]>([]);
  const [moduleErrorsLoading, setModuleErrorsLoading] = useState(true);
  const [repeatedErrors, setRepeatedErrors] = useState<RepeatedError[]>([]);
  const [repeatedErrorsLoading, setRepeatedErrorsLoading] = useState(true);

  // State for Supabase logs
  const [supabaseLogs, setSupabaseLogs] = useState<SupabaseLog[]>([]);
  const [supabaseLogsLoading, setSupabaseLogsLoading] = useState(true);
  const [supabaseLogsError, setSupabaseLogsError] = useState<string | null>(
    null,
  );

  // State for slow queries
  const [slowQueries, setSlowQueries] = useState<SlowQuery[]>([]);
  const [slowQueriesLoading, setSlowQueriesLoading] = useState(true);
  const [slowQueriesError, setSlowQueriesError] = useState<string | null>(null);
  const [minQueryDuration, setMinQueryDuration] = useState<number | undefined>(
    undefined,
  );

  // State for usage metrics
  const [usageMetrics, setUsageMetrics] = useState<UsageMetric[]>([]);
  const [usageMetricsLoading, setUsageMetricsLoading] = useState(true);
  const [usageMetricsError, setUsageMetricsError] = useState<string | null>(
    null,
  );

  // State for module usage
  const [moduleUsage, setModuleUsage] = useState<ModuleUsage[]>([]);
  const [moduleUsageLoading, setModuleUsageLoading] = useState(true);
  const [moduleUsageError, setModuleUsageError] = useState<string | null>(null);

  // Date range for usage metrics
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 14); // 14 days ago
    return date;
  });
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Expanded log state
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Fetch system health
  useEffect(() => {
    const fetchSystemHealth = async () => {
      setHealthLoading(true);
      setHealthError(null);
      try {
        const health = await getSystemHealth();
        setSystemHealth(health);
      } catch (error) {
        console.error("Error fetching system health:", error);
        setHealthError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب بيانات صحة النظام"
            : "An error occurred while fetching system health data",
        );
      } finally {
        setHealthLoading(false);
      }
    };

    fetchSystemHealth();

    // Refresh system health every 60 seconds
    const intervalId = setInterval(fetchSystemHealth, 60000);

    return () => clearInterval(intervalId);
  }, [effectiveRTL]);

  // Fetch error logs with enhanced filtering
  useEffect(() => {
    const fetchErrorLogs = async () => {
      setErrorLogsLoading(true);
      setErrorLogsError(null);
      try {
        const logs = await getErrorLogs(
          100,
          0,
          errorLogFilter,
          dateRange.from,
          dateRange.to,
          moduleFilter,
        );
        setErrorLogs(logs);
      } catch (error) {
        console.error("Error fetching error logs:", error);
        setErrorLogsError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب سجلات الأخطاء"
            : "An error occurred while fetching error logs",
        );
      } finally {
        setErrorLogsLoading(false);
      }
    };

    fetchErrorLogs();
  }, [effectiveRTL, errorLogFilter, moduleFilter, dateRange]);

  // Fetch error trends
  useEffect(() => {
    const fetchErrorTrends = async () => {
      setErrorTrendsLoading(true);
      try {
        const trends = await getErrorTrends(dateRange.from, dateRange.to);
        setErrorTrends(trends);
      } catch (error) {
        console.error("Error fetching error trends:", error);
      } finally {
        setErrorTrendsLoading(false);
      }
    };

    fetchErrorTrends();
  }, [dateRange]);

  // Fetch errors by module
  useEffect(() => {
    const fetchModuleErrors = async () => {
      setModuleErrorsLoading(true);
      try {
        const errors = await getErrorsByModule(dateRange.from, dateRange.to);
        setModuleErrors(errors);
      } catch (error) {
        console.error("Error fetching module errors:", error);
      } finally {
        setModuleErrorsLoading(false);
      }
    };

    fetchModuleErrors();
  }, [dateRange]);

  // Fetch repeated errors
  useEffect(() => {
    const fetchRepeatedErrors = async () => {
      setRepeatedErrorsLoading(true);
      try {
        const errors = await getRepeatedErrors(dateRange.from, dateRange.to);
        setRepeatedErrors(errors);
      } catch (error) {
        console.error("Error fetching repeated errors:", error);
      } finally {
        setRepeatedErrorsLoading(false);
      }
    };

    fetchRepeatedErrors();
  }, [dateRange]);

  // Fetch Supabase logs if enabled
  useEffect(() => {
    if (!showSupabaseLogs) return;

    const fetchSupabaseLogs = async () => {
      setSupabaseLogsLoading(true);
      setSupabaseLogsError(null);
      try {
        const logs = await getSupabaseLogs(dateRange.from, dateRange.to);
        setSupabaseLogs(logs);
      } catch (error) {
        console.error("Error fetching Supabase logs:", error);
        setSupabaseLogsError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب سجلات Supabase"
            : "An error occurred while fetching Supabase logs",
        );
      } finally {
        setSupabaseLogsLoading(false);
      }
    };

    fetchSupabaseLogs();
  }, [effectiveRTL, showSupabaseLogs, dateRange]);

  // Fetch slow queries
  useEffect(() => {
    const fetchSlowQueries = async () => {
      setSlowQueriesLoading(true);
      setSlowQueriesError(null);
      try {
        const queries = await getSlowQueries(100, 0, minQueryDuration);
        setSlowQueries(queries);
      } catch (error) {
        console.error("Error fetching slow queries:", error);
        setSlowQueriesError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب الاستعلامات البطيئة"
            : "An error occurred while fetching slow queries",
        );
      } finally {
        setSlowQueriesLoading(false);
      }
    };

    fetchSlowQueries();
  }, [effectiveRTL, minQueryDuration]);

  // Fetch usage metrics
  useEffect(() => {
    const fetchUsageMetrics = async () => {
      setUsageMetricsLoading(true);
      setUsageMetricsError(null);
      try {
        const metrics = await getUsageMetrics(startDate, endDate);
        setUsageMetrics(metrics);
      } catch (error) {
        console.error("Error fetching usage metrics:", error);
        setUsageMetricsError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب مقاييس الاستخدام"
            : "An error occurred while fetching usage metrics",
        );
      } finally {
        setUsageMetricsLoading(false);
      }
    };

    fetchUsageMetrics();
  }, [effectiveRTL, startDate, endDate]);

  // Fetch module usage
  useEffect(() => {
    const fetchModuleUsage = async () => {
      setModuleUsageLoading(true);
      setModuleUsageError(null);
      try {
        const usage = await getModuleUsage();
        setModuleUsage(usage);
      } catch (error) {
        console.error("Error fetching module usage:", error);
        setModuleUsageError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب بيانات استخدام الوحدات"
            : "An error occurred while fetching module usage data",
        );
      } finally {
        setModuleUsageLoading(false);
      }
    };

    fetchModuleUsage();
  }, [effectiveRTL]);

  // Format uptime
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  // Handle refresh all data
  const handleRefreshAll = async () => {
    try {
      setHealthLoading(true);
      setErrorLogsLoading(true);
      setSlowQueriesLoading(true);
      setUsageMetricsLoading(true);
      setModuleUsageLoading(true);
      setErrorTrendsLoading(true);
      setModuleErrorsLoading(true);
      setRepeatedErrorsLoading(true);
      if (showSupabaseLogs) setSupabaseLogsLoading(true);

      const promises = [
        getSystemHealth(),
        getErrorLogs(
          100,
          0,
          errorLogFilter,
          dateRange.from,
          dateRange.to,
          moduleFilter,
        ),
        getSlowQueries(100, 0, minQueryDuration),
        getUsageMetrics(startDate, endDate),
        getModuleUsage(),
        getErrorTrends(dateRange.from, dateRange.to),
        getErrorsByModule(dateRange.from, dateRange.to),
        getRepeatedErrors(dateRange.from, dateRange.to),
      ];

      if (showSupabaseLogs) {
        promises.push(getSupabaseLogs(dateRange.from, dateRange.to));
      }

      const results = await Promise.all(promises);

      setSystemHealth(results[0]);
      setErrorLogs(results[1]);
      setSlowQueries(results[2]);
      setUsageMetrics(results[3]);
      setModuleUsage(results[4]);
      setErrorTrends(results[5]);
      setModuleErrors(results[6]);
      setRepeatedErrors(results[7]);
      if (showSupabaseLogs) setSupabaseLogs(results[8]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setHealthLoading(false);
      setErrorLogsLoading(false);
      setSlowQueriesLoading(false);
      setUsageMetricsLoading(false);
      setModuleUsageLoading(false);
      setErrorTrendsLoading(false);
      setModuleErrorsLoading(false);
      setRepeatedErrorsLoading(false);
      if (showSupabaseLogs) setSupabaseLogsLoading(false);
    }
  };

  // Handle retry failed job
  const handleRetryJob = async (jobId: string) => {
    try {
      await retryFailedJob(jobId);
      // Refresh error logs after retry
      const logs = await getErrorLogs(
        100,
        0,
        errorLogFilter,
        dateRange.from,
        dateRange.to,
        moduleFilter,
      );
      setErrorLogs(logs);
    } catch (error) {
      console.error("Error retrying job:", error);
    }
  };

  // Get AI suggestions for fixing an error
  const getAISuggestions = (error: ErrorLog | RepeatedError) => {
    const prompt = `I'm seeing the following error in my application logs. Please analyze it and suggest potential fixes:\n\nError Message: ${error.message}\nSource: ${error.source}${error.stackTrace ? `\nStack Trace: ${error.stackTrace}` : ""}\n\nPlease provide 2-3 possible causes and solutions.`;
    promptAIAssistant(prompt);
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

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "healthy":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Get log level icon
  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "critical":
        return <Flame className="h-4 w-4 text-red-600" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Get log level badge variant
  const getLogLevelBadgeVariant = (
    level: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (level) {
      case "critical":
        return "destructive";
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Get available modules from error logs
  const availableModules = useMemo(() => {
    const modules = new Set<string>();
    errorLogs.forEach((log) => {
      if (log.source) modules.add(log.source);
    });
    return Array.from(modules).sort();
  }, [errorLogs]);

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
          {effectiveRTL ? "لوحة المراقبة" : "Monitoring Dashboard"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={
              healthLoading ||
              errorLogsLoading ||
              slowQueriesLoading ||
              usageMetricsLoading ||
              moduleUsageLoading
            }
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 ${healthLoading || errorLogsLoading || slowQueriesLoading || usageMetricsLoading || moduleUsageLoading ? "animate-spin" : ""}`}
            />
            {effectiveRTL ? "تحديث الكل" : "Refresh All"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="system" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="system">
            <Server className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "صحة النظام" : "System Health"}
          </TabsTrigger>
          <TabsTrigger value="logs">
            <AlertTriangle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "سجلات الأخطاء" : "Error Logs"}
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart3 className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "تحليلات الأخطاء" : "Error Insights"}
          </TabsTrigger>
          <TabsTrigger value="queries">
            <Database className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "الاستعلامات البطيئة" : "Slow Queries"}
          </TabsTrigger>
          <TabsTrigger value="usage">
            <Users className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "مقاييس الاستخدام" : "Usage Metrics"}
          </TabsTrigger>
          {showSupabaseLogs && (
            <TabsTrigger value="supabase">
              <Webhook className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "سجلات Supabase" : "Supabase Logs"}
            </TabsTrigger>
          )}
        </TabsList>

        {/* System Health Tab */}
        <TabsContent value="system" className="space-y-6">
          {healthLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : healthError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{healthError}</AlertDescription>
            </Alert>
          ) : systemHealth ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System Status Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL ? "حالة النظام" : "System Status"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {effectiveRTL ? "الحالة" : "Status"}
                          </p>
                          <div className="flex items-center">
                            {systemHealth.status === "healthy" ? (
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2 rtl:ml-2 rtl:mr-0" />
                            ) : systemHealth.status === "degraded" ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 rtl:ml-2 rtl:mr-0" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mr-2 rtl:ml-2 rtl:mr-0" />
                            )}
                            <span
                              className={`font-medium ${getStatusColor(systemHealth.status)}`}
                            >
                              {systemHealth.status === "healthy"
                                ? effectiveRTL
                                  ? "صحي"
                                  : "Healthy"
                                : systemHealth.status === "degraded"
                                  ? effectiveRTL
                                    ? "متدهور"
                                    : "Degraded"
                                  : effectiveRTL
                                    ? "متوقف"
                                    : "Down"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {effectiveRTL ? "وقت التشغيل" : "Uptime"}
                          </p>
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 text-primary mr-2 rtl:ml-2 rtl:mr-0" />
                            <span className="font-medium">
                              {formatUptime(systemHealth.uptime)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {effectiveRTL ? "آخر إعادة تشغيل" : "Last Restart"}
                          </p>
                          <p className="font-medium">
                            {formatDate(systemHealth.lastRestart)}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {effectiveRTL ? "الإصدار" : "Version"}
                          </p>
                          <p className="font-medium">{systemHealth.version}</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {effectiveRTL ? "البيئة" : "Environment"}
                          </p>
                          <p className="font-medium">
                            {systemHealth.environment === "production"
                              ? effectiveRTL
                                ? "إنتاج"
                                : "Production"
                              : effectiveRTL
                                ? "تجريبي"
                                : "Staging"}
                          </p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {effectiveRTL ? "وقت الاستجابة" : "Response Time"}
                          </p>
                          <p className="font-medium">
                            {systemHealth.responseTime} ms
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Resource Usage Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL ? "استخدام الموارد" : "Resource Usage"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {effectiveRTL ? "وحدة المعالجة المركزية" : "CPU"}
                          </span>
                          <span className="text-sm font-medium">
                            {systemHealth.cpuUsage}%
                          </span>
                        </div>
                        <Progress
                          value={systemHealth.cpuUsage}
                          className="h-2"
                          indicatorClassName={
                            systemHealth.cpuUsage > 80
                              ? "bg-red-500"
                              : systemHealth.cpuUsage > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {effectiveRTL ? "الذاكرة" : "Memory"}
                          </span>
                          <span className="text-sm font-medium">
                            {systemHealth.memoryUsage}%
                          </span>
                        </div>
                        <Progress
                          value={systemHealth.memoryUsage}
                          className="h-2"
                          indicatorClassName={
                            systemHealth.memoryUsage > 80
                              ? "bg-red-500"
                              : systemHealth.memoryUsage > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }
                        />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            {effectiveRTL ? "القرص" : "Disk"}
                          </span>
                          <span className="text-sm font-medium">
                            {systemHealth.diskUsage}%
                          </span>
                        </div>
                        <Progress
                          value={systemHealth.diskUsage}
                          className="h-2"
                          indicatorClassName={
                            systemHealth.diskUsage > 80
                              ? "bg-red-500"
                              : systemHealth.diskUsage > 60
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleExportData(systemHealth, "system-health")
                  }
                >
                  <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "تصدير البيانات" : "Export Data"}
                </Button>
              </div>
            </>
          ) : null}
        </TabsContent>

        {/* Error Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Label htmlFor="log-filter">
                  {effectiveRTL ? "تصفية حسب المستوى:" : "Filter by level:"}
                </Label>
                <Select
                  value={errorLogFilter || "all"}
                  onValueChange={(value) =>
                    setErrorLogFilter(
                      value === "all" ? undefined : (value as ErrorSeverity),
                    )
                  }
                >
                  <SelectTrigger id="log-filter" className="w-[180px]">
                    <SelectValue
                      placeholder={
                        effectiveRTL ? "جميع المستويات" : "All Levels"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {effectiveRTL ? "جميع المستويات" : "All Levels"}
                    </SelectItem>
                    <SelectItem value="critical">
                      {effectiveRTL ? "حرج" : "Critical"}
                    </SelectItem>
                    <SelectItem value="error">
                      {effectiveRTL ? "خطأ" : "Error"}
                    </SelectItem>
                    <SelectItem value="warning">
                      {effectiveRTL ? "تحذير" : "Warning"}
                    </SelectItem>
                    <SelectItem value="info">
                      {effectiveRTL ? "معلومات" : "Info"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Label htmlFor="module-filter">
                  {effectiveRTL ? "تصفية حسب الوحدة:" : "Filter by module:"}
                </Label>
                <Select
                  value={moduleFilter || "all"}
                  onValueChange={(value) =>
                    setModuleFilter(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger id="module-filter" className="w-[180px]">
                    <SelectValue
                      placeholder={
                        effectiveRTL ? "جميع الوحدات" : "All Modules"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {effectiveRTL ? "جميع الوحدات" : "All Modules"}
                    </SelectItem>
                    {availableModules.map((module) => (
                      <SelectItem key={module} value={module}>
                        {module}
                      </SelectItem>
                    ))}
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

            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData(errorLogs, "error-logs")}
              >
                <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {effectiveRTL ? "تصدير السجلات" : "Export Logs"}
              </Button>
            </div>
          </div>

          {errorLogsLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : errorLogsError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorLogsError}</AlertDescription>
            </Alert>
          ) : errorLogs.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {effectiveRTL ? "لا توجد سجلات" : "No Logs Found"}
              </h3>
              <p className="text-muted-foreground">
                {effectiveRTL
                  ? "لم يتم العثور على سجلات أخطاء تطابق معايير التصفية الخاصة بك"
                  : "No error logs found matching your filter criteria"}
              </p>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {errorLogs.map((log) => (
                      <div
                        key={log.id}
                        className="border rounded-md overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            setExpandedLogId(
                              expandedLogId === log.id ? null : log.id,
                            )
                          }
                        >
                          <div className="flex items-center space-x-3 rtl:space-x-reverse">
                            {getLogLevelIcon(log.level)}
                            <div>
                              <div className="font-medium">{log.message}</div>
                              <div className="text-xs text-muted-foreground">
                                {log.source} - {formatDate(log.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <Badge variant={getLogLevelBadgeVariant(log.level)}>
                              {log.level === "critical"
                                ? effectiveRTL
                                  ? "حرج"
                                  : "Critical"
                                : log.level === "error"
                                  ? effectiveRTL
                                    ? "خطأ"
                                    : "Error"
                                  : log.level === "warning"
                                    ? effectiveRTL
                                      ? "تحذير"
                                      : "Warning"
                                    : effectiveRTL
                                      ? "معلومات"
                                      : "Info"}
                            </Badge>
                            {log.isBackgroundJob && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRetryJob(log.id);
                                      }}
                                    >
                                      <RotateCw className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {effectiveRTL
                                        ? "إعادة محاولة المهمة"
                                        : "Retry job"}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      getAISuggestions(log);
                                    }}
                                  >
                                    <Sparkles className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {effectiveRTL
                                      ? "اقتراحات الذكاء الاصطناعي"
                                      : "AI suggestions"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            {expandedLogId === log.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>

                        {expandedLogId === log.id && (
                          <div className="p-3 border-t bg-muted/10">
                            {log.stackTrace && (
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">
                                  {effectiveRTL
                                    ? "تتبع المكدس:"
                                    : "Stack Trace:"}
                                </h5>
                                <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                                  {log.stackTrace}
                                </pre>
                              </div>
                            )}

                            {log.userId && (
                              <div className="mb-2">
                                <span className="text-sm font-medium">
                                  {effectiveRTL ? "معرف المستخدم:" : "User ID:"}{" "}
                                </span>
                                <span className="text-sm">{log.userId}</span>
                              </div>
                            )}

                            {log.metadata && (
                              <div>
                                <h5 className="text-sm font-medium mb-1">
                                  {effectiveRTL ? "بيانات وصفية:" : "Metadata:"}
                                </h5>
                                <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
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

        {/* Error Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Error Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {effectiveRTL ? "اتجاهات الأخطاء" : "Error Trends"}
                </CardTitle>
                <CardDescription>
                  {effectiveRTL
                    ? "عدد الأخطاء حسب المستوى على مدار الوقت"
                    : "Error count by severity level over time"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {errorTrendsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={errorTrends}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="critical"
                          name={effectiveRTL ? "حرج" : "Critical"}
                          stroke="#ef4444"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="error"
                          name={effectiveRTL ? "خطأ" : "Error"}
                          stroke="#f97316"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="warning"
                          name={effectiveRTL ? "تحذير" : "Warning"}
                          stroke="#eab308"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="info"
                          name={effectiveRTL ? "معلومات" : "Info"}
                          stroke="#3b82f6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Errors by Module Chart */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {effectiveRTL ? "الأخطاء حسب الوحدة" : "Errors by Module"}
                </CardTitle>
                <CardDescription>
                  {effectiveRTL
                    ? "توزيع الأخطاء عبر وحدات التطبيق المختلفة"
                    : "Distribution of errors across different application modules"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moduleErrorsLoading ? (
                  <div className="flex justify-center items-center h-[300px]">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={moduleErrors.sort((a, b) => b.total - a.total)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="module" />
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                          dataKey="critical"
                          name={effectiveRTL ? "حرج" : "Critical"}
                          stackId="a"
                          fill="#ef4444"
                        />
                        <Bar
                          dataKey="error"
                          name={effectiveRTL ? "خطأ" : "Error"}
                          stackId="a"
                          fill="#f97316"
                        />
                        <Bar
                          dataKey="warning"
                          name={effectiveRTL ? "تحذير" : "Warning"}
                          stackId="a"
                          fill="#eab308"
                        />
                        <Bar
                          dataKey="info"
                          name={effectiveRTL ? "معلومات" : "Info"}
                          stackId="a"
                          fill="#3b82f6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Repeated Errors Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {effectiveRTL ? "الأخطاء المتكررة" : "Repeated Errors"}
              </CardTitle>
              <CardDescription>
                {effectiveRTL
                  ? "الأخطاء التي تحدث بشكل متكرر مع اقتراحات الإصلاح"
                  : "Frequently occurring errors with fix suggestions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {repeatedErrorsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : repeatedErrors.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {effectiveRTL
                      ? "لا توجد أخطاء متكررة"
                      : "No Repeated Errors"}
                  </h3>
                  <p className="text-muted-foreground">
                    {effectiveRTL
                      ? "لم يتم العثور على أخطاء متكررة في النطاق الزمني المحدد"
                      : "No repeated errors found in the specified time range"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {repeatedErrors.map((error) => (
                    <Card
                      key={error.id}
                      className="border-l-4"
                      style={{
                        borderLeftColor:
                          error.level === "critical"
                            ? "#ef4444"
                            : error.level === "error"
                              ? "#f97316"
                              : "#eab308",
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base flex items-center">
                            {getLogLevelIcon(error.level)}
                            <span className="ml-2">{error.message}</span>
                          </CardTitle>
                          <Badge
                            variant={getLogLevelBadgeVariant(error.level)}
                            className="ml-2"
                          >
                            {error.occurrences}{" "}
                            {effectiveRTL ? "مرات" : "occurrences"}
                          </Badge>
                        </div>
                        <CardDescription>
                          {error.source} -{" "}
                          {effectiveRTL ? "آخر حدوث" : "Last occurred"}:{" "}
                          {formatDate(error.lastOccurrence)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        {error.aiSuggestion ? (
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="flex items-center mb-2">
                              <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                              <span className="font-medium">
                                {effectiveRTL
                                  ? "اقتراح الذكاء الاصطناعي"
                                  : "AI Suggestion"}
                              </span>
                            </div>
                            <p className="text-sm">{error.aiSuggestion}</p>
                          </div>
                        ) : (
                          <div className="flex">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => getAISuggestions(error)}
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              {effectiveRTL
                                ? "الحصول على اقتراحات"
                                : "Get suggestions"}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          {error.isBackgroundJob && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => handleRetryJob(error.id)}
                            >
                              <RotateCw className="h-3 w-3 mr-1" />
                              {effectiveRTL
                                ? "إعادة محاولة المهمة"
                                : "Retry job"}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              // Filter logs to show only this error pattern
                              setErrorLogFilter(error.level as ErrorSeverity);
                              if (error.source) setModuleFilter(error.source);
                              // Switch to logs tab
                              document.querySelector('[value="logs"]')?.click();
                            }}
                          >
                            <Search className="h-3 w-3 mr-1" />
                            {effectiveRTL
                              ? "عرض كل الحالات"
                              : "View all instances"}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Slow Queries Tab */}
        <TabsContent value="queries" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Label htmlFor="duration-filter">
                {effectiveRTL
                  ? "الحد الأدنى للمدة (مللي ثانية):"
                  : "Min Duration (ms):"}
              </Label>
              <Select
                value={minQueryDuration?.toString() || "all"}
                onValueChange={(value) =>
                  setMinQueryDuration(
                    value === "all" ? undefined : parseInt(value),
                  )
                }
              >
                <SelectTrigger id="duration-filter" className="w-[180px]">
                  <SelectValue
                    placeholder={
                      effectiveRTL ? "جميع الاستعلامات" : "All Queries"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {effectiveRTL ? "جميع الاستعلامات" : "All Queries"}
                  </SelectItem>
                  <SelectItem value="500">
                    {effectiveRTL ? "أكثر من 500 مللي ثانية" : "> 500ms"}
                  </SelectItem>
                  <SelectItem value="1000">
                    {effectiveRTL ? "أكثر من 1 ثانية" : "> 1s"}
                  </SelectItem>
                  <SelectItem value="3000">
                    {effectiveRTL ? "أكثر من 3 ثواني" : "> 3s"}
                  </SelectItem>
                  <SelectItem value="5000">
                    {effectiveRTL ? "أكثر من 5 ثواني" : "> 5s"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData(slowQueries, "slow-queries")}
            >
              <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "تصدير الاستعلامات" : "Export Queries"}
            </Button>
          </div>

          {slowQueriesLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : slowQueriesError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{slowQueriesError}</AlertDescription>
            </Alert>
          ) : slowQueries.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {effectiveRTL ? "لا توجد استعلامات" : "No Queries Found"}
              </h3>
              <p className="text-muted-foreground">
                {effectiveRTL
                  ? "لم يتم العثور على استعلامات بطيئة تطابق معايير التصفية الخاصة بك"
                  : "No slow queries found matching your filter criteria"}
              </p>
            </div>
          ) : (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL
                      ? "توزيع الاستعلامات البطيئة"
                      : "Slow Query Distribution"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={slowQueries
                          .reduce(
                            (acc, query) => {
                              const table = query.table;
                              const existingEntry = acc.find(
                                (item) => item.table === table,
                              );
                              if (existingEntry) {
                                existingEntry.count += 1;
                                existingEntry.totalDuration += query.duration;
                              } else {
                                acc.push({
                                  table,
                                  count: 1,
                                  totalDuration: query.duration,
                                  avgDuration: query.duration,
                                });
                              }
                              return acc;
                            },
                            [] as {
                              table: string;
                              count: number;
                              totalDuration: number;
                              avgDuration: number;
                            }[],
                          )
                          .map((item) => ({
                            ...item,
                            avgDuration: Math.round(
                              item.totalDuration / item.count,
                            ),
                          }))
                          .sort((a, b) => b.count - a.count)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="table" />
                        <YAxis
                          yAxisId="left"
                          orientation="left"
                          stroke="#8884d8"
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#82ca9d"
                        />
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="count"
                          name={
                            effectiveRTL ? "عدد الاستعلامات" : "Query Count"
                          }
                          fill="#8884d8"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="avgDuration"
                          name={
                            effectiveRTL
                              ? "متوسط المدة (مللي ثانية)"
                              : "Avg Duration (ms)"
                          }
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-2">
                      {slowQueries.map((query) => (
                        <div
                          key={query.id}
                          className="border rounded-md overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              setExpandedLogId(
                                expandedLogId === query.id ? null : query.id,
                              )
                            }
                          >
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Database className="h-4 w-4 text-primary" />
                              <div>
                                <div className="font-medium">{query.table}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(query.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Badge
                                variant={
                                  query.duration > 3000
                                    ? "destructive"
                                    : query.duration > 1000
                                      ? "default"
                                      : "outline"
                                }
                              >
                                {query.duration} ms
                              </Badge>
                              {expandedLogId === query.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {expandedLogId === query.id && (
                            <div className="p-3 border-t bg-muted/10">
                              <div className="mb-3">
                                <h5 className="text-sm font-medium mb-1">
                                  {effectiveRTL ? "استعلام:" : "Query:"}
                                </h5>
                                <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                                  {query.query}
                                </pre>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium">
                                    {effectiveRTL ? "المصدر:" : "Source:"}{" "}
                                  </span>
                                  <span>{query.source}</span>
                                </div>
                                {query.userId && (
                                  <div>
                                    <span className="font-medium">
                                      {effectiveRTL
                                        ? "معرف المستخدم:"
                                        : "User ID:"}{" "}
                                    </span>
                                    <span>{query.userId}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Usage Metrics Tab */}
        <TabsContent value="usage" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Label htmlFor="start-date">
                {effectiveRTL ? "تاريخ البدء:" : "Start Date:"}
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-[180px]"
              />

              <Label htmlFor="end-date">
                {effectiveRTL ? "تاريخ الانتهاء:" : "End Date:"}
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="w-[180px]"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportData({ usageMetrics, moduleUsage }, "usage-metrics")
              }
            >
              <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "تصدير البيانات" : "Export Data"}
            </Button>
          </div>

          {usageMetricsLoading || moduleUsageLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : usageMetricsError || moduleUsageError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {usageMetricsError || moduleUsageError}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Daily Active Users Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL
                      ? "المستخدمون النشطون يوميًا"
                      : "Daily Active Users"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={usageMetrics}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="activeUsers"
                          name={
                            effectiveRTL ? "المستخدمون النشطون" : "Active Users"
                          }
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="totalSessions"
                          name={
                            effectiveRTL ? "إجمالي الجلسات" : "Total Sessions"
                          }
                          stroke="#82ca9d"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Average Session Duration Chart */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL
                      ? "متوسط مدة الجلسة"
                      : "Average Session Duration"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={usageMetrics}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Bar
                          dataKey="avgSessionDuration"
                          name={
                            effectiveRTL
                              ? "متوسط المدة (ثانية)"
                              : "Avg Duration (sec)"
                          }
                          fill="#8884d8"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Module Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL ? "استخدام الوحدات" : "Module Usage"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={moduleUsage}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="accessCount"
                            nameKey="module"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {moduleUsage.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <RechartsTooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={moduleUsage.sort(
                            (a, b) => b.accessCount - a.accessCount,
                          )}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis type="category" dataKey="module" />
                          <RechartsTooltip />
                          <Legend />
                          <Bar
                            dataKey="accessCount"
                            name={
                              effectiveRTL ? "عدد الزيارات" : "Access Count"
                            }
                            fill="#8884d8"
                          />
                          <Bar
                            dataKey="uniqueUsers"
                            name={
                              effectiveRTL
                                ? "المستخدمون الفريدون"
                                : "Unique Users"
                            }
                            fill="#82ca9d"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Supabase Logs Tab */}
        {showSupabaseLogs && (
          <TabsContent value="supabase" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {effectiveRTL ? "سجلات Supabase" : "Supabase Logs"}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportData(supabaseLogs, "supabase-logs")}
              >
                <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {effectiveRTL ? "تصدير السجلات" : "Export Logs"}
              </Button>
            </div>

            {supabaseLogsLoading ? (
              <div className="flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : supabaseLogsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{supabaseLogsError}</AlertDescription>
              </Alert>
            ) : supabaseLogs.length === 0 ? (
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {effectiveRTL ? "لا توجد سجلات" : "No Logs Found"}
                </h3>
                <p className="text-muted-foreground">
                  {effectiveRTL
                    ? "لم يتم العثور على سجلات Supabase في النطاق الزمني المحدد"
                    : "No Supabase logs found in the specified time range"}
                </p>
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[600px]">
                    <div className="p-4 space-y-2">
                      {supabaseLogs.map((log) => (
                        <div
                          key={log.id}
                          className="border rounded-md overflow-hidden"
                        >
                          <div
                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              setExpandedLogId(
                                expandedLogId === log.id ? null : log.id,
                              )
                            }
                          >
                            <div className="flex items-center space-x-3 rtl:space-x-reverse">
                              <Database className="h-4 w-4 text-primary" />
                              <div>
                                <div className="font-medium">{log.event}</div>
                                <div className="text-xs text-muted-foreground">
                                  {log.schema}.{log.table} -{" "}
                                  {formatDate(log.timestamp)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Badge variant="outline">{log.method}</Badge>
                              {expandedLogId === log.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>

                          {expandedLogId === log.id && (
                            <div className="p-3 border-t bg-muted/10">
                              {log.query && (
                                <div className="mb-3">
                                  <h5 className="text-sm font-medium mb-1">
                                    {effectiveRTL ? "استعلام:" : "Query:"}
                                  </h5>
                                  <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                                    {log.query}
                                  </pre>
                                </div>
                              )}

                              {log.error && (
                                <div className="mb-3">
                                  <h5 className="text-sm font-medium mb-1 text-red-500">
                                    {effectiveRTL ? "خطأ:" : "Error:"}
                                  </h5>
                                  <pre className="bg-red-50 dark:bg-red-950/20 p-2 rounded text-xs font-mono overflow-x-auto text-red-600 dark:text-red-400">
                                    {log.error}
                                  </pre>
                                </div>
                              )}

                              {log.executionTime && (
                                <div className="mb-2">
                                  <span className="text-sm font-medium">
                                    {effectiveRTL
                                      ? "وقت التنفيذ:"
                                      : "Execution Time:"}{" "}
                                  </span>
                                  <span className="text-sm">
                                    {log.executionTime} ms
                                  </span>
                                </div>
                              )}

                              {log.metadata && (
                                <div>
                                  <h5 className="text-sm font-medium mb-1">
                                    {effectiveRTL
                                      ? "بيانات وصفية:"
                                      : "Metadata:"}
                                  </h5>
                                  <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto">
                                    {JSON.stringify(log.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center mt-4">
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://supabase.com/dashboard/project/" +
                        import.meta.env.VITE_SUPABASE_PROJECT_ID +
                        "/logs",
                      "_blank",
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL
                    ? "فتح لوحة تحكم Supabase"
                    : "Open Supabase Dashboard"}
                </Button>
              </div>
              {showSentryLogs && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://sentry.io", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {effectiveRTL ? "فتح Sentry" : "Open Sentry"}
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

// Keep the default export for backward compatibility
export default MonitoringDashboard;
