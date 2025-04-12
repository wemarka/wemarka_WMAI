import React, { useState, useEffect } from "react";
import {
  executeSql,
  testDatabaseConnection,
  getTables,
  getTableColumns,
} from "@/utils/dbUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../frontend/components/ui/card";
import { Button } from "../frontend/components/ui/button";
import { Textarea } from "../frontend/components/ui/textarea";
import { Input } from "../frontend/components/ui/input";
import { Badge } from "../frontend/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../frontend/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../frontend/components/ui/select";
import { ScrollArea } from "../frontend/components/ui/scroll-area";
import { Separator } from "../frontend/components/ui/separator";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  FileText,
  RefreshCw,
  Server,
  Settings,
} from "lucide-react";

interface DiagnosticResult {
  id: string;
  timestamp: Date;
  type: "query" | "connection" | "tables" | "columns";
  data: any;
  duration: number;
  status: "success" | "error" | "warning";
  method?: string;
}

export default function DatabaseDiagnosticTool() {
  const [query, setQuery] = useState(
    "SELECT current_timestamp as time, current_database() as database",
  );
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState("");
  const [tablesList, setTablesList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("query");
  const [connectionStatus, setConnectionStatus] = useState<any>(null);

  // Load tables on initial render
  useEffect(() => {
    fetchTables();
  }, []);

  const executeQuery = async () => {
    if (!query.trim()) return;

    setLoading(true);
    const startTime = performance.now();

    try {
      const result = await executeSql(query);
      const duration = performance.now() - startTime;

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "query",
        data: result,
        duration,
        status: result.error ? "error" : "success",
        method: result.method,
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } catch (error) {
      const duration = performance.now() - startTime;

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "query",
        data: { error },
        duration,
        status: "error",
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      const status = await testDatabaseConnection();
      const duration = performance.now() - startTime;
      setConnectionStatus(status);

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "connection",
        data: status,
        duration,
        status: status.connected ? "success" : "error",
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } catch (error) {
      const duration = performance.now() - startTime;

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "connection",
        data: { error },
        duration,
        status: "error",
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    setLoading(true);
    const startTime = performance.now();

    try {
      const result = await getTables();
      const duration = performance.now() - startTime;

      if (result.data && Array.isArray(result.data)) {
        const tableNames = result.data.map((table: any) => table.table_name);
        setTablesList(tableNames);

        if (tableNames.length > 0 && !selectedTable) {
          setSelectedTable(tableNames[0]);
        }
      }

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "tables",
        data: result,
        duration,
        status: result.error ? "error" : "success",
        method: result.method,
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } catch (error) {
      const duration = performance.now() - startTime;

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "tables",
        data: { error },
        duration,
        status: "error",
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableColumns = async (tableName: string) => {
    if (!tableName) return;

    setLoading(true);
    const startTime = performance.now();

    try {
      const result = await getTableColumns(tableName);
      const duration = performance.now() - startTime;

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "columns",
        data: { ...result, tableName },
        duration,
        status: result.error ? "error" : "success",
        method: result.method,
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } catch (error) {
      const duration = performance.now() - startTime;

      const diagnosticResult: DiagnosticResult = {
        id: generateId(),
        timestamp: new Date(),
        type: "columns",
        data: { error, tableName },
        duration,
        status: "error",
      };

      setResults((prev) => [diagnosticResult, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "query":
        return <FileText className="h-4 w-4" />;
      case "connection":
        return <Server className="h-4 w-4" />;
      case "tables":
        return <Database className="h-4 w-4" />;
      case "columns":
        return <Settings className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "edge-function":
        return "bg-green-500";
      case "execute_sql":
        return "bg-blue-500";
      case "pg_query":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white">
      <h1 className="text-2xl font-bold mb-6">Database Diagnostic Tool</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="query">SQL Query</TabsTrigger>
              <TabsTrigger value="connection">Connection</TabsTrigger>
              <TabsTrigger value="schema">Schema</TabsTrigger>
            </TabsList>

            <TabsContent value="query">
              <Card>
                <CardHeader>
                  <CardTitle>SQL Query Executor</CardTitle>
                  <CardDescription>
                    Test database queries and view execution details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[150px] mb-4 font-mono"
                    placeholder="Enter SQL query..."
                  />
                  <div className="flex gap-2">
                    <Button onClick={executeQuery} disabled={loading}>
                      {loading ? "Executing..." : "Execute Query"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setQuery(
                          "SELECT current_timestamp as time, current_database() as database",
                        )
                      }
                    >
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connection">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Diagnostics</CardTitle>
                  <CardDescription>
                    Test database connection and function availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={testConnection}
                    disabled={loading}
                    className="mb-4"
                  >
                    {loading ? "Testing..." : "Test Connection"}
                  </Button>

                  {connectionStatus && (
                    <div className="mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                              {connectionStatus.connected ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="text-lg font-medium">
                                {connectionStatus.connected
                                  ? "Connected"
                                  : "Disconnected"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Database Connection
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                              {connectionStatus.functionAvailable ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="text-lg font-medium">
                                {connectionStatus.functionAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              execute_sql Function
                            </p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-2">
                              {connectionStatus.pgQueryAvailable ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="text-lg font-medium">
                                {connectionStatus.pgQueryAvailable
                                  ? "Available"
                                  : "Unavailable"}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              pg_query Function
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      {connectionStatus.functionData && (
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2">
                            Function Test Result:
                          </h3>
                          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-[200px]">
                            {JSON.stringify(
                              connectionStatus.functionData,
                              null,
                              2,
                            )}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schema">
              <Card>
                <CardHeader>
                  <CardTitle>Database Schema Explorer</CardTitle>
                  <CardDescription>
                    Browse tables and columns in the database
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">
                        Select Table
                      </label>
                      <div className="flex gap-2">
                        <Select
                          value={selectedTable}
                          onValueChange={setSelectedTable}
                          disabled={loading || tablesList.length === 0}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a table" />
                          </SelectTrigger>
                          <SelectContent>
                            {tablesList.map((table) => (
                              <SelectItem key={table} value={table}>
                                {table}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={fetchTables}
                          disabled={loading}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        &nbsp;
                      </label>
                      <Button
                        onClick={() => fetchTableColumns(selectedTable)}
                        disabled={loading || !selectedTable}
                      >
                        View Columns
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {results
                      .filter(
                        (result) =>
                          result.type === "columns" &&
                          result.data.tableName === selectedTable,
                      )
                      .slice(0, 1)
                      .map((result) => (
                        <div key={result.id}>
                          <h3 className="font-semibold mb-2">
                            Columns for {result.data.tableName}
                          </h3>
                          {result.status === "error" ? (
                            <div className="text-red-500 p-3 bg-red-50 rounded">
                              Error fetching columns:{" "}
                              {JSON.stringify(result.data.error)}
                            </div>
                          ) : result.data.data &&
                            Array.isArray(result.data.data) ? (
                            <div className="overflow-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Column Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Data Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Nullable
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {result.data.data.map(
                                    (column: any, idx: number) => (
                                      <tr
                                        key={idx}
                                        className={
                                          idx % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                        }
                                      >
                                        <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                          {column.column_name}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {column.data_type}
                                        </td>
                                        <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500">
                                          {column.is_nullable === "YES" ? (
                                            <Badge
                                              variant="outline"
                                              className="bg-yellow-50"
                                            >
                                              Nullable
                                            </Badge>
                                          ) : (
                                            <Badge
                                              variant="outline"
                                              className="bg-blue-50"
                                            >
                                              Required
                                            </Badge>
                                          )}
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-gray-500 p-3 bg-gray-50 rounded">
                              No column data available
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Diagnostic Log</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearResults}>
                  Clear
                </Button>
              </div>
              <CardDescription>Recent diagnostic operations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px] px-4">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No diagnostic data yet
                  </div>
                ) : (
                  <div className="space-y-2 pb-4">
                    {results.map((result) => (
                      <Card key={result.id} className="overflow-hidden">
                        <CardHeader className="py-2 px-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(result.status)}
                              <div className="flex items-center gap-1">
                                {getTypeIcon(result.type)}
                                <span className="text-sm font-medium capitalize">
                                  {result.type}
                                </span>
                              </div>
                              {result.method && (
                                <Badge
                                  className={getMethodBadgeColor(result.method)}
                                >
                                  {result.method}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {result.duration.toFixed(2)}ms
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {result.timestamp.toLocaleTimeString()}
                          </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="py-2 px-3">
                          {result.type === "query" && (
                            <div className="text-xs font-mono bg-gray-50 p-1 rounded mb-2 overflow-auto max-h-[60px]">
                              {result.data.query || "No query"}
                            </div>
                          )}

                          {result.status === "error" ? (
                            <div className="text-red-500 text-xs">
                              {result.data.error ? (
                                <span>
                                  Error:{" "}
                                  {JSON.stringify(
                                    result.data.error.message ||
                                      result.data.error,
                                  )}
                                </span>
                              ) : (
                                <span>Unknown error</span>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-700">
                              {result.type === "connection" ? (
                                <span>
                                  Connection:{" "}
                                  {result.data.connected ? "Success" : "Failed"}
                                  , Functions:{" "}
                                  {result.data.functionAvailable
                                    ? "Available"
                                    : "Unavailable"}
                                </span>
                              ) : result.type === "tables" ? (
                                <span>
                                  Found{" "}
                                  {result.data.data
                                    ? result.data.data.length
                                    : 0}{" "}
                                  tables
                                </span>
                              ) : result.type === "columns" ? (
                                <span>
                                  Table: {result.data.tableName}, Columns:{" "}
                                  {result.data.data
                                    ? result.data.data.length
                                    : 0}
                                </span>
                              ) : (
                                <span>
                                  {result.data.data
                                    ? "Data retrieved successfully"
                                    : "No data returned"}
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
