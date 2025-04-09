import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface ExternalApisProps {
  isRTL?: boolean;
}

const ExternalApis = ({ isRTL = false }: ExternalApisProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "واجهات برمجة خارجية" : "External APIs"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "الاتصالات النشطة" : "Active Connections"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض اتصالات API النشطة" : "View active API connections"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إضافة اتصال" : "Add Connection"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إضافة اتصال API جديد" : "Add a new API connection"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "صحة الاتصال" : "Connection Health"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "مراقبة صحة اتصالات API"
                : "Monitor API connection health"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExternalApis;
