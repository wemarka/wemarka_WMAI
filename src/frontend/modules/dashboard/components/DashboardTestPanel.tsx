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
  CheckCircle,
  XCircle,
  RefreshCw,
  Clock,
  Download,
} from "lucide-react";
import { useTestRunner } from "@/frontend/hooks/useTestRunner";
import TestResultItem from "@/frontend/components/testing/TestResultItem";

interface DashboardTestPanelProps {
  isRTL?: boolean;
}

const DashboardTestPanel = ({ isRTL = false }: DashboardTestPanelProps) => {
  const {
    testCases,
    results,
    isRunning,
    runAllTests,
    runFailingTests,
    runSingleTest,
  } = useTestRunner("Dashboard");

  // Calculate coverage based on test results
  const calculateCoverage = () => {
    if (results.length === 0) return 0;
    const passedTests = results.filter(
      (result) => result.status === "pass",
    ).length;
    return Math.round((passedTests / results.length) * 100);
  };

  const overallCoverage = calculateCoverage();

  // Group test cases by type
  const unitTests = testCases.filter(
    (test) => test.id.includes("render") || test.id.includes("widgets"),
  );

  const integrationTests = testCases.filter(
    (test) =>
      test.id.includes("data-fetch") ||
      test.id.includes("error-handling") ||
      test.id.includes("interactivity"),
  );

  // Export test results as JSON
  const handleExportReport = () => {
    if (results.length === 0) return;

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `dashboard-test-results-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isRTL ? "لوحة اختبار لوحة المعلومات" : "Dashboard Test Panel"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReport}
            disabled={results.length === 0}
          >
            <Download className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "تصدير التقرير" : "Export Report"}
          </Button>
        </div>
      </div>

      {/* Overall Coverage Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isRTL ? "تغطية الاختبار الإجمالية" : "Overall Test Coverage"}
          </CardTitle>
          <CardDescription>
            {isRTL
              ? "نتائج اختبار الوحدة النمطية الحالية"
              : "Current module test results"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="w-full mr-4 rtl:ml-4 rtl:mr-0">
              <Progress value={overallCoverage} className="h-2" />
            </div>
            <span className="text-2xl font-bold min-w-16 text-right rtl:text-left">
              {overallCoverage}%
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {isRTL ? "اختبارات الوحدة" : "Unit Tests"}
              </div>
              <div className="text-xl font-bold">{unitTests.length}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {isRTL ? "اختبارات التكامل" : "Integration Tests"}
              </div>
              <div className="text-xl font-bold">{integrationTests.length}</div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {isRTL ? "ناجح" : "Passing"}
              </div>
              <div className="text-xl font-bold text-green-600">
                {results.filter((test) => test.status === "pass").length}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {isRTL ? "فاشل" : "Failing"}
              </div>
              <div className="text-xl font-bold text-red-600">
                {results.filter((test) => test.status === "fail").length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Tabs */}
      <Tabs defaultValue="unit" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="unit">
            {isRTL ? "اختبارات الوحدة" : "Unit Tests"}
          </TabsTrigger>
          <TabsTrigger value="integration">
            {isRTL ? "اختبارات التكامل" : "Integration Tests"}
          </TabsTrigger>
          <TabsTrigger value="results">
            {isRTL ? "نتائج الاختبار" : "Test Results"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unit" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {unitTests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isRTL
                    ? "لا توجد اختبارات وحدة متاحة"
                    : "No unit tests available"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">
                          {isRTL ? "اسم الاختبار" : "Test Name"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {isRTL ? "الوصف" : "Description"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {isRTL ? "الحالة" : "Status"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {isRTL ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitTests.map((test) => {
                        const testResult = results.find(
                          (r) => r.testId === test.id,
                        );
                        return (
                          <tr
                            key={test.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-2 px-4 font-medium">
                              {test.name}
                            </td>
                            <td className="py-2 px-4">{test.description}</td>
                            <td className="py-2 px-4">
                              {!testResult ? (
                                <Badge variant="outline">
                                  {isRTL ? "لم يتم التشغيل" : "Not Run"}
                                </Badge>
                              ) : testResult.status === "pass" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {isRTL ? "نجاح" : "Pass"}
                                </Badge>
                              ) : testResult.status === "running" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                                >
                                  <Clock className="h-3 w-3 mr-1 animate-spin" />
                                  {isRTL ? "جاري التشغيل" : "Running"}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  {isRTL ? "فشل" : "Fail"}
                                </Badge>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => runSingleTest(test.id)}
                                disabled={isRunning}
                              >
                                {isRunning ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                                <span className="ml-1">
                                  {isRTL ? "تشغيل" : "Run"}
                                </span>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {integrationTests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {isRTL
                    ? "لا توجد اختبارات تكامل متاحة"
                    : "No integration tests available"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">
                          {isRTL ? "اسم الاختبار" : "Test Name"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {isRTL ? "الوصف" : "Description"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {isRTL ? "الحالة" : "Status"}
                        </th>
                        <th className="text-left py-2 px-4">
                          {isRTL ? "الإجراءات" : "Actions"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {integrationTests.map((test) => {
                        const testResult = results.find(
                          (r) => r.testId === test.id,
                        );
                        return (
                          <tr
                            key={test.id}
                            className="border-b hover:bg-muted/50"
                          >
                            <td className="py-2 px-4 font-medium">
                              {test.name}
                            </td>
                            <td className="py-2 px-4">{test.description}</td>
                            <td className="py-2 px-4">
                              {!testResult ? (
                                <Badge variant="outline">
                                  {isRTL ? "لم يتم التشغيل" : "Not Run"}
                                </Badge>
                              ) : testResult.status === "pass" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {isRTL ? "نجاح" : "Pass"}
                                </Badge>
                              ) : testResult.status === "running" ? (
                                <Badge
                                  variant="outline"
                                  className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200"
                                >
                                  <Clock className="h-3 w-3 mr-1 animate-spin" />
                                  {isRTL ? "جاري التشغيل" : "Running"}
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  {isRTL ? "فشل" : "Fail"}
                                </Badge>
                              )}
                            </td>
                            <td className="py-2 px-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => runSingleTest(test.id)}
                                disabled={isRunning}
                              >
                                {isRunning ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Play className="h-3 w-3" />
                                )}
                                <span className="ml-1">
                                  {isRTL ? "تشغيل" : "Run"}
                                </span>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              {results.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    {isRTL
                      ? "لم يتم تشغيل أي اختبارات بعد. قم بتشغيل الاختبارات لعرض النتائج هنا."
                      : "No tests have been run yet. Run tests to see results here."}
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
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
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{isRTL ? "إجراءات سريعة" : "Quick Actions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={runAllTests} disabled={isRunning}>
              {isRunning ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  {isRTL ? "جاري التشغيل..." : "Running..."}
                </div>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isRTL ? "تشغيل جميع الاختبارات" : "Run All Tests"}
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={runFailingTests}
              disabled={
                isRunning ||
                results.filter((r) => r.status === "fail").length === 0
              }
            >
              {isRunning ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                  {isRTL ? "جاري التشغيل..." : "Running..."}
                </div>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isRTL ? "تشغيل الاختبارات الفاشلة" : "Run Failing Tests"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTestPanel;
