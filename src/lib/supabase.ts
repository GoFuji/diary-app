import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type DailyReport = {
  id: number;
  report_date: string;
  title: string;
  content: string;
  created_at: string;
};

let supabase: SupabaseClient | null = null;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  if (!supabase) {
    supabase = createClient(url, key);
  }

  return supabase;
}
