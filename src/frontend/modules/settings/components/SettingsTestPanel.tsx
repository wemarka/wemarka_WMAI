import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Progress } from "@/frontend/components/ui/progress";
import { Badge } from "@/frontend/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Play,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface SettingsTestPanelProps {
  isRTL?: boolean;
}

const SettingsTestPanel = ({ isRTL = false }: SettingsTestPanelProps) => {
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [activeTab, setActiveTab] = useState("unit");

  // Mock data for demonstration
  const unitTests = [
    {
      name: "UserSettings.test.tsx",
      status: "pass",
      duration: "0.8s",
      coverage: 78,
      lastRun: "2023-05-24 14:30",
    },
    {
      name: "SystemSettings.test.tsx",
      status: "pass",
      duration: "1.2s",
      coverage: 85,
      lastRun: "2023-05-24 14:32",
    },
    {
      name: "PermissionsManager.test.tsx",
      status: "fail",
      duration: "0.6s",
      coverage: 62,
      lastRun: "2023-05-24 14:28",
    },
    {
      name: "ThemeSettings.test.tsx",
      status: "pass",
      duration: "0.5s",
      coverage: 91,
      lastRun: "2023-05-24 14:25",
    },
    {
      name: "NotificationSettings.test.tsx",
      status: "pass",
      duration: "0.7s",
      coverage: 73,
      lastRun: "2023-05-24 14:20",
    },
  ];

  const integrationTests = [
    {
      name: "Settings_UserFlow.test.tsx",
      status: "pass",
      duration: "2.3s",
      coverage: 68,
      lastRun: "2023-05-24 15:10",
    },
    {
      name: "Settings_AdminFlow.test.tsx",
      status: "fail",
      duration: "1.8s",
      coverage: 54,
      lastRun: "2023-05-24 15:05",
    },
    {
      name: "Settings_ThemeToggle.test.tsx",
      status: "pass",
      duration: "1.5s",
      coverage: 82,
      lastRun: "2023-05-24 15:00",
    },
  ];

  const handleRunTests = () => {
    setIsRunningTests(true);
    // Simulate test running
    setTimeout(() => {
      setIsRunningTests(false);
    }, 2000);
  };

  const handleRunFailingTests = () => {
    setIsRunningTests(true);
    // Simulate test running
    setTimeout(() => {
      setIsRunningTests(false);
    }, 1500);
  };

  const getOverallCoverage = () => {
    const tests = activeTab === "unit" ? unitTests : integrationTests;
    const totalCoverage = tests.reduce((sum, test) => sum + test.coverage, 0);
    return Math.round(totalCoverage / tests.length);
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isRTL ? "لوحة اختبار الإعدادات" : "Settings Test Panel"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "تصدير التقرير" : "Export Report"}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleRunTests}
            disabled={isRunningTests}
          >
            {isRunningTests ? (
              <RefreshCw className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            )}
            {isRTL ? "تشغيل الاختبارات" : "Run Tests"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isRTL ? "إجمالي التغطية" : "Overall Coverage"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getOverallCoverage()}%</div>
            <Progress value={getOverallCoverage()} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isRTL ? "اختبارات الوحدة" : "Unit Tests"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unitTests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {unitTests.filter((t) => t.status === "pass").length}{" "}
              {isRTL ? "ناجح" : "passing"},{" "}
              {unitTests.filter((t) => t.status === "fail").length}{" "}
              {isRTL ? "فاشل" : "failing"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isRTL ? "اختبارات التكامل" : "Integration Tests"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrationTests.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {integrationTests.filter((t) => t.status === "pass").length}{" "}
              {isRTL ? "ناجح" : "passing"},{" "}
              {integrationTests.filter((t) => t.status === "fail").length}{" "}
              {isRTL ? "فاشل" : "failing"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {isRTL ? "آخر تشغيل" : "Last Run"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14:32</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isRTL ? "24 مايو 2023" : "May 24, 2023"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="unit" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="unit">
            {isRTL ? "اختبارات الوحدة" : "Unit Tests"}
          </TabsTrigger>
          <TabsTrigger value="integration">
            {isRTL ? "اختبارات التكامل" : "Integration Tests"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "نتائج اختبارات الوحدة" : "Unit Test Results"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">
                        {isRTL ? "اسم الاختبار" : "Test Name"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "الحالة" : "Status"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "المدة" : "Duration"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "التغطية" : "Coverage"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "آخر تشغيل" : "Last Run"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitTests.map((test, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{test.name}</td>
                        <td className="py-2 px-4">
                          {test.status === "pass" ? (
                            <Badge
                              variant="success"
                              className="bg-green-100 text-green-800 hover:bg-green-100"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {isRTL ? "نجاح" : "Pass"}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              {isRTL ? "فشل" : "Fail"}
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 px-4">{test.duration}</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            <Progress
                              value={test.coverage}
                              className="h-2 w-24 mr-2"
                            />
                            <span>{test.coverage}%</span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {test.lastRun}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button onClick={handleRunTests} disabled={isRunningTests}>
              {isRunningTests ? (
                <RefreshCw className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              )}
              {isRTL ? "تشغيل جميع الاختبارات" : "Run All Tests"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleRunFailingTests}
              disabled={isRunningTests}
            >
              <AlertTriangle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "تشغيل الاختبارات الفاشلة" : "Run Failing Tests"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "نتائج اختبارات التكامل" : "Integration Test Results"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">
                        {isRTL ? "اسم الاختبار" : "Test Name"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "الحالة" : "Status"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "المدة" : "Duration"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "التغطية" : "Coverage"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "آخر تشغيل" : "Last Run"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {integrationTests.map((test, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{test.name}</td>
                        <td className="py-2 px-4">
                          {test.status === "pass" ? (
                            <Badge
                              variant="success"
                              className="bg-green-100 text-green-800 hover:bg-green-100"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {isRTL ? "نجاح" : "Pass"}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <XCircle className="h-3 w-3 mr-1" />
                              {isRTL ? "فشل" : "Fail"}
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 px-4">{test.duration}</td>
                        <td className="py-2 px-4">
                          <div className="flex items-center">
                            <Progress
                              value={test.coverage}
                              className="h-2 w-24 mr-2"
                            />
                            <span>{test.coverage}%</span>
                          </div>
                        </td>
                        <td className="py-2 px-4">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {test.lastRun}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-2 rtl:space-x-reverse">
            <Button onClick={handleRunTests} disabled={isRunningTests}>
              {isRunningTests ? (
                <RefreshCw className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              )}
              {isRTL ? "تشغيل جميع الاختبارات" : "Run All Tests"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleRunFailingTests}
              disabled={isRunningTests}
            >
              <AlertTriangle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "تشغيل الاختبارات الفاشلة" : "Run Failing Tests"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsTestPanel;
