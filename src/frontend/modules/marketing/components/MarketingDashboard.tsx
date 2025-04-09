import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import ModuleNavigationBar from "@/frontend/modules/layout/ModuleNavigationBar";
import { TrendingUp, FileText, BarChart } from "lucide-react";

interface MarketingDashboardProps {
  isRTL?: boolean;
}

const MarketingDashboard = ({ isRTL = false }: MarketingDashboardProps) => {
  const marketingNavigationItems = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      label: isRTL ? "الحملات" : "Campaigns",
      href: "/marketing/campaigns",
      isActive: true,
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: isRTL ? "إنشاء المحتوى" : "Content Creation",
      href: "/marketing/content",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      label: isRTL ? "تحليل الأداء" : "Performance Analytics",
      href: "/marketing/analytics",
    },
  ];

  return (
    <div className="flex h-full">
      <ModuleNavigationBar
        moduleName={isRTL ? "التسويق" : "Marketing"}
        isRTL={isRTL}
        items={marketingNavigationItems}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "الحملات" : "Campaigns"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL
                  ? "إدارة الحملات التسويقية"
                  : "Manage marketing campaigns"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "إنشاء المحتوى" : "Content Creation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "إنشاء وجدولة المحتوى" : "Create and schedule content"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "تحليل الأداء" : "Performance Analytics"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "تتبع أداء الحملات" : "Track campaign performance"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;
