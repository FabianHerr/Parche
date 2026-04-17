import { supabase } from "@/app/lib/supabase";

export async function ensureUserRecord(userId: string, email: string): Promise<void> {
  const { error } = await supabase
    .from("users")
    .upsert({ id: userId, email }, { onConflict: "id", ignoreDuplicates: true });

  if (error) throw error;
}
