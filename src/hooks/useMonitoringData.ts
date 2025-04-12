import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  getSystemHealth,
  getErrorTrends,
  getErrorsByModule,
  getRepeatedErrors,
} from "@/frontend/services/monitoringService";

export interface PhaseStatus {
  phase: number;
  name: string;
  status: "completed" | "in-progress" | "pending";
  progress: number;
  startDate: string;
  completionDate?: string;
}

export function usePhaseStatuses() {
  const [phaseStatuses, setPhaseStatuses] = useState<PhaseStatus[]>([]);
  const [currentPhase, setCurrentPhase] = useState<PhaseStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchPhaseStatuses() {
      setLoading(true);
      try {
        // Fetch real phase statuses from the database
        const { data, error } = await supabase
          .from("project_phases")
          .select("*")
          .order("phase", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedPhases: PhaseStatus[] = data.map((phase) => ({
            phase: phase.phase,
            name: phase.name,
            status: phase.status,
            progress: phase.progress,
            startDate: phase.start_date,
            completionDate: phase.completion_date,
          }));

          setPhaseStatuses(formattedPhases);
          setCurrentPhase(
            formattedPhases.find((phase) => phase.status === "in-progress") ||
              formattedPhases[formattedPhases.length - 1],
          );
        } else {
          // Fallback to real project phases based on our plan
          const mockPhaseStatuses: PhaseStatus[] = [
            {
              phase: 1,
              name: "Store & Ecommerce System",
              status: "completed",
              progress: 100,
              startDate: "2024-05-01",
              completionDate: "2024-06-15",
            },
            {
              phase: 2,
              name: "Smart Accounting System",
              status: "completed",
              progress: 100,
              startDate: "2024-06-16",
              completionDate: "2024-07-31",
            },
            {
              phase: 3,
              name: "Marketing Hub",
              status: "completed",
              progress: 100,
              startDate: "2024-08-01",
              completionDate: "2024-09-30",
            },
            {
              phase: 4,
              name: "Unified Inbox System",
              status: "in-progress",
              progress: 45,
              startDate: "2024-10-01",
            },
            {
              phase: 5,
              name: "Developer Tools Module",
              status: "pending",
              progress: 0,
              startDate: "2024-11-15",
            },
            {
              phase: 6,
              name: "Analytics & Reports",
              status: "pending",
              progress: 0,
              startDate: "2024-12-01",
            },
            {
              phase: 7,
              name: "Integrations Hub",
              status: "pending",
              progress: 0,
              startDate: "2025-01-15",
            },
          ];

          setPhaseStatuses(mockPhaseStatuses);
          setCurrentPhase(
            mockPhaseStatuses.find((phase) => phase.status === "in-progress") ||
              mockPhaseStatuses[mockPhaseStatuses.length - 1],
          );
          console.warn("No project phases found in database, using mock data");
        }
      } catch (err) {
        console.error("Error fetching phase statuses:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));

        // Fallback to real project phases based on our plan
        const mockPhaseStatuses: PhaseStatus[] = [
          {
            phase: 1,
            name: "Store & Ecommerce System",
            status: "completed",
            progress: 100,
            startDate: "2024-05-01",
            completionDate: "2024-06-15",
          },
          {
            phase: 2,
            name: "Smart Accounting System",
            status: "completed",
            progress: 100,
            startDate: "2024-06-16",
            completionDate: "2024-07-31",
          },
          {
            phase: 3,
            name: "Marketing Hub",
            status: "completed",
            progress: 100,
            startDate: "2024-08-01",
            completionDate: "2024-09-30",
          },
          {
            phase: 4,
            name: "Unified Inbox System",
            status: "in-progress",
            progress: 45,
            startDate: "2024-10-01",
          },
          {
            phase: 5,
            name: "Developer Tools Module",
            status: "pending",
            progress: 0,
            startDate: "2024-11-15",
          },
          {
            phase: 6,
            name: "Analytics & Reports",
            status: "pending",
            progress: 0,
            startDate: "2024-12-01",
          },
          {
            phase: 7,
            name: "Integrations Hub",
            status: "pending",
            progress: 0,
            startDate: "2025-01-15",
          },
        ];

        setPhaseStatuses(mockPhaseStatuses);
        setCurrentPhase(
          mockPhaseStatuses.find((phase) => phase.status === "in-progress") ||
            mockPhaseStatuses[mockPhaseStatuses.length - 1],
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPhaseStatuses();

    // Set up real-time subscription
    const subscription = supabase
      .channel("project_phases_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_phases",
        },
        () => {
          fetchPhaseStatuses();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { phaseStatuses, currentPhase, loading, error };
}

export function useSystemMetrics() {
  const [systemMetrics, setSystemMetrics] = useState({
    systemHealth: 0,
    dbResponse: 0,
    sqlOperations: 0,
    loading: true,
    error: null as Error | null,
  });

  useEffect(() => {
    async function fetchSystemMetrics() {
      try {
        // Fetch real system health data
        const healthData = await getSystemHealth();

        // Fetch SQL operations count from the database
        const { data: sqlData, error: sqlError } = await supabase
          .from("sql_operations_count")
          .select("*");

        if (sqlError) throw sqlError;

        // Calculate total SQL operations
        const totalSqlOps =
          sqlData?.reduce((sum, item) => sum + (item.count || 0), 0) || 0;

        // Try to get system health data using the function
        let systemHealthValue = 98; // Default value
        try {
          const { data: healthDbData, error: healthDbError } =
            await supabase.rpc("get_latest_system_health");

          if (!healthDbError && healthDbData) {
            systemHealthValue =
              healthDbData.status === "healthy"
                ? 98
                : healthDbData.status === "degraded"
                  ? 75
                  : 50;
          }
        } catch (healthFuncError) {
          console.warn(
            "Error using get_latest_system_health function:",
            healthFuncError,
          );
          // Continue with default value
        }

        setSystemMetrics({
          systemHealth:
            healthData.status === "healthy"
              ? 98
              : healthData.status === "degraded"
                ? 75
                : 50,
          dbResponse: healthData.responseTime,
          sqlOperations: totalSqlOps,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error("Error fetching system metrics:", err);
        setSystemMetrics((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err : new Error("Unknown error"),
        }));
      }
    }

    fetchSystemMetrics();

    // Set up polling for regular updates (every 30 seconds)
    const interval = setInterval(fetchSystemMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  return systemMetrics;
}
