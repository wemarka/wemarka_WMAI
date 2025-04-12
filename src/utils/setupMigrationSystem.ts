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
      GRANT EXECUTE ON FUNCTION exec_sql(text) TO anon;
      
      -- Add function description
      COMMENT ON FUNCTION exec_sql(text) IS 'Executes arbitrary SQL with security definer privileges | تنفيذ استعلامات SQL مع امتيازات أمان محددة';
      
      -- Create pg_query function if it doesn't exist
      CREATE OR REPLACE FUNCTION pg_query(query TEXT)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $
      DECLARE
        result JSONB;
      BEGIN
        EXECUTE query INTO result;
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        -- If the query doesn't return JSON, try to execute it without capturing results
        BEGIN
          EXECUTE query;
          RETURN json_build_object('success', true)::JSONB;
        EXCEPTION WHEN OTHERS THEN
          RETURN json_build_object(
            'success', false,
            'error', json_build_object(
              'message', SQLERRM,
              'detail', SQLSTATE
            )
          )::JSONB;
        END;
      END;
      $;
      
      -- Grant appropriate permissions
      GRANT EXECUTE ON FUNCTION pg_query(text) TO service_role;
      GRANT EXECUTE ON FUNCTION pg_query(text) TO authenticated;
      GRANT EXECUTE ON FUNCTION pg_query(text) TO anon;
      
      -- Add function description
      COMMENT ON FUNCTION pg_query(text) IS 'Executes arbitrary SQL with proper error handling and returns results as JSONB | ينفذ SQL عشوائي مع معالجة الأخطاء بشكل صحيح ويعيد النتائج كـ JSONB';
      
      -- Grant permissions for information schema access
      GRANT USAGE ON SCHEMA information_schema TO authenticated;
      GRANT USAGE ON SCHEMA information_schema TO anon;
      GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO authenticated;
      GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO anon;
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
      DROP POLICY IF EXISTS "Allow select for anonymous users" ON migration_logs;
      
      -- Create policy to allow all operations for authenticated users
      CREATE POLICY "Allow all operations for authenticated users"
        ON migration_logs
        FOR ALL
        TO authenticated
        USING (true);
        
      -- Create policy to allow select for anonymous users
      CREATE POLICY "Allow select for anonymous users"
        ON migration_logs
        FOR SELECT
        TO anon
        USING (true);
        
      -- Enable realtime for this table using the safer function
      DO $
      BEGIN
        -- Check if the publication exists
        IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
          -- Check if the table is already in the publication
          IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND schemaname = 'public' 
            AND tablename = 'migration_logs'
          ) THEN
            -- Add the table to the publication
            EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE migration_logs';
          END IF;
        END IF;
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error adding migration_logs to realtime publication: %', SQLERRM;
      END;
      $;
    `;

    // Create utility functions for the migration system
    const createUtilitiesSql = `
      -- Create utility functions for the migration system if they don't exist
      DO $
      BEGIN
        -- Check if the functions already exist
        IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'is_table_in_publication' AND pronamespace = 'public'::regnamespace) THEN
          -- Function to check if a table is already in a publication
          CREATE FUNCTION is_table_in_publication(publication_name text, table_name text)
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $func$
          DECLARE
            table_exists boolean;
            publication_exists boolean;
            is_in_publication boolean;
          BEGIN
            -- Check if the table exists
            SELECT EXISTS (
              SELECT 1 FROM pg_tables 
              WHERE schemaname = 'public' AND tablename = table_name
            ) INTO table_exists;
            
            IF NOT table_exists THEN
              RAISE NOTICE 'Table % does not exist', table_name;
              RETURN false;
            END IF;
            
            -- Check if the publication exists
            SELECT EXISTS (
              SELECT 1 FROM pg_publication 
              WHERE pubname = publication_name
            ) INTO publication_exists;
            
            IF NOT publication_exists THEN
              RAISE NOTICE 'Publication % does not exist', publication_name;
              RETURN false;
            END IF;
            
            -- Check if the table is in the publication
            SELECT EXISTS (
              SELECT 1 FROM pg_publication_tables 
              WHERE pubname = publication_name 
              AND schemaname = 'public' 
              AND tablename = table_name
            ) INTO is_in_publication;
            
            RETURN is_in_publication;
          END;
          $func$;

          -- Grant appropriate permissions
          GRANT EXECUTE ON FUNCTION is_table_in_publication(text, text) TO service_role;
          GRANT EXECUTE ON FUNCTION is_table_in_publication(text, text) TO authenticated;
          GRANT EXECUTE ON FUNCTION is_table_in_publication(text, text) TO anon;

          -- Add function description
          COMMENT ON FUNCTION is_table_in_publication(text, text) IS 'Safely checks if a table is already in a publication | يتحقق بأمان مما إذا كان الجدول موجودًا بالفعل في منشور';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_table_to_publication' AND pronamespace = 'public'::regnamespace) THEN
          -- Function to safely add a table to a publication
          CREATE FUNCTION add_table_to_publication(publication_name text, table_name text)
          RETURNS boolean
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $func$
          DECLARE
            table_exists boolean;
            publication_exists boolean;
            is_in_publication boolean;
          BEGIN
            -- Check if the table exists
            SELECT EXISTS (
              SELECT 1 FROM pg_tables 
              WHERE schemaname = 'public' AND tablename = table_name
            ) INTO table_exists;
            
            IF NOT table_exists THEN
              RAISE NOTICE 'Table % does not exist', table_name;
              RETURN false;
            END IF;
            
            -- Check if the publication exists
            SELECT EXISTS (
              SELECT 1 FROM pg_publication 
              WHERE pubname = publication_name
            ) INTO publication_exists;
            
            IF NOT publication_exists THEN
              RAISE NOTICE 'Publication % does not exist', publication_name;
              RETURN false;
            END IF;
            
            -- Check if the table is already in the publication
            SELECT EXISTS (
              SELECT 1 FROM pg_publication_tables 
              WHERE pubname = publication_name 
              AND schemaname = 'public' 
              AND tablename = table_name
            ) INTO is_in_publication;
            
            IF is_in_publication THEN
              RAISE NOTICE 'Table % is already in publication %', table_name, publication_name;
              RETURN true;
            END IF;
            
            -- Add the table to the publication
            EXECUTE format('ALTER PUBLICATION %I ADD TABLE %I.%I', 
                          publication_name, 'public', table_name);
            
            RAISE NOTICE 'Added table % to publication %', table_name, publication_name;
            RETURN true;
          EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error adding table % to publication %: %', 
                        table_name, publication_name, SQLERRM;
            RETURN false;
          END;
          $func$;

          -- Grant appropriate permissions
          GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO service_role;
          GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO authenticated;
          GRANT EXECUTE ON FUNCTION add_table_to_publication(text, text) TO anon;

          -- Add function description
          COMMENT ON FUNCTION add_table_to_publication(text, text) IS 'Safely adds a table to a publication with proper error handling | يضيف بأمان جدولًا إلى منشور مع معالجة الأخطاء بشكل صحيح';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_migration_system_status' AND pronamespace = 'public'::regnamespace) THEN
          -- Create a function to check migration system status
          CREATE FUNCTION check_migration_system_status()
          RETURNS jsonb
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $func$
          DECLARE
            result jsonb;
            pg_query_exists boolean;
            exec_sql_exists boolean;
            migration_logs_exists boolean;
            utility_functions_exist boolean;
            realtime_enabled boolean;
            rls_enabled boolean;
            policies_exist boolean;
          BEGIN
            -- Check if pg_query function exists
            SELECT EXISTS (
              SELECT 1 FROM pg_proc 
              WHERE proname = 'pg_query' AND pronamespace = 'public'::regnamespace
            ) INTO pg_query_exists;
            
            -- Check if exec_sql function exists
            SELECT EXISTS (
              SELECT 1 FROM pg_proc 
              WHERE proname = 'exec_sql' AND pronamespace = 'public'::regnamespace
            ) INTO exec_sql_exists;
            
            -- Check if migration_logs table exists
            SELECT EXISTS (
              SELECT 1 FROM pg_tables 
              WHERE schemaname = 'public' AND tablename = 'migration_logs'
            ) INTO migration_logs_exists;
            
            -- Check if utility functions exist
            SELECT EXISTS (
              SELECT 1 FROM pg_proc 
              WHERE proname = 'is_table_in_publication' AND pronamespace = 'public'::regnamespace
            ) AND EXISTS (
              SELECT 1 FROM pg_proc 
              WHERE proname = 'add_table_to_publication' AND pronamespace = 'public'::regnamespace
            ) INTO utility_functions_exist;
            
            -- Check if realtime is enabled for migration_logs
            IF migration_logs_exists THEN
              SELECT EXISTS (
                SELECT 1 FROM pg_publication_tables 
                WHERE pubname = 'supabase_realtime' 
                AND schemaname = 'public' 
                AND tablename = 'migration_logs'
              ) INTO realtime_enabled;
            ELSE
              realtime_enabled := false;
            END IF;
            
            -- Check if RLS is enabled for migration_logs
            IF migration_logs_exists THEN
              SELECT relrowsecurity FROM pg_class 
              WHERE relname = 'migration_logs' AND relnamespace = 'public'::regnamespace 
              INTO rls_enabled;
            ELSE
              rls_enabled := false;
            END IF;
            
            -- Check if policies exist for migration_logs
            IF migration_logs_exists THEN
              SELECT EXISTS (
                SELECT 1 FROM pg_policy 
                WHERE polrelid = 'public.migration_logs'::regclass
              ) INTO policies_exist;
            ELSE
              policies_exist := false;
            END IF;
            
            -- Build result JSON
            result := jsonb_build_object(
              'timestamp', now(),
              'status', CASE 
                WHEN pg_query_exists AND exec_sql_exists AND migration_logs_exists AND utility_functions_exist 
                THEN 'complete' 
                ELSE 'incomplete' 
              END,
              'components', jsonb_build_object(
                'pg_query_function', pg_query_exists,
                'exec_sql_function', exec_sql_exists,
                'migration_logs_table', migration_logs_exists,
                'utility_functions', utility_functions_exist,
                'realtime_enabled', realtime_enabled,
                'rls_enabled', rls_enabled,
                'policies_exist', policies_exist
              ),
              'missing_components', (
                SELECT jsonb_agg(component) FROM (
                  SELECT 'pg_query_function' as component WHERE NOT pg_query_exists
                  UNION ALL
                  SELECT 'exec_sql_function' as component WHERE NOT exec_sql_exists
                  UNION ALL
                  SELECT 'migration_logs_table' as component WHERE NOT migration_logs_exists
                  UNION ALL
                  SELECT 'utility_functions' as component WHERE NOT utility_functions_exist
                  UNION ALL
                  SELECT 'realtime_enabled' as component WHERE migration_logs_exists AND NOT realtime_enabled
                  UNION ALL
                  SELECT 'rls_enabled' as component WHERE migration_logs_exists AND NOT rls_enabled
                  UNION ALL
                  SELECT 'policies_exist' as component WHERE migration_logs_exists AND NOT policies_exist
                ) as missing
              )
            );
            
            RETURN result;
          END;
          $func$;

          -- Grant appropriate permissions
          GRANT EXECUTE ON FUNCTION check_migration_system_status() TO service_role;
          GRANT EXECUTE ON FUNCTION check_migration_system_status() TO authenticated;
          GRANT EXECUTE ON FUNCTION check_migration_system_status() TO anon;

          -- Add function description
          COMMENT ON FUNCTION check_migration_system_status() IS 'Checks the status of the migration system components | يتحقق من حالة مكونات نظام الترحيل';
        END IF;
      END;
      $;
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

          // Create utility functions
          const { error: utilitiesError } = await supabase.rpc("pg_query", {
            query: createUtilitiesSql,
          });

          if (!utilitiesError) {
            console.log(
              "Successfully created utility functions via direct query",
            );
            return { success: true };
          } else {
            console.warn(
              "Failed to create utility functions via direct query, trying edge function...",
              utilitiesError,
            );
          }
        } else {
          console.warn(
            "Failed to create migration_logs table via direct query, trying edge function...",
            tableError,
          );
        }
      } else {
        console.warn(
          "Failed to create exec_sql function via direct query, trying edge function...",
          directError,
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

          // Now create the migration_logs table
          const { data: tableData, error: tableError } =
            await supabase.functions.invoke("sql-executor", {
              body: { sql: createTableSql },
            });

          if (!tableError) {
            console.log(
              "Successfully created migration_logs table via sql-executor function",
            );

            // Create utility functions
            const { data: utilitiesData, error: utilitiesError } =
              await supabase.functions.invoke("sql-executor", {
                body: { sql: createUtilitiesSql },
              });

            if (!utilitiesError) {
              console.log(
                "Successfully created utility functions via sql-executor function",
              );
              return { success: true };
            } else {
              console.warn(
                "Failed to create utility functions via sql-executor function, trying execute-sql",
                utilitiesError,
              );
            }
          } else {
            console.warn(
              "Failed to create migration_logs table via sql-executor function, trying execute-sql",
              tableError,
            );
          }
        } else {
          console.warn(
            "sql-executor function failed, trying execute-sql:",
            sqlExecutorError,
          );
        }
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

      // Now create the migration_logs table
      const { data: tableData, error: tableError } =
        await supabase.functions.invoke("execute-sql", {
          body: { sql: createTableSql },
        });

      if (tableError) {
        console.warn(
          "Edge function error for table creation, falling back to direct method:",
          tableError,
        );
        throw tableError;
      }

      console.log(
        "Successfully created migration_logs table via edge function",
      );

      // Create utility functions
      const { data: utilitiesData, error: utilitiesError } =
        await supabase.functions.invoke("execute-sql", {
          body: { sql: createUtilitiesSql },
        });

      if (utilitiesError) {
        console.warn(
          "Edge function error for utilities creation, falling back to direct method:",
          utilitiesError,
        );
        throw utilitiesError;
      }

      console.log("Successfully created utility functions via edge function");
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
      const { error: tableError } = await supabase.rpc("exec_sql", {
        sql_text: createTableSql,
      });
      if (tableError) {
        console.error("Failed to create migration_logs table:", tableError);
        return { success: false, error: tableError };
      }

      // Create utility functions
      const { error: utilitiesError } = await supabase.rpc("exec_sql", {
        sql_text: createUtilitiesSql,
      });
      if (utilitiesError) {
        console.error("Failed to create utility functions:", utilitiesError);
        return { success: false, error: utilitiesError };
      }

      console.log("Migration system setup completed successfully");
      return { success: true };
    }
  } catch (error) {
    console.error("Error setting up migration system:", error);
    return { success: false, error };
  }
}

/**
 * Checks the status of the migration system
 * @returns Status of the migration system components
 */
export async function checkMigrationSystemStatus() {
  try {
    console.log("Checking migration system status...");

    // Try to call the check_migration_system_status function
    try {
      const { data, error } = await supabase.rpc(
        "check_migration_system_status",
      );

      if (!error && data) {
        console.log(
          "Successfully checked migration system status via function",
        );
        return { success: true, status: data };
      }

      console.warn(
        "Failed to check migration system status via function, falling back to manual check",
        error,
      );
    } catch (functionError) {
      console.warn(
        "Error calling check_migration_system_status function, falling back to manual check",
        functionError,
      );
    }

    // Manual check if the function doesn't exist or fails
    const pgQueryCheck = await supabase.rpc("pg_query", {
      query: "SELECT 1 as test",
    });

    const execSqlCheck = await supabase.rpc("exec_sql", {
      sql_text: "SELECT 1 as test",
    });

    const migrationLogsCheck = await supabase
      .from("migration_logs")
      .select("count")
      .limit(1);

    const status = {
      timestamp: new Date().toISOString(),
      status:
        pgQueryCheck.error || execSqlCheck.error || migrationLogsCheck.error
          ? "incomplete"
          : "complete",
      components: {
        pg_query_function: !pgQueryCheck.error,
        exec_sql_function: !execSqlCheck.error,
        migration_logs_table: !migrationLogsCheck.error,
        utility_functions: null, // Cannot easily check this manually
        realtime_enabled: null, // Cannot easily check this manually
        rls_enabled: null, // Cannot easily check this manually
        policies_exist: null, // Cannot easily check this manually
      },
      missing_components: [],
    };

    // Build missing components array
    const missingComponents = [];
    if (pgQueryCheck.error) missingComponents.push("pg_query_function");
    if (execSqlCheck.error) missingComponents.push("exec_sql_function");
    if (migrationLogsCheck.error)
      missingComponents.push("migration_logs_table");

    status.missing_components = missingComponents;

    return { success: true, status };
  } catch (error) {
    console.error("Error checking migration system status:", error);
    return { success: false, error };
  }
}
