import { supabase } from "@/lib/supabase";

/**
 * Service for tracking and analyzing roadmap usage
 */
export interface RoadmapAnalyticsEvent {
  roadmapId: string;
  actionType: "view" | "edit" | "export" | "share" | "compare" | "analyze";
  actionDetails?: Record<string, any>;
  sessionId?: string;
}

export interface RoadmapUsageStats {
  roadmapId: string;
  roadmapName: string;
  roadmapCreatedAt: string;
  uniqueUsers: number;
  totalInteractions: number;
  viewCount: number;
  editCount: number;
  exportCount: number;
  lastInteractionAt: string;
}

/**
 * Track a roadmap analytics event
 */
export const trackRoadmapEvent = async (
  event: RoadmapAnalyticsEvent,
): Promise<boolean> => {
  try {
    // Get current user session
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    // Generate a session ID if not provided
    const sessionId = event.sessionId || generateSessionId();

    const { error } = await supabase.from("roadmap_analytics").insert({
      roadmap_id: event.roadmapId,
      user_id: userId,
      action_type: event.actionType,
      action_details: event.actionDetails || {},
      session_id: sessionId,
    });

    if (error) {
      console.error("Error tracking roadmap event:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in trackRoadmapEvent:", error);
    return false;
  }
};

/**
 * Get usage statistics for all roadmaps
 */
export const getRoadmapUsageStats = async (): Promise<RoadmapUsageStats[]> => {
  try {
    const { data, error } = await supabase
      .from("roadmap_usage_stats")
      .select("*")
      .order("total_interactions", { ascending: false });

    if (error) {
      console.error("Error fetching roadmap usage stats:", error);
      return [];
    }

    return data.map((item) => ({
      roadmapId: item.roadmap_id,
      roadmapName: item.roadmap_name,
      roadmapCreatedAt: item.roadmap_created_at,
      uniqueUsers: item.unique_users,
      totalInteractions: item.total_interactions,
      viewCount: item.view_count,
      editCount: item.edit_count,
      exportCount: item.export_count,
      lastInteractionAt: item.last_interaction_at,
    }));
  } catch (error) {
    console.error("Error in getRoadmapUsageStats:", error);
    return [];
  }
};

/**
 * Get detailed analytics for a specific roadmap
 */
export const getRoadmapDetailedAnalytics = async (
  roadmapId: string,
): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from("roadmap_analytics")
      .select("*")
      .eq("roadmap_id", roadmapId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching roadmap detailed analytics:", error);
      return null;
    }

    // Process the data to extract useful insights
    const actionCounts = data.reduce((acc: Record<string, number>, item) => {
      const actionType = item.action_type;
      acc[actionType] = (acc[actionType] || 0) + 1;
      return acc;
    }, {});

    // Get unique users count
    const uniqueUsers = new Set(
      data.map((item) => item.user_id).filter(Boolean),
    ).size;

    // Get unique sessions count
    const uniqueSessions = new Set(
      data.map((item) => item.session_id).filter(Boolean),
    ).size;

    // Calculate time-based metrics
    const timeData = processTimeData(data);

    return {
      totalEvents: data.length,
      actionCounts,
      uniqueUsers,
      uniqueSessions,
      timeData,
      rawEvents: data,
    };
  } catch (error) {
    console.error("Error in getRoadmapDetailedAnalytics:", error);
    return null;
  }
};

/**
 * Process time-based data for analytics
 */
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

  // Calculate user engagement metrics
  const uniqueUsers = new Set(data.map((item) => item.user_id).filter(Boolean))
    .size;
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
    actionCounts,
    uniqueUsers,
    uniqueSessions,
    avgActionsPerUser,
    avgActionsPerSession,
    engagementTrend,
    totalEvents: data.length,
  };
};

/**
 * Generate a session ID
 */
const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Export analytics data to JSON format
 */
const exportAnalyticsData = async (
  roadmapId: string,
  timeRange: string = "all",
  format: "json" | "csv" = "json",
) => {
  try {
    const data = await getRoadmapDetailedAnalytics(roadmapId);
    if (!data) return null;

    // Get roadmap info
    const roadmapInfo = await getRoadmapInfo(roadmapId);

    const exportData = {
      roadmapInfo,
      timeRange,
      analytics: data,
      exportDate: new Date().toISOString(),
    };

    if (format === "csv") {
      return convertToCSV(exportData);
    }

    return exportData;
  } catch (error) {
    console.error("Error exporting analytics data:", error);
    return null;
  }
};

/**
 * Convert analytics data to CSV format
 */
const convertToCSV = (data: any): string => {
  try {
    // Extract daily data for CSV
    const dailyData = data.analytics.timeData.dailyData;

    if (!dailyData || dailyData.length === 0) {
      return "No data available";
    }

    // Create headers
    const headers = Object.keys(dailyData[0]).join(",");

    // Create rows
    const rows = dailyData
      .map((row: any) => {
        return Object.values(row).join(",");
      })
      .join("\n");

    return `${headers}\n${rows}`;
  } catch (error) {
    console.error("Error converting to CSV:", error);
    return "Error generating CSV";
  }
};

/**
 * Get basic info about a roadmap
 */
const getRoadmapInfo = async (roadmapId: string) => {
  try {
    const { data, error } = await supabase
      .from("project_roadmaps")
      .select("id, name, created_at")
      .eq("id", roadmapId)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching roadmap info:", error);
    return null;
  }
};

/**
 * Get roadmap comparison data between two roadmaps
 */
const compareRoadmaps = async (
  roadmapId1: string,
  roadmapId2: string,
): Promise<any> => {
  try {
    const data1 = await getRoadmapDetailedAnalytics(roadmapId1);
    const data2 = await getRoadmapDetailedAnalytics(roadmapId2);

    if (!data1 || !data2) return null;

    // Get roadmap info
    const roadmap1Info = await getRoadmapInfo(roadmapId1);
    const roadmap2Info = await getRoadmapInfo(roadmapId2);

    // Compare metrics
    const comparison = {
      roadmap1: {
        info: roadmap1Info,
        totalEvents: data1.totalEvents,
        uniqueUsers: data1.uniqueUsers,
        actionCounts: data1.actionCounts,
      },
      roadmap2: {
        info: roadmap2Info,
        totalEvents: data2.totalEvents,
        uniqueUsers: data2.uniqueUsers,
        actionCounts: data2.actionCounts,
      },
      differences: {
        totalEvents: data1.totalEvents - data2.totalEvents,
        uniqueUsers: data1.uniqueUsers - data2.uniqueUsers,
        viewCount:
          (data1.actionCounts.view || 0) - (data2.actionCounts.view || 0),
        editCount:
          (data1.actionCounts.edit || 0) - (data2.actionCounts.edit || 0),
        exportCount:
          (data1.actionCounts.export || 0) - (data2.actionCounts.export || 0),
      },
      percentageDifferences: {
        totalEvents: data2.totalEvents
          ? ((data1.totalEvents - data2.totalEvents) / data2.totalEvents) * 100
          : 0,
        uniqueUsers: data2.uniqueUsers
          ? ((data1.uniqueUsers - data2.uniqueUsers) / data2.uniqueUsers) * 100
          : 0,
        viewCount: data2.actionCounts.view
          ? (((data1.actionCounts.view || 0) - (data2.actionCounts.view || 0)) /
              (data2.actionCounts.view || 1)) *
            100
          : 0,
        editCount: data2.actionCounts.edit
          ? (((data1.actionCounts.edit || 0) - (data2.actionCounts.edit || 0)) /
              (data2.actionCounts.edit || 1)) *
            100
          : 0,
        exportCount: data2.actionCounts.export
          ? (((data1.actionCounts.export || 0) -
              (data2.actionCounts.export || 0)) /
              (data2.actionCounts.export || 1)) *
            100
          : 0,
      },
    };

    return comparison;
  } catch (error) {
    console.error("Error comparing roadmaps:", error);
    return null;
  }
};

/**
 * Get trending roadmaps based on recent activity
 */
const getTrendingRoadmaps = async (limit: number = 5): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from("roadmap_usage_stats")
      .select("*")
      .order("last_interaction_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map((item) => ({
      roadmapId: item.roadmap_id,
      roadmapName: item.roadmap_name,
      roadmapCreatedAt: item.roadmap_created_at,
      uniqueUsers: item.unique_users,
      totalInteractions: item.total_interactions,
      viewCount: item.view_count,
      editCount: item.edit_count,
      exportCount: item.export_count,
      lastInteractionAt: item.last_interaction_at,
    }));
  } catch (error) {
    console.error("Error fetching trending roadmaps:", error);
    return [];
  }
};

// Export the service object
export const roadmapAnalyticsService = {
  trackRoadmapEvent,
  getRoadmapUsageStats,
  getRoadmapDetailedAnalytics,
  exportAnalyticsData,
  getRoadmapInfo,
  compareRoadmaps,
  getTrendingRoadmaps,
  convertToCSV,
};
