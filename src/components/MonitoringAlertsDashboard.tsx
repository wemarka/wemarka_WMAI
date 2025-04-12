import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../frontend/components/ui/card";
import { Button } from "../frontend/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../frontend/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../frontend/components/ui/select";
import { Input } from "../frontend/components/ui/input";
import { Textarea } from "../frontend/components/ui/textarea";
import { Switch } from "../frontend/components/ui/switch";
import { Badge } from "../frontend/components/ui/badge";
import {
  AlertCircle,
  Bell,
  CheckCircle,
  Clock,
  Edit,
  Gauge,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";

interface Alert {
  id: string;
  name: string;
  description: string;
  metric: string;
  threshold: number;
  comparison: "gt" | "lt" | "eq" | "gte" | "lte";
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  notification_channels?: string[];
  created_at: string;
  updated_at: string;
}

interface AlertNotification {
  id: string;
  alert_id: string;
  alert_name: string;
  metric: string;
  current_value: number;
  threshold: number;
  comparison: string;
  severity: string;
  triggered_at: string;
  message: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  source?: string; // Added for module filtering
}

const MonitoringAlertsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active-alerts");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [formData, setFormData] = useState<Partial<Alert>>({
    name: "",
    description: "",
    metric: "cpu_usage",
    threshold: 80,
    comparison: "gt",
    severity: "medium",
    enabled: true,
  });
  const [isCheckingAlerts, setIsCheckingAlerts] = useState(false);
  const [lastChecked, setLastChecked] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtering states
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<string | null>(null);
  const [startDateFilter, setStartDateFilter] = useState<Date | null>(null);
  const [endDateFilter, setEndDateFilter] = useState<Date | null>(null);

  // Get the active alert count for external components to use
  const getActiveAlertCount = () => {
    return notifications.filter((n) => !n.acknowledged).length;
  };

  // Apply filters to notifications and alerts
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    if (severityFilter) {
      filtered = filtered.filter((n) => n.severity === severityFilter);
    }

    if (moduleFilter) {
      filtered = filtered.filter((n) => n.source === moduleFilter);
    }

    if (startDateFilter) {
      filtered = filtered.filter(
        (n) => new Date(n.triggered_at) >= startDateFilter,
      );
    }

    if (endDateFilter) {
      const endDate = new Date(endDateFilter);
      endDate.setHours(23, 59, 59, 999); // End of the day
      filtered = filtered.filter((n) => new Date(n.triggered_at) <= endDate);
    }

    return filtered;
  }, [
    notifications,
    severityFilter,
    moduleFilter,
    startDateFilter,
    endDateFilter,
  ]);

  // Filtered active notifications (not acknowledged)
  const filteredActiveNotifications = useMemo(() => {
    return filteredNotifications.filter((n) => !n.acknowledged);
  }, [filteredNotifications]);

  // Apply filters to alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];

    if (severityFilter) {
      filtered = filtered.filter((a) => a.severity === severityFilter);
    }

    // Additional filters can be applied here if alerts have module or date fields

    return filtered;
  }, [alerts, severityFilter]);

  // Export the active alert count for other components
  useEffect(() => {
    // Make the active alert count available globally
    window.monitoringAlerts = {
      getActiveAlertCount,
      newNotificationCount,
    };

    return () => {
      // Clean up when component unmounts
      delete window.monitoringAlerts;
    };
  }, [notifications, newNotificationCount]);

  // Fetch alerts and notifications
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch alerts from monitoring_alerts table
      const { data: alertsData, error: alertsError } = await supabase
        .from("monitoring_alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (alertsError) {
        throw new Error(alertsError.message);
      }

      // Fetch notifications from alert_notifications table
      const { data: notificationsData, error: notificationsError } =
        await supabase
          .from("alert_notifications")
          .select("*")
          .order("triggered_at", { ascending: false });

      if (notificationsError) {
        throw new Error(notificationsError.message);
      }

      setAlerts(alertsData || []);
      setNotifications(notificationsData || []);

      // Update last checked time
      setLastChecked(new Date().toLocaleString());
    } catch (err) {
      console.error("Error fetching monitoring data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");

      // Set fallback data only if no data was fetched
      if (alerts.length === 0) {
        setAlerts([
          {
            id: "1",
            name: "High CPU Usage",
            description: "Alert when CPU usage exceeds 80%",
            metric: "cpu_usage",
            threshold: 80,
            comparison: "gt",
            severity: "high",
            enabled: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Low System Health",
            description: "Alert when system health drops below 70%",
            metric: "system_health",
            threshold: 70,
            comparison: "lt",
            severity: "critical",
            enabled: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      }

      if (notifications.length === 0) {
        setNotifications([
          {
            id: "1",
            alert_id: "1",
            alert_name: "High CPU Usage",
            metric: "cpu_usage",
            current_value: 85,
            threshold: 80,
            comparison: "gt",
            severity: "high",
            triggered_at: new Date().toISOString(),
            message:
              "CPU usage has exceeded the threshold of 80% (current value: 85.00)",
            acknowledged: false,
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check alerts manually
  const checkAlerts = async () => {
    setIsCheckingAlerts(true);
    setError(null);

    try {
      // First try to use the edge function if available
      try {
        const response = await supabase.functions.invoke("monitoring-alerts", {
          body: { action: "checkAlerts", timeframe: "1h" },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        console.log(
          "Alerts checked successfully via edge function:",
          response.data,
        );
      } catch (edgeFunctionError) {
        console.warn(
          "Edge function error, falling back to direct query:",
          edgeFunctionError,
        );

        // Fallback: Query the diagnostic_logs table for potential alerts
        const { data: logsData, error: logsError } = await supabase
          .from("diagnostic_logs")
          .select("*")
          .gte("created_at", new Date(Date.now() - 3600000).toISOString()) // Last hour
          .order("created_at", { ascending: false });

        if (logsError) throw logsError;

        // Process logs to find potential alerts
        // This is a simplified version - in a real implementation, you would
        // compare against thresholds defined in the monitoring_alerts table
        const errorLogs = logsData?.filter(
          (log) =>
            log.status === "error" ||
            log.status === "failed" ||
            (log.execution_time_ms && log.execution_time_ms > 1000),
        );

        if (errorLogs && errorLogs.length > 0) {
          console.log(`Found ${errorLogs.length} potential alerts in logs`);
        }
      }

      // Refresh data after checking alerts
      await fetchData();
      setLastChecked(new Date().toLocaleString());
    } catch (err) {
      console.error("Error checking alerts:", err);
      setError(err instanceof Error ? err.message : "Failed to check alerts");
    } finally {
      setIsCheckingAlerts(false);
    }
  };

  // Create or update alert
  const saveAlert = async () => {
    if (!formData.name || !formData.metric || !formData.threshold) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditing && currentAlert) {
        // Update existing alert
        const response = await supabase.functions.invoke("monitoring-alerts", {
          body: {
            action: "updateAlert",
            alertId: currentAlert.id,
            alertConfig: formData,
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        // Update local state
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === currentAlert.id
              ? { ...alert, ...formData, updated_at: new Date().toISOString() }
              : alert,
          ),
        );
      } else {
        // Create new alert
        const response = await supabase.functions.invoke("monitoring-alerts", {
          body: {
            action: "createAlert",
            alertConfig: formData,
          },
        });

        if (response.error) {
          throw new Error(response.error.message);
        }

        // Add to local state
        const newAlert = response.data?.alert || {
          ...formData,
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setAlerts((prev) => [...prev, newAlert]);
      }

      // Reset form and state
      resetForm();
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error saving alert:", err);
      setError(err instanceof Error ? err.message : "Failed to save alert");
    } finally {
      setLoading(false);
    }
  };

  // Delete alert
  const deleteAlert = async (alertId: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await supabase.functions.invoke("monitoring-alerts", {
        body: {
          action: "deleteAlert",
          alertId,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Remove from local state
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    } catch (err) {
      console.error("Error deleting alert:", err);
      setError(err instanceof Error ? err.message : "Failed to delete alert");
    } finally {
      setLoading(false);
    }
  };

  // Acknowledge notification
  const acknowledgeNotification = async (notificationId: string) => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, you would call an API to acknowledge the notification
      // For now, we'll just update the local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? {
                ...notification,
                acknowledged: true,
                acknowledged_at: new Date().toISOString(),
              }
            : notification,
        ),
      );
    } catch (err) {
      console.error("Error acknowledging notification:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to acknowledge notification",
      );
    } finally {
      setLoading(false);
    }
  };

  // Edit alert
  const editAlert = (alert: Alert) => {
    setCurrentAlert(alert);
    setFormData({
      name: alert.name,
      description: alert.description,
      metric: alert.metric,
      threshold: alert.threshold,
      comparison: alert.comparison,
      severity: alert.severity,
      enabled: alert.enabled,
      notification_channels: alert.notification_channels,
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      metric: "cpu_usage",
      threshold: 80,
      comparison: "gt",
      severity: "medium",
      enabled: true,
    });
    setCurrentAlert(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Auto-check alerts on initial load
  useEffect(() => {
    // Check alerts automatically on component mount
    checkAlerts();
    // Set up an interval to check alerts every 5 minutes
    const intervalId = setInterval(() => {
      checkAlerts();
    }, 300000); // 5 minutes in milliseconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Update last checked time every minute
  useEffect(() => {
    if (lastChecked) {
      const updateInterval = setInterval(() => {
        const lastCheckedDate = new Date(lastChecked);
        const now = new Date();
        const diffInMinutes = Math.floor(
          (now.getTime() - lastCheckedDate.getTime()) / 60000,
        );

        if (diffInMinutes < 1) {
          setLastChecked("just now");
        } else if (diffInMinutes === 1) {
          setLastChecked("1 minute ago");
        } else if (diffInMinutes < 60) {
          setLastChecked(`${diffInMinutes} minutes ago`);
        } else {
          setLastChecked(lastCheckedDate.toLocaleString());
        }
      }, 60000); // Update every minute

      return () => clearInterval(updateInterval);
    }
  }, [lastChecked]);

  // Set up real-time subscription and initial data fetch
  useEffect(() => {
    fetchData();

    // Set up real-time subscription for alert_notifications
    const notificationsSubscription = supabase
      .channel("alert_notifications_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alert_notifications" },
        (payload) => {
          console.log("New alert notification:", payload);
          // Add the new notification to the state
          const newNotification = payload.new as AlertNotification;
          setNotifications((prev) => [newNotification, ...prev]);

          // Increment new notification count
          setNewNotificationCount((prev) => prev + 1);

          // Show toast notification for critical alerts
          if (newNotification.severity === "critical") {
            // Use the shadcn toast from the UI components
            try {
              const { toast } = window.require
                ? window.require("../frontend/components/ui/use-toast")
                : { toast: (props) => console.log("Toast:", props) };

              toast({
                variant: "destructive",
                title: "Critical Alert",
                description: newNotification.message,
                duration: 5000,
              });
            } catch (error) {
              console.error("Failed to show toast notification:", error);
              console.log("CRITICAL ALERT:", newNotification.message);
            }
          }
        },
      )
      .subscribe();

    // Set up real-time subscription for monitoring_alerts
    const alertsSubscription = supabase
      .channel("monitoring_alerts_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "monitoring_alerts" },
        (payload) => {
          console.log("Alert change:", payload);
          // Refresh all alerts to ensure consistency
          setIsRefreshing(true);
          fetchData().finally(() => setIsRefreshing(false));
        },
      )
      .subscribe();

    // Set up polling interval as fallback
    const interval = setInterval(() => {
      setIsRefreshing(true);
      fetchData().finally(() => setIsRefreshing(false));
    }, 60000); // Refresh every minute

    return () => {
      notificationsSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Reset new notification count when tab changes to active alerts
  useEffect(() => {
    if (activeTab === "active-alerts") {
      setNewNotificationCount(0);
    }
  }, [activeTab]);

  // Helper functions
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getComparisonText = (comparison: string) => {
    switch (comparison) {
      case "gt":
        return ">";
      case "lt":
        return "<";
      case "eq":
        return "=";
      case "gte":
        return "≥";
      case "lte":
        return "≤";
      default:
        return comparison;
    }
  };

  const getMetricName = (metric: string) => {
    switch (metric) {
      case "cpu_usage":
        return "CPU Usage";
      case "memory_usage":
        return "Memory Usage";
      case "disk_usage":
        return "Disk Usage";
      case "system_health":
        return "System Health";
      case "query_performance":
        return "Query Performance";
      case "error_rate":
        return "Error Rate";
      default:
        return metric;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div
      className="container mx-auto p-4 bg-white"
      data-testid="monitoring-alerts-dashboard"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monitoring Alerts Dashboard</h1>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={checkAlerts}
            disabled={isCheckingAlerts}
          >
            {isCheckingAlerts ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
              />
            )}
            Check Alerts
            {newNotificationCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {newNotificationCount}
              </Badge>
            )}
          </Button>
          {lastChecked && (
            <span className="text-xs text-muted-foreground ml-2 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Last checked: {lastChecked}
            </span>
          )}
          <Button
            onClick={() => {
              resetForm();
              setIsCreating(true);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filtering controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-medium mb-3">Filter Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium block mb-1">Severity</label>
            <Select
              value={severityFilter || "all"}
              onValueChange={(value) =>
                setSeverityFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Severities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Module</label>
            <Select
              value={moduleFilter || "all"}
              onValueChange={(value) =>
                setModuleFilter(value === "all" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="background-job">Background Jobs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Start Date</label>
            <Input
              type="date"
              value={
                startDateFilter
                  ? startDateFilter.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setStartDateFilter(
                  e.target.value ? new Date(e.target.value) : null,
                )
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">End Date</label>
            <Input
              type="date"
              value={
                endDateFilter ? endDateFilter.toISOString().split("T")[0] : ""
              }
              onChange={(e) =>
                setEndDateFilter(
                  e.target.value ? new Date(e.target.value) : null,
                )
              }
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="active-alerts" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Active Alerts
            {newNotificationCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {newNotificationCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="alert-history" className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Alert History
          </TabsTrigger>
          <TabsTrigger value="alert-settings" className="flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Alert Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active-alerts">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Currently active monitoring alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredActiveNotifications.length > 0 ? (
                <div className="space-y-4">
                  {filteredActiveNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className="border-l-4 border-l-red-500"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center">
                              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                              {notification.alert_name}
                            </CardTitle>
                            <CardDescription>
                              Triggered at{" "}
                              {formatDate(notification.triggered_at)}
                            </CardDescription>
                          </div>
                          <Badge
                            className={getSeverityColor(notification.severity)}
                          >
                            {notification.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-2">{notification.message}</p>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <strong>Metric:</strong>&nbsp;
                            {getMetricName(notification.metric)}
                          </span>
                          <span className="flex items-center">
                            <strong>Current Value:</strong>&nbsp;
                            {notification.current_value.toFixed(2)}
                          </span>
                          <span className="flex items-center">
                            <strong>Threshold:</strong>&nbsp;
                            {getComparisonText(notification.comparison)}&nbsp;
                            {notification.threshold}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            acknowledgeNotification(notification.id)
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Acknowledge
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p className="text-lg font-medium">No active alerts</p>
                  <p className="text-sm">All systems are operating normally</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alert-history">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>
                Historical record of all triggered alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredNotifications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Alert</th>
                        <th className="text-left py-3 px-4">Metric</th>
                        <th className="text-left py-3 px-4">Value</th>
                        <th className="text-left py-3 px-4">Threshold</th>
                        <th className="text-left py-3 px-4">Severity</th>
                        <th className="text-left py-3 px-4">Triggered At</th>
                        <th className="text-left py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotifications.map((notification) => (
                        <tr
                          key={notification.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            {notification.alert_name}
                          </td>
                          <td className="py-3 px-4">
                            {getMetricName(notification.metric)}
                          </td>
                          <td className="py-3 px-4">
                            {notification.current_value.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            {getComparisonText(notification.comparison)}{" "}
                            {notification.threshold}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={getSeverityColor(
                                notification.severity,
                              )}
                            >
                              {notification.severity.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {formatDate(notification.triggered_at)}
                          </td>
                          <td className="py-3 px-4">
                            {notification.acknowledged ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Acknowledged
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-800"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No alert history available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alert-settings">
          <Card>
            <CardHeader>
              <CardTitle>Alert Settings</CardTitle>
              <CardDescription>
                Configure monitoring alerts and thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAlerts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Metric</th>
                        <th className="text-left py-3 px-4">Threshold</th>
                        <th className="text-left py-3 px-4">Severity</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlerts.map((alert) => (
                        <tr
                          key={alert.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">{alert.name}</td>
                          <td className="py-3 px-4">
                            {getMetricName(alert.metric)}
                          </td>
                          <td className="py-3 px-4">
                            {getComparisonText(alert.comparison)}{" "}
                            {alert.threshold}
                            {alert.metric === "cpu_usage" ||
                            alert.metric === "memory_usage" ||
                            alert.metric === "disk_usage" ||
                            alert.metric === "system_health" ||
                            alert.metric === "error_rate"
                              ? "%"
                              : alert.metric === "query_performance"
                                ? "ms"
                                : ""}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {alert.enabled ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-800"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Enabled
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-800"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Disabled
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => editAlert(alert)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => deleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No alerts configured</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      resetForm();
                      setIsCreating(true);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Alert
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Creation/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Alert" : "Create New Alert"}
            </DialogTitle>
            <DialogDescription>
              Configure alert settings and thresholds.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Alert name"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Alert description"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="metric" className="text-right">
                Metric
              </label>
              <Select
                value={formData.metric}
                onValueChange={(value) => handleSelectChange("metric", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpu_usage">CPU Usage</SelectItem>
                  <SelectItem value="memory_usage">Memory Usage</SelectItem>
                  <SelectItem value="disk_usage">Disk Usage</SelectItem>
                  <SelectItem value="system_health">System Health</SelectItem>
                  <SelectItem value="query_performance">
                    Query Performance
                  </SelectItem>
                  <SelectItem value="error_rate">Error Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="comparison" className="text-right">
                Comparison
              </label>
              <Select
                value={formData.comparison}
                onValueChange={(value) =>
                  handleSelectChange(
                    "comparison",
                    value as "gt" | "lt" | "eq" | "gte" | "lte",
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select comparison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gt">Greater than (&gt;)</SelectItem>
                  <SelectItem value="lt">Less than (&lt;)</SelectItem>
                  <SelectItem value="eq">Equal to (=)</SelectItem>
                  <SelectItem value="gte">Greater than or equal (≥)</SelectItem>
                  <SelectItem value="lte">Less than or equal (≤)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="threshold" className="text-right">
                Threshold
              </label>
              <Input
                id="threshold"
                name="threshold"
                type="number"
                value={formData.threshold || 0}
                onChange={handleNumberChange}
                className="col-span-3"
                placeholder="Alert threshold"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="severity" className="text-right">
                Severity
              </label>
              <Select
                value={formData.severity}
                onValueChange={(value) =>
                  handleSelectChange(
                    "severity",
                    value as "low" | "medium" | "high" | "critical",
                  )
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="enabled" className="text-right">
                Enabled
              </label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("enabled", checked)
                  }
                />
                <label htmlFor="enabled" className="text-sm">
                  {formData.enabled ? "Alert is active" : "Alert is disabled"}
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveAlert}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonitoringAlertsDashboard;
