import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface MarketingROIProps {
  isRTL?: boolean;
}

const MarketingROI = ({ isRTL = false }: MarketingROIProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "عائد الاستثمار التسويقي" : "Marketing ROI"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "تحليل التكلفة" : "Cost Analysis"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تحليل تكاليف التسويق" : "Analyze marketing costs"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "تحليل العائد" : "Return Analysis"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تحليل العائد من الحملات" : "Analyze campaign returns"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "توصيات التحسين" : "Optimization Recommendations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "توصيات لتحسين العائد"
                : "Recommendations for improving ROI"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingROI;
