import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Button } from "@/frontend/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAI } from "@/frontend/contexts/AIContext";
import { Download, FileText, Share2, Zap, History } from "lucide-react";
import { useToast } from "@/frontend/components/ui/use-toast";
import ProjectAnalysisDashboard from "./ProjectAnalysisDashboard";
import ProjectRoadmap from "./ProjectRoadmap";
import AIRoadmapRecommendations from "./AIRoadmapRecommendations";
import ProjectAnalysisInsights from "./ProjectAnalysisInsights";
import RoadmapHistory from "./RoadmapHistory";
import RoadmapComparisonEnhanced from "./RoadmapComparisonEnhanced";
import { projectAnalysisService } from "@/frontend/services/projectAnalysisService";

export default function DevelopmentRoadmapPanel() {
  const { t, i18n } = useTranslation();
  const { promptAIAssistant, setCurrentModule } = useAI();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [comparisonRoadmapId, setComparisonRoadmapId] = useState<string | null>(
    null,
  );
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    // Set the current module for AI context awareness
    setCurrentModule("Developer");

    // Listen for navigation events from RoadmapHistory
    const handleNavigateToComparison = (event: CustomEvent) => {
      setActiveTab("comparison");
      setComparisonRoadmapId(event.detail.roadmapId);
    };

    window.addEventListener(
      "navigate-to-comparison",
      handleNavigateToComparison as EventListener,
    );

    return () => {
      window.removeEventListener(
        "navigate-to-comparison",
        handleNavigateToComparison as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    // Fetch AI recommendations related to project development
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const data = await projectAnalysisService.getAIRecommendations();
        // Filter recommendations related to development planning
        const filteredRecs = data.filter(
          (rec) =>
            rec.category === "feature" ||
            rec.relatedModule?.toLowerCase().includes("roadmap") ||
            rec.relatedModule?.toLowerCase().includes("planning"),
        );
        setRecommendations(filteredRecs.slice(0, 3)); // Show top 3 recommendations
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [setCurrentModule]);

  const handleAIAssist = (topic: string) => {
    let prompt = "";
    switch (topic) {
      case "optimize":
        prompt =
          "Analyze our current development roadmap and suggest optimizations for timeline and resource allocation.";
        break;
      case "risks":
        prompt =
          "Identify potential risks and dependencies in our current development roadmap.";
        break;
      case "features":
        prompt =
          "Suggest additional features that would enhance our product based on current market trends.";
        break;
      default:
        prompt =
          "Help me understand how to better plan our development roadmap.";
    }
    promptAIAssistant(prompt);
  };

  const handleExportRoadmap = () => {
    // In a real implementation, this would generate and download a PDF or JSON file
    toast({
      title: t("Roadmap Exported"),
      description: t("Development roadmap has been exported successfully"),
      duration: 3000,
    });
  };

  const handleShareRoadmap = () => {
    // In a real implementation, this would generate a shareable link or open a share dialog
    navigator.clipboard
      .writeText("https://wemarka.ai/share/roadmap/" + Date.now())
      .then(() => {
        toast({
          title: t("Share Link Created"),
          description: t("Share link has been copied to clipboard"),
          duration: 3000,
        });
      })
      .catch((err) => {
        console.error("Error copying to clipboard:", err);
        toast({
          title: t("Sharing Failed"),
          description: t("Could not create share link"),
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t("Development Roadmap")}</h1>
          <p className="text-muted-foreground">
            {t("Plan and track the development of the Wemarka WMAI project")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportRoadmap}>
            <Download className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t("Export")}
          </Button>
          <Button variant="outline" onClick={handleShareRoadmap}>
            <Share2 className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t("Share")}
          </Button>
          <Button onClick={() => handleAIAssist("optimize")}>
            <Zap className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t("AI Optimize")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">{t("Project Analysis")}</TabsTrigger>
          <TabsTrigger value="roadmap">{t("Roadmap")}</TabsTrigger>
          <TabsTrigger value="insights">{t("AI Insights")}</TabsTrigger>
          <TabsTrigger value="recommendations">
            {t("AI Recommendations")}
          </TabsTrigger>
          <TabsTrigger value="history">{t("History")}</TabsTrigger>
          <TabsTrigger value="comparison">{t("Compare")}</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ProjectAnalysisDashboard />
        </TabsContent>

        <TabsContent value="roadmap">
          <ProjectRoadmap />
        </TabsContent>

        <TabsContent value="insights">
          <ProjectAnalysisInsights />
        </TabsContent>

        <TabsContent value="recommendations">
          <AIRoadmapRecommendations />
        </TabsContent>

        <TabsContent value="history">
          <RoadmapHistory />
        </TabsContent>

        <TabsContent value="comparison">
          <RoadmapComparisonEnhanced
            initialRoadmapIds={
              comparisonRoadmapId
                ? { before: "", after: comparisonRoadmapId }
                : undefined
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
