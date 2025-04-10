import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface IntegrationsDashboardProps {
  isRTL?: boolean;
}

const IntegrationsDashboard = ({
  isRTL = false,
}: IntegrationsDashboardProps) => {
  const { direction } = useLanguage();
  const rtl = isRTL || direction === "rtl";

  return (
    <ModuleLayout moduleName={rtl ? "التكاملات" : "Integrations"}>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "لوحة التكاملات" : "Integrations Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isRTL
            ? "مرحبًا بك في لوحة التكاملات. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Integrations Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </ModuleLayout>
  );
};

export default IntegrationsDashboard;
