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
import { TopAgent } from "@/frontend/types/analytics";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface TopAgentsChartProps {
  data: TopAgent[];
  className?: string;
}

const TopAgentsChart: React.FC<TopAgentsChartProps> = ({
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
            {isRTL ? "أفضل 5 وكلاء أداءً" : "Top 5 Performing Agents"}
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
    .filter((agent) => agent && agent.agent_name)
    .map((agent) => ({
      name: agent.agent_name || "Unknown Agent",
      tickets: Number(agent.tickets_resolved) || 0,
      satisfaction: Number(agent.satisfaction_rate) || 0,
    }));

  // If after filtering we have no valid data, show empty state
  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            {isRTL ? "أفضل 5 وكلاء أداءً" : "Top 5 Performing Agents"}
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
              {`${isRTL ? "التذاكر المحلولة" : "Tickets Resolved"}: ${payload[0]?.value || 0}`}
            </p>
            <p className="text-sm text-secondary">
              {`${isRTL ? "معدل الرضا" : "Satisfaction Rate"}: ${payload[1]?.value || 0}%`}
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
          {isRTL ? "أفضل 5 وكلاء أداءً" : "Top 5 Performing Agents"}
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
              />
              <Tooltip content={customTooltip} />
              <Legend />
              <Bar
                dataKey="tickets"
                name={isRTL ? "التذاكر المحلولة" : "Tickets Resolved"}
                fill="#8884d8"
              />
              <Bar
                dataKey="satisfaction"
                name={isRTL ? "معدل الرضا (%)" : "Satisfaction Rate (%)"}
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopAgentsChart;
