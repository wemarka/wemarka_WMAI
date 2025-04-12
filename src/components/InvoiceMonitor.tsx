import React, { useState, useEffect } from "react";
import { useToast } from "@/frontend/components/ui/use-toast";
import { Button } from "@/frontend/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  BarChart,
  FileText,
  RefreshCw,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useLanguage } from "@/frontend/contexts/LanguageContext";
import { Invoice, InvoiceSummary } from "@/frontend/types/invoice";

const InvoiceMonitor: React.FC = () => {
  const { toast } = useToast();
  const { direction } = useLanguage();
  const rtl = direction === "rtl";
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  // Sample data - in a real implementation, this would come from an API
  const [invoiceSummary, setInvoiceSummary] = useState<InvoiceSummary>({
    total_invoices: 124,
    paid_invoices: 87,
    overdue_invoices: 12,
    draft_invoices: 25,
    total_amount: 45750.0,
    paid_amount: 32450.0,
    overdue_amount: 8300.0,
  });

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      customer_id: "CUST-001",
      amount: 1250.0,
      status: "paid",
      due_date: "2023-11-15",
      items: [
        {
          description: "Website Design",
          quantity: 1,
          unit_price: 1250.0,
          subtotal: 1250.0,
        },
      ],
      created_at: "2023-10-15",
    },
    {
      id: "INV-002",
      customer_id: "CUST-002",
      amount: 3500.0,
      status: "overdue",
      due_date: "2023-11-01",
      items: [
        {
          description: "E-commerce Development",
          quantity: 1,
          unit_price: 3500.0,
          subtotal: 3500.0,
        },
      ],
      created_at: "2023-10-01",
    },
    {
      id: "INV-003",
      customer_id: "CUST-003",
      amount: 750.0,
      status: "draft",
      due_date: "2023-12-01",
      items: [
        {
          description: "SEO Services",
          quantity: 1,
          unit_price: 750.0,
          subtotal: 750.0,
        },
      ],
      created_at: "2023-11-01",
    },
    {
      id: "INV-004",
      customer_id: "CUST-004",
      amount: 2200.0,
      status: "sent",
      due_date: "2023-12-15",
      items: [
        {
          description: "Content Creation",
          quantity: 1,
          unit_price: 1200.0,
          subtotal: 1200.0,
        },
        {
          description: "Social Media Setup",
          quantity: 1,
          unit_price: 1000.0,
          subtotal: 1000.0,
        },
      ],
      created_at: "2023-11-15",
    },
    {
      id: "INV-005",
      customer_id: "CUST-005",
      amount: 4800.0,
      status: "paid",
      due_date: "2023-11-30",
      items: [
        {
          description: "Mobile App Development",
          quantity: 1,
          unit_price: 4800.0,
          subtotal: 4800.0,
        },
      ],
      created_at: "2023-10-30",
    },
  ]);

  const refreshInvoiceData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch data from an API
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: rtl ? "تم تحديث البيانات" : "Data Updated",
        description: rtl
          ? "تم تحديث بيانات الفواتير بنجاح"
          : "Invoice data has been successfully updated",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: rtl ? "فشل التحديث" : "Update Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    refreshInvoiceData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "draft":
        return <FileText className="h-4 w-4 text-gray-500" />;
      case "sent":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Filter invoices based on status filter
  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter === "all") return true;
    return invoice.status === statusFilter;
  });

  const renderOverview = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {rtl ? "مراقبة الفواتير" : "Invoice Monitoring"}
          </h2>
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue
                  placeholder={rtl ? "النطاق الزمني" : "Time Range"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">{rtl ? "7 أيام" : "7 Days"}</SelectItem>
                <SelectItem value="30d">
                  {rtl ? "30 يوم" : "30 Days"}
                </SelectItem>
                <SelectItem value="90d">
                  {rtl ? "90 يوم" : "90 Days"}
                </SelectItem>
                <SelectItem value="1y">
                  {rtl ? "سنة واحدة" : "1 Year"}
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={refreshInvoiceData}
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {rtl ? "إجمالي الفواتير" : "Total Invoices"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {invoiceSummary.total_invoices}
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {rtl ? "القيمة الإجمالية" : "Total Value"}:{" "}
                {formatCurrency(invoiceSummary.total_amount)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {rtl ? "الفواتير المدفوعة" : "Paid Invoices"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {invoiceSummary.paid_invoices}
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {rtl ? "القيمة المدفوعة" : "Paid Value"}:{" "}
                {formatCurrency(invoiceSummary.paid_amount)}
              </div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {Math.round(
                  (invoiceSummary.paid_invoices /
                    invoiceSummary.total_invoices) *
                    100,
                )}
                % {rtl ? "من الإجمالي" : "of total"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {rtl ? "الفواتير المتأخرة" : "Overdue Invoices"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {invoiceSummary.overdue_invoices}
                </div>
                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center dark:bg-red-900/20">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {rtl ? "القيمة المتأخرة" : "Overdue Value"}:{" "}
                {formatCurrency(invoiceSummary.overdue_amount)}
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                {Math.round(
                  (invoiceSummary.overdue_invoices /
                    invoiceSummary.total_invoices) *
                    100,
                )}
                % {rtl ? "من الإجمالي" : "of total"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {rtl ? "مسودات الفواتير" : "Draft Invoices"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {invoiceSummary.draft_invoices}
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center dark:bg-gray-800">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {rtl ? "القيمة المقدرة" : "Estimated Value"}:{" "}
                {formatCurrency(
                  invoiceSummary.total_amount -
                    invoiceSummary.paid_amount -
                    invoiceSummary.overdue_amount,
                )}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                {Math.round(
                  (invoiceSummary.draft_invoices /
                    invoiceSummary.total_invoices) *
                    100,
                )}
                % {rtl ? "من الإجمالي" : "of total"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              {rtl ? "تحليل الفواتير" : "Invoice Analysis"}
            </CardTitle>
            <CardDescription>
              {rtl
                ? "نظرة عامة على أداء الفواتير"
                : "Overview of invoice performance"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gray-50 dark:bg-gray-800/50 rounded-md flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">
                  {rtl
                    ? "الرسم البياني لتحليل الفواتير"
                    : "Invoice analysis chart"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <CardTitle>{rtl ? "أحدث الفواتير" : "Recent Invoices"}</CardTitle>
              <CardDescription>
                {rtl ? "قائمة بأحدث الفواتير" : "A list of recent invoices"}
              </CardDescription>
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="mt-2 sm:mt-0"
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue
                  placeholder={rtl ? "تصفية حسب الحالة" : "Filter by Status"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {rtl ? "جميع الفواتير" : "All Invoices"}
                </SelectItem>
                <SelectItem value="paid">{rtl ? "مدفوعة" : "Paid"}</SelectItem>
                <SelectItem value="overdue">
                  {rtl ? "متأخرة" : "Overdue"}
                </SelectItem>
                <SelectItem value="draft">{rtl ? "مسودة" : "Draft"}</SelectItem>
                <SelectItem value="sent">{rtl ? "مرسلة" : "Sent"}</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{rtl ? "رقم الفاتورة" : "Invoice #"}</TableHead>
                    <TableHead>{rtl ? "العميل" : "Customer"}</TableHead>
                    <TableHead>{rtl ? "المبلغ" : "Amount"}</TableHead>
                    <TableHead>
                      {rtl ? "تاريخ الاستحقاق" : "Due Date"}
                    </TableHead>
                    <TableHead>{rtl ? "الحالة" : "Status"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>{invoice.customer_id}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{formatDate(invoice.due_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(invoice.status)}`}
                          >
                            {getStatusIcon(invoice.status)}
                            <span className="ml-1">
                              {invoice.status === "paid"
                                ? rtl
                                  ? "مدفوعة"
                                  : "Paid"
                                : invoice.status === "overdue"
                                  ? rtl
                                    ? "متأخرة"
                                    : "Overdue"
                                  : invoice.status === "draft"
                                    ? rtl
                                      ? "مسودة"
                                      : "Draft"
                                    : rtl
                                      ? "مرسلة"
                                      : "Sent"}
                            </span>
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {rtl
                ? `عرض ${filteredInvoices.length} من أصل ${invoices.length} فاتورة`
                : `Showing ${filteredInvoices.length} of ${invoices.length} invoices`}
            </div>
            <Button variant="outline" size="sm">
              {rtl ? "عرض الكل" : "View All"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  const renderDetails = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {rtl ? "تفاصيل الفواتير" : "Invoice Details"}
          </h2>
          <Button
            onClick={refreshInvoiceData}
            disabled={isLoading}
            className="mt-2 sm:mt-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {rtl ? "جاري التحديث..." : "Refreshing..."}
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                {rtl ? "تحديث البيانات" : "Refresh Data"}
              </>
            )}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{rtl ? "جميع الفواتير" : "All Invoices"}</CardTitle>
            <CardDescription>
              {rtl
                ? "قائمة تفصيلية بجميع الفواتير"
                : "A detailed list of all invoices"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] mb-2 sm:mb-0">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue
                    placeholder={rtl ? "تصفية حسب الحالة" : "Filter by Status"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {rtl ? "جميع الفواتير" : "All Invoices"}
                  </SelectItem>
                  <SelectItem value="paid">
                    {rtl ? "مدفوعة" : "Paid"}
                  </SelectItem>
                  <SelectItem value="overdue">
                    {rtl ? "متأخرة" : "Overdue"}
                  </SelectItem>
                  <SelectItem value="draft">
                    {rtl ? "مسودة" : "Draft"}
                  </SelectItem>
                  <SelectItem value="sent">{rtl ? "مرسلة" : "Sent"}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue
                    placeholder={rtl ? "النطاق الزمني" : "Time Range"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">
                    {rtl ? "7 أيام" : "7 Days"}
                  </SelectItem>
                  <SelectItem value="30d">
                    {rtl ? "30 يوم" : "30 Days"}
                  </SelectItem>
                  <SelectItem value="90d">
                    {rtl ? "90 يوم" : "90 Days"}
                  </SelectItem>
                  <SelectItem value="1y">
                    {rtl ? "سنة واحدة" : "1 Year"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{rtl ? "رقم الفاتورة" : "Invoice #"}</TableHead>
                    <TableHead>{rtl ? "العميل" : "Customer"}</TableHead>
                    <TableHead>
                      {rtl ? "تاريخ الإنشاء" : "Created Date"}
                    </TableHead>
                    <TableHead>
                      {rtl ? "تاريخ الاستحقاق" : "Due Date"}
                    </TableHead>
                    <TableHead>{rtl ? "المبلغ" : "Amount"}</TableHead>
                    <TableHead>{rtl ? "العناصر" : "Items"}</TableHead>
                    <TableHead>{rtl ? "الحالة" : "Status"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>{invoice.customer_id}</TableCell>
                      <TableCell>{formatDate(invoice.created_at)}</TableCell>
                      <TableCell>{formatDate(invoice.due_date)}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>{invoice.items.length}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(invoice.status)}`}
                          >
                            {getStatusIcon(invoice.status)}
                            <span className="ml-1">
                              {invoice.status === "paid"
                                ? rtl
                                  ? "مدفوعة"
                                  : "Paid"
                                : invoice.status === "overdue"
                                  ? rtl
                                    ? "متأخرة"
                                    : "Overdue"
                                  : invoice.status === "draft"
                                    ? rtl
                                      ? "مسودة"
                                      : "Draft"
                                    : rtl
                                      ? "مرسلة"
                                      : "Sent"}
                            </span>
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {rtl
                ? `عرض ${filteredInvoices.length} من أصل ${invoices.length} فاتورة`
                : `Showing ${filteredInvoices.length} of ${invoices.length} invoices`}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                {rtl ? "السابق" : "Previous"}
              </Button>
              <Button variant="outline" size="sm">
                {rtl ? "التالي" : "Next"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart className="h-4 w-4 mr-2" />
            {rtl ? "نظرة عامة" : "Overview"}
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            {rtl ? "التفاصيل" : "Details"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {renderDetails()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceMonitor;
