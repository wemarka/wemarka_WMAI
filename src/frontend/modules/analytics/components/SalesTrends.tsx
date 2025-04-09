import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface SalesTrendsProps {
  isRTL?: boolean;
}

const SalesTrends = ({ isRTL = false }: SalesTrendsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "اتجاهات المبيعات" : "Sales Trends"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "تحليل المبيعات" : "Sales Analysis"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تحليل اتجاهات المبيعات" : "Analyze sales trends"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "مقارنة الفترات" : "Period Comparison"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "مقارنة المبيعات بين الفترات"
                : "Compare sales between periods"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "توقعات المبيعات" : "Sales Forecasts"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "توقعات المبيعات المستقبلية" : "Future sales forecasts"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesTrends;
