import { supabase } from "@/lib/supabase";
import {
  getSystemHealth,
  SystemHealth,
} from "@/frontend/services/monitoringService";

/**
 * Updates the system health data in the database
 * This function can be called periodically to update the system health data
 */
export const updateSystemHealthData = async (): Promise<boolean> => {
  try {
    // Get the current system health data
    const healthData = await getSystemHealth();

    // Format the data for the database
    const formattedData = {
      status: healthData.status,
      uptime: healthData.uptime,
      last_restart: healthData.lastRestart,
      version: healthData.version,
      environment: healthData.environment,
      response_time_ms: healthData.responseTime,
      cpu_usage: healthData.cpuUsage,
      memory_usage: healthData.memoryUsage,
      disk_usage: healthData.diskUsage,
      // Add additional fields if available
      database_status: "connected",
      query_performance_ms: Math.floor(Math.random() * 200) + 50, // Simulated for now
      rpc_functions_status: "healthy",
      edge_functions_status: "healthy",
      api_status: healthData.status,
      storage_status: healthData.diskUsage > 90 ? "degraded" : "healthy",
      realtime_status: "healthy",
      auth_status: "healthy",
    };

    // Insert the data into the system_health table
    const { error } = await supabase
      .from("system_health")
      .insert([formattedData]);

    if (error) {
      console.error("Error updating system health data:", error);
      return false;
    }

    console.log("System health data updated successfully");
    return true;
  } catch (error) {
    console.error("Error in updateSystemHealthData:", error);
    return false;
  }
};

/**
 * Starts a periodic update of system health data
 * @param intervalMs The interval in milliseconds between updates
 * @returns A function to stop the periodic updates
 */
export const startPeriodicHealthUpdates = (
  intervalMs: number = 60000,
): (() => void) => {
  const intervalId = setInterval(async () => {
    await updateSystemHealthData();
  }, intervalMs);

  // Return a function to stop the periodic updates
  return () => {
    clearInterval(intervalId);
  };
};

/**
 * Fetches the latest system health data from the database
 */
export const fetchLatestSystemHealth =
  async (): Promise<SystemHealth | null> => {
    try {
      const { data, error } = await supabase
        .from("system_health")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching latest system health data:", error);
        return null;
      }

      if (!data || data.length === 0) {
        console.warn("No system health data found");
        return null;
      }

      // Convert the database record to the SystemHealth type
      const record = data[0];
      return {
        status: record.status,
        uptime: record.uptime,
        lastRestart: record.last_restart,
        version: record.version,
        environment: record.environment,
        responseTime: record.response_time_ms,
        cpuUsage: record.cpu_usage,
        memoryUsage: record.memory_usage,
        diskUsage: record.disk_usage,
      };
    } catch (error) {
      console.error("Error in fetchLatestSystemHealth:", error);
      return null;
    }
  };
