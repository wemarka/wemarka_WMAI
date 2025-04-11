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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/frontend/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { Input } from "@/frontend/components/ui/input";
import { Badge } from "@/frontend/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Loader2,
  RefreshCw,
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  Eye,
  Calendar,
  Database,
  Github,
} from "lucide-react";
import { migrationsApi } from "@/api/migrations";
import { useLanguage } from "@/frontend/contexts/LanguageContext";

interface MigrationLog {
  id: number;
  operation_id: string;
  operation_type: string;
  sql_content: string;
  status: string;
  method_used: string;
  execution_time_ms: number;
  details: any;
  created_at: string;
}

const GitHubMigrationLogs: React.FC = () => {
  const { toast } = useToast();
  const { direction } = useLanguage();
  const rtl = direction === "rtl";
  const [logs, setLogs] = useState<MigrationLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<MigrationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<MigrationLog | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch migration logs
  const fetchMigrationLogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await migrationsApi.getMigrationLogs();

      if (result.success) {
        setLogs(result.data || []);
        setFilteredLogs(result.data || []);
        toast({
          title: rtl ? "تم تحميل السجلات بنجاح" : "Logs loaded successfully",
          description: rtl
            ? `تم تحميل ${result.data?.length || 0} سجل`
            : `Loaded ${result.data?.length || 0} logs`,
          variant: "success",
        });
      } else {
        setError(result.error?.message || "Failed to fetch migration logs");
        toast({
          title: rtl ? "فشل تحميل السجلات" : "Failed to load logs",
          description:
            result.error?.message || "An error occurred while fetching logs",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setError(`Error: ${err.message}`);
      toast({
        title: rtl ? "خطأ" : "Error",
        description: `${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...logs];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((log) => log.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((log) => log.operation_type === typeFilter);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.operation_id.toLowerCase().includes(query) ||
          log.operation_type.toLowerCase().includes(query) ||
          log.method_used.toLowerCase().includes(query) ||
          log.sql_content.toLowerCase().includes(query),
      );
    }

    // Apply tab filter
    if (activeTab !== "all") {
      if (activeTab === "github") {
        filtered = filtered.filter(
          (log) =>
            log.operation_type.includes("github") ||
            log.method_used.includes("github"),
        );
      } else if (activeTab === "custom") {
        filtered = filtered.filter(
          (log) => log.operation_type === "custom_sql",
        );
      } else if (activeTab === "setup") {
        filtered = filtered.filter(
          (log) =>
            log.operation_type.includes("setup") ||
            log.operation_type.includes("exec_sql"),
        );
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setFilteredLogs(filtered);
  }, [logs, statusFilter, typeFilter, sortOrder, searchQuery, activeTab]);

  // Initial fetch
  useEffect(() => {
    fetchMigrationLogs();
  }, []);

  // Get unique operation types for filter
  const operationTypes = [
    "all",
    ...Array.from(new Set(logs.map((log) => log.operation_type))),
  ];

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            {rtl ? "ناجح" : "Success"}
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            {rtl ? "فشل" : "Failed"}
          </Badge>
        );
      case "error":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
          >
            {rtl ? "خطأ" : "Error"}
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
          >
            {status}
          </Badge>
        );
    }
  };

  // Get operation type badge
  const getOperationTypeBadge = (type: string) => {
    if (type.includes("github")) {
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
        >
          <Github className="h-3 w-3 mr-1" />
          {type}
        </Badge>
      );
    } else if (type.includes("setup") || type.includes("exec_sql")) {
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        >
          <Database className="h-3 w-3 mr-1" />
          {type}
        </Badge>
      );
    } else if (type === "custom_sql") {
      return (
        <Badge
          variant="outline"
          className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800"
        >
          <FileText className="h-3 w-3 mr-1" />
          {type}
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
        >
          {type}
        </Badge>
      );
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          {rtl ? "سجلات ترحيل GitHub" : "GitHub Migration Logs"}
        </CardTitle>
        <CardDescription>
          {rtl
            ? "عرض سجلات ترحيل قاعدة البيانات"
            : "View database migration logs"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={rtl ? "بحث في السجلات..." : "Search logs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={rtl ? "ترتيب حسب" : "Sort by"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center">
                    <ChevronDown className="mr-2 h-4 w-4" />
                    {rtl ? "الأحدث أولاً" : "Newest first"}
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center">
                    <ChevronUp className="mr-2 h-4 w-4" />
                    {rtl ? "الأقدم أولاً" : "Oldest first"}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchMigrationLogs}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={rtl ? "تصفية حسب الحالة" : "Filter by status"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {rtl ? "جميع الحالات" : "All statuses"}
              </SelectItem>
              <SelectItem value="success">
                {rtl ? "ناجح" : "Success"}
              </SelectItem>
              <SelectItem value="failed">{rtl ? "فشل" : "Failed"}</SelectItem>
              <SelectItem value="error">{rtl ? "خطأ" : "Error"}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={rtl ? "تصفية حسب النوع" : "Filter by type"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {rtl ? "جميع الأنواع" : "All types"}
              </SelectItem>
              {operationTypes
                .filter((type) => type !== "all")
                .map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">{rtl ? "الكل" : "All"}</TabsTrigger>
            <TabsTrigger value="github">
              <Github className="h-4 w-4 mr-1" />
              {rtl ? "GitHub" : "GitHub"}
            </TabsTrigger>
            <TabsTrigger value="custom">
              <FileText className="h-4 w-4 mr-1" />
              {rtl ? "SQL مخصص" : "Custom SQL"}
            </TabsTrigger>
            <TabsTrigger value="setup">
              <Database className="h-4 w-4 mr-1" />
              {rtl ? "الإعداد" : "Setup"}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{rtl ? "التاريخ" : "Date"}</TableHead>
                <TableHead>{rtl ? "نوع العملية" : "Operation Type"}</TableHead>
                <TableHead>{rtl ? "الحالة" : "Status"}</TableHead>
                <TableHead>
                  {rtl ? "الوقت (مللي ثانية)" : "Time (ms)"}
                </TableHead>
                <TableHead className="text-right">
                  {rtl ? "الإجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <span className="text-muted-foreground">
                        {rtl ? "جاري تحميل السجلات..." : "Loading logs..."}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-muted-foreground">
                        {rtl ? "لا توجد سجلات" : "No logs found"}
                      </span>
                      <span className="text-sm text-muted-foreground mt-1">
                        {rtl
                          ? "قم بتشغيل بعض عمليات الترحيل أو تغيير معايير التصفية"
                          : "Run some migrations or change your filter criteria"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formatDate(log.created_at)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getOperationTypeBadge(log.operation_type)}
                    </TableCell>
                    <TableCell>{getStatusBadge(log.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{log.execution_time_ms.toLocaleString()} ms</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {rtl ? "تفاصيل السجل" : "Log Details"}
                            </DialogTitle>
                            <DialogDescription>
                              {rtl ? "معرف العملية:" : "Operation ID:"}{" "}
                              {log.operation_id}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  {rtl ? "نوع العملية" : "Operation Type"}
                                </h4>
                                <div>
                                  {getOperationTypeBadge(log.operation_type)}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  {rtl ? "الحالة" : "Status"}
                                </h4>
                                <div>{getStatusBadge(log.status)}</div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  {rtl ? "الطريقة المستخدمة" : "Method Used"}
                                </h4>
                                <div>
                                  <Badge variant="outline">
                                    {log.method_used}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  {rtl ? "وقت التنفيذ" : "Execution Time"}
                                </h4>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>
                                    {log.execution_time_ms.toLocaleString()} ms
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-1">
                                {rtl ? "محتوى SQL" : "SQL Content"}
                              </h4>
                              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-xs font-mono">
                                {log.sql_content}
                              </pre>
                            </div>

                            {log.details && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  {rtl ? "التفاصيل" : "Details"}
                                </h4>
                                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-xs font-mono">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          {rtl
            ? `عرض ${filteredLogs.length} من أصل ${logs.length} سجل`
            : `Showing ${filteredLogs.length} of ${logs.length} logs`}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          {rtl ? "رجوع" : "Back"}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
            setTypeFilter("all");
            setSortOrder("desc");
            setActiveTab("all");
          }}
          disabled={
            searchQuery === "" &&
            statusFilter === "all" &&
            typeFilter === "all" &&
            sortOrder === "desc" &&
            activeTab === "all"
          }
        >
          {rtl ? "إعادة تعيين الفلاتر" : "Reset Filters"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GitHubMigrationLogs;
