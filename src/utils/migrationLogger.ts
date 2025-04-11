import { supabase } from "@/lib/supabase";

/**
 * Interface for migration log entries
 */
export interface MigrationLogEntry {
  operation_id: string;
  operation_type: string;
  sql_content: string;
  sql_preview?: string;
  sql_hash?: string;
  status: "success" | "failed" | "error";
  method_used: string;
  execution_time_ms: number;
  details?: string;
  user_id?: string;
}

/**
 * Utility for logging migration operations
 */
export const migrationLogger = {
  /**
   * Log a migration operation to the migration_logs table
   * @param logEntry The log entry to insert
   */
  logMigrationOperation: async (logEntry: MigrationLogEntry): Promise<void> => {
    try {
      // Generate a SQL preview for display in the logs UI
      const sqlPreview = logEntry.sql_content
        ? logEntry.sql_content.length > 150
          ? `${logEntry.sql_content.substring(0, 150)}...`
          : logEntry.sql_content
        : "[Empty SQL]";

      // Generate a hash of the SQL content for potential deduplication
      const sqlHash = logEntry.sql_content
        ? logEntry.sql_content
            .split("")
            .reduce((a, b) => {
              a = (a << 5) - a + b.charCodeAt(0);
              return a & a;
            }, 0)
            .toString(16)
        : "empty";

      const { error } = await supabase.from("migration_logs").insert([
        {
          operation_id: logEntry.operation_id,
          operation_type: logEntry.operation_type,
          sql_content: logEntry.sql_content,
          sql_preview: sqlPreview,
          sql_hash: sqlHash,
          status: logEntry.status,
          method_used: logEntry.method_used,
          execution_time_ms: logEntry.execution_time_ms,
          details: logEntry.details,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Failed to log migration operation:", error);
      }
    } catch (error) {
      console.error("Exception logging migration operation:", error);
    }
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
    try {
      // Calculate execution time
      const executionTimeMs = Date.now() - startTime.getTime();

      // Prepare details JSON
      let details: any = {};

      if (result.debugInfo) {
        details = {
          ...details,
          finalMethod: result.debugInfo.finalMethod,
          totalAttempts: result.debugInfo.totalAttempts,
          methods: result.debugInfo.methods,
        };
      }

      if (result.error) {
        details.error =
          typeof result.error === "string"
            ? result.error
            : result.error.message || JSON.stringify(result.error);
      }

      // Log the operation
      await migrationLogger.logMigrationOperation({
        operation_id: operationData.operation_id,
        operation_type: operationData.operation_type,
        sql_content: operationData.sql_content,
        status: result.success ? "success" : "failed",
        method_used: operationData.method_used,
        execution_time_ms: executionTimeMs,
        details: JSON.stringify(details),
      });
    } catch (error) {
      // Just log to console but don't disrupt the main operation
      console.warn("Failed to log migration operation (non-critical):", error);
    }
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
      // This will be implemented to use the migrationsApi.runCustomSql method
      // but we need to avoid circular dependencies, so we'll return a placeholder for now
      return {
        success: false,
        error:
          "This method needs to be called from migrationsApi to avoid circular dependencies",
      };
    } catch (error) {
      console.error("Failed to create migration_logs table:", error);
      return {
        success: false,
        error,
      };
    }
  },
};
