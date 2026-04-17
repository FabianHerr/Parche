"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { getEventsByHost, deleteEvent, formatEventDate, type EventWithMeta } from "@/app/lib/db/events";
import { TAG_CONFIG } from "@/app/lib/tagConfig";
import CardImageCarousel from "@/app/components/events/CardImageCarousel";

export default function ManagerEventsPage() {
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
      console.error("Delete error:", err);
      setError(message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-1.5">
          Manager Mode
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
          My Events
        </h1>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 mb-6">
          {error}
        </p>
      )}

      {/* Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl bg-[#111111] border border-white/[0.06] animate-pulse overflow-hidden">
              <div className="aspect-[3/2]" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-4 w-3/4 rounded-lg bg-white/[0.06]" />
                <div className="h-3 w-1/2 rounded-lg bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && events.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-white/10 text-center px-6">
          <div className="w-14 h-14 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/30">
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-white font-semibold text-sm mb-1">No events yet</p>
          <p className="text-white/40 text-xs mb-6 max-w-xs">
            Create your first event and start bringing people together in Montreal.
          </p>
          <Link
            href="/manager/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium hover:bg-orange-500/15 hover:border-orange-500/30 transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Create your first event
          </Link>
        </div>
      )}

      {/* Event grid */}
      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const tag = TAG_CONFIG[event.tag] ?? TAG_CONFIG["social"];

            return (
              <div
                key={event.id}
                className="group flex flex-col rounded-xl bg-[#111111] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] hover:scale-[1.01] transition-all duration-150"
              >
                {/* Image carousel / gradient area */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <CardImageCarousel
                    images={event.images}
                    gradientClass={tag.imageBg}
                  />

                  {/* Tag badge — top left */}
                  <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${tag.color}`}>
                    {tag.label}
                  </span>

                  {/* Edit + Delete — top right, revealed on hover */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <Link
                      href={`/manager/events/${event.id}/edit`}
                      title="Edit event"
                      className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-neutral-300 hover:text-white hover:bg-black/80 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      disabled={deletingId === event.id}
                      title="Delete event"
                      className="w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm flex items-center justify-center text-neutral-300 hover:text-red-400 hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === event.id ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 animate-spin">
                          <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>

                </div>

                {/* Card body */}
                <div className="flex flex-col gap-2.5 p-4">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-white font-semibold text-sm leading-snug hover:text-white/75 transition-colors duration-150 line-clamp-2"
                  >
                    {event.title}
                  </Link>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-white/45 text-xs">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                      </svg>
                      <span className="truncate">{formatEventDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-white/45 text-xs min-w-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.387 1.445-.96 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.977.545l.025.012.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex -space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div key={i} className="w-4 h-4 rounded-full bg-white/10 border border-[#111111]" />
                          ))}
                        </div>
                        <span className="text-white/45 text-xs tabular-nums">{event.attendee_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
