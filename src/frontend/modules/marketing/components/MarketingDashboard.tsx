import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { TrendingUp, FileText, BarChart } from "lucide-react";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface MarketingDashboardProps {
  isRTL?: boolean;
}

const MarketingDashboard = ({ isRTL = false }: MarketingDashboardProps) => {
  const { direction } = useLanguage();
  const isRTLFromContext = direction === "rtl";
  const effectiveRTL = isRTL || isRTLFromContext;

  return (
    <ModuleLayout moduleName={effectiveRTL ? "التسويق" : "Marketing"}>
      <div className="h-full bg-background">
        <h1 className="text-2xl font-bold mb-4">
          {effectiveRTL ? "لوحة التسويق" : "Marketing Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {effectiveRTL
            ? "مرحبًا بك في لوحة التسويق. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Marketing Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </ModuleLayout>
  );
};

export default MarketingDashboard;
