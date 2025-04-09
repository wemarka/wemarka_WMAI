import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface DocumentsDashboardProps {
  isRTL?: boolean;
}

const DocumentsDashboard = ({ isRTL = false }: DocumentsDashboardProps) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isRTL ? "لوحة المستندات" : "Documents Dashboard"}
      </h1>
      <p className="text-muted-foreground mb-6">
        {isRTL
          ? "مرحبًا بك في لوحة المستندات. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
          : "Welcome to the Documents Dashboard. Use the sidebar to navigate between different sections."}
      </p>
    </div>
  );
};

export default DocumentsDashboard;
