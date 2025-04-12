import React, { useCallback } from "react";
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
  Database,
  Github,
  Play,
  History,
  Settings,
  Server,
} from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { useAI } from "@/frontend/contexts/AIContext";

interface DeveloperDashboardProps {
  isRTL?: boolean;
}

const DeveloperDashboard = ({ isRTL = false }: DeveloperDashboardProps) => {
  const { direction } = useLanguage();
  const { promptAIAssistant } = useAI();
  const effectiveRTL = isRTL || direction === "rtl";

  const handleAIAnalysis = useCallback(() => {
    const prompt = effectiveRTL
      ? "قم بتحليل المشروع بالكامل من بدايته إلى الآن، وتلخيص ما تم إنجازه، وما تبقى للتطوير بشكل كامل، مع تقديم اقتراحاتك للمراحل التالية."
      : "Analyze the entire project from its inception to now, summarize what has been accomplished, what remains to be developed, and provide suggestions for future phases.";
    promptAIAssistant(prompt);
  }, [effectiveRTL, promptAIAssistant]);

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
              <Database className="h-5 w-5 mr-2 rtl:ml-2 rtl:mr-0" />
              {isRTL ? "إدارة الترحيل" : "Migration Management"}
            </CardTitle>
            <CardDescription>
              {isRTL
                ? "إدارة ترحيلات قاعدة البيانات وتتبع التغييرات"
                : "Manage database migrations and track changes"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {isRTL
                ? "تشغيل استعلامات SQL المخصصة واستيراد ملفات الترحيل من GitHub وعرض سجلات الترحيل"
                : "Run custom SQL queries, import migration files from GitHub, and view migration logs"}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Button
                asChild
                variant="outline"
                className="flex items-center justify-center"
              >
                <Link to="/dashboard/developer/migration-runner">
                  <Play className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                  {isRTL ? "منفذ SQL" : "SQL Runner"}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex items-center justify-center"
              >
                <Link to="/dashboard/developer/github-importer">
                  <Github className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                  {isRTL ? "مستورد GitHub" : "GitHub Importer"}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex items-center justify-center"
              >
                <Link to="/dashboard/developer/migration-logs">
                  <History className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                  {isRTL ? "سجلات الترحيل" : "Migration Logs"}
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <Button asChild variant="outline">
                <Link to="/dashboard/developer/migration-dashboard">
                  {isRTL ? "لوحة تحكم الترحيل" : "Migration Dashboard"}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/developer/migration-setup">
                  <Settings className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                  {isRTL ? "إعداد نظام الترحيل" : "Migration Setup"}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/dashboard/developer/diagnostic-logs">
                  <Server className="h-4 w-4 mr-1 rtl:ml-1 rtl:mr-0" />
                  {isRTL ? "سجلات التشخيص" : "Diagnostic Logs"}
                </Link>
              </Button>
            </div>
            <Button asChild className="w-full">
              <Link to="/dashboard/developer/migration-dashboard">
                {isRTL ? "فتح لوحة تحكم الترحيل" : "Open Migration Dashboard"}
              </Link>
            </Button>
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
            <div className="grid grid-cols-1 gap-2 mb-2">
              <Button
                onClick={handleAIAnalysis}
                variant="outline"
                className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300"
              >
                {isRTL
                  ? "تحليل شامل بالذكاء الاصطناعي"
                  : "AI Comprehensive Analysis"}
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-2 mb-2">
              <Button
                onClick={() => {
                  const { promptAIAssistant } = useAI();
                  const prompt = isRTL
                    ? "قم بتحليل المشروع بالكامل من بدايته إلى الآن، وتلخيص ما تم إنجازه، وما تبقى للتطوير بشكل كامل، مع تقديم اقتراحاتك للمراحل التالية."
                    : "Analyze the entire project from its inception to now, summarize what has been accomplished, what remains to be developed, and provide suggestions for future phases.";
                  promptAIAssistant(prompt);
                }}
                variant="outline"
                className="w-full bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300"
              >
                {isRTL
                  ? "تحليل شامل بالذكاء الاصطناعي"
                  : "AI Comprehensive Analysis"}
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
