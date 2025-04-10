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
  data,
  className,
}) => {
  const { direction } = useLanguage();
  const isRTL = direction === "rtl";

  // Format data for the pie chart
  const chartData = data.map((item) => ({
    name: item.category,
    value: item.ticket_count,
  }));

  // Custom tooltip formatter
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} ${isRTL ? "تذاكر" : "tickets"}`}</p>
          <p className="text-sm text-muted-foreground">
            {`${isRTL ? "نسبة الحل" : "Resolution Rate"}: ${data.find((item) => item.category === payload[0].name)?.resolution_rate}%`}
          </p>
        </div>
      );
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
                  `${name} ${(percent * 100).toFixed(0)}%`
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
