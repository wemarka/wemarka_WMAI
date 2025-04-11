import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export const githubApi = {
  /**
   * Fetches migration files from a GitHub repository
   * @param owner Repository owner (username or organization)
   * @param repo Repository name
   * @param path Path to migrations directory
   * @param branch Branch name
   * @returns List of migration files or error
   */
  fetchMigrationFiles: async (
    owner: string,
    repo: string,
    path: string,
    branch: string,
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "github-file-fetch",
        {
          body: { owner, repo, path, branch, action: "list" },
        },
      );

      if (error) {
        console.error("Error fetching migration files:", error);
        return { files: [], error };
      }

      // Filter for SQL files only
      const sqlFiles = data.files.filter((file: any) =>
        file.name.endsWith(".sql"),
      );

      return { files: sqlFiles, error: null };
    } catch (error: any) {
      console.error("Error in fetchMigrationFiles:", error);
      return { files: [], error };
    }
  },

  /**
   * Imports a specific migration file from GitHub
   * @param owner Repository owner
   * @param repo Repository name
   * @param filePath Path to the specific file
   * @param branch Branch name
   * @returns SQL content or error
   */
  importMigrationFile: async (
    owner: string,
    repo: string,
    filePath: string,
    branch: string,
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "github-file-fetch",
        {
          body: { owner, repo, path: filePath, branch, action: "get" },
        },
      );

      if (error) {
        console.error("Error importing migration file:", error);
        return { success: false, sql: null, error };
      }

      if (!data.content) {
        return {
          success: false,
          error: "File content is empty or could not be decoded",
        };
      }

      return { success: true, sql: data.content, error: null };
    } catch (error: any) {
      console.error("Error in importMigrationFile:", error);
      return { success: false, sql: null, error };
    }
  },
};
