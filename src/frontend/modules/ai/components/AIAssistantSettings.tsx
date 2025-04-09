import React, { useState } from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Settings, Save, RotateCcw } from "lucide-react";
import { Switch } from "@/frontend/components/ui/switch";
import { Label } from "@/frontend/components/ui/label";
import { Slider } from "@/frontend/components/ui/slider";
import { cn } from "@/frontend/lib/utils";

interface AIAssistantSettingsProps {
  onSaveSettings: (settings: AISettings) => void;
  onResetSettings: () => void;
}

interface AISettings {
  autoSuggest: boolean;
  responseLength: number;
  showAnalytics: boolean;
  enableVoiceInput: boolean;
  enableRealTimeHelp: boolean;
}

const AIAssistantSettings: React.FC<AIAssistantSettingsProps> = ({
  onSaveSettings,
  onResetSettings,
}) => {
  const { direction, language } = useLanguage();
  const isRTL = direction === "rtl";

  // Default settings
  const [settings, setSettings] = useState<AISettings>({
    autoSuggest: true,
    responseLength: 2, // 1=Brief, 2=Balanced, 3=Detailed
    showAnalytics: true,
    enableVoiceInput: false,
    enableRealTimeHelp: true,
  });

  const handleSwitchChange = (key: keyof AISettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSliderChange = (value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      responseLength: value[0],
    }));
  };

  const getResponseLengthLabel = (value: number) => {
    switch (value) {
      case 1:
        return isRTL ? "موجز" : "Brief";
      case 2:
        return isRTL ? "متوازن" : "Balanced";
      case 3:
        return isRTL ? "مفصل" : "Detailed";
      default:
        return isRTL ? "متوازن" : "Balanced";
    }
  };

  return (
    <Card className="w-full h-full bg-card rounded-lg shadow-sm border flex flex-col overflow-hidden">
      <CardHeader className="p-4 border-b bg-primary/5">
        <CardTitle className="text-lg font-medium flex items-center">
          <Settings
            className={cn("h-5 w-5 text-primary", isRTL ? "ml-2" : "mr-2")}
          />
          {isRTL ? "إعدادات المساعد الذكي" : "AI Assistant Settings"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto">
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {isRTL ? "الإعدادات العامة" : "General Settings"}
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoSuggest" className="flex-1">
                {isRTL ? "اقتراح تلقائي للإجراءات" : "Auto-suggest actions"}
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL
                    ? "يقترح المساعد إجراءات بناءً على سياق عملك"
                    : "Assistant suggests actions based on your business context"}
                </p>
              </Label>
              <Switch
                id="autoSuggest"
                checked={settings.autoSuggest}
                onCheckedChange={() => handleSwitchChange("autoSuggest")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showAnalytics" className="flex-1">
                {isRTL ? "عرض التحليلات" : "Show analytics"}
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL
                    ? "يعرض تحليلات ورؤى مع الردود"
                    : "Display analytics and insights with responses"}
                </p>
              </Label>
              <Switch
                id="showAnalytics"
                checked={settings.showAnalytics}
                onCheckedChange={() => handleSwitchChange("showAnalytics")}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableRealTimeHelp" className="flex-1">
                {isRTL ? "مساعدة في الوقت الحقيقي" : "Real-time help"}
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL
                    ? "يقدم اقتراحات ومساعدة أثناء استخدامك للنظام"
                    : "Provides suggestions and help as you use the system"}
                </p>
              </Label>
              <Switch
                id="enableRealTimeHelp"
                checked={settings.enableRealTimeHelp}
                onCheckedChange={() => handleSwitchChange("enableRealTimeHelp")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {isRTL ? "إعدادات الاستجابة" : "Response Settings"}
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="responseLength">
                  {isRTL ? "طول الاستجابة" : "Response length"}
                </Label>
                <span className="text-sm font-medium">
                  {getResponseLengthLabel(settings.responseLength)}
                </span>
              </div>
              <Slider
                id="responseLength"
                min={1}
                max={3}
                step={1}
                value={[settings.responseLength]}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground pt-1">
                <span>{isRTL ? "موجز" : "Brief"}</span>
                <span>{isRTL ? "متوازن" : "Balanced"}</span>
                <span>{isRTL ? "مفصل" : "Detailed"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">
              {isRTL ? "إعدادات متقدمة" : "Advanced Settings"}
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="enableVoiceInput" className="flex-1">
                {isRTL ? "تمكين إدخال الصوت" : "Enable voice input"}
                <p className="text-xs text-muted-foreground mt-1">
                  {isRTL
                    ? "استخدم الميكروفون للتحدث مع المساعد"
                    : "Use microphone to speak with the assistant"}
                </p>
              </Label>
              <Switch
                id="enableVoiceInput"
                checked={settings.enableVoiceInput}
                onCheckedChange={() => handleSwitchChange("enableVoiceInput")}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <div className="p-4 border-t bg-muted/30 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetSettings}
          className="text-sm"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          {isRTL ? "إعادة تعيين" : "Reset Defaults"}
        </Button>
        <Button
          size="sm"
          onClick={() => onSaveSettings(settings)}
          className="text-sm"
        >
          <Save className="h-3.5 w-3.5 mr-1.5" />
          {isRTL ? "حفظ الإعدادات" : "Save Settings"}
        </Button>
      </div>
    </Card>
  );
};

export default AIAssistantSettings;
