import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  uptime: number;
  last_restart: string;
  version: string;
  environment: string;
  response_time_ms: number;
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  database_status?: string;
  query_performance_ms?: number;
  rpc_functions_status?: string;
  edge_functions_status?: string;
  api_status?: string;
  storage_status?: string;
  realtime_status?: string;
  auth_status?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      },
    );

    // Parse request body
    const { healthData } = (await req.json()) as { healthData: SystemHealth };

    // Validate required fields
    const requiredFields = [
      "status",
      "uptime",
      "last_restart",
      "version",
      "environment",
      "response_time_ms",
      "cpu_usage",
      "memory_usage",
      "disk_usage",
    ];

    for (const field of requiredFields) {
      if (!(field in healthData)) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Insert health data into the system_health table
    const { data, error } = await supabaseClient
      .from("system_health")
      .insert([healthData])
      .select();

    if (error) {
      console.error("Error inserting system health data:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
