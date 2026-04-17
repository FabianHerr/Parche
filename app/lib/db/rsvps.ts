import { supabase } from "@/app/lib/supabase";

export type RsvpStatus = "going" | "not_going";

export async function toggleRSVP(
  user_id: string,
  event_id: string
): Promise<RsvpStatus> {
  // Check for existing RSVP
  const { data: existing, error: fetchError } = await supabase
    .from("rsvps")
    .select("id, status")
    .eq("user_id", user_id)
    .eq("event_id", event_id)
    .single();

  // PGRST116 = no row found — expected when user hasn't RSVP'd yet
  if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

  if (existing) {
    const newStatus: RsvpStatus =
      existing.status === "going" ? "not_going" : "going";

    const { error: updateError } = await supabase
      .from("rsvps")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    if (updateError) throw updateError;
    return newStatus;
  }

  // No existing RSVP — insert as going
  const { error: insertError } = await supabase
    .from("rsvps")
    .insert({ user_id, event_id, status: "going" });

  if (insertError) throw insertError;
  return "going";
}

export async function getUserRSVP(
  user_id: string,
  event_id: string
): Promise<RsvpStatus | null> {
  const { data, error } = await supabase
    .from("rsvps")
    .select("status")
    .eq("user_id", user_id)
    .eq("event_id", event_id)
    .single();

  // PGRST116 = no row found — user has not RSVP'd
  if (error && error.code !== "PGRST116") throw error;
  return (data?.status as RsvpStatus) ?? null;
}

export async function getAttendeeCount(event_id: string): Promise<number> {
  const { data, error } = await supabase
    .from("event_attendee_counts")
    .select("attendee_count")
    .eq("event_id", event_id)
    .single();

  // PGRST116 = no rows yet (zero RSVPs)
  if (error && error.code !== "PGRST116") throw error;
  return data?.attendee_count ?? 0;
}
