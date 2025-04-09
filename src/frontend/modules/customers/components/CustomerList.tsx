import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface CustomerListProps {
  isRTL?: boolean;
}

const CustomerList = ({ isRTL = false }: CustomerListProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "قائمة العملاء" : "Customer List"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جميع العملاء" : "All Customers"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض جميع العملاء" : "View all customers"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "إضافة عميل" : "Add Customer"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إضافة عميل جديد" : "Add a new customer"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تصدير العملاء" : "Export Customers"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تصدير بيانات العملاء" : "Export customer data"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerList;
