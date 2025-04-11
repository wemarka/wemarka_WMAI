import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found",
  );
}

let supabaseClient;
try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
    console.log("Supabase client initialized successfully");
  } else {
    throw new Error("Supabase credentials not found");
  }
} catch (error) {
  console.error("Error initializing Supabase client:", error);
  // Create a minimal client that won't throw errors when methods are called
  supabaseClient = {
    from: (table: string) => {
      console.warn(`Mock Supabase client used for table: ${table}`);
      return {
        select: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
        insert: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
        update: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
        delete: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
        eq: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
        order: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
        limit: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
        single: () => ({
          data: null,
          error: { message: "Supabase client initialization failed" },
        }),
      };
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signIn: async () => ({
        error: new Error("Supabase client initialization failed"),
      }),
      signUp: async () => ({
        error: new Error("Supabase client initialization failed"),
      }),
      signOut: async () => {},
    },
    functions: {
      invoke: async (name: string) => {
        console.warn(`Mock Supabase function invoked: ${name}`);
        return {
          data: null,
          error: { message: "Supabase client initialization failed" },
        };
      },
    },
  };
}

export const supabase = supabaseClient;
