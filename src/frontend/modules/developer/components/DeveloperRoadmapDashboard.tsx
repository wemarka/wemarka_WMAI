import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAI } from "@/frontend/contexts/AIContext";
import { AIActionButton } from "@/frontend/modules/ai";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";
import { Input } from "@/frontend/components/ui/input";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Separator } from "@/frontend/components/ui/separator";
import { useToast } from "@/frontend/components/ui/use-toast";
import { FallbackMessage } from "@/frontend/components/ui/fallback-message";
import RoadmapVisualization from "./RoadmapVisualization";
import ProjectRoadmap from "./ProjectRoadmap";
import RoadmapHistory from "./RoadmapHistory";
import RoadmapComparison from "./RoadmapComparison";
import RoadmapComparisonEnhanced from "./RoadmapComparisonEnhanced";
import AIRoadmapRecommendations from "./AIRoadmapRecommendations";
import { roadmapHistoryService } from "@/frontend/services/roadmapHistoryService";
import { roadmapAnalyticsService } from "@/frontend/services/roadmapAnalyticsService";
import {
  Search,
  Filter,
  Calendar,
  GitBranch,
  GitPullRequest,
  GitMerge,
  BarChart,
  Layers,
  Zap,
  Save,
  Share,
  Download,
  History,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Plus,
  RefreshCw,
  FileText,
  Loader2,
} from "lucide-react";

interface DeveloperRoadmapDashboardProps {
  isRTL?: boolean;
}

const DeveloperRoadmapDashboard: React.FC<DeveloperRoadmapDashboardProps> = ({
  isRTL = false,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { promptAIAssistant } = useAI();

  const [activeTab, setActiveTab] = useState("roadmap");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savedRoadmaps, setSavedRoadmaps] = useState<any[]>([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState<any>(null);
  const [comparisonRoadmap, setComparisonRoadmap] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);

  // Load saved roadmaps
  useEffect(() => {
    const loadRoadmaps = async () => {
      setIsLoading(true);
      try {
        const roadmaps = await roadmapHistoryService.getSavedRoadmaps();
        setSavedRoadmaps(roadmaps);

        // Select the most recent roadmap by default
        if (roadmaps.length > 0) {
          setSelectedRoadmap(roadmaps[0]);
        }
      } catch (error) {
        console.error("Error loading roadmaps:", error);
        toast({
          title: t("Error"),
          description: t("Failed to load saved roadmaps"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmaps();
  }, [t, toast]);

  // Track roadmap view for analytics
  useEffect(() => {
    if (selectedRoadmap) {
      roadmapAnalyticsService.trackRoadmapEvent({
        roadmapId: selectedRoadmap.id,
        actionType: "view",
      });
    }
  }, [selectedRoadmap]);

  const handleAIAssist = (phaseIndex: number) => {
    if (!selectedRoadmap) return;

    const phase = selectedRoadmap.roadmapData.phases[phaseIndex];

    promptAIAssistant(
      `Analyze the following project phase and provide detailed recommendations for implementation: ${phase.name}\n\nDescription: ${phase.description}\n\nPriority: ${phase.priority}\n\nDuration: ${phase.duration}\n\nTasks: ${phase.tasks.join(", ")}${phase.dependencies ? `\n\nDependencies: ${phase.dependencies.join(", ")}` : ""}`,
    );

    // Track AI assist usage
    roadmapAnalyticsService.trackRoadmapEvent({
      roadmapId: selectedRoadmap.id,
      actionType: "analyze",
      actionDetails: { phaseIndex, phaseName: phase.name },
    });

    toast({
      title: t("AI Analysis Initiated"),
      description: t("Analyzing phase: {{phaseName}}", {
        phaseName: phase.name,
      }),
    });
  };

  const handleExportRoadmap = () => {
    if (!selectedRoadmap) return;

    // Track export action
    roadmapAnalyticsService.trackRoadmapEvent({
      roadmapId: selectedRoadmap.id,
      actionType: "export",
    });

    // In a real implementation, this would generate and download a file
    toast({
      title: t("Roadmap Exported"),
      description: t("The roadmap has been exported successfully"),
    });
  };

  const handleShareRoadmap = () => {
    if (!selectedRoadmap) return;

    // Track share action
    roadmapAnalyticsService.trackRoadmapEvent({
      roadmapId: selectedRoadmap.id,
      actionType: "share",
    });

    // In a real implementation, this would open a share dialog
    toast({
      title: t("Roadmap Shared"),
      description: t("Share link has been copied to clipboard"),
    });
  };

  const handleCompareRoadmaps = (roadmap1Id: string, roadmap2Id: string) => {
    const roadmap1 = savedRoadmaps.find((r) => r.id === roadmap1Id);
    const roadmap2 = savedRoadmaps.find((r) => r.id === roadmap2Id);

    if (roadmap1 && roadmap2) {
      setSelectedRoadmap(roadmap1);
      setComparisonRoadmap(roadmap2);
      setActiveTab("comparison");

      // Track comparison action
      roadmapAnalyticsService.trackRoadmapEvent({
        roadmapId: roadmap1.id,
        actionType: "compare",
        actionDetails: { comparedWithId: roadmap2.id },
      });
    }
  };

  const handleCreateNewRoadmap = () => {
    navigate("/dashboard/developer/roadmap/new");
  };

  const handleFilterChange = (priority: string | null) => {
    setFilterPriority(priority);
  };

  const filteredRoadmaps = searchQuery
    ? savedRoadmaps.filter(
        (roadmap) =>
          roadmap.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          roadmap.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : savedRoadmaps;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg" dir="auto">
          {t("Loading roadmap dashboard...")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t("Development Roadmap")}</h1>
          <p className="text-muted-foreground">
            {t("Plan, visualize, and track your project development roadmap")}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setActiveTab("history")}>
            <History className="mr-2 h-4 w-4" />
            {t("History")}
          </Button>

          <Button variant="outline" onClick={() => setActiveTab("analytics")}>
            <BarChart className="mr-2 h-4 w-4" />
            {t("Analytics")}
          </Button>

          <Button variant="default" onClick={handleCreateNewRoadmap}>
            <Plus className="mr-2 h-4 w-4" />
            {t("New Roadmap")}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("Search roadmaps...")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={filterPriority === "high" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              handleFilterChange(filterPriority === "high" ? null : "high")
            }
            className={
              filterPriority === "high" ? "bg-red-600 hover:bg-red-700" : ""
            }
          >
            {t("High")}
          </Button>

          <Button
            variant={filterPriority === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              handleFilterChange(filterPriority === "medium" ? null : "medium")
            }
            className={
              filterPriority === "medium"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : ""
            }
          >
            {t("Medium")}
          </Button>

          <Button
            variant={filterPriority === "low" ? "default" : "outline"}
            size="sm"
            onClick={() =>
              handleFilterChange(filterPriority === "low" ? null : "low")
            }
            className={
              filterPriority === "low" ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            {t("Low")}
          </Button>

          {filterPriority && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange(null)}
            >
              {t("Clear")}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="roadmap">
            <GitBranch className="mr-2 h-4 w-4" />
            {t("Roadmap")}
          </TabsTrigger>
          <TabsTrigger value="visualization">
            <Layers className="mr-2 h-4 w-4" />
            {t("Visualization")}
          </TabsTrigger>
          <TabsTrigger value="comparison">
            <GitMerge className="mr-2 h-4 w-4" />
            {t("Comparison")}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            {t("History")}
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Sparkles className="mr-2 h-4 w-4" />
            {t("AI Recommendations")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="mt-6">
          {selectedRoadmap ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{selectedRoadmap.name}</h2>
                  <p className="text-muted-foreground">
                    {selectedRoadmap.description}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportRoadmap}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t("Export")}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareRoadmap}
                  >
                    <Share className="mr-2 h-4 w-4" />
                    {t("Share")}
                  </Button>

                  <AIActionButton
                    onClick={() => {
                      promptAIAssistant(
                        `Analyze this project roadmap and provide strategic recommendations: ${selectedRoadmap.name}\n\n${selectedRoadmap.description}\n\nPhases: ${selectedRoadmap.roadmapData.phases.map((p: any) => p.name).join(", ")}`,
                      );
                    }}
                    label={t("AI Analysis")}
                    variant="outline"
                    size="sm"
                    tooltipText={t("Get AI recommendations for this roadmap")}
                  />
                </div>
              </div>

              <ProjectRoadmap
                roadmapData={selectedRoadmap.roadmapData}
                isRTL={isRTL}
                onAIAssist={handleAIAssist}
              />
            </div>
          ) : (
            <FallbackMessage
              title={t("No Roadmap Selected")}
              message={t(
                "Please select a roadmap from the list or create a new one",
              )}
              icon={
                <GitPullRequest className="h-12 w-12 text-muted-foreground opacity-50" />
              }
              dir="auto"
            />
          )}
        </TabsContent>

        <TabsContent value="visualization" className="mt-6">
          {selectedRoadmap ? (
            <RoadmapVisualization
              roadmap={selectedRoadmap.roadmapData}
              loading={false}
              filterPriority={filterPriority}
              onAIAssist={handleAIAssist}
              isRTL={isRTL}
            />
          ) : (
            <FallbackMessage
              title={t("No Roadmap Selected")}
              message={t(
                "Please select a roadmap from the list or create a new one",
              )}
              icon={
                <GitPullRequest className="h-12 w-12 text-muted-foreground opacity-50" />
              }
              dir="auto"
            />
          )}
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          {selectedRoadmap && comparisonRoadmap ? (
            <RoadmapComparisonEnhanced
              roadmap1={selectedRoadmap.roadmapData}
              roadmap2={comparisonRoadmap.roadmapData}
              roadmap1Name={selectedRoadmap.name}
              roadmap2Name={comparisonRoadmap.name}
              isRTL={isRTL}
            />
          ) : (
            <div className="space-y-6">
              <FallbackMessage
                title={t("Select Roadmaps to Compare")}
                message={t(
                  "Please select two roadmaps to compare their differences",
                )}
                icon={
                  <GitMerge className="h-12 w-12 text-muted-foreground opacity-50" />
                }
                dir="auto"
              />

              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("Select First Roadmap")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {filteredRoadmaps.map((roadmap) => (
                          <Button
                            key={roadmap.id}
                            variant={
                              selectedRoadmap?.id === roadmap.id
                                ? "default"
                                : "outline"
                            }
                            className="w-full justify-start"
                            onClick={() => setSelectedRoadmap(roadmap)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {roadmap.name}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("Select Second Roadmap")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-2">
                        {filteredRoadmaps.map((roadmap) => (
                          <Button
                            key={roadmap.id}
                            variant={
                              comparisonRoadmap?.id === roadmap.id
                                ? "default"
                                : "outline"
                            }
                            className="w-full justify-start"
                            onClick={() => setComparisonRoadmap(roadmap)}
                            disabled={selectedRoadmap?.id === roadmap.id}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            {roadmap.name}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {selectedRoadmap && comparisonRoadmap && (
                <div className="flex justify-center">
                  <Button
                    onClick={() =>
                      handleCompareRoadmaps(
                        selectedRoadmap.id,
                        comparisonRoadmap.id,
                      )
                    }
                  >
                    <GitMerge className="mr-2 h-4 w-4" />
                    {t("Compare Roadmaps")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <RoadmapHistory
            roadmaps={filteredRoadmaps}
            onSelectRoadmap={setSelectedRoadmap}
            onCompareRoadmaps={handleCompareRoadmaps}
            isRTL={isRTL}
          />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AIRoadmapRecommendations
            currentRoadmap={selectedRoadmap?.roadmapData}
            isRTL={isRTL}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">{t("Saved Roadmaps")}</h2>

        {filteredRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoadmaps.map((roadmap) => (
              <Card
                key={roadmap.id}
                className={`cursor-pointer transition-all hover:shadow-md ${selectedRoadmap?.id === roadmap.id ? "border-primary" : ""}`}
                onClick={() => setSelectedRoadmap(roadmap)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{roadmap.name}</CardTitle>
                    <Badge variant="outline">
                      {new Date(roadmap.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {roadmap.description}
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <Badge className="mr-2" variant="secondary">
                        {roadmap.roadmapData.phases.length} {t("phases")}
                      </Badge>
                      <Badge variant="outline">{roadmap.status}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoadmap(roadmap);
                        setActiveTab("roadmap");
                      }}
                    >
                      {t("View")}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <FallbackMessage
            title={t("No Roadmaps Found")}
            message={
              searchQuery
                ? t("No roadmaps match your search criteria")
                : t("You haven't created any roadmaps yet")
            }
            icon={
              <GitPullRequest className="h-12 w-12 text-muted-foreground opacity-50" />
            }
            dir="auto"
          />
        )}
      </div>
    </div>
  );
};

export default DeveloperRoadmapDashboard;
