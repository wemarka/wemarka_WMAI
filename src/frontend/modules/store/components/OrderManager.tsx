import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface OrderManagerProps {
  isRTL?: boolean;
}

const OrderManager = ({ isRTL = false }: OrderManagerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إدارة الطلبات" : "Order Management"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "قائمة الطلبات" : "Order List"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض وإدارة الطلبات" : "View and manage orders"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "تفاصيل الطلب" : "Order Details"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض تفاصيل الطلب" : "View order details"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "شحن الطلبات" : "Order Shipping"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إدارة شحن الطلبات" : "Manage order shipping"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderManager;
