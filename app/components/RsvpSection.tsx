"use client";

import { useState } from "react";

export default function RsvpSection({
  initialAttendees,
}: {
  initialAttendees: number;
}) {
  const [rsvped, setRsvped] = useState(false);
  const attendees = rsvped ? initialAttendees + 1 : initialAttendees;

  function toggle() {
    setRsvped((prev) => !prev);
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
          <span className="text-white font-medium">{attendees}</span> people
          going
        </span>
      </div>

      <button
        onClick={toggle}
        className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all mt-8 ${
          rsvped
            ? "bg-white/10 text-neutral-300 border border-white/15 hover:bg-white/15"
            : "bg-white text-black hover:bg-neutral-100 active:scale-95"
        }`}
      >
        {rsvped ? "Going · Cancel RSVP" : "RSVP — I'm going"}
      </button>
    </>
  );
}
