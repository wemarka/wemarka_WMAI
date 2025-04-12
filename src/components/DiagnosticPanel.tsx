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
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/frontend/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/frontend/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/frontend/components/ui/accordion";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Database,
  RefreshCw,
  AlertTriangle,
  Server,
  Globe,
  Code,
  Table,
  Key,
  Link as LinkIcon,
  Zap,
  FileCode,
} from "lucide-react";
import { diagnosticTool } from "@/utils/diagnosticTool";

const DiagnosticPanel: React.FC = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("summary");

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const results = await diagnosticTool.runFullDiagnostic();
      setDiagnosticResults(results);
      toast({
        title: "Diagnostics Complete",
        description:
          results.summary.criticalIssues.length > 0
            ? `Found ${results.summary.criticalIssues.length} critical issues`
            : "No critical issues found",
        variant:
          results.summary.criticalIssues.length > 0 ? "destructive" : "success",
      });
    } catch (error) {
      toast({
        title: "Diagnostics Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusBadge = (isSuccess: boolean, text?: string) => {
    return isSuccess ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        {text || "Success"}
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
        <XCircle className="w-3 h-3 mr-1" />
        {text || "Failed"}
      </span>
    );
  };

  const renderSummary = () => {
    if (!diagnosticResults) return null;

    const { summary } = diagnosticResults;

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Connection Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Supabase Connection:</span>
                {getStatusBadge(diagnosticResults.basicConnection.connected)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>SQL Execution Available:</span>
                {getStatusBadge(summary.hasWorkingMethod)}
              </div>
              {summary.recommendedMethod && (
                <div className="mt-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center text-blue-700 dark:text-blue-300">
                    <Zap className="w-4 h-4 mr-2" />
                    <span className="font-medium">Recommended Method:</span>
                  </div>
                  <div className="mt-1 text-blue-600 dark:text-blue-400 font-mono text-sm">
                    {summary.recommendedMethod}
                    {summary.recommendedMethod === "dbUtils.executeSql" && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-800 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  {summary.performanceStats && (
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                      <div className="flex items-center">
                        <span className="font-medium mr-1">
                          Avg. Execution Time:
                        </span>
                        {Math.round(summary.performanceStats.avgExecutionTime)}
                        ms
                      </div>
                      {summary.performanceStats.reliability && (
                        <div className="flex items-center mt-1">
                          <span className="font-medium mr-1">Reliability:</span>
                          {summary.performanceStats.reliability}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>Supabase URL:</span>
                {getStatusBadge(diagnosticResults.supabaseConfig.hasUrl)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Supabase API Key:</span>
                {getStatusBadge(diagnosticResults.supabaseConfig.hasKey)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span>Key Type:</span>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {diagnosticResults.supabaseConfig.keyType}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {summary.criticalIssues.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Critical Issues</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {summary.criticalIssues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {summary.warnings.length > 0 && (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warnings</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                {summary.warnings.map((warning: string, index: number) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {!summary.criticalIssues.length && !summary.warnings.length && (
          <Alert variant="success">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>All Systems Operational</AlertTitle>
            <AlertDescription>
              No issues detected with your Supabase connection and SQL execution
              capabilities.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Troubleshooting Steps</h3>
          <div className="space-y-2">
            {!diagnosticResults.basicConnection.connected && (
              <div className="p-3 border rounded">
                <h4 className="font-medium flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connection Issues
                </h4>
                <ul className="list-disc pl-5 mt-1 text-sm">
                  <li>Check that your Supabase URL and API key are correct</li>
                  <li>Verify network connectivity to Supabase</li>
                  <li>Check browser console for CORS errors</li>
                  <li>
                    Try using a service key instead of an anon key if possible
                  </li>
                </ul>
              </div>
            )}

            {!diagnosticResults.rpcFunctions.pgQuery.available &&
              !diagnosticResults.rpcFunctions.execSql.available && (
                <div className="p-3 border rounded">
                  <h4 className="font-medium flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    RPC Function Issues
                  </h4>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    <li>Create the exec_sql function in your database</li>
                    <li>Check that the pg_query function exists</li>
                    <li>
                      Verify that your API key has permission to call RPC
                      functions
                    </li>
                  </ul>
                </div>
              )}

            {!diagnosticResults.edgeFunctions.sqlExecutorWorks &&
              !diagnosticResults.edgeFunctions.executeSqlWorks && (
                <div className="p-3 border rounded">
                  <h4 className="font-medium flex items-center">
                    <Server className="w-4 h-4 mr-2" />
                    Edge Function Issues
                  </h4>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    <li>Deploy the sql-executor edge function</li>
                    <li>Check for CORS configuration in the edge function</li>
                    <li>
                      Verify that edge functions are enabled for your project
                    </li>
                    <li>Check browser console for CORS errors</li>
                  </ul>
                </div>
              )}

            {!diagnosticResults.informationSchema.canAccessTables && (
              <div className="p-3 border rounded">
                <h4 className="font-medium flex items-center">
                  <Table className="w-4 h-4 mr-2" />
                  Information Schema Access Issues
                </h4>
                <ul className="list-disc pl-5 mt-1 text-sm">
                  <li>
                    Use pg_query to access information_schema instead of direct
                    queries
                  </li>
                  <li>
                    Check that your API key has permission to access
                    information_schema
                  </li>
                  <li>Try using a service key instead of an anon key</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDetailedResults = () => {
    if (!diagnosticResults) return null;

    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="connection">
          <AccordionTrigger>
            <div className="flex items-center">
              <LinkIcon className="w-4 h-4 mr-2" />
              Basic Connection
              {diagnosticResults.basicConnection.connected ? (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 ml-2 text-red-500" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Connected:</span>
                {getStatusBadge(diagnosticResults.basicConnection.connected)}
              </div>
              <div className="flex items-center justify-between">
                <span>Method Used:</span>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {diagnosticResults.basicConnection.method}
                </span>
              </div>
              {diagnosticResults.basicConnection.error && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Error:</h4>
                  <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                    {JSON.stringify(
                      diagnosticResults.basicConnection.error,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="rpc">
          <AccordionTrigger>
            <div className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              RPC Functions
              {diagnosticResults.rpcFunctions.pgQuery.available ||
              diagnosticResults.rpcFunctions.execSql.available ? (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 ml-2 text-red-500" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">pg_query Function:</h4>
                <div className="flex items-center justify-between">
                  <span>Available:</span>
                  {getStatusBadge(
                    diagnosticResults.rpcFunctions.pgQuery.available,
                  )}
                </div>
                {diagnosticResults.rpcFunctions.pgQuery.error && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.rpcFunctions.pgQuery.error,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">exec_sql Function:</h4>
                <div className="flex items-center justify-between">
                  <span>Available:</span>
                  {getStatusBadge(
                    diagnosticResults.rpcFunctions.execSql.available,
                  )}
                </div>
                {diagnosticResults.rpcFunctions.execSql.error && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.rpcFunctions.execSql.error,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="edge">
          <AccordionTrigger>
            <div className="flex items-center">
              <Server className="w-4 h-4 mr-2" />
              Edge Functions
              {diagnosticResults.edgeFunctions.sqlExecutorWorks ||
              diagnosticResults.edgeFunctions.executeSqlWorks ? (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 ml-2 text-red-500" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">
                  sql-executor Function:
                </h4>
                <div className="flex items-center justify-between">
                  <span>Available:</span>
                  {getStatusBadge(
                    diagnosticResults.edgeFunctions.sqlExecutor.available,
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Works:</span>
                  {getStatusBadge(
                    diagnosticResults.edgeFunctions.sqlExecutor.works,
                  )}
                </div>
                {diagnosticResults.edgeFunctions.sqlExecutor.error && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.edgeFunctions.sqlExecutor.error,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">
                  execute-sql Function:
                </h4>
                <div className="flex items-center justify-between">
                  <span>Available:</span>
                  {getStatusBadge(
                    diagnosticResults.edgeFunctions.executeSql.available,
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Works:</span>
                  {getStatusBadge(
                    diagnosticResults.edgeFunctions.executeSql.works,
                  )}
                </div>
                {diagnosticResults.edgeFunctions.executeSql.error && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.edgeFunctions.executeSql.error,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>

              {diagnosticResults.edgeFunctions.directFetch && (
                <div>
                  <h4 className="text-sm font-medium mb-1">
                    Direct Fetch Test:
                  </h4>
                  <div className="flex items-center justify-between">
                    <span>Works:</span>
                    {getStatusBadge(
                      diagnosticResults.edgeFunctions.directFetch.works,
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span>Status:</span>
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {diagnosticResults.edgeFunctions.directFetch.status}{" "}
                      {diagnosticResults.edgeFunctions.directFetch.statusText}
                    </span>
                  </div>
                  {diagnosticResults.edgeFunctions.directFetch.error && (
                    <div className="mt-2">
                      <h4 className="text-xs font-medium">Error:</h4>
                      <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                        {JSON.stringify(
                          diagnosticResults.edgeFunctions.directFetch.error,
                          null,
                          2,
                        )}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sql">
          <AccordionTrigger>
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-2" />
              SQL Execution
              {diagnosticResults.directSqlExecution.dbUtilsWorks ||
              diagnosticResults.directSqlExecution.pgQueryWorks ||
              diagnosticResults.directSqlExecution.execSqlWorks ||
              diagnosticResults.directSqlExecution.directRestWorks ? (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 ml-2 text-red-500" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">
                  dbUtils.executeSql Method:
                </h4>
                <div className="flex items-center justify-between">
                  <span>Works:</span>
                  {getStatusBadge(
                    diagnosticResults.directSqlExecution.dbUtilsWorks,
                  )}
                </div>
                {diagnosticResults.directSqlExecution.dbUtilsPerformance && (
                  <div className="flex items-center justify-between mt-1">
                    <span>Execution Time:</span>
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {Math.round(
                        diagnosticResults.directSqlExecution.dbUtilsPerformance,
                      )}
                      ms
                    </span>
                  </div>
                )}
                {diagnosticResults.directSqlExecution.dbUtilsMethod && (
                  <div className="flex items-center justify-between mt-1">
                    <span>Method Used:</span>
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {diagnosticResults.directSqlExecution.dbUtilsMethod}
                      {diagnosticResults.directSqlExecution.dbUtilsFallback && (
                        <span className="ml-2 text-xs text-amber-600 dark:text-amber-400">
                          (fallback)
                        </span>
                      )}
                    </span>
                  </div>
                )}
                {diagnosticResults.directSqlExecution.dbUtilsRetries > 0 && (
                  <div className="flex items-center justify-between mt-1">
                    <span>Retry Attempts:</span>
                    <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {diagnosticResults.directSqlExecution.dbUtilsRetries}
                    </span>
                  </div>
                )}
                {diagnosticResults.directSqlExecution.dbUtilsError && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.directSqlExecution.dbUtilsError,
                        null,
                        2,
                      )}
                    </pre>
                    {diagnosticResults.directSqlExecution.dbUtilsError
                      .details && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium">Error Details:</h4>
                        <div className="mt-1 space-y-2">
                          {diagnosticResults.directSqlExecution.dbUtilsError
                            .code && (
                            <div className="flex items-start">
                              <span className="text-xs font-medium w-20">
                                Code:
                              </span>
                              <span className="text-xs font-mono bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">
                                {
                                  diagnosticResults.directSqlExecution
                                    .dbUtilsError.code
                                }
                              </span>
                            </div>
                          )}
                          {diagnosticResults.directSqlExecution.dbUtilsError
                            .hint && (
                            <div className="flex items-start">
                              <span className="text-xs font-medium w-20">
                                Hint:
                              </span>
                              <span className="text-xs bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded">
                                {
                                  diagnosticResults.directSqlExecution
                                    .dbUtilsError.hint
                                }
                              </span>
                            </div>
                          )}
                          {diagnosticResults.directSqlExecution.dbUtilsError
                            .query && (
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">
                                Query:
                              </span>
                              <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-2 rounded overflow-x-auto mt-1">
                                {
                                  diagnosticResults.directSqlExecution
                                    .dbUtilsError.query
                                }
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">pg_query Method:</h4>
                <div className="flex items-center justify-between">
                  <span>Works:</span>
                  {getStatusBadge(
                    diagnosticResults.directSqlExecution.pgQueryWorks,
                  )}
                </div>
                {diagnosticResults.directSqlExecution.pgQueryError && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.directSqlExecution.pgQueryError,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">exec_sql Method:</h4>
                <div className="flex items-center justify-between">
                  <span>Works:</span>
                  {getStatusBadge(
                    diagnosticResults.directSqlExecution.execSqlWorks,
                  )}
                </div>
                {diagnosticResults.directSqlExecution.execSqlError && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.directSqlExecution.execSqlError,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">
                  Direct REST API Method:
                </h4>
                <div className="flex items-center justify-between">
                  <span>Works:</span>
                  {getStatusBadge(
                    diagnosticResults.directSqlExecution.directRestWorks,
                  )}
                </div>
                {diagnosticResults.directSqlExecution.directRestError && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {typeof diagnosticResults.directSqlExecution
                        .directRestError === "string"
                        ? diagnosticResults.directSqlExecution.directRestError
                        : JSON.stringify(
                            diagnosticResults.directSqlExecution
                              .directRestError,
                            null,
                            2,
                          )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="schema">
          <AccordionTrigger>
            <div className="flex items-center">
              <Table className="w-4 h-4 mr-2" />
              Information Schema Access
              {diagnosticResults.informationSchema.canAccessTables ||
              diagnosticResults.informationSchema.canAccessColumns ? (
                <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 ml-2 text-red-500" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">
                  information_schema.tables:
                </h4>
                <div className="flex items-center justify-between">
                  <span>Can Access:</span>
                  {getStatusBadge(
                    diagnosticResults.informationSchema.canAccessTables,
                  )}
                </div>
                {diagnosticResults.informationSchema.tablesError && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.informationSchema.tablesError,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">
                  information_schema.columns:
                </h4>
                <div className="flex items-center justify-between">
                  <span>Can Access:</span>
                  {getStatusBadge(
                    diagnosticResults.informationSchema.canAccessColumns,
                  )}
                </div>
                {diagnosticResults.informationSchema.columnsError && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium">Error:</h4>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded overflow-x-auto mt-1 text-red-800 dark:text-red-300">
                      {JSON.stringify(
                        diagnosticResults.informationSchema.columnsError,
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  };

  const renderRawData = () => {
    if (!diagnosticResults) return null;

    return (
      <div>
        <h3 className="text-lg font-medium mb-2">Raw Diagnostic Data</h3>
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto max-h-[500px] overflow-y-auto">
          {JSON.stringify(diagnosticResults, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Server className="h-5 w-5 mr-2" />
          SQL Execution Diagnostics
        </CardTitle>
        <CardDescription>
          Comprehensive diagnostics for SQL execution capabilities
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="summary" className="flex items-center">
              <FileCode className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Detailed Results
            </TabsTrigger>
            <TabsTrigger value="raw" className="flex items-center">
              <Code className="h-4 w-4 mr-2" />
              Raw Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            {renderSummary()}
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            {renderDetailedResults()}
          </TabsContent>

          <TabsContent value="raw" className="space-y-4">
            {renderRawData()}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.history.back()}>
          Back
        </Button>
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="flex items-center"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Diagnostics
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DiagnosticPanel;
