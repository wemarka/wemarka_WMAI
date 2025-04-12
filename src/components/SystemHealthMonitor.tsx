import React, { useState, useEffect, useRef, useCallback } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../frontend/components/ui/select";
import { Progress } from "../frontend/components/ui/progress";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  FileText,
  Gauge,
  RefreshCw,
  Server,
  Shield,
  Zap,
  Loader2,
  WifiOff,
} from "lucide-react";
import { executeSql, testDatabaseConnection } from "@/utils/dbUtils";
import {
  getSystemHealth,
  SystemHealth,
} from "@/frontend/services/monitoringService";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

interface HealthStatus {
  id: string;
  name: string;
  status: "healthy" | "warning" | "critical" | "unknown";
  value: number;
  maxValue: number;
  unit: string;
  category: string;
  lastChecked: Date;
  details?: string;
}

const SystemHealthMonitor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("24h");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isSubscribed, setIsSubscribed] = useState(false);
  const subscriptionRef = useRef<RealtimeChannel | null>(null);
  const [healthStatuses, setHealthStatuses] = useState<HealthStatus[]>([
    {
      id: "db-conn",
      name: "Database Connection",
      status: "healthy",
      value: 100,
      maxValue: 100,
      unit: "%",
      category: "database",
      lastChecked: new Date(),
      details: "Connection is stable and responsive",
    },
    {
      id: "db-perf",
      name: "Database Performance",
      status: "healthy",
      value: 85,
      maxValue: 100,
      unit: "%",
      category: "database",
      lastChecked: new Date(),
      details: "Query performance is within expected parameters",
    },
    {
      id: "edge-func",
      name: "Edge Functions",
      status: "healthy",
      value: 95,
      maxValue: 100,
      unit: "%",
      category: "edge_functions",
      lastChecked: new Date(),
      details: "All edge functions are operational",
    },
    {
      id: "rpc-func",
      name: "RPC Functions",
      status: "warning",
      value: 75,
      maxValue: 100,
      unit: "%",
      category: "rpc_functions",
      lastChecked: new Date(),
      details: "Some RPC functions have elevated response times",
    },
    {
      id: "api-health",
      name: "API Health",
      status: "healthy",
      value: 98,
      maxValue: 100,
      unit: "%",
      category: "api",
      lastChecked: new Date(),
      details: "API endpoints are responding normally",
    },
    {
      id: "auth-sys",
      name: "Authentication System",
      status: "healthy",
      value: 100,
      maxValue: 100,
      unit: "%",
      category: "security",
      lastChecked: new Date(),
      details: "Authentication system is functioning correctly",
    },
    {
      id: "storage",
      name: "File Storage",
      status: "healthy",
      value: 90,
      maxValue: 100,
      unit: "%",
      category: "storage",
      lastChecked: new Date(),
      details: "Storage system is operating normally",
    },
    {
      id: "realtime",
      name: "Realtime Functions",
      status: "warning",
      value: 80,
      maxValue: 100,
      unit: "%",
      category: "realtime",
      lastChecked: new Date(),
      details: "Occasional latency spikes in realtime updates",
    },
  ]);

  // Fetch system health data from Supabase
  const fetchSystemHealthData = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("system_health")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching system health data:", error);
        setError(`Error fetching system health data: ${error.message}`);
        return null;
      }

      // Clear error if fetch was successful
      setError(null);
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error("Exception fetching system health data:", error);
      setError(
        `Exception fetching system health data: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }, []);

  // Process health data and update statuses
  const processHealthData = useCallback(
    (healthData, systemHealthData = null) => {
      // Update health statuses based on real data
      const updatedStatuses = [...healthStatuses];

      // Update API health status
      const apiHealthStatus = updatedStatuses.find(
        (s) => s.id === "api-health",
      );
      if (apiHealthStatus) {
        apiHealthStatus.status =
          healthData.status === "healthy"
            ? "healthy"
            : healthData.status === "degraded"
              ? "warning"
              : "critical";
        apiHealthStatus.value =
          healthData.status === "healthy"
            ? 98
            : healthData.status === "degraded"
              ? 75
              : 50;
        apiHealthStatus.lastChecked = new Date();
        apiHealthStatus.details = `API response time: ${healthData.responseTime || "unknown"}ms`;
      }

      // Update storage status based on disk usage
      const storageStatus = updatedStatuses.find((s) => s.id === "storage");
      if (storageStatus && typeof healthData.diskUsage === "number") {
        storageStatus.value = 100 - healthData.diskUsage;
        storageStatus.status =
          storageStatus.value > 80
            ? "healthy"
            : storageStatus.value > 50
              ? "warning"
              : "critical";
        storageStatus.lastChecked = new Date();
        storageStatus.details = `Disk usage: ${healthData.diskUsage}%`;
      }

      // Update database connection status if we have real data
      if (systemHealthData) {
        const dbConnStatus = updatedStatuses.find((s) => s.id === "db-conn");
        if (dbConnStatus) {
          const isConnected = systemHealthData.database_status === "connected";
          dbConnStatus.status = isConnected ? "healthy" : "critical";
          dbConnStatus.value = isConnected ? 100 : 0;
          dbConnStatus.lastChecked = new Date();
          dbConnStatus.details = isConnected
            ? "Connection is stable and responsive"
            : "Unable to connect to database";
        }

        // Update RPC functions status if available
        const rpcStatus = updatedStatuses.find((s) => s.id === "rpc-func");
        if (rpcStatus && systemHealthData.rpc_functions_status) {
          const isHealthy = systemHealthData.rpc_functions_status === "healthy";
          rpcStatus.status = isHealthy ? "healthy" : "warning";
          rpcStatus.value = isHealthy ? 95 : 75;
          rpcStatus.lastChecked = new Date();
          rpcStatus.details = isHealthy
            ? "RPC functions are responding normally"
            : "Some RPC functions have elevated response times";
        }

        // Update edge functions status if available
        const edgeStatus = updatedStatuses.find((s) => s.id === "edge-func");
        if (edgeStatus && systemHealthData.edge_functions_status) {
          const isHealthy =
            systemHealthData.edge_functions_status === "healthy";
          edgeStatus.status = isHealthy ? "healthy" : "warning";
          edgeStatus.value = isHealthy ? 95 : 70;
          edgeStatus.lastChecked = new Date();
          edgeStatus.details = isHealthy
            ? "All edge functions are operational"
            : "Some edge functions are experiencing issues";
        }
      }

      return updatedStatuses;
    },
    [healthStatuses],
  );

  // Update health statuses based on real data
  const updateHealthStatusesFromData = useCallback(async () => {
    // Don't set loading if we're just refreshing data in the background
    const isInitialLoad =
      !lastUpdated || new Date().getTime() - lastUpdated.getTime() > 60000;
    if (isInitialLoad) {
      setIsLoading(true);
    }

    try {
      // Fetch real system health data from Supabase
      const systemHealthData = await fetchSystemHealthData();

      // If no data is available, fall back to the monitoring service
      const healthData = systemHealthData || (await getSystemHealth());

      if (!healthData) {
        console.error("No health data available");
        setError("No health data available. Please check your connection.");
        setIsLoading(false);
        return;
      }

      // Clear error if data was successfully retrieved
      setError(null);

      // Process the health data and update statuses
      const updatedStatuses = processHealthData(healthData, systemHealthData);

      setHealthStatuses(updatedStatuses);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error updating health statuses:", error);
      setError(
        `Error updating health statuses: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsLoading(false);
    }
  }, [fetchSystemHealthData, processHealthData, lastUpdated]);

  // Set up real-time subscription to system_health table
  const setupRealtimeSubscription = useCallback(() => {
    try {
      // Show a temporary loading message when attempting to connect
      setError("Attempting to establish real-time connection...");

      // Clean up any existing subscription
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }

      // Create a new subscription
      const channel = supabase
        .channel("system_health_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "system_health" },
          (payload) => {
            console.log("Real-time update received:", payload);
            // Fetch the latest data when a change is detected
            updateHealthStatusesFromData();
          },
        )
        .subscribe((status) => {
          console.log("Subscription status:", status);
          setIsSubscribed(status === "SUBSCRIBED");
          if (status === "SUBSCRIBED") {
            console.log("Successfully subscribed to system_health table");
            // Clear any connection-related errors when subscription is successful
            setError(null);
            // Fetch data immediately after successful subscription
            updateHealthStatusesFromData();
          } else if (status === "CHANNEL_ERROR") {
            console.error("Failed to subscribe to system_health table");
            setError(
              "Failed to establish real-time connection. Data will be refreshed periodically.",
            );
          }
        });

      subscriptionRef.current = channel;
      return channel;
    } catch (error) {
      console.error("Error setting up real-time subscription:", error);
      setError(
        `Failed to establish real-time connection: ${error instanceof Error ? error.message : String(error)}. Data will be refreshed periodically.`,
      );
      return null;
    }
  }, [updateHealthStatusesFromData]);

  // Initial health status check and set up real-time updates
  useEffect(() => {
    // Use the new function that fetches from Supabase
    updateHealthStatusesFromData();

    // Set up real-time subscription
    const channel = setupRealtimeSubscription();

    // Set up a polling interval as a fallback for real-time updates
    const pollingInterval = setInterval(() => {
      if (!isSubscribed) {
        console.log(
          "Polling for updates as real-time subscription is not active",
        );
        updateHealthStatusesFromData();
      }
    }, 30000); // Poll every 30 seconds if real-time is not working

    // Attempt to reconnect if subscription fails initially
    const reconnectTimeout = setTimeout(() => {
      if (!isSubscribed) {
        console.log("Attempting to reconnect real-time subscription...");
        setupRealtimeSubscription();
      }
    }, 5000); // Try to reconnect after 5 seconds if initial connection fails

    // Clean up subscription, interval, and timeout when component unmounts
    return () => {
      if (channel) {
        console.log("Unsubscribing from system_health table");
        channel.unsubscribe();
      }
      clearInterval(pollingInterval);
      clearTimeout(reconnectTimeout);
    };
  }, [updateHealthStatusesFromData, setupRealtimeSubscription, isSubscribed]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500 dark:text-green-400";
      case "warning":
        return "text-amber-500 dark:text-amber-400";
      case "critical":
        return "text-red-500 dark:text-red-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "database":
        return <Database className="h-4 w-4" />;
      case "edge_functions":
        return <Server className="h-4 w-4" />;
      case "rpc_functions":
        return <Activity className="h-4 w-4" />;
      case "api":
        return <FileText className="h-4 w-4" />;
      case "security":
        return <Shield className="h-4 w-4" />;
      case "storage":
        return <Database className="h-4 w-4" />;
      case "realtime":
        return <Zap className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString();
  };

  // Filter health statuses by category based on active tab
  const filteredStatuses = healthStatuses.filter((status) => {
    if (activeTab === "overview") return true;
    return status.category === activeTab;
  });

  // Calculate overall system health
  const overallHealth = {
    value: Math.round(
      healthStatuses.reduce((acc, status) => acc + status.value, 0) /
        healthStatuses.length,
    ),
    status: healthStatuses.some((s) => s.status === "critical")
      ? "critical"
      : healthStatuses.some((s) => s.status === "warning")
        ? "warning"
        : "healthy",
  };

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold">System Health Monitor</h2>
            {isSubscribed ? (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            ) : (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full flex items-center">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </span>
            )}
          </div>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                updateHealthStatusesFromData();
                if (!isSubscribed) {
                  setupRealtimeSubscription();
                }
              }}
              disabled={isLoading}
              variant="outline"
              title={
                isSubscribed ? "Refresh data" : "Refresh data and reconnect"
              }
              className="relative transition-all hover:shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw
                  className={`h-4 w-4 ${!isSubscribed ? "text-amber-500" : ""}`}
                />
              )}
              {!isSubscribed && !isLoading && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
              <span
                className={`ml-2 ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-200`}
              >
                {isSubscribed ? "Refresh" : "Reconnect"}
              </span>
            </Button>
          </div>
        </div>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4 animate-in fade-in duration-300"
            role="alert"
          >
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="flex-1">{error}</span>
              <button
                className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                onClick={() => setError(null)}
                aria-label="Close error message"
              >
                <span className="text-xl">×</span>
              </button>
            </div>
            <div className="mt-2 text-sm">
              {!isSubscribed && (
                <div className="flex items-center justify-between">
                  <p className="text-amber-600">
                    Real-time updates are not active. Data will be refreshed
                    every 30 seconds.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-amber-700 border-amber-300 hover:bg-amber-50 ml-2"
                    onClick={() => setupRealtimeSubscription()}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Try reconnecting
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {isLoading && !error && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative mb-4 animate-in fade-in duration-300">
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Fetching latest system health data...</span>
              <div className="ml-auto flex space-x-1">
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-150"></span>
                <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gauge className="mr-2 h-5 w-5" />
              Overall System Health
            </CardTitle>
            <CardDescription>Composite system health indicator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 mb-4">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={
                      overallHealth.status === "healthy"
                        ? "#10b981"
                        : overallHealth.status === "warning"
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                    strokeWidth="10"
                    strokeDasharray={`${(overallHealth.value / 100) * 283} 283`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text
                    x="50"
                    y="50"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="24"
                    fontWeight="bold"
                    fill={
                      overallHealth.status === "healthy"
                        ? "#10b981"
                        : overallHealth.status === "warning"
                          ? "#f59e0b"
                          : "#ef4444"
                    }
                  >
                    {overallHealth.value}%
                  </text>
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-4 text-center">
                  <span
                    className={`text-sm font-medium ${getStatusColor(overallHealth.status)}`}
                  >
                    {overallHealth.status === "healthy"
                      ? "Healthy"
                      : overallHealth.status === "warning"
                        ? "Warning"
                        : "Critical"}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Last updated: {formatDate(lastUpdated)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStatuses.map((status) => (
            <Card key={status.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    {getCategoryIcon(status.category)}
                    <span className="ml-2">{status.name}</span>
                  </CardTitle>
                  {getStatusIcon(status.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-sm font-medium ${getStatusColor(status.status)}`}
                    >
                      {status.status === "healthy"
                        ? "Healthy"
                        : status.status === "warning"
                          ? "Warning"
                          : status.status === "critical"
                            ? "Critical"
                            : "Unknown"}
                    </span>
                    <span className="text-sm font-medium">{status.value}%</span>
                  </div>
                  <Progress
                    value={status.value}
                    max={status.maxValue}
                    className="h-2"
                  />
                  {status.details && (
                    <p className="text-sm text-gray-500 mt-2">
                      {status.details}
                    </p>
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    Last checked: {formatDate(status.lastChecked)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview" className="flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Database
          </TabsTrigger>
          <TabsTrigger value="edge_functions" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            Edge Functions
          </TabsTrigger>
          <TabsTrigger value="rpc_functions" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            RPC Functions
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {renderOverview()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemHealthMonitor;
