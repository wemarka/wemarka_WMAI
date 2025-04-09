import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface DeveloperDashboardProps {
  isRTL?: boolean;
}

const DeveloperDashboard = ({ isRTL = false }: DeveloperDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "اختبار API" : "API Testing"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL
              ? "اختبار وتوثيق واجهات برمجة التطبيقات"
              : "Test and document APIs"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "سجل التغييرات" : "Changelog"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "عرض سجل التغييرات" : "View changelog history"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "سجلات التطوير" : "Development Logs"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "عرض سجلات التطوير" : "View development logs"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperDashboard;
