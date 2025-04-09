import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface IntegrationsDashboardProps {
  isRTL?: boolean;
}

const IntegrationsDashboard = ({
  isRTL = false,
}: IntegrationsDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? "بوابات الدفع" : "Payment Gateways"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL ? "إدارة بوابات الدفع" : "Manage payment gateways"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? "واجهات برمجة خارجية" : "External APIs"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL
              ? "إدارة الاتصال بواجهات برمجة خارجية"
              : "Manage external API connections"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isRTL ? "منصات الأتمتة" : "Automation Platforms"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {isRTL
              ? "الاتصال بمنصات الأتمتة"
              : "Connect to automation platforms"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsDashboard;
