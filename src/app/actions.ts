"use server";

import { revalidatePath } from "next/cache";
import { getTodayInJapan } from "@/lib/date";
import { getSupabaseClient } from "@/lib/supabase";

export async function createDailyReport(formData: FormData) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase environment variables are not configured.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const reportDate = String(formData.get("report_date") ?? "").trim();

  if (!title || !content) {
    return;
  }

  const { error } = await supabase.from("daily_reports").insert({
    title,
    content,
    report_date: reportDate || getTodayInJapan(),
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
}
