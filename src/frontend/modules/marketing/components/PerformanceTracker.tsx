import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface PerformanceTrackerProps {
  isRTL?: boolean;
}

const PerformanceTracker = ({ isRTL = false }: PerformanceTrackerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "تتبع الأداء" : "Performance Tracker"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "أداء الحملات" : "Campaign Performance"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تحليل أداء الحملات" : "Analyze campaign performance"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تحليل المنصات" : "Platform Analytics"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "تحليل أداء المنصات المختلفة"
                : "Analyze performance across platforms"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "تقارير مخصصة" : "Custom Reports"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إنشاء تقارير مخصصة" : "Create custom reports"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceTracker;
