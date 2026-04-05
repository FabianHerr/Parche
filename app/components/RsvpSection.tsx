"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { toggleRSVP, getAttendeeCount, getUserRSVP, type RsvpStatus } from "@/app/lib/rsvps";

export default function RsvpSection({
  eventId,
  initialAttendees,
}: {
  eventId: string;
  initialAttendees: number;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [status, setStatus] = useState<RsvpStatus | null>(null);
  const [attendeeCount, setAttendeeCount] = useState(initialAttendees);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const uid = session?.user?.id ?? null;
        setUserId(uid);

        if (uid) {
          const existingStatus = await getUserRSVP(uid, eventId);
          setStatus(existingStatus);
        } else {
          setStatus(null);
        }

        setAuthReady(true);
      }
    );

    return () => subscription.unsubscribe();
  }, [eventId]);

  async function handleToggle() {
    if (loading || !userId) return;

    const prevStatus = status;
    const prevCount = attendeeCount;
    const newStatus: RsvpStatus = status === "going" ? "not_going" : "going";

    setStatus(newStatus);
    setAttendeeCount((c) => (newStatus === "going" ? c + 1 : c - 1));
    setLoading(true);

    try {
      const confirmedStatus = await toggleRSVP(userId, eventId);
      const freshCount = await getAttendeeCount(eventId);
      setStatus(confirmedStatus);
      setAttendeeCount(freshCount);
    } catch {
      setStatus(prevStatus);
      setAttendeeCount(prevCount);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2.5 text-neutral-400 text-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 shrink-0 text-neutral-600"
        >
          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
        </svg>
        <span>
          <span className="text-white font-medium">{attendeeCount}</span> people going
        </span>
      </div>

      {!authReady ? null : !userId ? (
        <div className="mt-8 rounded-2xl border border-white/8 bg-white/5 px-5 py-5 flex flex-col gap-3">
          <p className="text-sm font-medium text-white">Want to join this event?</p>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Sign in and let others know you're going.
          </p>
          <a
            href="/login"
            className="mt-1 w-full py-3 rounded-xl bg-white text-black text-sm font-semibold text-center hover:bg-neutral-100 transition-colors"
          >
            Sign in to join
          </a>
        </div>
      ) : (
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all mt-8 disabled:opacity-60 disabled:cursor-not-allowed ${
            status === "going"
              ? "bg-white/10 text-neutral-300 border border-white/15 hover:bg-white/15"
              : "bg-white text-black hover:bg-neutral-100 active:scale-95"
          }`}
        >
          {loading
            ? "..."
            : status === "going"
            ? "You're going · Undo"
            : "I'm going"}
        </button>
      )}
    </>
  );
}
