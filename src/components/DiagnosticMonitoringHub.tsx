import React, { useState, useEffect } from "react";
import { Button } from "../frontend/components/ui/button";
import { Input } from "../frontend/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../frontend/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../frontend/components/ui/dialog";
import {
  Server,
  Database,
  FileText,
  Activity,
  BarChart,
  Clock,
  LineChart,
  Gauge,
  Search,
  DollarSign,
} from "lucide-react";
import DiagnosticPanel from "./DiagnosticPanel";
import DiagnosticLogsViewer from "./DiagnosticLogsViewer";
import SystemHealthMonitor from "./SystemHealthMonitor";
import SQLExecutionMonitor from "./SQLExecutionMonitor";
import DatabaseDiagnosticTool from "./DatabaseDiagnosticTool";
import DatabaseUtilsTester from "./DatabaseUtilsTester";

interface SystemMetric {
  name: string;
  value: number | string;
  unit?: string;
  status: "success" | "warning" | "error" | "info";
  trend?: "up" | "down" | "stable";
  change?: number;
}

const DiagnosticMonitoringHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [systemMetrics, setSystemMetrics] = useState<SystemMetric[]>([
    {
      name: "SQL Execution Success Rate",
      value: 98.5,
      unit: "%",
      status: "success",
      trend: "up",
      change: 2.3,
    },
    {
      name: "Average Query Time",
      value: 124,
      unit: "ms",
      status: "success",
      trend: "down",
      change: 15,
    },
    {
      name: "Failed Operations (24h)",
      value: 3,
      status: "warning",
      trend: "down",
      change: 2,
    },
    {
      name: "Database Connection Status",
      value: "Connected",
      status: "success",
      trend: "stable",
    },
    {
      name: "Edge Functions Status",
      value: "Operational",
      status: "success",
      trend: "stable",
    },
    {
      name: "RPC Functions Status",
      value: "Operational",
      status: "success",
      trend: "stable",
    },
  ]);

  const refreshMetrics = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, we would fetch fresh metrics here
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error refreshing metrics:", error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "info":
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  const getTrendIcon = (trend?: string) => {
    if (!trend) return null;

    switch (trend) {
      case "up":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        );
      case "stable":
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-600 dark:text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h14"
            />
          </svg>
        );
    }
  };

  // Filter metrics based on search query
  const filteredMetrics = systemMetrics.filter((metric) => {
    if (!searchQuery) return true;
    return (
      metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(metric.value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Monitoring & Diagnostics Dashboard
          </h2>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Button
              onClick={refreshMetrics}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg
                    className="-ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh Metrics
                </>
              )}
            </Button>
          </div>
        </div>

        {searchQuery && (
          <div className="text-sm text-gray-500 mb-2">
            Search results for "{searchQuery}": {filteredMetrics.length} of{" "}
            {systemMetrics.length}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMetrics.map((metric, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{metric.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    {metric.unit && (
                      <span className="ml-1 text-gray-500">{metric.unit}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}
                    >
                      {metric.status === "success"
                        ? "Good"
                        : metric.status === "warning"
                          ? "Warning"
                          : metric.status === "error"
                            ? "Error"
                            : "Info"}
                    </span>
                  </div>
                </div>
                {(metric.trend || metric.change) && (
                  <div className="mt-2 flex items-center text-sm">
                    {getTrendIcon(metric.trend)}
                    {metric.change && (
                      <span
                        className={`ml-1 ${
                          metric.trend === "up"
                            ? "text-green-600 dark:text-green-400"
                            : metric.trend === "down"
                              ? "text-red-600 dark:text-red-400"
                              : "text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {metric.change > 0 ? "+" : ""}
                        {metric.change}
                        {metric.unit}
                      </span>
                    )}
                    <span className="ml-1 text-gray-500">
                      since last update
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMetrics.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
              No results found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No metrics match your search for "{searchQuery}"
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </Button>
          </div>
        )}

        {filteredMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Quick diagnostic and repair tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Database Diagnostics
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Database Diagnostics</DialogTitle>
                        <DialogDescription>
                          Comprehensive analysis of database connection and SQL
                          execution capabilities
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <DiagnosticPanel />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Diagnostic Logs
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Diagnostic Logs</DialogTitle>
                        <DialogDescription>
                          View and analyze system diagnostic logs
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <DiagnosticLogsViewer />
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={refreshMetrics}
                  >
                    <BarChart className="mr-2 h-4 w-4" />
                    Refresh Metrics
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule Diagnostics
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="mr-2 h-5 w-5" />
                  System Status
                </CardTitle>
                <CardDescription>Overview of system health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Database Status</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Edge Functions</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>RPC Functions</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SQL Execution</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Available
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Diagnostic</span>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            Diagnostics
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <LineChart className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="diagnostics" className="space-y-4">
          <DiagnosticPanel />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <SQLExecutionMonitor />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <DiagnosticLogsViewer />
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Tabs defaultValue="diagnostic">
            <TabsList className="mb-4">
              <TabsTrigger value="diagnostic">Diagnostic Tool</TabsTrigger>
              <TabsTrigger value="tester">Database Tester</TabsTrigger>
            </TabsList>
            <TabsContent value="diagnostic">
              <DatabaseDiagnosticTool />
            </TabsContent>
            <TabsContent value="tester">
              <DatabaseUtilsTester />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagnosticMonitoringHub;
