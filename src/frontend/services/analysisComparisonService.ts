import { CodeAnalysisResult } from "./codeAnalysisService";

export interface AnalysisComparison {
  before: CodeAnalysisResult;
  after: CodeAnalysisResult;
  improvements: {
    codeQuality: number;
    performance: number;
    security: number;
    resolvedRecommendations: number;
    newRecommendations: number;
  };
  resolvedRecommendations: string[];
  newRecommendations: string[];
  persistentRecommendations: string[];
}

/**
 * Compare two code analysis results to identify improvements
 * @param before The earlier analysis result
 * @param after The later analysis result
 * @returns Comparison metrics and details
 */
export const compareAnalysisResults = (
  before: CodeAnalysisResult,
  after: CodeAnalysisResult,
): AnalysisComparison => {
  // Calculate score improvements
  const codeQualityImprovement =
    (after.codeQualityScore || 0) - (before.codeQualityScore || 0);
  const performanceImprovement =
    (after.performanceScore || 0) - (before.performanceScore || 0);
  const securityImprovement =
    (after.securityScore || 0) - (before.securityScore || 0);

  // Get recommendation IDs for comparison
  const beforeRecommendationIds = new Set(
    before.recommendations.map((rec) => rec.id),
  );
  const afterRecommendationIds = new Set(
    after.recommendations.map((rec) => rec.id),
  );

  // Find resolved recommendations (in before but not in after)
  const resolvedRecommendations = before.recommendations
    .filter((rec) => !afterRecommendationIds.has(rec.id))
    .map((rec) => rec.id);

  // Find new recommendations (in after but not in before)
  const newRecommendations = after.recommendations
    .filter((rec) => !beforeRecommendationIds.has(rec.id))
    .map((rec) => rec.id);

  // Find persistent recommendations (in both before and after)
  const persistentRecommendations = before.recommendations
    .filter((rec) => afterRecommendationIds.has(rec.id))
    .map((rec) => rec.id);

  return {
    before,
    after,
    improvements: {
      codeQuality: codeQualityImprovement,
      performance: performanceImprovement,
      security: securityImprovement,
      resolvedRecommendations: resolvedRecommendations.length,
      newRecommendations: newRecommendations.length,
    },
    resolvedRecommendations,
    newRecommendations,
    persistentRecommendations,
  };
};

/**
 * Save an analysis result for future comparison
 * @param result The analysis result to save
 * @param label A label to identify this analysis
 */
export const saveAnalysisForComparison = (
  result: CodeAnalysisResult,
  label: string,
): void => {
  try {
    // Get existing saved analyses
    const savedAnalysesJson = localStorage.getItem("saved-analyses") || "{}";
    const savedAnalyses = JSON.parse(savedAnalysesJson);

    // Add the new analysis
    savedAnalyses[label] = {
      result,
      timestamp: Date.now(),
    };

    // Save back to localStorage
    localStorage.setItem("saved-analyses", JSON.stringify(savedAnalyses));
  } catch (error) {
    console.error("Error saving analysis for comparison:", error);
  }
};

/**
 * Get all saved analyses for comparison
 * @returns Object with saved analyses
 */
export const getSavedAnalyses = (): Record<
  string,
  { result: CodeAnalysisResult; timestamp: number }
> => {
  try {
    const savedAnalysesJson = localStorage.getItem("saved-analyses") || "{}";
    return JSON.parse(savedAnalysesJson);
  } catch (error) {
    console.error("Error getting saved analyses:", error);
    return {};
  }
};

/**
 * Delete a saved analysis
 * @param label The label of the analysis to delete
 */
export const deleteSavedAnalysis = (label: string): void => {
  try {
    const savedAnalysesJson = localStorage.getItem("saved-analyses") || "{}";
    const savedAnalyses = JSON.parse(savedAnalysesJson);

    if (savedAnalyses[label]) {
      delete savedAnalyses[label];
      localStorage.setItem("saved-analyses", JSON.stringify(savedAnalyses));
    }
  } catch (error) {
    console.error("Error deleting saved analysis:", error);
  }
};
