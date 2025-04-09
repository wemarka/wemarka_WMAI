import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Users, UsersRound, BarChart } from "lucide-react";

interface CustomersDashboardProps {
  isRTL?: boolean;
}

const CustomersDashboard = ({ isRTL = false }: CustomersDashboardProps) => {
  return (
    <div className="h-full bg-background">
      <div className="p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-4">
          {isRTL ? "لوحة العملاء" : "Customers Dashboard"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {isRTL
            ? "مرحبًا بك في لوحة العملاء. استخدم القائمة الجانبية للتنقل بين الأقسام المختلفة."
            : "Welcome to the Customers Dashboard. Use the sidebar to navigate between different sections."}
        </p>
      </div>
    </div>
  );
};

export default CustomersDashboard;
