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
import { Progress } from "@/frontend/components/ui/progress";
import { Badge } from "@/frontend/components/ui/badge";
import { Separator } from "@/frontend/components/ui/separator";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import {
  Check,
  Code,
  FileCode,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Loader2,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import { projectAnalysisService } from "@/frontend/services/projectAnalysisService";
import { useTranslation } from "react-i18next";
import ProjectRoadmap from "./ProjectRoadmap";

export default function ProjectAnalysisDashboard() {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [moduleProgress, setModuleProgress] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const isRTL = i18n.dir() === "rtl";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [progressData, metricsData, recommendationsData] =
          await Promise.all([
            projectAnalysisService.getModuleProgress(),
            projectAnalysisService.getProjectMetrics(),
            projectAnalysisService.getAIRecommendations(),
          ]);

        setModuleProgress(progressData);
        setMetrics(
          metricsData || {
            total_commits: 1247,
            total_files: 358,
            total_lines: 98500,
            contributors: 8,
            open_issues: 42,
            closed_issues: 187,
            pull_requests: 312,
            merged_pull_requests: 203,
            code_quality: { score: 78 },
            velocity: 24,
          },
        );
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t("Loading project data...")}</span>
      </div>
    );
  }

  // Default module progress if none is found in the database
  const defaultModules = [
    { module: "Dashboard", progress: 90, completed_tasks: 18, total_tasks: 20 },
    {
      module: "AI Assistant",
      progress: 85,
      completed_tasks: 17,
      total_tasks: 20,
    },
    {
      module: "Store & Ecommerce",
      progress: 60,
      completed_tasks: 12,
      total_tasks: 20,
    },
    {
      module: "Accounting",
      progress: 55,
      completed_tasks: 11,
      total_tasks: 20,
    },
    { module: "Marketing", progress: 75, completed_tasks: 15, total_tasks: 20 },
    { module: "Inbox", progress: 40, completed_tasks: 8, total_tasks: 20 },
    {
      module: "Developer Tools",
      progress: 95,
      completed_tasks: 19,
      total_tasks: 20,
    },
    { module: "Analytics", progress: 70, completed_tasks: 14, total_tasks: 20 },
    {
      module: "Integrations",
      progress: 35,
      completed_tasks: 7,
      total_tasks: 20,
    },
  ];

  const modulesData =
    moduleProgress.length > 0 ? moduleProgress : defaultModules;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {t("Project Analysis Dashboard")}
        </h1>
        <p className="text-muted-foreground">
          {t("Comprehensive analysis of the Wemarka WMAI project")}
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">{t("Overview")}</TabsTrigger>
          <TabsTrigger value="modules">{t("Modules")}</TabsTrigger>
          <TabsTrigger value="roadmap">{t("Roadmap")}</TabsTrigger>
          <TabsTrigger value="recommendations">
            {t("Recommendations")}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Current Project Status")}</CardTitle>
              <CardDescription>
                {t(
                  "A unified business operating system providing a smart, centralized platform for businesses",
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("Technical Structure")}
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Badge className={`${isRTL ? "ml-2" : "mr-2"}`}>
                        {t("Frontend")}
                      </Badge>
                      <span>
                        {t(
                          "React with Tailwind CSS and UI libraries like Radix UI",
                        )}
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Badge className={`${isRTL ? "ml-2" : "mr-2"}`}>
                        {t("Backend")}
                      </Badge>
                      <span>{t("Supabase with Edge Functions")}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className={`${isRTL ? "ml-2" : "mr-2"}`}>
                        {t("Database")}
                      </Badge>
                      <span>{t("PostgreSQL (via Supabase)")}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className={`${isRTL ? "ml-2" : "mr-2"}`}>
                        {t("AI Integration")}
                      </Badge>
                      <span>{t("Integrated throughout the application")}</span>
                    </li>
                    <li className="flex items-center">
                      <Badge className={`${isRTL ? "ml-2" : "mr-2"}`}>
                        {t("Internationalization")}
                      </Badge>
                      <span>{t("Supports RTL languages")}</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {t("Project Statistics")}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>{t("Project Completion")}</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>{t("Test Coverage")}</span>
                        <span>48%</span>
                      </div>
                      <Progress value={48} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>{t("Code Quality")}</span>
                        <span>{metrics?.code_quality?.score || 78}%</span>
                      </div>
                      <Progress
                        value={metrics?.code_quality?.score || 78}
                        className="h-2"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-4">
                      <div className="flex items-center">
                        <GitCommit className="h-4 w-4 mr-1" />
                        <span>
                          {metrics?.total_commits || 1247} {t("commits")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileCode className="h-4 w-4 mr-1" />
                        <span>
                          {metrics?.total_files || 358} {t("files")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <GitPullRequest className="h-4 w-4 mr-1" />
                        <span>
                          {metrics?.merged_pull_requests || 203}{" "}
                          {t("merged PRs")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  {t("Developer Tools")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("Code Analysis")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Monitoring Dashboard")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Changelog Viewer")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  {t("AI Assistant")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("Improvement Recommendations")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Content Generation")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Code Analysis")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Server className="h-5 w-5 mr-2 text-green-500" />
                  {t("Infrastructure")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("Supabase")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("Edge Functions")}</span>
                    <Badge>{t("Complete")}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("CI/CD")}</span>
                    <Badge variant="outline">{t("In Progress")}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Modules Tab */}
        <TabsContent value="modules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Project Module Status")}</CardTitle>
              <CardDescription>
                {t("Development progress of the main system modules")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-6">
                  {modulesData.map((module, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-medium">
                          {t(module.module)}
                        </h3>
                        <Badge>
                          {module.progress}% {t("Complete")}
                        </Badge>
                      </div>
                      <Progress value={module.progress} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {t("Tasks")}: {module.completed_tasks} /{" "}
                        {module.total_tasks}
                      </p>

                      {index < modulesData.length - 1 && (
                        <Separator className="my-4" />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roadmap Tab */}
        <TabsContent value="roadmap" className="space-y-6">
          <ProjectRoadmap />
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Technical Recommendations")}</CardTitle>
              <CardDescription>
                {t("Suggestions for technical improvements to the project")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Code className="h-5 w-5 mr-2 text-blue-500" />
                    {t("Code Structure Improvements")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Break Down Large Components")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Split large components into smaller, more focused ones to improve maintainability",
                          )}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Improve State Management")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Use more effective patterns for application state management",
                          )}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    {t("Performance Improvements")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Implement Code Splitting")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Improve loading times by splitting code and loading it on demand",
                          )}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Optimize Database Queries")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Improve database queries in the reporting module for better performance",
                          )}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <Shield className="h-5 w-5 mr-2 text-red-500" />
                    {t("Security Improvements")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Add Multi-Factor Authentication")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Enhance system security by adding an additional layer of authentication",
                          )}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Implement Content Security Policy (CSP)")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Prevent XSS attacks and improve overall application security",
                          )}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium flex items-center mb-2">
                    <GitBranch className="h-5 w-5 mr-2 text-purple-500" />
                    {t("Testing Strategy")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Increase Unit Test Coverage")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Improve code quality and reduce bugs by increasing test coverage",
                          )}
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 mr-2 mt-1 text-green-500" />
                      <div>
                        <p className="font-medium">
                          {t("Add Integration and End-to-End Tests")}
                        </p>
                        <p className="text-muted-foreground">
                          {t(
                            "Ensure the system works correctly as an integrated unit",
                          )}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
