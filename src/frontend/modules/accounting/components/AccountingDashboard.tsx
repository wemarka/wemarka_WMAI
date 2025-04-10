import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import ModuleLayout from "@/frontend/components/layout/ModuleLayout";

interface AccountingDashboardProps {}

const AccountingDashboard = ({}: AccountingDashboardProps) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  return (
    <ModuleLayout moduleName={isRTL ? "المحاسبة" : "Accounting"}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "الفواتير" : "Invoices"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة الفواتير وتتبعها" : "Manage and track invoices"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "المصروفات" : "Expenses"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تتبع وإدارة المصروفات" : "Track and manage expenses"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "التقارير المالية" : "Financial Reports"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض التقارير المالية" : "View financial reports"}
            </p>
          </CardContent>
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default AccountingDashboard;
