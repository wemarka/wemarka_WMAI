// src/api/index.ts
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// AI API handler
export async function callOpenAI(prompt: string) {
  try {
    // First try to use the Supabase Edge Function for AI processing
    try {
      const { data, error } = await supabase.functions.invoke("code-analysis", {
        body: { prompt },
      });

      if (error) throw error;
      return data;
    } catch (edgeFunctionError) {
      console.warn(
        "Edge function error, falling back to direct API call:",
        edgeFunctionError,
      );

      // Fall back to direct API call if edge function fails
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    }
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    throw error;
  }
}

// GitHub API handler
export async function fetchGitHubFile(
  filePath: string,
  repo: string = "wemarka/wemarka_WMAI",
) {
  try {
    // Call the Supabase Edge Function for GitHub API access
    const { data, error } = await supabase.functions.invoke(
      "github-file-fetch",
      {
        body: { repo, filePath },
      },
    );

    if (error) {
      console.error("Supabase Edge Function error:", error);
      throw error;
    }

    if (!data || !data.content) {
      throw new Error(`No content returned for ${repo}/${filePath}`);
    }

    return data;
  } catch (error) {
    console.error(
      "Error fetching GitHub file via Supabase Edge Function:",
      error,
    );

    // Try direct GitHub API as fallback (for public repos only)
    try {
      const response = await fetch(
        `https://api.github.com/repos/${repo}/contents/${filePath}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API returned ${response.status}`);
      }

      const data = await response.json();

      if (!data.content) {
        throw new Error("No content in GitHub response");
      }

      // GitHub API returns base64 encoded content
      const content = atob(data.content.replace(/\n/g, ""));

      return { content };
    } catch (githubError) {
      console.error("Direct GitHub API fallback also failed:", githubError);
      throw error; // Throw the original error
    }
  }
}
