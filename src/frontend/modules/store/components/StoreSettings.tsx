import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface StoreSettingsProps {
  isRTL?: boolean;
}

const StoreSettings = ({ isRTL = false }: StoreSettingsProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إعدادات المتجر" : "Store Settings"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إعدادات عامة" : "General Settings"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إعدادات المتجر العامة" : "General store settings"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "طرق الدفع" : "Payment Methods"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة طرق الدفع" : "Manage payment methods"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "طرق الشحن" : "Shipping Methods"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة طرق الشحن" : "Manage shipping methods"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreSettings;
