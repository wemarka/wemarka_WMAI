import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";

interface InvoiceListProps {
  isRTL?: boolean;
}

const InvoiceList = ({ isRTL = false }: InvoiceListProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isRTL ? "قائمة الفواتير" : "Invoice List"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "جميع الفواتير" : "All Invoices"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض جميع الفواتير" : "View all invoices"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isRTL ? "فواتير مدفوعة" : "Paid Invoices"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض الفواتير المدفوعة" : "View paid invoices"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {isRTL ? "فواتير غير مدفوعة" : "Unpaid Invoices"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {isRTL ? "عرض الفواتير غير المدفوعة" : "View unpaid invoices"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceList;
