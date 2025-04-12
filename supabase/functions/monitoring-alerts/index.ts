import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AlertConfig {
  id: string;
  name: string;
  description: string;
  metric: string;
  threshold: number;
  comparison: "gt" | "lt" | "eq" | "gte" | "lte";
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  notification_channels?: string[];
}

interface AlertNotification {
  alert_id: string;
  alert_name: string;
  metric: string;
  current_value: number;
  threshold: number;
  comparison: string;
  severity: string;
  triggered_at: string;
  message: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the request body
    const {
      action,
      alertId,
      alertConfig,
      timeframe = "24h",
    } = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_KEY") ||
      "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle different actions
    switch (action) {
      case "getAlerts":
        return await getAlerts(supabase);
      case "getAlert":
        return await getAlert(supabase, alertId);
      case "createAlert":
        return await createAlert(supabase, alertConfig);
      case "updateAlert":
        return await updateAlert(supabase, alertId, alertConfig);
      case "deleteAlert":
        return await deleteAlert(supabase, alertId);
      case "checkAlerts":
        return await checkAlerts(supabase, timeframe);
      case "getAlertHistory":
        return await getAlertHistory(supabase, alertId);
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action specified" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

async function getAlerts(supabase) {
  const { data, error } = await supabase
    .from("monitoring_alerts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, alerts: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getAlert(supabase, alertId) {
  const { data, error } = await supabase
    .from("monitoring_alerts")
    .select("*")
    .eq("id", alertId)
    .single();

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, alert: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function createAlert(supabase, alertConfig) {
  const { data, error } = await supabase
    .from("monitoring_alerts")
    .insert([alertConfig])
    .select();

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, alert: data[0] }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function updateAlert(supabase, alertId, alertConfig) {
  const { data, error } = await supabase
    .from("monitoring_alerts")
    .update(alertConfig)
    .eq("id", alertId)
    .select();

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, alert: data[0] }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function deleteAlert(supabase, alertId) {
  const { error } = await supabase
    .from("monitoring_alerts")
    .delete()
    .eq("id", alertId);

  if (error) throw error;

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function getAlertHistory(supabase, alertId) {
  const query = supabase
    .from("alert_notifications")
    .select("*")
    .order("triggered_at", { ascending: false });

  if (alertId) {
    query.eq("alert_id", alertId);
  }

  const { data, error } = await query;

  if (error) throw error;

  return new Response(JSON.stringify({ success: true, history: data }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function checkAlerts(supabase, timeframe) {
  // 1. Get all enabled alerts
  const { data: alerts, error: alertsError } = await supabase
    .from("monitoring_alerts")
    .select("*")
    .eq("enabled", true);

  if (alertsError) throw alertsError;

  if (!alerts || alerts.length === 0) {
    return new Response(
      JSON.stringify({
        success: true,
        message: "No alerts to check",
        triggered: [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 2. Check each alert against current metrics
  const triggeredAlerts: AlertNotification[] = [];

  for (const alert of alerts) {
    try {
      // Get the current value for the metric
      let currentValue: number;

      switch (alert.metric) {
        case "system_health":
          // Get latest system health percentage
          const { data: healthData } = await supabase
            .from("system_health")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1);

          if (healthData && healthData.length > 0) {
            // Convert status to percentage
            currentValue =
              healthData[0].status === "healthy"
                ? 100
                : healthData[0].status === "degraded"
                  ? 50
                  : 0;
          } else {
            continue; // Skip if no data
          }
          break;

        case "cpu_usage":
        case "memory_usage":
        case "disk_usage":
          // Get latest resource usage
          const { data: resourceData } = await supabase
            .from("system_health")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1);

          if (resourceData && resourceData.length > 0) {
            currentValue = resourceData[0][alert.metric];
          } else {
            continue; // Skip if no data
          }
          break;

        case "query_performance":
          // Get average query execution time
          const { data: queryData } = await supabase
            .from("diagnostic_logs")
            .select("execution_time_ms")
            .gt("created_at", getTimeframeDate(timeframe))
            .limit(100);

          if (queryData && queryData.length > 0) {
            currentValue =
              queryData.reduce((sum, item) => sum + item.execution_time_ms, 0) /
              queryData.length;
          } else {
            continue; // Skip if no data
          }
          break;

        case "error_rate":
          // Calculate error rate from diagnostic logs
          const { data: allLogs } = await supabase
            .from("diagnostic_logs")
            .select("status")
            .gt("created_at", getTimeframeDate(timeframe));

          if (allLogs && allLogs.length > 0) {
            const errorLogs = allLogs.filter(
              (log) => log.status === "error",
            ).length;
            currentValue = (errorLogs / allLogs.length) * 100;
          } else {
            continue; // Skip if no data
          }
          break;

        default:
          continue; // Skip unknown metrics
      }

      // Check if alert should be triggered
      const isTriggered = checkThreshold(
        currentValue,
        alert.threshold,
        alert.comparison,
      );

      if (isTriggered) {
        // Create alert notification
        const notification: AlertNotification = {
          alert_id: alert.id,
          alert_name: alert.name,
          metric: alert.metric,
          current_value: currentValue,
          threshold: alert.threshold,
          comparison: alert.comparison,
          severity: alert.severity,
          triggered_at: new Date().toISOString(),
          message: generateAlertMessage(alert, currentValue),
        };

        // Save notification to database
        const { error: notificationError } = await supabase
          .from("alert_notifications")
          .insert([notification]);

        if (notificationError) {
          console.error("Error saving notification:", notificationError);
        } else {
          triggeredAlerts.push(notification);
        }
      }
    } catch (error) {
      console.error(`Error checking alert ${alert.id}:`, error);
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: `Checked ${alerts.length} alerts, triggered ${triggeredAlerts.length}`,
      triggered: triggeredAlerts,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

// Helper functions
function checkThreshold(
  value: number,
  threshold: number,
  comparison: string,
): boolean {
  switch (comparison) {
    case "gt":
      return value > threshold;
    case "lt":
      return value < threshold;
    case "eq":
      return value === threshold;
    case "gte":
      return value >= threshold;
    case "lte":
      return value <= threshold;
    default:
      return false;
  }
}

function getTimeframeDate(timeframe: string): string {
  const now = new Date();
  let date = new Date();

  switch (timeframe) {
    case "1h":
      date.setHours(now.getHours() - 1);
      break;
    case "24h":
      date.setDate(now.getDate() - 1);
      break;
    case "7d":
      date.setDate(now.getDate() - 7);
      break;
    case "30d":
      date.setDate(now.getDate() - 30);
      break;
    default:
      date.setDate(now.getDate() - 1); // Default to 24h
  }

  return date.toISOString();
}

function generateAlertMessage(
  alert: AlertConfig,
  currentValue: number,
): string {
  const comparisonText = {
    gt: "exceeded",
    lt: "dropped below",
    eq: "reached exactly",
    gte: "reached or exceeded",
    lte: "reached or dropped below",
  }[alert.comparison];

  return `${alert.name}: ${alert.metric} has ${comparisonText} the threshold of ${alert.threshold} (current value: ${currentValue.toFixed(2)})`;
}
