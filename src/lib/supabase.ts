import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found",
  );
}

// Initialize the Supabase client
let supabaseClient;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    console.log("Supabase client initialized successfully");
  } else {
    throw new Error("Supabase credentials not found");
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  // Create a minimal client that won't throw errors when methods are called
  supabaseClient = createClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder",
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
}

// Create a properly structured export with all required methods and properties
export const supabase = supabaseClient;

// Add additional properties for easier access
supabase.supabaseUrl = supabaseUrl;
supabase.supabaseAnonKey = supabaseAnonKey;
supabase.supabaseKey = supabaseAnonKey; // For compatibility with code expecting supabaseKey
