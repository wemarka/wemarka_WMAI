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
import { Play, FileCode, CheckCircle, XCircle } from "lucide-react";

interface DocumentsTestPanelProps {
  isRTL?: boolean;
}

const DocumentsTestPanel = ({ isRTL = false }: DocumentsTestPanelProps) => {
  const [activeTab, setActiveTab] = useState("unit");

  // Mock data for demonstration
  const unitTests = [
    {
      file: "DocumentList.tsx",
      coverage: 83,
      status: "pass",
      lastRun: "2023-05-24 14:32",
    },
    {
      file: "DocumentViewer.tsx",
      coverage: 76,
      status: "pass",
      lastRun: "2023-05-24 13:45",
    },
    {
      file: "DocumentsDashboard.tsx",
      coverage: 69,
      status: "fail",
      lastRun: "2023-05-24 12:30",
    },
    {
      file: "DocumentSettings.tsx",
      coverage: 89,
      status: "pass",
      lastRun: "2023-05-24 11:15",
    },
    {
      file: "AIDocumentGenerator.tsx",
      coverage: 62,
      status: "pass",
      lastRun: "2023-05-24 10:20",
    },
  ];

  const integrationTests = [
    {
      file: "DocumentSharing.test.tsx",
      coverage: 77,
      status: "pass",
      lastRun: "2023-05-24 15:10",
    },
    {
      file: "VersionControl.test.tsx",
      coverage: 64,
      status: "fail",
      lastRun: "2023-05-24 14:55",
    },
    {
      file: "DocumentExport.test.tsx",
      coverage: 81,
      status: "pass",
      lastRun: "2023-05-24 13:30",
    },
  ];

  const getTestData = () => {
    return activeTab === "unit" ? unitTests : integrationTests;
  };

  const getOverallCoverage = () => {
    const tests = activeTab === "unit" ? unitTests : integrationTests;
    const total = tests.reduce((sum, test) => sum + test.coverage, 0);
    return Math.round(total / tests.length);
  };

  const getPassRate = () => {
    const tests = activeTab === "unit" ? unitTests : integrationTests;
    const passed = tests.filter((test) => test.status === "pass").length;
    return Math.round((passed / tests.length) * 100);
  };

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isRTL ? "لوحة اختبار المستندات" : "Documents Test Panel"}
        </h1>
        <Button>
          <Play className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
          {isRTL ? "تشغيل اختبارات الوحدة" : "Run Module Tests"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {isRTL ? "إجمالي التغطية" : "Overall Coverage"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">
                {getOverallCoverage()}%
              </div>
            </div>
            <Progress value={getOverallCoverage()} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {isRTL ? "معدل النجاح" : "Pass Rate"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">
                {getPassRate()}%
              </div>
            </div>
            <Progress value={getPassRate()} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {isRTL ? "ملفات مختبرة" : "Files Tested"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-primary">
                {activeTab === "unit"
                  ? unitTests.length
                  : integrationTests.length}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "تفاصيل الاختبار" : "Test Details"}</CardTitle>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="unit">
                {isRTL ? "اختبارات الوحدة" : "Unit Tests"}
              </TabsTrigger>
              <TabsTrigger value="integration">
                {isRTL ? "اختبارات التكامل" : "Integration Tests"}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">
                    {isRTL ? "الملف" : "File"}
                  </th>
                  <th className="text-left py-2 px-4">
                    {isRTL ? "التغطية" : "Coverage"}
                  </th>
                  <th className="text-left py-2 px-4">
                    {isRTL ? "الحالة" : "Status"}
                  </th>
                  <th className="text-left py-2 px-4">
                    {isRTL ? "آخر تشغيل" : "Last Run"}
                  </th>
                  <th className="text-left py-2 px-4">
                    {isRTL ? "إجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {getTestData().map((test, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4 flex items-center">
                      <FileCode className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0 text-muted-foreground" />
                      {test.file}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex items-center">
                        <Progress
                          value={test.coverage}
                          className="h-2 w-24 mr-2 rtl:ml-2 rtl:mr-0"
                        />
                        <span>{test.coverage}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      {test.status === "pass" ? (
                        <Badge
                          variant="success"
                          className="bg-green-100 text-green-800 hover:bg-green-100"
                        >
                          <CheckCircle className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                          {isRTL ? "نجاح" : "Pass"}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                          {isRTL ? "فشل" : "Fail"}
                        </Badge>
                      )}
                    </td>
                    <td className="py-2 px-4">{test.lastRun}</td>
                    <td className="py-2 px-4">
                      <Button variant="outline" size="sm">
                        <Play className="h-3 w-3 mr-1 rtl:ml-1 rtl:mr-0" />
                        {isRTL ? "تشغيل" : "Run"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsTestPanel;
