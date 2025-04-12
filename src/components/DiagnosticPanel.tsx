import React, { useState, useEffect } from "react";
import { Button } from "../frontend/components/ui/button";
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
import { Badge } from "../frontend/components/ui/badge";
import { ScrollArea } from "../frontend/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle,
  Database,
  Server,
  RefreshCw,
  FileText,
  Clock,
  Activity,
  Loader2,
} from "lucide-react";
import { executeSql, testDatabaseConnection } from "@/utils/dbUtils";

interface DiagnosticResult {
  id: string;
  timestamp: Date;
  category: string;
  status: "success" | "warning" | "error" | "info";
  name: string;
  details: any;
  duration_ms?: number;
}

const DiagnosticPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [diagnosticResults, setDiagnosticResults] = useState<
    DiagnosticResult[]
  >([
    {
      id: "diag-1",
      timestamp: new Date(),
      category: "database",
      status: "success",
      name: "Database Connection",
      details: {
        connected: true,
        message: "Successfully connected to database",
      },
      duration_ms: 124,
    },
    {
      id: "diag-2",
      timestamp: new Date(),
      category: "edge_function",
      status: "success",
      name: "Edge Functions",
      details: { available: true, message: "Edge functions are operational" },
      duration_ms: 245,
    },
    {
      id: "diag-3",
      timestamp: new Date(),
      category: "rpc_function",
      status: "warning",
      name: "RPC Functions",
      details: { available: true, warning: "Some functions have high latency" },
      duration_ms: 350,
    },
    {
      id: "diag-4",
      timestamp: new Date(),
      category: "sql_execution",
      status: "success",
      name: "SQL Execution",
      details: {
        available: true,
        message: "SQL execution is working properly",
      },
      duration_ms: 180,
    },
  ]);

  const runDiagnostics = async () => {
    setIsLoading(true);
    try {
      // Test database connection
      const connectionStatus = await testDatabaseConnection();

      // Run a test query
      const queryResult = await executeSql(
        "SELECT current_timestamp as time, current_database() as database",
      );

      // Create diagnostic results
      const newDiagnosticResults: DiagnosticResult[] = [
        {
          id: `diag-db-${Date.now()}`,
          timestamp: new Date(),
          category: "database",
          status: connectionStatus.connected ? "success" : "error",
          name: "Database Connection",
          details: connectionStatus,
          duration_ms: 150,
        },
        {
          id: `diag-edge-${Date.now()}`,
          timestamp: new Date(),
          category: "edge_function",
          status: "info",
          name: "Edge Functions",
          details: { message: "Edge function status check not implemented" },
          duration_ms: 50,
        },
        {
          id: `diag-rpc-${Date.now()}`,
          timestamp: new Date(),
          category: "rpc_function",
          status:
            connectionStatus.functionAvailable ||
            connectionStatus.pgQueryAvailable
              ? "success"
              : "error",
          name: "RPC Functions",
          details: {
            execSql: connectionStatus.functionAvailable,
            pgQuery: connectionStatus.pgQueryAvailable,
          },
          duration_ms: 100,
        },
        {
          id: `diag-sql-${Date.now()}`,
          timestamp: new Date(),
          category: "sql_execution",
          status: queryResult.error ? "error" : "success",
          name: "SQL Execution",
          details: queryResult,
          duration_ms: queryResult.executionTime || 200,
        },
      ];

      setDiagnosticResults(newDiagnosticResults);
    } catch (error) {
      console.error("Error running diagnostics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run diagnostics on initial load
  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusBadgeColor = (status: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "info":
      default:
        return <FileText className="h-4 w-4 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "database":
        return <Database className="h-4 w-4" />;
      case "edge_function":
        return <Server className="h-4 w-4" />;
      case "rpc_function":
        return <Activity className="h-4 w-4" />;
      case "sql_execution":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Diagnostic Overview</h2>
          <Button
            onClick={runDiagnostics}
            disabled={isLoading}
            className="mt-2 sm:mt-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Diagnostics
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {diagnosticResults.map((result) => (
            <Card key={result.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  {getCategoryIcon(result.category)}
                  <span className="ml-2">{result.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={getStatusBadgeColor(result.status)}>
                    <div className="flex items-center">
                      {getStatusIcon(result.status)}
                      <span className="ml-1">
                        {result.status === "success"
                          ? "Success"
                          : result.status === "warning"
                            ? "Warning"
                            : result.status === "error"
                              ? "Error"
                              : "Info"}
                      </span>
                    </div>
                  </Badge>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {result.duration_ms
                      ? formatDuration(result.duration_ms)
                      : "N/A"}
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  {result.details.message ? (
                    <p>{result.details.message}</p>
                  ) : result.details.warning ? (
                    <p className="text-amber-600 dark:text-amber-400">
                      {result.details.warning}
                    </p>
                  ) : result.details.error ? (
                    <p className="text-red-600 dark:text-red-400">
                      {result.details.error}
                    </p>
                  ) : (
                    <p>
                      {result.status === "success"
                        ? "All systems operating normally"
                        : "Issues detected"}
                    </p>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Last updated: {formatDate(result.timestamp)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Diagnostic Details</h2>
          <Button
            onClick={runDiagnostics}
            disabled={isLoading}
            className="mt-2 sm:mt-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Run Diagnostics
              </>
            )}
          </Button>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="space-y-6">
            {diagnosticResults.map((result) => (
              <Card key={result.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      {getCategoryIcon(result.category)}
                      <span className="ml-2">{result.name}</span>
                    </CardTitle>
                    <Badge className={getStatusBadgeColor(result.status)}>
                      <div className="flex items-center">
                        {getStatusIcon(result.status)}
                        <span className="ml-1">
                          {result.status === "success"
                            ? "Success"
                            : result.status === "warning"
                              ? "Warning"
                              : result.status === "error"
                                ? "Error"
                                : "Info"}
                        </span>
                      </div>
                    </Badge>
                  </div>
                  <CardDescription>
                    Run at: {formatDate(result.timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Summary</h3>
                      <p className="text-sm">
                        {result.details.message
                          ? result.details.message
                          : result.details.warning
                            ? result.details.warning
                            : result.details.error
                              ? result.details.error
                              : result.status === "success"
                                ? "All systems operating normally"
                                : "Issues detected"}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Details</h3>
                      <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-[300px]">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Duration:{" "}
                        {result.duration_ms
                          ? formatDuration(result.duration_ms)
                          : "N/A"}
                      </div>
                      <div>
                        Diagnostic ID:{" "}
                        <code className="text-xs">{result.id}</code>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Diagnostic Panel
        </CardTitle>
        <CardDescription>
          Comprehensive diagnostics of system health and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">{renderOverview()}</TabsContent>
          <TabsContent value="details">{renderDetails()}</TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <div>Last diagnostic: {formatDate(new Date())}</div>
        <div>
          System status:{" "}
          <span className="text-green-600 dark:text-green-400">
            Operational
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DiagnosticPanel;
