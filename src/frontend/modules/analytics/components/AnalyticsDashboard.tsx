import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import ModuleNavigationBar from "@/frontend/modules/layout/ModuleNavigationBar";
import { TrendingUp, Users, Target } from "lucide-react";

interface AnalyticsDashboardProps {
  isRTL?: boolean;
}

const AnalyticsDashboard = ({ isRTL = false }: AnalyticsDashboardProps) => {
  const analyticsNavigationItems = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: isRTL ? "اتجاهات المبيعات" : "Sales Trends",
      href: "/analytics/sales",
      isActive: true,
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: isRTL ? "سلوك المستخدم" : "User Behavior",
      href: "/analytics/users",
    },
    {
      icon: <Target className="h-5 w-5" />,
      label: isRTL ? "عائد الاستثمار التسويقي" : "Marketing ROI",
      href: "/analytics/marketing",
    },
  ];

  return (
    <div className="flex h-full">
      <ModuleNavigationBar
        moduleName={isRTL ? "التحليلات" : "Analytics"}
        isRTL={isRTL}
        items={analyticsNavigationItems}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "اتجاهات المبيعات" : "Sales Trends"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "تحليل اتجاهات المبيعات" : "Analyze sales trends"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "سلوك المستخدم" : "User Behavior"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "تحليل سلوك المستخدم" : "Analyze user behavior"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "عائد الاستثمار التسويقي" : "Marketing ROI"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL
                  ? "قياس عائد الاستثمار التسويقي"
                  : "Measure marketing ROI"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
