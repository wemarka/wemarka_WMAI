import { supabase } from "@/lib/supabase";

export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  uptime: number; // in seconds
  lastRestart: string;
  version: string;
  environment: string;
  responseTime: number; // in ms
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  diskUsage: number; // percentage
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info";
  message: string;
  source: string;
  stackTrace?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface SlowQuery {
  id: string;
  timestamp: string;
  query: string;
  duration: number; // in ms
  table: string;
  source: string;
  userId?: string;
}

export interface UsageMetric {
  date: string;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: number; // in seconds
}

export interface ModuleUsage {
  module: string;
  accessCount: number;
  uniqueUsers: number;
  avgTimeSpent: number; // in seconds
}

/**
 * Get system health metrics
 */
export const getSystemHealth = async (): Promise<SystemHealth> => {
  try {
    // In a real implementation, this would fetch from a health endpoint or table
    // For now, we'll return mock data
    return getMockSystemHealth();
  } catch (error) {
    console.error("Error fetching system health:", error);
    throw error;
  }
};

/**
 * Get error logs with optional filtering
 */
export const getErrorLogs = async (
  limit: number = 100,
  offset: number = 0,
  level?: "error" | "warning" | "info",
  startDate?: Date,
  endDate?: Date,
): Promise<ErrorLog[]> => {
  try {
    // In a real implementation, this would query an error_logs table
    // For now, we'll return mock data
    return getMockErrorLogs().slice(offset, offset + limit);
  } catch (error) {
    console.error("Error fetching error logs:", error);
    throw error;
  }
};

/**
 * Get slow queries with optional filtering
 */
export const getSlowQueries = async (
  limit: number = 100,
  offset: number = 0,
  minDuration?: number,
  startDate?: Date,
  endDate?: Date,
): Promise<SlowQuery[]> => {
  try {
    // In a real implementation, this would query a query_logs table
    // For now, we'll return mock data
    let queries = getMockSlowQueries();

    if (minDuration) {
      queries = queries.filter((q) => q.duration >= minDuration);
    }

    return queries.slice(offset, offset + limit);
  } catch (error) {
    console.error("Error fetching slow queries:", error);
    throw error;
  }
};

/**
 * Get daily usage metrics for a date range
 */
export const getUsageMetrics = async (
  startDate: Date,
  endDate: Date,
): Promise<UsageMetric[]> => {
  try {
    // In a real implementation, this would query from user_sessions or analytics tables
    // For now, we'll return mock data
    const { data, error } = await supabase
      .from("active_users")
      .select("*")
      .gte("date", startDate.toISOString().split("T")[0])
      .lte("date", endDate.toISOString().split("T")[0])
      .order("date");

    if (error) {
      console.error("Error fetching usage metrics from Supabase:", error);
      return getMockUsageMetrics(startDate, endDate);
    }

    if (!data || data.length === 0) {
      return getMockUsageMetrics(startDate, endDate);
    }

    return data.map((item) => ({
      date: item.date,
      activeUsers: item.user_count || 0,
      totalSessions: item.visit_count || 0,
      avgSessionDuration: item.avg_session_time || 0,
    }));
  } catch (error) {
    console.error("Error fetching usage metrics:", error);
    return getMockUsageMetrics(startDate, endDate);
  }
};

/**
 * Get module usage statistics
 */
export const getModuleUsage = async (): Promise<ModuleUsage[]> => {
  try {
    // In a real implementation, this would query from a module_access table
    // For now, we'll return mock data
    return getMockModuleUsage();
  } catch (error) {
    console.error("Error fetching module usage:", error);
    throw error;
  }
};

// Mock data generators
const getMockSystemHealth = (): SystemHealth => {
  return {
    status: Math.random() > 0.9 ? "degraded" : "healthy",
    uptime: Math.floor(Math.random() * 30 * 24 * 60 * 60), // Up to 30 days in seconds
    lastRestart: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    version: "1.0." + Math.floor(Math.random() * 100),
    environment: Math.random() > 0.5 ? "production" : "staging",
    responseTime: Math.floor(Math.random() * 500), // 0-500ms
    cpuUsage: Math.floor(Math.random() * 100),
    memoryUsage: Math.floor(Math.random() * 100),
    diskUsage: Math.floor(Math.random() * 100),
  };
};

const getMockErrorLogs = (): ErrorLog[] => {
  const sources = ["api", "database", "auth", "frontend", "background-job"];
  const errorMessages = [
    "Connection timeout",
    "Database query failed",
    "Authentication error",
    "Invalid input",
    "Resource not found",
    "Permission denied",
    "Rate limit exceeded",
    "Internal server error",
    "Service unavailable",
    "Unexpected error",
  ];

  return Array.from({ length: 200 }, (_, i) => {
    const level =
      Math.random() > 0.7 ? "error" : Math.random() > 0.5 ? "warning" : "info";
    const source = sources[Math.floor(Math.random() * sources.length)];
    const message =
      errorMessages[Math.floor(Math.random() * errorMessages.length)];

    return {
      id: `error-${i}`,
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      level: level as "error" | "warning" | "info",
      message,
      source,
      stackTrace:
        level === "error"
          ? `Error: ${message}\n    at processRequest (${source}.js:42:15)\n    at handleRequest (server.js:123:10)`
          : undefined,
      userId:
        Math.random() > 0.3
          ? `user-${Math.floor(Math.random() * 100)}`
          : undefined,
      metadata: {
        browser: Math.random() > 0.5 ? "Chrome" : "Firefox",
        os:
          Math.random() > 0.7
            ? "Windows"
            : Math.random() > 0.5
              ? "MacOS"
              : "Linux",
        url: `/api/${source}/${Math.floor(Math.random() * 10)}`,
      },
    };
  });
};

const getMockSlowQueries = (): SlowQuery[] => {
  const tables = [
    "users",
    "products",
    "orders",
    "analytics",
    "logs",
    "permissions",
  ];
  const queryTypes = ["SELECT", "INSERT", "UPDATE", "DELETE"];

  return Array.from({ length: 100 }, (_, i) => {
    const table = tables[Math.floor(Math.random() * tables.length)];
    const queryType = queryTypes[Math.floor(Math.random() * queryTypes.length)];
    const duration = Math.floor(Math.random() * 10000) + 500; // 500ms to 10.5s

    return {
      id: `query-${i}`,
      timestamp: new Date(
        Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      query: `${queryType} FROM ${table} WHERE id = 'xyz' AND ...`,
      duration,
      table,
      source: Math.random() > 0.5 ? "api" : "background-job",
      userId:
        Math.random() > 0.3
          ? `user-${Math.floor(Math.random() * 100)}`
          : undefined,
    };
  });
};

const getMockUsageMetrics = (startDate: Date, endDate: Date): UsageMetric[] => {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    return {
      date: date.toISOString().split("T")[0],
      activeUsers: Math.floor(Math.random() * 1000) + 100,
      totalSessions: Math.floor(Math.random() * 2000) + 200,
      avgSessionDuration: Math.floor(Math.random() * 600) + 60, // 1-10 minutes
    };
  });
};

const getMockModuleUsage = (): ModuleUsage[] => {
  const modules = [
    "Dashboard",
    "Store",
    "Accounting",
    "Marketing",
    "Inbox",
    "Analytics",
    "Customers",
    "Documents",
    "Integrations",
    "Developer",
    "Settings",
  ];

  return modules.map((module) => ({
    module,
    accessCount: Math.floor(Math.random() * 10000) + 100,
    uniqueUsers: Math.floor(Math.random() * 500) + 50,
    avgTimeSpent: Math.floor(Math.random() * 900) + 60, // 1-15 minutes
  }));
};
