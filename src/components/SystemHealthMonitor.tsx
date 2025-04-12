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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  BarChart,
  Clock,
  Database,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { diagnosticTool } from "@/utils/diagnosticTool";

interface HealthMetric {
  id: string;
  name: string;
  value: number | string;
  status: "healthy" | "warning" | "critical" | "unknown";
  lastChecked: Date;
  history?: Array<{
    timestamp: Date;
    value: number | string;
    status: "healthy" | "warning" | "critical" | "unknown";
  }>;
}

interface SystemComponent {
  id: string;
  name: string;
  status: "operational" | "degraded" | "outage" | "unknown";
  lastChecked: Date;
  metrics: HealthMetric[];
}

const SystemHealthMonitor: React.FC = () => {
  const { toast } = useToast();
  const { direction } = useLanguage();
  const rtl = direction === "rtl";
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [systemComponents, setSystemComponents] = useState<SystemComponent[]>([
    {
      id: "database",
      name: rtl ? "قاعدة البيانات" : "Database",
      status: "operational",
      lastChecked: new Date(),
      metrics: [
        {
          id: "connection",
          name: rtl ? "الاتصال" : "Connection",
          value: "Connected",
          status: "healthy",
          lastChecked: new Date(),
        },
        {
          id: "query_time",
          name: rtl ? "وقت الاستعلام" : "Query Time",
          value: "124ms",
          status: "healthy",
          lastChecked: new Date(),
        },
        {
          id: "error_rate",
          name: rtl ? "معدل الخطأ" : "Error Rate",
          value: "0.5%",
          status: "healthy",
          lastChecked: new Date(),
        },
      ],
    },
    {
      id: "edge_functions",
      name: rtl ? "وظائف الحافة" : "Edge Functions",
      status: "operational",
      lastChecked: new Date(),
      metrics: [
        {
          id: "availability",
          name: rtl ? "التوفر" : "Availability",
          value: "100%",
          status: "healthy",
          lastChecked: new Date(),
        },
        {
          id: "response_time",
          name: rtl ? "وقت الاستجابة" : "Response Time",
          value: "210ms",
          status: "healthy",
          lastChecked: new Date(),
        },
      ],
    },
    {
      id: "rpc_functions",
      name: rtl ? "وظائف RPC" : "RPC Functions",
      status: "operational",
      lastChecked: new Date(),
      metrics: [
        {
          id: "availability",
          name: rtl ? "التوفر" : "Availability",
          value: "100%",
          status: "healthy",
          lastChecked: new Date(),
        },
        {
          id: "response_time",
          name: rtl ? "وقت الاستجابة" : "Response Time",
          value: "95ms",
          status: "healthy",
          lastChecked: new Date(),
        },
      ],
    },
  ]);

  const refreshSystemHealth = async () => {
    setIsLoading(true);
    try {
      // Run diagnostics to get fresh data
      const diagnosticResults = await diagnosticTool.runFullDiagnostic();

      // Update database component
      const updatedComponents = [...systemComponents];
      const dbComponent = updatedComponents.find((c) => c.id === "database");
      if (dbComponent) {
        dbComponent.status = diagnosticResults.basicConnection.connected
          ? "operational"
          : "outage";
        dbComponent.lastChecked = new Date();

        // Update connection metric
        const connectionMetric = dbComponent.metrics.find(
          (m) => m.id === "connection",
        );
        if (connectionMetric) {
          connectionMetric.value = diagnosticResults.basicConnection.connected
            ? "Connected"
            : "Disconnected";
          connectionMetric.status = diagnosticResults.basicConnection.connected
            ? "healthy"
            : "critical";
          connectionMetric.lastChecked = new Date();
        }

        // Update query time metric if available
        if (diagnosticResults.executionTimeMs) {
          const queryTimeMetric = dbComponent.metrics.find(
            (m) => m.id === "query_time",
          );
          if (queryTimeMetric) {
            queryTimeMetric.value = `${diagnosticResults.executionTimeMs}ms`;
            queryTimeMetric.status =
              diagnosticResults.executionTimeMs < 200
                ? "healthy"
                : diagnosticResults.executionTimeMs < 500
                  ? "warning"
                  : "critical";
            queryTimeMetric.lastChecked = new Date();
          }
        }
      }

      // Update edge functions component
      const edgeFunctionsComponent = updatedComponents.find(
        (c) => c.id === "edge_functions",
      );
      if (edgeFunctionsComponent) {
        const edgeFunctionsOperational =
          diagnosticResults.edgeFunctions.sqlExecutorWorks ||
          diagnosticResults.edgeFunctions.executeSqlWorks;
        edgeFunctionsComponent.status = edgeFunctionsOperational
          ? "operational"
          : "degraded";
        edgeFunctionsComponent.lastChecked = new Date();

        // Update availability metric
        const availabilityMetric = edgeFunctionsComponent.metrics.find(
          (m) => m.id === "availability",
        );
        if (availabilityMetric) {
          availabilityMetric.value = edgeFunctionsOperational
            ? "100%"
            : "Partial";
          availabilityMetric.status = edgeFunctionsOperational
            ? "healthy"
            : "warning";
          availabilityMetric.lastChecked = new Date();
        }
      }

      // Update RPC functions component
      const rpcFunctionsComponent = updatedComponents.find(
        (c) => c.id === "rpc_functions",
      );
      if (rpcFunctionsComponent) {
        const rpcFunctionsOperational =
          diagnosticResults.rpcFunctions.pgQuery.available ||
          diagnosticResults.rpcFunctions.execSql.available;
        rpcFunctionsComponent.status = rpcFunctionsOperational
          ? "operational"
          : "degraded";
        rpcFunctionsComponent.lastChecked = new Date();

        // Update availability metric
        const availabilityMetric = rpcFunctionsComponent.metrics.find(
          (m) => m.id === "availability",
        );
        if (availabilityMetric) {
          availabilityMetric.value = rpcFunctionsOperational
            ? "100%"
            : "Partial";
          availabilityMetric.status = rpcFunctionsOperational
            ? "healthy"
            : "warning";
          availabilityMetric.lastChecked = new Date();
        }
      }

      setSystemComponents(updatedComponents);
      toast({
        title: rtl ? "تم تحديث حالة النظام" : "System Health Updated",
        description: rtl
          ? "تم تحديث معلومات حالة النظام بنجاح"
          : "System health information has been successfully updated",
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

  // Initial health check
  useEffect(() => {
    refreshSystemHealth();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "outage":
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "healthy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "degraded":
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "outage":
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return rtl ? "يعمل" : "Operational";
      case "degraded":
        return rtl ? "متدهور" : "Degraded";
      case "outage":
        return rtl ? "متوقف" : "Outage";
      case "healthy":
        return rtl ? "صحي" : "Healthy";
      case "warning":
        return rtl ? "تحذير" : "Warning";
      case "critical":
        return rtl ? "حرج" : "Critical";
      default:
        return rtl ? "غير معروف" : "Unknown";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {rtl ? "مراقبة صحة النظام" : "System Health Monitor"}
          </h2>
          <Button
            onClick={refreshSystemHealth}
            disabled={isLoading}
            className="mt-2 sm:mt-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {rtl ? "جاري التحديث..." : "Refreshing..."}
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {rtl ? "تحديث الحالة" : "Refresh Status"}
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              {rtl ? "حالة النظام" : "System Status"}
            </CardTitle>
            <CardDescription>
              {rtl
                ? "نظرة عامة على صحة مكونات النظام"
                : "Overview of system component health"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemComponents.map((component) => (
                <div key={component.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(component.status)}
                      <h3 className="text-lg font-medium ml-2">
                        {component.name}
                      </h3>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(component.status)}`}
                      >
                        {getStatusText(component.status)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {component.metrics.map((metric) => (
                      <div key={metric.id} className="border rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">
                            {metric.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(metric.status)}`}
                          >
                            {getStatusText(metric.status)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold">
                            {metric.value}
                          </span>
                          <span className="text-xs text-gray-500">
                            {rtl ? "آخر تحديث:" : "Last updated:"}{" "}
                            {formatDate(metric.lastChecked)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="text-sm text-gray-500">
              {rtl ? "آخر تحديث:" : "Last updated:"} {formatDate(new Date())}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSystemHealth}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {rtl ? "تحديث" : "Refresh"}
            </Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                {rtl ? "أداء قاعدة البيانات" : "Database Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>{rtl ? "متوسط وقت الاستعلام" : "Avg. Query Time"}</span>
                  <span className="font-bold">124ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{rtl ? "معدل الخطأ" : "Error Rate"}</span>
                  <span className="font-bold">0.5%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {rtl ? "الاستعلامات / الدقيقة" : "Queries / Minute"}
                  </span>
                  <span className="font-bold">245</span>
                </div>
                <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">
                    {rtl ? "الرسم البياني للأداء" : "Performance Chart"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="mr-2 h-5 w-5" />
                {rtl ? "أداء وظائف الحافة" : "Edge Functions Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>
                    {rtl ? "متوسط وقت الاستجابة" : "Avg. Response Time"}
                  </span>
                  <span className="font-bold">210ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{rtl ? "معدل الخطأ" : "Error Rate"}</span>
                  <span className="font-bold">0.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    {rtl ? "الاستدعاءات / الدقيقة" : "Invocations / Minute"}
                  </span>
                  <span className="font-bold">78</span>
                </div>
                <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">
                    {rtl ? "الرسم البياني للأداء" : "Performance Chart"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="database">
          <TabsList className="mb-4">
            {systemComponents.map((component) => (
              <TabsTrigger
                key={component.id}
                value={component.id}
                className="flex items-center"
              >
                {component.id === "database" && (
                  <Database className="mr-2 h-4 w-4" />
                )}
                {component.id === "edge_functions" && (
                  <Server className="mr-2 h-4 w-4" />
                )}
                {component.id === "rpc_functions" && (
                  <Activity className="mr-2 h-4 w-4" />
                )}
                {component.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {systemComponents.map((component) => (
            <TabsContent key={component.id} value={component.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {getStatusIcon(component.status)}
                      <span className="ml-2">{component.name}</span>
                    </CardTitle>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(component.status)}`}
                    >
                      {getStatusText(component.status)}
                    </span>
                  </div>
                  <CardDescription>
                    {rtl ? "آخر تحديث:" : "Last updated:"}{" "}
                    {formatDate(component.lastChecked)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {component.metrics.map((metric) => (
                        <Card key={metric.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {metric.name}
                              </CardTitle>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(metric.status)}`}
                              >
                                {getStatusText(metric.status)}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold">
                                {metric.value}
                              </span>
                              <span className="text-xs text-gray-500">
                                {rtl ? "آخر تحديث:" : "Last updated:"}{" "}
                                {formatDate(metric.lastChecked)}
                              </span>
                            </div>
                            {metric.history && (
                              <div className="mt-4 h-32 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                <span className="text-gray-500">
                                  {rtl
                                    ? "الرسم البياني التاريخي"
                                    : "Historical Chart"}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-lg font-medium mb-4">
                        {rtl ? "التشخيص والإجراءات" : "Diagnostics & Actions"}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Activity className="mr-2 h-4 w-4" />
                          {rtl ? "تشغيل التشخيص" : "Run Diagnostics"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {rtl ? "إعادة تعيين الاتصال" : "Reset Connection"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {rtl ? "عرض السجلات" : "View Logs"}
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <BarChart className="mr-2 h-4 w-4" />
                          {rtl ? "تحليل الأداء" : "Performance Analysis"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    onClick={refreshSystemHealth}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                    )}
                    {rtl ? "تحديث الحالة" : "Refresh Status"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            {rtl ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            {rtl ? "التفاصيل" : "Details"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {renderDetails()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthMonitor;
