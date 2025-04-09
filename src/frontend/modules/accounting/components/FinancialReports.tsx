import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface FinancialReportsProps {
  isRTL?: boolean;
}

const FinancialReports = ({ isRTL = false }: FinancialReportsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "التقارير المالية" : "Financial Reports"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "الأرباح والخسائر" : "Profit & Loss"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "عرض تقرير الأرباح والخسائر"
                : "View profit & loss report"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "التدفق النقدي" : "Cash Flow"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض تقرير التدفق النقدي" : "View cash flow report"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "الميزانية العمومية" : "Balance Sheet"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض الميزانية العمومية" : "View balance sheet"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReports;
