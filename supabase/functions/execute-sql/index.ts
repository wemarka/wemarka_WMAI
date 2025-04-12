import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, x-client-info, apikey, content-type",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get request body
    const { sql, operation_id } = await req.json();

    if (!sql) {
      return new Response(JSON.stringify({ error: "SQL query is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Track execution time
    const startTime = Date.now();

    // Get Supabase credentials from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_KEY") ||
      Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({
          error: "Supabase credentials not found",
          details: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseServiceKey,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Execute SQL
    let result;
    let error = null;

    try {
      // Try to execute the SQL directly
      // Use the correct parameter name for the function
      const { data, error: execError } = await supabase.rpc("execute_sql", {
        sql_text: sql,
      });

      if (execError) {
        error = execError;
      } else {
        result = data;
      }
    } catch (err) {
      error = err;
    }

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;

    // Log the operation
    if (operation_id) {
      try {
        const logEntry = {
          operation_id,
          operation_type: "edge_function_sql",
          sql_content: sql,
          sql_preview: sql.length > 100 ? `${sql.substring(0, 100)}...` : sql,
          status: error ? "failed" : "success",
          method_used: "execute-sql-edge-function",
          execution_time_ms: executionTimeMs,
          details: error ? { error } : { success: true },
          created_at: new Date().toISOString(),
        };

        await supabase
          .from("migration_logs")
          .insert(logEntry)
          .catch((e) => {
            console.error("Failed to log operation:", e);
          });
      } catch (logError) {
        console.error("Error logging operation:", logError);
      }
    }

    // Return the result
    if (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || JSON.stringify(error),
          details: {
            executionTimeMs,
            error,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        details: {
          executionTimeMs,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error",
        details: error,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
