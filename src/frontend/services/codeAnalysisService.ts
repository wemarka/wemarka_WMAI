import { supabase } from "@/lib/supabase";
import { AIRecommendation } from "./projectAnalysisService";
import WMAIEngine from "./WMAIEngine";

export interface CodeAnalysisRequest {
  repositoryUrl?: string;
  branch?: string;
  filePath?: string;
  codeSnippet?: string;
  analysisType: "quality" | "performance" | "security" | "feature" | "all";
  context?: string;
}

export interface CodeAnalysisResult {
  recommendations: AIRecommendation[];
  codeQualityScore?: number;
  performanceScore?: number;
  securityScore?: number;
  summary: string;
  analysisDate: string;
}

/**
 * Analyze code using AI to generate recommendations
 * @param request The analysis request parameters
 * @returns Analysis results with recommendations
 */
export const analyzeCode = async (
  request: CodeAnalysisRequest,
): Promise<CodeAnalysisResult> => {
  try {
    // Call the Supabase Edge Function for code analysis
    const { data, error } = await supabase.functions.invoke(
      "supabase-functions-code-analysis",
      {
        body: request,
      },
    );

    if (error) throw new Error(error.message);

    return data as CodeAnalysisResult;
  } catch (error) {
    console.error("Error analyzing code:", error);
    // Return fallback data if the AI service fails
    return generateFallbackAnalysis(request);
  }
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
  return analyzeCode({
    repositoryUrl,
    branch,
    analysisType: "all",
  });
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
  return analyzeCode({
    filePath,
    analysisType,
  });
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
