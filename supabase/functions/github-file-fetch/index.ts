// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/setup_your_environment

interface GitHubFileRequest {
  repo: string;
  filePath: string;
}

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const { repo, filePath } = (await req.json()) as GitHubFileRequest;

    // GitHub API requires a token for private repos, but for public repos we can make unauthenticated requests
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/${filePath}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Add GitHub token if available
          // 'Authorization': `Bearer ${Deno.env.get('GITHUB_TOKEN')}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed with status ${response.status}`,
      );
    }

    const data = await response.json();
    let content = "";

    if (data.content) {
      // GitHub API returns base64 encoded content
      content = atob(data.content.replace(/\n/g, ""));
    }

    return new Response(JSON.stringify({ content }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});
