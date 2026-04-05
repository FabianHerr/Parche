import { supabase } from "@/app/lib/supabase";

// Types mirror the PostgreSQL schema exactly.

export type Event = {
  id: string;           // UUID
  host_id: string;      // UUID → users.id
  title: string;
  description: string;
  location: string;
  event_date: string;   // ISO 8601 timestamptz
  created_at: string;
  tag: string;          // lowercase: music | sport | social | dance | culture
  max_attendees?: number;
};

// Reflects the event_images table
export type EventImage = {
  id: string;
  event_id: string;
  image_url: string;
  created_at: string;
};

// What the UI uses: event row joined with event_attendee_counts view
// and the first image from event_images.
export type EventWithMeta = Event & {
  attendee_count: number;
  image_url?: string;
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getEventById(id: string): Promise<EventWithMeta | null> {
  const [eventRes, countRes] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("event_attendee_counts")
      .select("attendee_count")
      .eq("event_id", id)
      .single(),
  ]);

  if (eventRes.error) throw eventRes.error;
  if (!eventRes.data) return null;

  return {
    ...eventRes.data,
    attendee_count: countRes.data?.attendee_count ?? 0,
  };
}

export async function getEvents(): Promise<EventWithMeta[]> {
  const [eventsRes, countsRes] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true }),
    supabase
      .from("event_attendee_counts")
      .select("event_id, attendee_count"),
  ]);

  if (eventsRes.error) throw eventsRes.error;
  if (countsRes.error) throw countsRes.error;

  const countMap = new Map<string, number>(
    countsRes.data.map((row) => [row.event_id, row.attendee_count])
  );

  return eventsRes.data.map((event) => ({
    ...event,
    attendee_count: countMap.get(event.id) ?? 0,
  }));
}

export function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate);
  const datePart = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} · ${timePart}`;
}
