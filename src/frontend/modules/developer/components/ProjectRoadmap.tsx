import React, { useState, useEffect, useRef } from "react";
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
  Lock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  projectAnalysisService,
  Roadmap,
} from "@/frontend/services/projectAnalysisService";

// Extend the Phase interface to include status and progress
interface Phase {
  name: string;
  description: string;
  tasks: string[];
  priority: string;
  duration: string;
  dependencies?: string[];
  status?: string; // 'not-started', 'in-progress', 'completed'
  progress?: number; // 0-100
}
import { useTranslation } from "react-i18next";
import RoadmapVisualization from "./RoadmapVisualization";
import RoadmapExportModal from "./RoadmapExportModal";

export default function ProjectRoadmap() {
  const { t, i18n } = useTranslation();
  const { promptAIAssistant } = useAI();
  const { toast } = useToast();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "kanban">("timeline");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const isRTL = i18n.dir() === "rtl";

  // Track previous completion state to detect changes
  const prevPhaseCompleteRef = useRef<boolean>(false);
  const autoNavigateEnabledRef = useRef<boolean>(true);

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

  // Check if the current phase is complete (for this demo, we'll consider a phase complete if it has a progress of 100%)
  const isCurrentPhaseComplete = () => {
    if (!roadmap || !roadmap.phases[currentPhaseIndex]) return false;

    // For demo purposes, we'll randomly assign a progress value to each phase
    // In a real implementation, this would come from actual progress tracking
    const phase = roadmap.phases[currentPhaseIndex];

    // Let's say a phase is considered complete if it has a "completed" status or a progress of 100%
    // You would replace this with your actual completion logic
    return phase.status === "completed" || phase.progress === 100;
  };

  const navigateToNextPhase = () => {
    if (!roadmap) return;

    if (!isCurrentPhaseComplete()) {
      toast({
        title: t("Phase not complete"),
        description: t(
          "You must complete the current phase before proceeding to the next one.",
        ),
        variant: "destructive",
      });
      return;
    }

    if (currentPhaseIndex < roadmap.phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      toast({
        title: t("Phase Navigation"),
        description: t("Moving to next phase: {0}", {
          0: roadmap.phases[currentPhaseIndex + 1].name,
        }),
      });
    } else {
      toast({
        title: t("Roadmap Complete"),
        description: t("You have completed all phases in the roadmap!"),
      });
    }
  };

  const navigateToPreviousPhase = () => {
    if (!roadmap) return;

    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1);
      toast({
        title: t("Phase Navigation"),
        description: t("Moving to previous phase: {0}", {
          0: roadmap.phases[currentPhaseIndex - 1].name,
        }),
      });
    }
  };

  // Toggle auto-navigation feature
  const toggleAutoNavigation = () => {
    autoNavigateEnabledRef.current = !autoNavigateEnabledRef.current;
    toast({
      title: autoNavigateEnabledRef.current
        ? t("Auto-Navigation Enabled")
        : t("Auto-Navigation Disabled"),
      description: autoNavigateEnabledRef.current
        ? t(
            "You will automatically proceed to the next phase when the current one is completed.",
          )
        : t("You will need to manually proceed to the next phase."),
    });
  };

  // Effect to detect phase completion and auto-navigate
  useEffect(() => {
    const isComplete = isCurrentPhaseComplete();

    // If phase just became complete and wasn't complete before
    if (
      isComplete &&
      !prevPhaseCompleteRef.current &&
      autoNavigateEnabledRef.current
    ) {
      // Small delay to allow user to see the completion state before navigating
      const timer = setTimeout(() => {
        if (currentPhaseIndex < (roadmap?.phases.length || 0) - 1) {
          toast({
            title: t("Phase Complete"),
            description: t("Automatically proceeding to next phase..."),
          });
          setCurrentPhaseIndex(currentPhaseIndex + 1);
        } else if (currentPhaseIndex === (roadmap?.phases.length || 0) - 1) {
          toast({
            title: t("Roadmap Complete"),
            description: t("You have completed all phases in the roadmap!"),
          });
        }
      }, 1500); // 1.5 second delay

      return () => clearTimeout(timer);
    }

    // Update the ref with current completion state
    prevPhaseCompleteRef.current = isComplete;
  }, [isCurrentPhaseComplete(), currentPhaseIndex, roadmap]);

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
        <>
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
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAutoNavigation}
              >
                <Check className="h-4 w-4 mr-2" />
                {autoNavigateEnabledRef.current
                  ? t("Auto-Navigate: On")
                  : t("Auto-Navigate: Off")}
              </Button>
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
          </div>

          {/* Phase Navigation Controls */}
          <div className="flex justify-between items-center mt-4 bg-muted p-3 rounded-md">
            <Button
              variant="outline"
              onClick={navigateToPreviousPhase}
              disabled={!roadmap || currentPhaseIndex === 0}
              className="flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {t("Previous Phase")}
            </Button>

            <div className="flex items-center">
              <span className="font-medium">
                {t("Phase")} {currentPhaseIndex + 1} {t("of")}{" "}
                {roadmap.phases.length}
              </span>
              {roadmap.phases[currentPhaseIndex] && (
                <Badge className="ml-2" variant="outline">
                  {roadmap.phases[currentPhaseIndex].name}
                </Badge>
              )}
              {!isCurrentPhaseComplete() && (
                <div className="flex items-center ml-3 text-amber-600 dark:text-amber-400">
                  <Lock className="h-4 w-4 mr-1" />
                  <span className="text-xs">
                    {t("Complete this phase to proceed")}
                  </span>
                </div>
              )}
              {isCurrentPhaseComplete() && (
                <div className="flex items-center ml-3 text-green-600 dark:text-green-400">
                  <Check className="h-4 w-4 mr-1" />
                  <span className="text-xs">{t("Phase complete")}</span>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={navigateToNextPhase}
              disabled={
                !roadmap || currentPhaseIndex >= roadmap.phases.length - 1
              }
              className="flex items-center"
            >
              {t("Next Phase")}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
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
                currentPhaseIndex={currentPhaseIndex}
                isCurrentPhaseComplete={isCurrentPhaseComplete()}
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
