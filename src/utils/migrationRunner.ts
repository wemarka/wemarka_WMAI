import { supabase } from "@/lib/supabase";

/**
 * Utility function to run SQL directly using the Supabase client
 * This can be used in the browser environment where fs is not available
 * @param sqlContent SQL content to execute
 * @param maxRetries Maximum number of retry attempts (default: 3)
 */
export async function runSqlDirectly(
  sqlContent: string,
  maxRetries: number = 3,
): Promise<{ success: boolean; error?: any; debugInfo?: any }> {
  try {
    if (!sqlContent) {
      console.error(`SQL content is empty`);
      return { success: false, error: `SQL content is empty` };
    }

    // Check if we're trying to create the exec_sql function
    const isCreatingExecSql = sqlContent
      .toLowerCase()
      .includes("create or replace function exec_sql");
    if (isCreatingExecSql) {
      console.log("Detected attempt to create exec_sql function directly");
      return await createExecSqlFunction();
    }

    console.log(`Executing SQL...`);

    // Initialize retry counter and debug information
    let retryCount = 0;
    let lastError: any = null;
    let debugInfo: any = {
      attempts: [],
      finalMethod: null,
      totalAttempts: 0,
    };

    // Retry logic with exponential backoff
    while (retryCount <= maxRetries) {
      const attemptInfo: any = {
        attemptNumber: retryCount + 1,
        timestamp: new Date().toISOString(),
        method: "edge-function",
      };

      // If not the first attempt, wait with exponential backoff
      if (retryCount > 0) {
        const delayMs = Math.pow(2, retryCount - 1) * 1000; // 1s, 2s, 4s, etc.
        console.log(
          `Retry attempt ${retryCount}/${maxRetries} after ${delayMs}ms delay`,
        );
        attemptInfo.delayMs = delayMs;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      // First try using the edge function
      try {
        console.log(
          `Executing SQL using edge function (attempt ${retryCount + 1}/${maxRetries + 1})...`,
        );
        const response = await fetch(
          `${supabase.supabaseUrl}/functions/v1/execute-sql`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
              Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
            },
            body: JSON.stringify({ sql: sqlContent, sql_text: sqlContent }), // Include both parameter names for compatibility
          },
        );

        attemptInfo.statusCode = response.status;
        attemptInfo.statusText = response.statusText;

        // Check for authentication issues
        if (response.status === 401 || response.status === 403) {
          attemptInfo.error =
            "Authentication failed - invalid or expired token";
          debugInfo.attempts.push(attemptInfo);
          debugInfo.authError = true;
          return {
            success: false,
            error: {
              message: "Authentication failed. Please log in again.",
              code: "AUTH_ERROR",
            },
            debugInfo,
          };
        }

        const result = await response.json();
        attemptInfo.result = result;

        if (response.ok && !result.error) {
          console.log("Successfully executed SQL using edge function");
          debugInfo.attempts.push(attemptInfo);
          debugInfo.finalMethod = "edge-function";
          debugInfo.totalAttempts = retryCount + 1;
          debugInfo.lastSuccessTimestamp = new Date().toISOString();
          return { success: true, debugInfo };
        }

        attemptInfo.error = result.error;
        lastError = result.error;
        console.warn(
          `Edge function error (attempt ${retryCount + 1}/${maxRetries + 1}):`,
          result.error,
        );
      } catch (edgeFunctionError) {
        attemptInfo.error = edgeFunctionError;
        lastError = edgeFunctionError;
        console.warn(
          `Edge function exception (attempt ${retryCount + 1}/${maxRetries + 1}):`,
          edgeFunctionError,
        );
      }

      debugInfo.attempts.push(attemptInfo);

      // Fall back to direct method on the last retry
      if (retryCount === maxRetries) {
        const directAttemptInfo: any = {
          attemptNumber: retryCount + 2,
          timestamp: new Date().toISOString(),
          method: "direct-rpc",
        };

        try {
          console.log("Falling back to direct RPC method...");
          const { error } = await supabase.rpc("exec_sql", {
            sql_text: sqlContent,
          });

          if (error) {
            directAttemptInfo.error = error;
            console.error(`SQL execution failed: ${error.message}`);
            debugInfo.attempts.push(directAttemptInfo);
            debugInfo.finalMethod = "direct-rpc-failed";
            debugInfo.totalAttempts = retryCount + 2;
            return { success: false, error, debugInfo };
          }

          console.log(`SQL execution successful via direct RPC method`);
          debugInfo.attempts.push(directAttemptInfo);
          debugInfo.finalMethod = "direct-rpc";
          debugInfo.totalAttempts = retryCount + 2;
          debugInfo.lastSuccessTimestamp = new Date().toISOString();
          return { success: true, debugInfo };
        } catch (error) {
          directAttemptInfo.error = error;
          debugInfo.attempts.push(directAttemptInfo);
          debugInfo.finalMethod = "all-methods-failed";
          debugInfo.totalAttempts = retryCount + 2;
          console.error(`SQL execution failed with exception:`, error);
          return { success: false, error, debugInfo };
        }
      }

      retryCount++;
    }

    // This should not be reached due to the return in the last retry's direct method
    // but keeping it as a fallback
    console.error(`SQL execution failed after ${maxRetries} retries`);
    return {
      success: false,
      error: lastError || { message: "Failed after maximum retry attempts" },
      debugInfo,
    };
  } catch (error) {
    console.error(`SQL execution failed with unexpected exception:`, error);
    return {
      success: false,
      error,
      debugInfo: {
        unexpectedError: true,
        error,
      },
    };
  }
}

/**
 * Create a stored procedure in Supabase to execute SQL
 * This needs to be run once to set up the exec_sql function
 * @param maxRetries Maximum number of retry attempts (default: 3)
 */
export async function createExecSqlFunction(maxRetries: number = 3): Promise<{
  success: boolean;
  error?: any;
  debugInfo?: any;
}> {
  const createFunctionSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
      EXECUTE sql_text;
    END;
    $$;
  `;

  try {
    // Initialize retry counter and debug information
    let retryCount = 0;
    let lastError: any = null;
    let debugInfo: any = {
      attempts: [],
      finalMethod: null,
      totalAttempts: 0,
    };

    // Retry logic with exponential backoff
    while (retryCount <= maxRetries) {
      const attemptInfo: any = {
        attemptNumber: retryCount + 1,
        timestamp: new Date().toISOString(),
        method: "edge-function",
      };

      // If not the first attempt, wait with exponential backoff
      if (retryCount > 0) {
        const delayMs = Math.pow(2, retryCount - 1) * 1000; // 1s, 2s, 4s, etc.
        console.log(
          `Retry attempt ${retryCount}/${maxRetries} after ${delayMs}ms delay`,
        );
        attemptInfo.delayMs = delayMs;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      // First try using the edge function
      try {
        console.log(
          `Creating exec_sql function using edge function (attempt ${retryCount + 1}/${maxRetries + 1})...`,
        );
        const response = await fetch(
          `${supabase.supabaseUrl}/functions/v1/execute-sql`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
              Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
            },
            body: JSON.stringify({ sql: createFunctionSql }),
          },
        );

        attemptInfo.statusCode = response.status;
        attemptInfo.statusText = response.statusText;

        // Check for authentication issues
        if (response.status === 401 || response.status === 403) {
          attemptInfo.error =
            "Authentication failed - invalid or expired token";
          debugInfo.attempts.push(attemptInfo);
          debugInfo.authError = true;
          return {
            success: false,
            error: {
              message: "Authentication failed. Please log in again.",
              code: "AUTH_ERROR",
            },
            debugInfo,
          };
        }

        const result = await response.json();
        attemptInfo.result = result;

        if (response.ok && !result.error) {
          console.log(
            "Successfully created exec_sql function using edge function",
          );
          debugInfo.attempts.push(attemptInfo);
          debugInfo.finalMethod = "edge-function";
          debugInfo.totalAttempts = retryCount + 1;
          debugInfo.lastSuccessTimestamp = new Date().toISOString();
          return { success: true, debugInfo };
        }

        attemptInfo.error = result.error;
        lastError = result.error;
        console.warn(
          `Edge function error (attempt ${retryCount + 1}/${maxRetries + 1}):`,
          result.error,
        );
      } catch (edgeFunctionError) {
        attemptInfo.error = edgeFunctionError;
        lastError = edgeFunctionError;
        console.warn(
          `Edge function exception (attempt ${retryCount + 1}/${maxRetries + 1}):`,
          edgeFunctionError,
        );
      }

      debugInfo.attempts.push(attemptInfo);

      // Try direct methods on the last retry
      if (retryCount === maxRetries) {
        // Try multiple fallback methods
        const methods = [
          {
            name: "direct-rpc",
            fn: async () => {
              console.log("Trying direct RPC method...");
              // Try to use the function first to see if it exists
              try {
                return await supabase.rpc("exec_sql", { sql_text: "SELECT 1" });
              } catch (error) {
                // If the function doesn't exist, try to create it directly
                console.log("Function doesn't exist, creating it directly...");
                return await supabase.rpc("exec_sql", {
                  sql_text: createFunctionSql,
                });
              }
            },
          },
          {
            name: "exec-sql-direct",
            fn: async () => {
              console.log("Creating exec_sql function via exec_sql_direct...");
              // Try direct SQL execution using REST API
              const response = await fetch(
                `${supabase.supabaseUrl}/rest/v1/rpc/exec_sql`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    apikey:
                      supabase.supabaseKey || supabase.supabaseAnonKey || "",
                    Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
                    Prefer: "return=minimal",
                  },
                  body: JSON.stringify({ sql_text: createFunctionSql }),
                },
              );

              if (response.ok) {
                return { error: null };
              } else {
                const errorData = await response.json();
                return { error: errorData };
              }
            },
          },
          {
            name: "execute-sql",
            fn: async () => {
              console.log("Creating exec_sql function via execute_sql...");
              // Try direct SQL execution through the edge function
              const response = await fetch(
                `${supabase.supabaseUrl}/functions/v1/execute-sql`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    apikey:
                      supabase.supabaseKey || supabase.supabaseAnonKey || "",
                    Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
                  },
                  body: JSON.stringify({ sql: createFunctionSql }),
                },
              );

              if (response.ok) {
                return { error: null };
              } else {
                const errorData = await response.json();
                return { error: errorData };
              }
            },
          },
        ];

        // Try each method in sequence
        for (const method of methods) {
          const directAttemptInfo: any = {
            attemptNumber: retryCount + 2,
            timestamp: new Date().toISOString(),
            method: method.name,
          };

          try {
            const { error } = await method.fn();

            if (!error) {
              console.log(`SQL execution successful via ${method.name}`);
              debugInfo.attempts.push(directAttemptInfo);
              debugInfo.finalMethod = method.name;
              debugInfo.totalAttempts = retryCount + 2;
              debugInfo.lastSuccessTimestamp = new Date().toISOString();
              return { success: true, debugInfo };
            }

            directAttemptInfo.error = error;
            debugInfo.attempts.push(directAttemptInfo);
            console.error(`${method.name} method failed: ${error.message}`);
          } catch (error) {
            directAttemptInfo.error = error;
            debugInfo.attempts.push(directAttemptInfo);
            console.error(`${method.name} method exception:`, error);
          }
        }

        // All methods failed
        debugInfo.finalMethod = "all-methods-failed";
        debugInfo.totalAttempts = retryCount + methods.length + 1;
        return {
          success: false,
          error: lastError || { message: "All connection methods failed" },
          debugInfo,
        };
      }

      retryCount++;
    }

    // This should not be reached due to the return in the last retry
    console.error(`Function creation failed after ${maxRetries} retries`);
    return {
      success: false,
      error: lastError || { message: "Failed after maximum retry attempts" },
      debugInfo,
    };
  } catch (error) {
    console.error(`Failed to create exec_sql function:`, error);
    return {
      success: false,
      error,
      debugInfo: {
        unexpectedError: true,
        error,
      },
    };
  }
}
