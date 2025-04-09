import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface CustomerProfileProps {
  isRTL?: boolean;
  customerId?: string;
}

const CustomerProfile = ({
  isRTL = false,
  customerId = "1",
}: CustomerProfileProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "ملف العميل" : "Customer Profile"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "معلومات العميل" : "Customer Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض معلومات العميل" : "View customer information"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "سجل الطلبات" : "Order History"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض سجل طلبات العميل" : "View customer order history"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "المحادثات" : "Conversations"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض محادثات العميل" : "View customer conversations"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerProfile;
