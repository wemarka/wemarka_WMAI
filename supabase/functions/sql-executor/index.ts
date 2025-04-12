import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

    // Try different methods to execute SQL
    let result;
    let method = "";
    let error = null;

    // Method 1: Try pg_query
    try {
      method = "pg_query";
      const { data, error: pgError } = await supabase.rpc("pg_query", {
        query: sql,
      });

      if (!pgError) {
        result = data;
      } else {
        error = pgError;
        // Fall through to next method
      }
    } catch (err) {
      error = err;
      // Fall through to next method
    }

    // Method 2: Try exec_sql if pg_query failed
    if (!result && error) {
      try {
        method = "exec_sql";
        const { data, error: execError } = await supabase.rpc("exec_sql", {
          sql_text: sql,
        });

        if (!execError) {
          result = data;
          error = null;
        } else {
          error = execError;
          // Fall through to next method
        }
      } catch (err) {
        error = err;
        // Fall through to next method
      }
    }

    // Method 3: Try direct REST API call if both previous methods failed
    if (!result && error) {
      try {
        method = "direct_rest";
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_query`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseServiceKey,
            Authorization: `Bearer ${supabaseServiceKey}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({ query: sql }),
        });

        if (response.ok) {
          result = await response.json();
          error = null;
        } else {
          error = {
            message: `REST API call failed with status ${response.status}`,
            details: await response.text(),
          };
        }
      } catch (err) {
        error = err;
      }
    }

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;

    // Log the operation if successful
    if (result && !error) {
      try {
        const logEntry = {
          operation_id:
            operation_id ||
            `sql-exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          operation_type: "custom_sql",
          sql_content: sql,
          sql_preview: sql.length > 100 ? `${sql.substring(0, 100)}...` : sql,
          status: "success",
          method_used: `edge-function-${method}`,
          execution_time_ms: executionTimeMs,
          details: { edge_function: true },
          created_at: new Date().toISOString(),
        };

        // Try to log the operation
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
            method,
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
          method,
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
