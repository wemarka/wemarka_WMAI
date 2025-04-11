import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Link } from "react-router-dom";
import {
  FileText,
  Code,
  List,
  TestTube,
  Globe,
  Activity,
  BarChart,
} from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface DeveloperDashboardProps {
  isRTL?: boolean;
}

const DeveloperDashboard = ({ isRTL = false }: DeveloperDashboardProps) => {
  const { direction } = useLanguage();
  const effectiveRTL = isRTL || direction === "rtl";

  return (
    <ModuleLayout moduleName={effectiveRTL ? "المطور" : "Developer"}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "مراقبة النظام" : "System Monitoring"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "مراقبة أداء النظام والسجلات والاستخدام"
                : "Monitor system performance, logs, and usage"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {isRTL
                ? "تتبع وقت التشغيل وسجلات الأخطاء والاستعلامات البطيئة ومقاييس الاستخدام"
                : "Track uptime, error logs, slow queries, and usage metrics"}
            </p>
            <Button asChild className="w-full">
              <Link to="/dashboard/developer/monitoring">
                {isRTL ? "فتح لوحة المراقبة" : "Open Monitoring Dashboard"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "تغطية الاختبار" : "Test Coverage"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "مراقبة وإدارة تغطية اختبار التطبيق"
                : "Monitor and manage application test coverage"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {isRTL
                ? "عرض تقدم الاختبار وتشغيل الاختبارات وإنشاء تقارير"
                : "View test progress, run tests, and generate reports"}
            </p>
            <Button asChild className="w-full">
              <Link to="/dashboard/developer/test-coverage">
                {isRTL
                  ? "فتح لوحة تغطية الاختبار"
                  : "Open Test Coverage Dashboard"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "عرض RTL" : "RTL Showcase"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "عرض توضيحي لدعم اللغات من اليمين إلى اليسار"
                : "Demonstration of Right-to-Left language support"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {isRTL
                ? "عرض مكونات واجهة المستخدم بتنسيق RTL"
                : "View UI components in RTL format"}
            </p>
            <Button asChild className="w-full">
              <Link to="/dashboard/developer/rtl-showcase">
                {isRTL ? "فتح عرض RTL" : "Open RTL Showcase"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "اختبار API" : "API Testing"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "اختبار وتوثيق واجهات برمجة التطبيقات"
                : "Test and document APIs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "سجل التغييرات" : "Changelog"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض سجل التغييرات" : "View changelog history"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <List className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "سجلات التطوير" : "Development Logs"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض سجلات التطوير" : "View development logs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "تحليل المشروع" : "Project Analysis"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "تحليل شامل لحالة المشروع والتقدم"
                : "Comprehensive analysis of project status and progress"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {isRTL
                ? "عرض تقدم الوحدات وخارطة الطريق وتوصيات التحسين"
                : "View module progress, roadmap, and improvement recommendations"}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button asChild variant="outline">
                <Link to="/dashboard/developer/project-analysis">
                  {isRTL ? "تحليل المشروع" : "Project Analysis"}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/developer/development-roadmap">
                  {isRTL ? "خارطة التطوير" : "Development Roadmap"}
                </Link>
              </Button>
            </div>
            <Button asChild className="w-full">
              <Link to="/dashboard/developer/project-analysis-dashboard">
                {isRTL
                  ? "فتح لوحة تحليل المشروع الشاملة"
                  : "Open Comprehensive Dashboard"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default DeveloperDashboard;
