import { useState, useCallback, useEffect } from "react";
import {
  TestCase,
  TestResult,
  runTests,
  saveTestResults,
  createMockTestCases,
} from "@/frontend/services/testService";

export const useTestRunner = (moduleName: string) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  // Initialize test cases for the module
  useEffect(() => {
    setTestCases(createMockTestCases(moduleName));
  }, [moduleName]);

  // Run all tests
  const runAllTests = useCallback(async () => {
    if (isRunning || testCases.length === 0) return;

    setIsRunning(true);
    setResults([]);

    // Create initial "running" state for all tests
    const initialResults = testCases.map((test) => ({
      id: crypto.randomUUID(),
      testId: test.id,
      testName: test.name,
      module: test.module,
      status: "running" as const,
      duration: 0,
      logs: [`[${new Date().toISOString()}] Starting test: ${test.name}`],
      timestamp: new Date().toISOString(),
    }));

    setResults(initialResults);

    // Run tests one by one
    const finalResults: TestResult[] = [];
    for (let i = 0; i < testCases.length; i++) {
      const test = testCases[i];
      const result = await runTests([test]);
      finalResults.push(result[0]);

      // Update results as they complete
      setResults((prev) => {
        const updated = [...prev];
        updated[i] = result[0];
        return updated;
      });
    }

    // Save results to Supabase
    try {
      await saveTestResults(finalResults);
    } catch (error) {
      console.error("Failed to save test results:", error);
    }

    setIsRunning(false);
  }, [testCases, isRunning]);

  // Run failing tests only
  const runFailingTests = useCallback(async () => {
    if (isRunning || testCases.length === 0 || results.length === 0) return;

    const failingTestIds = results
      .filter((result) => result.status === "fail")
      .map((result) => result.testId);

    if (failingTestIds.length === 0) return;

    const failingTests = testCases.filter((test) =>
      failingTestIds.includes(test.id),
    );

    setIsRunning(true);

    // Create initial "running" state for failing tests
    const updatedResults = [...results];
    failingTestIds.forEach((testId) => {
      const index = results.findIndex((r) => r.testId === testId);
      if (index >= 0) {
        updatedResults[index] = {
          ...updatedResults[index],
          status: "running",
          logs: [
            ...updatedResults[index].logs,
            `[${new Date().toISOString()}] Re-running test`,
          ],
          timestamp: new Date().toISOString(),
        };
      }
    });

    setResults(updatedResults);

    // Run failing tests
    const newResults = await runTests(failingTests);

    // Update results
    const finalResults = [...results];
    newResults.forEach((newResult) => {
      const index = finalResults.findIndex(
        (r) => r.testId === newResult.testId,
      );
      if (index >= 0) {
        finalResults[index] = newResult;
      }
    });

    setResults(finalResults);

    // Save results to Supabase
    try {
      await saveTestResults(newResults);
    } catch (error) {
      console.error("Failed to save test results:", error);
    }

    setIsRunning(false);
  }, [testCases, results, isRunning]);

  // Run a single test
  const runSingleTest = useCallback(
    async (testId: string) => {
      if (isRunning) return;

      const test = testCases.find((t) => t.id === testId);
      if (!test) return;

      setIsRunning(true);
      setSelectedTest(testId);

      // Create initial "running" state
      const initialResult: TestResult = {
        id: crypto.randomUUID(),
        testId: test.id,
        testName: test.name,
        module: test.module,
        status: "running",
        duration: 0,
        logs: [`[${new Date().toISOString()}] Starting test: ${test.name}`],
        timestamp: new Date().toISOString(),
      };

      // Update or add the result
      setResults((prev) => {
        const index = prev.findIndex((r) => r.testId === testId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = initialResult;
          return updated;
        }
        return [...prev, initialResult];
      });

      // Run the test
      const [result] = await runTests([test]);

      // Update the result
      setResults((prev) => {
        const index = prev.findIndex((r) => r.testId === testId);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = result;
          return updated;
        }
        return [...prev, result];
      });

      // Save result to Supabase
      try {
        await saveTestResults([result]);
      } catch (error) {
        console.error("Failed to save test result:", error);
      }

      setIsRunning(false);
      setSelectedTest(null);
    },
    [testCases, isRunning],
  );

  return {
    testCases,
    results,
    isRunning,
    selectedTest,
    runAllTests,
    runFailingTests,
    runSingleTest,
  };
};
