import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { TrendingUp, Users, Target } from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface AnalyticsDashboardProps {
  isRTL?: boolean;
}

const AnalyticsDashboard = ({ isRTL = false }: AnalyticsDashboardProps) => {
  const { direction } = useLanguage();
  const rtl = isRTL || direction === "rtl";

  return (
    <ModuleLayout moduleName={rtl ? "التحليلات" : "Analytics"}>
      <div className="h-full bg-background">
        <div className="overflow-auto">
          <h1 className="text-2xl font-bold mb-4">
            {rtl ? "لوحة التحليلات" : "Analytics Dashboard"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {rtl
              ? "مرحبًا بك في لوحة التحليلات. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
              : "Welcome to the Analytics Dashboard. Use the sidebar to navigate between different sections."}
          </p>
        </div>
      </div>
    </ModuleLayout>
  );
};

export default AnalyticsDashboard;
