import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface StoreDashboardProps {}

export const StoreDashboard = ({}: StoreDashboardProps) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isRTL ? "لوحة المتجر" : "Store Dashboard"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {isRTL
          ? "مرحبًا بك في لوحة المتجر. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
          : "Welcome to the Store Dashboard. Use the sidebar to navigate between different sections."}
      </p>
    </div>
  );
};

export default StoreDashboard;
