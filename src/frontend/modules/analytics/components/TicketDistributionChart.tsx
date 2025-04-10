import React from "react";
import {
  PieChart,
  Pie,
  Cell,
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
import { TicketResponseRate } from "@/frontend/types/analytics";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface TicketDistributionChartProps {
  data: TicketResponseRate[];
  className?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const TicketDistributionChart: React.FC<TicketDistributionChartProps> = ({
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
            {isRTL ? "توزيع التذاكر" : "Ticket Distribution"}
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

  // Format data for the pie chart and filter out invalid entries
  const chartData = data
    .filter(
      (item) => item && item.category && typeof item.ticket_count === "number",
    )
    .map((item) => ({
      name: item.category,
      value: Number(item.ticket_count) || 0,
    }));

  // If after filtering we have no valid data, show empty state
  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            {isRTL ? "توزيع التذاكر" : "Ticket Distribution"}
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
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      try {
        const category = payload[0].name;
        const ticketCount = payload[0].value;
        const item = data.find((item) => item.category === category);
        const resolutionRate = item?.resolution_rate || 0;

        return (
          <div className="bg-background p-2 border rounded shadow-sm">
            <p className="font-medium">{`${category}: ${ticketCount} ${isRTL ? "تذاكر" : "tickets"}`}</p>
            <p className="text-sm text-muted-foreground">
              {`${isRTL ? "نسبة الحل" : "Resolution Rate"}: ${resolutionRate}%`}
            </p>
          </div>
        );
      } catch (error) {
        console.error("Error in tooltip:", error);
        return (
          <div className="bg-background p-2 border rounded shadow-sm">
            <p className="font-medium">{payload[0].name}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{isRTL ? "توزيع التذاكر" : "Ticket Distribution"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketDistributionChart;
