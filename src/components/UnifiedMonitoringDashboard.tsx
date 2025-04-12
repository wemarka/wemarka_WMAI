import React, { useState } from "react";
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
  CardFooter,
} from "../frontend/components/ui/card";
import { Button } from "../frontend/components/ui/button";
import { Badge } from "../frontend/components/ui/badge";
import { Progress } from "../frontend/components/ui/progress";
import {
  Activity,
  Database,
  Gauge,
  RefreshCw,
  Server,
  CheckCircle,
  Clock,
  AlertCircle,
  Layers,
  Loader2,
} from "lucide-react";
import SystemHealthMonitor from "./SystemHealthMonitor";
import SQLMonitoringDashboard from "./SQLMonitoringDashboard";
import { usePhaseStatuses, useSystemMetrics } from "../hooks/useMonitoringData";

interface UnifiedMonitoringDashboardProps {
  defaultTab?: string;
}

const UnifiedMonitoringDashboard: React.FC<UnifiedMonitoringDashboardProps> = ({
  defaultTab = "system-health",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use custom hooks to fetch real-time data
  const {
    phaseStatuses,
    currentPhase,
    loading: phasesLoading,
    error: phasesError,
  } = usePhaseStatuses();
  const {
    systemHealth,
    dbResponse,
    sqlOperations,
    loading: metricsLoading,
    error: metricsError,
  } = useSystemMetrics();

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    // Force a page refresh to get the latest data from all components
    window.location.reload();
    // The page will refresh, but we'll set this to false after a timeout just in case
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "pending":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Unified Monitoring Dashboard</h1>
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

      {/* Project Phase Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Project Phase Status</CardTitle>
              <CardDescription>
                Current development phase and progress tracking
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              Phase {currentPhase?.phase}: {currentPhase?.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Phase 3 Status */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(
                    phaseStatuses.find((p) => p.phase === 3)?.status ||
                      "pending",
                  )}
                  <span className="font-medium">
                    Phase 3: Monitoring & Analytics
                  </span>
                </div>
                <Badge
                  variant={
                    phaseStatuses.find((p) => p.phase === 3)?.status ===
                    "completed"
                      ? "success"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {phaseStatuses.find((p) => p.phase === 3)?.status ||
                    "pending"}
                </Badge>
              </div>
              <Progress
                value={phaseStatuses.find((p) => p.phase === 3)?.progress || 0}
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>
                  Started:{" "}
                  {phaseStatuses.find((p) => p.phase === 3)?.startDate || "N/A"}
                </span>
                <span>
                  {phaseStatuses.find((p) => p.phase === 3)?.progress || 0}%
                  Complete
                </span>
              </div>
            </div>

            {/* Phase Progress Timeline */}
            <div className="flex items-center gap-2 pt-4">
              {phaseStatuses.map((phase) => (
                <div key={phase.phase} className="flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${getStatusColor(phase.status)}`}
                    >
                      {phase.phase}
                    </div>
                    <div className="text-xs mt-1 text-center">{phase.name}</div>
                  </div>
                  {phase.phase < phaseStatuses.length && (
                    <div
                      className={`h-1 mt-3 ${phase.status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="w-full">
            <div className="text-sm font-medium mb-2">
              System Monitoring Overview
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metricsLoading ? (
                <div className="flex items-center justify-center w-full">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="ml-2">Loading metrics...</span>
                </div>
              ) : metricsError ? (
                <div className="text-red-500 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Error loading metrics
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-bold">{systemHealth}%</div>
                      <p className="text-xs text-muted-foreground">
                        System Health
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-bold">{dbResponse} ms</div>
                      <p className="text-xs text-muted-foreground">
                        DB Response
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-bold">
                        {sqlOperations.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        SQL Operations
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="system-health" className="flex items-center">
            <Server className="h-4 w-4 mr-2" />
            System Health
          </TabsTrigger>
          <TabsTrigger value="sql-monitoring" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            SQL Monitoring
          </TabsTrigger>
          <TabsTrigger value="phase-details" className="flex items-center">
            <Layers className="h-4 w-4 mr-2" />
            Phase Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="system-health">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="sql-monitoring">
          <SQLMonitoringDashboard />
        </TabsContent>

        <TabsContent value="phase-details">
          <Card>
            <CardHeader>
              <CardTitle>Project Phases Detail</CardTitle>
              <CardDescription>
                Detailed view of all project phases and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {phaseStatuses.map((phase) => (
                  <div key={phase.phase} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(phase.status)}
                        <span className="font-medium">
                          Phase {phase.phase}: {phase.name}
                        </span>
                      </div>
                      <Badge
                        variant={
                          phase.status === "completed" ? "success" : "outline"
                        }
                        className="capitalize"
                      >
                        {phase.status}
                      </Badge>
                    </div>
                    <Progress value={phase.progress} className="h-2 mb-2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Start Date</div>
                        <div>{phase.startDate}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          Completion Date
                        </div>
                        <div>{phase.completionDate || "In progress"}</div>
                      </div>
                    </div>
                    {phase.phase === 3 && (
                      <div className="mt-4 p-3 bg-green-50 rounded-md">
                        <div className="font-medium text-green-700 mb-1">
                          Phase 3 Status: Completed
                        </div>
                        <div className="text-sm text-green-600">
                          Phase 3 (Monitoring & Analytics) has been successfully
                          completed on {phase.completionDate}. All monitoring
                          systems are now fully operational, including the
                          performance metrics dashboard and SQL monitoring
                          system.
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedMonitoringDashboard;
