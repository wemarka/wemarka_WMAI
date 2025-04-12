import React, { useState } from "react";
import { executeSql, testDatabaseConnection, getTables } from "@/utils/dbUtils";
import { Button } from "../frontend/components/ui/button";
import { Textarea } from "../frontend/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../frontend/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../frontend/components/ui/tabs";

export default function DatabaseUtilsTester() {
  const [sqlQuery, setSqlQuery] = useState(
    "SELECT current_timestamp as time, current_database() as database",
  );
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [tables, setTables] = useState<any>(null);

  const runQuery = async () => {
    setLoading(true);
    try {
      const result = await executeSql(sqlQuery);
      setResults(result);
    } catch (error) {
      setResults({ error });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const status = await testDatabaseConnection();
      setConnectionStatus(status);
    } catch (error) {
      setConnectionStatus({ error });
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    setLoading(true);
    try {
      const result = await getTables();
      setTables(result);
    } catch (error) {
      setTables({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Database Utilities Tester</h1>

      <Tabs defaultValue="query">
        <TabsList className="mb-4">
          <TabsTrigger value="query">SQL Query</TabsTrigger>
          <TabsTrigger value="connection">Connection Test</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
        </TabsList>

        <TabsContent value="query">
          <Card>
            <CardHeader>
              <CardTitle>Execute SQL Query</CardTitle>
              <CardDescription>
                Test the executeSql function with custom SQL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="min-h-[150px] mb-4"
                placeholder="Enter SQL query..."
              />
              <Button onClick={runQuery} disabled={loading}>
                {loading ? "Running..." : "Run Query"}
              </Button>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <h3 className="font-semibold mb-2">Results:</h3>
              <pre className="bg-gray-100 p-4 rounded w-full overflow-auto max-h-[300px]">
                {results ? JSON.stringify(results, null, 2) : "No results yet"}
              </pre>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="connection">
          <Card>
            <CardHeader>
              <CardTitle>Test Database Connection</CardTitle>
              <CardDescription>
                Check connection status and function availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={testConnection} disabled={loading}>
                {loading ? "Testing..." : "Test Connection"}
              </Button>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <h3 className="font-semibold mb-2">Connection Status:</h3>
              <pre className="bg-gray-100 p-4 rounded w-full overflow-auto max-h-[300px]">
                {connectionStatus
                  ? JSON.stringify(connectionStatus, null, 2)
                  : "Not tested yet"}
              </pre>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>List all tables in the database</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchTables} disabled={loading}>
                {loading ? "Fetching..." : "Fetch Tables"}
              </Button>
            </CardContent>
            <CardFooter className="flex-col items-start">
              <h3 className="font-semibold mb-2">Tables:</h3>
              <pre className="bg-gray-100 p-4 rounded w-full overflow-auto max-h-[300px]">
                {tables
                  ? JSON.stringify(tables, null, 2)
                  : "No tables fetched yet"}
              </pre>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
