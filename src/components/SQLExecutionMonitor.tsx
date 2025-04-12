import React, { useState, useEffect, useCallback, useRef } from "react";
import { executeSql } from "@/utils/dbUtils";
import {
  getSQLExecutionMetrics,
  subscribeToDiagnosticLogs,
  SQLExecutionMetric,
  DiagnosticLog,
} from "@/frontend/services/monitoringService";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../frontend/components/ui/card";
import { Button } from "../frontend/components/ui/button";
import { Textarea } from "../frontend/components/ui/textarea";
import { Badge } from "../frontend/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../frontend/components/ui/tabs";

interface ExecutionResult {
  data: any;
  error: any;
  method: string;
  executionTime: number;
  fallbackUsed: boolean;
  retryAttempts?: number;
}

export default function SQLExecutionMonitor() {
  const [query, setQuery] = useState("SELECT current_timestamp as time");
  const [results, setResults] = useState<ExecutionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("editor");
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">(
    "24h",
  );
  const [metrics, setMetrics] = useState<SQLExecutionMetric[]>([]);
  const [recentExecutions, setRecentExecutions] = useState<DiagnosticLog[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRealtime, setIsRealtime] = useState(true);
  const subscriptionRef = useRef<{ unsubscribe: () => void } | null>(null);

  // Fetch SQL execution metrics from the monitoring system
  const fetchSQLMetrics = useCallback(async () => {
    setMetricsLoading(true);
    setMetricsError(null);
    try {
      const data = await getSQLExecutionMetrics(timeRange);
      setMetrics(data.metrics);
      setRecentExecutions(data.recentExecutions);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching SQL metrics:", error);
      setMetricsError(
        `Failed to fetch SQL metrics: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setMetricsLoading(false);
    }
  }, [timeRange]);

  // Handle real-time updates from subscription
  const handleRealtimeUpdate = useCallback((newLog: DiagnosticLog) => {
    console.log("Received real-time update:", newLog);
    setRecentExecutions((prev) => {
      // Add the new log to the beginning of the array and limit to 20 items
      const updated = [newLog, ...prev].slice(0, 20);
      return updated;
    });

    // Update the last updated timestamp
    setLastUpdated(new Date());

    // Refresh metrics after a short delay to allow for aggregation
    setTimeout(() => {
      fetchSQLMetrics();
    }, 2000);
  }, []);

  // Set up subscription to real-time updates
  useEffect(() => {
    // Initial fetch of metrics
    fetchSQLMetrics();

    let pollingInterval: ReturnType<typeof setInterval> | null = null;

    if (isRealtime) {
      try {
        // Set up subscription for real-time updates
        subscriptionRef.current =
          subscribeToDiagnosticLogs(handleRealtimeUpdate);
        console.log("Realtime subscription activated");

        // Also set up a backup polling mechanism with a longer interval
        // This ensures we get updates even if some real-time events are missed
        pollingInterval = setInterval(() => {
          fetchSQLMetrics();
        }, 300000); // Refresh every 5 minutes as a backup
      } catch (error) {
        console.error("Failed to set up realtime subscription:", error);
        setMetricsError(
          `Failed to set up realtime updates: ${error instanceof Error ? error.message : String(error)}`,
        );

        // Fall back to more frequent polling if subscription fails
        pollingInterval = setInterval(() => {
          fetchSQLMetrics();
        }, 60000); // Refresh every minute
      }
    } else {
      // Set up polling interval for metrics if realtime is disabled
      pollingInterval = setInterval(() => {
        fetchSQLMetrics();
      }, 60000); // Refresh every minute
    }

    // Clean up subscription and intervals when component unmounts or realtime setting changes
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
        console.log("Realtime subscription deactivated");
      }

      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [fetchSQLMetrics, isRealtime, handleRealtimeUpdate]);

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const startTime = performance.now();
      const result = await executeSql(query);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Add execution time to the result
      const resultWithTime = {
        ...result,
        executionTime: result.executionTime || executionTime,
      };

      setResults((prev) => [resultWithTime, ...prev].slice(0, 10)); // Keep last 10 results

      // Refresh metrics after executing a query
      // Add a small delay to allow the server to process and log the query
      setTimeout(() => {
        fetchSQLMetrics();
      }, 1000);
    } catch (error) {
      console.error("Error executing query:", error);
      setResults((prev) =>
        [
          {
            data: null,
            error,
            method: "error",
            executionTime: 0,
            fallbackUsed: false,
          },
          ...prev,
        ].slice(0, 10),
      );
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "edge-function":
        return "bg-green-500";
      case "execute_sql":
        return "bg-blue-500";
      case "pg_query":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-6">SQL Execution Monitor</h1>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="editor">SQL Editor</TabsTrigger>
          <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <Card>
            <CardHeader>
              <CardTitle>SQL Query Editor</CardTitle>
              <CardDescription>Write and execute SQL queries</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[200px] mb-4 font-mono"
                placeholder="Enter SQL query..."
              />
              <div className="flex gap-2">
                <Button onClick={executeQuery} disabled={loading}>
                  {loading ? "Executing..." : "Execute Query"}
                </Button>
                <Button variant="outline" onClick={clearResults}>
                  Clear Results
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          <Card>
            <CardHeader>
              <CardTitle>Execution Results</CardTitle>
              <CardDescription>
                View the results of your SQL queries
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No queries executed yet
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <Card key={index} className="overflow-hidden">
                      <CardHeader className="py-2 px-4 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <Badge className={getMethodBadgeColor(result.method)}>
                            {result.method}{" "}
                            {result.fallbackUsed && "(fallback)"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {result.executionTime
                              ? `${result.executionTime.toFixed(2)}ms`
                              : "N/A"}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="py-3 px-4">
                        {result.error ? (
                          <div className="text-red-500">
                            <p className="font-semibold">Error:</p>
                            <pre className="text-sm overflow-auto p-2 bg-red-50 rounded mt-1">
                              {JSON.stringify(result.error, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <pre className="text-sm overflow-auto p-2 bg-gray-50 rounded">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Performance Metrics</span>
                <div className="flex items-center space-x-2">
                  <select
                    className="text-sm border rounded p-1"
                    value={timeRange}
                    onChange={(e) =>
                      setTimeRange(
                        e.target.value as "1h" | "24h" | "7d" | "30d",
                      )
                    }
                  >
                    <option value="1h">Last Hour</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                  </select>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={isRealtime ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsRealtime(!isRealtime)}
                      className="px-2"
                    >
                      {isRealtime ? "Realtime: ON" : "Realtime: OFF"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchSQLMetrics}
                      disabled={metricsLoading}
                    >
                      {metricsLoading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
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
                          Loading...
                        </span>
                      ) : (
                        "Refresh"
                      )}
                    </Button>
                  </div>
                </div>
              </CardTitle>
              <CardDescription>
                Analyze query execution performance
                {lastUpdated && (
                  <span className="block text-xs mt-1">
                    Last updated: {lastUpdated.toLocaleString()}
                    {isRealtime && " (Realtime updates enabled)"}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metricsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{metricsError}</span>
                  </div>
                  <div className="mt-2 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchSQLMetrics}
                      className="mr-2"
                    >
                      Retry
                    </Button>
                    {!isRealtime && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsRealtime(true)}
                      >
                        Enable Realtime Updates
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {metricsLoading && metrics.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-12">
                  <svg
                    className="animate-spin h-8 w-8 text-primary mb-4"
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
                  <p className="text-gray-500">Loading metrics data...</p>
                </div>
              ) : metrics.length === 0 && !metricsLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No metrics data available</p>
                  <p className="text-sm">
                    Try executing a query or changing the time range
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Method Distribution</h3>
                    <div className="flex gap-2 flex-wrap">
                      {metrics.map((metric) => (
                        <Badge
                          key={`${metric.method_used}-${metric.status}`}
                          className={`${getMethodBadgeColor(metric.method_used)} text-white`}
                        >
                          {metric.method_used} ({metric.status}):{" "}
                          {metric.execution_count}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">
                      Execution Times by Method
                    </h3>
                    <div className="space-y-2">
                      {metrics.map((metric, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-32 truncate">
                            {metric.method_used}
                          </div>
                          <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getMethodBadgeColor(metric.method_used)}`}
                              style={{
                                width: `${Math.min(100, (metric.avg_execution_time / 1000) * 100)}%`,
                              }}
                            ></div>
                          </div>
                          <div className="w-32 text-right text-sm">
                            Avg: {metric.avg_execution_time.toFixed(2)}ms
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Recent Executions</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {recentExecutions.map((execution, index) => (
                        <div key={index} className="border rounded p-2 text-sm">
                          <div className="flex justify-between">
                            <Badge
                              className={getMethodBadgeColor(
                                execution.method_used,
                              )}
                            >
                              {execution.method_used}
                            </Badge>
                            <span
                              className={
                                execution.status === "success"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {execution.status}
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className="text-gray-500">Time:</span>{" "}
                            {execution.execution_time_ms}ms
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            {new Date(execution.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {metrics.length > 0
                              ? `${(metrics.reduce((acc, m) => acc + m.avg_execution_time, 0) / metrics.length).toFixed(2)}ms`
                              : "N/A"}
                          </div>
                          <p className="text-sm text-gray-500">
                            Overall Avg Time
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {metrics.length > 0
                              ? `${Math.max(...metrics.map((m) => m.max_execution_time)).toFixed(2)}ms`
                              : "N/A"}
                          </div>
                          <p className="text-sm text-gray-500">Max Time</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {metrics.reduce(
                              (acc, m) => acc + m.execution_count,
                              0,
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            Total Executions
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-2xl font-bold">
                            {
                              recentExecutions.filter(
                                (e) => e.status === "error",
                              ).length
                            }
                          </div>
                          <p className="text-sm text-gray-500">Recent Errors</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Local query results section */}
                  {results.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">
                        Local Query Results
                      </h3>
                      <div className="space-y-2">
                        {results.map((result, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-24 truncate">{result.method}</div>
                            <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getMethodBadgeColor(result.method)}`}
                                style={{
                                  width: `${Math.min(100, (result.executionTime / 1000) * 100)}%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-20 text-right text-sm">
                              {result.executionTime
                                ? `${result.executionTime.toFixed(2)}ms`
                                : "N/A"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
