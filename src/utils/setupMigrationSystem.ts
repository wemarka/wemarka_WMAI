import { supabase } from "@/lib/supabase";

/**
 * Sets up the migration system by creating necessary database functions
 * @returns Result of the setup operation
 */
export async function setupMigrationSystem() {
  try {
    console.log("Setting up migration system...");

    // Create the exec_sql function
    const createFunctionSql = `
      CREATE OR REPLACE FUNCTION exec_sql(sql_text text)
      RETURNS jsonb
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $function$
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
      $function$;
      
      -- Grant appropriate permissions
      GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;
      GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
      
      -- Add function description
      COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';
    `;

    // Create the migration_logs table if it doesn't exist
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

    // Try to execute the SQL directly using direct query first
    try {
      console.log("Attempting to create exec_sql function via direct query...");

      // Try direct SQL execution first
      const { error: directError } = await supabase.rpc("pg_query", {
        query: createFunctionSql,
      });

      if (!directError) {
        console.log("Successfully created exec_sql function via direct query");

        // Now create the migration_logs table directly
        const { error: tableError } = await supabase.rpc("pg_query", {
          query: createTableSql,
        });

        if (!tableError) {
          console.log(
            "Successfully created migration_logs table via direct query",
          );
          return { success: true };
        } else {
          console.warn(
            "Failed to create migration_logs table via direct query, trying edge function...",
          );
        }
      } else {
        console.warn(
          "Failed to create exec_sql function via direct query, trying edge function...",
        );
      }

      // Fall back to edge function if direct query fails
      console.log(
        "Attempting to create exec_sql function via edge function...",
      );
      // Try the new sql-executor function first
      try {
        const { data: sqlExecutorData, error: sqlExecutorError } =
          await supabase.functions.invoke("sql-executor", {
            body: { sql: createFunctionSql },
          });

        if (!sqlExecutorError) {
          console.log(
            "Successfully created exec_sql function via sql-executor function",
          );
          return { success: true };
        }
        console.warn(
          "sql-executor function failed, trying execute-sql:",
          sqlExecutorError,
        );
      } catch (sqlExecutorError) {
        console.warn(
          "sql-executor function not available, trying execute-sql:",
          sqlExecutorError,
        );
      }

      // Fall back to execute-sql function
      const { data, error } = await supabase.functions.invoke("execute-sql", {
        body: { sql: createFunctionSql },
      });

      if (error) {
        console.warn(
          "Edge function error, falling back to direct method:",
          error,
        );
        throw error; // Fall back to direct method
      }

      console.log("Successfully created exec_sql function via edge function");
      return { success: true };
    } catch (edgeFunctionError) {
      console.log(
        "Falling back to direct method for creating exec_sql function",
      );

      // If edge function fails, try direct method
      const { error: functionError } = await supabase.rpc("exec_sql", {
        sql_text: createFunctionSql,
      });
      if (functionError) {
        // If exec_sql doesn't exist yet, try direct SQL execution
        const { error: directError } = await supabase.rpc("pg_query", {
          query: createFunctionSql,
        });
        if (directError) {
          console.error("Failed to create exec_sql function:", directError);
          return { success: false, error: directError };
        }
      }

      // Now create the migration_logs table
      try {
        console.log("Creating migration_logs table...");
        // Try the new sql-executor function first
        try {
          const { data: sqlExecutorData, error: sqlExecutorError } =
            await supabase.functions.invoke("sql-executor", {
              body: { sql: createTableSql },
            });

          if (!sqlExecutorError) {
            console.log(
              "Successfully created migration_logs table via sql-executor function",
            );
            return { success: true };
          }
          console.warn(
            "sql-executor function failed for table creation, trying execute-sql:",
            sqlExecutorError,
          );
        } catch (sqlExecutorError) {
          console.warn(
            "sql-executor function not available for table creation, trying execute-sql:",
            sqlExecutorError,
          );
        }

        // Fall back to execute-sql function
        const { data, error } = await supabase.functions.invoke("execute-sql", {
          body: { sql: createTableSql },
        });

        if (error) {
          console.warn(
            "Edge function error for table creation, falling back to direct method:",
            error,
          );
          throw error; // Fall back to direct method
        }

        console.log(
          "Successfully created migration_logs table via edge function",
        );
        return { success: true };
      } catch (edgeFunctionError) {
        console.log(
          "Falling back to direct method for creating migration_logs table",
        );

        // If edge function fails, try direct method
        const { error: tableError } = await supabase.rpc("exec_sql", {
          sql_text: createTableSql,
        });
        if (tableError) {
          console.error("Failed to create migration_logs table:", tableError);
          return { success: false, error: tableError };
        }
      }

      console.log("Migration system setup completed successfully");
      return { success: true };
    }
  } catch (error) {
    console.error("Error setting up migration system:", error);
    return { success: false, error };
  }
}
