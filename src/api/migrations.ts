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
   * Check connection to Supabase
   * @returns Result object with success status and error (if any)
   */
  checkConnection: async (): Promise<{
    success: boolean;
    error?: any;
    debugInfo?: any;
  }> => {
    try {
      const startTime = new Date();
      const debugInfo: any = {
        attempts: [],
        totalAttempts: 0,
        lastSuccessTimestamp: null,
      };

      // Simple query to test connection
      // Note: information_schema is a schema, not a table in public schema
      const { data, error } = await supabase.rpc("pg_query", {
        query: "SELECT table_name FROM information_schema.tables LIMIT 1",
      });

      // If the above fails, try a different approach
      if (error) {
        console.log("Trying alternative connection check method...");
        try {
          // Try a simple RPC call instead
          const { data: rpcData, error: rpcError } =
            await supabase.rpc("get_service_role");

          if (!rpcError) {
            return {
              success: true,
              debugInfo: {
                method: "rpc_fallback",
                timestamp: new Date().toISOString(),
              },
            };
          }
        } catch (fallbackError) {
          console.warn("Fallback connection check also failed:", fallbackError);
        }
      }

      if (error) {
        debugInfo.attempts.push({
          attemptNumber: 1,
          method: "direct_query",
          timestamp: new Date().toISOString(),
          error: error.message,
          statusCode: error.code,
        });

        return {
          success: false,
          error,
          debugInfo: {
            ...debugInfo,
            finalMethod: "direct_query",
            totalAttempts: 1,
          },
        };
      }

      // Connection successful
      const endTime = new Date();
      const executionTimeMs = endTime.getTime() - startTime.getTime();

      debugInfo.attempts.push({
        attemptNumber: 1,
        method: "direct_query",
        timestamp: new Date().toISOString(),
        statusCode: 200,
        executionTimeMs,
      });

      debugInfo.lastSuccessTimestamp = new Date().toISOString();

      return {
        success: true,
        debugInfo: {
          ...debugInfo,
          finalMethod: "direct_query",
          totalAttempts: 1,
          executionTimeMs,
        },
      };
    } catch (error) {
      console.error("Connection check error:", error);
      return {
        success: false,
        error,
        debugInfo: {
          unexpectedError: true,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },

  /**
   * Setup the SQL execution function in the database
   * @returns Result object with success status and error (if any)
   */
  setupExecSqlFunction: async (): Promise<{
    success: boolean;
    error?: any;
    debugInfo?: any;
  }> => {
    try {
      const startTime = new Date();
      const functionSql = `
        CREATE OR REPLACE FUNCTION exec_sql(sql_text TEXT)
        RETURNS JSONB
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        DECLARE
          result JSONB;
        BEGIN
          EXECUTE sql_text;
          result := json_build_object('success', true)::JSONB;
          RETURN result;
        EXCEPTION WHEN OTHERS THEN
          result := json_build_object(
            'success', false,
            'error', json_build_object(
              'message', SQLERRM,
              'detail', SQLSTATE
            )
          )::JSONB;
          RETURN result;
        END;
        $$;

        -- Add function comment
        COMMENT ON FUNCTION exec_sql(TEXT) IS 'Executes arbitrary SQL with proper error handling | ينفذ SQL عشوائي مع معالجة الأخطاء بشكل صحيح';
      `;

      // Execute the function creation SQL
      const { data, error } = await supabase.rpc("exec_sql", {
        sql_text: functionSql,
      });

      if (error) {
        return {
          success: false,
          error,
          debugInfo: {
            timestamp: new Date().toISOString(),
            functionSql: functionSql.substring(0, 100) + "...",
          },
        };
      }

      const endTime = new Date();
      const executionTimeMs = endTime.getTime() - startTime.getTime();

      return {
        success: true,
        debugInfo: {
          timestamp: new Date().toISOString(),
          executionTimeMs,
          lastSuccessTimestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Setup error:", error);
      return {
        success: false,
        error,
        debugInfo: {
          unexpectedError: true,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },

  /**
   * Check if the module_integrations table has the required columns
   * @returns Object with status of required columns
   */
  checkModuleIntegrationsTable: async (): Promise<{
    hasCreatedAt: boolean;
    hasUpdatedAt: boolean;
  }> => {
    try {
      const { data, error } = await supabase.rpc("pg_query", {
        query:
          "SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'module_integrations'",
      });

      if (error) {
        console.error("Error checking module_integrations table:", error);
        return { hasCreatedAt: false, hasUpdatedAt: false };
      }

      const columns = data?.map((col) => col.column_name) || [];
      return {
        hasCreatedAt: columns.includes("created_at"),
        hasUpdatedAt: columns.includes("updated_at"),
      };
    } catch (error) {
      console.error("Unexpected error checking table:", error);
      return { hasCreatedAt: false, hasUpdatedAt: false };
    }
  },

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
      const { data: tableExists, error: tableCheckError } = await supabase.rpc(
        "pg_query",
        {
          query:
            "SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'migration_logs' LIMIT 1",
        },
      );

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
        sql_preview TEXT,
        sql_hash TEXT,
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
      COMMENT ON COLUMN migration_logs.sql_preview IS 'Preview of SQL content for display | معاينة محتوى SQL للعرض';
      COMMENT ON COLUMN migration_logs.sql_hash IS 'Hash of SQL content for deduplication | تجزئة محتوى SQL لإزالة التكرار';
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
      // First try to use the sql-executor edge function
      try {
        console.log(
          "Attempting to create migration_logs table via sql-executor...",
        );
        const { data, error } = await supabase.functions.invoke(
          "sql-executor",
          {
            body: {
              sql: createTableSql,
              operation_id: `create-migration-logs-${Date.now()}`,
            },
          },
        );

        if (!error) {
          console.log(
            "Successfully created migration_logs table via sql-executor",
          );
          return { success: true };
        }
        console.warn(
          "sql-executor failed, falling back to runCustomSql:",
          error,
        );
      } catch (sqlExecutorError) {
        console.warn(
          "sql-executor not available, falling back to runCustomSql:",
          sqlExecutorError,
        );
      }

      // Then try to use the regular edge function
      try {
        const result = await migrationsApi.runCustomSql(createTableSql);
        return result;
      } catch (edgeFunctionError) {
        console.warn(
          "Failed to create table using edge function, trying direct query:",
          edgeFunctionError,
        );

        // If edge function fails, try direct query
        const { error } = await supabase.rpc("exec_sql", {
          sql_text: createTableSql,
        });

        if (error) {
          throw error;
        }

        return { success: true };
      }
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
        return await applyModuleIntegrationsUpdate();
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

      // Execute the SQL using the utility function
      const result = await runSqlDirectly(sql, maxRetries);

      // Log the operation result
      await migrationsApi.safelyLogOperation(
        {
          operation_id: operationId,
          operation_type: "custom_sql",
          sql_content: sql,
          method_used: result.debugInfo?.finalMethod || "unknown",
        },
        startTime,
        result,
      );

      return result;
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
};

export { migrationsApi };
