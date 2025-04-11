import { supabase } from "@/lib/supabase";
import fs from "fs";
import path from "path";

/**
 * Utility function to run SQL migrations using the Supabase client
 * @param sqlFilePath Path to the SQL file to execute
 */
export async function runMigration(
  sqlFilePath: string,
): Promise<{ success: boolean; error?: any }> {
  try {
    // Check if the file exists
    if (!fs.existsSync(sqlFilePath)) {
      console.error(`Migration file not found: ${sqlFilePath}`);
      return {
        success: false,
        error: `Migration file not found: ${sqlFilePath}`,
      };
    }

    // Read the SQL file content
    const sqlContent = fs.readFileSync(sqlFilePath, "utf8");

    if (!sqlContent) {
      console.error(`Migration file is empty: ${sqlFilePath}`);
      return {
        success: false,
        error: `Migration file is empty: ${sqlFilePath}`,
      };
    }

    console.log(`Executing migration from ${sqlFilePath}...`);

    // Execute the SQL using the Supabase client
    const { error } = await supabase.rpc("exec_sql", { sql: sqlContent });

    if (error) {
      console.error(`Migration failed: ${error.message}`);
      return { success: false, error };
    }

    console.log(`Migration successful: ${sqlFilePath}`);
    return { success: true };
  } catch (error) {
    console.error(`Migration failed with exception:`, error);
    return { success: false, error };
  }
}

/**
 * Run a migration from the command line
 * Usage: node -r esbuild-register src/utils/runMigration.ts <path-to-sql-file>
 */
if (require.main === module) {
  const sqlFilePath = process.argv[2];
  if (!sqlFilePath) {
    console.error("Please provide a path to the SQL file");
    process.exit(1);
  }

  runMigration(sqlFilePath)
    .then(({ success, error }) => {
      if (success) {
        console.log("Migration completed successfully");
        process.exit(0);
      } else {
        console.error("Migration failed:", error);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error("Unexpected error:", error);
      process.exit(1);
    });
}
