import { supabase } from "@/lib/supabase";
import { runSqlDirectly } from "@/utils/migrationRunner";
import { applyModuleIntegrationsUpdate } from "@/utils/applyMigration";
import { migrationLogger, MigrationLogEntry } from "@/utils/migrationLogger";

// Create a self-reference to allow methods to call other methods on this object
let migrationsApi: any;

/**
 * API for handling database migrations
 */
migrationsApi = {
  /**
   * Get migration logs from the database
   * @returns Array of migration logs
   */
  getMigrationLogs: async (): Promise<{
    success: boolean;
    data?: any[];
    error?: any;
  }> => {
    try {
      // First check if the migration_logs table exists
      const { data: tableExists, error: tableCheckError } = await supabase
        .from("information_schema.tables")
        .select("*")
        .eq("table_schema", "public")
        .eq("table_name", "migration_logs")
        .single();

      if (tableCheckError || !tableExists) {
        console.warn("Migration logs table does not exist");
        return {
          success: false,
          error: { message: "Migration logs table does not exist" },
        };
      }

      // Fetch logs from the migration_logs table
      const { data, error } = await supabase
        .from("migration_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching migration logs:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error fetching migration logs:", error);
      return {
        success: false,
        error: { message: `Unexpected error: ${error.message}` },
      };
    }
  },

  /**
   * Log a migration operation to the migration_logs table
   * @param logEntry The log entry to insert
   */
  logMigrationOperation: async (logEntry: MigrationLogEntry): Promise<void> => {
    return migrationLogger.logMigrationOperation(logEntry);
  },

  /**
   * Safely log a migration operation, handling any errors without disrupting the main operation
   * @param operationData Basic operation data
   * @param startTime Start time of the operation for calculating duration
   * @param result Result of the operation
   */
  safelyLogOperation: async (
    operationData: {
      operation_id: string;
      operation_type: string;
      sql_content: string;
      method_used: string;
    },
    startTime: Date,
    result: { success: boolean; error?: any; debugInfo?: any },
  ): Promise<void> => {
    return migrationLogger.safelyLogOperation(operationData, startTime, result);
  },

  /**
   * Create the migration_logs table if it doesn't exist
   */
  createMigrationLogsTable: async (): Promise<{
    success: boolean;
    error?: any;
  }> => {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS migration_logs (
        id SERIAL PRIMARY KEY,
        operation_id TEXT NOT NULL,
        operation_type TEXT NOT NULL,
        sql_content TEXT NOT NULL,
        status TEXT NOT NULL,
        method_used TEXT NOT NULL,
        execution_time_ms INTEGER NOT NULL,
        details JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Add index for faster queries
      CREATE INDEX IF NOT EXISTS idx_migration_logs_operation_id ON migration_logs(operation_id);
      CREATE INDEX IF NOT EXISTS idx_migration_logs_status ON migration_logs(status);
      CREATE INDEX IF NOT EXISTS idx_migration_logs_created_at ON migration_logs(created_at);
      
      -- Add table and column descriptions
      COMMENT ON TABLE migration_logs IS 'Logs of SQL migration operations | سجلات عمليات ترحيل SQL';
      COMMENT ON COLUMN migration_logs.id IS 'Unique identifier for the log entry | معرف فريد لإدخال السجل';
      COMMENT ON COLUMN migration_logs.operation_id IS 'Unique identifier for the operation | معرف فريد للعملية';
      COMMENT ON COLUMN migration_logs.operation_type IS 'Type of migration operation | نوع عملية الترحيل';
      COMMENT ON COLUMN migration_logs.sql_content IS 'SQL content executed | محتوى SQL المنفذ';
      COMMENT ON COLUMN migration_logs.status IS 'Status of the operation (success, failed, error) | حالة العملية (نجاح، فشل، خطأ)';
      COMMENT ON COLUMN migration_logs.method_used IS 'Method used to execute the SQL | الطريقة المستخدمة لتنفيذ SQL';
      COMMENT ON COLUMN migration_logs.execution_time_ms IS 'Execution time in milliseconds | وقت التنفيذ بالمللي ثانية';
      COMMENT ON COLUMN migration_logs.details IS 'Additional details about the operation | تفاصيل إضافية حول العملية';
      COMMENT ON COLUMN migration_logs.created_at IS 'Timestamp when the log was created | الطابع الزمني عند إنشاء السجل';
      
      -- Enable row-level security but allow all operations for authenticated users
      ALTER TABLE migration_logs ENABLE ROW LEVEL SECURITY;
      
      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON migration_logs;
      
      -- Create policy to allow all operations for authenticated users
      CREATE POLICY "Allow all operations for authenticated users"
        ON migration_logs
        FOR ALL
        TO authenticated
        USING (true);
        
      -- Enable realtime for this table
      BEGIN
        SELECT FROM pg_publication WHERE pubname = 'supabase_realtime';
        IF FOUND THEN
          ALTER PUBLICATION supabase_realtime ADD TABLE migration_logs;
        END IF;
      EXCEPTION WHEN undefined_table THEN
        -- Publication doesn't exist, do nothing
      END;
    `;

    try {
      const result = await migrationsApi.runCustomSql(createTableSql);
      return result;
    } catch (error) {
      console.error("Failed to create migration_logs table:", error);
      return {
        success: false,
        error,
      };
    }
  },

  /**
   * Apply a specific migration by name
   */
  applyMigration: async (
    migrationName: string,
  ): Promise<{ success: boolean; error?: any }> => {
    switch (migrationName) {
      case "module_integrations_update":
        // Get the SQL content from the applyModuleIntegrationsUpdate function
        const sql = `
-- Add created_at and updated_at columns with default values
ALTER TABLE module_integrations 
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_module_integrations_source_module ON module_integrations(source_module_id);
CREATE INDEX IF NOT EXISTS idx_module_integrations_target_module ON module_integrations(target_module_id);
CREATE INDEX IF NOT EXISTS idx_module_integrations_type ON module_integrations(integration_type);
CREATE INDEX IF NOT EXISTS idx_module_integrations_status ON module_integrations(status);

-- Create a view for integration statistics
CREATE OR REPLACE VIEW module_integration_stats AS
SELECT
  COUNT(*) AS total_integrations,
  COUNT(*) FILTER (WHERE status = 'active') AS active_integrations,
  COUNT(*) FILTER (WHERE status = 'inactive') AS inactive_integrations,
  COUNT(*) FILTER (WHERE status = 'pending') AS pending_integrations,
  jsonb_object_agg(integration_type, type_count) AS integration_types,
  jsonb_object_agg(module_name, module_count) AS module_connections
FROM (
  -- Count by integration type
  SELECT 
    integration_type,
    COUNT(*) AS type_count
  FROM module_integrations
  GROUP BY integration_type
) AS type_counts,
(
  -- Count by module (both source and target)
  SELECT 
    module_name,
    COUNT(*) AS module_count
  FROM (
    SELECT source_module_name AS module_name FROM module_integrations
    UNION ALL
    SELECT target_module_name AS module_name FROM module_integrations
  ) AS all_modules
  GROUP BY module_name
) AS module_counts;

-- Create a trigger function to update the updated_at column
CREATE OR REPLACE FUNCTION update_module_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_module_integrations_updated_at'
  ) THEN
    CREATE TRIGGER set_module_integrations_updated_at
    BEFORE UPDATE ON module_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_module_integrations_updated_at();
  END IF;
END;
$$;
        `;

        // Use the edge function to execute the SQL
        return await migrationsApi.runCustomSql(sql);

      case "fix_bilingual_descriptions":
        // Get the SQL content from the new migration file
        const fixDescriptionsSql = `
-- Fix bilingual descriptions for support_tickets table
-- This migration adds conditional checks for column existence before adding comments

DO $$
BEGIN
  -- Check if support_tickets table exists
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'support_tickets') THEN
    -- Add comments to columns only if they exist
    
    -- Table comment
    COMMENT ON TABLE support_tickets IS 'Support tickets submitted by users | تذاكر الدعم المقدمة من المستخدمين';
    
    -- Column comments - only if the column exists
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'id') THEN
      COMMENT ON COLUMN support_tickets.id IS 'Unique identifier for the support ticket | معرف فريد لتذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'user_id') THEN
      COMMENT ON COLUMN support_tickets.user_id IS 'ID of the user who created the ticket | معرف المستخدم الذي أنشأ التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'subject') THEN
      COMMENT ON COLUMN support_tickets.subject IS 'Subject of the support ticket | موضوع تذكرة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'description') THEN
      COMMENT ON COLUMN support_tickets.description IS 'Detailed description of the issue | وصف مفصل للمشكلة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'status') THEN
      COMMENT ON COLUMN support_tickets.status IS 'Current status of the ticket (open, in_progress, resolved, closed) | الحالة الحالية للتذكرة (مفتوحة، قيد التقدم، تم حلها، مغلقة)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'priority') THEN
      COMMENT ON COLUMN support_tickets.priority IS 'Priority level of the ticket (low, medium, high, urgent) | مستوى أولوية التذكرة (منخفض، متوسط، مرتفع، عاجل)';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'category') THEN
      COMMENT ON COLUMN support_tickets.category IS 'Category of the support issue | فئة مشكلة الدعم';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'assigned_to') THEN
      COMMENT ON COLUMN support_tickets.assigned_to IS 'ID of the staff member assigned to the ticket | معرف الموظف المكلف بالتذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN support_tickets.created_at IS 'Timestamp when the ticket was created | الطابع الزمني عند إنشاء التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'updated_at') THEN
      COMMENT ON COLUMN support_tickets.updated_at IS 'Timestamp when the ticket was last updated | الطابع الزمني عند آخر تحديث للتذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolved_at') THEN
      COMMENT ON COLUMN support_tickets.resolved_at IS 'Timestamp when the ticket was resolved | الطابع الزمني عند حل التذكرة';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolution_notes') THEN
      COMMENT ON COLUMN support_tickets.resolution_notes IS 'Notes about how the issue was resolved | ملاحظات حول كيفية حل المشكلة';
    END IF;
  END IF;
  
  -- Add similar conditional checks for other tables and columns as needed
  
END;
$$;
        `;

        // Use the edge function to execute the SQL
        return await migrationsApi.runCustomSql(fixDescriptionsSql);

      case "add_all_bilingual_descriptions":
        // Get the SQL content from the migration file
        const allDescriptionsSql = `
-- Add bilingual descriptions to all tables and columns
-- This migration adds conditional checks for table and column existence before adding comments

DO $$
BEGIN
  -- ai_development_recommendations table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'ai_development_recommendations') THEN
    COMMENT ON TABLE ai_development_recommendations IS 'AI-generated development recommendations | توصيات التطوير المولدة بالذكاء الاصطناعي';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'id') THEN
      COMMENT ON COLUMN ai_development_recommendations.id IS 'Unique identifier for the recommendation | معرف فريد للتوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'title') THEN
      COMMENT ON COLUMN ai_development_recommendations.title IS 'Title of the recommendation | عنوان التوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'description') THEN
      COMMENT ON COLUMN ai_development_recommendations.description IS 'Detailed description of the recommendation | وصف مفصل للتوصية';
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_development_recommendations' AND column_name = 'created_at') THEN
      COMMENT ON COLUMN ai_development_recommendations.created_at IS 'Timestamp when the recommendation was created | الطابع الزمني عند إنشاء التوصية';
    END IF;
  END IF;
  
  -- And many more tables and columns with detailed bilingual descriptions
  -- The full SQL is in the migration file
  
  -- module_integrations table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'module_integrations') THEN
    COMMENT ON TABLE module_integrations IS 'Integrations between different modules | التكاملات بين الوحدات المختلفة';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations' AND column_name = 'id') THEN
      COMMENT ON COLUMN module_integrations.id IS 'Unique identifier for the integration | معرف فريد للتكامل';
    END IF;
  END IF;
  
  -- products table
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
    COMMENT ON TABLE products IS 'Products available in the store | المنتجات المتاحة في المتجر';
    
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'id') THEN
      COMMENT ON COLUMN products.id IS 'Unique identifier for the product | معرف فريد للمنتج';
    END IF;
  END IF;
END;
$$;
        `;

        // Use the edge function to execute the SQL
        return await migrationsApi.runCustomSql(allDescriptionsSql);

      default:
        return {
          success: false,
          error: `Unknown migration: ${migrationName}`,
        };
    }
  },

  /**
   * Run custom SQL with enhanced error handling and retry logic
   * @param sql SQL query to execute
   * @param maxRetries Maximum number of retry attempts
   * @returns Result object with success status, error (if any), and debug info
   */
  runCustomSql: async (
    sql: string,
    maxRetries: number = 2,
  ): Promise<{
    success: boolean;
    error?: any;
    debugInfo?: any;
    data?: any;
  }> => {
    if (!sql || !sql.trim()) {
      return {
        success: false,
        error: { message: "SQL query is empty", code: "EMPTY_SQL" },
        debugInfo: { timestamp: new Date().toISOString() },
      };
    }

    // Generate a unique operation ID for tracking this execution
    const operationId = `sql-exec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const startTime = new Date();

    const debugInfo: any = {
      attempts: [],
      methods: [],
      timestamp: startTime.toISOString(),
      sqlPreview: sql.length > 100 ? `${sql.substring(0, 100)}...` : sql,
      sqlLength: sql.length,
      operationId,
    };

    try {
      // First check if migration_logs table exists, create it if it doesn't
      try {
        const { data, error } = await supabase
          .from("migration_logs")
          .select("id")
          .limit(1);

        if (error) {
          console.log(
            "Migration logs table may not exist, attempting to create it",
          );
          // Try to create the table, but don't throw if it fails
          await migrationsApi.createMigrationLogsTable().catch((err) => {
            console.warn("Failed to create migration_logs table:", err);
          });
        }
      } catch (e) {
        console.warn("Error checking migration_logs table:", e);
      }

      // First check connection status
      console.log("Checking connection before executing SQL");
      const connectionCheck = await migrationsApi.checkConnection(1); // Use just 1 retry for connection check

      if (!connectionCheck.success) {
        // If connection check failed with auth error, return immediately
        if (connectionCheck.error?.code === "AUTH_ERROR") {
          const result = {
            success: false,
            error: connectionCheck.error,
            debugInfo: {
              ...debugInfo,
              connectionCheck: connectionCheck.debugInfo,
              authError: true,
            },
          };

          // Log the auth error
          await migrationsApi.safelyLogOperation(
            {
              operation_id: operationId,
              operation_type: "custom_sql",
              sql_content: sql,
              method_used: "auth_error",
            },
            startTime,
            result,
          );

          return result;
        }

        // Log connection issues but continue trying to execute SQL
        console.warn(
          "Connection check failed, but attempting SQL execution anyway",
          connectionCheck.error,
        );
        debugInfo.connectionWarning =
          connectionCheck.error?.message || "Connection check failed";
      }

      // First try using the edge function
      console.log(
        "Invoking execute-sql edge function with Supabase URL:",
        supabase.supabaseUrl,
      );

      debugInfo.methods.push("edge-function");
      let retryCount = 0;
      let lastError: any = null;

      // Retry logic with exponential backoff
      while (retryCount <= maxRetries) {
        try {
          // Add a small delay for retries with exponential backoff
          if (retryCount > 0) {
            const delayMs = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s, etc.
            console.log(
              `Retry attempt ${retryCount}/${maxRetries} after ${delayMs}ms delay`,
            );
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }

          // Try OPTIONS request first to check CORS if this is the first attempt
          if (retryCount === 0) {
            try {
              const corsResponse = await fetch(
                `${supabase.supabaseUrl}/functions/v1/execute-sql`,
                {
                  method: "OPTIONS",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );

              if (!corsResponse.ok) {
                console.warn(
                  "CORS preflight failed, but continuing with main request",
                  {
                    status: corsResponse.status,
                    statusText: corsResponse.statusText,
                  },
                );
                debugInfo.corsWarning = `CORS preflight failed: ${corsResponse.status} ${corsResponse.statusText}`;
              } else {
                debugInfo.corsCheck = "passed";
              }
            } catch (corsError) {
              console.warn(
                "CORS preflight exception, but continuing with main request",
                corsError,
              );
              debugInfo.corsWarning = `CORS preflight exception: ${corsError.message}`;
            }
          }

          // Main request
          const response = await fetch(
            `${supabase.supabaseUrl}/functions/v1/execute-sql`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
                Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
              },
              body: JSON.stringify({
                sql,
                sql_text: sql, // Include both parameter names for compatibility
                debug: true, // Request additional debug info from the edge function
                operation_id: operationId, // Pass the operation ID for tracking
              }),
            },
          );

          const attemptInfo: any = {
            method: "edge-function",
            attempt: retryCount + 1,
            status: response.status,
            statusText: response.statusText,
            timestamp: new Date().toISOString(),
          };

          debugInfo.attempts.push(attemptInfo);

          // Check for authentication issues
          if (response.status === 401 || response.status === 403) {
            debugInfo.authError = true;
            const result = {
              success: false,
              error: {
                message: "Authentication failed. Please log in again.",
                code: "AUTH_ERROR",
                status: response.status,
              },
              debugInfo,
            };

            // Log the auth error
            await migrationsApi.safelyLogOperation(
              {
                operation_id: operationId,
                operation_type: "custom_sql",
                sql_content: sql,
                method_used: "edge-function-auth-error",
              },
              startTime,
              result,
            );

            return result;
          }

          // Check for CORS or network errors
          if (response.status === 0 || response.status === 520) {
            lastError = {
              message: `Network error or CORS issue (status: ${response.status})`,
              code: "NETWORK_ERROR",
              status: response.status,
            };
            attemptInfo.error = lastError;
            attemptInfo.errorType = "network";
            retryCount++;
            continue; // Try again
          }

          let result;
          try {
            result = await response.json();
            attemptInfo.result = result;
          } catch (jsonError) {
            // Handle non-JSON responses
            lastError = {
              message: `Failed to parse response: ${jsonError.message}`,
              code: "PARSE_ERROR",
            };
            attemptInfo.error = lastError;
            attemptInfo.errorType = "parse";
            attemptInfo.responseText = await response
              .text()
              .catch(() => "[Failed to get response text]");
            retryCount++;
            continue; // Try again
          }

          if (response.ok && !result.error) {
            debugInfo.finalMethod = "edge-function";
            debugInfo.lastSuccessTimestamp = new Date().toISOString();

            const successResult = {
              success: true,
              data: result.data,
              debugInfo,
            };

            // Log the successful operation
            await migrationsApi.safelyLogOperation(
              {
                operation_id: operationId,
                operation_type: "custom_sql",
                sql_content: sql,
                method_used: "edge-function",
              },
              startTime,
              successResult,
            );

            return successResult;
          }

          lastError = result.error || {
            message: "Unknown error in edge function response",
          };
          attemptInfo.error = lastError;
          attemptInfo.errorType =
            result.error?.code === "AUTH_ERROR" ? "auth" : "sql";

          console.error(
            `Edge function error (attempt ${retryCount + 1}/${maxRetries + 1}):`,
            result.error,
          );

          // If we get a specific error about the function not existing, try to create it
          if (
            result.error?.message?.includes("function exec_sql") ||
            result.error?.message?.includes("does not exist")
          ) {
            console.log("Function doesn't exist, attempting to create it...");
            attemptInfo.functionCreationAttempt = true;

            const setupResult = await migrationsApi.setupExecSqlFunction();
            attemptInfo.functionCreationResult = setupResult.success;

            if (setupResult.success) {
              console.log(
                "Successfully created exec_sql function, retrying original query...",
              );
              continue; // Try again with the same retry count
            } else {
              // Add function creation error details
              attemptInfo.functionCreationError = setupResult.error;
            }
          }

          retryCount++;
        } catch (edgeFunctionError) {
          lastError = {
            message: `Edge function exception: ${edgeFunctionError.message}`,
            code: "EDGE_FUNCTION_ERROR",
            details: edgeFunctionError,
          };

          debugInfo.attempts.push({
            method: "edge-function",
            attempt: retryCount + 1,
            error: lastError,
            errorType: "exception",
            timestamp: new Date().toISOString(),
          });

          console.error(
            `Edge function exception (attempt ${retryCount + 1}/${maxRetries + 1}):`,
            edgeFunctionError,
          );
          retryCount++;
        }
      }

      // Fall back to the client-side method
      debugInfo.methods.push("client-side");
      console.log("Falling back to client-side SQL execution");

      const directResult = await runSqlDirectly(sql);

      // Merge debug info
      if (directResult.debugInfo) {
        debugInfo.attempts = [
          ...debugInfo.attempts,
          ...(directResult.debugInfo.attempts || []),
        ];
        debugInfo.finalMethod =
          directResult.debugInfo.finalMethod || "client-side";
        debugInfo.lastSuccessTimestamp =
          directResult.debugInfo.lastSuccessTimestamp;
      }

      const finalResult = {
        success: directResult.success,
        error: directResult.error,
        data: directResult.data,
        debugInfo,
      };

      // Log the operation result
      await migrationsApi.safelyLogOperation(
        {
          operation_id: operationId,
          operation_type: "custom_sql",
          sql_content: sql,
          method_used: debugInfo.finalMethod || "client-side",
        },
        startTime,
        finalResult,
      );

      return finalResult;
    } catch (error) {
      console.error("Failed to execute SQL:", error);

      const errorResult = {
        success: false,
        error: {
          message: `Unexpected error executing SQL: ${error.message}`,
          code: "UNEXPECTED_ERROR",
          details: error,
        },
        debugInfo: {
          ...debugInfo,
          unexpectedError: true,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        },
      };

      // Log the error
      await migrationsApi.safelyLogOperation(
        {
          operation_id: operationId,
          operation_type: "custom_sql",
          sql_content: sql,
          method_used: "error",
        },
        startTime,
        errorResult,
      );

      return errorResult;
    }
  },

  /**
   * Check if module_integrations table has the required columns
   */
  checkModuleIntegrationsTable: async (): Promise<{
    success: boolean;
    hasCreatedAt: boolean;
    hasUpdatedAt: boolean;
    error?: any;
  }> => {
    try {
      // Check if the table exists and has the required columns
      const checkSql = `
        SELECT 
          EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'module_integrations' AND column_name = 'created_at'
          ) as has_created_at,
          EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'module_integrations' AND column_name = 'updated_at'
          ) as has_updated_at
      `;

      // Use the edge function to execute the SQL
      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/execute-sql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
            Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
          },
          body: JSON.stringify({ sql: checkSql }),
        },
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        return {
          success: false,
          hasCreatedAt: false,
          hasUpdatedAt: false,
          error: result.error || "Failed to check table status",
        };
      }

      return {
        success: true,
        hasCreatedAt: result.data?.has_created_at || false,
        hasUpdatedAt: result.data?.has_updated_at || false,
      };
    } catch (error) {
      return {
        success: false,
        hasCreatedAt: false,
        hasUpdatedAt: false,
        error,
      };
    }
  },

  /**
   * Check if Supabase connection is working
   * Enhanced with multiple connection methods, retry logic, and detailed debug info
   */
  checkConnection: async (
    maxRetries: number = 2,
  ): Promise<{
    success: boolean;
    error?: any;
    debugInfo?: any;
  }> => {
    const debugInfo: any = {
      attempts: [],
      methods: [],
      timestamp: new Date().toISOString(),
      totalAttempts: 0,
      connectionDetails: {
        supabaseUrl: supabase.supabaseUrl,
        hasAnonKey: !!supabase.supabaseAnonKey,
        hasKey: !!supabase.supabaseKey,
      },
    };

    try {
      // Try multiple methods with retries in priority order
      const methods = [
        {
          name: "auth.getUser",
          description: "Authentication check",
          fn: async () => {
            const { data, error } = await supabase.auth.getUser();
            return {
              success: !error,
              error,
              data,
              errorType: error
                ? error.status === 401
                  ? "auth"
                  : "general"
                : null,
            };
          },
        },
        {
          name: "rest-api",
          description: "REST API check",
          fn: async () => {
            const response = await fetch(`${supabase.supabaseUrl}/rest/v1/`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                apikey: supabase.supabaseKey || supabase.supabaseAnonKey || "",
                Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
              },
            });

            // Check for specific error types
            let errorType = null;
            if (!response.ok) {
              if (response.status === 401 || response.status === 403) {
                errorType = "auth";
              } else if (response.status === 0 || response.status >= 500) {
                errorType = "network";
              } else {
                errorType = "api";
              }
            }

            return {
              success: response.ok,
              status: response.status,
              statusText: response.statusText,
              errorType,
              error: !response.ok
                ? {
                    message: `HTTP error: ${response.status} ${response.statusText}`,
                    code: response.status,
                  }
                : null,
            };
          },
        },
        {
          name: "health-check",
          description: "Health endpoint check",
          fn: async () => {
            const response = await fetch(
              `${supabase.supabaseUrl}/rest/v1/health`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  apikey:
                    supabase.supabaseKey || supabase.supabaseAnonKey || "",
                  Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
                },
              },
            );

            // Check for specific error types
            let errorType = null;
            if (!response.ok) {
              if (response.status === 401 || response.status === 403) {
                errorType = "auth";
              } else if (response.status === 0 || response.status >= 500) {
                errorType = "network";
              } else {
                errorType = "api";
              }
            }

            return {
              success: response.ok,
              status: response.status,
              statusText: response.statusText,
              errorType,
              error: !response.ok
                ? {
                    message: `HTTP error: ${response.status} ${response.statusText}`,
                    code: response.status,
                  }
                : null,
            };
          },
        },
        {
          name: "edge-function-test",
          description: "Edge function availability check",
          fn: async () => {
            // First try OPTIONS to check CORS
            try {
              const corsResponse = await fetch(
                `${supabase.supabaseUrl}/functions/v1/cors-test`,
                {
                  method: "OPTIONS",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );

              // If CORS preflight fails, return specific error
              if (!corsResponse.ok) {
                return {
                  success: false,
                  status: corsResponse.status,
                  statusText: corsResponse.statusText,
                  errorType: "cors",
                  error: {
                    message: `CORS preflight failed: ${corsResponse.status} ${corsResponse.statusText}`,
                    code: "CORS_ERROR",
                  },
                };
              }
            } catch (corsError) {
              return {
                success: false,
                errorType: "cors",
                error: {
                  message: `CORS preflight exception: ${corsError.message}`,
                  code: "CORS_ERROR",
                },
              };
            }

            // Then try the actual request
            try {
              const response = await fetch(
                `${supabase.supabaseUrl}/functions/v1/cors-test`,
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    apikey:
                      supabase.supabaseKey || supabase.supabaseAnonKey || "",
                    Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
                  },
                },
              );

              // Check for specific error types
              let errorType = null;
              if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                  errorType = "auth";
                } else if (response.status === 0 || response.status >= 500) {
                  errorType = "network";
                } else {
                  errorType = "api";
                }
              }

              if (response.ok) {
                const data = await response.json();
                return { success: true, data };
              }

              return {
                success: false,
                status: response.status,
                statusText: response.statusText,
                errorType,
                error: {
                  message: `HTTP error: ${response.status} ${response.statusText}`,
                  code: response.status,
                },
              };
            } catch (error) {
              return {
                success: false,
                errorType: "network",
                error: {
                  message: `Network error: ${error.message}`,
                  code: "NETWORK_ERROR",
                },
              };
            }
          },
        },
        {
          name: "execute-sql-test",
          description: "SQL execution function check",
          fn: async () => {
            try {
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
                  body: JSON.stringify({ sql: "SELECT 1 as test" }),
                },
              );

              // Check for specific error types
              let errorType = null;
              if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                  errorType = "auth";
                } else if (response.status === 0 || response.status >= 500) {
                  errorType = "network";
                } else {
                  errorType = "api";
                }
              }

              if (response.ok) {
                const data = await response.json();
                return {
                  success: !data.error,
                  data,
                  error: data.error,
                  errorType: data.error ? "sql" : null,
                };
              }

              return {
                success: false,
                status: response.status,
                statusText: response.statusText,
                errorType,
                error: {
                  message: `HTTP error: ${response.status} ${response.statusText}`,
                  code: response.status,
                },
              };
            } catch (error) {
              return {
                success: false,
                errorType: "network",
                error: {
                  message: `Network error: ${error.message}`,
                  code: "NETWORK_ERROR",
                },
              };
            }
          },
        },
      ];

      // Try each method with retries
      for (const method of methods) {
        debugInfo.methods.push(method.name);
        let retryCount = 0;

        while (retryCount <= maxRetries) {
          try {
            // Add a delay for retries with exponential backoff
            if (retryCount > 0) {
              const delayMs = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s, etc.
              console.log(
                `Retry attempt for ${method.name}: ${retryCount}/${maxRetries} after ${delayMs}ms delay`,
              );
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }

            const result = await method.fn();
            debugInfo.totalAttempts++;

            const attemptInfo = {
              method: method.name,
              description: method.description,
              attempt: retryCount + 1,
              timestamp: new Date().toISOString(),
              ...result,
            };

            debugInfo.attempts.push(attemptInfo);

            // Special handling for auth errors - no need to retry other methods
            if (result.errorType === "auth") {
              debugInfo.finalMethod = method.name;
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

            if (result.success) {
              debugInfo.finalMethod = method.name;
              debugInfo.lastSuccessTimestamp = new Date().toISOString();
              return { success: true, debugInfo };
            }

            retryCount++;
          } catch (error) {
            debugInfo.totalAttempts++;
            debugInfo.attempts.push({
              method: method.name,
              description: method.description,
              attempt: retryCount + 1,
              error: {
                message: error.message,
                stack: error.stack,
                name: error.name,
              },
              timestamp: new Date().toISOString(),
            });
            console.error(
              `${method.name} exception (attempt ${retryCount + 1}/${maxRetries + 1}):`,
              error,
            );
            retryCount++;
          }
        }
      }

      // All methods failed - analyze errors to provide better feedback
      debugInfo.finalMethod = "all-methods-failed";

      // Check if all errors were network related
      const allNetworkErrors = debugInfo.attempts.every(
        (attempt) =>
          attempt.errorType === "network" ||
          (attempt.error &&
            (attempt.error.code === "NETWORK_ERROR" ||
              attempt.error.message?.includes("network") ||
              attempt.error.message?.includes("CORS"))),
      );

      // Check if all errors were auth related
      const allAuthErrors = debugInfo.attempts.every(
        (attempt) =>
          attempt.errorType === "auth" ||
          (attempt.error &&
            (attempt.error.code === "AUTH_ERROR" ||
              attempt.error.message?.includes("auth") ||
              attempt.error.message?.includes("token"))),
      );

      let errorMessage = "All connection methods failed";
      let errorCode = "CONNECTION_ERROR";

      if (allNetworkErrors) {
        errorMessage =
          "Network connectivity issues detected. Please check your internet connection and Supabase URL.";
        errorCode = "NETWORK_ERROR";
      } else if (allAuthErrors) {
        errorMessage =
          "Authentication failed across all methods. Please log in again.";
        errorCode = "AUTH_ERROR";
      }

      return {
        success: false,
        error: { message: errorMessage, code: errorCode },
        debugInfo,
      };
    } catch (error) {
      console.error("Connection check failed:", error);
      return {
        success: false,
        error: {
          message: `Unexpected error during connection check: ${error.message}`,
          code: "UNEXPECTED_ERROR",
          details: error,
        },
        debugInfo: {
          ...debugInfo,
          unexpectedError: true,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
        },
      };
    }
  },

  /**
   * Setup the SQL execution function with enhanced security and error handling
   * @param maxRetries Maximum number of retry attempts per method
   * @param logResults Whether to log results to migration_logs table
   * @returns Result object with success status, error (if any), and debug info
   */
  setupExecSqlFunction: async (
    maxRetries: number = 2,
    logResults: boolean = true,
  ): Promise<{
    success: boolean;
    error?: any;
    debugInfo?: any;
  }> => {
    // Create the function directly using a raw query with improved security and error handling
    const createFunctionSql = `
      -- First drop the function if it exists to ensure a clean recreation
      DROP FUNCTION IF EXISTS exec_sql(text);
      
      -- Create the exec_sql function with enhanced security and error handling
      CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $
      BEGIN
        -- Execute the SQL with exception handling
        BEGIN
          EXECUTE sql_text;
        EXCEPTION WHEN OTHERS THEN
          RAISE EXCEPTION 'SQL execution error: %', SQLERRM;
        END;
      END;
      $;
      
      -- Grant appropriate permissions
      GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
      GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
      
      -- Add function description
      COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';
    `;

    const operationId = `setup-exec-sql-${Date.now()}`;
    const startTime = new Date();

    const debugInfo: any = {
      attempts: [],
      methods: [],
      timestamp: startTime.toISOString(),
      totalAttempts: 0,
      operationId,
      sql: createFunctionSql.trim(),
    };

    try {
      // Check if migration_logs table exists before attempting to log
      let canLogToDatabase = false;
      if (logResults) {
        try {
          const { data, error } = await supabase
            .from("migration_logs")
            .select("id")
            .limit(1);

          canLogToDatabase = !error;
          debugInfo.canLogToDatabase = canLogToDatabase;
        } catch (e) {
          console.warn("Unable to check migration_logs table:", e);
          debugInfo.canLogToDatabase = false;
        }
      }

      // Try multiple methods with retries
      const methods = [
        {
          name: "edge-function",
          priority: 1,
          description: "Using Supabase Edge Function",
          fn: async () => {
            console.log("Creating exec_sql function using edge function...");
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
                body: JSON.stringify({
                  sql: createFunctionSql,
                  sql_text: createFunctionSql,
                  operation_id: operationId,
                }),
              },
            );

            if (!response.ok) {
              return {
                success: false,
                status: response.status,
                statusText: response.statusText,
                error: {
                  message: `HTTP error: ${response.status} ${response.statusText}`,
                  code: `HTTP_${response.status}`,
                },
              };
            }

            const result = await response.json();
            if (result.error) {
              return { success: false, error: result.error };
            }

            return { success: true, data: result.data };
          },
        },
        {
          name: "direct-rpc",
          priority: 2,
          description: "Using Direct RPC Call",
          fn: async () => {
            console.log("Creating exec_sql function using direct RPC...");
            try {
              // First check if the function already exists
              const testResult = await supabase.rpc("exec_sql", {
                sql_text: "SELECT 1",
              });

              if (!testResult.error) {
                return { success: true, message: "Function already exists" };
              }

              // If not, create it
              const { error } = await supabase.rpc("exec_sql", {
                sql_text: createFunctionSql,
              });

              if (error) {
                return { success: false, error };
              }

              return { success: true };
            } catch (error) {
              return { success: false, error };
            }
          },
        },
        {
          name: "direct-fetch",
          priority: 3,
          description: "Using Direct REST API",
          fn: async () => {
            console.log("Creating exec_sql function using direct fetch...");
            try {
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
                  body: JSON.stringify({
                    sql_text: createFunctionSql,
                    operation_id: operationId,
                  }),
                },
              );

              if (!response.ok) {
                const errorText = await response.text();
                return {
                  success: false,
                  status: response.status,
                  statusText: response.statusText,
                  error: {
                    message: errorText || `HTTP error: ${response.status}`,
                    code: `HTTP_${response.status}`,
                  },
                };
              }

              return { success: true };
            } catch (error) {
              return { success: false, error };
            }
          },
        },
        {
          name: "create-function-directly",
          priority: 4,
          description: "Using runCustomSql Method",
          fn: async () => {
            console.log("Creating exec_sql function using direct SQL...");
            // This is a fallback that uses the runCustomSql method which will try multiple approaches
            const result = await migrationsApi.runCustomSql(createFunctionSql);
            return result;
          },
        },
      ];

      // Sort methods by priority
      methods.sort((a, b) => a.priority - b.priority);
      debugInfo.methodOrder = methods.map((m) => m.name);

      // Try each method with retries
      for (const method of methods) {
        debugInfo.methods.push(method.name);
        let retryCount = 0;

        while (retryCount <= maxRetries) {
          try {
            // Add a delay for retries with exponential backoff
            if (retryCount > 0) {
              const delayMs = Math.pow(2, retryCount) * 500; // 500ms, 1s, 2s, etc.
              console.log(
                `Retry attempt for ${method.name}: ${retryCount}/${maxRetries} after ${delayMs}ms delay`,
              );
              await new Promise((resolve) => setTimeout(resolve, delayMs));
            }

            const result = await method.fn();
            debugInfo.totalAttempts++;

            const attemptInfo = {
              method: method.name,
              description: method.description,
              attempt: retryCount + 1,
              timestamp: new Date().toISOString(),
              ...result,
            };

            debugInfo.attempts.push(attemptInfo);

            if (result.success) {
              debugInfo.finalMethod = method.name;
              debugInfo.lastSuccessTimestamp = new Date().toISOString();

              // Verify the function works by testing it
              try {
                const testResult = await supabase.rpc("exec_sql", {
                  sql_text: "SELECT 1 as test",
                });

                if (!testResult.error) {
                  console.log("Successfully verified exec_sql function works");
                  debugInfo.verificationSuccess = true;

                  // Log successful operation to migration_logs if possible
                  if (canLogToDatabase) {
                    try {
                      // Use safelyLogOperation instead of direct logMigrationOperation call
                      await migrationsApi.safelyLogOperation(
                        {
                          operation_id: operationId,
                          operation_type: "setup_exec_sql",
                          sql_content: createFunctionSql,
                          method_used: method.name,
                        },
                        startTime,
                        {
                          success: true,
                          debugInfo: {
                            verificationSuccess: true,
                            method: method.name,
                            attempts: retryCount + 1,
                          },
                        },
                      );
                    } catch (logError) {
                      console.warn(
                        "Failed to log successful operation:",
                        logError,
                      );
                    }
                  }

                  return { success: true, debugInfo };
                }

                console.warn(
                  "Function created but verification failed:",
                  testResult.error,
                );
                debugInfo.verificationSuccess = false;
                debugInfo.verificationError = testResult.error;

                // Log verification failure
                if (canLogToDatabase) {
                  try {
                    await migrationsApi.safelyLogOperation(
                      {
                        operation_id: `${operationId}-verify`,
                        operation_type: "verify_exec_sql",
                        sql_content: "SELECT 1 as test",
                        method_used: `${method.name}-verify`,
                      },
                      startTime,
                      {
                        success: false,
                        error: testResult.error,
                        debugInfo: {
                          verificationSuccess: false,
                          method: method.name,
                          verificationError: testResult.error,
                        },
                      },
                    );
                  } catch (logError) {
                    console.warn(
                      "Failed to log verification failure:",
                      logError,
                    );
                  }
                }
              } catch (verifyError) {
                console.warn("Function verification error:", verifyError);
                debugInfo.verificationSuccess = false;
                debugInfo.verificationError = verifyError;

                // Log verification exception
                if (canLogToDatabase) {
                  try {
                    await migrationsApi.safelyLogOperation(
                      {
                        operation_id: `${operationId}-verify-exception`,
                        operation_type: "verify_exec_sql",
                        sql_content: "SELECT 1 as test",
                        method_used: `${method.name}-verify`,
                      },
                      startTime,
                      {
                        success: false,
                        error: verifyError,
                        debugInfo: {
                          verificationSuccess: false,
                          method: method.name,
                          verificationError: verifyError,
                        },
                      },
                    );
                  } catch (logError) {
                    console.warn(
                      "Failed to log verification exception:",
                      logError,
                    );
                  }
                }

                // Continue with next method if verification fails
                break;
              }

              return { success: true, debugInfo };
            }

            // Log failed attempt
            if (canLogToDatabase && retryCount === maxRetries) {
              try {
                await migrationsApi.safelyLogOperation(
                  {
                    operation_id: `${operationId}-${method.name}-attempt-${retryCount}`,
                    operation_type: "setup_exec_sql_attempt",
                    sql_content: createFunctionSql,
                    method_used: method.name,
                  },
                  startTime,
                  {
                    success: false,
                    error: result.error,
                    debugInfo: {
                      method: method.name,
                      attempt: retryCount + 1,
                      error: result.error,
                    },
                  },
                );
              } catch (logError) {
                console.warn("Failed to log method attempt failure:", logError);
              }
            }

            retryCount++;
          } catch (error) {
            debugInfo.totalAttempts++;
            debugInfo.attempts.push({
              method: method.name,
              description: method.description,
              attempt: retryCount + 1,
              error: {
                message: error.message,
                stack: error.stack,
                name: error.name,
              },
              timestamp: new Date().toISOString(),
            });
            console.error(
              `${method.name} exception (attempt ${retryCount + 1}/${maxRetries + 1}):`,
              error,
            );

            // Log exception
            if (canLogToDatabase && retryCount === maxRetries) {
              try {
                await migrationsApi.safelyLogOperation(
                  {
                    operation_id: `${operationId}-${method.name}-exception-${retryCount}`,
                    operation_type: "setup_exec_sql_exception",
                    sql_content: createFunctionSql,
                    method_used: method.name,
                  },
                  startTime,
                  {
                    success: false,
                    error: error,
                    debugInfo: {
                      method: method.name,
                      attempt: retryCount + 1,
                      error: error,
                    },
                  },
                );
              } catch (logError) {
                console.warn("Failed to log method exception:", logError);
              }
            }

            retryCount++;
          }
        }
      }

      // All methods failed
      debugInfo.finalMethod = "all-methods-failed";
      debugInfo.failureTimestamp = new Date().toISOString();

      // Log failed operation to migration_logs if possible
      if (canLogToDatabase) {
        try {
          await migrationsApi.safelyLogOperation(
            {
              operation_id: operationId,
              operation_type: "setup_exec_sql",
              sql_content: createFunctionSql,
              method_used: "multiple",
            },
            startTime,
            {
              success: false,
              error: {
                message: "All methods to create exec_sql function failed",
              },
              debugInfo: {
                methods_attempted: debugInfo.methods,
                total_attempts: debugInfo.totalAttempts,
              },
            },
          );
        } catch (logError) {
          console.warn("Failed to log failed operation:", logError);
        }
      }

      return {
        success: false,
        error: { message: "All methods to create exec_sql function failed" },
        debugInfo,
      };
    } catch (error) {
      console.error("Failed to create exec_sql function:", error);

      // Log unexpected error to migration_logs if possible
      if (debugInfo.canLogToDatabase) {
        try {
          await migrationsApi.safelyLogOperation(
            {
              operation_id: operationId,
              operation_type: "setup_exec_sql",
              sql_content: createFunctionSql,
              method_used: "unknown",
            },
            startTime,
            {
              success: false,
              error: error,
              debugInfo: {
                unexpectedError: true,
                error_message: error.message,
                error_name: error.name,
                stack: error.stack,
              },
            },
          );
        } catch (logError) {
          console.warn("Failed to log error operation:", logError);
        }
      }

      return {
        success: false,
        error,
        debugInfo: {
          ...debugInfo,
          unexpectedError: true,
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          timestamp: new Date().toISOString(),
        },
      };
    }
  },
};

export { migrationsApi };
