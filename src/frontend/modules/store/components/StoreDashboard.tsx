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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "المنتجات" : "Products"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "إدارة المنتجات والفئات"
                : "Manage products and categories"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "المخزون" : "Inventory"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تتبع وإدارة المخزون" : "Track and manage inventory"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "الطلبات" : "Orders"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة ومتابعة الطلبات" : "Manage and track orders"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreDashboard;
