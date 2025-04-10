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

export type ErrorSeverity = "critical" | "error" | "warning" | "info";

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: ErrorSeverity;
  message: string;
  source: string;
  stackTrace?: string;
  userId?: string;
  metadata?: Record<string, any>;
  isBackgroundJob?: boolean;
  jobType?: string;
  retryCount?: number;
  status?: "failed" | "pending" | "completed" | "retrying";
}

export interface SlowQuery {
  id: string;
  timestamp: string;
  query: string;
  duration: number; // in ms
  table: string;
  source: string;
  userId?: string;
  status?: "optimized" | "pending" | "investigating";
}

export interface ErrorTrend {
  date: string;
  critical: number;
  error: number;
  warning: number;
  info: number;
  total: number;
}

export interface ModuleError {
  module: string;
  critical: number;
  error: number;
  warning: number;
  info: number;
  total: number;
}

export interface RepeatedError {
  id: string;
  message: string;
  level: ErrorSeverity;
  source: string;
  occurrences: number;
  firstOccurrence: string;
  lastOccurrence: string;
  stackTrace?: string;
  aiSuggestion?: string;
  isBackgroundJob?: boolean;
  status?: string;
}

export interface SupabaseLog {
  id: string;
  timestamp: string;
  method: string; // GET, POST, etc.
  event: string; // query, auth, storage, etc.
  duration?: number;
  schema: string;
  table: string;
  query?: string;
  error?: string;
  executionTime?: number;
  metadata?: Record<string, any>;
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
 * Get error logs with enhanced filtering
 */
export const getErrorLogs = async (
  limit: number = 100,
  offset: number = 0,
  level?: ErrorSeverity,
  startDate?: Date,
  endDate?: Date,
  source?: string,
): Promise<ErrorLog[]> => {
  try {
    // In a real implementation, this would query an error_logs table
    let logs = getMockErrorLogs();

    // Apply filters
    if (level) {
      logs = logs.filter((log) => log.level === level);
    }

    if (startDate) {
      logs = logs.filter((log) => new Date(log.timestamp) >= startDate);
    }

    if (endDate) {
      logs = logs.filter((log) => new Date(log.timestamp) <= endDate);
    }

    if (source) {
      logs = logs.filter((log) => log.source === source);
    }

    return logs.slice(offset, offset + limit);
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
/**
 * Get error trends over time
 */
export const getErrorTrends = async (
  startDate: Date,
  endDate: Date,
): Promise<ErrorTrend[]> => {
  try {
    // In a real implementation, this would query from an analytics table
    // For now, we'll generate mock data
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    return Array.from({ length: days }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      // Generate random counts with some correlation
      // More critical errors should generally mean more errors overall
      const criticalBase = Math.floor(Math.random() * 5);
      const errorBase = Math.floor(Math.random() * 15) + criticalBase;
      const warningBase = Math.floor(Math.random() * 30) + errorBase;

      return {
        date: dateStr,
        critical: criticalBase,
        error: errorBase,
        warning: warningBase,
        info: Math.floor(Math.random() * 50) + warningBase,
        total: 0, // Will be calculated below
      };
    }).map((day) => ({
      ...day,
      total: day.critical + day.error + day.warning + day.info,
    }));
  } catch (error) {
    console.error("Error fetching error trends:", error);
    throw error;
  }
};

/**
 * Get errors grouped by module
 */
export const getErrorsByModule = async (
  startDate: Date,
  endDate: Date,
): Promise<ModuleError[]> => {
  try {
    // In a real implementation, this would query from an error_logs table with aggregation
    // For now, we'll generate mock data based on the modules in the system
    const modules = [
      "api",
      "database",
      "auth",
      "frontend",
      "background-job",
      "store",
      "marketing",
      "analytics",
      "inbox",
      "documents",
    ];

    return modules.map((module) => {
      // Generate random counts with some correlation
      const criticalBase = Math.floor(Math.random() * 8);
      const errorBase = Math.floor(Math.random() * 20) + criticalBase;
      const warningBase = Math.floor(Math.random() * 40) + errorBase;
      const infoBase = Math.floor(Math.random() * 60) + warningBase;

      return {
        module,
        critical: criticalBase,
        error: errorBase,
        warning: warningBase,
        info: infoBase,
        total: criticalBase + errorBase + warningBase + infoBase,
      };
    });
  } catch (error) {
    console.error("Error fetching errors by module:", error);
    throw error;
  }
};

/**
 * Get repeated errors
 */
export const getRepeatedErrors = async (
  startDate: Date,
  endDate: Date,
): Promise<RepeatedError[]> => {
  try {
    // In a real implementation, this would query from an error_logs table with aggregation
    // For now, we'll generate mock data
    const errorMessages = [
      "Connection timeout",
      "Database query failed",
      "Authentication error",
      "Resource not found",
      "Permission denied",
      "Rate limit exceeded",
      "Internal server error",
      "Service unavailable",
    ];

    const sources = ["api", "database", "auth", "frontend", "background-job"];

    return errorMessages.slice(0, 5).map((message, i) => {
      const level: ErrorSeverity =
        i === 0 ? "critical" : i < 2 ? "error" : i < 4 ? "warning" : "info";

      const source = sources[i % sources.length];
      const occurrences = Math.floor(Math.random() * 50) + 5;
      const isBackgroundJob = source === "background-job";

      // Some errors have AI suggestions
      const aiSuggestion =
        i < 3
          ? i === 0
            ? "Check network connectivity and increase timeout settings. Verify the database server is responding properly."
            : i === 1
              ? "Review the SQL query for syntax errors. Ensure proper indexing on frequently queried columns."
              : "Verify user credentials and token expiration. Check authentication service status."
          : undefined;

      return {
        id: `repeated-${i}`,
        message,
        level,
        source,
        occurrences,
        firstOccurrence: new Date(
          Date.now() - (Math.random() * 10 + 4) * 24 * 60 * 60 * 1000,
        ).toISOString(),
        lastOccurrence: new Date(
          Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        stackTrace:
          level === "critical" || level === "error"
            ? `Error: ${message}\n    at processRequest (${source}.js:42:15)\n    at handleRequest (server.js:123:10)`
            : undefined,
        aiSuggestion,
        isBackgroundJob,
        status: isBackgroundJob ? "failed" : undefined,
      };
    });
  } catch (error) {
    console.error("Error fetching repeated errors:", error);
    throw error;
  }
};

/**
 * Retry a failed background job
 */
export const retryFailedJob = async (jobId: string): Promise<boolean> => {
  try {
    // In a real implementation, this would call a job queue API or update a database record
    console.log(`Retrying job ${jobId}`);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return true;
  } catch (error) {
    console.error(`Error retrying job ${jobId}:`, error);
    throw error;
  }
};

/**
 * Get Supabase logs
 */
export const getSupabaseLogs = async (
  startDate: Date,
  endDate: Date,
): Promise<SupabaseLog[]> => {
  try {
    // In a real implementation, this would query from Supabase's logging API
    // For now, we'll generate mock data
    return Array.from({ length: 50 }, (_, i) => {
      const methods = ["GET", "POST", "PUT", "DELETE"];
      const events = ["query", "auth", "storage", "function", "realtime"];
      const schemas = ["public", "auth", "storage"];
      const tables = ["users", "profiles", "products", "orders", "logs"];

      const method = methods[Math.floor(Math.random() * methods.length)];
      const event = events[Math.floor(Math.random() * events.length)];
      const schema = schemas[Math.floor(Math.random() * schemas.length)];
      const table = tables[Math.floor(Math.random() * tables.length)];

      const hasError = Math.random() > 0.8;
      const executionTime = Math.floor(Math.random() * 1000) + 10;

      return {
        id: `supabase-log-${i}`,
        timestamp: new Date(
          startDate.getTime() +
            Math.random() * (endDate.getTime() - startDate.getTime()),
        ).toISOString(),
        method,
        event,
        duration: executionTime,
        schema,
        table,
        query:
          event === "query"
            ? `SELECT * FROM ${schema}.${table} WHERE id = 'xyz'`
            : undefined,
        error: hasError ? "Permission denied for schema public" : undefined,
        executionTime,
        metadata: {
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          user_agent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          status_code: hasError ? 403 : 200,
        },
      };
    });
  } catch (error) {
    console.error("Error fetching Supabase logs:", error);
    throw error;
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
  const sources = [
    "api",
    "database",
    "auth",
    "frontend",
    "background-job",
    "store",
    "marketing",
    "analytics",
    "inbox",
    "documents",
  ];
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
    "Failed to process payment",
    "Email delivery failed",
    "File upload error",
    "API rate limit exceeded",
    "Invalid configuration",
    "Database connection lost",
    "Memory limit exceeded",
    "Deadlock detected",
    "SSL certificate error",
    "Cache invalidation failed",
  ];

  const jobTypes = [
    "email-sender",
    "report-generator",
    "data-sync",
    "backup",
    "image-processing",
  ];

  return Array.from({ length: 200 }, (_, i) => {
    // Generate a more realistic distribution of error levels
    let level: ErrorSeverity;
    const rand = Math.random();
    if (rand > 0.95) {
      level = "critical";
    } else if (rand > 0.7) {
      level = "error";
    } else if (rand > 0.4) {
      level = "warning";
    } else {
      level = "info";
    }

    const source = sources[Math.floor(Math.random() * sources.length)];
    const message =
      errorMessages[Math.floor(Math.random() * errorMessages.length)];
    const isBackgroundJob = source === "background-job" || Math.random() > 0.8;
    const jobType = isBackgroundJob
      ? jobTypes[Math.floor(Math.random() * jobTypes.length)]
      : undefined;
    const retryCount = isBackgroundJob
      ? Math.floor(Math.random() * 3)
      : undefined;

    // Make some errors appear multiple times to simulate repeated errors
    const repeatedErrorIndex = Math.floor(i / 20); // Every 20 entries will have the same error
    const isRepeatedError =
      i % 20 < 3 && repeatedErrorIndex < errorMessages.length;

    const finalMessage = isRepeatedError
      ? errorMessages[repeatedErrorIndex]
      : message;

    const finalSource = isRepeatedError
      ? sources[repeatedErrorIndex % sources.length]
      : source;

    return {
      id: `error-${i}`,
      timestamp: new Date(
        Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000, // Up to 14 days ago
      ).toISOString(),
      level,
      message: finalMessage,
      source: finalSource,
      stackTrace:
        level === "critical" || level === "error"
          ? `Error: ${finalMessage}\n    at processRequest (${finalSource}.js:42:15)\n    at handleRequest (server.js:123:10)\n    at executeMiddleware (middleware.js:45:12)\n    at processNextMiddleware (express.js:67:22)`
          : undefined,
      userId:
        Math.random() > 0.3
          ? `user-${Math.floor(Math.random() * 100)}`
          : undefined,
      metadata: {
        browser:
          Math.random() > 0.5
            ? "Chrome"
            : Math.random() > 0.3
              ? "Firefox"
              : "Safari",
        os:
          Math.random() > 0.6
            ? "Windows"
            : Math.random() > 0.3
              ? "MacOS"
              : "Linux",
        url: `/api/${finalSource}/${Math.floor(Math.random() * 10)}`,
        statusCode:
          level === "error" || level === "critical"
            ? 500
            : level === "warning"
              ? 400
              : 200,
      },
      isBackgroundJob,
      jobType,
      retryCount,
      status: isBackgroundJob
        ? level === "critical" || level === "error"
          ? "failed"
          : Math.random() > 0.7
            ? "completed"
            : Math.random() > 0.5
              ? "pending"
              : "retrying"
        : undefined,
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
