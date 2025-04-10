import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { Input } from "@/frontend/components/ui/input";
import { PlusCircle, Search, Filter, Download, FileText } from "lucide-react";

interface InvoiceListProps {
  isRTL?: boolean;
}

type InvoiceStatus = "paid" | "unpaid" | "overdue" | "draft";

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
}

const InvoiceList = ({ isRTL = false }: InvoiceListProps) => {
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "unpaid">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const invoices: Invoice[] = [
    {
      id: "INV-001",
      customer: "Acme Corp",
      amount: 1250.0,
      date: "2023-05-01",
      dueDate: "2023-05-31",
      status: "paid",
    },
    {
      id: "INV-002",
      customer: "Globex Inc",
      amount: 3450.75,
      date: "2023-05-05",
      dueDate: "2023-06-04",
      status: "unpaid",
    },
    {
      id: "INV-003",
      customer: "Stark Industries",
      amount: 8750.5,
      date: "2023-04-15",
      dueDate: "2023-05-15",
      status: "overdue",
    },
    {
      id: "INV-004",
      customer: "Wayne Enterprises",
      amount: 4200.25,
      date: "2023-05-10",
      dueDate: "2023-06-09",
      status: "draft",
    },
  ];

  const filteredInvoices = invoices.filter((invoice) => {
    // Filter by tab
    if (activeTab === "paid" && invoice.status !== "paid") return false;
    if (activeTab === "unpaid" && invoice.status === "paid") return false;

    // Filter by search query
    if (
      searchQuery &&
      !invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {isRTL ? "مدفوعة" : "Paid"}
          </Badge>
        );
      case "unpaid":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {isRTL ? "غير مدفوعة" : "Unpaid"}
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            {isRTL ? "متأخرة" : "Overdue"}
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {isRTL ? "مسودة" : "Draft"}
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isRTL ? "قائمة الفواتير" : "Invoice List"}
        </h1>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          {isRTL ? "إنشاء فاتورة" : "Create Invoice"}
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "all" ? "default" : "outline"}
            onClick={() => setActiveTab("all")}
            className="px-4"
          >
            {isRTL ? "الكل" : "All"}
          </Button>
          <Button
            variant={activeTab === "paid" ? "default" : "outline"}
            onClick={() => setActiveTab("paid")}
            className="px-4"
          >
            {isRTL ? "مدفوعة" : "Paid"}
          </Button>
          <Button
            variant={activeTab === "unpaid" ? "default" : "outline"}
            onClick={() => setActiveTab("unpaid")}
            className="px-4"
          >
            {isRTL ? "غير مدفوعة" : "Unpaid"}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={isRTL ? "بحث عن فاتورة..." : "Search invoices..."}
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">
              {isRTL ? "لا توجد فواتير" : "No invoices found"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isRTL
                ? "لم يتم العثور على فواتير تطابق معايير البحث الخاصة بك"
                : "No invoices match your search criteria"}
            </p>
          </div>
        ) : (
          filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {invoice.customer}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {invoice.id}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${invoice.amount.toFixed(2)}</p>
                    {getStatusBadge(invoice.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-muted-foreground">
                      {isRTL ? "تاريخ الإصدار" : "Issue Date"}: {invoice.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {isRTL ? "تاريخ الاستحقاق" : "Due Date"}:{" "}
                      {invoice.dueDate}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 py-2">
                <div className="flex justify-end w-full space-x-2">
                  <Button variant="outline" size="sm">
                    {isRTL ? "عرض" : "View"}
                  </Button>
                  <Button variant="outline" size="sm">
                    {isRTL ? "تحرير" : "Edit"}
                  </Button>
                  {invoice.status !== "paid" && (
                    <Button size="sm">
                      {isRTL ? "تسجيل الدفع" : "Record Payment"}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
