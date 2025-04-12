import { createClient } from "@supabase/supabase-js";
import { supabase as supabaseInstance } from "@/lib/supabase";

// Use the existing Supabase client from lib/supabase.ts
export const supabase = supabaseInstance;

/**
 * Execute a SQL query using the execute_sql function
 * @param query SQL query to execute
 * @param options Optional configuration for execution
 * @returns Query results as JSON with detailed error information if applicable
 */
export async function executeSql(
  query: string,
  options?: { timeout?: number; retries?: number },
) {
  const startTime = performance.now();
  const timeout = options?.timeout || 10000; // Default 10s timeout
  const maxRetries = options?.retries || 1; // Default 1 retry
  let retryCount = 0;
  let lastError = null;

  try {
    // Retry logic for transient errors
    while (retryCount <= maxRetries) {
      try {
        // First try using edge function
        try {
          const response = await fetch(
            `${supabase.supabaseUrl}/functions/v1/execute-sql`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${supabase.supabaseKey}`,
              },
              body: JSON.stringify({ sql: query }),
            },
          );

          if (response.ok) {
            const result = await response.json();
            const executionTime = performance.now() - startTime;
            return {
              data: result.data,
              error: null,
              method: "edge-function",
              executionTime,
              fallbackUsed: false,
            };
          }
        } catch (edgeFunctionError) {
          console.warn(
            "Edge function failed, falling back to RPC:",
            edgeFunctionError,
          );
          // Continue to RPC methods
        }

        // Try using the execute_sql RPC function
        const { data, error } = await Promise.race([
          supabase.rpc("execute_sql", { query_text: query }),
          supabase.rpc("execute_sql", { sql_text: query }),
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(
                    "Timeout: execute_sql RPC call exceeded time limit",
                  ),
                ),
              timeout,
            ),
          ),
        ]);

        if (error) {
          console.warn(
            `RPC execute_sql failed (attempt ${retryCount + 1}/${maxRetries + 1}):`,
            error,
          );
          lastError = {
            method: "execute_sql",
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
            query,
          };

          // If execute_sql fails, try using pg_query as a fallback
          // Use only the correct parameter name for pg_query
          let pgData = null;
          let pgError = null;

          try {
            // Always use the sql parameter for pg_query
            const result = await supabase.rpc("pg_query", { sql: query });
            if (!result.error) {
              pgData = result.data;
            } else {
              pgError = result.error;
            }
          } catch (err) {
            pgError = err;
          }

          if (pgError) {
            console.error(
              `Both execute_sql and pg_query failed (attempt ${retryCount + 1}/${maxRetries + 1}):`,
              pgError,
            );
            lastError = {
              method: "pg_query",
              message: pgError.message,
              details: pgError.details,
              hint: pgError.hint,
              code: pgError.code,
              previousError: lastError,
              query,
            };

            // If this is the last retry, throw the error to be caught by the outer catch
            if (retryCount === maxRetries) {
              throw new Error("All SQL execution methods failed");
            }

            // Otherwise, increment retry count and try again after a delay
            retryCount++;
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount),
            ); // Exponential backoff
            continue;
          }

          const executionTime = performance.now() - startTime;
          return {
            data: pgData,
            error: null,
            method: "pg_query",
            executionTime,
            fallbackUsed: true,
          };
        }

        const executionTime = performance.now() - startTime;
        return {
          data,
          error: null,
          method: "execute_sql",
          executionTime,
          fallbackUsed: false,
        };
      } catch (innerError) {
        lastError = {
          message: innerError.message,
          stack: innerError.stack,
          query,
          previousError: lastError,
        };

        if (retryCount === maxRetries) {
          throw innerError; // Re-throw to be caught by outer catch
        }

        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount)); // Exponential backoff
      }
    }

    // This should never be reached due to the throw in the loop, but TypeScript doesn't know that
    throw new Error("Unexpected execution path");
  } catch (error) {
    console.error("Error executing SQL:", error, "Last error:", lastError);
    const executionTime = performance.now() - startTime;
    return {
      data: null,
      error: {
        message: error.message,
        originalError: error,
        details: lastError,
        query,
        timestamp: new Date().toISOString(),
      },
      executionTime,
      retryAttempts: retryCount,
    };
  }
}

/**
 * Get all tables in the database
 * @returns List of tables
 */
export async function getTables() {
  return executeSql(
    `SELECT table_name 
     FROM information_schema.tables 
     WHERE table_schema = 'public' 
     ORDER BY table_name`,
  );
}

/**
 * Get columns for a specific table
 * @param tableName Name of the table
 * @returns List of columns with their data types
 */
export async function getTableColumns(tableName: string) {
  // Sanitize the table name to prevent SQL injection
  const sanitizedTableName = tableName.replace(/[^a-zA-Z0-9_]/g, "");

  return executeSql(
    `SELECT column_name, data_type, is_nullable 
     FROM information_schema.columns 
     WHERE table_schema = 'public' 
     AND table_name = '${sanitizedTableName}' 
     ORDER BY ordinal_position`,
  );
}

/**
 * Test database connection and function availability
 * @returns Connection status information
 */
export async function testDatabaseConnection() {
  try {
    // Test basic connection
    const { data: connectionData, error: connectionError } = await supabase
      .from("_dummy_query")
      .select("*")
      .limit(1);

    // Test execute_sql function
    const { data: functionData, error: functionError } = await executeSql(
      "SELECT current_timestamp as time, current_database() as database",
    );

    // Test pg_query function as a fallback
    let pgQueryAvailable = false;
    let pgQueryError = null;
    let pgQueryData = null;

    try {
      // Always use the sql parameter for pg_query
      let data, error;
      try {
        const result = await supabase.rpc("pg_query", {
          sql: "SELECT 1 as pg_query_test",
        });
        data = result.data;
        error = result.error;
      } catch (err) {
        error = err;
      }
      pgQueryAvailable = !error;
      pgQueryError = error;
      pgQueryData = data;
    } catch (error) {
      pgQueryAvailable = false;
      pgQueryError = error;
    }

    return {
      connected: !connectionError,
      functionAvailable: !functionError,
      pgQueryAvailable,
      connectionError,
      functionError,
      pgQueryError,
      functionData,
      pgQueryData,
    };
  } catch (error) {
    return {
      connected: false,
      functionAvailable: false,
      pgQueryAvailable: false,
      error,
    };
  }
}
