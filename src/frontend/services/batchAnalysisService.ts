import { AIRecommendation } from "./projectAnalysisService";
import {
  analyzeCode,
  CodeAnalysisRequest,
  CodeAnalysisResult,
} from "./codeAnalysisService";

/**
 * Analyze multiple files or code snippets in batch
 * @param filePaths Array of file paths to analyze
 * @param codeSnippets Array of code snippets with their paths
 * @param analysisType Type of analysis to perform
 * @param context Additional context for the analysis
 * @returns Aggregated analysis results
 */
export const analyzeBatch = async (
  filePaths?: string[],
  codeSnippets?: { path: string; content: string }[],
  analysisType: CodeAnalysisRequest["analysisType"] = "all",
  context: string = "",
): Promise<CodeAnalysisResult> => {
  try {
    const results: {
      path: string;
      result: CodeAnalysisResult;
    }[] = [];

    // Analyze file paths if provided
    if (filePaths && filePaths.length > 0) {
      for (const filePath of filePaths) {
        const result = await analyzeCode({
          filePath,
          analysisType,
          context: `${context}\nFile: ${filePath}`,
        });
        results.push({ path: filePath, result });
      }
    }

    // Analyze code snippets if provided
    if (codeSnippets && codeSnippets.length > 0) {
      for (const snippet of codeSnippets) {
        const result = await analyzeCode({
          codeSnippet: snippet.content,
          analysisType,
          context: `${context}\nFile: ${snippet.path}`,
        });
        results.push({ path: snippet.path, result });
      }
    }

    // If no results, return empty analysis
    if (results.length === 0) {
      return {
        recommendations: [],
        summary: "No files were analyzed.",
        analysisDate: new Date().toISOString(),
        isBatchResult: true,
        fileResults: [],
      };
    }

    // Aggregate all recommendations
    const allRecommendations: AIRecommendation[] = [];
    let totalQualityScore = 0;
    let totalPerformanceScore = 0;
    let totalSecurityScore = 0;
    let scoreCount = 0;

    const fileResults = results.map(({ path, result }) => {
      // Add file path to each recommendation
      const fileRecommendations = result.recommendations.map((rec) => ({
        ...rec,
        relatedModule: rec.relatedModule || path,
      }));

      // Add to all recommendations
      allRecommendations.push(...fileRecommendations);

      // Add to score totals if available
      if (result.codeQualityScore !== undefined) {
        totalQualityScore += result.codeQualityScore;
        scoreCount++;
      }
      if (result.performanceScore !== undefined) {
        totalPerformanceScore += result.performanceScore;
      }
      if (result.securityScore !== undefined) {
        totalSecurityScore += result.securityScore;
      }

      return {
        path,
        recommendations: fileRecommendations,
        codeQualityScore: result.codeQualityScore,
        performanceScore: result.performanceScore,
        securityScore: result.securityScore,
      };
    });

    // Calculate average scores
    const avgQualityScore =
      scoreCount > 0 ? Math.round(totalQualityScore / scoreCount) : undefined;
    const avgPerformanceScore =
      scoreCount > 0
        ? Math.round(totalPerformanceScore / scoreCount)
        : undefined;
    const avgSecurityScore =
      scoreCount > 0 ? Math.round(totalSecurityScore / scoreCount) : undefined;

    // Generate summary
    const summary = `Analyzed ${results.length} files. Found ${allRecommendations.length} recommendations across all files.`;

    return {
      recommendations: allRecommendations,
      codeQualityScore: avgQualityScore,
      performanceScore: avgPerformanceScore,
      securityScore: avgSecurityScore,
      summary,
      analysisDate: new Date().toISOString(),
      fileResults,
      isBatchResult: true,
    };
  } catch (error) {
    console.error("Error in batch analysis:", error);
    return {
      recommendations: [],
      summary: `Error performing batch analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
      analysisDate: new Date().toISOString(),
      isBatchResult: true,
      fileResults: [],
    };
  }
};
