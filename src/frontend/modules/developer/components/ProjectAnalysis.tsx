import React, { useEffect, useMemo } from "react";
import { useAutoSave } from "@/frontend/hooks/useAutoSave";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Alert, AlertDescription } from "@/frontend/components/ui/alert";
import { Badge } from "@/frontend/components/ui/badge";
import { Button } from "@/frontend/components/ui/button";
import { Progress } from "@/frontend/components/ui/progress";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Separator } from "@/frontend/components/ui/separator";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/frontend/components/ui/popover";
import { Calendar } from "@/frontend/components/ui/calendar";
import { Checkbox } from "@/frontend/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  Calendar as CalendarIcon,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  CodeXml,
  Cog,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  Filter,
  Flag,
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  HardDrive,
  Info,
  Layers,
  Lightbulb,
  LineChart as LineChartIcon,
  List,
  ListTodo,
  Loader,
  Lock,
  LucideIcon,
  MessageSquare,
  Milestone,
  Package,
  PieChart as PieChartIcon,
  Play,
  Plus,
  RefreshCw,
  RotateCw,
  Search,
  Server,
  Settings,
  Shield,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Timer,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAI } from "@/frontend/contexts/AIContext";
import { format } from "date-fns";
import {
  getProjectStages,
  getCommitActivity,
  getModuleProgress,
  getAIRecommendations,
  getProjectMetrics,
  getProjectRoadmap,
  generateAIRecommendations,
  saveRecommendationFeedback,
  ProjectStage,
  ProjectTask,
  CommitActivity,
  ModuleProgress,
  AIRecommendation,
  ProjectMetrics,
  ProjectRoadmap,
} from "@/frontend/services/projectAnalysisService";

interface ProjectAnalysisProps {
  isRTL?: boolean;
  showAIRecommendations?: boolean;
  showCodeMetrics?: boolean;
}

export const ProjectAnalysis: React.FC<ProjectAnalysisProps> = ({
  isRTL = false,
  showAIRecommendations = true,
  showCodeMetrics = true,
}) => {
  const { direction } = useLanguage();
  const { promptAIAssistant } = useAI();
  const effectiveRTL = isRTL || direction === "rtl";

  // Auto-save user preferences and filters
  const {
    data: userPreferences,
    setData: setUserPreferences,
    isSaving,
  } = useAutoSave<{
    startDate: string;
    endDate: string;
    expandedStageId: string | null;
    expandedRecommendationId: string | null;
    stageFilter: string | undefined;
    statusFilter: string | undefined;
    recommendationCategoryFilter: string | undefined;
    recommendationStatusFilter: string | undefined;
    activeTab?: string;
  }>({
    key: "project-analysis-preferences",
    initialData: {
      startDate: (() => {
        const date = new Date();
        date.setDate(date.getDate() - 30); // 30 days ago
        return date.toISOString();
      })(),
      endDate: new Date().toISOString(),
      expandedStageId: null,
      expandedRecommendationId: null,
      stageFilter: undefined,
      statusFilter: undefined,
      recommendationCategoryFilter: undefined,
      recommendationStatusFilter: undefined,
      activeTab: "stages",
    },
    debounceTime: 500,
    toastMessages: {
      success: effectiveRTL
        ? "تم حفظ التفضيلات تلقائيًا"
        : "Preferences saved automatically",
      error: effectiveRTL
        ? "فشل في حفظ التفضيلات"
        : "Failed to save preferences",
    },
  });

  // State for project stages
  const [projectStages, setProjectStages] = React.useState<ProjectStage[]>([]);
  const [stagesLoading, setStagesLoading] = React.useState(true);
  const [stagesError, setStagesError] = React.useState<string | null>(null);

  // State for commit activity
  const [commitActivity, setCommitActivity] = React.useState<CommitActivity[]>(
    [],
  );
  const [commitActivityLoading, setCommitActivityLoading] =
    React.useState(true);
  const [commitActivityError, setCommitActivityError] = React.useState<
    string | null
  >(null);

  // State for module progress
  const [moduleProgress, setModuleProgress] = React.useState<ModuleProgress[]>(
    [],
  );
  const [moduleProgressLoading, setModuleProgressLoading] =
    React.useState(true);
  const [moduleProgressError, setModuleProgressError] = React.useState<
    string | null
  >(null);

  // State for AI recommendations
  const [aiRecommendations, setAIRecommendations] = React.useState<
    AIRecommendation[]
  >([]);
  const [aiRecommendationsLoading, setAIRecommendationsLoading] =
    React.useState(true);
  const [aiRecommendationsError, setAIRecommendationsError] = React.useState<
    string | null
  >(null);

  // State for project metrics
  const [projectMetrics, setProjectMetrics] =
    React.useState<ProjectMetrics | null>(null);
  const [metricsLoading, setMetricsLoading] = React.useState(true);
  const [metricsError, setMetricsError] = React.useState<string | null>(null);

  // State for project roadmap
  const [projectRoadmap, setProjectRoadmap] =
    React.useState<ProjectRoadmap | null>(null);
  const [roadmapLoading, setRoadmapLoading] = React.useState(true);
  const [roadmapError, setRoadmapError] = React.useState<string | null>(null);

  // Date range for commit activity - derived from saved preferences
  const startDate = React.useMemo(
    () => new Date(userPreferences.startDate),
    [userPreferences.startDate],
  );
  const endDate = React.useMemo(
    () => new Date(userPreferences.endDate),
    [userPreferences.endDate],
  );

  // Update date preferences
  const setStartDate = (date: Date) => {
    setUserPreferences({
      ...userPreferences,
      startDate: date.toISOString(),
    });
  };

  const setEndDate = (date: Date) => {
    setUserPreferences({
      ...userPreferences,
      endDate: date.toISOString(),
    });
  };

  // Expanded states - derived from saved preferences
  const expandedStageId = userPreferences.expandedStageId;
  const expandedRecommendationId = userPreferences.expandedRecommendationId;

  // Update expanded states
  const setExpandedStageId = (id: string | null) => {
    setUserPreferences({
      ...userPreferences,
      expandedStageId: id,
    });
  };

  const setExpandedRecommendationId = (id: string | null) => {
    setUserPreferences({
      ...userPreferences,
      expandedRecommendationId: id,
    });
  };

  // Filter states - derived from saved preferences
  const stageFilter = userPreferences.stageFilter;
  const statusFilter = userPreferences.statusFilter;
  const recommendationCategoryFilter =
    userPreferences.recommendationCategoryFilter;
  const recommendationStatusFilter = userPreferences.recommendationStatusFilter;

  // Update filter states
  const setStageFilter = (filter: string | undefined) => {
    setUserPreferences({
      ...userPreferences,
      stageFilter: filter,
    });
  };

  const setStatusFilter = (filter: string | undefined) => {
    setUserPreferences({
      ...userPreferences,
      statusFilter: filter,
    });
  };

  const setRecommendationCategoryFilter = (filter: string | undefined) => {
    setUserPreferences({
      ...userPreferences,
      recommendationCategoryFilter: filter,
    });
  };

  const setRecommendationStatusFilter = (filter: string | undefined) => {
    setUserPreferences({
      ...userPreferences,
      recommendationStatusFilter: filter,
    });
  };

  // Fetch project stages
  useEffect(() => {
    const fetchProjectStages = async () => {
      setStagesLoading(true);
      setStagesError(null);
      try {
        const stages = await getProjectStages();
        setProjectStages(stages);
      } catch (error) {
        console.error("Error fetching project stages:", error);
        setStagesError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب مراحل المشروع"
            : "An error occurred while fetching project stages",
        );
      } finally {
        setStagesLoading(false);
      }
    };

    fetchProjectStages();
  }, [effectiveRTL]);

  // Fetch commit activity
  useEffect(() => {
    const fetchCommitActivity = async () => {
      setCommitActivityLoading(true);
      setCommitActivityError(null);
      try {
        const activity = await getCommitActivity(startDate, endDate);
        setCommitActivity(activity);
      } catch (error) {
        console.error("Error fetching commit activity:", error);
        setCommitActivityError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب نشاط الالتزامات"
            : "An error occurred while fetching commit activity",
        );
      } finally {
        setCommitActivityLoading(false);
      }
    };

    fetchCommitActivity();
  }, [effectiveRTL, startDate, endDate]);

  // Fetch module progress
  useEffect(() => {
    const fetchModuleProgress = async () => {
      setModuleProgressLoading(true);
      setModuleProgressError(null);
      try {
        const progress = await getModuleProgress();
        setModuleProgress(progress);
      } catch (error) {
        console.error("Error fetching module progress:", error);
        setModuleProgressError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب تقدم الوحدات"
            : "An error occurred while fetching module progress",
        );
      } finally {
        setModuleProgressLoading(false);
      }
    };

    fetchModuleProgress();
  }, [effectiveRTL]);

  // Fetch AI recommendations
  useEffect(() => {
    if (!showAIRecommendations) return;

    const fetchAIRecommendations = async () => {
      setAIRecommendationsLoading(true);
      setAIRecommendationsError(null);
      try {
        const recommendations = await getAIRecommendations();
        setAIRecommendations(recommendations);
      } catch (error) {
        console.error("Error fetching AI recommendations:", error);
        setAIRecommendationsError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب توصيات الذكاء الاصطناعي"
            : "An error occurred while fetching AI recommendations",
        );
      } finally {
        setAIRecommendationsLoading(false);
      }
    };

    fetchAIRecommendations();
  }, [effectiveRTL, showAIRecommendations]);

  // Fetch project metrics
  useEffect(() => {
    if (!showCodeMetrics) return;

    const fetchProjectMetrics = async () => {
      setMetricsLoading(true);
      setMetricsError(null);
      try {
        const metrics = await getProjectMetrics();
        setProjectMetrics(metrics);
      } catch (error) {
        console.error("Error fetching project metrics:", error);
        setMetricsError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب مقاييس المشروع"
            : "An error occurred while fetching project metrics",
        );
      } finally {
        setMetricsLoading(false);
      }
    };

    fetchProjectMetrics();
  }, [effectiveRTL, showCodeMetrics]);

  // Fetch project roadmap
  useEffect(() => {
    const fetchProjectRoadmap = async () => {
      setRoadmapLoading(true);
      setRoadmapError(null);
      try {
        const roadmap = await getProjectRoadmap();
        setProjectRoadmap(roadmap);
      } catch (error) {
        console.error("Error fetching project roadmap:", error);
        setRoadmapError(
          effectiveRTL
            ? "حدث خطأ أثناء جلب خارطة طريق المشروع"
            : "An error occurred while fetching project roadmap",
        );
      } finally {
        setRoadmapLoading(false);
      }
    };

    fetchProjectRoadmap();
  }, [effectiveRTL]);

  // Handle refresh all data
  const handleRefreshAll = async () => {
    try {
      setStagesLoading(true);
      setCommitActivityLoading(true);
      setModuleProgressLoading(true);
      if (showAIRecommendations) setAIRecommendationsLoading(true);
      if (showCodeMetrics) setMetricsLoading(true);
      setRoadmapLoading(true);

      const promises = [
        getProjectStages(),
        getCommitActivity(startDate, endDate),
        getModuleProgress(),
        getProjectRoadmap(),
      ];

      if (showAIRecommendations) {
        promises.push(getAIRecommendations());
      }

      if (showCodeMetrics) {
        promises.push(getProjectMetrics());
      }

      const results = await Promise.all(promises);

      setProjectStages(results[0]);
      setCommitActivity(results[1]);
      setModuleProgress(results[2]);
      setProjectRoadmap(results[3]);

      let index = 4;
      if (showAIRecommendations) {
        setAIRecommendations(results[index]);
        index++;
      }

      if (showCodeMetrics) {
        setProjectMetrics(results[index]);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setStagesLoading(false);
      setCommitActivityLoading(false);
      setModuleProgressLoading(false);
      if (showAIRecommendations) setAIRecommendationsLoading(false);
      if (showCodeMetrics) setMetricsLoading(false);
      setRoadmapLoading(false);
    }
  };

  // Generate new AI recommendations
  const handleGenerateRecommendations = async () => {
    try {
      setAIRecommendationsLoading(true);
      // Gather project data for context
      const projectData = {
        stages: projectStages,
        metrics: projectMetrics,
        moduleProgress,
      };

      const recommendations = await generateAIRecommendations(projectData);
      setAIRecommendations((prev) => [...recommendations, ...prev]);
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
    } finally {
      setAIRecommendationsLoading(false);
    }
  };

  // Handle recommendation feedback
  const handleRecommendationFeedback = async (
    recommendationId: string,
    status: AIRecommendation["status"],
  ) => {
    try {
      await saveRecommendationFeedback(recommendationId, status);
      // Update local state
      setAIRecommendations((prev) =>
        prev.map((rec) =>
          rec.id === recommendationId ? { ...rec, status } : rec,
        ),
      );
    } catch (error) {
      console.error("Error saving recommendation feedback:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Export data as JSON
  const handleExportData = (data: any, filename: string) => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Get task status icon
  const getTaskStatusIcon = (status: string): React.ReactNode => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Loader className="h-4 w-4 text-blue-500" />;
      case "planned":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "blocked":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Get task priority badge variant
  const getTaskPriorityBadgeVariant = (
    priority: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (priority) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "secondary";
    }
  };

  // Get recommendation category icon
  const getRecommendationCategoryIcon = (category: string): React.ReactNode => {
    switch (category) {
      case "performance":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "security":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "ux":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "code-quality":
        return <Code className="h-4 w-4 text-green-500" />;
      case "feature":
        return <Star className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Get recommendation status badge variant
  const getRecommendationStatusBadgeVariant = (
    status: string,
  ): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case "implemented":
        return "default";
      case "accepted":
        return "secondary";
      case "in-review":
        return "outline";
      case "rejected":
        return "destructive";
      case "new":
        return "outline";
      default:
        return "outline";
    }
  };

  // Calculate overall project progress
  const overallProgress = useMemo(() => {
    if (projectStages.length === 0) return 0;

    const totalWeight = projectStages.reduce((sum, stage) => sum + 1, 0);
    const weightedProgress = projectStages.reduce(
      (sum, stage) => sum + stage.progress / 100,
      0,
    );

    return Math.round((weightedProgress / totalWeight) * 100);
  }, [projectStages]);

  // Filter stages based on status
  const filteredStages = useMemo(() => {
    if (!statusFilter) return projectStages;
    return projectStages.filter((stage) => stage.status === statusFilter);
  }, [projectStages, statusFilter]);

  // Filter recommendations based on category and status
  const filteredRecommendations = useMemo(() => {
    let filtered = aiRecommendations;

    if (recommendationCategoryFilter) {
      filtered = filtered.filter(
        (rec) => rec.category === recommendationCategoryFilter,
      );
    }

    if (recommendationStatusFilter) {
      filtered = filtered.filter(
        (rec) => rec.status === recommendationStatusFilter,
      );
    }

    return filtered;
  }, [
    aiRecommendations,
    recommendationCategoryFilter,
    recommendationStatusFilter,
  ]);

  // COLORS for charts
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
  ];

  // Status colors
  const STATUS_COLORS = {
    completed: "#10b981", // green-500
    "in-progress": "#3b82f6", // blue-500
    planned: "#f59e0b", // amber-500
    delayed: "#ef4444", // red-500
    blocked: "#ef4444", // red-500
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {effectiveRTL ? "تحليل المشروع" : "Project Analysis"}
        </h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {isSaving && (
            <div className="text-sm text-muted-foreground flex items-center">
              <RefreshCw className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0 animate-spin" />
              {effectiveRTL ? "جاري الحفظ..." : "Saving..."}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshAll}
            disabled={
              stagesLoading ||
              commitActivityLoading ||
              moduleProgressLoading ||
              (showAIRecommendations && aiRecommendationsLoading) ||
              (showCodeMetrics && metricsLoading) ||
              roadmapLoading
            }
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 ${stagesLoading || commitActivityLoading || moduleProgressLoading || (showAIRecommendations && aiRecommendationsLoading) || (showCodeMetrics && metricsLoading) || roadmapLoading ? "animate-spin" : ""}`}
            />
            {effectiveRTL ? "تحديث الكل" : "Refresh All"}
          </Button>
        </div>
      </div>

      {/* Project Overview Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {effectiveRTL ? "نظرة عامة على المشروع" : "Project Overview"}
          </CardTitle>
          <CardDescription>
            {effectiveRTL
              ? "ملخص تقدم المشروع والمقاييس الرئيسية"
              : "Summary of project progress and key metrics"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Progress */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-2">
                  <span className="text-2xl font-bold">{overallProgress}%</span>
                  <p className="text-sm text-muted-foreground">
                    {effectiveRTL ? "إجمالي التقدم" : "Overall Progress"}
                  </p>
                </div>
                <Progress
                  value={overallProgress}
                  className="h-2"
                  indicatorClassName={
                    overallProgress > 75
                      ? "bg-green-500"
                      : overallProgress > 50
                        ? "bg-blue-500"
                        : overallProgress > 25
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }
                />
              </CardContent>
            </Card>

            {/* Active Stages */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <Layers className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {
                        projectStages.filter((s) => s.status === "in-progress")
                          .length
                      }
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {effectiveRTL ? "المراحل النشطة" : "Active Stages"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Completed Tasks */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {projectStages.reduce(
                        (sum, stage) =>
                          sum +
                          stage.tasks.filter((t) => t.status === "completed")
                            .length,
                        0,
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {effectiveRTL ? "المهام المكتملة" : "Completed Tasks"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Remaining Tasks */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <ListTodo className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-2xl font-bold">
                      {projectStages.reduce(
                        (sum, stage) =>
                          sum +
                          stage.tasks.filter((t) => t.status !== "completed")
                            .length,
                        0,
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {effectiveRTL ? "المهام المتبقية" : "Remaining Tasks"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs
        defaultValue={userPreferences.activeTab || "stages"}
        className="w-full"
        onValueChange={(value) =>
          setUserPreferences({ ...userPreferences, activeTab: value })
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="stages">
            <Layers className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "مراحل المشروع" : "Project Stages"}
          </TabsTrigger>
          <TabsTrigger value="activity">
            <GitCommit className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "نشاط التطوير" : "Development Activity"}
          </TabsTrigger>
          <TabsTrigger value="modules">
            <Package className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "تقدم الوحدات" : "Module Progress"}
          </TabsTrigger>
          <TabsTrigger value="roadmap">
            <Milestone className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "خارطة الطريق" : "Roadmap"}
          </TabsTrigger>
          {showAIRecommendations && (
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "توصيات الذكاء الاصطناعي" : "AI Recommendations"}
            </TabsTrigger>
          )}
          {showCodeMetrics && (
            <TabsTrigger value="metrics">
              <Activity className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "مقاييس الكود" : "Code Metrics"}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Project Stages Tab */}
        <TabsContent value="stages" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Label htmlFor="status-filter">
                {effectiveRTL ? "تصفية حسب الحالة:" : "Filter by status:"}
              </Label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) =>
                  setStatusFilter(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger id="status-filter" className="w-[180px]">
                  <SelectValue
                    placeholder={effectiveRTL ? "جميع الحالات" : "All Statuses"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {effectiveRTL ? "جميع الحالات" : "All Statuses"}
                  </SelectItem>
                  <SelectItem value="completed">
                    {effectiveRTL ? "مكتمل" : "Completed"}
                  </SelectItem>
                  <SelectItem value="in-progress">
                    {effectiveRTL ? "قيد التقدم" : "In Progress"}
                  </SelectItem>
                  <SelectItem value="planned">
                    {effectiveRTL ? "مخطط" : "Planned"}
                  </SelectItem>
                  <SelectItem value="delayed">
                    {effectiveRTL ? "متأخر" : "Delayed"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportData(projectStages, "project-stages")}
            >
              <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "تصدير البيانات" : "Export Data"}
            </Button>
          </div>

          {stagesLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : stagesError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{stagesError}</AlertDescription>
            </Alert>
          ) : filteredStages.length === 0 ? (
            <div className="text-center py-12">
              <Layers className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {effectiveRTL ? "لا توجد مراحل" : "No Stages Found"}
              </h3>
              <p className="text-muted-foreground">
                {effectiveRTL
                  ? "لم يتم العثور على مراحل مشروع تطابق معايير التصفية الخاصة بك"
                  : "No project stages found matching your filter criteria"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Project Timeline */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL
                      ? "الجدول الزمني للمشروع"
                      : "Project Timeline"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                    <div className="space-y-8">
                      {filteredStages.map((stage) => (
                        <div key={stage.id} className="relative pl-10">
                          {/* Timeline dot */}
                          <div
                            className="absolute left-2 top-1.5 w-5 h-5 rounded-full border-4"
                            style={{
                              borderColor:
                                STATUS_COLORS[
                                  stage.status as keyof typeof STATUS_COLORS
                                ] || "#64748b",
                              backgroundColor: "white",
                            }}
                          />

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium">
                                {stage.name}
                              </h3>
                              <Badge
                                className="ml-2"
                                variant={
                                  stage.status === "completed"
                                    ? "default"
                                    : stage.status === "in-progress"
                                      ? "secondary"
                                      : stage.status === "delayed"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {stage.status === "completed"
                                  ? effectiveRTL
                                    ? "مكتمل"
                                    : "Completed"
                                  : stage.status === "in-progress"
                                    ? effectiveRTL
                                      ? "قيد التقدم"
                                      : "In Progress"
                                    : stage.status === "planned"
                                      ? effectiveRTL
                                        ? "مخطط"
                                        : "Planned"
                                      : effectiveRTL
                                        ? "متأخر"
                                        : "Delayed"}
                              </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              {formatDate(stage.startDate)} -{" "}
                              {stage.endDate
                                ? formatDate(stage.endDate)
                                : effectiveRTL
                                  ? "مستمر"
                                  : "Ongoing"}
                            </div>

                            <div className="flex items-center">
                              <div className="flex-1 mr-4">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">
                                    {effectiveRTL ? "التقدم" : "Progress"}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {stage.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={stage.progress}
                                  className="h-2"
                                  indicatorClassName={
                                    stage.status === "completed"
                                      ? "bg-green-500"
                                      : stage.status === "in-progress"
                                        ? "bg-blue-500"
                                        : stage.status === "delayed"
                                          ? "bg-red-500"
                                          : "bg-yellow-500"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stages with Tasks */}
              {filteredStages.map((stage) => (
                <Card key={stage.id}>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedStageId(
                        expandedStageId === stage.id ? null : stage.id,
                      )
                    }
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        {stage.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : stage.status === "in-progress" ? (
                          <Loader className="h-5 w-5 text-blue-500 mr-2" />
                        ) : stage.status === "delayed" ? (
                          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                        )}
                        {stage.name}
                      </CardTitle>
                      <div className="flex items-center">
                        <Badge
                          variant={
                            stage.status === "completed"
                              ? "default"
                              : stage.status === "in-progress"
                                ? "secondary"
                                : stage.status === "delayed"
                                  ? "destructive"
                                  : "outline"
                          }
                          className="mr-2"
                        >
                          {stage.progress}%
                        </Badge>
                        {expandedStageId === stage.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <CardDescription>{stage.description}</CardDescription>
                  </CardHeader>

                  {expandedStageId === stage.id && (
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>
                            {effectiveRTL ? "المهام" : "Tasks"} (
                            {stage.tasks.length})
                          </span>
                          <span>
                            {effectiveRTL ? "المكتملة" : "Completed"}:{" "}
                            {
                              stage.tasks.filter(
                                (t) => t.status === "completed",
                              ).length
                            }
                          </span>
                        </div>

                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {stage.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="border rounded-md p-3 hover:bg-muted/50"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start space-x-3 rtl:space-x-reverse">
                                    {getTaskStatusIcon(task.status)}
                                    <div>
                                      <div className="font-medium">
                                        {task.name}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        {task.description}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge
                                    variant={getTaskPriorityBadgeVariant(
                                      task.priority,
                                    )}
                                  >
                                    {task.priority === "critical"
                                      ? effectiveRTL
                                        ? "حرج"
                                        : "Critical"
                                      : task.priority === "high"
                                        ? effectiveRTL
                                          ? "مرتفع"
                                          : "High"
                                        : task.priority === "medium"
                                          ? effectiveRTL
                                            ? "متوسط"
                                            : "Medium"
                                          : effectiveRTL
                                            ? "منخفض"
                                            : "Low"}
                                  </Badge>
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                  {task.assignee && (
                                    <div>
                                      <span className="font-medium">
                                        {effectiveRTL ? "المكلف:" : "Assignee:"}{" "}
                                      </span>
                                      {task.assignee}
                                    </div>
                                  )}
                                  <div>
                                    <span className="font-medium">
                                      {effectiveRTL
                                        ? "تاريخ الإنشاء:"
                                        : "Created:"}{" "}
                                    </span>
                                    {formatDate(task.createdAt)}
                                  </div>
                                  {task.completedAt && (
                                    <div>
                                      <span className="font-medium">
                                        {effectiveRTL
                                          ? "تاريخ الإكمال:"
                                          : "Completed:"}{" "}
                                      </span>
                                      {formatDate(task.completedAt)}
                                    </div>
                                  )}
                                  {task.estimatedHours && (
                                    <div>
                                      <span className="font-medium">
                                        {effectiveRTL
                                          ? "الساعات المقدرة:"
                                          : "Est. Hours:"}{" "}
                                      </span>
                                      {task.estimatedHours}
                                    </div>
                                  )}
                                  {task.actualHours && (
                                    <div>
                                      <span className="font-medium">
                                        {effectiveRTL
                                          ? "الساعات الفعلية:"
                                          : "Actual Hours:"}{" "}
                                      </span>
                                      {task.actualHours}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Development Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <Label htmlFor="start-date">
                {effectiveRTL ? "تاريخ البدء:" : "Start Date:"}
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                className="w-[180px]"
              />

              <Label htmlFor="end-date">
                {effectiveRTL ? "تاريخ الانتهاء:" : "End Date:"}
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="w-[180px]"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportData(commitActivity, "commit-activity")
              }
            >
              <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "تصدير البيانات" : "Export Data"}
            </Button>
          </div>

          {commitActivityLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : commitActivityError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{commitActivityError}</AlertDescription>
            </Alert>
          ) : commitActivity.length === 0 ? (
            <div className="text-center py-12">
              <GitCommit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {effectiveRTL ? "لا يوجد نشاط" : "No Activity Found"}
              </h3>
              <p className="text-muted-foreground">
                {effectiveRTL
                  ? "لم يتم العثور على نشاط التزام في النطاق الزمني المحدد"
                  : "No commit activity found in the specified time range"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Commit Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL ? "نشاط الالتزام" : "Commit Activity"}
                  </CardTitle>
                  <CardDescription>
                    {effectiveRTL
                      ? "نشاط الالتزام خلال الفترة المحددة"
                      : "Commit activity during the selected period"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={commitActivity}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 60,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="count"
                          name={
                            effectiveRTL ? "عدد الالتزامات" : "Commit Count"
                          }
                          fill="#8884d8"
                        />
                        <Bar
                          dataKey="files"
                          name={
                            effectiveRTL ? "الملفات المتغيرة" : "Files Changed"
                          }
                          fill="#82ca9d"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Commit Details Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL ? "تفاصيل الالتزام" : "Commit Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b">
                      <div>{effectiveRTL ? "التاريخ" : "Date"}</div>
                      <div>{effectiveRTL ? "العدد" : "Count"}</div>
                      <div>{effectiveRTL ? "الملفات" : "Files"}</div>
                      <div>{effectiveRTL ? "المؤلف" : "Author"}</div>
                      <div>{effectiveRTL ? "التغييرات" : "Changes"}</div>
                    </div>
                    <div className="divide-y">
                      {commitActivity.map((activity, index) => (
                        <div
                          key={`${activity.date}-${index}`}
                          className="grid grid-cols-5 gap-4 p-4 hover:bg-muted/50"
                        >
                          <div>{formatDate(activity.date)}</div>
                          <div>{activity.count}</div>
                          <div>{activity.files || "N/A"}</div>
                          <div>{activity.author || "N/A"}</div>
                          <div>
                            {activity.additions && activity.deletions ? (
                              <span>
                                <span className="text-green-500">
                                  +{activity.additions}
                                </span>{" "}
                                /{" "}
                                <span className="text-red-500">
                                  -{activity.deletions}
                                </span>
                              </span>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Module Progress Tab */}
        <TabsContent value="modules" className="space-y-6">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportData(moduleProgress, "module-progress")
              }
            >
              <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "تصدير البيانات" : "Export Data"}
            </Button>
          </div>

          {moduleProgressLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : moduleProgressError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{moduleProgressError}</AlertDescription>
            </Alert>
          ) : moduleProgress.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {effectiveRTL ? "لا توجد وحدات" : "No Modules Found"}
              </h3>
              <p className="text-muted-foreground">
                {effectiveRTL
                  ? "لم يتم العثور على بيانات تقدم الوحدة"
                  : "No module progress data found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Module Progress Chart */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL ? "تقدم الوحدة" : "Module Progress"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={moduleProgress}
                        layout="vertical"
                        margin={{
                          top: 20,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="module" type="category" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="progress"
                          name={effectiveRTL ? "التقدم (٪)" : "Progress (%)"}
                          fill="#8884d8"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Module Cards */}
              {moduleProgress.map((module) => (
                <Card key={module.module}>
                  <CardHeader>
                    <CardTitle>{module.module}</CardTitle>
                    <CardDescription>
                      {effectiveRTL
                        ? `${module.completedTasks} من ${module.totalTasks} مهام مكتملة`
                        : `${module.completedTasks} of ${module.totalTasks} tasks completed`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">
                            {effectiveRTL ? "التقدم" : "Progress"}
                          </span>
                          <span className="text-sm font-medium">
                            {module.progress}%
                          </span>
                        </div>
                        <Progress
                          value={module.progress}
                          className="h-2"
                          indicatorClassName={
                            module.progress > 75
                              ? "bg-green-500"
                              : module.progress > 50
                                ? "bg-blue-500"
                                : module.progress > 25
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }
                        />
                      </div>

                      <div className="text-sm">
                        <div className="font-medium mb-1">
                          {effectiveRTL ? "آخر نشاط" : "Last Activity"}
                        </div>
                        <div className="text-muted-foreground">
                          {module.lastActivity
                            ? formatDate(module.lastActivity)
                            : effectiveRTL
                              ? "غير متوفر"
                              : "N/A"}
                        </div>
                      </div>

                      {module.contributors &&
                        module.contributors.length > 0 && (
                          <div className="text-sm">
                            <div className="font-medium mb-1">
                              {effectiveRTL ? "المساهمون" : "Contributors"}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {module.contributors.map(
                                (contributor: string) => (
                                  <Badge
                                    key={contributor}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {contributor}
                                  </Badge>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* AI Development Suggestions Tab */}
        <TabsContent value="ai" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Label htmlFor="recommendation-category-filter">
                {effectiveRTL ? "تصفية حسب الفئة:" : "Filter by category:"}
              </Label>
              <Select
                value={recommendationCategoryFilter || "all"}
                onValueChange={(value) =>
                  setRecommendationCategoryFilter(
                    value === "all" ? undefined : value,
                  )
                }
              >
                <SelectTrigger
                  id="recommendation-category-filter"
                  className="w-[180px]"
                >
                  <SelectValue
                    placeholder={
                      effectiveRTL ? "جميع الفئات" : "All Categories"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {effectiveRTL ? "جميع الفئات" : "All Categories"}
                  </SelectItem>
                  <SelectItem value="performance">
                    {effectiveRTL ? "الأداء" : "Performance"}
                  </SelectItem>
                  <SelectItem value="security">
                    {effectiveRTL ? "الأمان" : "Security"}
                  </SelectItem>
                  <SelectItem value="code-quality">
                    {effectiveRTL ? "جودة الكود" : "Code Quality"}
                  </SelectItem>
                  <SelectItem value="ux">
                    {effectiveRTL ? "تجربة المستخدم" : "UX"}
                  </SelectItem>
                  <SelectItem value="feature">
                    {effectiveRTL ? "الميزات" : "Features"}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Label htmlFor="recommendation-status-filter">
                {effectiveRTL ? "تصفية حسب الحالة:" : "Filter by status:"}
              </Label>
              <Select
                value={recommendationStatusFilter || "all"}
                onValueChange={(value) =>
                  setRecommendationStatusFilter(
                    value === "all" ? undefined : value,
                  )
                }
              >
                <SelectTrigger
                  id="recommendation-status-filter"
                  className="w-[180px]"
                >
                  <SelectValue
                    placeholder={effectiveRTL ? "جميع الحالات" : "All Statuses"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {effectiveRTL ? "جميع الحالات" : "All Statuses"}
                  </SelectItem>
                  <SelectItem value="new">
                    {effectiveRTL ? "جديد" : "New"}
                  </SelectItem>
                  <SelectItem value="in-review">
                    {effectiveRTL ? "قيد المراجعة" : "In Review"}
                  </SelectItem>
                  <SelectItem value="accepted">
                    {effectiveRTL ? "مقبول" : "Accepted"}
                  </SelectItem>
                  <SelectItem value="implemented">
                    {effectiveRTL ? "منفذ" : "Implemented"}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {effectiveRTL ? "مرفوض" : "Rejected"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateRecommendations}
                disabled={aiRecommendationsLoading}
              >
                <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {effectiveRTL
                  ? "توليد توصيات جديدة"
                  : "Generate New Recommendations"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleExportData(aiRecommendations, "ai-recommendations")
                }
              >
                <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {effectiveRTL ? "تصدير البيانات" : "Export Data"}
              </Button>
            </div>
          </div>

          {aiRecommendationsLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : aiRecommendationsError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{aiRecommendationsError}</AlertDescription>
            </Alert>
          ) : filteredRecommendations.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {effectiveRTL ? "لا توجد توصيات" : "No Recommendations Found"}
              </h3>
              <p className="text-muted-foreground">
                {effectiveRTL
                  ? "لم يتم العثور على توصيات تطابق معايير التصفية الخاصة بك"
                  : "No recommendations found matching your filter criteria"}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleGenerateRecommendations}
              >
                <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {effectiveRTL
                  ? "توليد توصيات جديدة"
                  : "Generate New Recommendations"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* AI Recommendations */}
              {filteredRecommendations.map((recommendation) => (
                <Card key={recommendation.id}>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedRecommendationId(
                        expandedRecommendationId === recommendation.id
                          ? null
                          : recommendation.id,
                      )
                    }
                  >
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center text-lg">
                        {getRecommendationCategoryIcon(recommendation.category)}
                        <span className="ml-2">{recommendation.title}</span>
                      </CardTitle>
                      <div className="flex items-center">
                        <Badge
                          variant={getRecommendationStatusBadgeVariant(
                            recommendation.status,
                          )}
                          className="mr-2"
                        >
                          {recommendation.status === "new"
                            ? effectiveRTL
                              ? "جديد"
                              : "New"
                            : recommendation.status === "in-review"
                              ? effectiveRTL
                                ? "قيد المراجعة"
                                : "In Review"
                              : recommendation.status === "accepted"
                                ? effectiveRTL
                                  ? "مقبول"
                                  : "Accepted"
                                : recommendation.status === "implemented"
                                  ? effectiveRTL
                                    ? "منفذ"
                                    : "Implemented"
                                  : effectiveRTL
                                    ? "مرفوض"
                                    : "Rejected"}
                        </Badge>
                        {expandedRecommendationId === recommendation.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <CardDescription>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Badge
                          variant="outline"
                          className={`${recommendation.priority === "high" ? "border-red-500 text-red-500" : recommendation.priority === "medium" ? "border-yellow-500 text-yellow-500" : "border-blue-500 text-blue-500"}`}
                        >
                          {recommendation.priority === "high"
                            ? effectiveRTL
                              ? "أولوية عالية"
                              : "High Priority"
                            : recommendation.priority === "medium"
                              ? effectiveRTL
                                ? "أولوية متوسطة"
                                : "Medium Priority"
                              : effectiveRTL
                                ? "أولوية منخفضة"
                                : "Low Priority"}
                        </Badge>
                        {recommendation.category && (
                          <Badge variant="secondary">
                            {recommendation.category === "performance"
                              ? effectiveRTL
                                ? "الأداء"
                                : "Performance"
                              : recommendation.category === "security"
                                ? effectiveRTL
                                  ? "الأمان"
                                  : "Security"
                                : recommendation.category === "code-quality"
                                  ? effectiveRTL
                                    ? "جودة الكود"
                                    : "Code Quality"
                                  : recommendation.category === "ux"
                                    ? effectiveRTL
                                      ? "تجربة المستخدم"
                                      : "UX"
                                    : effectiveRTL
                                      ? "الميزات"
                                      : "Features"}
                          </Badge>
                        )}
                        {recommendation.relatedModule && (
                          <Badge variant="outline">
                            {recommendation.relatedModule}
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {formatDate(recommendation.createdAt)}
                        </span>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  {expandedRecommendationId === recommendation.id && (
                    <>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-1">
                              {effectiveRTL ? "الوصف" : "Description"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {recommendation.description}
                            </p>
                          </div>

                          {recommendation.implementationDifficulty && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                {effectiveRTL
                                  ? "صعوبة التنفيذ"
                                  : "Implementation Difficulty"}
                              </h4>
                              <Badge
                                variant="outline"
                                className={`${recommendation.implementationDifficulty === "hard" ? "border-red-500 text-red-500" : recommendation.implementationDifficulty === "medium" ? "border-yellow-500 text-yellow-500" : "border-green-500 text-green-500"}`}
                              >
                                {recommendation.implementationDifficulty ===
                                "hard"
                                  ? effectiveRTL
                                    ? "صعب"
                                    : "Hard"
                                  : recommendation.implementationDifficulty ===
                                      "medium"
                                    ? effectiveRTL
                                      ? "متوسط"
                                      : "Medium"
                                    : effectiveRTL
                                      ? "سهل"
                                      : "Easy"}
                              </Badge>
                              {recommendation.estimatedHours && (
                                <span className="text-sm text-muted-foreground ml-2">
                                  {effectiveRTL
                                    ? `الوقت المقدر: ${recommendation.estimatedHours} ساعة`
                                    : `Estimated time: ${recommendation.estimatedHours} hours`}
                                </span>
                              )}
                            </div>
                          )}

                          {recommendation.codeSnippet && (
                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                {effectiveRTL ? "مقتطف الكود" : "Code Snippet"}
                              </h4>
                              <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                                <code>{recommendation.codeSnippet}</code>
                              </pre>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRecommendationFeedback(
                                recommendation.id,
                                "accepted",
                              )
                            }
                            disabled={recommendation.status === "accepted"}
                          >
                            <Check className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {effectiveRTL ? "قبول" : "Accept"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRecommendationFeedback(
                                recommendation.id,
                                "implemented",
                              )
                            }
                            disabled={recommendation.status === "implemented"}
                          >
                            <CheckCircle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {effectiveRTL ? "تم التنفيذ" : "Implemented"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleRecommendationFeedback(
                                recommendation.id,
                                "rejected",
                              )
                            }
                            disabled={recommendation.status === "rejected"}
                          >
                            <X className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                            {effectiveRTL ? "رفض" : "Reject"}
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            promptAIAssistant(
                              `Help me implement this recommendation: ${recommendation.title}\n\nDescription: ${recommendation.description}${recommendation.codeSnippet ? `\n\nCode snippet: ${recommendation.codeSnippet}` : ""}`,
                            )
                          }
                        >
                          <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                          {effectiveRTL
                            ? "اطلب المساعدة في التنفيذ"
                            : "Ask AI for Implementation Help"}
                        </Button>
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Code Analysis Tab */}
        <TabsContent value="code-analysis" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {effectiveRTL ? "تحليل الكود" : "Code Analysis"}
            </h3>
            <Button
              onClick={() =>
                promptAIAssistant(
                  "Analyze my codebase and provide recommendations for improvement",
                )
              }
            >
              <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "تحليل الكود" : "Analyze Code"}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {effectiveRTL
                  ? "تحليل الكود باستخدام الذكاء الاصطناعي"
                  : "AI Code Analysis"}
              </CardTitle>
              <CardDescription>
                {effectiveRTL
                  ? "استخدم الذكاء الاصطناعي لتحليل الكود وتقديم توصيات للتحسين"
                  : "Use AI to analyze code and provide recommendations for improvement"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="analysis-type">
                      {effectiveRTL ? "نوع التحليل" : "Analysis Type"}
                    </Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="analysis-type">
                        <SelectValue
                          placeholder={
                            effectiveRTL
                              ? "اختر نوع التحليل"
                              : "Select analysis type"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          {effectiveRTL
                            ? "تحليل شامل"
                            : "Comprehensive Analysis"}
                        </SelectItem>
                        <SelectItem value="performance">
                          {effectiveRTL
                            ? "تحليل الأداء"
                            : "Performance Analysis"}
                        </SelectItem>
                        <SelectItem value="security">
                          {effectiveRTL ? "تحليل الأمان" : "Security Analysis"}
                        </SelectItem>
                        <SelectItem value="code-quality">
                          {effectiveRTL
                            ? "تحليل جودة الكود"
                            : "Code Quality Analysis"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="repository-url">
                      {effectiveRTL
                        ? "عنوان URL للمستودع (اختياري)"
                        : "Repository URL (Optional)"}
                    </Label>
                    <Input
                      id="repository-url"
                      placeholder={
                        effectiveRTL
                          ? "https://github.com/username/repo"
                          : "https://github.com/username/repo"
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="code-snippet">
                    {effectiveRTL
                      ? "مقتطف الكود (اختياري)"
                      : "Code Snippet (Optional)"}
                  </Label>
                  <Textarea
                    id="code-snippet"
                    placeholder={
                      effectiveRTL
                        ? "الصق الكود هنا للتحليل..."
                        : "Paste code here for analysis..."
                    }
                    className="min-h-[200px] font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="analysis-context">
                    {effectiveRTL
                      ? "سياق إضافي (اختياري)"
                      : "Additional Context (Optional)"}
                  </Label>
                  <Textarea
                    id="analysis-context"
                    placeholder={
                      effectiveRTL
                        ? "قدم أي سياق إضافي للتحليل..."
                        : "Provide any additional context for the analysis..."
                    }
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {effectiveRTL ? "تحليل الكود" : "Analyze Code"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {effectiveRTL ? "تحليل الكود السابق" : "Previous Code Analyses"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {effectiveRTL ? "لا يوجد تحليل سابق" : "No Previous Analyses"}
                </h3>
                <p className="text-muted-foreground">
                  {effectiveRTL
                    ? "قم بتحليل الكود للحصول على توصيات للتحسين"
                    : "Analyze code to get recommendations for improvement"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Development Roadmap Tab */}
        <TabsContent value="roadmap" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {effectiveRTL ? "خارطة طريق التطوير" : "Development Roadmap"}
            </h3>
            <Button
              onClick={() =>
                promptAIAssistant(
                  "Generate a development roadmap based on the current project status",
                )
              }
            >
              <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {effectiveRTL ? "توليد خارطة طريق" : "Generate Roadmap"}
            </Button>
          </div>

          {roadmapLoading ? (
            <div className="flex justify-center items-center h-40">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">
                {effectiveRTL ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : roadmapError ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{roadmapError}</AlertDescription>
            </Alert>
          ) : !projectRoadmap ? (
            <div className="text-center py-12">
              <Milestone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {effectiveRTL ? "لا توجد خارطة طريق" : "No Roadmap Found"}
              </h3>
              <p className="text-muted-foreground">
                {effectiveRTL
                  ? "لم يتم العثور على بيانات خارطة طريق"
                  : "No roadmap data found"}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  promptAIAssistant(
                    "Generate a development roadmap based on the current project status",
                  )
                }
              >
                <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {effectiveRTL ? "توليد خارطة طريق" : "Generate Roadmap"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL ? "المعالم" : "Milestones"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                    <div className="space-y-8">
                      {projectRoadmap.milestones.map((milestone) => (
                        <div key={milestone.id} className="relative pl-10">
                          {/* Timeline dot */}
                          <div
                            className="absolute left-2 top-1.5 w-5 h-5 rounded-full border-4"
                            style={{
                              borderColor:
                                STATUS_COLORS[
                                  milestone.status as keyof typeof STATUS_COLORS
                                ] || "#64748b",
                              backgroundColor: "white",
                            }}
                          />

                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center">
                              <h3 className="text-lg font-medium">
                                {milestone.name}
                              </h3>
                              <Badge
                                className="ml-2"
                                variant={
                                  milestone.status === "completed"
                                    ? "default"
                                    : milestone.status === "in-progress"
                                      ? "secondary"
                                      : milestone.status === "delayed"
                                        ? "destructive"
                                        : "outline"
                                }
                              >
                                {milestone.status === "completed"
                                  ? effectiveRTL
                                    ? "مكتمل"
                                    : "Completed"
                                  : milestone.status === "in-progress"
                                    ? effectiveRTL
                                      ? "قيد التقدم"
                                      : "In Progress"
                                    : milestone.status === "planned"
                                      ? effectiveRTL
                                        ? "مخطط"
                                        : "Planned"
                                      : effectiveRTL
                                        ? "متأخر"
                                        : "Delayed"}
                              </Badge>
                            </div>

                            <div className="text-sm text-muted-foreground">
                              {milestone.description}
                            </div>

                            <div className="text-sm">
                              {effectiveRTL ? "تاريخ الاستحقاق:" : "Due Date:"}{" "}
                              {formatDate(milestone.dueDate)}
                            </div>

                            <div className="flex items-center">
                              <div className="flex-1 mr-4">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm">
                                    {effectiveRTL ? "التقدم" : "Progress"}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {milestone.progress}%
                                  </span>
                                </div>
                                <Progress
                                  value={milestone.progress}
                                  className="h-2"
                                  indicatorClassName={
                                    milestone.status === "completed"
                                      ? "bg-green-500"
                                      : milestone.status === "in-progress"
                                        ? "bg-blue-500"
                                        : milestone.status === "delayed"
                                          ? "bg-red-500"
                                          : "bg-yellow-500"
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Releases */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {effectiveRTL ? "الإصدارات" : "Releases"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {projectRoadmap.releases.map((release) => (
                      <div
                        key={release.id}
                        className="border rounded-md p-4 hover:bg-muted/50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-medium">
                              {release.name} ({release.version})
                            </h3>
                            <div className="text-sm text-muted-foreground">
                              {effectiveRTL
                                ? "تاريخ الإصدار:"
                                : "Release Date:"}{" "}
                              {formatDate(release.releaseDate)}
                            </div>
                          </div>
                          <Badge
                            variant={
                              release.status === "released"
                                ? "default"
                                : release.status === "in-development"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {release.status === "released"
                              ? effectiveRTL
                                ? "تم إصداره"
                                : "Released"
                              : release.status === "in-development"
                                ? effectiveRTL
                                  ? "قيد التطوير"
                                  : "In Development"
                                : effectiveRTL
                                  ? "مخطط"
                                  : "Planned"}
                          </Badge>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">
                            {effectiveRTL ? "الميزات" : "Features"}
                          </h4>
                          <ul className="space-y-1">
                            {release.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start space-x-2 rtl:space-x-reverse"
                              >
                                <ChevronRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
