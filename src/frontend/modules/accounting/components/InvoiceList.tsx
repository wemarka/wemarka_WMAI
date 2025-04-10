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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/frontend/components/ui/alert-dialog";
import { useToast } from "@/frontend/components/ui/use-toast";
import { useInvoices } from "@/frontend/hooks/useInvoices";
import { Invoice } from "@/frontend/services/accountingService";
import {
  PlusCircle,
  Search,
  Filter,
  Download,
  FileText,
  Loader2,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface InvoiceListProps {
  isRTL?: boolean;
}

const InvoiceList = ({ isRTL = false }: InvoiceListProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "unpaid">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch invoices using React Query
  const {
    data: invoices,
    isLoading,
    isError,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    isCreating,
    isUpdating,
    isDeleting,
  } = useInvoices();

  // Filter invoices based on search query and active tab
  const filteredInvoices = invoices
    ? invoices.filter((invoice) => {
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
      })
    : [];

  // Handle invoice deletion
  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      deleteInvoice(selectedInvoice.id);
      setIsDeleteDialogOpen(false);
      setSelectedInvoice(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
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
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6 bg-background p-6 rounded-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {isRTL ? "قائمة الفواتير" : "Invoice List"}
        </h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
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
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">
              {isRTL ? "جاري التحميل..." : "Loading..."}
            </span>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-destructive">
            {error?.message || (isRTL ? "حدث خطأ" : "An error occurred")}
          </div>
        ) : filteredInvoices.length === 0 ? (
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
                      {invoice.id.substring(0, 8)}
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
                      {isRTL ? "تاريخ الإصدار" : "Issue Date"}:{" "}
                      {formatDate(invoice.date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      {isRTL ? "تاريخ الاستحقاق" : "Due Date"}:{" "}
                      {formatDate(invoice.dueDate)}
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
                    <Button
                      size="sm"
                      onClick={() => {
                        updateInvoice({
                          id: invoice.id,
                          invoice: { status: "paid" },
                        });
                      }}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {isRTL ? "تسجيل الدفع" : "Record Payment"}
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? "هل أنت متأكد؟" : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL
                ? `هل أنت متأكد من حذف الفاتورة "${selectedInvoice?.id?.substring(0, 8)}"؟ لا يمكن التراجع عن هذا الإجراء.`
                : `Are you sure you want to delete invoice "${selectedInvoice?.id?.substring(0, 8)}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{isRTL ? "إلغاء" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isRTL ? "جاري الحذف..." : "Deleting..."}
                </>
              ) : (
                <>{isRTL ? "حذف" : "Delete"}</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InvoiceList;
