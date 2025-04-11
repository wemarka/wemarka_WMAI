import { Octokit } from "@octokit/rest";

/**
 * GitHub service for interacting with repositories
 */
export class GitHubService {
  private octokit: Octokit;

  /**
   * Create a new GitHubService instance
   * @param token GitHub personal access token
   */
  constructor(token: string) {
    this.octokit = new Octokit({ auth: token });
  }

  /**
   * Get repository information
   * @param owner Repository owner
   * @param repo Repository name
   */
  async getRepoInfo(owner: string, repo: string) {
    try {
      const { data } = await this.octokit.repos.get({
        owner,
        repo,
      });
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching repository information:", error);
      return { data: null, error };
    }
  }

  /**
   * Get file content from a repository
   * @param owner Repository owner
   * @param repo Repository name
   * @param path File path
   * @param ref Branch or commit reference (default: main)
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref: string = "main",
  ) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      // Handle single file response
      if (!Array.isArray(data) && data.type === "file") {
        // The content is base64 encoded
        const content = data.content;
        const encoding = data.encoding;

        if (encoding === "base64") {
          const decodedContent = Buffer.from(content, "base64").toString(
            "utf-8",
          );
          return { content: decodedContent, error: null, metadata: data };
        }

        return { content, error: null, metadata: data };
      }

      return { content: null, error: "Not a file", metadata: data };
    } catch (error) {
      console.error("Error fetching file content:", error);
      return { content: null, error, metadata: null };
    }
  }

  /**
   * List files in a directory
   * @param owner Repository owner
   * @param repo Repository name
   * @param path Directory path
   * @param ref Branch or commit reference (default: main)
   */
  async listFiles(
    owner: string,
    repo: string,
    path: string,
    ref: string = "main",
  ) {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path,
        ref,
      });

      // Handle directory response
      if (Array.isArray(data)) {
        return { files: data, error: null };
      }

      return { files: [], error: "Not a directory" };
    } catch (error) {
      console.error("Error listing files:", error);
      return { files: [], error };
    }
  }

  /**
   * List migration files in a repository
   * @param owner Repository owner
   * @param repo Repository name
   * @param path Directory path (default: supabase/migrations)
   * @param ref Branch or commit reference (default: main)
   */
  async listMigrationFiles(
    owner: string,
    repo: string,
    path: string = "supabase/migrations",
    ref: string = "main",
  ) {
    try {
      const { files, error } = await this.listFiles(owner, repo, path, ref);

      if (error) {
        return { files: [], error };
      }

      // Filter for SQL files and sort by name
      const sqlFiles = files
        .filter((file: any) => file.name.endsWith(".sql"))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      return { files: sqlFiles, error: null };
    } catch (error) {
      console.error("Error listing migration files:", error);
      return { files: [], error };
    }
  }

  /**
   * Create a new file in a repository
   * @param owner Repository owner
   * @param repo Repository name
   * @param path File path
   * @param content File content
   * @param message Commit message
   * @param branch Branch name (default: main)
   */
  async createFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string = "main",
  ) {
    try {
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        branch,
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error creating file:", error);
      return { data: null, error };
    }
  }

  /**
   * Update an existing file in a repository
   * @param owner Repository owner
   * @param repo Repository name
   * @param path File path
   * @param content New file content
   * @param message Commit message
   * @param sha Current file SHA
   * @param branch Branch name (default: main)
   */
  async updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha: string,
    branch: string = "main",
  ) {
    try {
      const { data } = await this.octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        sha,
        branch,
      });

      return { data, error: null };
    } catch (error) {
      console.error("Error updating file:", error);
      return { data: null, error };
    }
  }

  /**
   * Create a new migration file in a repository
   * @param owner Repository owner
   * @param repo Repository name
   * @param content SQL content
   * @param description Migration description
   * @param branch Branch name (default: main)
   */
  async createMigrationFile(
    owner: string,
    repo: string,
    content: string,
    description: string,
    branch: string = "main",
  ) {
    try {
      // Generate a timestamp-based filename
      const timestamp = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, "")
        .substring(0, 14);
      const safeName = description
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .substring(0, 50);
      const filename = `${timestamp}_${safeName}.sql`;
      const path = `supabase/migrations/${filename}`;

      // Create the file
      const { data, error } = await this.createFile(
        owner,
        repo,
        path,
        content,
        `Add migration: ${description}`,
        branch,
      );

      if (error) {
        return { data: null, error, path: null };
      }

      return { data, error: null, path };
    } catch (error) {
      console.error("Error creating migration file:", error);
      return { data: null, error, path: null };
    }
  }
}

/**
 * Create a GitHub service instance using the token from environment variables
 */
export const createGitHubService = () => {
  const token = import.meta.env.VITE_GITHUB_TOKEN || "";
  if (!token) {
    console.warn("GitHub token not found in environment variables");
  }
  return new GitHubService(token);
};
