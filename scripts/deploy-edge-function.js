#!/usr/bin/env node

/**
 * This script deploys edge functions directly to Supabase using their REST API
 * instead of relying on Docker and the Supabase CLI.
 */

import fs from "fs";
import path from "path";
import fetch from "cross-fetch";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get function name from command line arguments
const functionName = process.argv[2];
if (!functionName) {
  console.error("Please provide a function name as an argument");
  console.error("Usage: node deploy-edge-function.js <function-name>");
  process.exit(1);
}

// Required environment variables
const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_PROJECT_ID || !SUPABASE_SERVICE_KEY) {
  console.error(
    "Missing required environment variables: SUPABASE_PROJECT_ID and SUPABASE_SERVICE_KEY",
  );
  process.exit(1);
}

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function paths
const functionDir = path.join(
  __dirname,
  "..",
  "supabase",
  "functions",
  functionName,
);
const functionFilePath = path.join(functionDir, "index.ts");

// Check if function exists
if (!fs.existsSync(functionFilePath)) {
  console.error(`Function ${functionName} not found at ${functionFilePath}`);
  process.exit(1);
}

// Read function code
const functionCode = fs.readFileSync(functionFilePath, "utf8");

async function deployFunction() {
  console.log(`Deploying function: ${functionName}...`);

  try {
    // First check if function exists
    const checkResponse = await fetch(
      `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/functions/${functionName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_KEY,
        },
      },
    );

    const functionExists = checkResponse.status === 200;
    let method = functionExists ? "PATCH" : "POST";
    let url = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/functions`;

    if (functionExists) {
      url = `${url}/${functionName}`;
    }

    // Deploy function
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({
        name: functionName,
        verify_jwt: false,
        body: functionCode,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Function ${functionName} deployed successfully!`);
      console.log(
        `Function URL: https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${functionName}`,
      );
      return data;
    } else {
      const errorText = await response.text();
      throw new Error(
        `Deployment failed with status ${response.status}: ${errorText}`,
      );
    }
  } catch (error) {
    console.error("Error deploying function:", error.message);
    process.exit(1);
  }
}

deployFunction();
