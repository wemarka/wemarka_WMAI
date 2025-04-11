// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/setup_your_environment

interface RoadmapRequest {
  projectData: any;
  context?: string;
}

interface RoadmapPhase {
  name: string;
  description: string;
  duration: string;
  tasks: string[];
  priority: "high" | "medium" | "low";
  dependencies?: string[];
}

interface RoadmapResponse {
  phases: RoadmapPhase[];
  summary: string;
  generatedDate: string;
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
    const { projectData, context } = (await req.json()) as RoadmapRequest;

    // Prepare the prompt for OpenAI
    let prompt =
      "Generate a development roadmap for the following project:\n\n";

    // Add project data to the prompt
    if (projectData) {
      prompt += `Project Data: ${JSON.stringify(projectData, null, 2)}\n\n`;
    }

    // Add context if provided
    if (context) {
      prompt += `Additional Context: ${context}\n\n`;
    }

    // Add specific instructions for the response format
    prompt += `Please provide your roadmap in the following JSON format:
{
  "phases": [
    {
      "name": "Phase name",
      "description": "Phase description",
      "duration": "Duration in weeks",
      "tasks": ["Task 1", "Task 2", ...],
      "priority": "high|medium|low",
      "dependencies": ["Phase name that must be completed before this one", ...]
    }
  ],
  "summary": "Overall summary of the roadmap"
}`;

    // Call OpenAI API
    const openAIResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      },
    );

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API returned ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    const aiResponse = data?.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response content from OpenAI");
    }

    // Parse the JSON response from OpenAI
    let parsedResponse;
    try {
      // Extract JSON from the response (in case it includes markdown formatting)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/m);
      const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      throw new Error("Failed to parse AI response");
    }

    // Format the response
    const result: RoadmapResponse = {
      phases: parsedResponse.phases || [],
      summary: parsedResponse.summary || "Roadmap generated successfully.",
      generatedDate: new Date().toISOString(),
    };

    return new Response(JSON.stringify(result), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  } catch (error) {
    // If OpenAI fails, return a fallback roadmap
    const fallbackRoadmap: RoadmapResponse = {
      phases: [
        {
          name: "Phase 1: Core Infrastructure",
          description:
            "Focus on building the core infrastructure and essential features",
          duration: "4 weeks",
          tasks: [
            "Complete Store & Ecommerce System",
            "Develop Accounting Reports",
            "Complete Unified Inbox System",
          ],
          priority: "high",
        },
        {
          name: "Phase 2: AI Enhancement",
          description: "Enhance AI integration across all modules",
          duration: "6 weeks",
          tasks: [
            "Improve AI recommendation accuracy",
            "Expand automatic content creation capabilities",
            "Develop code analysis algorithms",
            "Add predictive analytics",
          ],
          priority: "high",
          dependencies: ["Phase 1: Core Infrastructure"],
        },
        {
          name: "Phase 3: Performance & Security",
          description: "Optimize performance and enhance security",
          duration: "4 weeks",
          tasks: [
            "Implement code splitting for better performance",
            "Optimize database queries",
            "Add multi-factor authentication",
            "Implement Content Security Policy",
          ],
          priority: "medium",
          dependencies: ["Phase 1: Core Infrastructure"],
        },
        {
          name: "Phase 4: Internationalization",
          description:
            "Improve support for RTL languages and add new languages",
          duration: "3 weeks",
          tasks: [
            "Enhance Arabic language support",
            "Improve RTL user interfaces",
            "Add new languages",
            "Optimize RTL performance",
          ],
          priority: "medium",
          dependencies: ["Phase 3: Performance & Security"],
        },
        {
          name: "Phase 5: Testing & Documentation",
          description: "Increase test coverage and improve documentation",
          duration: "6 weeks",
          tasks: [
            "Increase unit test coverage",
            "Add integration and end-to-end tests",
            "Improve API documentation",
            "Create comprehensive user guides",
            "Develop help center and documentation",
          ],
          priority: "medium",
          dependencies: [
            "Phase 2: AI Enhancement",
            "Phase 4: Internationalization",
          ],
        },
        {
          name: "Phase 6: Public API & Integrations",
          description: "Develop public API and expand integrations",
          duration: "8 weeks",
          tasks: [
            "Develop API for external systems",
            "Create developer testing environment",
            "Add custom dashboards for users",
            "Develop scheduled reporting system",
            "Enhance predictive analytics capabilities",
          ],
          priority: "low",
          dependencies: ["Phase 5: Testing & Documentation"],
        },
        {
          name: "Phase 7: Mobile & Ecosystem",
          description:
            "Develop mobile applications and ecosystem for external developers",
          duration: "12 weeks",
          tasks: [
            "Develop mobile applications",
            "Add advanced machine learning capabilities",
            "Expand integrations with external platforms",
            "Create marketplace for add-ons",
            "Develop partner program",
          ],
          priority: "low",
          dependencies: ["Phase 6: Public API & Integrations"],
        },
      ],
      summary:
        "This roadmap outlines the development plan for the Wemarka WMAI project, focusing on completing core modules, enhancing AI integration, improving performance and security, and expanding the system with mobile applications and an ecosystem for external developers.",
      generatedDate: new Date().toISOString(),
    };

    return new Response(JSON.stringify(fallbackRoadmap), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      status: 200,
    });
  }
});
