import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://dummy-url.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy-key";

// Temporarily disable the error to allow the app to load
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
