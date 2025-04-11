import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Progress } from "@/frontend/components/ui/progress";
import { useAI } from "@/frontend/contexts/AIContext";
import {
  AlertTriangle,
  BarChart,
  Check,
  Clock,
  Download,
  FileText,
  GitBranch,
  GitCommit,
  Loader2,
  Mail,
  Printer,
  Share2,
  Shield,
  Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { projectAnalysisService } from "@/frontend/services/projectAnalysisService";
import { useToast } from "@/frontend/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";

interface ProjectInsight {
  id: string;
  title: string;
  description: string;
  category: "performance" | "timeline" | "resource" | "quality" | "risk";
  impact: "high" | "medium" | "low";
  actionable: boolean;
  suggestedAction?: string;
  relatedMetrics?: string[];
  createdAt: string;
}

export default function ProjectAnalysisInsights() {
  const { t, i18n } = useTranslation();
  const { promptAIAssistant } = useAI();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [moduleProgress, setModuleProgress] = useState<any[]>([]);
  const [insights, setInsights] = useState<ProjectInsight[]>([]);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "json">("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareNote, setShareNote] = useState("");
  const [isSharingReport, setIsSharingReport] = useState(false);
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch project metrics and module progress
        const [metricsData, progressData] = await Promise.all([
          projectAnalysisService.getProjectMetrics(),
          projectAnalysisService.getModuleProgress(),
        ]);

        setMetrics(metricsData);
        setModuleProgress(progressData);

        // Generate initial insights
        generateInsights(metricsData, progressData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateInsights = async (metricsData: any, progressData: any[]) => {
    setGeneratingInsights(true);
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll generate mock insights based on the data

      // Find modules with low progress
      const lowProgressModules = progressData
        .filter((module) => module.progress < 50)
        .map((module) => module.module);

      // Find modules with high progress but recent activity
      const nearCompletionModules = progressData
        .filter(
          (module) =>
            module.progress > 80 &&
            module.progress < 100 &&
            module.lastActivity,
        )
        .map((module) => module.module);

      const mockInsights: ProjectInsight[] = [
        {
          id: "insight-1",
          title: "Critical Path Risk: Low Progress Modules",
          description: `The following modules have less than 50% completion: ${lowProgressModules.join(
            ", ",
          )}. This may impact the overall project timeline.`,
          category: "risk",
          impact: "high",
          actionable: true,
          suggestedAction:
            "Allocate additional resources to these modules or adjust the project timeline.",
          relatedMetrics: ["moduleProgress", "projectTimeline"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "insight-2",
          title: "Resource Optimization Opportunity",
          description: `${nearCompletionModules.length} modules are near completion (>80%). Consider reallocating resources from these modules to lower progress areas.`,
          category: "resource",
          impact: "medium",
          actionable: true,
          suggestedAction:
            "Reassign team members from near-complete modules to critical path modules.",
          relatedMetrics: ["resourceAllocation", "moduleProgress"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "insight-3",
          title: "Code Quality Concerns",
          description: `Current code quality score is ${metricsData.codeQuality.coverage}%. This is ${metricsData.codeQuality.coverage < 70 ? "below" : "above"} the target threshold of 70%.`,
          category: "quality",
          impact: metricsData.codeQuality.coverage < 70 ? "high" : "low",
          actionable: metricsData.codeQuality.coverage < 70,
          suggestedAction:
            metricsData.codeQuality.coverage < 70
              ? "Increase test coverage and address code smells."
              : undefined,
          relatedMetrics: ["codeQuality", "testCoverage"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "insight-4",
          title: "Timeline Analysis",
          description: `Based on current velocity (${metricsData.velocity} story points/sprint) and remaining work (${metricsData.burndown.remaining} story points), the project is ${metricsData.burndown.actual > metricsData.burndown.planned ? "behind" : "ahead of"} schedule.`,
          category: "timeline",
          impact:
            metricsData.burndown.actual > metricsData.burndown.planned
              ? "high"
              : "low",
          actionable:
            metricsData.burndown.actual > metricsData.burndown.planned,
          suggestedAction:
            metricsData.burndown.actual > metricsData.burndown.planned
              ? "Consider scope reduction or timeline extension."
              : undefined,
          relatedMetrics: ["velocity", "burndown"],
          createdAt: new Date().toISOString(),
        },
        {
          id: "insight-5",
          title: "Performance Optimization Needed",
          description:
            "Several key components require performance optimization to improve user experience.",
          category: "performance",
          impact: "medium",
          actionable: true,
          suggestedAction:
            "Implement code splitting and lazy loading for dashboard components.",
          relatedMetrics: ["performanceScore"],
          createdAt: new Date().toISOString(),
        },
      ];

      setInsights(mockInsights);
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setGeneratingInsights(false);
    }
  };

  const handleRefreshInsights = async () => {
    if (!metrics || !moduleProgress.length) return;
    setGeneratingInsights(true);
    try {
      await generateInsights(metrics, moduleProgress);
    } catch (error) {
      console.error("Error refreshing insights:", error);
    } finally {
      setGeneratingInsights(false);
    }
  };

  const handleExport = async (format: "pdf" | "json") => {
    setExportFormat(format);
    setIsExporting(true);

    try {
      // In a real implementation, this would use a library like jsPDF or html2canvas
      // For now, we'll simulate the export process
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create export data
      const exportData = {
        projectName: "Wemarka WMAI",
        generatedDate: new Date().toISOString(),
        metrics: metrics,
        moduleProgress: moduleProgress,
        insights: insights,
        exportFormat: format,
      };

      // In a real implementation, this would trigger a download
      console.log("Exporting data:", exportData);

      toast({
        title: t("Export Successful"),
        description:
          format === "pdf"
            ? t("Project insights have been exported as PDF")
            : t("Project insights have been exported as JSON"),
        duration: 3000,
      });
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
      toast({
        title: t("Export Failed"),
        description: t("There was an error exporting the project insights"),
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (!shareEmail) {
      toast({
        title: t("Email Required"),
        description: t("Please enter an email address to share the report"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsSharingReport(true);
    try {
      // In a real implementation, this would call an API to send the report
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: t("Report Shared"),
        description: t("Project insights have been shared successfully"),
        duration: 3000,
      });

      setShowShareDialog(false);
      setShareEmail("");
      setShareNote("");
    } catch (error) {
      console.error("Error sharing report:", error);
      toast({
        title: t("Sharing Failed"),
        description: t("There was an error sharing the project insights"),
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSharingReport(false);
    }
  };

  const handleAIAssist = (insight: ProjectInsight) => {
    const prompt = `Analyze this project insight and provide detailed recommendations:\n\nTitle: ${insight.title}\n\nDescription: ${insight.description}\n\nCategory: ${insight.category}\n\nImpact: ${insight.impact}\n\nSuggested Action: ${insight.suggestedAction || "None provided"}\n\nPlease provide specific steps to address this insight and improve the project.`;

    promptAIAssistant(prompt);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "performance":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "timeline":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "resource":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "quality":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "risk":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t("Loading project data...")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" ref={reportContainerRef}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {t("Project Analysis Insights")}
          </h2>
          <p className="text-muted-foreground">
            {t(
              "AI-generated insights and recommendations for project improvement",
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
                {t("Export")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleExport("pdf")}
                disabled={isExporting}
              >
                <FileText className="mr-2 h-4 w-4" />
                {isExporting && exportFormat === "pdf"
                  ? t("Exporting PDF...")
                  : t("Export as PDF")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("json")}
                disabled={isExporting}
              >
                <FileText className="mr-2 h-4 w-4" />
                {isExporting && exportFormat === "json"
                  ? t("Exporting JSON...")
                  : t("Export as JSON")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                {t("Print Report")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => setShowShareDialog(true)}>
            <Share2 className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {t("Share")}
          </Button>

          <Button
            onClick={handleRefreshInsights}
            disabled={generatingInsights}
            className="flex items-center"
          >
            {generatingInsights ? (
              <Loader2
                className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 animate-spin`}
              />
            ) : (
              <Zap className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            )}
            {t("Generate New Insights")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Project Health Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {t("Project Health Overview")}
            </CardTitle>
            <CardDescription>
              {t("Current status of key project metrics")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t("Overall Progress")}</span>
                  <span>
                    {Math.round(
                      moduleProgress.reduce(
                        (acc, module) => acc + module.progress,
                        0,
                      ) / Math.max(1, moduleProgress.length),
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    Math.round(
                      moduleProgress.reduce(
                        (acc, module) => acc + module.progress,
                        0,
                      ) / Math.max(1, moduleProgress.length),
                    ) || 0
                  }
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t("Code Quality")}</span>
                  <span>{metrics?.codeQuality?.coverage || 0}%</span>
                </div>
                <Progress
                  value={metrics?.codeQuality?.coverage || 0}
                  className="h-2"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t("Timeline Adherence")}</span>
                  <span>
                    {Math.round(
                      ((metrics?.burndown?.planned || 100) /
                        (metrics?.burndown?.actual || 100)) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={
                    Math.round(
                      ((metrics?.burndown?.planned || 100) /
                        (metrics?.burndown?.actual || 100)) *
                        100,
                    ) || 0
                  }
                  className="h-2"
                />
              </div>
            </div>

            <div className="flex justify-between text-sm text-muted-foreground mt-4">
              <div className="flex items-center">
                <GitCommit className="h-4 w-4 mr-1" />
                <span>
                  {metrics?.totalCommits || 0} {t("commits")}
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                <span>
                  {metrics?.codeQuality?.bugs || 0} {t("issues")}
                </span>
              </div>
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                <span>
                  {metrics?.velocity || 0} {t("velocity")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Modules Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("Critical Modules")}</CardTitle>
            <CardDescription>
              {t("Modules requiring immediate attention")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[220px] pr-4">
              <div className="space-y-4">
                {moduleProgress
                  .filter((module) => module.progress < 50)
                  .slice(0, 5)
                  .map((module, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{module.module}</span>
                        <Badge
                          variant="outline"
                          className={getImpactColor(
                            module.progress < 30 ? "high" : "medium",
                          )}
                        >
                          {module.progress}%
                        </Badge>
                      </div>
                      <Progress value={module.progress} className="h-2 mb-1" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          {t("Tasks")}: {module.completedTasks}/
                          {module.totalTasks}
                        </span>
                        {module.lastActivity && (
                          <span>
                            {t("Last updated")}:{" "}
                            {new Date(module.lastActivity).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                {moduleProgress.filter((module) => module.progress < 50)
                  .length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Check className="h-8 w-8 mx-auto mb-2" />
                    {t("No critical modules at this time")}
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Timeline Analysis Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("Timeline Analysis")}</CardTitle>
            <CardDescription>
              {t("Project timeline and milestone status")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t("Planned vs Actual")}</span>
                  <span
                    className={`text-sm ${metrics?.burndown?.actual > metrics?.burndown?.planned ? "text-red-500" : "text-green-500"}`}
                  >
                    {metrics?.burndown?.actual > metrics?.burndown?.planned
                      ? t("Behind Schedule")
                      : t("On Track")}
                  </span>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        ((metrics?.burndown?.planned || 0) /
                          (metrics?.burndown?.actual || 1)) *
                          100,
                      )}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {t("Planned")}: {metrics?.burndown?.planned || 0}
                  </span>
                  <span>
                    {t("Actual")}: {metrics?.burndown?.actual || 0}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">{t("Upcoming Milestones")}</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between items-center">
                    <span>Beta Release</span>
                    <Badge>2 {t("weeks")}</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>User Testing</span>
                    <Badge>4 {t("weeks")}</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Production Release</span>
                    <Badge>8 {t("weeks")}</Badge>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("AI-Generated Project Insights")}</CardTitle>
          <CardDescription>
            {t(
              "Smart analysis of project data with actionable recommendations",
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium">{insight.title}</h3>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAIAssist(insight)}
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        {t("Explore")}
                      </Button>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {insight.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge className={getCategoryColor(insight.category)}>
                      {t(insight.category)}
                    </Badge>
                    <Badge className={getImpactColor(insight.impact)}>
                      {t("Impact")}: {t(insight.impact)}
                    </Badge>
                    {insight.actionable && (
                      <Badge variant="outline" className="bg-blue-50">
                        {t("Actionable")}
                      </Badge>
                    )}
                  </div>

                  {insight.suggestedAction && (
                    <div className="mt-3 p-2 bg-muted rounded-md">
                      <p className="text-sm font-medium">
                        {t("Suggested Action")}:
                      </p>
                      <p className="text-sm">{insight.suggestedAction}</p>
                    </div>
                  )}

                  <div className="flex items-center mt-3 text-xs text-muted-foreground">
                    <Clock className={`${isRTL ? "ml-1" : "mr-1"} h-3 w-3`} />
                    {new Date(insight.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm text-muted-foreground">
            <AlertTriangle
              className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4 text-yellow-500`}
            />
            {t(
              "These insights are AI-generated and should be reviewed by the team before taking action",
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Action Items Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("Recommended Actions")}</CardTitle>
          <CardDescription>
            {t("Prioritized actions to improve project health")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights
              .filter((insight) => insight.actionable)
              .map((insight, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full ${insight.impact === "high" ? "bg-red-100 text-red-800" : insight.impact === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"} mr-3 flex-shrink-0`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {insight.suggestedAction}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 ml-2"
                    onClick={() => handleAIAssist(insight)}
                  >
                    <GitBranch className="h-4 w-4 mr-1" />
                    {t("Plan")}
                  </Button>
                </div>
              ))}

            {insights.filter((insight) => insight.actionable).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Check className="h-8 w-8 mx-auto mb-2" />
                {t("No actionable items at this time")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Share Project Insights")}</DialogTitle>
            <DialogDescription>
              {t(
                "Share this project analysis report with team members or stakeholders",
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("Email Address")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">{t("Add a Note")}</Label>
              <Input
                id="note"
                placeholder={t("Optional message")}
                value={shareNote}
                onChange={(e) => setShareNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareDialog(false)}>
              {t("Cancel")}
            </Button>
            <Button onClick={handleShare} disabled={isSharingReport}>
              {isSharingReport ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("Sharing...")}
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  {t("Share Report")}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
