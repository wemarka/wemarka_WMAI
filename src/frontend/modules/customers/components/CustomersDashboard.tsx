import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import ModuleNavigationBar from "@/frontend/modules/layout/ModuleNavigationBar";
import { Users, UsersRound, BarChart } from "lucide-react";

interface CustomersDashboardProps {
  isRTL?: boolean;
}

const CustomersDashboard = ({ isRTL = false }: CustomersDashboardProps) => {
  const customersNavigationItems = [
    {
      icon: <Users className="h-5 w-5" />,
      label: isRTL ? "قائمة العملاء" : "Customer List",
      href: "/customers/list",
      isActive: true,
    },
    {
      icon: <UsersRound className="h-5 w-5" />,
      label: isRTL ? "مجموعات العملاء" : "Customer Groups",
      href: "/customers/groups",
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      label: isRTL ? "تحليلات العملاء" : "Customer Analytics",
      href: "/customers/analytics",
    },
  ];

  return (
    <div className="flex h-full">
      <ModuleNavigationBar
        moduleName={isRTL ? "العملاء" : "Customers"}
        isRTL={isRTL}
        items={customersNavigationItems}
      />
      <div className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "قائمة العملاء" : "Customer List"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "عرض وإدارة العملاء" : "View and manage customers"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "مجموعات العملاء" : "Customer Groups"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "إدارة مجموعات العملاء" : "Manage customer groups"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "تحليلات العملاء" : "Customer Analytics"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {isRTL ? "تحليل بيانات العملاء" : "Analyze customer data"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomersDashboard;
