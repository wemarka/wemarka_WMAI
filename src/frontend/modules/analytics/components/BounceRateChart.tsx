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
import { BounceRateData } from "@/frontend/types/analytics";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface BounceRateChartProps {
  data: BounceRateData[];
  className?: string;
}

const BounceRateChart: React.FC<BounceRateChartProps> = ({
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
          <CardTitle>{isRTL ? "معدل الارتداد" : "Bounce Rate"}</CardTitle>
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

  try {
    // Filter out invalid data entries
    const validData = data.filter(
      (item) =>
        item &&
        item.date &&
        typeof item.visits === "number" &&
        typeof item.bounces === "number",
    );

    // If no valid data after filtering
    if (validData.length === 0) {
      return (
        <Card className={className}>
          <CardHeader>
            <CardTitle>{isRTL ? "معدل الارتداد" : "Bounce Rate"}</CardTitle>
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

    // Process data to group by date and calculate average bounce rate per day
    const processedData = validData.reduce((acc: any[], item) => {
      const existingDate = acc.find((d) => d.date === item.date);
      if (existingDate) {
        existingDate.visits += Number(item.visits) || 0;
        existingDate.bounces += Number(item.bounces) || 0;
        // Recalculate bounce rate with safety check for division by zero
        existingDate.bounce_rate =
          existingDate.visits > 0
            ? (existingDate.bounces / existingDate.visits) * 100
            : 0;
      } else {
        acc.push({
          date: item.date,
          visits: Number(item.visits) || 0,
          bounces: Number(item.bounces) || 0,
          bounce_rate: Number(item.bounce_rate) || 0,
        });
      }
      return acc;
    }, []);

    // Sort by date
    processedData.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    // Format dates for display
    const chartData = processedData.map((item) => {
      try {
        return {
          ...item,
          date: new Date(item.date).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
        };
      } catch (error) {
        // If date parsing fails, use the original date string
        return {
          ...item,
          date: item.date,
        };
      }
    });

    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{isRTL ? "معدل الارتداد" : "Bounce Rate"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" reversed={isRTL} />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value) => [
                    `${(Number(value) || 0).toFixed(2)}%`,
                    isRTL ? "معدل الارتداد" : "Bounce Rate",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bounce_rate"
                  name={isRTL ? "معدل الارتداد" : "Bounce Rate"}
                  stroke="#ff7300"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error processing bounce rate data:", error);
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{isRTL ? "معدل الارتداد" : "Bounce Rate"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-destructive">
              {isRTL ? "خطأ في معالجة البيانات" : "Error processing data"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
};

export default BounceRateChart;
