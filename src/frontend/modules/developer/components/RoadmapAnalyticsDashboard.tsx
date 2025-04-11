import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  roadmapAnalyticsService,
  RoadmapUsageStats,
} from "@/frontend/services/roadmapAnalyticsService";
import { roadmapHistoryService } from "@/frontend/services/roadmapHistoryService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  BarChart3 as ChartBar,
  Download,
  Eye,
  FileText,
  Loader2,
  PieChart as PieChartIcon,
  RefreshCw,
  Share2,
  Users,
} from "lucide-react";
import { FallbackMessage } from "@/frontend/components/ui/fallback-message";
import { Progress } from "@/frontend/components/ui/progress";

export default function RoadmapAnalyticsDashboard() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [usageStats, setUsageStats] = useState<RoadmapUsageStats[]>([]);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>("");
  const [detailedAnalytics, setDetailedAnalytics] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<string>("30days");
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [exportLoading, setExportLoading] = useState(false);
  const [trendingRoadmaps, setTrendingRoadmaps] = useState<RoadmapUsageStats[]>(
    [],
  );
  const [isComparing, setIsComparing] = useState(false);
  const [compareRoadmapId, setCompareRoadmapId] = useState<string>("");
  const [comparisonData, setComparisonData] = useState<any>(null);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    fetchUsageStats();
    fetchTrendingRoadmaps();
  }, []);

  useEffect(() => {
    if (selectedRoadmapId) {
      fetchDetailedAnalytics(selectedRoadmapId);
    }
  }, [selectedRoadmapId, timeRange]);

  useEffect(() => {
    if (isComparing && selectedRoadmapId && compareRoadmapId) {
      fetchComparisonData();
    }
  }, [isComparing, selectedRoadmapId, compareRoadmapId]);

  const fetchTrendingRoadmaps = async () => {
    try {
      const data = await roadmapAnalyticsService.getTrendingRoadmaps(5);
      setTrendingRoadmaps(data);
    } catch (error) {
      console.error("Error fetching trending roadmaps:", error);
    }
  };

  const fetchComparisonData = async () => {
    if (!selectedRoadmapId || !compareRoadmapId) return;

    try {
      const data = await roadmapAnalyticsService.compareRoadmaps(
        selectedRoadmapId,
        compareRoadmapId,
      );
      setComparisonData(data);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load comparison data"),
        variant: "destructive",
      });
    }
  };

  const fetchUsageStats = async () => {
    setLoading(true);
    try {
      const data = await roadmapAnalyticsService.getRoadmapUsageStats();
      setUsageStats(data);

      // Select the first roadmap by default if available
      if (data.length > 0 && !selectedRoadmapId) {
        setSelectedRoadmapId(data[0].roadmapId);
      }
    } catch (error) {
      console.error("Error fetching roadmap usage stats:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load roadmap analytics data"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedAnalytics = async (roadmapId: string) => {
    try {
      const data =
        await roadmapAnalyticsService.getRoadmapDetailedAnalytics(roadmapId);

      // Filter data based on selected time range
      if (data && data.rawEvents) {
        const filteredData = filterDataByTimeRange(data.rawEvents, timeRange);
        const processedData = {
          ...data,
          timeData: processTimeData(filteredData),
        };
        setDetailedAnalytics(processedData);
      } else {
        setDetailedAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching detailed analytics:", error);
      toast({
        title: t("Error"),
        description: t("Failed to load detailed analytics"),
        variant: "destructive",
      });
    }
  };

  const filterDataByTimeRange = (data: any[], range: string) => {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case "7days":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30days":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90days":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "all":
        return data;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return data.filter((item) => new Date(item.created_at) >= startDate);
  };

  const processTimeData = (data: any[]) => {
    // Group events by day
    const eventsByDay = data.reduce((acc: Record<string, any[]>, item) => {
      const date = new Date(item.created_at).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {});

    // Convert to array format for charts
    const dailyData = Object.entries(eventsByDay).map(([date, events]) => ({
      date,
      count: events.length,
      viewCount: events.filter((e) => e.action_type === "view").length,
      editCount: events.filter((e) => e.action_type === "edit").length,
      exportCount: events.filter((e) => e.action_type === "export").length,
      shareCount: events.filter((e) => e.action_type === "share").length,
      compareCount: events.filter((e) => e.action_type === "compare").length,
      analyzeCount: events.filter((e) => e.action_type === "analyze").length,
    }));

    // Sort by date
    dailyData.sort((a, b) => a.date.localeCompare(b.date));

    // Calculate totals for pie chart
    const actionCounts = {
      view: data.filter((item) => item.action_type === "view").length,
      edit: data.filter((item) => item.action_type === "edit").length,
      export: data.filter((item) => item.action_type === "export").length,
      share: data.filter((item) => item.action_type === "share").length,
      compare: data.filter((item) => item.action_type === "compare").length,
      analyze: data.filter((item) => item.action_type === "analyze").length,
    };

    const pieData = [
      { name: t("View"), value: actionCounts.view, color: "#8884d8" },
      { name: t("Edit"), value: actionCounts.edit, color: "#82ca9d" },
      { name: t("Export"), value: actionCounts.export, color: "#ffc658" },
      { name: t("Share"), value: actionCounts.share, color: "#ff8042" },
      { name: t("Compare"), value: actionCounts.compare, color: "#0088fe" },
      { name: t("Analyze"), value: actionCounts.analyze, color: "#00C49F" },
    ].filter((item) => item.value > 0);

    // Calculate user engagement metrics
    const uniqueUsers = new Set(
      data.map((item) => item.user_id).filter(Boolean),
    ).size;
    const uniqueSessions = new Set(
      data.map((item) => item.session_id).filter(Boolean),
    ).size;

    // Calculate average actions per user
    const avgActionsPerUser = uniqueUsers > 0 ? data.length / uniqueUsers : 0;

    // Calculate average actions per session
    const avgActionsPerSession =
      uniqueSessions > 0 ? data.length / uniqueSessions : 0;

    // Calculate engagement trend (last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const last7DaysData = data.filter((item) => {
      const date = new Date(item.created_at);
      return date >= last7Days && date <= now;
    });

    const previous7DaysData = data.filter((item) => {
      const date = new Date(item.created_at);
      return date >= previous7Days && date < last7Days;
    });

    const engagementTrend = {
      current: last7DaysData.length,
      previous: previous7DaysData.length,
      change:
        previous7DaysData.length > 0
          ? ((last7DaysData.length - previous7DaysData.length) /
              previous7DaysData.length) *
            100
          : last7DaysData.length > 0
            ? 100
            : 0,
    };

    return {
      dailyData,
      pieData,
      actionCounts,
      uniqueUsers,
      uniqueSessions,
      avgActionsPerUser,
      avgActionsPerSession,
      engagementTrend,
      totalEvents: data.length,
    };
  };

  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");

  const handleExportData = async () => {
    if (!detailedAnalytics) return;

    setExportLoading(true);
    try {
      // Get the selected roadmap name
      const selectedRoadmap = usageStats.find(
        (r) => r.roadmapId === selectedRoadmapId,
      );
      const roadmapName = selectedRoadmap?.roadmapName || "roadmap";

      // Get export data
      const exportData = await roadmapAnalyticsService.exportAnalyticsData(
        selectedRoadmapId,
        timeRange,
        exportFormat,
      );

      if (!exportData) throw new Error("Failed to generate export data");

      // Determine file type and content
      const fileType =
        exportFormat === "json" ? "application/json" : "text/csv";
      const fileContent =
        exportFormat === "json"
          ? JSON.stringify(exportData, null, 2)
          : exportData;
      const fileExtension = exportFormat === "json" ? "json" : "csv";

      // Create blob and download
      const blob = new Blob([fileContent], { type: fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${roadmapName.replace(/\s+/g, "_")}_analytics_${timeRange}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: t("Export Successful"),
        description: t("Analytics data has been exported successfully"),
      });
    } catch (error) {
      console.error("Error exporting analytics data:", error);
      toast({
        title: t("Export Failed"),
        description: t("Failed to export analytics data"),
        variant: "destructive",
      });
    } finally {
      setExportLoading(false);
    }
  };

  const refreshData = () => {
    fetchUsageStats();
    if (selectedRoadmapId) {
      fetchDetailedAnalytics(selectedRoadmapId);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      view: "#8884d8",
      edit: "#82ca9d",
      export: "#ffc658",
      share: "#ff8042",
      compare: "#0088ff",
      analyze: "#00C49F",
    };
    return colors[actionType.toLowerCase()] || "#999999";
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case "view":
        return <Eye className="h-4 w-4" />;
      case "edit":
        return <FileText className="h-4 w-4" />;
      case "export":
        return <Download className="h-4 w-4" />;
      case "share":
        return <Share2 className="h-4 w-4" />;
      case "compare":
        return <RefreshCw className="h-4 w-4" />;
      case "analyze":
        return <ChartBar className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderOverviewTab = () => {
    if (!detailedAnalytics || !detailedAnalytics.timeData) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">{t("No data available")}</p>
        </div>
      );
    }

    const { timeData } = detailedAnalytics;
    const selectedRoadmap = usageStats.find(
      (r) => r.roadmapId === selectedRoadmapId,
    );

    return (
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Total Views")}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {timeData.actionCounts.view || 0}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
              </div>
              {timeData.engagementTrend && (
                <div className="mt-3 flex items-center text-xs">
                  {timeData.engagementTrend.change > 0 ? (
                    <span className="text-green-500 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 mr-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {Math.abs(timeData.engagementTrend.change).toFixed(0)}%
                    </span>
                  ) : timeData.engagementTrend.change < 0 ? (
                    <span className="text-red-500 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3 h-3 mr-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {Math.abs(timeData.engagementTrend.change).toFixed(0)}%
                    </span>
                  ) : (
                    <span className="text-gray-500">0%</span>
                  )}
                  <span className="text-muted-foreground ml-1.5">
                    {t("vs previous period")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Total Interactions")}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {timeData.totalEvents || 0}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <ChartBar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{t("Engagement")}</span>
                  <span>
                    {Math.min(
                      Math.round(
                        (timeData.totalEvents / (timeData.uniqueUsers || 1)) *
                          10,
                      ),
                      100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    Math.round(
                      (timeData.totalEvents / (timeData.uniqueUsers || 1)) * 10,
                    ),
                    100,
                  )}
                  className="h-1.5"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Unique Users")}
                  </p>
                  <h3 className="text-2xl font-bold mt-1">
                    {timeData.uniqueUsers || 0}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <span>
                  {t("Avg")} {timeData.avgActionsPerUser.toFixed(1)}{" "}
                  {t("actions per user")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("Last Activity")}
                  </p>
                  <h3 className="text-lg font-bold mt-1">
                    {detailedAnalytics.rawEvents &&
                    detailedAnalytics.rawEvents.length > 0
                      ? formatDate(detailedAnalytics.rawEvents[0].created_at)
                      : t("No activity")}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                <span>
                  {selectedRoadmap
                    ? t("Created on") +
                      ": " +
                      formatDate(selectedRoadmap.roadmapCreatedAt)
                    : t("No data")}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity over time chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Activity Over Time")}</CardTitle>
            <CardDescription>
              {t("User interactions with this roadmap over time")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {timeData.dailyData && timeData.dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeData.dailyData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 25,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString(i18n.language, {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      angle={-30}
                      textAnchor="end"
                      height={50}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      formatter={(value, name) => {
                        const formattedName =
                          name === "viewCount"
                            ? t("Views")
                            : name === "editCount"
                              ? t("Edits")
                              : name === "exportCount"
                                ? t("Exports")
                                : name === "shareCount"
                                  ? t("Shares")
                                  : name === "compareCount"
                                    ? t("Comparisons")
                                    : name === "analyzeCount"
                                      ? t("Analyses")
                                      : name;
                        return [value, formattedName];
                      }}
                      labelFormatter={(value) => formatDate(value)}
                    />
                    <Legend
                      formatter={(value) => {
                        return value === "viewCount"
                          ? t("Views")
                          : value === "editCount"
                            ? t("Edits")
                            : value === "exportCount"
                              ? t("Exports")
                              : value === "shareCount"
                                ? t("Shares")
                                : value === "compareCount"
                                  ? t("Comparisons")
                                  : value === "analyzeCount"
                                    ? t("Analyses")
                                    : value;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="viewCount"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="editCount"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="exportCount"
                      stroke="#ffc658"
                      strokeWidth={2}
                    />
                    {timeData.dailyData.some((item) => item.shareCount > 0) && (
                      <Line
                        type="monotone"
                        dataKey="shareCount"
                        stroke="#ff8042"
                        strokeWidth={2}
                      />
                    )}
                    {timeData.dailyData.some(
                      (item) => item.compareCount > 0,
                    ) && (
                      <Line
                        type="monotone"
                        dataKey="compareCount"
                        stroke="#0088fe"
                        strokeWidth={2}
                      />
                    )}
                    {timeData.dailyData.some(
                      (item) => item.analyzeCount > 0,
                    ) && (
                      <Line
                        type="monotone"
                        dataKey="analyzeCount"
                        stroke="#00C49F"
                        strokeWidth={2}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    {t("No data available for the selected time period")}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Activity Distribution")}</CardTitle>
              <CardDescription>
                {t("Breakdown of user interactions by type")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {timeData.pieData && timeData.pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeData.pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {timeData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      {t("No data available")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Activity by Type")}</CardTitle>
              <CardDescription>
                {t("Breakdown of actions performed on this roadmap")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {timeData.actionCounts &&
                Object.keys(timeData.actionCounts).some(
                  (key) => timeData.actionCounts[key] > 0,
                ) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: t("View"),
                          value: timeData.actionCounts.view || 0,
                          color: "#8884d8",
                        },
                        {
                          name: t("Edit"),
                          value: timeData.actionCounts.edit || 0,
                          color: "#82ca9d",
                        },
                        {
                          name: t("Export"),
                          value: timeData.actionCounts.export || 0,
                          color: "#ffc658",
                        },
                        {
                          name: t("Share"),
                          value: timeData.actionCounts.share || 0,
                          color: "#ff8042",
                        },
                        {
                          name: t("Compare"),
                          value: timeData.actionCounts.compare || 0,
                          color: "#0088fe",
                        },
                        {
                          name: t("Analyze"),
                          value: timeData.actionCounts.analyze || 0,
                          color: "#00C49F",
                        },
                      ].filter((item) => item.value > 0)}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      layout={isRTL ? "vertical" : "horizontal"}
                    >
                      {!isRTL ? (
                        <>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                        </>
                      ) : (
                        <>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                        </>
                      )}
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        name={t("Count")}
                        label={{ position: "top" }}
                      >
                        {[
                          {
                            name: t("View"),
                            value: timeData.actionCounts.view || 0,
                            color: "#8884d8",
                          },
                          {
                            name: t("Edit"),
                            value: timeData.actionCounts.edit || 0,
                            color: "#82ca9d",
                          },
                          {
                            name: t("Export"),
                            value: timeData.actionCounts.export || 0,
                            color: "#ffc658",
                          },
                          {
                            name: t("Share"),
                            value: timeData.actionCounts.share || 0,
                            color: "#ff8042",
                          },
                          {
                            name: t("Compare"),
                            value: timeData.actionCounts.compare || 0,
                            color: "#0088fe",
                          },
                          {
                            name: t("Analyze"),
                            value: timeData.actionCounts.analyze || 0,
                            color: "#00C49F",
                          },
                        ]
                          .filter((item) => item.value > 0)
                          .map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">
                      {t("No data available")}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderDetailsTab = () => {
    if (
      !detailedAnalytics ||
      !detailedAnalytics.rawEvents ||
      detailedAnalytics.rawEvents.length === 0
    ) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">{t("No data available")}</p>
        </div>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("Detailed Activity Log")}</CardTitle>
          <CardDescription>
            {t("Complete history of interactions with this roadmap")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("Date & Time")}</TableHead>
                  <TableHead>{t("Action")}</TableHead>
                  <TableHead>{t("User")}</TableHead>
                  <TableHead>{t("Details")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedAnalytics.rawEvents
                  .slice(0, 50)
                  .map((event: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {new Date(event.created_at).toLocaleString(
                          i18n.language,
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{
                              backgroundColor: getActionColor(
                                event.action_type,
                              ),
                            }}
                          />
                          <span className="flex items-center">
                            <span className="mr-1.5">
                              {getActionIcon(event.action_type)}
                            </span>
                            {t(
                              event.action_type.charAt(0).toUpperCase() +
                                event.action_type.slice(1),
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.user_id
                          ? event.user_id.substring(0, 8) + "..."
                          : t("Anonymous")}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {event.action_details &&
                        typeof event.action_details === "object"
                          ? JSON.stringify(event.action_details).substring(
                              0,
                              50,
                            ) + "..."
                          : t("No details")}
                      </TableCell>
                    </TableRow>
                  ))}
                {detailedAnalytics.rawEvents.length > 50 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      {t("Showing 50 of {{total}} records", {
                        total: detailedAnalytics.rawEvents.length,
                      })}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComparisonTab = () => {
    if (!comparisonData) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
          <p className="text-muted-foreground">
            {t("Loading comparison data...")}
          </p>
        </div>
      );
    }

    const roadmap1 = comparisonData.roadmap1;
    const roadmap2 = comparisonData.roadmap2;
    const differences = comparisonData.differences;
    const percentageDifferences = comparisonData.percentageDifferences;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Roadmap Comparison")}</CardTitle>
              <CardDescription>
                {t("Comparing metrics between two roadmaps")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      {roadmap1.info?.name || t("Roadmap 1")}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {t("Created")}:{" "}
                      {roadmap1.info?.created_at
                        ? formatDate(roadmap1.info.created_at)
                        : t("Unknown")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      {roadmap2.info?.name || t("Roadmap 2")}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {t("Created")}:{" "}
                      {roadmap2.info?.created_at
                        ? formatDate(roadmap2.info.created_at)
                        : t("Unknown")}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-md font-medium">
                    {t("Key Metrics Comparison")}
                  </h4>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1 font-medium">{t("Metric")}</div>
                    <div className="col-span-1 text-center font-medium">
                      {roadmap1.info?.name || t("Roadmap 1")}
                    </div>
                    <div className="col-span-1 text-center font-medium">
                      {roadmap2.info?.name || t("Roadmap 2")}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1">{t("Total Events")}</div>
                    <div className="col-span-1 text-center">
                      {roadmap1.totalEvents}
                    </div>
                    <div className="col-span-1 text-center">
                      {roadmap2.totalEvents}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1">{t("Unique Users")}</div>
                    <div className="col-span-1 text-center">
                      {roadmap1.uniqueUsers}
                    </div>
                    <div className="col-span-1 text-center">
                      {roadmap2.uniqueUsers}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1">{t("Views")}</div>
                    <div className="col-span-1 text-center">
                      {roadmap1.actionCounts?.view || 0}
                    </div>
                    <div className="col-span-1 text-center">
                      {roadmap2.actionCounts?.view || 0}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1">{t("Edits")}</div>
                    <div className="col-span-1 text-center">
                      {roadmap1.actionCounts?.edit || 0}
                    </div>
                    <div className="col-span-1 text-center">
                      {roadmap2.actionCounts?.edit || 0}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="col-span-1">{t("Exports")}</div>
                    <div className="col-span-1 text-center">
                      {roadmap1.actionCounts?.export || 0}
                    </div>
                    <div className="col-span-1 text-center">
                      {roadmap2.actionCounts?.export || 0}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Difference Analysis")}</CardTitle>
              <CardDescription>
                {t("Analyzing the differences between roadmaps")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium">
                    {t("Absolute Differences")}
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">{t("Total Events")}</div>
                      <div
                        className={`font-medium ${differences.totalEvents > 0 ? "text-green-500" : differences.totalEvents < 0 ? "text-red-500" : ""}`}
                      >
                        {differences.totalEvents > 0 ? "+" : ""}
                        {differences.totalEvents}
                      </div>
                    </div>
                    <Progress
                      value={
                        50 +
                        Math.min(
                          Math.max(
                            (differences.totalEvents /
                              (roadmap2.totalEvents || 1)) *
                              50,
                            -50,
                          ),
                          50,
                        )
                      }
                      className="h-2"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm">{t("Unique Users")}</div>
                      <div
                        className={`font-medium ${differences.uniqueUsers > 0 ? "text-green-500" : differences.uniqueUsers < 0 ? "text-red-500" : ""}`}
                      >
                        {differences.uniqueUsers > 0 ? "+" : ""}
                        {differences.uniqueUsers}
                      </div>
                    </div>
                    <Progress
                      value={
                        50 +
                        Math.min(
                          Math.max(
                            (differences.uniqueUsers /
                              (roadmap2.uniqueUsers || 1)) *
                              50,
                            -50,
                          ),
                          50,
                        )
                      }
                      className="h-2"
                    />

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm">{t("Views")}</div>
                      <div
                        className={`font-medium ${differences.viewCount > 0 ? "text-green-500" : differences.viewCount < 0 ? "text-red-500" : ""}`}
                      >
                        {differences.viewCount > 0 ? "+" : ""}
                        {differences.viewCount}
                      </div>
                    </div>
                    <Progress
                      value={
                        50 +
                        Math.min(
                          Math.max(
                            (differences.viewCount /
                              (roadmap2.actionCounts?.view || 1)) *
                              50,
                            -50,
                          ),
                          50,
                        )
                      }
                      className="h-2"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="text-md font-medium">
                    {t("Percentage Differences")}
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">{t("Total Events")}</div>
                      <div
                        className={`font-medium ${percentageDifferences.totalEvents > 0 ? "text-green-500" : percentageDifferences.totalEvents < 0 ? "text-red-500" : ""}`}
                      >
                        {percentageDifferences.totalEvents > 0 ? "+" : ""}
                        {percentageDifferences.totalEvents.toFixed(1)}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm">{t("Unique Users")}</div>
                      <div
                        className={`font-medium ${percentageDifferences.uniqueUsers > 0 ? "text-green-500" : percentageDifferences.uniqueUsers < 0 ? "text-red-500" : ""}`}
                      >
                        {percentageDifferences.uniqueUsers > 0 ? "+" : ""}
                        {percentageDifferences.uniqueUsers.toFixed(1)}%
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm">{t("Views")}</div>
                      <div
                        className={`font-medium ${percentageDifferences.viewCount > 0 ? "text-green-500" : percentageDifferences.viewCount < 0 ? "text-red-500" : ""}`}
                      >
                        {percentageDifferences.viewCount > 0 ? "+" : ""}
                        {percentageDifferences.viewCount.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("Engagement Comparison")}</CardTitle>
            <CardDescription>
              {t("Comparing user engagement between roadmaps")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: t("Total Events"),
                      roadmap1: roadmap1.totalEvents,
                      roadmap2: roadmap2.totalEvents,
                    },
                    {
                      name: t("Unique Users"),
                      roadmap1: roadmap1.uniqueUsers,
                      roadmap2: roadmap2.uniqueUsers,
                    },
                    {
                      name: t("Views"),
                      roadmap1: roadmap1.actionCounts?.view || 0,
                      roadmap2: roadmap2.actionCounts?.view || 0,
                    },
                    {
                      name: t("Edits"),
                      roadmap1: roadmap1.actionCounts?.edit || 0,
                      roadmap2: roadmap2.actionCounts?.edit || 0,
                    },
                    {
                      name: t("Exports"),
                      roadmap1: roadmap1.actionCounts?.export || 0,
                      roadmap2: roadmap2.actionCounts?.export || 0,
                    },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => {
                      return [
                        value,
                        name === "roadmap1"
                          ? roadmap1.info?.name || t("Roadmap 1")
                          : roadmap2.info?.name || t("Roadmap 2"),
                      ];
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      return value === "roadmap1"
                        ? roadmap1.info?.name || t("Roadmap 1")
                        : roadmap2.info?.name || t("Roadmap 2");
                    }}
                  />
                  <Bar dataKey="roadmap1" fill="#8884d8" name="roadmap1" />
                  <Bar dataKey="roadmap2" fill="#82ca9d" name="roadmap2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderUserAnalyticsTab = () => {
    if (!detailedAnalytics || !detailedAnalytics.timeData) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">{t("No data available")}</p>
        </div>
      );
    }

    const { timeData } = detailedAnalytics;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("User Engagement")}</CardTitle>
              <CardDescription>
                {t("How users interact with this roadmap")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {t("Unique Users")}
                    </div>
                    <div className="font-medium">{timeData.uniqueUsers}</div>
                  </div>
                  <Progress
                    value={Math.min(timeData.uniqueUsers * 2, 100)}
                    className="h-2 mt-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {t("Unique Sessions")}
                    </div>
                    <div className="font-medium">{timeData.uniqueSessions}</div>
                  </div>
                  <Progress
                    value={Math.min(timeData.uniqueSessions, 100)}
                    className="h-2 mt-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {t("Avg. Actions Per User")}
                    </div>
                    <div className="font-medium">
                      {timeData.avgActionsPerUser.toFixed(1)}
                    </div>
                  </div>
                  <Progress
                    value={Math.min(timeData.avgActionsPerUser * 10, 100)}
                    className="h-2 mt-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {t("Avg. Actions Per Session")}
                    </div>
                    <div className="font-medium">
                      {timeData.avgActionsPerSession.toFixed(1)}
                    </div>
                  </div>
                  <Progress
                    value={Math.min(timeData.avgActionsPerSession * 10, 100)}
                    className="h-2 mt-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("User Activity")}</CardTitle>
              <CardDescription>
                {t("How users interact with this roadmap")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(timeData.actionCounts)
                  .filter(([_, count]) => (count as number) > 0)
                  .sort(([_, a], [__, b]) => (b as number) - (a as number))
                  .map(([action, count]) => (
                    <div key={action}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium">
                          <span
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: getActionColor(action) }}
                          />
                          {t(action.charAt(0).toUpperCase() + action.slice(1))}
                        </div>
                        <div className="font-medium">{count as number}</div>
                      </div>
                      <Progress
                        value={Math.min(
                          ((count as number) / timeData.totalEvents) * 100,
                          100,
                        )}
                        className="h-2 mt-2"
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t("Engagement Trend")}</CardTitle>
              <CardDescription>
                {t("Comparison with previous period")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timeData.engagementTrend && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">
                        {t("Current Period")}
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {timeData.engagementTrend.current}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t("Last 7 days")}
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="text-sm text-muted-foreground">
                        {t("Previous Period")}
                      </div>
                      <div className="text-2xl font-bold mt-1">
                        {timeData.engagementTrend.previous}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {t("7-14 days ago")}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">
                      {t("Change")}
                    </div>
                    <div
                      className={`text-2xl font-bold mt-1 flex items-center ${timeData.engagementTrend.change > 0 ? "text-green-500" : timeData.engagementTrend.change < 0 ? "text-red-500" : ""}`}
                    >
                      {timeData.engagementTrend.change > 0 ? "+" : ""}
                      {timeData.engagementTrend.change.toFixed(1)}%
                    </div>
                    <div className="mt-2">
                      <Progress
                        value={
                          50 +
                          Math.min(
                            Math.max(timeData.engagementTrend.change, -100),
                            100,
                          ) /
                            2
                        }
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            {t("Loading analytics data...")}
          </p>
        </div>
      </div>
    );
  }

  if (usageStats.length === 0) {
    return (
      <FallbackMessage
        title={t("No Roadmap Analytics Available")}
        message={t(
          "There are no analytics data available yet. Create and share roadmaps to start collecting analytics.",
        )}
        icon={
          <ChartBar className="h-12 w-12 text-muted-foreground opacity-50" />
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">{t("Roadmap Analytics")}</h2>
          <p className="text-muted-foreground">
            {t("Track usage and engagement metrics for your roadmaps")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("Select time range")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">{t("Last 7 days")}</SelectItem>
              <SelectItem value="30days">{t("Last 30 days")}</SelectItem>
              <SelectItem value="90days">{t("Last 90 days")}</SelectItem>
              <SelectItem value="all">{t("All time")}</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={exportFormat}
            onValueChange={(value) => setExportFormat(value as "json" | "csv")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t("Format")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={refreshData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={exportLoading || !detailedAnalytics}
          >
            {exportLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            {t("Export")}
          </Button>
          <Button
            variant={isComparing ? "default" : "outline"}
            onClick={() => setIsComparing(!isComparing)}
            disabled={!selectedRoadmapId}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isComparing ? t("Cancel Compare") : t("Compare")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="col-span-1 md:col-span-4">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
              <div className="flex-1 flex flex-col md:flex-row gap-4">
                <Select
                  value={selectedRoadmapId}
                  onValueChange={setSelectedRoadmapId}
                >
                  <SelectTrigger className="w-full md:w-[300px]">
                    <SelectValue placeholder={t("Select a roadmap")} />
                  </SelectTrigger>
                  <SelectContent>
                    {usageStats.map((roadmap) => (
                      <SelectItem
                        key={roadmap.roadmapId}
                        value={roadmap.roadmapId}
                      >
                        {roadmap.roadmapName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isComparing && (
                  <Select
                    value={compareRoadmapId}
                    onValueChange={setCompareRoadmapId}
                  >
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue
                        placeholder={t("Select roadmap to compare")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {usageStats
                        .filter(
                          (roadmap) => roadmap.roadmapId !== selectedRoadmapId,
                        )
                        .map((roadmap) => (
                          <SelectItem
                            key={roadmap.roadmapId}
                            value={roadmap.roadmapId}
                          >
                            {roadmap.roadmapName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {selectedRoadmapId && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("Users")}:{" "}
                      {usageStats.find((r) => r.roadmapId === selectedRoadmapId)
                        ?.uniqueUsers || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("Views")}:{" "}
                      {usageStats.find((r) => r.roadmapId === selectedRoadmapId)
                        ?.viewCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {t("Created")}:{" "}
                      {usageStats.find((r) => r.roadmapId === selectedRoadmapId)
                        ?.roadmapCreatedAt
                        ? new Date(
                            usageStats.find(
                              (r) => r.roadmapId === selectedRoadmapId,
                            )?.roadmapCreatedAt || "",
                          ).toLocaleDateString()
                        : t("Unknown")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedRoadmapId ? (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
            <TabsTrigger value="users">{t("User Analytics")}</TabsTrigger>
            <TabsTrigger value="details">{t("Detailed Activity")}</TabsTrigger>
            {isComparing && compareRoadmapId && (
              <TabsTrigger value="comparison">{t("Comparison")}</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {renderOverviewTab()}
          </TabsContent>
          <TabsContent value="users" className="space-y-4">
            {renderUserAnalyticsTab()}
          </TabsContent>
          <TabsContent value="details" className="space-y-4">
            {renderDetailsTab()}
          </TabsContent>
          {isComparing && compareRoadmapId && (
            <TabsContent value="comparison" className="space-y-4">
              {renderComparisonTab()}
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <ChartBar className="h-12 w-12 text-muted-foreground opacity-50" />
            <div>
              <h3 className="text-lg font-medium">{t("Select a Roadmap")}</h3>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Choose a roadmap from the dropdown above to view its analytics",
                )}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
