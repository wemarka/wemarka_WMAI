import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/frontend/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/frontend/components/ui/tooltip";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Code,
  CodeXml,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  Github,
  HelpCircle,
  Info,
  Loader,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAI } from "@/frontend/contexts/AIContext";
import {
  analyzeCode,
  analyzeCodeSnippet,
  analyzeFile,
  analyzeGitHubRepository,
  trackRecommendationImplementation,
  clearAnalysisCache,
  CodeAnalysisRequest,
  CodeAnalysisResult,
} from "@/frontend/services/codeAnalysisService";
import { AIRecommendation } from "@/frontend/services/projectAnalysisService";

interface CodeAnalysisProps {
  isRTL?: boolean;
  initialCodeSnippet?: string;
  initialRepositoryUrl?: string;
  initialAnalysisType?: CodeAnalysisRequest["analysisType"];
}

export const CodeAnalysis: React.FC<CodeAnalysisProps> = ({
  isRTL = false,
  initialCodeSnippet = "",
  initialRepositoryUrl = "",
  initialAnalysisType = "all",
}) => {
  const { direction } = useLanguage();
  const { promptAIAssistant } = useAI();
  const effectiveRTL = isRTL || direction === "rtl";

  // Auto-save user preferences and inputs
  const {
    data: userPreferences,
    setData: setUserPreferences,
    isSaving,
  } = useAutoSave<{
    activeTab: string;
    analysisType: CodeAnalysisRequest["analysisType"];
    codeSnippet: string;
    repositoryUrl: string;
    branch: string;
    filePath: string;
    context: string;
    expandedRecommendationId: string | null;
    recommendationCategoryFilter: string | undefined;
    recommendationStatusFilter: string | undefined;
    analysisHistory: Array<{
      id: string;
      type: string;
      date: string;
      summary: string;
    }>;
  }>({
    key: "code-analysis-preferences",
    initialData: {
      activeTab: "code-snippet",
      analysisType: initialAnalysisType,
      codeSnippet: initialCodeSnippet,
      repositoryUrl: initialRepositoryUrl,
      branch: "main",
      filePath: "",
      context: "",
      expandedRecommendationId: null,
      recommendationCategoryFilter: undefined,
      recommendationStatusFilter: undefined,
      analysisHistory: [],
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

  // State for analysis results
  const [analysisResult, setAnalysisResult] =
    useState<CodeAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isCacheClearing, setIsCacheClearing] = useState(false);

  // Derived states from user preferences
  const activeTab = userPreferences.activeTab;
  const analysisType = userPreferences.analysisType;
  const codeSnippet = userPreferences.codeSnippet;
  const repositoryUrl = userPreferences.repositoryUrl;
  const branch = userPreferences.branch;
  const filePath = userPreferences.filePath;
  const context = userPreferences.context;
  const expandedRecommendationId = userPreferences.expandedRecommendationId;
  const recommendationCategoryFilter =
    userPreferences.recommendationCategoryFilter;
  const recommendationStatusFilter = userPreferences.recommendationStatusFilter;
  const analysisHistory = userPreferences.analysisHistory;

  // Update user preferences
  const setActiveTab = (tab: string) => {
    setUserPreferences({ ...userPreferences, activeTab: tab });
  };

  const setAnalysisType = (type: CodeAnalysisRequest["analysisType"]) => {
    setUserPreferences({ ...userPreferences, analysisType: type });
  };

  const setCodeSnippet = (code: string) => {
    setUserPreferences({ ...userPreferences, codeSnippet: code });
  };

  const setRepositoryUrl = (url: string) => {
    setUserPreferences({ ...userPreferences, repositoryUrl: url });
  };

  const setBranch = (branch: string) => {
    setUserPreferences({ ...userPreferences, branch: branch });
  };

  const setFilePath = (path: string) => {
    setUserPreferences({ ...userPreferences, filePath: path });
  };

  const setContext = (context: string) => {
    setUserPreferences({ ...userPreferences, context: context });
  };

  const setExpandedRecommendationId = (id: string | null) => {
    setUserPreferences({ ...userPreferences, expandedRecommendationId: id });
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

  const addToAnalysisHistory = (analysis: {
    id: string;
    type: string;
    date: string;
    summary: string;
  }) => {
    const updatedHistory = [analysis, ...analysisHistory.slice(0, 9)];
    setUserPreferences({
      ...userPreferences,
      analysisHistory: updatedHistory,
    });
  };

  // Handle code analysis
  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      let result: CodeAnalysisResult;

      if (activeTab === "code-snippet" && codeSnippet) {
        result = await analyzeCodeSnippet(codeSnippet, context, analysisType);
      } else if (activeTab === "repository" && repositoryUrl) {
        result = await analyzeGitHubRepository(repositoryUrl, branch);
      } else if (activeTab === "file" && filePath) {
        result = await analyzeFile(filePath, analysisType);
      } else {
        throw new Error(
          effectiveRTL
            ? "يرجى توفير المدخلات المطلوبة للتحليل"
            : "Please provide the required inputs for analysis",
        );
      }

      setAnalysisResult(result);

      // Add to history
      addToAnalysisHistory({
        id: `analysis-${Date.now()}`,
        type: activeTab,
        date: new Date().toISOString(),
        summary: result.summary,
      });
    } catch (error) {
      console.error("Error analyzing code:", error);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : effectiveRTL
            ? "حدث خطأ أثناء تحليل الكود"
            : "An error occurred while analyzing the code",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle clearing the analysis cache
  const handleClearCache = async () => {
    setIsCacheClearing(true);
    try {
      clearAnalysisCache();
      // Show success message or update UI as needed
      setTimeout(() => {
        setIsCacheClearing(false);
      }, 500);
    } catch (error) {
      console.error("Error clearing cache:", error);
      setIsCacheClearing(false);
    }
  };

  // Handle recommendation feedback
  const handleRecommendationFeedback = async (
    recommendationId: string,
    status: AIRecommendation["status"],
    feedback?: string,
  ) => {
    try {
      await trackRecommendationImplementation(
        recommendationId,
        status,
        feedback,
      );

      // Update local state
      if (analysisResult) {
        setAnalysisResult({
          ...analysisResult,
          recommendations: analysisResult.recommendations.map((rec) =>
            rec.id === recommendationId ? { ...rec, status } : rec,
          ),
        });
      }
    } catch (error) {
      console.error("Error saving recommendation feedback:", error);
    }
  };

  // Copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
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

  // Get recommendation category icon
  const getRecommendationCategoryIcon = (category: string): React.ReactNode => {
    switch (category) {
      case "performance":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "security":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "ux":
        return <Eye className="h-4 w-4 text-blue-500" />;
      case "code-quality":
        return <Code className="h-4 w-4 text-green-500" />;
      case "feature":
        return <Sparkles className="h-4 w-4 text-purple-500" />;
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

  // Filter recommendations based on category and status
  const filteredRecommendations = React.useMemo(() => {
    if (!analysisResult) return [];

    let filtered = analysisResult.recommendations;

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
    analysisResult,
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

  // Prepare data for radar chart
  const radarData = React.useMemo(() => {
    if (!analysisResult) return [];

    return [
      {
        subject: effectiveRTL ? "جودة الكود" : "Code Quality",
        value: analysisResult.codeQualityScore || 0,
        fullMark: 100,
      },
      {
        subject: effectiveRTL ? "الأداء" : "Performance",
        value: analysisResult.performanceScore || 0,
        fullMark: 100,
      },
      {
        subject: effectiveRTL ? "الأمان" : "Security",
        value: analysisResult.securityScore || 0,
        fullMark: 100,
      },
    ];
  }, [analysisResult, effectiveRTL]);

  // Prepare data for category distribution chart
  const categoryDistributionData = React.useMemo(() => {
    if (!analysisResult) return [];

    const categories: Record<string, number> = {};

    analysisResult.recommendations.forEach((rec) => {
      categories[rec.category] = (categories[rec.category] || 0) + 1;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name:
        name === "code-quality"
          ? "Code Quality"
          : name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [analysisResult]);

  // Prepare data for priority distribution chart
  const priorityDistributionData = React.useMemo(() => {
    if (!analysisResult) return [];

    const priorities: Record<string, number> = {};

    analysisResult.recommendations.forEach((rec) => {
      priorities[rec.priority] = (priorities[rec.priority] || 0) + 1;
    });

    return Object.entries(priorities).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [analysisResult]);

  // Export analysis results as JSON
  const handleExportResults = () => {
    if (!analysisResult) return;

    const dataStr = JSON.stringify(analysisResult, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `code-analysis-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Ask AI for implementation help
  const askAIForImplementationHelp = (recommendation: AIRecommendation) => {
    const prompt = `Help me implement this recommendation: ${recommendation.title}\n\nDescription: ${recommendation.description}${recommendation.codeSnippet ? `\n\nCode snippet: ${recommendation.codeSnippet}` : ""}`;
    promptAIAssistant(prompt);
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {effectiveRTL ? "تحليل الكود" : "Code Analysis"}
        </h1>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {isSaving && (
            <div className="text-sm text-muted-foreground flex items-center">
              <RefreshCw className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0 animate-spin" />
              {effectiveRTL ? "جاري الحفظ..." : "Saving..."}
            </div>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCache}
                  disabled={isCacheClearing}
                >
                  {isCacheClearing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {effectiveRTL ? "مسح ذاكرة التخزين المؤقت" : "Clear Cache"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="code-snippet">
            <Code className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "مقتطف الكود" : "Code Snippet"}
          </TabsTrigger>
          <TabsTrigger value="repository">
            <Github className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "مستودع GitHub" : "GitHub Repository"}
          </TabsTrigger>
          <TabsTrigger value="file">
            <FileCode className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "ملف" : "File"}
          </TabsTrigger>
          <TabsTrigger value="history">
            <RefreshCw className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {effectiveRTL ? "السجل" : "History"}
          </TabsTrigger>
        </TabsList>

        {/* Code Snippet Tab */}
        <TabsContent value="code-snippet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {effectiveRTL ? "تحليل مقتطف الكود" : "Analyze Code Snippet"}
              </CardTitle>
              <CardDescription>
                {effectiveRTL
                  ? "الصق الكود الخاص بك وحدد نوع التحليل"
                  : "Paste your code and select the type of analysis"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="analysis-type">
                  {effectiveRTL ? "نوع التحليل" : "Analysis Type"}
                </Label>
                <Select
                  value={analysisType}
                  onValueChange={(value) =>
                    setAnalysisType(
                      value as CodeAnalysisRequest["analysisType"],
                    )
                  }
                >
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
                      {effectiveRTL ? "تحليل شامل" : "Comprehensive Analysis"}
                    </SelectItem>
                    <SelectItem value="performance">
                      {effectiveRTL ? "تحليل الأداء" : "Performance Analysis"}
                    </SelectItem>
                    <SelectItem value="security">
                      {effectiveRTL ? "تحليل الأمان" : "Security Analysis"}
                    </SelectItem>
                    <SelectItem value="code-quality">
                      {effectiveRTL
                        ? "تحليل جودة الكود"
                        : "Code Quality Analysis"}
                    </SelectItem>
                    <SelectItem value="feature">
                      {effectiveRTL
                        ? "اقتراحات الميزات"
                        : "Feature Suggestions"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="code-snippet">
                  {effectiveRTL ? "مقتطف الكود" : "Code Snippet"}
                </Label>
                <Textarea
                  id="code-snippet"
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder={
                    effectiveRTL
                      ? "الصق الكود هنا للتحليل..."
                      : "Paste code here for analysis..."
                  }
                  className="min-h-[300px] font-mono"
                />
              </div>

              <div>
                <Label htmlFor="context">
                  {effectiveRTL
                    ? "سياق إضافي (اختياري)"
                    : "Additional Context (Optional)"}
                </Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder={
                    effectiveRTL
                      ? "قدم أي سياق إضافي للتحليل..."
                      : "Provide any additional context for the analysis..."
                  }
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleAnalyzeCode}
                disabled={isAnalyzing || !codeSnippet}
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                    {effectiveRTL ? "جاري التحليل..." : "Analyzing..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {effectiveRTL ? "تحليل الكود" : "Analyze Code"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* GitHub Repository Tab */}
        <TabsContent value="repository" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {effectiveRTL
                  ? "تحليل مستودع GitHub"
                  : "Analyze GitHub Repository"}
              </CardTitle>
              <CardDescription>
                {effectiveRTL
                  ? "أدخل عنوان URL لمستودع GitHub لتحليله"
                  : "Enter a GitHub repository URL to analyze it"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="repository-url">
                  {effectiveRTL ? "عنوان URL للمستودع" : "Repository URL"}
                </Label>
                <Input
                  id="repository-url"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>

              <div>
                <Label htmlFor="branch">
                  {effectiveRTL ? "الفرع" : "Branch"}
                </Label>
                <Input
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleAnalyzeCode}
                disabled={isAnalyzing || !repositoryUrl}
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                    {effectiveRTL ? "جاري التحليل..." : "Analyzing..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {effectiveRTL ? "تحليل المستودع" : "Analyze Repository"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* File Tab */}
        <TabsContent value="file" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {effectiveRTL ? "تحليل ملف" : "Analyze File"}
              </CardTitle>
              <CardDescription>
                {effectiveRTL
                  ? "أدخل مسار الملف لتحليله"
                  : "Enter a file path to analyze it"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-path">
                  {effectiveRTL ? "مسار الملف" : "File Path"}
                </Label>
                <Input
                  id="file-path"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  placeholder="src/components/Button.tsx"
                />
              </div>

              <div>
                <Label htmlFor="analysis-type-file">
                  {effectiveRTL ? "نوع التحليل" : "Analysis Type"}
                </Label>
                <Select
                  value={analysisType}
                  onValueChange={(value) =>
                    setAnalysisType(
                      value as CodeAnalysisRequest["analysisType"],
                    )
                  }
                >
                  <SelectTrigger id="analysis-type-file">
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
                      {effectiveRTL ? "تحليل شامل" : "Comprehensive Analysis"}
                    </SelectItem>
                    <SelectItem value="performance">
                      {effectiveRTL ? "تحليل الأداء" : "Performance Analysis"}
                    </SelectItem>
                    <SelectItem value="security">
                      {effectiveRTL ? "تحليل الأمان" : "Security Analysis"}
                    </SelectItem>
                    <SelectItem value="code-quality">
                      {effectiveRTL
                        ? "تحليل جودة الكود"
                        : "Code Quality Analysis"}
                    </SelectItem>
                    <SelectItem value="feature">
                      {effectiveRTL
                        ? "اقتراحات الميزات"
                        : "Feature Suggestions"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={handleAnalyzeCode}
                disabled={isAnalyzing || !filePath}
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                    {effectiveRTL ? "جاري التحليل..." : "Analyzing..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                    {effectiveRTL ? "تحليل الملف" : "Analyze File"}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {effectiveRTL ? "سجل التحليل" : "Analysis History"}
              </CardTitle>
              <CardDescription>
                {effectiveRTL
                  ? "عرض تحليلات الكود السابقة"
                  : "View previous code analyses"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analysisHistory.length === 0 ? (
                <div className="text-center py-8">
                  <FileCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {effectiveRTL ? "لا يوجد سجل تحليل" : "No Analysis History"}
                  </h3>
                  <p className="text-muted-foreground">
                    {effectiveRTL
                      ? "قم بتحليل الكود للحصول على توصيات للتحسين"
                      : "Analyze code to get recommendations for improvement"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisHistory.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-md p-4 hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        // You could implement loading a previous analysis here
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">
                            {item.type === "code-snippet"
                              ? effectiveRTL
                                ? "تحليل مقتطف الكود"
                                : "Code Snippet Analysis"
                              : item.type === "repository"
                                ? effectiveRTL
                                  ? "تحليل مستودع GitHub"
                                  : "GitHub Repository Analysis"
                                : effectiveRTL
                                  ? "تحليل ملف"
                                  : "File Analysis"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(item.date)}
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                      <div className="mt-2 text-sm">{item.summary}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Analysis Results */}
      {analysisError && (
        <Alert variant="destructive" className="mt-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{analysisError}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {effectiveRTL ? "نتائج التحليل" : "Analysis Results"}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportResults}
                >
                  <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {effectiveRTL ? "تصدير النتائج" : "Export Results"}
                </Button>
              </div>
              <CardDescription>{analysisResult.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Code Quality Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-2">
                      <span className="text-2xl font-bold">
                        {analysisResult.codeQualityScore || "N/A"}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {effectiveRTL
                          ? "درجة جودة الكود"
                          : "Code Quality Score"}
                      </p>
                    </div>
                    {analysisResult.codeQualityScore && (
                      <Progress
                        value={analysisResult.codeQualityScore}
                        className="h-2"
                        indicatorClassName={
                          analysisResult.codeQualityScore > 75
                            ? "bg-green-500"
                            : analysisResult.codeQualityScore > 50
                              ? "bg-blue-500"
                              : analysisResult.codeQualityScore > 25
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Performance Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-2">
                      <span className="text-2xl font-bold">
                        {analysisResult.performanceScore || "N/A"}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {effectiveRTL ? "درجة الأداء" : "Performance Score"}
                      </p>
                    </div>
                    {analysisResult.performanceScore && (
                      <Progress
                        value={analysisResult.performanceScore}
                        className="h-2"
                        indicatorClassName={
                          analysisResult.performanceScore > 75
                            ? "bg-green-500"
                            : analysisResult.performanceScore > 50
                              ? "bg-blue-500"
                              : analysisResult.performanceScore > 25
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Security Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-2">
                      <span className="text-2xl font-bold">
                        {analysisResult.securityScore || "N/A"}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {effectiveRTL ? "درجة الأمان" : "Security Score"}
                      </p>
                    </div>
                    {analysisResult.securityScore && (
                      <Progress
                        value={analysisResult.securityScore}
                        className="h-2"
                        indicatorClassName={
                          analysisResult.securityScore > 75
                            ? "bg-green-500"
                            : analysisResult.securityScore > 50
                              ? "bg-blue-500"
                              : analysisResult.securityScore > 25
                                ? "bg-yellow-500"
                                : "bg-red-500"
                        }
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Radar Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "نظرة عامة على الجودة"
                        : "Quality Overview"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                          data={radarData}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name={effectiveRTL ? "الدرجة" : "Score"}
                            dataKey="value"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {effectiveRTL
                        ? "توزيع التوصيات حسب الفئة"
                        : "Recommendation Distribution by Category"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryDistributionData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="recommendation-category-filter">
                      {effectiveRTL
                        ? "تصفية حسب الفئة:"
                        : "Filter by category:"}
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
                          placeholder={
                            effectiveRTL ? "جميع الحالات" : "All Statuses"
                          }
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
                </div>

                <h3 className="text-lg font-medium mt-6 mb-4">
                  {effectiveRTL ? "التوصيات" : "Recommendations"} (
                  {filteredRecommendations.length})
                </h3>

                {filteredRecommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {effectiveRTL ? "لا توجد توصيات" : "No Recommendations"}
                    </h3>
                    <p className="text-muted-foreground">
                      {effectiveRTL
                        ? "لم يتم العثور على توصيات تطابق معايير التصفية الخاصة بك"
                        : "No recommendations found matching your filter criteria"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                              {getRecommendationCategoryIcon(
                                recommendation.category,
                              )}
                              <span className="ml-2">
                                {recommendation.title}
                              </span>
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
                              {expandedRecommendationId ===
                              recommendation.id ? (
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
                                      : recommendation.category ===
                                          "code-quality"
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
                                    <div className="flex justify-between items-center mb-1">
                                      <h4 className="text-sm font-medium">
                                        {effectiveRTL
                                          ? "مقتطف الكود"
                                          : "Code Snippet"}
                                      </h4>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                copyToClipboard(
                                                  recommendation.codeSnippet ||
                                                    "",
                                                )
                                              }
                                            >
                                              <Copy className="h-4 w-4" />
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            {effectiveRTL
                                              ? "نسخ إلى الحافظة"
                                              : "Copy to clipboard"}
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </div>
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
                                  disabled={
                                    recommendation.status === "accepted"
                                  }
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
                                  disabled={
                                    recommendation.status === "implemented"
                                  }
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
                                  disabled={
                                    recommendation.status === "rejected"
                                  }
                                >
                                  <X className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                                  {effectiveRTL ? "رفض" : "Reject"}
                                </Button>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  askAIForImplementationHelp(recommendation)
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
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CodeAnalysis;
