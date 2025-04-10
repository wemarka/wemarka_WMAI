import React, { useState, useEffect } from "react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import { Separator } from "@/frontend/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import { Slider } from "@/frontend/components/ui/slider";
import { Switch } from "@/frontend/components/ui/switch";
import { Palette, Type, Layout, Sliders, RotateCcw } from "lucide-react";

export interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
    size: string;
  };
  layout: {
    containerWidth: string;
    spacing: string;
    borderRadius: string;
    useShadows: boolean;
  };
}

interface ThemeSettingsProps {
  settings: ThemeSettings;
  onChange: (settings: ThemeSettings) => void;
  onReset?: () => void;
}

const defaultThemeSettings: ThemeSettings = {
  colors: {
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#8b5cf6",
    background: "#ffffff",
    text: "#1f2937",
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
    size: "medium",
  },
  layout: {
    containerWidth: "1200px",
    spacing: "medium",
    borderRadius: "medium",
    useShadows: true,
  },
};

const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Open Sans", label: "Open Sans" },
];

const sizeOptions = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const containerWidthOptions = [
  { value: "1000px", label: "Narrow (1000px)" },
  { value: "1200px", label: "Standard (1200px)" },
  { value: "1400px", label: "Wide (1400px)" },
  { value: "100%", label: "Full Width" },
];

const ThemeSettings: React.FC<ThemeSettingsProps> = ({
  settings = defaultThemeSettings,
  onChange,
  onReset,
}) => {
  const { direction, language } = useLanguage();
  const isRTL = direction === "rtl";
  const [activeTab, setActiveTab] = useState("colors");
  const [localSettings, setLocalSettings] = useState<ThemeSettings>(settings);

  // Update local settings when props change
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Handle color change
  const handleColorChange = (
    colorKey: keyof ThemeSettings["colors"],
    value: string,
  ) => {
    const updatedSettings = {
      ...localSettings,
      colors: {
        ...localSettings.colors,
        [colorKey]: value,
      },
    };
    setLocalSettings(updatedSettings);
    onChange(updatedSettings);
  };

  // Handle font change
  const handleFontChange = (
    fontKey: keyof ThemeSettings["fonts"],
    value: string,
  ) => {
    const updatedSettings = {
      ...localSettings,
      fonts: {
        ...localSettings.fonts,
        [fontKey]: value,
      },
    };
    setLocalSettings(updatedSettings);
    onChange(updatedSettings);
  };

  // Handle layout change
  const handleLayoutChange = (
    layoutKey: keyof ThemeSettings["layout"],
    value: any,
  ) => {
    const updatedSettings = {
      ...localSettings,
      layout: {
        ...localSettings.layout,
        [layoutKey]: value,
      },
    };
    setLocalSettings(updatedSettings);
    onChange(updatedSettings);
  };

  // Handle reset to defaults
  const handleReset = () => {
    setLocalSettings(defaultThemeSettings);
    onChange(defaultThemeSettings);
    if (onReset) onReset();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{isRTL ? "إعدادات السمة" : "Theme Settings"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {isRTL ? "الألوان" : "Colors"}
            </TabsTrigger>
            <TabsTrigger value="fonts" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              {isRTL ? "الخطوط" : "Fonts"}
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              {isRTL ? "التخطيط" : "Layout"}
            </TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary Color */}
              <div className="space-y-2">
                <Label htmlFor="primaryColor">
                  {isRTL ? "اللون الرئيسي" : "Primary Color"}
                </Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: localSettings.colors.primary }}
                  />
                  <Input
                    id="primaryColor"
                    type="color"
                    value={localSettings.colors.primary}
                    onChange={(e) =>
                      handleColorChange("primary", e.target.value)
                    }
                    className="w-16 h-8 p-0 overflow-hidden"
                  />
                  <Input
                    value={localSettings.colors.primary}
                    onChange={(e) =>
                      handleColorChange("primary", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">
                  {isRTL ? "اللون الثانوي" : "Secondary Color"}
                </Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: localSettings.colors.secondary }}
                  />
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={localSettings.colors.secondary}
                    onChange={(e) =>
                      handleColorChange("secondary", e.target.value)
                    }
                    className="w-16 h-8 p-0 overflow-hidden"
                  />
                  <Input
                    value={localSettings.colors.secondary}
                    onChange={(e) =>
                      handleColorChange("secondary", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Accent Color */}
              <div className="space-y-2">
                <Label htmlFor="accentColor">
                  {isRTL ? "لون التمييز" : "Accent Color"}
                </Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: localSettings.colors.accent }}
                  />
                  <Input
                    id="accentColor"
                    type="color"
                    value={localSettings.colors.accent}
                    onChange={(e) =>
                      handleColorChange("accent", e.target.value)
                    }
                    className="w-16 h-8 p-0 overflow-hidden"
                  />
                  <Input
                    value={localSettings.colors.accent}
                    onChange={(e) =>
                      handleColorChange("accent", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <Label htmlFor="backgroundColor">
                  {isRTL ? "لون الخلفية" : "Background Color"}
                </Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: localSettings.colors.background }}
                  />
                  <Input
                    id="backgroundColor"
                    type="color"
                    value={localSettings.colors.background}
                    onChange={(e) =>
                      handleColorChange("background", e.target.value)
                    }
                    className="w-16 h-8 p-0 overflow-hidden"
                  />
                  <Input
                    value={localSettings.colors.background}
                    onChange={(e) =>
                      handleColorChange("background", e.target.value)
                    }
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <Label htmlFor="textColor">
                  {isRTL ? "لون النص" : "Text Color"}
                </Label>
                <div className="flex items-center gap-2">
                  <div
                    className="h-8 w-8 rounded-full border"
                    style={{ backgroundColor: localSettings.colors.text }}
                  />
                  <Input
                    id="textColor"
                    type="color"
                    value={localSettings.colors.text}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                    className="w-16 h-8 p-0 overflow-hidden"
                  />
                  <Input
                    value={localSettings.colors.text}
                    onChange={(e) => handleColorChange("text", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div
              className="mt-6 p-4 rounded-lg border"
              style={{ backgroundColor: localSettings.colors.background }}
            >
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: localSettings.colors.text }}
              >
                {isRTL ? "معاينة الألوان" : "Color Preview"}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  style={{
                    backgroundColor: localSettings.colors.primary,
                    color: "white",
                  }}
                >
                  {isRTL ? "زر رئيسي" : "Primary Button"}
                </Button>
                <Button
                  style={{
                    backgroundColor: localSettings.colors.secondary,
                    color: "white",
                  }}
                >
                  {isRTL ? "زر ثانوي" : "Secondary Button"}
                </Button>
                <Button
                  style={{
                    backgroundColor: localSettings.colors.accent,
                    color: "white",
                  }}
                >
                  {isRTL ? "زر مميز" : "Accent Button"}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Fonts Tab */}
          <TabsContent value="fonts" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Heading Font */}
              <div className="space-y-2">
                <Label htmlFor="headingFont">
                  {isRTL ? "خط العناوين" : "Heading Font"}
                </Label>
                <Select
                  value={localSettings.fonts.heading}
                  onValueChange={(value) => handleFontChange("heading", value)}
                >
                  <SelectTrigger id="headingFont">
                    <SelectValue
                      placeholder={
                        isRTL ? "اختر خط العناوين" : "Select heading font"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Body Font */}
              <div className="space-y-2">
                <Label htmlFor="bodyFont">
                  {isRTL ? "خط النص" : "Body Font"}
                </Label>
                <Select
                  value={localSettings.fonts.body}
                  onValueChange={(value) => handleFontChange("body", value)}
                >
                  <SelectTrigger id="bodyFont">
                    <SelectValue
                      placeholder={isRTL ? "اختر خط النص" : "Select body font"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label htmlFor="fontSize">
                  {isRTL ? "حجم الخط" : "Font Size"}
                </Label>
                <Select
                  value={localSettings.fonts.size}
                  onValueChange={(value) => handleFontChange("size", value)}
                >
                  <SelectTrigger id="fontSize">
                    <SelectValue
                      placeholder={isRTL ? "اختر حجم الخط" : "Select font size"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Font Preview */}
            <div className="mt-6 p-4 rounded-lg border">
              <h2
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: localSettings.fonts.heading }}
              >
                {isRTL ? "معاينة خط العناوين" : "Heading Font Preview"}
              </h2>
              <p
                className="text-base"
                style={{ fontFamily: localSettings.fonts.body }}
              >
                {isRTL
                  ? "هذا مثال على نص الجسم. يمكنك رؤية كيف سيبدو النص على موقعك باستخدام الخط المحدد."
                  : "This is an example of body text. You can see how text will appear on your site using the selected font."}
              </p>
            </div>
          </TabsContent>

          {/* Layout Tab */}
          <TabsContent value="layout" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Container Width */}
              <div className="space-y-2">
                <Label htmlFor="containerWidth">
                  {isRTL ? "عرض الحاوية" : "Container Width"}
                </Label>
                <Select
                  value={localSettings.layout.containerWidth}
                  onValueChange={(value) =>
                    handleLayoutChange("containerWidth", value)
                  }
                >
                  <SelectTrigger id="containerWidth">
                    <SelectValue
                      placeholder={
                        isRTL ? "اختر عرض الحاوية" : "Select container width"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {containerWidthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Spacing */}
              <div className="space-y-2">
                <Label htmlFor="spacing">
                  {isRTL ? "المسافات" : "Spacing"}
                </Label>
                <Select
                  value={localSettings.layout.spacing}
                  onValueChange={(value) =>
                    handleLayoutChange("spacing", value)
                  }
                >
                  <SelectTrigger id="spacing">
                    <SelectValue
                      placeholder={isRTL ? "اختر المسافات" : "Select spacing"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <Label htmlFor="borderRadius">
                  {isRTL ? "نصف قطر الحدود" : "Border Radius"}
                </Label>
                <Select
                  value={localSettings.layout.borderRadius}
                  onValueChange={(value) =>
                    handleLayoutChange("borderRadius", value)
                  }
                >
                  <SelectTrigger id="borderRadius">
                    <SelectValue
                      placeholder={
                        isRTL ? "اختر نصف قطر الحدود" : "Select border radius"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Use Shadows */}
              <div className="space-y-2">
                <Label htmlFor="useShadows" className="block mb-2">
                  {isRTL ? "استخدام الظلال" : "Use Shadows"}
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="useShadows"
                    checked={localSettings.layout.useShadows}
                    onCheckedChange={(checked) =>
                      handleLayoutChange("useShadows", checked)
                    }
                  />
                  <Label htmlFor="useShadows" className="cursor-pointer">
                    {localSettings.layout.useShadows
                      ? isRTL
                        ? "مفعل"
                        : "Enabled"
                      : isRTL
                        ? "معطل"
                        : "Disabled"}
                  </Label>
                </div>
              </div>
            </div>

            {/* Layout Preview */}
            <div className="mt-6 p-4 rounded-lg border">
              <div
                className="p-4 border rounded-lg"
                style={{
                  maxWidth: localSettings.layout.containerWidth,
                  margin: "0 auto",
                  borderRadius:
                    localSettings.layout.borderRadius === "small"
                      ? "0.25rem"
                      : localSettings.layout.borderRadius === "medium"
                        ? "0.5rem"
                        : "1rem",
                  boxShadow: localSettings.layout.useShadows
                    ? "0 4px 12px rgba(0, 0, 0, 0.1)"
                    : "none",
                  padding:
                    localSettings.layout.spacing === "small"
                      ? "0.5rem"
                      : localSettings.layout.spacing === "medium"
                        ? "1rem"
                        : "2rem",
                }}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {isRTL ? "معاينة التخطيط" : "Layout Preview"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isRTL
                    ? "هذا مثال على كيفية ظهور العناصر باستخدام إعدادات التخطيط المحددة."
                    : "This is an example of how elements will appear using the selected layout settings."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            {isRTL
              ? "إعادة تعيين إلى الإعدادات الافتراضية"
              : "Reset to Defaults"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeSettings;
