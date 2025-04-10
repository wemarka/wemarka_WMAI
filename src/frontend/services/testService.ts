import { supabase } from "@/lib/supabase";

export interface TestCase {
  id: string;
  name: string;
  description: string;
  module: string;
  testFn: () => Promise<boolean>;
}

export interface TestResult {
  id: string;
  testId: string;
  testName: string;
  module: string;
  status: "pass" | "fail" | "running";
  duration: number;
  error?: string;
  logs: string[];
  timestamp: string;
}

export interface TestSummary {
  module: string;
  totalTests: number;
  passed: number;
  failed: number;
  lastRun: string;
  coverage: number;
}

/**
 * Run a single test case and return the result
 */
export const runTest = async (test: TestCase): Promise<TestResult> => {
  const startTime = performance.now();
  const logs: string[] = [];
  const logMessage = (message: string) => {
    logs.push(`[${new Date().toISOString()}] ${message}`);
  };

  logMessage(`Starting test: ${test.name}`);

  try {
    // Run the test function
    const result = await test.testFn();
    const endTime = performance.now();
    const duration = endTime - startTime;

    if (result) {
      logMessage(`Test passed in ${duration.toFixed(2)}ms`);
      return {
        id: crypto.randomUUID(),
        testId: test.id,
        testName: test.name,
        module: test.module,
        status: "pass",
        duration,
        logs,
        timestamp: new Date().toISOString(),
      };
    } else {
      logMessage(`Test failed in ${duration.toFixed(2)}ms`);
      return {
        id: crypto.randomUUID(),
        testId: test.id,
        testName: test.name,
        module: test.module,
        status: "fail",
        duration,
        error: "Test assertion failed",
        logs,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);

    logMessage(`Test threw an exception: ${errorMessage}`);

    return {
      id: crypto.randomUUID(),
      testId: test.id,
      testName: test.name,
      module: test.module,
      status: "fail",
      duration,
      error: errorMessage,
      logs,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Run multiple test cases and return the results
 */
export const runTests = async (tests: TestCase[]): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  for (const test of tests) {
    const result = await runTest(test);
    results.push(result);
  }

  return results;
};

/**
 * Save test results to Supabase
 */
export const saveTestResults = async (
  results: TestResult[],
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("test_logs").insert(
      results.map((result) => ({
        test_id: result.testId,
        test_name: result.testName,
        module: result.module,
        status: result.status,
        duration: result.duration,
        error: result.error || null,
        logs: result.logs,
        created_at: result.timestamp,
      })),
    );

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error saving test results:", error);
    return false;
  }
};

/**
 * Get test results from Supabase
 */
export const getTestResults = async (
  module?: string,
): Promise<TestResult[]> => {
  try {
    let query = supabase
      .from("test_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (module) {
      query = query.eq("module", module);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((item) => ({
      id: item.id,
      testId: item.test_id,
      testName: item.test_name,
      module: item.module,
      status: item.status,
      duration: item.duration,
      error: item.error,
      logs: item.logs || [],
      timestamp: item.created_at,
    }));
  } catch (error) {
    console.error("Error fetching test results:", error);
    return [];
  }
};

/**
 * Get test summary by module
 */
export const getTestSummary = async (): Promise<TestSummary[]> => {
  try {
    const { data, error } = await supabase
      .from("test_summary_view")
      .select("*");

    if (error) {
      // If the view doesn't exist, calculate summary from raw data
      const results = await getTestResults();

      // Group by module
      const moduleMap = new Map<string, TestResult[]>();
      results.forEach((result) => {
        if (!moduleMap.has(result.module)) {
          moduleMap.set(result.module, []);
        }
        moduleMap.get(result.module)!.push(result);
      });

      // Calculate summary for each module
      const summary: TestSummary[] = [];
      moduleMap.forEach((moduleResults, module) => {
        // Get the latest run for each test
        const latestRuns = new Map<string, TestResult>();
        moduleResults.forEach((result) => {
          if (
            !latestRuns.has(result.testId) ||
            new Date(result.timestamp) >
              new Date(latestRuns.get(result.testId)!.timestamp)
          ) {
            latestRuns.set(result.testId, result);
          }
        });

        const latestResults = Array.from(latestRuns.values());
        const passed = latestResults.filter((r) => r.status === "pass").length;
        const total = latestResults.length;

        summary.push({
          module,
          totalTests: total,
          passed,
          failed: total - passed,
          lastRun:
            latestResults.length > 0
              ? new Date(
                  Math.max(
                    ...latestResults.map((r) =>
                      new Date(r.timestamp).getTime(),
                    ),
                  ),
                ).toISOString()
              : "",
          coverage: total > 0 ? Math.round((passed / total) * 100) : 0,
        });
      });

      return summary;
    }

    return (data || []).map((item) => ({
      module: item.module,
      totalTests: item.total_tests,
      passed: item.passed,
      failed: item.failed,
      lastRun: item.last_run,
      coverage: item.coverage,
    }));
  } catch (error) {
    console.error("Error fetching test summary:", error);
    return [];
  }
};

/**
 * Create mock test cases for a specific module
 */
export const createMockTestCases = (module: string): TestCase[] => {
  // Common test cases that could apply to any module
  const commonTests: TestCase[] = [
    {
      id: `${module.toLowerCase()}-render-test`,
      name: `${module} Render Test`,
      description: `Verify that the ${module} component renders correctly`,
      module,
      testFn: async () => {
        // Simulate a successful render test
        await new Promise((resolve) =>
          setTimeout(resolve, 300 + Math.random() * 500),
        );
        return Math.random() > 0.1; // 90% chance of success
      },
    },
    {
      id: `${module.toLowerCase()}-data-fetch-test`,
      name: `${module} Data Fetching Test`,
      description: `Verify that the ${module} can fetch data from the API`,
      module,
      testFn: async () => {
        // Simulate an API call
        await new Promise((resolve) =>
          setTimeout(resolve, 500 + Math.random() * 700),
        );

        // Simulate a response validation
        try {
          const mockResponse = {
            data: Array(5)
              .fill(0)
              .map((_, i) => ({ id: i, name: `Item ${i}` })),
            error: null,
          };

          // Validate the response structure
          if (!mockResponse.data || !Array.isArray(mockResponse.data)) {
            throw new Error("Invalid response format");
          }

          return mockResponse.data.length > 0 && Math.random() > 0.2; // 80% chance of success
        } catch (error) {
          return false;
        }
      },
    },
    {
      id: `${module.toLowerCase()}-error-handling-test`,
      name: `${module} Error Handling Test`,
      description: `Verify that the ${module} handles errors gracefully`,
      module,
      testFn: async () => {
        // Simulate an API call that fails
        await new Promise((resolve) =>
          setTimeout(resolve, 200 + Math.random() * 300),
        );

        // Simulate error handling
        try {
          const mockError = { message: "Simulated API error" };

          // Test should pass if error is handled correctly
          return Math.random() > 0.3; // 70% chance of success
        } catch (error) {
          return false;
        }
      },
    },
  ];

  // Add module-specific tests based on the module name
  const moduleSpecificTests: TestCase[] = [];

  switch (module) {
    case "Dashboard":
      moduleSpecificTests.push({
        id: "dashboard-widgets-test",
        name: "Dashboard Widgets Test",
        description: "Verify that all dashboard widgets load correctly",
        module,
        testFn: async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, 400 + Math.random() * 600),
          );
          return Math.random() > 0.15; // 85% chance of success
        },
      });
      moduleSpecificTests.push({
        id: "dashboard-interactivity-test",
        name: "Dashboard Interactivity Test",
        description: "Verify that dashboard widgets are interactive",
        module,
        testFn: async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, 300 + Math.random() * 400),
          );
          return Math.random() > 0.25; // 75% chance of success
        },
      });
      break;

    case "Store":
      moduleSpecificTests.push({
        id: "store-product-list-test",
        name: "Store Product List Test",
        description: "Verify that the product list loads correctly",
        module,
        testFn: async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, 400 + Math.random() * 600),
          );
          return Math.random() > 0.1; // 90% chance of success
        },
      });
      moduleSpecificTests.push({
        id: "store-cart-functionality-test",
        name: "Store Cart Functionality Test",
        description: "Verify that items can be added to the cart",
        module,
        testFn: async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, 300 + Math.random() * 500),
          );
          return Math.random() > 0.2; // 80% chance of success
        },
      });
      break;

    case "Analytics":
      moduleSpecificTests.push({
        id: "analytics-charts-test",
        name: "Analytics Charts Test",
        description: "Verify that analytics charts render correctly",
        module,
        testFn: async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, 500 + Math.random() * 700),
          );
          return Math.random() > 0.15; // 85% chance of success
        },
      });
      moduleSpecificTests.push({
        id: "analytics-filters-test",
        name: "Analytics Filters Test",
        description: "Verify that analytics filters work correctly",
        module,
        testFn: async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, 400 + Math.random() * 500),
          );
          return Math.random() > 0.25; // 75% chance of success
        },
      });
      break;

    // Add more module-specific tests as needed
  }

  return [...commonTests, ...moduleSpecificTests];
};
