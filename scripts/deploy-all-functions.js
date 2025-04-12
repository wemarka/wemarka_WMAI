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

// Deploy each function
let successCount = 0;
let failCount = 0;

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
    console.error(`----- Failed to deploy ${functionName} -----`);
  }
}

console.log(`\n===== Deployment Summary =====`);
console.log(`Total: ${functionDirs.length}`);
console.log(`Successful: ${successCount}`);
console.log(`Failed: ${failCount}`);

if (failCount > 0) {
  process.exit(1);
}
