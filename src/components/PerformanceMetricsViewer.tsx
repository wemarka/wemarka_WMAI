import React, { useState, useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  BarChart,
  Clock,
  Download,
  Calendar,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Filter,
  Database,
  Server,
  Activity,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { diagnosticTool } from "@/utils/diagnosticTool";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: string;
  trend?: "up" | "down" | "stable";
  change?: number;
}

const PerformanceMetricsViewer: React.FC = () => {
  const { toast } = useToast();
  const { direction } = useLanguage();
  const rtl = direction === "rtl";
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("database");
  const [timeRange, setTimeRange] = useState("24h");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    // Database metrics
    {
      id: "db_query_time_avg",
      name: rtl ? "متوسط وقت الاستعلام" : "Avg. Query Time",
      value: 124,
      unit: "ms",
      timestamp: new Date(),
      category: "database",
      trend: "down",
      change: 15,
    },
    {
      id: "db_query_time_p95",
      name: rtl ? "وقت الاستعلام (P95)" : "Query Time (P95)",
      value: 245,
      unit: "ms",
      timestamp: new Date(),
      category: "database",
      trend: "down",
      change: 12,
    },
    {
      id: "db_error_rate",
      name: rtl ? "معدل الخطأ" : "Error Rate",
      value: 0.5,
      unit: "%",
      timestamp: new Date(),
      category: "database",
      trend: "down",
      change: 0.2,
    },
    {
      id: "db_queries_per_min",
      name: rtl ? "الاستعلامات / الدقيقة" : "Queries / Minute",
      value: 245,
      unit: "",
      timestamp: new Date(),
      category: "database",
      trend: "up",
      change: 23,
    },

    // Edge functions metrics
    {
      id: "edge_response_time_avg",
      name: rtl ? "متوسط وقت الاستجابة" : "Avg. Response Time",
      value: 210,
      unit: "ms",
      timestamp: new Date(),
      category: "edge_functions",
      trend: "up",
      change: 15,
    },
    {
      id: "edge_response_time_p95",
      name: rtl ? "وقت الاستجابة (P95)" : "Response Time (P95)",
      value: 350,
      unit: "ms",
      timestamp: new Date(),
      category: "edge_functions",
      trend: "up",
      change: 25,
    },
    {
      id: "edge_error_rate",
      name: rtl ? "معدل الخطأ" : "Error Rate",
      value: 0.2,
      unit: "%",
      timestamp: new Date(),
      category: "edge_functions",
      trend: "down",
      change: 0.1,
    },
    {
      id: "edge_invocations_per_min",
      name: rtl ? "الاستدعاءات / الدقيقة" : "Invocations / Minute",
      value: 78,
      unit: "",
      timestamp: new Date(),
      category: "edge_functions",
      trend: "up",
      change: 12,
    },

    // RPC functions metrics
    {
      id: "rpc_response_time_avg",
      name: rtl ? "متوسط وقت الاستجابة" : "Avg. Response Time",
      value: 95,
      unit: "ms",
      timestamp: new Date(),
      category: "rpc_functions",
      trend: "down",
      change: 8,
    },
    {
      id: "rpc_response_time_p95",
      name: rtl ? "وقت الاستجابة (P95)" : "Response Time (P95)",
      value: 180,
      unit: "ms",
      timestamp: new Date(),
      category: "rpc_functions",
      trend: "down",
      change: 15,
    },
    {
      id: "rpc_error_rate",
      name: rtl ? "معدل الخطأ" : "Error Rate",
      value: 0.3,
      unit: "%",
      timestamp: new Date(),
      category: "rpc_functions",
      trend: "down",
      change: 0.2,
    },
    {
      id: "rpc_calls_per_min",
      name: rtl ? "المكالمات / الدقيقة" : "Calls / Minute",
      value: 156,
      unit: "",
      timestamp: new Date(),
      category: "rpc_functions",
      trend: "up",
      change: 18,
    },
  ]);

  const refreshMetrics = async () => {
    setIsLoading(true);
    try {
      // Run diagnostics to get fresh data
      const diagnosticResults = await diagnosticTool.runFullDiagnostic();

      // Update metrics based on diagnostic results
      // In a real implementation, we would update the metrics based on the diagnostic results
      // For now, we'll just simulate updating the timestamp
      const updatedMetrics = metrics.map((metric) => ({
        ...metric,
        timestamp: new Date(),
      }));

      // If we have execution time from diagnostics, update the database query time
      if (diagnosticResults.executionTimeMs) {
        const dbQueryTimeMetric = updatedMetrics.find(
          (m) => m.id === "db_query_time_avg",
        );
        if (dbQueryTimeMetric) {
          const oldValue = dbQueryTimeMetric.value;
          dbQueryTimeMetric.value = Math.round(
            diagnosticResults.executionTimeMs,
          );
          dbQueryTimeMetric.change = Math.round(
            oldValue - dbQueryTimeMetric.value,
          );
          dbQueryTimeMetric.trend =
            dbQueryTimeMetric.change > 0 ? "down" : "up";
        }
      }

      setMetrics(updatedMetrics);
      toast({
        title: rtl ? "تم تحديث المقاييس" : "Metrics Updated",
        description: rtl
          ? "تم تحديث مقاييس الأداء بنجاح"
          : "Performance metrics have been successfully updated",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: rtl ? "فشل التحديث" : "Update Failed",
        description: `${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial metrics fetch
  useEffect(() => {
    refreshMetrics();
  }, []);

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null;

    switch (trend) {
      case "up":
        return <ChevronUp className="h-4 w-4 text-red-500" />;
      case "down":
        return <ChevronDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend?: string, isPositive: boolean = false) => {
    if (!trend) return "text-gray-500";

    // For metrics where up is good (like throughput)
    if (isPositive) {
      return trend === "up" ? "text-green-500" : "text-red-500";
    }

    // For metrics where down is good (like error rate, response time)
    return trend === "down" ? "text-green-500" : "text-red-500";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  // Filter and sort metrics
  const filteredMetrics = metrics
    .filter((metric) => {
      if (categoryFilter === "all") return true;
      return metric.category === categoryFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.value - b.value;
      } else {
        return b.value - a.value;
      }
    });

  const renderMetricsTable = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {rtl ? "مقاييس الأداء" : "Performance Metrics"}
          </h2>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={rtl ? "النطاق الزمني" : "Time Range"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">
                  {rtl ? "ساعة واحدة" : "1 Hour"}
                </SelectItem>
                <SelectItem value="6h">
                  {rtl ? "6 ساعات" : "6 Hours"}
                </SelectItem>
                <SelectItem value="24h">
                  {rtl ? "24 ساعة" : "24 Hours"}
                </SelectItem>
                <SelectItem value="7d">{rtl ? "7 أيام" : "7 Days"}</SelectItem>
                <SelectItem value="30d">
                  {rtl ? "30 يوم" : "30 Days"}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={refreshMetrics}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue
                  placeholder={rtl ? "تصفية حسب الفئة" : "Filter by Category"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {rtl ? "جميع الفئات" : "All Categories"}
                </SelectItem>
                <SelectItem value="database">
                  {rtl ? "قاعدة البيانات" : "Database"}
                </SelectItem>
                <SelectItem value="edge_functions">
                  {rtl ? "وظائف الحافة" : "Edge Functions"}
                </SelectItem>
                <SelectItem value="rpc_functions">
                  {rtl ? "وظائف RPC" : "RPC Functions"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  {rtl ? "تصاعدي" : "Ascending"}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  {rtl ? "تنازلي" : "Descending"}
                </>
              )}
            </Button>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {rtl ? "تصدير" : "Export"}
            </Button>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {rtl ? "المقياس" : "Metric"}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {rtl ? "القيمة" : "Value"}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {rtl ? "الاتجاه" : "Trend"}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {rtl ? "الفئة" : "Category"}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  {rtl ? "آخر تحديث" : "Last Updated"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {filteredMetrics.map((metric) => {
                const isPositiveMetric =
                  metric.id.includes("per_min") ||
                  metric.id.includes("throughput");
                return (
                  <tr key={metric.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {metric.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="font-bold">{metric.value}</span>
                      {metric.unit && (
                        <span className="ml-1 text-gray-500">
                          {metric.unit}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {getTrendIcon(metric.trend)}
                        {metric.change && (
                          <span
                            className={`ml-1 ${getTrendColor(metric.trend, isPositiveMetric)}`}
                          >
                            {metric.trend === "up" ? "+" : ""}
                            {metric.change}
                            {metric.unit}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {metric.category === "database"
                          ? rtl
                            ? "قاعدة البيانات"
                            : "Database"
                          : metric.category === "edge_functions"
                            ? rtl
                              ? "وظائف الحافة"
                              : "Edge Functions"
                            : rtl
                              ? "وظائف RPC"
                              : "RPC Functions"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {formatDate(metric.timestamp)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {rtl
              ? `عرض ${filteredMetrics.length} من أصل ${metrics.length} مقياس`
              : `Showing ${filteredMetrics.length} of ${metrics.length} metrics`}
          </span>
          <Button
            variant="outline"
            onClick={refreshMetrics}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {rtl ? "جاري التحديث..." : "Refreshing..."}
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {rtl ? "تحديث المقاييس" : "Refresh Metrics"}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderCategoryMetrics = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {activeTab === "database"
              ? rtl
                ? "مقاييس قاعدة البيانات"
                : "Database Metrics"
              : activeTab === "edge_functions"
                ? rtl
                  ? "مقاييس وظائف الحافة"
                  : "Edge Functions Metrics"
                : rtl
                  ? "مقاييس وظائف RPC"
                  : "RPC Functions Metrics"}
          </h2>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={rtl ? "النطاق الزمني" : "Time Range"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">
                  {rtl ? "ساعة واحدة" : "1 Hour"}
                </SelectItem>
                <SelectItem value="6h">
                  {rtl ? "6 ساعات" : "6 Hours"}
                </SelectItem>
                <SelectItem value="24h">
                  {rtl ? "24 ساعة" : "24 Hours"}
                </SelectItem>
                <SelectItem value="7d">{rtl ? "7 أيام" : "7 Days"}</SelectItem>
                <SelectItem value="30d">
                  {rtl ? "30 يوم" : "30 Days"}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={refreshMetrics}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {metrics
            .filter((metric) => metric.category === activeTab)
            .map((metric) => {
              const isPositiveMetric =
                metric.id.includes("per_min") ||
                metric.id.includes("throughput");
              return (
                <Card key={metric.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{metric.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold">
                          {metric.value}
                        </span>
                        {metric.unit && (
                          <span className="ml-1 text-gray-500">
                            {metric.unit}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon(metric.trend)}
                        {metric.change && (
                          <span
                            className={`ml-1 ${getTrendColor(metric.trend, isPositiveMetric)}`}
                          >
                            {metric.trend === "up" ? "+" : ""}
                            {metric.change}
                            {metric.unit}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                      <span className="text-gray-500">
                        {rtl ? "الرسم البياني" : "Chart"}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {rtl ? "آخر تحديث:" : "Last updated:"}{" "}
                      {formatDate(metric.timestamp)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "database"
                ? rtl
                  ? "تحليل أداء قاعدة البيانات"
                  : "Database Performance Analysis"
                : activeTab === "edge_functions"
                  ? rtl
                    ? "تحليل أداء وظائف الحافة"
                    : "Edge Functions Performance Analysis"
                  : rtl
                    ? "تحليل أداء وظائف RPC"
                    : "RPC Functions Performance Analysis"}
            </CardTitle>
            <CardDescription>
              {rtl
                ? "تحليل شامل للأداء على مدار الوقت"
                : "Comprehensive performance analysis over time"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
              <span className="text-gray-500">
                {rtl ? "الرسم البياني التحليلي" : "Analytical Chart"}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm text-gray-500">
              {rtl ? "النطاق الزمني:" : "Time Range:"}{" "}
              {timeRange === "1h"
                ? "1 Hour"
                : timeRange === "6h"
                  ? "6 Hours"
                  : timeRange === "24h"
                    ? "24 Hours"
                    : timeRange === "7d"
                      ? "7 Days"
                      : "30 Days"}
            </span>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              {rtl ? "تصدير البيانات" : "Export Data"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="all" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            {rtl ? "جميع المقاييس" : "All Metrics"}
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            {rtl ? "قاعدة البيانات" : "Database"}
          </TabsTrigger>
          <TabsTrigger value="edge_functions" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            {rtl ? "وظائف الحافة" : "Edge Functions"}
          </TabsTrigger>
          <TabsTrigger value="rpc_functions" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            {rtl ? "وظائف RPC" : "RPC Functions"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {renderMetricsTable()}
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          {renderCategoryMetrics()}
        </TabsContent>

        <TabsContent value="edge_functions" className="space-y-4">
          {renderCategoryMetrics()}
        </TabsContent>

        <TabsContent value="rpc_functions" className="space-y-4">
          {renderCategoryMetrics()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMetricsViewer;
