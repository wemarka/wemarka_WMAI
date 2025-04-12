#!/usr/bin/env node

/**
 * This script deploys all edge functions in the supabase/functions directory
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const functionsDir = path.join(__dirname, "..", "supabase", "functions");

// Check if functions directory exists
if (!fs.existsSync(functionsDir)) {
  console.error(`Functions directory not found at ${functionsDir}`);
  process.exit(1);
}

// Get all function directories
const functionDirs = fs
  .readdirSync(functionsDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

if (functionDirs.length === 0) {
  console.log("No functions found to deploy");
  process.exit(0);
}

console.log(
  `Found ${functionDirs.length} functions to deploy: ${functionDirs.join(", ")}`,
);

// Check if SUPABASE_SERVICE_KEY is available
if (!process.env.SUPABASE_SERVICE_KEY) {
  console.error(
    "\n❌ ERROR: SUPABASE_SERVICE_KEY environment variable is not set!",
  );
  console.error("This key is required for deploying functions to Supabase.");
  console.error("Please set this environment variable and try again.\n");
  console.error(
    "Make sure you're using the service_role key from your Supabase project settings, not the anon key.",
  );
  console.error("The service key should start with 'eyJ' and is a JWT token.");
  process.exit(1);
}

// Check if SUPABASE_PROJECT_ID is available
if (!process.env.SUPABASE_PROJECT_ID) {
  console.error(
    "\n❌ ERROR: SUPABASE_PROJECT_ID environment variable is not set!",
  );
  console.error("This ID is required for deploying functions to Supabase.");
  console.error("Please set this environment variable and try again.\n");
  process.exit(1);
}

// Validate service key format (basic check)
if (!process.env.SUPABASE_SERVICE_KEY.startsWith("eyJ")) {
  console.error(
    "\n❌ ERROR: SUPABASE_SERVICE_KEY doesn't appear to be in the correct format.",
  );
  console.error(
    "   Service keys typically start with 'eyJ' and are JWT tokens.",
  );
  console.error(
    "   Please check your project settings and ensure you're using the service_role key, not the anon key.",
  );
  process.exit(1);
}

// Deploy each function
let successCount = 0;
let failCount = 0;
let failedFunctions = [];

for (const functionName of functionDirs) {
  try {
    console.log(`\n----- Deploying ${functionName} -----`);
    execSync(
      `node ${path.join(__dirname, "deploy-edge-function.js")} ${functionName}`,
      { stdio: "inherit" },
    );
    successCount++;
    console.log(`----- ${functionName} deployed successfully -----`);
  } catch (error) {
    failCount++;
    failedFunctions.push(functionName);
    console.error(`----- Failed to deploy ${functionName} -----`);
  }
}

console.log(`\n===== Deployment Summary =====`);
console.log(`Total: ${functionDirs.length}`);
console.log(`Successful: ${successCount}`);
console.log(`Failed: ${failCount}`);

if (failCount > 0) {
  console.log("\n❌ Failed functions:");
  failedFunctions.forEach((name) => console.log(`   - ${name}`));
  console.log("\n🔍 Troubleshooting tips:");
  console.log("   1. Ensure SUPABASE_SERVICE_KEY is correctly set");
  console.log("   2. Verify the service key has the correct permissions");
  console.log(
    "   3. Make sure you're using the service_role key from your Supabase project settings",
  );
  console.log(
    "   4. Check that your Supabase project has edge functions enabled",
  );
  console.log("   5. Verify your function code is valid Deno TypeScript");
  process.exit(1);
}
