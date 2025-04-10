import React, { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./card";
import { useEnhancedToast } from "./toast-enhanced";
import { useToast } from "./use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./label";
import { Switch } from "./switch";
import { AnimatedToaster, AnimatedEnhancedToaster } from "./toast";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

type ToastPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

/**
 * Demo component to showcase the animated toast functionality
 */
export function ToastAnimationDemo() {
  const { toast } = useToast();
  const enhancedToast = useEnhancedToast();
  const { direction, toggleDirection } = useLanguage();
  const isRTL = direction === "rtl";

  const [position, setPosition] = useState<ToastPosition>("bottom-right");
  const [useEnhanced, setUseEnhanced] = useState(true);

  // Translations for RTL support
  const translations = {
    title: isRTL ? "عرض الإشعارات المتحركة" : "Animated Toast Notifications",
    basicToasts: isRTL ? "الإشعارات الأساسية" : "Basic Toasts",
    enhancedToasts: isRTL ? "الإشعارات المحسنة" : "Enhanced Toasts",
    position: isRTL ? "الموضع" : "Position",
    topRight: isRTL ? "أعلى اليمين" : "Top Right",
    topLeft: isRTL ? "أعلى اليسار" : "Top Left",
    bottomRight: isRTL ? "أسفل اليمين" : "Bottom Right",
    bottomLeft: isRTL ? "أسفل اليسار" : "Bottom Left",
    useEnhanced: isRTL ? "استخدام المحسن" : "Use Enhanced",
    default: isRTL ? "افتراضي" : "Default",
    destructive: isRTL ? "تحذيري" : "Destructive",
    success: isRTL ? "نجاح" : "Success",
    error: isRTL ? "خطأ" : "Error",
    info: isRTL ? "معلومات" : "Info",
    warning: isRTL ? "تحذير" : "Warning",
    withAction: isRTL ? "مع إجراء" : "With Action",
    toggleDirection: isRTL ? "تبديل الاتجاه إلى LTR" : "Toggle to RTL",
    footer: isRTL
      ? "انقر على الأزرار أعلاه لرؤية إشعارات متحركة مختلفة"
      : "Click the buttons above to see different animated toast notifications",
  };

  return (
    <Card className="w-full max-w-md mx-auto" dir={direction}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{translations.title}</CardTitle>
        <Button variant="outline" size="sm" onClick={toggleDirection}>
          {translations.toggleDirection}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="position-select">{translations.position}</Label>
            <Select
              value={position}
              onValueChange={(value) => setPosition(value as ToastPosition)}
            >
              <SelectTrigger id="position-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top-right">
                  {translations.topRight}
                </SelectItem>
                <SelectItem value="top-left">{translations.topLeft}</SelectItem>
                <SelectItem value="bottom-right">
                  {translations.bottomRight}
                </SelectItem>
                <SelectItem value="bottom-left">
                  {translations.bottomLeft}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enhanced-switch">{translations.useEnhanced}</Label>
            <Switch
              id="enhanced-switch"
              checked={useEnhanced}
              onCheckedChange={setUseEnhanced}
            />
          </div>
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="basic">{translations.basicToasts}</TabsTrigger>
            <TabsTrigger value="enhanced">
              {translations.enhancedToasts}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    title: translations.default,
                    description: `${new Date().toLocaleTimeString()}`,
                  })
                }
              >
                {translations.default}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast({
                    title: translations.destructive,
                    description: `${new Date().toLocaleTimeString()}`,
                    variant: "destructive",
                  })
                }
              >
                {translations.destructive}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="enhanced" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="bg-green-500/10"
                onClick={() =>
                  enhancedToast.success({
                    title: translations.success,
                    description: `${new Date().toLocaleTimeString()}`,
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
                    description: `${new Date().toLocaleTimeString()}`,
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
                    description: `${new Date().toLocaleTimeString()}`,
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
                    description: `${new Date().toLocaleTimeString()}`,
                  })
                }
              >
                {translations.warning}
              </Button>
              <Button
                variant="outline"
                className="col-span-2"
                onClick={() =>
                  enhancedToast.info({
                    title: translations.withAction,
                    description: `${new Date().toLocaleTimeString()}`,
                    actionLabel: "OK",
                    onAction: () => alert("Action clicked!"),
                    duration: 5000,
                  })
                }
              >
                {translations.withAction}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {translations.footer}
      </CardFooter>

      {/* Render the appropriate toaster based on user selection */}
      {useEnhanced ? (
        <AnimatedEnhancedToaster position={position} />
      ) : (
        <AnimatedToaster position={position} />
      )}
    </Card>
  );
}
