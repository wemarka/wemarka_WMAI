import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import {
  Play,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DashboardTestPanelProps {
  isRTL?: boolean;
}

const DashboardTestPanel = ({ isRTL = false }: DashboardTestPanelProps) => {
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Mock data for demonstration
  const overallCoverage = 72;

  const unitTests = [
    {
      id: 1,
      name: "MainDashboard.test.tsx",
      description: "Should render dashboard widgets correctly",
      status: "pass",
      duration: "0.8s",
      lastRun: "2023-05-24 10:15",
    },
    {
      id: 2,
      name: "QuickStats.test.tsx",
      description: "Should display correct statistics",
      status: "pass",
      duration: "0.5s",
      lastRun: "2023-05-24 10:15",
    },
    {
      id: 3,
      name: "RecentActivity.test.tsx",
      description: "Should render activity items",
      status: "fail",
      duration: "0.6s",
      lastRun: "2023-05-24 10:16",
    },
    {
      id: 4,
      name: "WidgetGrid.test.tsx",
      description: "Should handle widget resizing",
      status: "pass",
      duration: "0.9s",
      lastRun: "2023-05-24 10:16",
    },
    {
      id: 5,
      name: "SidebarNavigation.test.tsx",
      description: "Should toggle sidebar correctly",
      status: "pass",
      duration: "0.4s",
      lastRun: "2023-05-24 10:17",
    },
  ];

  const integrationTests = [
    {
      id: 1,
      name: "DashboardModuleIntegration.test.tsx",
      description: "Should integrate with other modules",
      status: "pass",
      duration: "1.2s",
      lastRun: "2023-05-24 10:20",
    },
    {
      id: 2,
      name: "DashboardRouting.test.tsx",
      description: "Should navigate between dashboard views",
      status: "pass",
      duration: "0.9s",
      lastRun: "2023-05-24 10:21",
    },
    {
      id: 3,
      name: "DashboardDataFetching.test.tsx",
      description: "Should fetch and display dashboard data",
      status: "fail",
      duration: "1.5s",
      lastRun: "2023-05-24 10:22",
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

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isRTL ? "لوحة اختبار لوحة المعلومات" : "Dashboard Test Panel"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
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
                {unitTests.filter((test) => test.status === "pass").length +
                  integrationTests.filter((test) => test.status === "pass")
                    .length}
              </div>
            </div>
            <div className="bg-muted/50 p-3 rounded-lg">
              <div className="text-sm text-muted-foreground">
                {isRTL ? "فاشل" : "Failing"}
              </div>
              <div className="text-xl font-bold text-red-600">
                {unitTests.filter((test) => test.status === "fail").length +
                  integrationTests.filter((test) => test.status === "fail")
                    .length}
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
        </TabsList>

        <TabsContent value="unit" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
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
                        {isRTL ? "المدة" : "Duration"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "آخر تشغيل" : "Last Run"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitTests.map((test) => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{test.name}</td>
                        <td className="py-2 px-4">{test.description}</td>
                        <td className="py-2 px-4">
                          {test.status === "pass" ? (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {isRTL ? "نجاح" : "Pass"}
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
                        <td className="py-2 px-4">{test.duration}</td>
                        <td className="py-2 px-4">{test.lastRun}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
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
                        {isRTL ? "المدة" : "Duration"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "آخر تشغيل" : "Last Run"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {integrationTests.map((test) => (
                      <tr key={test.id} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{test.name}</td>
                        <td className="py-2 px-4">{test.description}</td>
                        <td className="py-2 px-4">
                          {test.status === "pass" ? (
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {isRTL ? "نجاح" : "Pass"}
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
                        <td className="py-2 px-4">{test.duration}</td>
                        <td className="py-2 px-4">{test.lastRun}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
            <Button onClick={handleRunTests} disabled={isRunningTests}>
              {isRunningTests ? (
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
              onClick={handleRunFailingTests}
              disabled={isRunningTests}
            >
              {isRunningTests ? (
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
