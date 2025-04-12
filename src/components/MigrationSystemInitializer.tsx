import React, { useState, useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/frontend/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Database,
  RefreshCw,
  AlertTriangle,
  Server,
  Check,
  X,
  Info,
} from "lucide-react";
import {
  setupMigrationSystem,
  checkMigrationSystemStatus,
} from "@/utils/setupMigrationSystem";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

const MigrationSystemInitializer: React.FC = () => {
  const { toast } = useToast();
  const { direction } = useLanguage();
  const rtl = direction === "rtl";
  const [isInitializing, setIsInitializing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [initializationResult, setInitializationResult] = useState<any>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [autoInitialized, setAutoInitialized] = useState(false);

  // Auto-initialize on component mount
  useEffect(() => {
    if (!autoInitialized) {
      checkStatus();
      setAutoInitialized(true);
    }
  }, []);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const result = await checkMigrationSystemStatus();
      setSystemStatus(result.status);

      if (result.success) {
        if (result.status.status === "complete") {
          toast({
            title: rtl ? "النظام جاهز" : "System Ready",
            description: rtl
              ? "نظام الترحيل مهيأ بالكامل وجاهز للاستخدام"
              : "Migration system is fully initialized and ready to use",
            variant: "success",
          });
        } else {
          toast({
            title: rtl ? "النظام غير مكتمل" : "System Incomplete",
            description: rtl
              ? "نظام الترحيل يحتاج إلى إعداد"
              : "Migration system needs setup",
            variant: "warning",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: rtl ? "خطأ في التحقق" : "Check Error",
        description: `${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const initializeMigrationSystem = async () => {
    setIsInitializing(true);
    setInitializationResult(null);

    try {
      const result = await setupMigrationSystem();
      setInitializationResult(result);

      if (result.success) {
        toast({
          title: rtl ? "تم الإعداد بنجاح" : "Setup Successful",
          description: rtl
            ? "تم إعداد نظام الترحيل بنجاح"
            : "Migration system has been successfully set up",
          variant: "success",
        });

        // Check status after initialization
        await checkStatus();
      } else {
        toast({
          title: rtl ? "فشل الإعداد" : "Setup Failed",
          description: rtl
            ? `فشل إعداد نظام الترحيل: ${result.error?.message || "خطأ غير معروف"}`
            : `Failed to set up migration system: ${result.error?.message || "Unknown error"}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setInitializationResult({
        success: false,
        error: { message: error.message },
      });
      toast({
        title: rtl ? "خطأ" : "Error",
        description: `${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const renderStatusComponent = (status: boolean | null, label: string) => {
    if (status === null) return null;

    return (
      <div className="flex items-center justify-between py-1">
        <span>{label}</span>
        {status ? (
          <span className="inline-flex items-center text-green-600 dark:text-green-400">
            <Check className="h-4 w-4 mr-1" />
            {rtl ? "متوفر" : "Available"}
          </span>
        ) : (
          <span className="inline-flex items-center text-red-600 dark:text-red-400">
            <X className="h-4 w-4 mr-1" />
            {rtl ? "غير متوفر" : "Not Available"}
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5" />
          {rtl ? "مُهيئ نظام الترحيل" : "Migration System Initializer"}
        </CardTitle>
        <CardDescription>
          {rtl
            ? "إعداد وتهيئة نظام ترحيل قاعدة البيانات"
            : "Set up and initialize the database migration system"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {systemStatus && (
          <Alert
            variant={systemStatus.status === "complete" ? "success" : "warning"}
          >
            {systemStatus.status === "complete" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle>
              {rtl
                ? systemStatus.status === "complete"
                  ? "النظام جاهز"
                  : "النظام غير مكتمل"
                : systemStatus.status === "complete"
                  ? "System Ready"
                  : "System Incomplete"}
            </AlertTitle>
            <AlertDescription>
              {rtl
                ? systemStatus.status === "complete"
                  ? "نظام الترحيل مهيأ بالكامل وجاهز للاستخدام"
                  : "نظام الترحيل يحتاج إلى إعداد"
                : systemStatus.status === "complete"
                  ? "Migration system is fully initialized and ready to use"
                  : "Migration system needs setup"}
            </AlertDescription>
          </Alert>
        )}

        {initializationResult?.success && (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>
              {rtl ? "تم الإعداد بنجاح" : "Setup Successful"}
            </AlertTitle>
            <AlertDescription>
              {rtl
                ? "تم إعداد نظام الترحيل بنجاح. يمكنك الآن استخدام جميع وظائف الترحيل."
                : "Migration system has been successfully set up. You can now use all migration functions."}
            </AlertDescription>
          </Alert>
        )}

        {initializationResult?.success === false && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>{rtl ? "فشل الإعداد" : "Setup Failed"}</AlertTitle>
            <AlertDescription>
              {rtl
                ? `فشل إعداد نظام الترحيل: ${initializationResult.error?.message || "خطأ غير معروف"}`
                : `Failed to set up migration system: ${initializationResult.error?.message || "Unknown error"}`}
            </AlertDescription>
          </Alert>
        )}

        {systemStatus && (
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="status">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  {rtl ? "حالة مكونات النظام" : "System Component Status"}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                  {renderStatusComponent(
                    systemStatus.components.pg_query_function,
                    rtl ? "وظيفة pg_query" : "pg_query Function",
                  )}
                  {renderStatusComponent(
                    systemStatus.components.exec_sql_function,
                    rtl ? "وظيفة exec_sql" : "exec_sql Function",
                  )}
                  {renderStatusComponent(
                    systemStatus.components.migration_logs_table,
                    rtl ? "جدول migration_logs" : "migration_logs Table",
                  )}
                  {renderStatusComponent(
                    systemStatus.components.utility_functions,
                    rtl ? "وظائف المساعدة" : "Utility Functions",
                  )}
                  {renderStatusComponent(
                    systemStatus.components.realtime_enabled,
                    rtl ? "الوقت الفعلي مفعل" : "Realtime Enabled",
                  )}
                  {renderStatusComponent(
                    systemStatus.components.rls_enabled,
                    rtl ? "أمان مستوى الصف مفعل" : "Row Level Security Enabled",
                  )}
                  {renderStatusComponent(
                    systemStatus.components.policies_exist,
                    rtl ? "سياسات الأمان موجودة" : "Security Policies Exist",
                  )}
                </div>

                {systemStatus.missing_components &&
                  systemStatus.missing_components.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-1">
                        {rtl ? "المكونات المفقودة:" : "Missing Components:"}
                      </h4>
                      <ul className="list-disc pl-5 text-sm text-amber-600 dark:text-amber-400">
                        {systemStatus.missing_components.map(
                          (component: string, index: number) => (
                            <li key={index}>{component}</li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="text-base font-medium mb-2">
            {rtl ? "ماذا يفعل هذا؟" : "What does this do?"}
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              {rtl
                ? "ينشئ وظائف SQL اللازمة (pg_query، exec_sql)"
                : "Creates necessary SQL functions (pg_query, exec_sql)"}
            </li>
            <li>
              {rtl
                ? "ينشئ جدول migration_logs لتتبع عمليات الترحيل"
                : "Creates migration_logs table to track migration operations"}
            </li>
            <li>
              {rtl
                ? "ينشئ وظائف المساعدة (is_table_in_publication، add_table_to_publication)"
                : "Creates utility functions (is_table_in_publication, add_table_to_publication)"}
            </li>
            <li>
              {rtl
                ? "يعد أذونات قاعدة البيانات المناسبة"
                : "Sets up appropriate database permissions"}
            </li>
            <li>
              {rtl
                ? "يمكّن أمان مستوى الصف (RLS) مع السياسات المناسبة"
                : "Enables row-level security (RLS) with appropriate policies"}
            </li>
            <li>
              {rtl
                ? "يمكّن وظائف الوقت الفعلي للجداول ذات الصلة"
                : "Enables realtime functionality for relevant tables"}
            </li>
          </ul>
        </div>

        {!initializationResult && !systemStatus && (
          <div className="flex justify-center py-8">
            {isInitializing || isChecking ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <span className="text-muted-foreground">
                  {isInitializing
                    ? rtl
                      ? "جاري إعداد نظام الترحيل..."
                      : "Setting up migration system..."
                    : rtl
                      ? "جاري التحقق من حالة النظام..."
                      : "Checking system status..."}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Server className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-muted-foreground">
                  {rtl
                    ? "انقر على زر الإعداد لتهيئة نظام الترحيل"
                    : "Click the setup button to initialize the migration system"}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          {rtl ? "رجوع" : "Back"}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={checkStatus}
            disabled={isChecking || isInitializing}
            className="flex items-center"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {rtl ? "جاري التحقق..." : "Checking..."}
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {rtl ? "تحقق من الحالة" : "Check Status"}
              </>
            )}
          </Button>
          <Button
            onClick={initializeMigrationSystem}
            disabled={isInitializing || isChecking}
            className="flex items-center"
          >
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {rtl ? "جاري الإعداد..." : "Setting up..."}
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                {rtl ? "إعداد نظام الترحيل" : "Setup Migration System"}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MigrationSystemInitializer;
