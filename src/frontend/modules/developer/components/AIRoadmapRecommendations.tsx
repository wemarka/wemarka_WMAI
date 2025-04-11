import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { useAI } from "@/frontend/contexts/AIContext";
import { Zap, AlertTriangle, Check, X, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { projectAnalysisService } from "@/frontend/services/projectAnalysisService";

interface AIRoadmapRecommendation {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  effort: "high" | "medium" | "low";
  category: string;
  status: "new" | "accepted" | "rejected" | "implemented";
  createdAt: string;
}

export default function AIRoadmapRecommendations() {
  const { t, i18n } = useTranslation();
  const { promptAIAssistant } = useAI();
  const [recommendations, setRecommendations] = useState<
    AIRoadmapRecommendation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Get project metrics and module progress to analyze for recommendations
        const [aiRecs, metrics, moduleProgress, roadmap] = await Promise.all([
          projectAnalysisService.getAIRecommendations(),
          projectAnalysisService.getProjectMetrics(),
          projectAnalysisService.getModuleProgress(),
          projectAnalysisService.getProjectRoadmap(),
        ]);

        // Transform to roadmap-specific recommendations
        let roadmapRecs = aiRecs
          .filter(
            (rec) =>
              rec.category === "feature" ||
              rec.relatedModule?.toLowerCase().includes("roadmap") ||
              rec.relatedModule?.toLowerCase().includes("planning"),
          )
          .map((rec) => ({
            id: rec.id,
            title: rec.title,
            description: rec.description,
            impact: rec.priority as "high" | "medium" | "low",
            effort:
              (rec.implementationDifficulty as "high" | "medium" | "low") ||
              "medium",
            category: rec.category,
            status: rec.status as
              | "new"
              | "accepted"
              | "rejected"
              | "implemented",
            createdAt: rec.createdAt,
          }));

        // Generate intelligent recommendations based on project data
        const generateIntelligentRecommendations = () => {
          const recommendations = [];

          // Check for modules with low progress
          const lowProgressModules = moduleProgress.filter(
            (m) => m.progress < 40,
          );
          if (lowProgressModules.length > 0) {
            recommendations.push({
              id: `roadmap-rec-${Date.now()}-1`,
              title: "Prioritize Critical Path Modules",
              description: `The following modules have less than 40% completion: ${lowProgressModules.map((m) => m.module).join(", ")}. Consider reallocating resources to these modules to prevent project delays.`,
              impact: "high",
              effort: "medium",
              category: "resource",
              status: "new",
              createdAt: new Date().toISOString(),
            });
          }

          // Check for timeline issues
          if (metrics?.burndown?.actual > metrics?.burndown?.planned) {
            recommendations.push({
              id: `roadmap-rec-${Date.now()}-2`,
              title: "Adjust Project Timeline",
              description: `The project is currently behind schedule (${Math.round((metrics.burndown.actual / metrics.burndown.planned - 1) * 100)}% deviation). Consider extending deadlines or reducing scope for the next milestone.`,
              impact: "high",
              effort: "low",
              category: "timeline",
              status: "new",
              createdAt: new Date().toISOString(),
            });
          }

          // Check for resource allocation
          const highProgressModules = moduleProgress.filter(
            (m) => m.progress > 80 && m.progress < 100,
          );
          if (highProgressModules.length > 2 && lowProgressModules.length > 0) {
            recommendations.push({
              id: `roadmap-rec-${Date.now()}-3`,
              title: "Optimize Resource Allocation",
              description: `${highProgressModules.length} modules are near completion while ${lowProgressModules.length} modules have low progress. Consider reallocating team members to balance development.`,
              impact: "medium",
              effort: "low",
              category: "resource",
              status: "new",
              createdAt: new Date().toISOString(),
            });
          }

          // Check for parallel development opportunities
          if (roadmap?.milestones?.length > 0) {
            const upcomingMilestones = roadmap.milestones.filter(
              (m) => m.status === "planned",
            );
            if (upcomingMilestones.length > 1) {
              recommendations.push({
                id: `roadmap-rec-${Date.now()}-4`,
                title: "Implement Parallel Development Tracks",
                description: `Multiple upcoming milestones (${upcomingMilestones.map((m) => m.name).join(", ")}) could benefit from parallel development tracks to optimize timeline.`,
                impact: "high",
                effort: "medium",
                category: "process",
                status: "new",
                createdAt: new Date().toISOString(),
              });
            }
          }

          return recommendations;
        };

        // Add intelligent recommendations based on project data
        const intelligentRecs = generateIntelligentRecommendations();
        roadmapRecs = [...roadmapRecs, ...intelligentRecs];

        // Add fallback recommendations if we still don't have enough
        if (roadmapRecs.length < 3) {
          roadmapRecs.push({
            id: "roadmap-rec-1",
            title: "Implement Parallel Development Tracks",
            description:
              "Split the development team into parallel tracks to work on independent features simultaneously, reducing the overall timeline.",
            impact: "high",
            effort: "medium",
            category: "process",
            status: "new",
            createdAt: new Date().toISOString(),
          });

          roadmapRecs.push({
            id: "roadmap-rec-2",
            title: "Add User Testing Phase Before Release",
            description:
              "Include a dedicated user testing phase before each major release to gather feedback and make adjustments.",
            impact: "high",
            effort: "low",
            category: "quality",
            status: "new",
            createdAt: new Date().toISOString(),
          });

          roadmapRecs.push({
            id: "roadmap-rec-3",
            title: "Consolidate Similar Tasks Across Phases",
            description:
              "Several similar tasks appear in multiple phases. Consider consolidating these into shared components or services.",
            impact: "medium",
            effort: "medium",
            category: "optimization",
            status: "new",
            createdAt: new Date().toISOString(),
          });
        }

        // Sort recommendations by impact and recency
        roadmapRecs.sort((a, b) => {
          const impactOrder = { high: 3, medium: 2, low: 1 };
          const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
          if (impactDiff !== 0) return impactDiff;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setRecommendations(roadmapRecs);
      } catch (error) {
        console.error("Error fetching roadmap recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleStatusChange = (
    id: string,
    newStatus: "accepted" | "rejected" | "implemented",
  ) => {
    setRecommendations((prevRecs) =>
      prevRecs.map((rec) =>
        rec.id === id ? { ...rec, status: newStatus } : rec,
      ),
    );
  };

  const handleAIAssist = (recommendation: AIRoadmapRecommendation) => {
    const prompt = `Analyze this roadmap recommendation and provide detailed implementation steps:\n\nTitle: ${recommendation.title}\n\nDescription: ${recommendation.description}\n\nImpact: ${recommendation.impact}\n\nEffort: ${recommendation.effort}\n\nCategory: ${recommendation.category}`;

    promptAIAssistant(prompt);
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "feature":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "process":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "quality":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      case "optimization":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("AI Roadmap Recommendations")}</CardTitle>
          <CardDescription>{t("Loading recommendations...")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse space-y-4 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-md w-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("AI Roadmap Recommendations")}</CardTitle>
        <CardDescription>
          {t("Smart suggestions to improve your development roadmap")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium">{rec.title}</h3>
                  <div className="flex space-x-2">
                    {rec.status === "new" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-green-500"
                          onClick={() => handleStatusChange(rec.id, "accepted")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => handleStatusChange(rec.id, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAIAssist(rec)}
                    >
                      <Zap className="h-4 w-4 mr-1" />
                      {t("Explore")}
                    </Button>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1">{rec.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className={getImpactColor(rec.impact)}>
                    {t("Impact")}: {t(rec.impact)}
                  </Badge>
                  <Badge className={getEffortColor(rec.effort)}>
                    {t("Effort")}: {t(rec.effort)}
                  </Badge>
                  <Badge className={getCategoryColor(rec.category)}>
                    {t(rec.category)}
                  </Badge>
                  <Badge
                    variant={
                      rec.status === "new"
                        ? "outline"
                        : rec.status === "accepted"
                          ? "default"
                          : rec.status === "rejected"
                            ? "destructive"
                            : "secondary"
                    }
                  >
                    {t(rec.status)}
                  </Badge>
                </div>

                <div className="flex items-center mt-3 text-xs text-muted-foreground">
                  <Clock className={`${isRTL ? "ml-1" : "mr-1"} h-3 w-3`} />
                  {new Date(rec.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center py-4">
              <Button
                variant="outline"
                onClick={() =>
                  promptAIAssistant(
                    "Generate new recommendations for optimizing our development roadmap based on current industry best practices.",
                  )
                }
              >
                <Zap className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
                {t("Generate More Recommendations")}
              </Button>
            </div>

            <div className="flex items-center text-sm text-muted-foreground mt-4">
              <AlertTriangle
                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 text-yellow-500`}
              />
              {t(
                "These recommendations are AI-generated and should be reviewed by the team before implementation",
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
