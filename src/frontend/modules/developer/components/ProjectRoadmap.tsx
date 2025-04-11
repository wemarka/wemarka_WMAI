import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Button } from "@/frontend/components/ui/button";
import { Separator } from "@/frontend/components/ui/separator";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Badge } from "@/frontend/components/ui/badge";
import { useAI } from "@/frontend/contexts/AIContext";
import {
  Check,
  Clock,
  FileText,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Loader2,
  Calendar,
  Users,
  AlertTriangle,
  Zap,
  Download,
} from "lucide-react";
import {
  projectAnalysisService,
  Roadmap,
} from "@/frontend/services/projectAnalysisService";
import { useTranslation } from "react-i18next";
import RoadmapVisualization from "./RoadmapVisualization";
import RoadmapExportModal from "./RoadmapExportModal";

export default function ProjectRoadmap() {
  const { t, i18n } = useTranslation();
  const { promptAIAssistant } = useAI();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "kanban">("timeline");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const isRTL = i18n.dir() === "rtl";

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      // Get current project metrics to use as context
      const metrics = await projectAnalysisService.getProjectMetrics();
      const moduleProgress = await projectAnalysisService.getModuleProgress();
      const commitActivity = await projectAnalysisService.getCommitActivity(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        new Date(),
      );

      // Prepare comprehensive project data for the AI
      const projectData = {
        metrics,
        moduleProgress,
        commitActivity,
        currentDate: new Date().toISOString(),
        projectStage:
          metrics?.openIssues > 50 ? "early-development" : "mid-development",
        teamSize: metrics?.contributors || 5,
        priorityAreas: moduleProgress
          .filter((module) => module.progress < 50)
          .map((module) => module.module),
        completedModules: moduleProgress
          .filter((module) => module.progress >= 90)
          .map((module) => module.module),
      };

      // Enhanced context with more specific details
      const context = `This is for the Wemarka WMAI project, a comprehensive business operating system. 
      The project includes modules for dashboard, store, accounting, marketing, inbox, developer tools, 
      analytics, and integrations. The team consists of ${projectData.teamSize} contributors.
      
      Priority areas that need attention: ${projectData.priorityAreas.join(", ")}.
      Modules that are nearly complete: ${projectData.completedModules.join(", ")}.
      
      Please create a realistic roadmap with appropriate dependencies, focusing on the priority areas 
      while maintaining a balanced approach to resource allocation. The roadmap should include specific 
      timeframes and clear dependencies between phases.`;

      const result = await projectAnalysisService.generateRoadmap(
        projectData,
        context,
      );
      setRoadmap(result);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      // Show error toast or message to user
    } finally {
      setLoading(false);
    }
  };

  const saveRoadmap = async () => {
    if (!roadmap) return;

    setSaving(true);
    try {
      // Generate a more descriptive name with date
      const formattedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const roadmapName = `Wemarka WMAI Development Roadmap - ${formattedDate}`;
      const description = `${roadmap.summary}\n\nGenerated on ${formattedDate} with ${roadmap.phases.length} development phases.`;

      const id = await projectAnalysisService.saveGeneratedRoadmap(
        roadmap,
        roadmapName,
        description,
      );
      setSavedId(id);

      // Show success message or toast here if needed
    } catch (error) {
      console.error("Error saving roadmap:", error);
      // Show error message or toast here if needed
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Generate roadmap on component mount
    generateRoadmap();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
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

  const handleAIAssist = (phaseIndex: number) => {
    if (!roadmap || !roadmap.phases[phaseIndex]) return;

    const phase = roadmap.phases[phaseIndex];
    const prompt = `Analyze this development phase and provide detailed recommendations: ${phase.name}\n\nDescription: ${phase.description}\n\nTasks: ${phase.tasks.join(", ")}\n\nPriority: ${phase.priority}\n\nDuration: ${phase.duration}`;

    promptAIAssistant(prompt);
  };

  const getFilteredPhases = () => {
    if (!roadmap) return [];
    if (!filterPriority) return roadmap.phases;

    return roadmap.phases.filter(
      (phase) => phase.priority.toLowerCase() === filterPriority.toLowerCase(),
    );
  };

  const handleExportRoadmap = async (format: string, options: any) => {
    if (!roadmap) return;

    setIsExporting(true);
    try {
      // In a real implementation, this would use libraries like jsPDF, html2canvas, etc.
      // For now, we'll simulate the export process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(`Exporting roadmap as ${format} with options:`, options);

      // Close the modal after successful export
      setShowExportModal(false);

      // Show success message
      // This would be replaced with a toast notification in a real implementation
      alert(t(`Roadmap exported successfully as ${format}`));
    } catch (error) {
      console.error(`Error exporting roadmap as ${format}:`, error);
      alert(t("Failed to export roadmap. Please try again."));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">{t("Project Roadmap")}</h2>
          <p className="text-muted-foreground">
            {t("AI-generated development plan for the Wemarka WMAI project")}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex mr-4">
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              className="rounded-r-none"
              onClick={() => setViewMode("timeline")}
            >
              <Calendar className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("Timeline")}
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              className="rounded-l-none"
              onClick={() => setViewMode("kanban")}
            >
              <Users className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
              {t("Kanban")}
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={generateRoadmap}
            disabled={loading}
          >
            {loading ? (
              <Loader2
                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 animate-spin`}
              />
            ) : (
              <GitBranch className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            )}
            {t("Regenerate")}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            disabled={!roadmap}
          >
            <Download className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t("Export")}
          </Button>
          <Button onClick={saveRoadmap} disabled={saving || !roadmap}>
            {saving ? (
              <Loader2
                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 animate-spin`}
              />
            ) : (
              <FileText className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            )}
            {t("Save to Database")}
          </Button>
        </div>
      </div>

      {roadmap && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>{t("Filter by priority")}:</span>
            <div className="flex">
              <Button
                variant={filterPriority === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority(null)}
                className="rounded-r-none px-3"
              >
                {t("All")}
              </Button>
              <Button
                variant={filterPriority === "high" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority("high")}
                className="rounded-none px-3 border-x-0"
              >
                {t("High")}
              </Button>
              <Button
                variant={filterPriority === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority("medium")}
                className="rounded-none px-3 border-x-0"
              >
                {t("Medium")}
              </Button>
              <Button
                variant={filterPriority === "low" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterPriority("low")}
                className="rounded-l-none px-3"
              >
                {t("Low")}
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              promptAIAssistant(
                "Analyze our current development roadmap and suggest optimizations.",
              )
            }
          >
            <Zap className="h-4 w-4 mr-2" />
            {t("AI Analysis")}
          </Button>
        </div>
      )}

      {savedId && (
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded-md">
          <p className="text-green-800 dark:text-green-300">
            {t("Roadmap saved successfully! ID:")} {savedId}
          </p>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-lg">{t("Generating project roadmap...")}</p>
          <p className="text-sm text-muted-foreground">
            {t("This may take a moment")}
          </p>
        </div>
      ) : roadmap ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Development Roadmap")}</CardTitle>
              <CardDescription>{roadmap.summary}</CardDescription>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className={`${isRTL ? "ml-1" : "mr-1"} h-4 w-4`} />
                {t("Generated")}:{" "}
                {new Date(roadmap.generatedDate).toLocaleString()}
              </div>
            </CardHeader>
            <CardContent>
              <RoadmapVisualization
                roadmap={roadmap}
                loading={false}
                filterPriority={filterPriority}
                onAIAssist={handleAIAssist}
                isRTL={isRTL}
              />
            </CardContent>
            <CardFooter>
              <div className="flex items-center text-sm text-muted-foreground">
                <AlertTriangle
                  className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 text-yellow-500`}
                />
                {t(
                  "This is an AI-generated roadmap and should be reviewed by the team",
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GitPullRequest className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-lg">{t("No roadmap generated yet")}</p>
            <Button className="mt-4" onClick={generateRoadmap}>
              {t("Generate Roadmap")}
            </Button>
          </CardContent>
        </Card>
      )}

      <RoadmapExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        roadmap={roadmap}
        onExport={handleExportRoadmap}
        isExporting={isExporting}
      />
    </div>
  );
}
