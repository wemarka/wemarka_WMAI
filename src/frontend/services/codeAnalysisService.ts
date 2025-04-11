import { supabase } from "@/lib/supabase";
import { AIRecommendation } from "./projectAnalysisService";
import WMAIEngine from "./WMAIEngine";

export interface CodeAnalysisRequest {
  repositoryUrl?: string;
  branch?: string;
  filePath?: string;
  filePaths?: string[];
  codeSnippet?: string;
  codeSnippets?: { path: string; content: string }[];
  analysisType: "quality" | "performance" | "security" | "feature" | "all";
  context?: string;
  isBatchAnalysis?: boolean;
}

export interface CodeAnalysisResult {
  recommendations: AIRecommendation[];
  codeQualityScore?: number;
  performanceScore?: number;
  securityScore?: number;
  summary: string;
  analysisDate: string;
  fileResults?: {
    path: string;
    recommendations: AIRecommendation[];
    codeQualityScore?: number;
    performanceScore?: number;
    securityScore?: number;
  }[];
  isBatchResult?: boolean;
}

/**
 * Analyze code using OpenAI to generate recommendations
 * @param request The analysis request parameters
 * @returns Analysis results with recommendations
 */
/**
 * Cache for storing recent analysis results to improve performance
 * Key format: analysisType-hash(content)
 */
const analysisCache = new Map<
  string,
  { result: CodeAnalysisResult; timestamp: number }
>();
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Generate a cache key for a given analysis request
 */
const generateCacheKey = (request: CodeAnalysisRequest): string => {
  const contentHash =
    request.codeSnippet || request.filePath || request.repositoryUrl || "";
  return `${request.analysisType}-${contentHash.slice(0, 100)}`;
};

/**
 * Check if a cached result is still valid
 */
const isCacheValid = (cacheEntry: {
  result: CodeAnalysisResult;
  timestamp: number;
}): boolean => {
  return Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;
};

export const analyzeCode = async (
  request: CodeAnalysisRequest,
): Promise<CodeAnalysisResult> => {
  try {
    // Check cache first
    const cacheKey = generateCacheKey(request);
    const cachedResult = analysisCache.get(cacheKey);

    if (cachedResult && isCacheValid(cachedResult)) {
      console.log("Using cached analysis result");
      return cachedResult.result;
    }
    // First try to use the dedicated code-analysis edge function
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase.functions.invoke("code-analysis", {
        body: request,
      });

      if (!error && data) {
        // Format the response to match our expected CodeAnalysisResult structure
        return {
          recommendations: (data.recommendations || []).map(
            (rec: any, index: number) => ({
              id: rec.id || `ai-${Date.now()}-${index}`,
              title: rec.title || "Recommendation",
              description: rec.description || "",
              priority: rec.priority || "medium",
              category: rec.category || "code-quality",
              createdAt: rec.createdAt || new Date().toISOString(),
              status: rec.status || "new",
              implementationDifficulty:
                rec.implementationDifficulty || "medium",
              estimatedHours: rec.estimatedHours || 4,
              relatedModule: rec.relatedModule || "Core",
              codeSnippet: rec.codeSnippet || undefined,
            }),
          ),
          codeQualityScore: data.codeQualityScore || 75,
          performanceScore: data.performanceScore || 80,
          securityScore: data.securityScore || 70,
          summary: data.summary || "Analysis completed successfully.",
          analysisDate: data.analysisDate || new Date().toISOString(),
        };
      }
    } catch (edgeFunctionError) {
      console.warn(
        "Edge function error, falling back to OpenAI API:",
        edgeFunctionError,
      );
      // Continue to OpenAI fallback if edge function fails
    }

    // Prepare the prompt for OpenAI based on the request type and content
    let prompt =
      "Analyze the following code and provide recommendations for improvements. ";

    // Add analysis type to the prompt
    if (request.analysisType !== "all") {
      prompt += `Focus on ${request.analysisType} aspects. `;
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

    // Call the Supabase Edge Function for code analysis
    const { callOpenAI } = await import("@/api");
    const data = await callOpenAI(prompt);
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
          createdAt: new Date().toISOString(),
          status: "new",
          implementationDifficulty: rec.implementationDifficulty || "medium",
          estimatedHours: rec.estimatedHours || 4,
          relatedModule: rec.relatedModule || "Core",
          codeSnippet: rec.codeSnippet || undefined,
        }),
      ),
      codeQualityScore: parsedResponse.codeQualityScore || 75,
      performanceScore: parsedResponse.performanceScore || 80,
      securityScore: parsedResponse.securityScore || 70,
      summary: parsedResponse.summary || "Analysis completed successfully.",
      analysisDate: new Date().toISOString(),
    };

    // Save the analysis result to Supabase
    try {
      const { supabase } = await import("@/lib/supabase");
      await supabase.from("code_analysis_results").insert({
        analysis_type: request.analysisType,
        code_snippet: request.codeSnippet,
        file_path: request.filePath,
        repository_url: request.repositoryUrl,
        branch: request.branch,
        code_quality_score: result.codeQualityScore,
        performance_score: result.performanceScore,
        security_score: result.securityScore,
        summary: result.summary,
        analysis_date: result.analysisDate,
      });
    } catch (saveError) {
      console.warn("Failed to save analysis result to Supabase:", saveError);
      // Continue even if saving fails
    }

    // Cache the result before returning
    analysisCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    });

    return result;
  } catch (error) {
    console.error("Error analyzing code with OpenAI:", error);
    // Return fallback data if the AI service fails
    return generateFallbackAnalysis(request);
  }
};

/**
 * Clear the analysis cache
 */
export const clearAnalysisCache = (): void => {
  analysisCache.clear();
};

/**
 * Analyze a GitHub repository to generate development recommendations
 * @param repositoryUrl The GitHub repository URL
 * @param branch The branch to analyze (default: main)
 * @returns Analysis results with recommendations
 */
export const analyzeGitHubRepository = async (
  repositoryUrl: string,
  branch: string = "main",
): Promise<CodeAnalysisResult> => {
  try {
    // First try to fetch repository content using the GitHub API via edge function
    const { fetchGitHubFile } = await import("@/api");

    // Extract owner/repo from URL
    const urlMatch = repositoryUrl.match(/github\.com\/([\w-]+\/[\w-]+)/);
    if (!urlMatch || !urlMatch[1]) {
      throw new Error("Invalid GitHub repository URL");
    }

    const repo = urlMatch[1];

    // Try to fetch the README.md or package.json to get context about the repo
    let repoContext = "";
    try {
      const readmeData = await fetchGitHubFile("README.md", repo);
      if (readmeData?.content) {
        repoContext = `Repository README: ${readmeData.content.substring(0, 1000)}...`;
      }
    } catch (readmeError) {
      console.warn("Could not fetch README.md, trying package.json");
      try {
        const packageData = await fetchGitHubFile("package.json", repo);
        if (packageData?.content) {
          repoContext = `Repository package.json: ${packageData.content}`;
        }
      } catch (packageError) {
        console.warn("Could not fetch package.json either");
      }
    }

    // Now analyze the repository with the context we gathered
    return analyzeCode({
      repositoryUrl,
      branch,
      analysisType: "all",
      context: repoContext || undefined,
    });
  } catch (error) {
    console.error("Error analyzing GitHub repository:", error);
    return analyzeCode({
      repositoryUrl,
      branch,
      analysisType: "all",
    });
  }
};

/**
 * Analyze a specific file to generate recommendations
 * @param filePath The path to the file
 * @param analysisType The type of analysis to perform
 * @returns Analysis results with recommendations
 */
export const analyzeFile = async (
  filePath: string,
  analysisType: CodeAnalysisRequest["analysisType"] = "all",
): Promise<CodeAnalysisResult> => {
  try {
    // Try to fetch the file content first
    let fileContent = "";

    try {
      // Try to fetch from GitHub if it's a GitHub file path
      if (filePath.includes("github.com")) {
        const { fetchGitHubFile } = await import("@/api");
        const pathParts = filePath.split("/");
        const repo = `${pathParts[3]}/${pathParts[4]}`;
        const path = pathParts.slice(5).join("/");

        const fileData = await fetchGitHubFile(path, repo);
        if (fileData?.content) {
          fileContent = fileData.content;
        }
      } else {
        // For local files, we'll need to implement a way to read them
        // This could be a server endpoint or a different approach
        console.warn("Local file reading not implemented yet");
      }
    } catch (fetchError) {
      console.warn("Could not fetch file content:", fetchError);
    }

    // If we have file content, analyze it as a code snippet
    if (fileContent) {
      return analyzeCode({
        codeSnippet: fileContent,
        filePath, // Keep the file path for reference
        analysisType,
        context: `File path: ${filePath}`,
      });
    }

    // Otherwise, just pass the file path
    return analyzeCode({
      filePath,
      analysisType,
    });
  } catch (error) {
    console.error("Error analyzing file:", error);
    return analyzeCode({
      filePath,
      analysisType,
    });
  }
};

/**
 * Analyze a code snippet to generate recommendations
 * @param codeSnippet The code snippet to analyze
 * @param context Additional context about the code
 * @param analysisType The type of analysis to perform
 * @returns Analysis results with recommendations
 */
export const analyzeCodeSnippet = async (
  codeSnippet: string,
  context: string = "",
  analysisType: CodeAnalysisRequest["analysisType"] = "all",
): Promise<CodeAnalysisResult> => {
  return analyzeCode({
    codeSnippet,
    context,
    analysisType,
  });
};

/**
 * Track the implementation status of a recommendation
 * @param recommendationId The ID of the recommendation
 * @param status The new status
 * @param feedback Optional feedback about the implementation
 * @returns Success status
 */
export const trackRecommendationImplementation = async (
  recommendationId: string,
  status: AIRecommendation["status"],
  feedback?: string,
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("ai_recommendations")
      .update({ status, feedback })
      .eq("id", recommendationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error tracking recommendation implementation:", error);
    return false;
  }
};

/**
 * Generate fallback analysis data when the AI service is unavailable
 * @param request The original analysis request
 * @returns Fallback analysis results
 */
const generateFallbackAnalysis = (
  request: CodeAnalysisRequest,
): CodeAnalysisResult => {
  const now = new Date().toISOString();
  const analysisType = request.analysisType;

  // Generate recommendations based on analysis type
  const recommendations: AIRecommendation[] = [];

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
  }

  return {
    recommendations,
    codeQualityScore: 75,
    performanceScore: 80,
    securityScore: 70,
    summary:
      "This is a fallback analysis generated when the AI service is unavailable. Please try again later for a more accurate analysis.",
    analysisDate: now,
  };
};
