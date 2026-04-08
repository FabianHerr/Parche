"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { getEventsByHost, deleteEvent, formatEventDate, type EventWithMeta } from "@/app/lib/events";

export default function ManagerPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (hostId: string) => {
    try {
      const data = await getEventsByHost(hostId);
      setEvents(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? "Failed to load events.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
      } else {
        load(data.user.id);
      }
    });
  }, [router, load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : (err as { message?: string })?.message ?? "Delete failed.";
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="flex-1 w-full">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">
              Manager Mode
            </p>
            <h1 className="text-3xl font-bold text-white tracking-tight">My Events</h1>
          </div>
          <Link
            href="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-100 transition-colors"
          >
            <span className="text-base leading-none">+</span>
            Create Event
          </Link>
        </div>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-6">
            {error}
          </p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && events.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-sm mb-4">No events yet.</p>
            <Link
              href="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/8 border border-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
            >
              Create your first event
            </Link>
          </div>
        )}

        {/* Event list */}
        {!loading && events.length > 0 && (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 rounded-2xl bg-white/5 border border-white/8 px-5 py-4 hover:bg-white/7 transition-colors"
              >
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-white font-semibold text-sm leading-snug hover:text-neutral-200 transition-colors line-clamp-1"
                  >
                    {event.title}
                  </Link>
                  <p className="text-neutral-500 text-xs mt-1">
                    {formatEventDate(event.event_date)}
                  </p>
                </div>

                {/* Attendee count */}
                <div className="flex items-center gap-1.5 shrink-0 text-neutral-500 text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                  </svg>
                  <span className="tabular-nums">{event.attendee_count}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/events/${event.id}/edit`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 bg-white/5 border border-white/8 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={deletingId === event.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/8 border border-red-500/15 hover:bg-red-500/15 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === event.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
