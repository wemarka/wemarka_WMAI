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
import { Textarea } from "@/frontend/components/ui/textarea";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/frontend/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Database,
  Globe,
  Languages,
  Bug,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/frontend/components/ui/collapsible";
import { migrationsApi } from "@/api/migrations";
import { supabase } from "@/lib/supabase";

const MigrationRunner: React.FC = () => {
  const { toast } = useToast();
  const [sqlContent, setSqlContent] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    error?: any;
    debugInfo?: any;
  } | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isApplyingModuleUpdate, setIsApplyingModuleUpdate] = useState(false);
  const [isApplyingAllDescriptions, setIsApplyingAllDescriptions] =
    useState(false);
  const [tableStatus, setTableStatus] = useState<{
    checked: boolean;
    hasCreatedAt: boolean;
    hasUpdatedAt: boolean;
  }>({ checked: false, hasCreatedAt: false, hasUpdatedAt: false });
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean;
    connected: boolean;
    message?: string;
    retryAttempt?: number;
    maxRetries?: number;
    lastSuccessTime?: string;
  }>({
    checked: false,
    connected: false,
  });
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  // Check if the module_integrations table has the required columns
  const checkTableStatus = async () => {
    try {
      const status = await migrationsApi.checkModuleIntegrationsTable();
      setTableStatus({
        checked: true,
        hasCreatedAt: status.hasCreatedAt,
        hasUpdatedAt: status.hasUpdatedAt,
      });
      return status;
    } catch (error) {
      console.error("Failed to check table status:", error);
      return {
        success: false,
        hasCreatedAt: false,
        hasUpdatedAt: false,
        error,
      };
    }
  };

  // Check connection and table status on component mount
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // Set initial status
        setConnectionStatus((prev) => ({
          ...prev,
          checked: true,
          message: "🔄 Checking connection...",
        }));

        // Check connection first with error handling
        try {
          const connectionResult = await migrationsApi.checkConnection();

          if (connectionResult.success) {
            // Connection successful
            setConnectionStatus({
              checked: true,
              connected: true,
              message: "✅ Connection successful",
              lastSuccessTime:
                connectionResult.debugInfo?.lastSuccessTimestamp ||
                new Date().toISOString(),
            });

            // Try to check if the exec_sql function already exists
            try {
              const testSql = "SELECT 1 as test";
              const testResult = await migrationsApi.runCustomSql(testSql);
              if (testResult.success) {
                setSetupComplete(true);
                // If setup is already complete, check table status
                await checkTableStatus();
              }
            } catch (sqlError) {
              console.warn(
                "SQL execution test failed, setup may be required",
                sqlError,
              );
              setResult({
                success: false,
                error: sqlError,
                debugInfo: {
                  message: "SQL execution test failed, setup may be required",
                  error: sqlError,
                  timestamp: new Date().toISOString(),
                },
              });
            }
          } else {
            // Connection failed
            setConnectionStatus({
              checked: true,
              connected: false,
              message: "❌ Unable to connect – Check credentials or network",
            });

            setResult({
              success: false,
              error: connectionResult.error,
              debugInfo: connectionResult.debugInfo,
            });
          }
        } catch (connectionError) {
          // Error during connection check
          console.error("Connection check failed:", connectionError);
          setConnectionStatus({
            checked: true,
            connected: false,
            message: "❌ Connection error - See debug log for details",
          });

          setResult({
            success: false,
            error: connectionError,
            debugInfo: {
              unexpectedError: true,
              error: connectionError,
              timestamp: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        console.error("Error initializing component:", error);
        setConnectionStatus({
          checked: true,
          connected: false,
          message: "❌ Component initialization error",
        });

        setShowDebugPanel(true); // Automatically show debug panel on error
      }
    };

    initializeComponent();
  }, []);

  // Additional effect to check table status when setup is completed
  useEffect(() => {
    if (setupComplete) {
      checkTableStatus();
    }
  }, [setupComplete]);

  // Check connection status with Supabase
  const handleCheckConnection = async () => {
    setIsCheckingConnection(true);
    setResult(null);

    // Update connection status to show retrying
    setConnectionStatus((prev) => ({
      ...prev,
      checked: true,
      message: "🔄 Checking connection...",
      retryAttempt: 0,
      maxRetries: 3,
    }));

    try {
      // Log Supabase URL for debugging
      console.log(
        "Checking connection with Supabase URL:",
        supabase.supabaseUrl,
      );
      console.log("Has Supabase Key:", !!supabase.supabaseKey);
      console.log("Has Supabase Anon Key:", !!supabase.supabaseAnonKey);

      // Connection check with retry mechanism
      const connectionResult = await migrationsApi.checkConnection();

      // Handle authentication errors specifically
      if (connectionResult.error?.code === "AUTH_ERROR") {
        setConnectionStatus({
          checked: true,
          connected: false,
          message: "❌ Authentication failed - Please log in again",
        });

        setResult(connectionResult);

        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });

        // Here you would typically redirect to login or show auth modal
        // For now we'll just show the message
      } else if (connectionResult.success) {
        // Success case
        const lastSuccessTime =
          connectionResult.debugInfo?.lastSuccessTimestamp ||
          new Date().toISOString();

        setConnectionStatus({
          checked: true,
          connected: true,
          message: "✅ Connection successful",
          lastSuccessTime,
        });

        setResult(connectionResult);

        toast({
          title: "Connection Successful",
          description: "Successfully connected to Supabase",
          variant: "success",
        });
      } else {
        // Failure case
        setConnectionStatus({
          checked: true,
          connected: false,
          message: "❌ Unable to connect – Check credentials or network",
        });

        setResult(connectionResult);

        toast({
          title: "Connection Failed",
          description:
            connectionResult.error?.message || "Could not connect to Supabase",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Connection check error:", error);
      setConnectionStatus({
        checked: true,
        connected: false,
        message: "❌ Connection error - See debug log for details",
      });

      setResult({
        success: false,
        error,
        debugInfo: {
          unexpectedError: true,
          error,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Connection Error",
        description: error?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCheckingConnection(false);
    }
  };

  // Setup the SQL execution function in Supabase
  const handleSetup = async () => {
    setIsRunning(true);
    setResult(null);

    // Update status to show setup is starting
    setConnectionStatus((prev) => ({
      ...prev,
      message: "🔄 Setting up SQL execution function...",
      retryAttempt: 0,
      maxRetries: 3,
    }));

    try {
      // First check connection
      const connectionResult = await migrationsApi.checkConnection();

      // Handle authentication errors
      if (connectionResult.error?.code === "AUTH_ERROR") {
        setConnectionStatus({
          checked: true,
          connected: false,
          message: "❌ Authentication failed - Please log in again",
        });

        setResult(connectionResult);

        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });

        setIsRunning(false);
        return;
      }

      if (!connectionResult.success) {
        const errorMessage = `Supabase connection failed: ${connectionResult.error?.message || "Unknown error"}`;
        setConnectionStatus({
          checked: true,
          connected: false,
          message: "❌ Connection failed - Cannot proceed with setup",
        });

        setResult({
          success: false,
          error: errorMessage,
          debugInfo: connectionResult.debugInfo,
        });

        toast({
          title: "Connection Failed",
          description: errorMessage,
          variant: "destructive",
        });

        setIsRunning(false);
        return;
      }

      // Update status to show we're setting up the function
      setConnectionStatus((prev) => ({
        ...prev,
        message: "🔄 Creating SQL execution function...",
      }));

      // Then setup the SQL execution function with retry mechanism
      const setupResult = await migrationsApi.setupExecSqlFunction();
      setSetupComplete(setupResult.success);
      setResult(setupResult);

      if (setupResult.success) {
        // Update connection status with success message
        setConnectionStatus((prev) => ({
          ...prev,
          message: "✅ SQL execution function created successfully",
          lastSuccessTime:
            setupResult.debugInfo?.lastSuccessTimestamp ||
            new Date().toISOString(),
        }));

        // Check table status after successful setup
        await checkTableStatus();

        toast({
          title: "Setup Complete",
          description: "SQL execution function has been successfully created",
          variant: "success",
        });
      } else {
        // Handle authentication errors in setup result
        if (setupResult.error?.code === "AUTH_ERROR") {
          setConnectionStatus({
            checked: true,
            connected: false,
            message:
              "❌ Authentication failed during setup - Please log in again",
          });

          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
        } else {
          // General setup failure
          setConnectionStatus((prev) => ({
            ...prev,
            message: "❌ Failed to create SQL execution function",
          }));

          toast({
            title: "Setup Failed",
            description:
              setupResult.error?.message ||
              "Failed to create SQL execution function",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Setup error:", error);

      setConnectionStatus((prev) => ({
        ...prev,
        message: "❌ Setup error - See debug log for details",
      }));

      setResult({
        success: false,
        error,
        debugInfo: {
          unexpectedError: true,
          error,
          timestamp: new Date().toISOString(),
        },
      });

      toast({
        title: "Setup Error",
        description:
          error?.message || "An unexpected error occurred during setup",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Apply the module integrations update migration
  const handleApplyModuleIntegrationsUpdate = async () => {
    setIsApplyingModuleUpdate(true);
    setResult(null);

    try {
      const updateResult = await migrationsApi.applyMigration(
        "module_integrations_update",
      );
      setResult(updateResult);

      if (updateResult.success) {
        // Check table status after successful migration
        await checkTableStatus();
      }
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsApplyingModuleUpdate(false);
    }
  };

  // Fix bilingual descriptions in the database
  const handleFixBilingualDescriptions = async () => {
    setIsApplyingModuleUpdate(true);
    setResult(null);

    try {
      const updateResult = await migrationsApi.applyMigration(
        "fix_bilingual_descriptions",
      );
      setResult(updateResult);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsApplyingModuleUpdate(false);
    }
  };

  // Add bilingual descriptions to all tables
  const handleAddAllBilingualDescriptions = async () => {
    setIsApplyingAllDescriptions(true);
    setResult(null);

    try {
      const updateResult = await migrationsApi.applyMigration(
        "add_all_bilingual_descriptions",
      );
      setResult(updateResult);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsApplyingAllDescriptions(false);
    }
  };

  // Run custom SQL migration using the edge function
  const handleRunMigration = async () => {
    if (!sqlContent.trim()) {
      setResult({ success: false, error: "SQL content is empty" });
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const migrationResult = await migrationsApi.runCustomSql(sqlContent);
      setResult(migrationResult);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>SQL Migration Runner</CardTitle>
        <CardDescription>
          Run SQL migrations directly using the Supabase client
        </CardDescription>
        <div className="mt-4 space-y-2">
          <div className="flex space-x-2">
            <Button
              onClick={handleCheckConnection}
              disabled={isCheckingConnection}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              {isCheckingConnection ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking Connection...
                </>
              ) : (
                "Check Supabase Connection"
              )}
            </Button>

            <Button
              onClick={() => {
                if (supabase.supabaseUrl) {
                  // Set status while testing
                  setConnectionStatus((prev) => ({
                    ...prev,
                    message: "🔄 Testing CORS connection...",
                  }));

                  // Test the CORS test function first (simpler)
                  fetch(`${supabase.supabaseUrl}/functions/v1/cors-test`, {
                    method: "OPTIONS",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((response) => {
                      if (response.ok) {
                        // CORS test passed, now try the actual function
                        return fetch(
                          `${supabase.supabaseUrl}/functions/v1/cors-test`,
                          {
                            method: "GET",
                            headers: {
                              "Content-Type": "application/json",
                              apikey:
                                supabase.supabaseKey ||
                                supabase.supabaseAnonKey ||
                                "",
                              Authorization: `Bearer ${supabase.supabaseKey || supabase.supabaseAnonKey || ""}`,
                            },
                          },
                        );
                      } else {
                        throw new Error(
                          `CORS preflight failed: ${response.status}`,
                        );
                      }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                      setConnectionStatus((prev) => ({
                        ...prev,
                        message: "✅ Edge function accessible",
                      }));

                      setResult({
                        success: true,
                        debugInfo: {
                          edgeFunctionTest: "success",
                          response: data,
                          timestamp: new Date().toISOString(),
                        },
                      });

                      toast({
                        title: "Edge Function Available",
                        description: "The edge function is accessible",
                        variant: "success",
                      });

                      setShowDebugPanel(true); // Show debug panel with results
                    })
                    .catch((error) => {
                      console.error("Edge function test failed:", error);

                      setConnectionStatus((prev) => ({
                        ...prev,
                        message: "❌ Edge function not accessible",
                      }));

                      setResult({
                        success: false,
                        error: `Edge function not accessible: ${error.message}`,
                        debugInfo: {
                          edgeFunctionTest: "failed",
                          error: error.toString(),
                          message:
                            "This is likely a CORS issue. The edge function may need to be redeployed with proper CORS headers.",
                          timestamp: new Date().toISOString(),
                        },
                      });

                      toast({
                        title: "Edge Function Error",
                        description:
                          "The edge function is not accessible due to CORS restrictions. It may need to be redeployed.",
                        variant: "destructive",
                      });

                      setShowDebugPanel(true); // Show debug panel with error details
                    });
                } else {
                  setResult({
                    success: false,
                    error: "Supabase URL not found",
                    debugInfo: {
                      error: "Missing Supabase URL",
                      timestamp: new Date().toISOString(),
                    },
                  });

                  toast({
                    title: "Configuration Error",
                    description:
                      "Supabase URL not found in environment variables",
                    variant: "destructive",
                  });
                }
              }}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Test Edge Function
            </Button>
          </div>

          {connectionStatus.checked && (
            <div className="text-sm space-y-1">
              <div className="flex items-center">
                Connection Status:
                <span
                  className={`ml-2 font-medium ${connectionStatus.connected ? "text-green-600" : "text-red-600"}`}
                >
                  {connectionStatus.message ||
                    (connectionStatus.connected
                      ? "✅ Connected"
                      : "❌ Not Connected")}
                </span>
              </div>

              {connectionStatus.lastSuccessTime && (
                <div className="text-xs text-gray-500">
                  Last successful connection:{" "}
                  {new Date(connectionStatus.lastSuccessTime).toLocaleString()}
                </div>
              )}

              {connectionStatus.retryAttempt !== undefined &&
                connectionStatus.retryAttempt > 0 && (
                  <div className="text-xs text-amber-600">
                    🔄 Retry attempt {connectionStatus.retryAttempt}/
                    {connectionStatus.maxRetries}
                  </div>
                )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!setupComplete && (
          <div className="mb-4">
            <Button
              onClick={handleSetup}
              disabled={isRunning}
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                "Setup SQL Execution Function"
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              This needs to be done once to create the necessary database
              function.
            </p>
          </div>
        )}

        <div>
          <label
            htmlFor="sql-content"
            className="block text-sm font-medium mb-2"
          >
            SQL Content
          </label>
          <Textarea
            id="sql-content"
            placeholder="Enter your SQL migration here..."
            value={sqlContent}
            onChange={(e) => setSqlContent(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>
              {result.success
                ? "SQL migration executed successfully"
                : `Failed to execute SQL: ${result.error?.message || JSON.stringify(result.error)}`}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardContent className="border-t pt-4 mt-4">
        <h3 className="text-lg font-medium mb-2">
          Module Integrations Table Status
        </h3>
        {tableStatus.checked ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${tableStatus.hasCreatedAt ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span>
                created_at column:{" "}
                {tableStatus.hasCreatedAt ? "Present" : "Missing"}
              </span>
            </div>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full mr-2 ${tableStatus.hasUpdatedAt ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span>
                updated_at column:{" "}
                {tableStatus.hasUpdatedAt ? "Present" : "Missing"}
              </span>
            </div>
          </div>
        ) : setupComplete ? (
          <p className="text-sm text-muted-foreground">
            Checking table status...
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Set up SQL execution function first to check table status
          </p>
        )}
      </CardContent>

      {/* Debug Log Panel */}
      <CardContent className="border-t pt-4 mt-4">
        <Collapsible
          open={showDebugPanel}
          onOpenChange={setShowDebugPanel}
          className="w-full"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center">
              <Bug className="mr-2 h-4 w-4" />
              Debug Log Panel
            </h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {showDebugPanel ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-2">
            {result?.debugInfo ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Connection Details</h4>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {result.debugInfo.finalMethod || "No method used"}
                  </div>
                </div>

                {result.debugInfo.lastSuccessTimestamp && (
                  <div className="text-xs text-green-600">
                    Last success:{" "}
                    {new Date(
                      result.debugInfo.lastSuccessTimestamp,
                    ).toLocaleString()}
                  </div>
                )}

                {result.debugInfo.authError && (
                  <Alert variant="destructive" className="py-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Authentication Error</AlertTitle>
                    <AlertDescription>
                      Your session token has expired or is invalid. Please log
                      in again.
                    </AlertDescription>
                  </Alert>
                )}

                {result.debugInfo.attempts &&
                  result.debugInfo.attempts.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <h4 className="text-sm font-medium">
                        Connection Attempts (
                        {result.debugInfo.totalAttempts ||
                          result.debugInfo.attempts.length}
                        )
                      </h4>
                      <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-50 dark:bg-gray-900">
                        {result.debugInfo.attempts.map(
                          (attempt: any, index: number) => (
                            <div
                              key={index}
                              className="text-xs mb-2 pb-2 border-b last:border-0"
                            >
                              <div className="flex justify-between">
                                <span className="font-medium">
                                  Attempt {attempt.attemptNumber} (
                                  {attempt.method})
                                </span>
                                <span className="text-gray-500">
                                  {new Date(
                                    attempt.timestamp,
                                  ).toLocaleTimeString()}
                                </span>
                              </div>

                              {attempt.delayMs && (
                                <div className="text-amber-600 mt-1">
                                  <RefreshCw className="h-3 w-3 inline mr-1" />
                                  Delayed {attempt.delayMs}ms before retry
                                </div>
                              )}

                              {attempt.statusCode && (
                                <div
                                  className={`mt-1 ${attempt.statusCode >= 200 && attempt.statusCode < 300 ? "text-green-600" : "text-red-600"}`}
                                >
                                  Status: {attempt.statusCode}{" "}
                                  {attempt.statusText}
                                </div>
                              )}

                              {attempt.error && (
                                <div className="text-red-600 mt-1">
                                  Error:{" "}
                                  {typeof attempt.error === "string"
                                    ? attempt.error
                                    : JSON.stringify(attempt.error)}
                                </div>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                <div className="mt-2">
                  <h4 className="text-sm font-medium mb-1">Raw Debug Data</h4>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-40">
                    {JSON.stringify(result.debugInfo, null, 2)}
                  </pre>
                </div>
              </div>
            ) : result?.error ? (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">
                  Error Details
                </h4>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto max-h-40">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                No debug information available. Run a connection check or SQL
                migration to see details.
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button
          onClick={handleApplyModuleIntegrationsUpdate}
          disabled={isApplyingModuleUpdate || isRunning || !setupComplete}
          className={`w-full ${tableStatus.hasCreatedAt && tableStatus.hasUpdatedAt ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"}`}
        >
          {isApplyingModuleUpdate ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying Module Integrations Update...
            </>
          ) : (
            "Apply Module Integrations Update"
          )}
        </Button>

        <Button
          onClick={handleFixBilingualDescriptions}
          disabled={isApplyingModuleUpdate || isRunning || !setupComplete}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isApplyingModuleUpdate ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fixing Bilingual Descriptions...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Fix Bilingual Descriptions
            </>
          )}
        </Button>

        <Button
          onClick={handleAddAllBilingualDescriptions}
          disabled={isApplyingAllDescriptions || isRunning || !setupComplete}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isApplyingAllDescriptions ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Bilingual Descriptions to All Tables...
            </>
          ) : (
            <>
              <Languages className="mr-2 h-4 w-4" />
              Add Bilingual Descriptions to All Tables
            </>
          )}
        </Button>

        <Button
          onClick={handleRunMigration}
          disabled={isRunning || !sqlContent.trim() || !setupComplete}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Migration...
            </>
          ) : (
            "Run Custom SQL Migration"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MigrationRunner;
