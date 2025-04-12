import { supabase } from "@/lib/supabase";
import { executeSql } from "@/utils/dbUtils";

/**
 * Comprehensive diagnostic tool to identify issues with SQL execution
 */
export const diagnosticTool = {
  /**
   * Run a complete diagnostic check of all SQL execution methods
   */
  runFullDiagnostic: async () => {
    const startTime = Date.now();
    const operationId = `diagnostic-run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const results: any = {
      timestamp: new Date().toISOString(),
      operationId,
      supabaseConfig: await diagnosticTool.checkSupabaseConfig(),
      basicConnection: await diagnosticTool.testBasicConnection(),
      rpcFunctions: await diagnosticTool.testRpcFunctions(),
      edgeFunctions: await diagnosticTool.testEdgeFunctions(),
      directSqlExecution: await diagnosticTool.testDirectSqlExecution(),
      informationSchema: await diagnosticTool.testInformationSchemaAccess(),
    };

    // Determine overall status
    results.summary = {
      hasWorkingMethod: false,
      recommendedMethod: null,
      criticalIssues: [],
      warnings: [],
    };

    // Check if any method works
    if (results.directSqlExecution.dbUtilsWorks) {
      results.summary.hasWorkingMethod = true;
      results.summary.recommendedMethod = "dbUtils.executeSql";
    } else if (results.directSqlExecution.pgQueryWorks) {
      results.summary.hasWorkingMethod = true;
      results.summary.recommendedMethod = "pg_query";
    } else if (results.directSqlExecution.execSqlWorks) {
      results.summary.hasWorkingMethod = true;
      results.summary.recommendedMethod = "exec_sql";
    } else if (results.edgeFunctions.sqlExecutorWorks) {
      results.summary.hasWorkingMethod = true;
      results.summary.recommendedMethod = "sql-executor";
    } else if (results.edgeFunctions.executeSqlWorks) {
      results.summary.hasWorkingMethod = true;
      results.summary.recommendedMethod = "execute-sql";
    }

    // Identify critical issues
    if (!results.basicConnection.connected) {
      results.summary.criticalIssues.push(
        "Cannot connect to Supabase. Check credentials and network connection.",
      );
    }

    if (!results.supabaseConfig.hasUrl) {
      results.summary.criticalIssues.push(
        "Supabase URL is missing or invalid.",
      );
    }

    if (!results.supabaseConfig.hasKey) {
      results.summary.criticalIssues.push(
        "Supabase API key is missing or invalid.",
      );
    }

    if (!results.summary.hasWorkingMethod) {
      results.summary.criticalIssues.push(
        "No working SQL execution method found. SQL operations will fail.",
      );
    }

    // Add warnings
    if (!results.informationSchema.canAccessTables) {
      results.summary.warnings.push(
        "Cannot access information_schema.tables. Some system checks will fail.",
      );
    }

    if (!results.informationSchema.canAccessColumns) {
      results.summary.warnings.push(
        "Cannot access information_schema.columns. Some system checks will fail.",
      );
    }

    if (
      !results.edgeFunctions.sqlExecutorWorks &&
      !results.edgeFunctions.executeSqlWorks
    ) {
      results.summary.warnings.push(
        "Edge functions are not accessible. This may be due to CORS issues or deployment problems.",
      );
    }

    // Calculate execution time
    const executionTimeMs = Date.now() - startTime;
    results.executionTimeMs = executionTimeMs;

    // Log the diagnostic operation
    try {
      // Check if diagnostic_logs table exists
      const { data: tableExists, error: tableCheckError } = await supabase.rpc(
        "pg_query",
        {
          query:
            "SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'diagnostic_logs' LIMIT 1",
        },
      );

      if (!tableCheckError && tableExists && tableExists.length > 0) {
        // Log the operation
        await supabase
          .from("diagnostic_logs")
          .insert({
            operation_id: operationId,
            operation_type: "full_diagnostic",
            status:
              results.summary.criticalIssues.length > 0 ? "failed" : "success",
            method_used: "diagnosticTool",
            execution_time_ms: executionTimeMs,
            details: results,
            created_at: new Date().toISOString(),
          })
          .catch((err) =>
            console.error("Failed to log diagnostic operation:", err),
          );
      }
    } catch (logError) {
      console.error("Error logging diagnostic operation:", logError);
    }

    return results;
  },

  /**
   * Log a diagnostic operation
   */
  logDiagnosticOperation: async (
    operationType: string,
    status: string,
    details: any,
  ) => {
    const operationId = `diagnostic-${operationType}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const executionTimeMs = details.executionTimeMs || 0;

    try {
      // Check if diagnostic_logs table exists
      const { data: tableExists, error: tableCheckError } = await supabase.rpc(
        "pg_query",
        {
          query:
            "SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'diagnostic_logs' LIMIT 1",
        },
      );

      if (tableCheckError || !tableExists || tableExists.length === 0) {
        console.warn(
          "Diagnostic logs table does not exist, cannot log operation",
        );
        return {
          success: false,
          error: "Diagnostic logs table does not exist",
        };
      }

      // Log the operation
      const { data, error } = await supabase.from("diagnostic_logs").insert({
        operation_id: operationId,
        operation_type: operationType,
        status,
        method_used: details.method || "manual",
        execution_time_ms: executionTimeMs,
        details,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error("Failed to log diagnostic operation:", error);
        return { success: false, error };
      }

      return { success: true, operationId };
    } catch (error) {
      console.error("Error logging diagnostic operation:", error);
      return { success: false, error };
    }
  },

  /**
   * Check Supabase configuration
   */
  checkSupabaseConfig: async () => {
    return {
      hasUrl: !!supabase.supabaseUrl,
      hasKey: !!(supabase.supabaseKey || supabase.supabaseAnonKey),
      url: supabase.supabaseUrl
        ? `${supabase.supabaseUrl.substring(0, 8)}...`
        : null,
      keyType: supabase.supabaseKey
        ? "service_key"
        : supabase.supabaseAnonKey
          ? "anon_key"
          : "none",
    };
  },

  /**
   * Test basic connection to Supabase
   */
  testBasicConnection: async () => {
    try {
      // Try a simple query that should always work
      const { data, error } = await supabase
        .from("migration_logs")
        .select("count")
        .limit(1);

      if (error) {
        // Try an alternative approach if the first one fails
        try {
          const { data: authData, error: authError } =
            await supabase.auth.getSession();

          if (!authError) {
            return {
              connected: true,
              method: "auth_api",
              error: null,
            };
          }

          return {
            connected: false,
            method: "auth_api",
            error: authError,
          };
        } catch (authCheckError) {
          return {
            connected: false,
            method: "data_api_then_auth_api",
            error: error,
            secondaryError: authCheckError,
          };
        }
      }

      return {
        connected: true,
        method: "data_api",
        error: null,
      };
    } catch (error) {
      return {
        connected: false,
        method: "data_api",
        error: error,
      };
    }
  },

  /**
   * Test RPC functions
   */
  testRpcFunctions: async () => {
    const results: any = {
      pgQuery: { available: false, error: null },
      execSql: { available: false, error: null },
    };

    // Test pg_query
    try {
      const { data, error } = await supabase.rpc("pg_query", {
        query: "SELECT 1 as test",
      });

      results.pgQuery.available = !error;
      results.pgQuery.error = error;
      results.pgQuery.data = data;
    } catch (error) {
      results.pgQuery.available = false;
      results.pgQuery.error = error;
    }

    // Test exec_sql
    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql_text: "SELECT 1 as test",
      });

      results.execSql.available = !error;
      results.execSql.error = error;
      results.execSql.data = data;
    } catch (error) {
      results.execSql.available = false;
      results.execSql.error = error;
    }

    return results;
  },

  /**
   * Test edge functions
   */
  testEdgeFunctions: async () => {
    const results: any = {
      sqlExecutor: { available: false, works: false, error: null },
      executeSql: { available: false, works: false, error: null },
      corsTest: { available: false, works: false, error: null },
    };

    // Test sql-executor
    try {
      const { data, error } = await supabase.functions.invoke("sql-executor", {
        body: { sql: "SELECT 1 as test" },
      });

      results.sqlExecutor.available = true;
      results.sqlExecutor.works = !error;
      results.sqlExecutor.error = error;
      results.sqlExecutor.data = data;
    } catch (error) {
      results.sqlExecutor.available = false;
      results.sqlExecutor.works = false;
      results.sqlExecutor.error = error;
    }

    // Test execute-sql
    try {
      const { data, error } = await supabase.functions.invoke("execute-sql", {
        body: { sql: "SELECT 1 as test" },
      });

      results.executeSql.available = true;
      results.executeSql.works = !error;
      results.executeSql.error = error;
      results.executeSql.data = data;
    } catch (error) {
      results.executeSql.available = false;
      results.executeSql.works = false;
      results.executeSql.error = error;
    }

    // Test cors-test
    try {
      const { data, error } = await supabase.functions.invoke("cors-test", {});

      results.corsTest.available = true;
      results.corsTest.works = !error;
      results.corsTest.error = error;
      results.corsTest.data = data;
    } catch (error) {
      results.corsTest.available = false;
      results.corsTest.works = false;
      results.corsTest.error = error;
    }

    // Test direct fetch to check for CORS issues
    if (!results.sqlExecutor.works && !results.executeSql.works) {
      try {
        results.directFetch = { attempted: true };

        const response = await fetch(
          `${supabase.supabaseUrl}/functions/v1/cors-test`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
              Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
            },
          },
        );

        results.directFetch.status = response.status;
        results.directFetch.statusText = response.statusText;
        results.directFetch.works = response.ok;

        if (response.ok) {
          results.directFetch.data = await response.json();
        } else {
          results.directFetch.error = await response.text();
        }
      } catch (error) {
        results.directFetch = {
          attempted: true,
          works: false,
          error: error,
        };
      }
    }

    return results;
  },

  /**
   * Test direct SQL execution
   */
  testDirectSqlExecution: async () => {
    const results: any = {
      pgQueryWorks: false,
      execSqlWorks: false,
      directRestWorks: false,
      dbUtilsWorks: false,
    };

    // Test pg_query
    try {
      const { data, error } = await supabase.rpc("pg_query", {
        query: "SELECT 1 as test",
      });

      results.pgQueryWorks = !error;
      results.pgQueryError = error;
      results.pgQueryData = data;
    } catch (error) {
      results.pgQueryWorks = false;
      results.pgQueryError = error;
    }

    // Test exec_sql
    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql_text: "SELECT 1 as test",
      });

      results.execSqlWorks = !error;
      results.execSqlError = error;
      results.execSqlData = data;
    } catch (error) {
      results.execSqlWorks = false;
      results.execSqlError = error;
    }

    // Test dbUtils.executeSql
    try {
      const { data, error } = await executeSql("SELECT 1 as test");

      results.dbUtilsWorks = !error;
      results.dbUtilsError = error;
      results.dbUtilsData = data;
    } catch (error) {
      results.dbUtilsWorks = false;
      results.dbUtilsError = error;
    }

    // Test direct REST API call
    try {
      const response = await fetch(
        `${supabase.supabaseUrl}/rest/v1/rpc/pg_query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
            Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({ query: "SELECT 1 as test" }),
        },
      );

      results.directRestWorks = response.ok;
      results.directRestStatus = response.status;
      results.directRestStatusText = response.statusText;

      if (response.ok) {
        results.directRestData = await response.json();
      } else {
        results.directRestError = await response.text();
      }
    } catch (error) {
      results.directRestWorks = false;
      results.directRestError = error;
    }

    return results;
  },

  /**
   * Test information schema access
   */
  testInformationSchemaAccess: async () => {
    const results: any = {
      canAccessTables: false,
      canAccessColumns: false,
    };

    // Test information_schema.tables access
    try {
      const { data, error } = await supabase.rpc("pg_query", {
        query:
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LIMIT 1",
      });

      results.canAccessTables = !error;
      results.tablesError = error;
      results.tablesData = data;
    } catch (error) {
      results.canAccessTables = false;
      results.tablesError = error;
    }

    // Test information_schema.columns access
    try {
      const { data, error } = await supabase.rpc("pg_query", {
        query:
          "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' LIMIT 1",
      });

      results.canAccessColumns = !error;
      results.columnsError = error;
      results.columnsData = data;
    } catch (error) {
      results.canAccessColumns = false;
      results.columnsError = error;
    }

    return results;
  },

  /**
   * Get recommended SQL execution method based on diagnostic results
   */
  getRecommendedMethod: async () => {
    const diagnosticResults = await diagnosticTool.runFullDiagnostic();
    return diagnosticResults.summary.recommendedMethod;
  },

  /**
   * Execute SQL using the best available method
   */
  executeSql: async (sql: string) => {
    // Try dbUtils.executeSql first
    try {
      const { data, error } = await executeSql(sql);

      if (!error) {
        return { success: true, data, method: "dbUtils.executeSql" };
      }
    } catch (dbUtilsError) {
      // Fall through to next method
    }

    // Try pg_query next
    try {
      const { data, error } = await supabase.rpc("pg_query", {
        query: sql,
      });

      if (!error) {
        return { success: true, data, method: "pg_query" };
      }
    } catch (pgQueryError) {
      // Fall through to next method
    }

    // Try exec_sql next
    try {
      const { data, error } = await supabase.rpc("exec_sql", {
        sql_text: sql,
      });

      if (!error) {
        return { success: true, data, method: "exec_sql" };
      }
    } catch (execSqlError) {
      // Fall through to next method
    }

    // Try sql-executor edge function
    try {
      const { data, error } = await supabase.functions.invoke("sql-executor", {
        body: { sql },
      });

      if (!error) {
        return { success: true, data, method: "sql-executor" };
      }
    } catch (sqlExecutorError) {
      // Fall through to next method
    }

    // Try execute-sql edge function
    try {
      const { data, error } = await supabase.functions.invoke("execute-sql", {
        body: { sql },
      });

      if (!error) {
        return { success: true, data, method: "execute-sql" };
      }
    } catch (executeSqlError) {
      // Fall through to next method
    }

    // Try direct REST API call as last resort
    try {
      const response = await fetch(
        `${supabase.supabaseUrl}/rest/v1/rpc/pg_query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
            Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({ query: sql }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        return { success: true, data, method: "direct_rest" };
      }

      return {
        success: false,
        error: {
          message: `All SQL execution methods failed. Last error: REST API call failed with status ${response.status}`,
          details: await response.text(),
        },
        method: "all_failed",
      };
    } catch (directRestError) {
      return {
        success: false,
        error: {
          message: "All SQL execution methods failed",
          details: directRestError,
        },
        method: "all_failed",
      };
    }
  },
};
