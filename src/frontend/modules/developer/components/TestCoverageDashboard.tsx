import React from "react";
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
  List,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";

interface TestCoverageDashboardProps {
  isRTL?: boolean;
}

const TestCoverageDashboard = ({
  isRTL = false,
}: TestCoverageDashboardProps) => {
  // Mock data for demonstration
  const moduleTestProgress = [
    {
      module: "Store",
      coverage: 78,
      hasTestPanel: true,
      path: "/dashboard/store/test-panel",
    },
    {
      module: "Accounting",
      coverage: 65,
      hasTestPanel: true,
      path: "/dashboard/accounting/test-panel",
    },
    {
      module: "Marketing",
      coverage: 42,
      hasTestPanel: true,
      path: "/dashboard/marketing/test-panel",
    },
    {
      module: "Inbox",
      coverage: 56,
      hasTestPanel: true,
      path: "/dashboard/inbox/test-panel",
    },
    { module: "Analytics", coverage: 38, hasTestPanel: false, path: "" },
    { module: "Customers", coverage: 71, hasTestPanel: false, path: "" },
    {
      module: "Documents",
      coverage: 49,
      hasTestPanel: true,
      path: "/dashboard/documents/test-panel",
    },
    {
      module: "Integrations",
      coverage: 33,
      hasTestPanel: true,
      path: "/dashboard/integrations/test-panel",
    },
    { module: "Developer", coverage: 85, hasTestPanel: false, path: "" },
    { module: "Settings", coverage: 62, hasTestPanel: false, path: "" },
    {
      module: "Customer Service",
      coverage: 74,
      hasTestPanel: true,
      path: "/dashboard/customer-service/test-panel",
    },
    { module: "AI Assistant", coverage: 29, hasTestPanel: false, path: "" },
    {
      module: "Storefront",
      coverage: 68,
      hasTestPanel: true,
      path: "/dashboard/storefront/test-panel",
    },
  ];

  const recentTestRuns = [
    {
      module: "Store",
      file: "ProductManager.tsx",
      lastTested: "2023-05-24 14:32",
      status: "pass",
      duration: "1.2s",
    },
    {
      module: "Accounting",
      file: "InvoiceList.tsx",
      lastTested: "2023-05-24 14:30",
      status: "fail",
      duration: "0.8s",
    },
    {
      module: "Marketing",
      file: "CampaignManager.tsx",
      lastTested: "2023-05-24 14:28",
      status: "pass",
      duration: "1.5s",
    },
    {
      module: "Developer",
      file: "ApiTester.tsx",
      lastTested: "2023-05-24 14:25",
      status: "pass",
      duration: "0.6s",
    },
    {
      module: "Settings",
      file: "UserSettings.tsx",
      lastTested: "2023-05-24 14:20",
      status: "fail",
      duration: "1.1s",
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isRTL ? "لوحة تغطية الاختبار" : "Test Coverage Dashboard"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "تصدير التقرير" : "Export Report"}
          </Button>
          <Button variant="outline" size="sm">
            <List className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "عرض السجلات" : "View Logs"}
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
            <Link to="/tempobook/storyboards/storefront-test-panel">
              <Button variant="outline" className="w-full justify-start">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isRTL ? "لوحة اختبار واجهة المتجر" : "Storefront Test Panel"}
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
          {/* Module Test Progress Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "تقدم اختبار الوحدة" : "Module Test Progress"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleTestProgress.map((item) => (
                  <div key={item.module} className="flex items-center">
                    <span className="w-1/4 font-medium">
                      {item.hasTestPanel ? (
                        <Link
                          to={item.path}
                          className="flex items-center hover:text-primary transition-colors"
                        >
                          {item.module}
                          <ExternalLink className="h-3 w-3 ml-1 inline-block" />
                        </Link>
                      ) : (
                        item.module
                      )}
                    </span>
                    <div className="w-2/4 mx-4">
                      <Progress value={item.coverage} className="h-2" />
                    </div>
                    <span className="w-1/4 text-sm">
                      {item.coverage}% {isRTL ? "مغطى" : "covered"}
                      {item.coverage < 50 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 rtl:mr-2 rtl:ml-0"
                        >
                          {isRTL ? "منخفض" : "Low"}
                        </Badge>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Test Runs Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "عمليات الاختبار الأخيرة" : "Recent Test Runs"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">
                        {isRTL ? "الوحدة" : "Module"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "الملف" : "File"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "آخر اختبار" : "Last Tested"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "الحالة" : "Status"}
                      </th>
                      <th className="text-left py-2 px-4">
                        {isRTL ? "المدة" : "Duration"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTestRuns.map((run, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{run.module}</td>
                        <td className="py-2 px-4">{run.file}</td>
                        <td className="py-2 px-4">{run.lastTested}</td>
                        <td className="py-2 px-4">
                          {run.status === "pass" ? (
                            <Badge
                              variant="success"
                              className="bg-green-100 text-green-800 hover:bg-green-100"
                            >
                              ✅ {isRTL ? "نجاح" : "Pass"}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              ❌ {isRTL ? "فشل" : "Fail"}
                            </Badge>
                          )}
                        </td>
                        <td className="py-2 px-4">{run.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Section */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "إجراءات سريعة" : "Quick Actions"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>
                  <Play className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isRTL ? "تشغيل جميع الاختبارات" : "Run All Tests"}
                </Button>
                <Button variant="secondary">
                  <AlertTriangle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isRTL ? "تشغيل الاختبارات الفاشلة" : "Run Failing Tests"}
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {isRTL ? "إنشاء تقرير" : "Generate Report"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                {isRTL
                  ? "عرض تفاصيل اختبار الوحدة لكل وحدة. انقر على وحدة لعرض لوحة الاختبار الخاصة بها."
                  : "View detailed test information for each module. Click on a module to view its test panel."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                {isRTL
                  ? "عرض سجل عمليات الاختبار السابقة والتغييرات في تغطية الاختبار بمرور الوقت."
                  : "View history of previous test runs and changes in test coverage over time."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestCoverageDashboard;
