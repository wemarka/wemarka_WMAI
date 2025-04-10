import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { TopProduct } from "@/frontend/types/analytics";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface TopProductsChartProps {
  data: TopProduct[];
  className?: string;
}

const TopProductsChart: React.FC<TopProductsChartProps> = ({
  data = [],
  className,
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Check if data is empty
  if (!data || data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            {isRTL ? "أفضل 5 منتجات مبيعًا" : "Top 5 Selling Products"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              {isRTL ? "لا توجد بيانات متاحة" : "No data available"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart and filter out invalid entries
  const chartData = data
    .filter((product) => product && product.product_name)
    .map((product) => ({
      name: product.product_name || "Unknown Product",
      sales: Number(product.total_sales) || 0,
      units: Number(product.units_sold) || 0,
    }));

  // If after filtering we have no valid data, show empty state
  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            {isRTL ? "أفضل 5 منتجات مبيعًا" : "Top 5 Selling Products"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">
              {isRTL ? "لا توجد بيانات صالحة" : "No valid data available"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom tooltip formatter with error handling
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      try {
        return (
          <div className="bg-background p-3 border rounded shadow-sm">
            <p className="font-medium">{label}</p>
            <p className="text-sm text-primary">
              {`${isRTL ? "المبيعات" : "Sales"}: ${(payload[0]?.value || 0).toLocaleString()}`}
            </p>
            <p className="text-sm text-secondary">
              {`${isRTL ? "الوحدات" : "Units"}: ${(payload[1]?.value || 0).toLocaleString()}`}
            </p>
          </div>
        );
      } catch (error) {
        console.error("Error in tooltip:", error);
        return (
          <div className="bg-background p-3 border rounded shadow-sm">
            <p className="font-medium">{label}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {isRTL ? "أفضل 5 منتجات مبيعًا" : "Top 5 Selling Products"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="name"
                type="category"
                width={100}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) =>
                  value && value.length > 15
                    ? `${value.substring(0, 15)}...`
                    : value
                }
              />
              <Tooltip content={customTooltip} />
              <Legend />
              <Bar
                dataKey="sales"
                name={isRTL ? "المبيعات ($)" : "Sales ($)"}
                fill="#8884d8"
              />
              <Bar
                dataKey="units"
                name={isRTL ? "الوحدات المباعة" : "Units Sold"}
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopProductsChart;
