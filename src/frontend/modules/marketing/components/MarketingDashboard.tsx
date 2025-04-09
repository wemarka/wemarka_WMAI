import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { TrendingUp, FileText, BarChart } from "lucide-react";

interface MarketingDashboardProps {
  isRTL?: boolean;
}

const MarketingDashboard = ({ isRTL = false }: MarketingDashboardProps) => {
  return (
    <div className="h-full bg-background">
      <div className="p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "لوحة التسويق" : "Marketing Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isRTL
            ? "مرحبًا بك في لوحة التسويق. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Marketing Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </div>
  );
};

export default MarketingDashboard;
