import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface PaymentGatewaysProps {
  isRTL?: boolean;
}

const PaymentGateways = ({ isRTL = false }: PaymentGatewaysProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "بوابات الدفع" : "Payment Gateways"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "بوابات الدفع المتاحة" : "Available Gateways"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "عرض بوابات الدفع المتاحة"
                : "View available payment gateways"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "إعداد بوابة دفع" : "Configure Gateway"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "إعداد بوابة دفع جديدة"
                : "Configure a new payment gateway"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "سجلات المعاملات" : "Transaction Logs"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL
                ? "عرض سجلات معاملات الدفع"
                : "View payment transaction logs"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentGateways;
