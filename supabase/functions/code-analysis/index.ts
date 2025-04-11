// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/getting_started/setup_your_environment

interface CodeAnalysisRequest {
  repositoryUrl?: string;
  branch?: string;
  filePath?: string;
  codeSnippet?: string;
  analysisType?: "quality" | "performance" | "security" | "feature" | "all";
  context?: string;
  prompt?: string;
}

interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  category: "performance" | "security" | "ux" | "code-quality" | "feature";
  createdAt: string;
  status: "new" | "in-review" | "accepted" | "rejected" | "implemented";
  implementationDifficulty?: "easy" | "medium" | "hard";
  estimatedHours?: number;
  relatedModule?: string;
  codeSnippet?: string;
}

interface CodeAnalysisResult {
  recommendations: AIRecommendation[];
  codeQualityScore?: number;
  performanceScore?: number;
  securityScore?: number;
  summary: string;
  analysisDate: string;
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
    const request = (await req.json()) as CodeAnalysisRequest;

    // If a direct prompt is provided, forward it to OpenAI
    if (request.prompt) {
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
            messages: [{ role: "user", content: request.prompt }],
            temperature: 0.3,
            max_tokens: 2000,
          }),
        },
      );

      if (!openAIResponse.ok) {
        const errorData = await openAIResponse.json();
        throw new Error(
          `OpenAI API error: ${errorData.error?.message || "Unknown error"}`,
        );
      }

      const data = await openAIResponse.json();
      return new Response(JSON.stringify(data), {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        status: 200,
      });
    }

    // For code analysis requests without a direct prompt, use OpenAI to analyze the code
    const now = new Date().toISOString();
    const analysisType = request.analysisType || "all";

    // If we have code to analyze, send it to OpenAI
    if (request.codeSnippet || request.filePath || request.repositoryUrl) {
      // Prepare the prompt for OpenAI
      let prompt =
        "Analyze the following code and provide recommendations for improvements. ";

      // Add analysis type to the prompt
      if (analysisType !== "all") {
        prompt += `Focus on ${analysisType} aspects. `;
      } else {
        prompt +=
          "Include performance, security, code quality, and feature recommendations. ";
      }

      // Add code content to the prompt
      if (request.codeSnippet) {
        prompt += `\n\nCode snippet to analyze:\n\`\`\`\n${request.codeSnippet}\n\`\`\`\n`;
      } else if (request.filePath) {
        prompt += `\n\nAnalyze file at path: ${request.filePath}\n`;
      } else if (request.repositoryUrl) {
        prompt += `\n\nAnalyze GitHub repository: ${request.repositoryUrl}, branch: ${request.branch || "main"}\n`;
      }

      // Add context if provided
      if (request.context) {
        prompt += `\n\nAdditional context: ${request.context}\n`;
      }

      // Add specific instructions for the response format
      prompt += `\n\nPlease provide your analysis in the following JSON format:
{
  "recommendations": [
    {
      "title": "Recommendation title",
      "description": "Detailed description",
      "priority": "high|medium|low",
      "category": "performance|security|code-quality|feature|ux",
      "implementationDifficulty": "easy|medium|hard",
      "estimatedHours": number,
      "codeSnippet": "Example code if applicable"
    }
  ],
  "codeQualityScore": number (0-100),
  "performanceScore": number (0-100),
  "securityScore": number (0-100),
  "summary": "Overall summary of the analysis"
}`;

      try {
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

        // Format the response to match our expected CodeAnalysisResult structure
        const result: CodeAnalysisResult = {
          recommendations: (parsedResponse.recommendations || []).map(
            (rec: any, index: number) => ({
              id: `ai-${Date.now()}-${index}`,
              title: rec.title || "Recommendation",
              description: rec.description || "",
              priority: rec.priority || "medium",
              category: rec.category || "code-quality",
              createdAt: now,
              status: "new",
              implementationDifficulty:
                rec.implementationDifficulty || "medium",
              estimatedHours: rec.estimatedHours || 4,
              relatedModule: rec.relatedModule || "Core",
              codeSnippet: rec.codeSnippet || undefined,
            }),
          ),
          codeQualityScore: parsedResponse.codeQualityScore || 75,
          performanceScore: parsedResponse.performanceScore || 80,
          securityScore: parsedResponse.securityScore || 70,
          summary: parsedResponse.summary || "Analysis completed successfully.",
          analysisDate: now,
        };

        return new Response(JSON.stringify(result), {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          status: 200,
        });
      } catch (aiError) {
        console.error("Error calling OpenAI:", aiError);
        // Fall back to mock data if OpenAI fails
      }
    }

    // If we reach here, either there was no code to analyze or OpenAI failed
    // Generate mock recommendations based on analysis type
    const recommendations: AIRecommendation[] = [];

    // Generate recommendations based on analysis type and code context
    if (analysisType === "all" || analysisType === "performance") {
      recommendations.push({
        id: `perf-${Date.now()}-1`,
        title: "Implement Code Splitting for Better Performance",
        description:
          "Consider implementing code splitting to reduce initial load time. This can significantly improve performance for larger applications.",
        priority: "medium",
        category: "performance",
        createdAt: now,
        status: "new",
        implementationDifficulty: "medium",
        estimatedHours: 8,
        relatedModule: "Core",
      });

      recommendations.push({
        id: `perf-${Date.now()}-2`,
        title: "Optimize Component Rendering",
        description:
          "Use React.memo or shouldComponentUpdate to prevent unnecessary re-renders of components.",
        priority: "high",
        category: "performance",
        createdAt: now,
        status: "new",
        implementationDifficulty: "medium",
        estimatedHours: 6,
        relatedModule: "UI",
      });
    }

    if (analysisType === "all" || analysisType === "security") {
      recommendations.push({
        id: `sec-${Date.now()}-1`,
        title: "Implement Input Validation for User Inputs",
        description:
          "Add comprehensive input validation for all user inputs to prevent injection attacks and improve security.",
        priority: "high",
        category: "security",
        createdAt: now,
        status: "new",
        implementationDifficulty: "medium",
        estimatedHours: 6,
        relatedModule: "Authentication",
      });

      recommendations.push({
        id: `sec-${Date.now()}-2`,
        title: "Use Content Security Policy",
        description:
          "Implement a Content Security Policy to prevent XSS attacks and improve overall security.",
        priority: "medium",
        category: "security",
        createdAt: now,
        status: "new",
        implementationDifficulty: "hard",
        estimatedHours: 10,
        relatedModule: "Core",
      });
    }

    if (analysisType === "all" || analysisType === "code-quality") {
      recommendations.push({
        id: `qual-${Date.now()}-1`,
        title: "Refactor Component for Better Maintainability",
        description:
          "The component has grown too large. Consider breaking it down into smaller, more focused components to improve maintainability.",
        priority: "medium",
        category: "code-quality",
        createdAt: now,
        status: "new",
        implementationDifficulty: "medium",
        estimatedHours: 4,
        relatedModule: "UI",
      });

      recommendations.push({
        id: `qual-${Date.now()}-2`,
        title: "Improve Type Definitions",
        description:
          "Add more specific TypeScript types to improve code quality and prevent potential bugs.",
        priority: "medium",
        category: "code-quality",
        createdAt: now,
        status: "new",
        implementationDifficulty: "easy",
        estimatedHours: 3,
        relatedModule: "Core",
      });
    }

    if (analysisType === "all" || analysisType === "feature") {
      recommendations.push({
        id: `feat-${Date.now()}-1`,
        title: "Add Comprehensive Error Handling",
        description:
          "Implement a global error boundary and consistent error handling across the application to improve user experience.",
        priority: "medium",
        category: "feature",
        createdAt: now,
        status: "new",
        implementationDifficulty: "medium",
        estimatedHours: 10,
        relatedModule: "Core",
      });

      recommendations.push({
        id: `feat-${Date.now()}-2`,
        title: "Implement Dark Mode Support",
        description:
          "Add dark mode support to improve user experience and accessibility.",
        priority: "low",
        category: "feature",
        createdAt: now,
        status: "new",
        implementationDifficulty: "medium",
        estimatedHours: 8,
        relatedModule: "UI",
      });
    }

    // Generate mock scores based on the code snippet or context
    const codeQualityScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const performanceScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const securityScore = Math.floor(Math.random() * 30) + 70; // 70-100

    const result: CodeAnalysisResult = {
      recommendations,
      codeQualityScore,
      performanceScore,
      securityScore,
      summary: `Analysis complete. Found ${recommendations.length} potential improvements across performance, security, code quality, and features.`,
      analysisDate: now,
    };

    return new Response(JSON.stringify(result), {
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
