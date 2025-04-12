import React, { useState, useEffect } from "react";
import {
  testDatabaseConnection,
  getTables,
  getTableColumns,
  executeSql,
} from "../utils/dbUtils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { Loader2, Database, Table, Code } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";

const DatabaseTester = () => {
  const [status, setStatus] = useState<any>(null);
  const [tables, setTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [columns, setColumns] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [customQuery, setCustomQuery] = useState<string>(
    "SELECT current_timestamp as time, current_database() as database",
  );
  const [queryResult, setQueryResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("connection");

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setLoading(true);
    const result = await testDatabaseConnection();
    setStatus(result);
    setLoading(false);

    if (result.connected && result.functionAvailable) {
      loadTables();
    }
  };

  const loadTables = async () => {
    setLoading(true);
    const { data, error } = await getTables();
    setLoading(false);

    if (error) {
      console.error("Error loading tables:", error);
      return;
    }

    setTables(data || []);
  };

  const loadColumns = async (tableName: string) => {
    setSelectedTable(tableName);
    setLoading(true);
    const { data, error } = await getTableColumns(tableName);
    setLoading(false);

    if (error) {
      console.error("Error loading columns:", error);
      return;
    }

    setColumns(data || []);
  };

  const runCustomQuery = async () => {
    if (!customQuery.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await executeSql(customQuery);
      if (error) {
        setQueryResult({ error });
      } else {
        setQueryResult({ data });
      }
    } catch (error) {
      setQueryResult({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Database Connection Tester
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="connection" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Connection
            </TabsTrigger>
            <TabsTrigger value="schema" className="flex items-center">
              <Table className="h-4 w-4 mr-2" />
              Schema
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Custom Query
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <div className="mb-4">
              <Button
                onClick={testConnection}
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Connection"
                )}
              </Button>
            </div>

            {status && (
              <div className="p-4 border rounded bg-background">
                <h2 className="text-xl font-semibold mb-2">
                  Connection Status
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Connected:</div>
                  <div
                    className={
                      status.connected ? "text-green-600" : "text-red-600"
                    }
                  >
                    {status.connected ? "Yes" : "No"}
                  </div>

                  <div className="font-medium">Function Available:</div>
                  <div
                    className={
                      status.functionAvailable
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {status.functionAvailable ? "Yes" : "No"}
                  </div>

                  {status.error && (
                    <>
                      <div className="font-medium">Error:</div>
                      <div className="text-red-600 break-all">
                        {typeof status.error === "string"
                          ? status.error
                          : JSON.stringify(status.error)}
                      </div>
                    </>
                  )}

                  {status.functionData && (
                    <>
                      <div className="font-medium">Function Test Result:</div>
                      <div className="text-green-600 break-all">
                        {typeof status.functionData === "string"
                          ? status.functionData
                          : JSON.stringify(status.functionData)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="schema" className="space-y-4">
            <div className="mb-4">
              <Button
                onClick={loadTables}
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load Tables"
                )}
              </Button>
            </div>

            {tables.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Database Tables</h2>
                <div className="grid grid-cols-3 gap-2">
                  {tables.map((table: any) => (
                    <Button
                      key={table.table_name}
                      onClick={() => loadColumns(table.table_name)}
                      variant={
                        selectedTable === table.table_name
                          ? "secondary"
                          : "outline"
                      }
                      className="justify-start h-auto py-2 px-3 text-left"
                    >
                      {table.table_name}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {columns.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Columns for {selectedTable}
                </h2>
                <div className="border rounded overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-2 text-left">Column Name</th>
                        <th className="border p-2 text-left">Data Type</th>
                        <th className="border p-2 text-left">Nullable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {columns.map((column: any) => (
                        <tr key={column.column_name}>
                          <td className="border p-2">{column.column_name}</td>
                          <td className="border p-2">{column.data_type}</td>
                          <td className="border p-2">
                            {column.is_nullable === "YES" ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="query" className="space-y-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                SQL Query
              </label>
              <textarea
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full p-2 border rounded min-h-[100px] font-mono text-sm bg-background"
                placeholder="Enter SQL query..."
              />
            </div>

            <Button
              onClick={runCustomQuery}
              disabled={loading || !customQuery.trim()}
              className="flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Query...
                </>
              ) : (
                "Run Query"
              )}
            </Button>

            {queryResult && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">Query Result</h2>
                {queryResult.error ? (
                  <div className="p-4 border rounded bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                    <h3 className="font-medium mb-1">Error</h3>
                    <pre className="whitespace-pre-wrap text-sm">
                      {typeof queryResult.error === "string"
                        ? queryResult.error
                        : JSON.stringify(queryResult.error, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="p-4 border rounded bg-background">
                    <pre className="whitespace-pre-wrap text-sm overflow-x-auto max-h-[300px] overflow-y-auto">
                      {JSON.stringify(queryResult.data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DatabaseTester;
