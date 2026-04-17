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
// and images from event_images.
export type EventWithMeta = Event & {
  attendee_count: number;
  images: string[];
};

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getEventById(id: string): Promise<EventWithMeta | null> {
  const [eventRes, countRes, imagesRes] = await Promise.all([
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
    supabase
      .from("event_images")
      .select("image_url")
      .eq("event_id", id),
  ]);

  if (eventRes.error) throw eventRes.error;
  if (!eventRes.data) return null;

  return {
    ...eventRes.data,
    attendee_count: countRes.data?.attendee_count ?? 0,
    images: (imagesRes.data ?? []).map((r) => r.image_url),
  };
}

export async function getEvents(): Promise<EventWithMeta[]> {
  const [eventsRes, countsRes, imagesRes] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true }),
    supabase
      .from("event_attendee_counts")
      .select("event_id, attendee_count"),
    supabase
      .from("event_images")
      .select("event_id, image_url"),
  ]);

  if (eventsRes.error) throw eventsRes.error;
  if (countsRes.error) throw countsRes.error;
  if (imagesRes.error) throw imagesRes.error;

  const countMap = new Map<string, number>(
    countsRes.data.map((row) => [row.event_id, row.attendee_count])
  );

  const imageMap = new Map<string, string[]>();
  for (const row of imagesRes.data) {
    const existing = imageMap.get(row.event_id);
    if (existing) {
      existing.push(row.image_url);
    } else {
      imageMap.set(row.event_id, [row.image_url]);
    }
  }

  return eventsRes.data.map((event) => ({
    ...event,
    attendee_count: countMap.get(event.id) ?? 0,
    images: imageMap.get(event.id) ?? [],
  }));
}

export async function getEventsByHost(hostId: string): Promise<EventWithMeta[]> {
  const [eventsRes, countsRes, imagesRes] = await Promise.all([
    supabase
      .from("events")
      .select("*")
      .eq("host_id", hostId)
      .order("event_date", { ascending: true }),
    supabase
      .from("event_attendee_counts")
      .select("event_id, attendee_count"),
    supabase
      .from("event_images")
      .select("event_id, image_url"),
  ]);

  if (eventsRes.error) throw eventsRes.error;
  if (countsRes.error) throw countsRes.error;
  if (imagesRes.error) throw imagesRes.error;

  const countMap = new Map<string, number>(
    countsRes.data.map((row) => [row.event_id, row.attendee_count])
  );

  const imageMap = new Map<string, string[]>();
  for (const row of imagesRes.data) {
    const existing = imageMap.get(row.event_id);
    if (existing) {
      existing.push(row.image_url);
    } else {
      imageMap.set(row.event_id, [row.image_url]);
    }
  }

  return eventsRes.data.map((event) => ({
    ...event,
    attendee_count: countMap.get(event.id) ?? 0,
    images: imageMap.get(event.id) ?? [],
  }));
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    console.error("Delete error:", error);
    throw error;
  }
}

export type CreateEventInput = {
  host_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  tag: string;
};

export type UpdateEventInput = {
  title?: string;
  description?: string;
  location?: string;
  event_date?: string;
  tag?: string;
};

export async function updateEvent(id: string, input: UpdateEventInput): Promise<void> {
  const { error } = await supabase.from("events").update(input).eq("id", id);
  if (error) {
    console.error("[update-event] error:", error);
    throw error;
  }
}

export async function createEvent(input: CreateEventInput): Promise<string> {
  const { data, error } = await supabase
    .from("events")
    .insert(input)
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
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
