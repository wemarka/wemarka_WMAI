import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface DocumentsDashboardProps {
  isRTL?: boolean;
}

const DocumentsDashboard = ({ isRTL = false }: DocumentsDashboardProps) => {
  const { direction } = useLanguage();
  const rtl = isRTL || direction === "rtl";

  return (
    <ModuleLayout moduleName={rtl ? "المستندات" : "Documents"}>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "لوحة المستندات" : "Documents Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isRTL
            ? "مرحبًا بك في لوحة المستندات. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Documents Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </ModuleLayout>
  );
};

export default DocumentsDashboard;
