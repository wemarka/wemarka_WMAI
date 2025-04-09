import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface InventoryManagerProps {
  isRTL?: boolean;
}

const InventoryManager = ({ isRTL = false }: InventoryManagerProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "إدارة المخزون" : "Inventory Management"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "حالة المخزون" : "Inventory Status"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض حالة المخزون" : "View inventory status"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تعديل المخزون" : "Adjust Inventory"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "تعديل كميات المخزون" : "Adjust inventory quantities"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "تنبيهات المخزون" : "Inventory Alerts"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "إعداد تنبيهات المخزون" : "Set up inventory alerts"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManager;
