import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Progress } from "@/frontend/components/ui/progress";
import { Badge } from "@/frontend/components/ui/badge";
import { Play, FileText, AlertTriangle } from "lucide-react";

interface IntegrationsTestPanelProps {
  isRTL?: boolean;
}

const IntegrationsTestPanel = ({
  isRTL = false,
}: IntegrationsTestPanelProps) => {
  // Mock data for demonstration
  const testCases = [
    {
      name: "Payment Gateway Integration",
      status: "pass",
      coverage: 78,
      lastRun: "2023-05-24 14:32",
    },
    {
      name: "CRM Data Sync",
      status: "fail",
      coverage: 45,
      lastRun: "2023-05-24 13:15",
    },
    {
      name: "External API Authentication",
      status: "pass",
      coverage: 92,
      lastRun: "2023-05-24 12:45",
    },
    {
      name: "Webhook Handlers",
      status: "pass",
      coverage: 67,
      lastRun: "2023-05-24 11:30",
    },
    {
      name: "Integration Health Monitoring",
      status: "fail",
      coverage: 38,
      lastRun: "2023-05-24 10:15",
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {isRTL ? "لوحة اختبار التكاملات" : "Integrations Test Panel"}
        </h1>
        <div className="space-x-2 rtl:space-x-reverse">
          <Button>
            <Play className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "تشغيل جميع الاختبارات" : "Run All Tests"}
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
            {isRTL ? "تصدير التقرير" : "Export Report"}
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {isRTL ? "ملخص اختبار التكاملات" : "Integrations Test Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">64%</div>
                  <p className="text-muted-foreground">
                    {isRTL ? "متوسط التغطية" : "Average Coverage"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">3/5</div>
                  <p className="text-muted-foreground">
                    {isRTL ? "الاختبارات الناجحة" : "Tests Passing"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-muted-foreground">
                    {isRTL ? "الاختبارات الفاشلة" : "Tests Failing"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {testCases.map((test, index) => (
              <div key={index} className="flex items-center">
                <span className="w-1/3 font-medium">{test.name}</span>
                <div className="w-1/3 mx-4">
                  <Progress value={test.coverage} className="h-2" />
                </div>
                <span className="w-1/6 text-sm">
                  {test.coverage}% {isRTL ? "مغطى" : "covered"}
                </span>
                <span className="w-1/6 text-right">
                  {test.status === "pass" ? (
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
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "إجراءات الاختبار" : "Test Actions"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary">
              <AlertTriangle className="h-4 w-4 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "تشغيل الاختبارات الفاشلة" : "Run Failing Tests"}
            </Button>
            <Button variant="outline">
              {isRTL ? "إعادة تعيين بيانات الاختبار" : "Reset Test Data"}
            </Button>
            <Button variant="outline">
              {isRTL ? "تكوين الاختبار" : "Configure Tests"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTestPanel;
