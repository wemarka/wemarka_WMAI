import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Badge } from "@/frontend/components/ui/badge";
import { Progress } from "@/frontend/components/ui/progress";
import { Alert, AlertDescription } from "@/frontend/components/ui/alert";
import {
  Play,
  AlertTriangle,
  FileText,
  List,
  ExternalLink,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getTestResults,
  getTestSummary,
  TestSummary,
  TestResult,
} from "@/frontend/services/testService";
import TestResultItem from "@/frontend/components/testing/TestResultItem";

interface TestCoverageDashboardProps {
  isRTL?: boolean;
}

const TestCoverageDashboard = ({
  isRTL = false,
}: TestCoverageDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [moduleSummaries, setModuleSummaries] = useState<TestSummary[]>([]);
  const [recentTestResults, setRecentTestResults] = useState<TestResult[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleResults, setModuleResults] = useState<TestResult[]>([]);

  // Fetch test summaries and recent results
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch test summaries for all modules
        const summaries = await getTestSummary();
        setModuleSummaries(summaries);

        // Fetch recent test results (limited to 10)
        const results = await getTestResults();
        setRecentTestResults(results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching test data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch results for a specific module when selected
  useEffect(() => {
    if (!selectedModule) {
      setModuleResults([]);
      return;
    }

    const fetchModuleResults = async () => {
      try {
        const results = await getTestResults(selectedModule);
        setModuleResults(results);
      } catch (error) {
        console.error(
          `Error fetching results for module ${selectedModule}:`,
          error,
        );
      }
    };

    fetchModuleResults();
  }, [selectedModule]);

  // Calculate overall coverage
  const calculateOverallCoverage = () => {
    if (moduleSummaries.length === 0) return 0;

    const totalTests = moduleSummaries.reduce(
      (sum, module) => sum + module.totalTests,
      0,
    );
    const passedTests = moduleSummaries.reduce(
      (sum, module) => sum + module.passed,
      0,
    );

    return totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  };

  const overallCoverage = calculateOverallCoverage();

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (e) {
      return timestamp;
    }
  };

  // Export test results as JSON
  const handleExportReport = () => {
    if (recentTestResults.length === 0) return;

    const dataStr = JSON.stringify(recentTestResults, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `test-coverage-report-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const summaries = await getTestSummary();
      setModuleSummaries(summaries);

      const results = await getTestResults();
      setRecentTestResults(results.slice(0, 10));

      if (selectedModule) {
        const moduleResults = await getTestResults(selectedModule);
        setModuleResults(moduleResults);
      }
    } catch (error) {
      console.error("Error refreshing test data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Define test panel paths
  const getTestPanelPath = (module: string) => {
    const modulePaths: Record<string, string> = {
      Dashboard: "/dashboard/dashboard/test-panel",
      Store: "/dashboard/store/test-panel",
      Accounting: "/dashboard/accounting/test-panel",
      Marketing: "/dashboard/marketing/test-panel",
      Inbox: "/dashboard/inbox/test-panel",
      Documents: "/dashboard/documents/test-panel",
      Integrations: "/dashboard/integrations/test-panel",
      "Customer Service": "/dashboard/customer-service/test-panel",
      Storefront: "/dashboard/storefront/test-panel",
    };

    return modulePaths[module] || "";
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isRTL ? "لوحة تغطية الاختبار" : "Test Coverage Dashboard"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            disabled={recentTestResults.length === 0}
          >
            <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "تصدير التقرير" : "Export Report"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 ${isLoading ? "animate-spin" : ""}`}
            />
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Quick Access to Test Panels */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isRTL
              ? "الوصول السريع إلى لوحات الاختبار"
              : "Quick Access to Test Panels"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/dashboard/dashboard/test-panel">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isRTL ? "لوحة اختبار لوحة المعلومات" : "Dashboard Test Panel"}
              </Button>
            </Link>
            <Link to="/dashboard/store/test-panel">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isRTL ? "لوحة اختبار المتجر" : "Store Test Panel"}
              </Button>
            </Link>
            <Link to="/dashboard/marketing/test-panel">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isRTL ? "لوحة اختبار التسويق" : "Marketing Test Panel"}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">
            {isRTL ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="modules">
            {isRTL ? "الوحدات" : "Modules"}
          </TabsTrigger>
          <TabsTrigger value="history">
            {isRTL ? "التاريخ" : "History"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6 flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  {isRTL ? "جاري التحميل..." : "Loading..."}
                </span>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Overall Coverage Card */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isRTL
                      ? "تغطية الاختبار الإجمالية"
                      : "Overall Test Coverage"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="w-full mr-4 rtl:ml-4 rtl:mr-0">
                      <Progress value={overallCoverage} className="h-2" />
                    </div>
                    <span className="text-2xl font-bold min-w-16 text-right rtl:text-left">
                      {overallCoverage}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? "إجمالي الاختبارات" : "Total Tests"}
                      </div>
                      <div className="text-xl font-bold">
                        {moduleSummaries.reduce(
                          (sum, module) => sum + module.totalTests,
                          0,
                        )}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? "الاختبارات الناجحة" : "Passing Tests"}
                      </div>
                      <div className="text-xl font-bold text-green-600">
                        {moduleSummaries.reduce(
                          (sum, module) => sum + module.passed,
                          0,
                        )}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? "الاختبارات الفاشلة" : "Failing Tests"}
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        {moduleSummaries.reduce(
                          (sum, module) => sum + module.failed,
                          0,
                        )}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        {isRTL ? "الوحدات" : "Modules"}
                      </div>
                      <div className="text-xl font-bold">
                        {moduleSummaries.length}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Test Results */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isRTL ? "نتائج الاختبار الأخيرة" : "Recent Test Results"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTestResults.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      {isRTL
                        ? "لا توجد نتائج اختبار حديثة"
                        : "No recent test results"}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentTestResults.map((result) => (
                        <TestResultItem
                          key={result.id}
                          result={result}
                          isRTL={isRTL}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6 flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  {isRTL ? "جاري التحميل..." : "Loading..."}
                </span>
              </CardContent>
            </Card>
          ) : moduleSummaries.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  {isRTL
                    ? "لا توجد بيانات وحدة متاحة"
                    : "No module data available"}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {moduleSummaries.map((module) => (
                <Card key={module.module} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{module.module}</CardTitle>
                    <CardDescription>
                      {isRTL ? "آخر تشغيل:" : "Last run:"}{" "}
                      {module.lastRun ? formatTimestamp(module.lastRun) : "-"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <div className="w-full mr-4 rtl:ml-4 rtl:mr-0">
                        <Progress value={module.coverage} className="h-2" />
                      </div>
                      <span className="text-xl font-bold min-w-12 text-right rtl:text-left">
                        {module.coverage}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-muted/50 p-2 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">
                          {isRTL ? "الإجمالي" : "Total"}
                        </div>
                        <div className="text-lg font-bold">
                          {module.totalTests}
                        </div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">
                          {isRTL ? "ناجح" : "Passed"}
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {module.passed}
                        </div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">
                          {isRTL ? "فاشل" : "Failed"}
                        </div>
                        <div className="text-lg font-bold text-red-600">
                          {module.failed}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedModule(module.module)}
                      >
                        {isRTL ? "عرض النتائج" : "View Results"}
                      </Button>
                      {getTestPanelPath(module.module) && (
                        <Link to={getTestPanelPath(module.module)}>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {isRTL ? "فتح لوحة الاختبار" : "Open Test Panel"}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedModule && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  {isRTL
                    ? `نتائج اختبار ${selectedModule}`
                    : `${selectedModule} Test Results`}
                </CardTitle>
                <CardDescription>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedModule(null)}
                  >
                    {isRTL ? "إغلاق" : "Close"}
                  </Button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moduleResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {isRTL
                      ? "لا توجد نتائج اختبار لهذه الوحدة"
                      : "No test results for this module"}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {moduleResults.map((result) => (
                      <TestResultItem
                        key={result.id}
                        result={result}
                        isRTL={isRTL}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6 flex justify-center items-center h-40">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">
                  {isRTL ? "جاري التحميل..." : "Loading..."}
                </span>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  {isRTL ? "سجل تشغيل الاختبار" : "Test Run History"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentTestResults.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {isRTL ? "لا يوجد سجل اختبار" : "No test history available"}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {Array.from(
                      new Set(
                        recentTestResults.map(
                          (result) => result.timestamp.split("T")[0],
                        ),
                      ),
                    ).map((date) => {
                      const dateResults = recentTestResults.filter(
                        (result) => result.timestamp.split("T")[0] === date,
                      );
                      return (
                        <div key={date} className="mb-6">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <h3 className="text-sm font-medium">
                              {new Date(date).toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </h3>
                          </div>
                          <div className="space-y-2 pl-6">
                            {dateResults.map((result) => (
                              <div
                                key={result.id}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50"
                              >
                                <div className="flex items-center">
                                  {result.status === "pass" ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  ) : result.status === "running" ? (
                                    <Clock className="h-4 w-4 text-blue-500 animate-pulse mr-2" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium">
                                      {result.testName}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {result.module} -{" "}
                                      {new Date(
                                        result.timestamp,
                                      ).toLocaleTimeString()}
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    result.status === "pass"
                                      ? "outline"
                                      : "destructive"
                                  }
                                  className={
                                    result.status === "pass"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : ""
                                  }
                                >
                                  {result.status === "pass"
                                    ? isRTL
                                      ? "نجاح"
                                      : "Pass"
                                    : result.status === "running"
                                      ? isRTL
                                        ? "جاري التنفيذ"
                                        : "Running"
                                      : isRTL
                                        ? "فشل"
                                        : "Fail"}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestCoverageDashboard;
