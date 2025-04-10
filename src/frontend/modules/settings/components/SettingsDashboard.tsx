import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface SettingsDashboardProps {
  isRTL?: boolean;
}

const SettingsDashboard = ({ isRTL = false }: SettingsDashboardProps) => {
  const { direction } = useLanguage();
  const effectiveRTL = isRTL || direction === "rtl";

  return (
    <ModuleLayout moduleName={effectiveRTL ? "الإعدادات" : "Settings"}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "لوحة الإعدادات" : "Settings Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isRTL
            ? "مرحبًا بك في لوحة الإعدادات. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Settings Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </ModuleLayout>
  );
};

export default SettingsDashboard;
