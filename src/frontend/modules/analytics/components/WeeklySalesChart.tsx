import React from "react";
import {
  LineChart,
  Line,
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
import { SalesSummary } from "@/frontend/types/analytics";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface WeeklySalesChartProps {
  data: SalesSummary[];
  className?: string;
}

const WeeklySalesChart: React.FC<WeeklySalesChartProps> = ({
  data,
  className,
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Format dates for display
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{isRTL ? "المبيعات الأسبوعية" : "Weekly Sales"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={formattedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" reversed={isRTL} />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `$${value}`,
                  isRTL ? "المبلغ" : "Amount",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="total_amount"
                name={isRTL ? "إجمالي المبيعات" : "Total Sales"}
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="avg_order_value"
                name={isRTL ? "متوسط قيمة الطلب" : "Avg Order Value"}
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySalesChart;
