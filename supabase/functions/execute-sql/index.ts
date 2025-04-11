import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, authorization, x-client-info, apikey",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Track execution time
    const startTime = Date.now();

    // Get Supabase credentials from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
      Deno.env.get("SUPABASE_SERVICE_KEY") ||
      Deno.env.get("SUPABASE_ANON_KEY");

    // Validate credentials
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase credentials in edge function:", {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey,
      });

      return new Response(
        JSON.stringify({
          error: "Supabase credentials not found in edge function environment",
          details: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseServiceKey,
            availableEnvVars: Object.keys(Deno.env.toObject()),
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Create a Supabase client with the Admin key
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      },
    });

    // Get the request body
    const requestData = await req.json();
    const sql = requestData.sql || requestData.sql_text; // Support both parameter names
    const operationId =
      requestData.operation_id ||
      `sql-exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    if (!sql) {
      return new Response(JSON.stringify({ error: "SQL query is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Execute the SQL query directly using the service role
    let data, error;
    try {
      const result = await supabaseClient.rpc("exec_sql", { sql_text: sql });
      data = result.data;
      error = result.error;
    } catch (e) {
      error = e;
    }

    if (error) {
      // If the exec_sql function doesn't exist, create it
      if (
        error.message?.includes("function exec_sql") ||
        error.message?.includes("does not exist")
      ) {
        const createFunctionSql = `
          CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
          RETURNS void
          LANGUAGE plpgsql
          SECURITY DEFINER
          SET search_path = public
          AS $$
          BEGIN
            EXECUTE sql_text;
          END;
          $$;
          
          -- Grant appropriate permissions
          GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
          GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
          
          -- Add function description
          COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';
        `;

        // Try direct SQL execution first
        try {
          // Execute the SQL directly using pg_query
          const { error: createError } = await supabaseClient.rpc("pg_query", {
            query: createFunctionSql,
          });

          if (createError) {
            // If pg_query fails, try direct REST API call
            const response = await fetch(
              `${supabaseUrl}/rest/v1/rpc/pg_query`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: supabaseServiceKey,
                  Authorization: `Bearer ${supabaseServiceKey}`,
                  Prefer: "return=minimal",
                },
                body: JSON.stringify({ query: createFunctionSql }),
              },
            );

            if (!response.ok) {
              return new Response(
                JSON.stringify({
                  error: `Failed to create exec_sql function: ${await response.text()}`,
                }),
                {
                  headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                  },
                  status: 500,
                },
              );
            }
          }

          // Try executing the original SQL again
          const { data: retryData, error: retryError } =
            await supabaseClient.rpc("exec_sql", { sql_text: sql });

          if (retryError) {
            return new Response(
              JSON.stringify({
                error: `Failed to execute SQL after creating function: ${retryError.message}`,
              }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 500,
              },
            );
          }

          // Log successful execution with execution time
          try {
            const executionTimeMs = Date.now() - startTime;
            await supabaseClient.from("migration_logs").insert({
              operation_id: operationId,
              operation_type: "custom_sql",
              sql_content: sql,
              status: "success",
              method_used: "edge-function",
              execution_time_ms: executionTimeMs,
              details: { auto_created_function: true },
              created_at: new Date().toISOString(),
            });
          } catch (logError) {
            console.error("Failed to log SQL execution:", logError);
          }

          return new Response(
            JSON.stringify({ success: true, data: retryData }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 200,
            },
          );
        } catch (createFunctionError) {
          return new Response(
            JSON.stringify({
              error: `Failed to create exec_sql function: ${createFunctionError.message}`,
              details: createFunctionError,
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 500,
            },
          );
        }
      }

      return new Response(
        JSON.stringify({ error: `Failed to execute SQL: ${error.message}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Log successful execution with execution time
    try {
      const executionTimeMs = Date.now() - startTime;
      await supabaseClient.from("migration_logs").insert({
        operation_id: operationId,
        operation_type: "custom_sql",
        sql_content: sql,
        status: "success",
        method_used: "edge-function",
        execution_time_ms: executionTimeMs,
        details: requestData.debug ? { debug: true } : null,
        created_at: new Date().toISOString(),
      });
    } catch (logError) {
      console.error("Failed to log SQL execution:", logError);
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
