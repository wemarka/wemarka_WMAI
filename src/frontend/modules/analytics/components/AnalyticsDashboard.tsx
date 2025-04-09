import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { TrendingUp, Users, Target } from "lucide-react";

interface AnalyticsDashboardProps {
  isRTL?: boolean;
}

const AnalyticsDashboard = ({ isRTL = false }: AnalyticsDashboardProps) => {
  return (
    <div className="h-full bg-background">
      <div className="p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "لوحة التحليلات" : "Analytics Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isRTL
            ? "مرحبًا بك في لوحة التحليلات. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Analytics Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
