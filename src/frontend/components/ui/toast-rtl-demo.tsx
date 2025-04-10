import React from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./card";
import { useEnhancedToast } from "./toast-enhanced";
import { useToast } from "./use-toast";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

/**
 * RTL-compatible toast demo component
 */
export function ToastRTLDemo() {
  const { toast } = useToast();
  const enhancedToast = useEnhancedToast();
  const { direction, toggleDirection } = useLanguage();
  const isRTL = direction === "rtl";

  const translations = {
    title: isRTL ? "عرض الإشعارات" : "Toast Notifications Demo",
    basicToasts: isRTL ? "الإشعارات الأساسية" : "Basic Toasts",
    enhancedToasts: isRTL ? "الإشعارات المحسنة" : "Enhanced Toasts",
    withActions: isRTL ? "مع إجراءات" : "With Actions",
    defaultToast: isRTL ? "إشعار افتراضي" : "Default Toast",
    destructiveToast: isRTL ? "إشعار تحذيري" : "Destructive Toast",
    success: isRTL ? "نجاح" : "Success",
    error: isRTL ? "خطأ" : "Error",
    info: isRTL ? "معلومات" : "Info",
    warning: isRTL ? "تحذير" : "Warning",
    withAction: isRTL ? "مع إجراء" : "With Action",
    persistent: isRTL ? "مستمر" : "Persistent",
    toggleDirection: isRTL ? "تبديل الاتجاه إلى LTR" : "Toggle to RTL",
    footer: isRTL
      ? "انقر على الأزرار أعلاه لرؤية إشعارات مختلفة"
      : "Click the buttons above to see different toast notifications",
    defaultDesc: isRTL
      ? "هذا إشعار افتراضي"
      : "This is a default toast notification",
    destructiveDesc: isRTL
      ? "هذا إشعار تحذيري"
      : "This is a destructive toast notification",
    successDesc: isRTL
      ? "تمت العملية بنجاح"
      : "Operation completed successfully",
    errorDesc: isRTL
      ? "حدث خطأ أثناء العملية"
      : "An error occurred during the operation",
    infoDesc: isRTL ? "إليك بعض المعلومات" : "Here's some information for you",
    warningDesc: isRTL
      ? "يرجى توخي الحذر مع هذا الإجراء"
      : "Please be careful with this action",
    newFeatureTitle: isRTL ? "ميزة جديدة" : "New Feature",
    newFeatureDesc: isRTL
      ? "لقد أضفنا ميزة جديدة قد تعجبك"
      : "We've added a new feature you might like",
    viewAction: isRTL ? "عرض" : "View",
    sessionTitle: isRTL ? "انتهاء الجلسة" : "Session Expiring",
    sessionDesc: isRTL
      ? "ستنتهي جلستك في 5 دقائق"
      : "Your session will expire in 5 minutes",
    extendAction: isRTL ? "تمديد" : "Extend",
    actionClicked: isRTL ? "تم النقر على الإجراء!" : "Action clicked!",
    sessionExtended: isRTL ? "تم تمديد الجلسة!" : "Session extended!",
  };

  return (
    <Card className="w-full max-w-md mx-auto" dir={direction}>
      <CardHeader>
        <CardTitle>{translations.title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDirection}
          className="self-end"
        >
          {translations.toggleDirection}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">{translations.basicToasts}</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: translations.defaultToast,
                  description: translations.defaultDesc,
                })
              }
            >
              {translations.defaultToast}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast({
                  title: translations.destructiveToast,
                  description: translations.destructiveDesc,
                  variant: "destructive",
                })
              }
            >
              {translations.destructiveToast}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">{translations.enhancedToasts}</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="bg-green-500/10"
              onClick={() =>
                enhancedToast.success({
                  title: translations.success,
                  description: translations.successDesc,
                })
              }
            >
              {translations.success}
            </Button>
            <Button
              variant="outline"
              className="bg-red-500/10"
              onClick={() =>
                enhancedToast.error({
                  title: translations.error,
                  description: translations.errorDesc,
                })
              }
            >
              {translations.error}
            </Button>
            <Button
              variant="outline"
              className="bg-blue-500/10"
              onClick={() =>
                enhancedToast.info({
                  title: translations.info,
                  description: translations.infoDesc,
                })
              }
            >
              {translations.info}
            </Button>
            <Button
              variant="outline"
              className="bg-yellow-500/10"
              onClick={() =>
                enhancedToast.warning({
                  title: translations.warning,
                  description: translations.warningDesc,
                })
              }
            >
              {translations.warning}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">{translations.withActions}</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() =>
                enhancedToast.info({
                  title: translations.newFeatureTitle,
                  description: translations.newFeatureDesc,
                  actionLabel: translations.viewAction,
                  onAction: () => alert(translations.actionClicked),
                  duration: 5000,
                })
              }
            >
              {translations.withAction}
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                enhancedToast.warning({
                  title: translations.sessionTitle,
                  description: translations.sessionDesc,
                  actionLabel: translations.extendAction,
                  onAction: () => alert(translations.sessionExtended),
                  duration: 0, // Won't auto-dismiss
                })
              }
            >
              {translations.persistent}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {translations.footer}
      </CardFooter>
    </Card>
  );
}
