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

// Access environment variables directly
const SUPABASE_PROJECT_ID =
  process.env.SUPABASE_PROJECT_ID || process.env.VITE_SUPABASE_PROJECT_ID;
const SUPABASE_SERVICE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.VITE_SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

// Log environment variable status
console.log(
  `Using Project ID: ${SUPABASE_PROJECT_ID ? "✓ Found" : "✗ Missing"}`,
);
console.log(
  `Using Service Key: ${SUPABASE_SERVICE_KEY ? "✓ Found" : "✗ Missing"}`,
);

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
try {
  const functionCode = fs.readFileSync(functionFilePath, "utf8");
  console.log(`Read function code (${functionCode.length} bytes)`);

  // Check if the function code contains the required CORS headers
  if (!functionCode.includes("Access-Control-Allow-Origin")) {
    console.warn("⚠️  Warning: Function code may not include CORS headers");
    console.warn(
      "   This might cause issues when calling the function from browsers",
    );
  }

  deployFunction(functionCode);
} catch (error) {
  console.error(`Error reading function file: ${error.message}`);
  process.exit(1);
}

async function deployFunction(functionCode) {
  console.log(`\n📦 Deploying function: ${functionName}...`);

  try {
    // First check if function exists
    console.log(`🔍 Checking if function ${functionName} exists...`);
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
    console.log(`Function exists: ${functionExists ? "Yes ✓" : "No ✗"}`);

    let method = functionExists ? "PATCH" : "POST";
    let url = `https://api.supabase.com/v1/projects/${SUPABASE_PROJECT_ID}/functions`;

    if (functionExists) {
      url = `${url}/${functionName}`;
      console.log(`🔄 Updating existing function: ${functionName}`);
    } else {
      console.log(`🆕 Creating new function: ${functionName}`);
    }

    console.log(`📡 Sending ${method} request to ${url}`);

    // Deploy function
    const startTime = Date.now();
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
    const deployTime = ((Date.now() - startTime) / 1000).toFixed(2);

    if (response.ok) {
      const data = await response.json();
      console.log(
        `\n✅ Function ${functionName} deployed successfully in ${deployTime}s!`,
      );
      console.log(
        `🔗 Function URL: https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${functionName}`,
      );
      console.log(`\n📝 Function Details:`);
      console.log(`   - ID: ${data.id}`);
      console.log(`   - Name: ${data.name}`);
      console.log(`   - Status: ${data.status}`);
      console.log(`   - Version: ${data.version}`);
      console.log(
        `   - Created At: ${new Date(data.created_at).toLocaleString()}`,
      );
      console.log(
        `   - Updated At: ${new Date(data.updated_at).toLocaleString()}`,
      );

      // Log how to invoke the function
      console.log(`\n🚀 How to invoke:`);
      console.log(
        `   curl -L -X POST 'https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/${functionName}' \\`,
      );
      console.log(`   -H 'Authorization: Bearer YOUR_ANON_KEY' \\`);
      console.log(`   -H 'Content-Type: application/json' \\`);
      console.log(`   --data '{ "your": "payload" }'`);

      return data;
    } else {
      const errorText = await response.text();
      console.error(`\n❌ Deployment failed with status ${response.status}`);
      console.error(`Response: ${errorText}`);

      // Provide more helpful error messages based on status code
      if (response.status === 401 || response.status === 403) {
        console.error(
          "\n🔑 Authentication Error: Your service key may be invalid or expired.",
        );
        console.error(
          "   Please check your SUPABASE_SERVICE_KEY environment variable.",
        );
      } else if (response.status === 404) {
        console.error(
          "\n🔍 Not Found Error: The specified project or function endpoint could not be found.",
        );
        console.error(
          "   Please check your SUPABASE_PROJECT_ID environment variable.",
        );
      } else if (response.status === 429) {
        console.error(
          "\n⏱️  Rate Limit Error: You've exceeded the API rate limits.",
        );
        console.error("   Please wait a few minutes before trying again.");
      } else if (response.status >= 500) {
        console.error(
          "\n🔧 Server Error: The Supabase API is experiencing issues.",
        );
        console.error(
          "   Please try again later or check the Supabase status page.",
        );
      }

      throw new Error(
        `Deployment failed with status ${response.status}: ${errorText}`,
      );
    }
  } catch (error) {
    console.error("\n❌ Error deploying function:", error.message);

    // Provide troubleshooting tips
    console.error("\n🔍 Troubleshooting tips:");
    console.error("   1. Check your internet connection");
    console.error("   2. Verify your Supabase project ID and service key");
    console.error("   3. Ensure your function code is valid Deno TypeScript");
    console.error(
      "   4. Check if your Supabase project has edge functions enabled",
    );
    console.error(
      "   5. Try using the Supabase CLI as an alternative deployment method",
    );

    process.exit(1);
  }
}
