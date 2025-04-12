import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../frontend/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../frontend/components/ui/card";
import { Button } from "../frontend/components/ui/button";
import {
  Activity,
  AlertCircle,
  Database,
  FileText,
  Gauge,
  RefreshCw,
  Server,
  Layers,
  Download,
  Share2,
  RotateCcw,
  Bell,
  Search,
  Clock,
  CheckCircle2,
  CircleDashed,
  CircleDot,
} from "lucide-react";
import { Input } from "../frontend/components/ui/input";
import { Badge } from "../frontend/components/ui/badge";
import DiagnosticLogsViewer from "./DiagnosticLogsViewer";
import UnifiedMonitoringDashboard from "./UnifiedMonitoringDashboard";
import SQLMonitoringDashboard from "./SQLMonitoringDashboard";
import SystemHealthMonitor from "./SystemHealthMonitor";
import MonitoringAlertsDashboard from "./MonitoringAlertsDashboard";
import { usePhaseStatuses } from "../hooks/useMonitoringData";

interface UnifiedOperationalMonitoringCenterProps {
  defaultTab?: string;
}

const UnifiedOperationalMonitoringCenter: React.FC<
  UnifiedOperationalMonitoringCenterProps
> = ({ defaultTab = "overview" }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { phaseStatuses, currentPhase, loading } = usePhaseStatuses();

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    // Force a page refresh to get the latest data from all components
    window.location.reload();
    // The page will refresh, but we'll set this to false after a timeout just in case
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const handleExportLogs = () => {
    // This would be implemented to export logs to CSV or JSON
    alert("Export functionality will be implemented here");
  };

  const handleShareLogs = () => {
    // This would be implemented to share logs via email or other means
    alert("Share functionality will be implemented here");
  };

  const handleRetryFailedOperations = () => {
    // This would be implemented to retry failed operations
    alert("Retry functionality will be implemented here");
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Operational Monitoring Center</h1>
          <p className="text-muted-foreground">
            Unified interface for system monitoring and diagnostics
          </p>
          {currentPhase && (
            <div className="mt-2 flex flex-col">
              <div className="flex items-center mb-1">
                <Badge
                  variant={
                    currentPhase.status === "completed"
                      ? "success"
                      : currentPhase.status === "in-progress"
                        ? "default"
                        : "outline"
                  }
                  className="mr-2"
                >
                  {currentPhase.status === "completed" ? (
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                  ) : currentPhase.status === "in-progress" ? (
                    <CircleDot className="h-3 w-3 mr-1" />
                  ) : (
                    <CircleDashed className="h-3 w-3 mr-1" />
                  )}
                  Phase {currentPhase.phase}: {currentPhase.name}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Started:{" "}
                  {new Date(currentPhase.startDate).toLocaleDateString()}
                  {currentPhase.completionDate &&
                    ` • Completed: ${new Date(currentPhase.completionDate).toLocaleDateString()}`}
                </span>
              </div>
              {currentPhase.status === "in-progress" && (
                <div className="w-full max-w-xs">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{currentPhase.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${currentPhase.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              <div className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium">Project Roadmap:</span>{" "}
                {phaseStatuses.map((phase, index) => (
                  <span
                    key={phase.phase}
                    className="inline-flex items-center ml-1"
                  >
                    {index > 0 && <span className="mx-1">→</span>}
                    <span
                      className={`${phase.status === "completed" ? "text-green-600" : phase.status === "in-progress" ? "text-blue-600 font-medium" : "text-muted-foreground"}`}
                      title={`${phase.name} (${phase.status === "completed" ? "Completed" : phase.status === "in-progress" ? `${phase.progress}% Complete` : "Pending"})`}
                    >
                      {phase.phase}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search across all logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full md:w-[250px]"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh All
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Export Logs</h3>
                <p className="text-sm text-muted-foreground">
                  Download as CSV/JSON
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={handleExportLogs}>
              Export
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Share2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Share Logs</h3>
                <p className="text-sm text-muted-foreground">
                  With support team
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" onClick={handleShareLogs}>
              Share
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <RotateCcw className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium">Retry Failed</h3>
                <p className="text-sm text-muted-foreground">
                  Retry operations
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleRetryFailedOperations}
            >
              Retry
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <Bell className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium">Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Configure notifications
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveTab("alerts")}
              className="group hover:bg-purple-100 transition-colors"
            >
              <Badge
                className="cursor-pointer group-hover:bg-purple-700 group-hover:text-white transition-colors hover:scale-105 hover:shadow-md"
                onClick={() => setActiveTab("alerts")}
              >
                <AlertCircle className="h-3 w-3 mr-1 inline" />3 Active
              </Badge>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="system-health" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="sql-monitoring" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            SQL Monitoring
          </TabsTrigger>
          <TabsTrigger value="diagnostic-logs" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Diagnostic Logs
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            Alerts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <UnifiedMonitoringDashboard defaultTab="system-health" />
        </TabsContent>

        <TabsContent value="system-health">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="sql-monitoring">
          <SQLMonitoringDashboard />
        </TabsContent>

        <TabsContent value="diagnostic-logs">
          <DiagnosticLogsViewer searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="alerts">
          <MonitoringAlertsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedOperationalMonitoringCenter;
