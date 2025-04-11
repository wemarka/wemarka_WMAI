import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface GitHubRequest {
  owner: string;
  repo: string;
  path: string;
  branch?: string;
  action: "list" | "get";
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      owner,
      repo,
      path,
      branch = "main",
      action,
    } = (await req.json()) as GitHubRequest;

    if (!owner || !repo || !path || !action) {
      return new Response(
        JSON.stringify({
          error:
            "Missing required parameters: owner, repo, path, and action are required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Get GitHub token from environment
    const githubToken = Deno.env.get("GITHUB_TOKEN");
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Supabase Edge Function",
    };

    // Add authorization header if token is available
    if (githubToken) {
      headers["Authorization"] = `Bearer ${githubToken}`;
    }

    // GitHub API URL
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;

    console.log(`Fetching from GitHub API: ${apiUrl}`);

    const response = await fetch(apiUrl, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error: `GitHub API request failed with status ${response.status}`,
          details: errorText,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status,
        },
      );
    }

    const data = await response.json();

    // Handle different actions
    if (action === "list") {
      // For directory listing
      if (!Array.isArray(data)) {
        return new Response(
          JSON.stringify({
            error: "Path is not a directory",
            item: data,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }

      return new Response(
        JSON.stringify({
          files: data.map((item: any) => ({
            name: item.name,
            path: item.path,
            type: item.type,
            size: item.size,
            sha: item.sha,
            url: item.html_url,
            download_url: item.download_url,
          })),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    } else if (action === "get") {
      // For file content
      if (Array.isArray(data)) {
        return new Response(
          JSON.stringify({
            error: "Path is a directory, not a file",
            items: data.length,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          },
        );
      }

      let content = "";
      if (data.content) {
        // GitHub API returns base64 encoded content
        content = atob(data.content.replace(/\n/g, ""));
      }

      return new Response(
        JSON.stringify({
          content,
          metadata: {
            name: data.name,
            path: data.path,
            sha: data.sha,
            size: data.size,
            url: data.html_url,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    } else {
      return new Response(
        JSON.stringify({
          error: `Invalid action: ${action}. Must be 'list' or 'get'`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }
  } catch (error) {
    console.error("Error in github-file-fetch function:", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
