import Link from "next/link";
import type { Event } from "@/app/lib/events";

export default function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`}>
    <article className="group relative rounded-2xl bg-white/5 border border-white/8 p-5 hover:bg-white/8 hover:border-white/15 transition-all cursor-pointer">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${event.tagColor}`}
        >
          {event.tag}
        </span>
        <span className="text-neutral-500 text-xs">{event.date}</span>
      </div>

      {/* Title */}
      <h2 className="text-white font-semibold text-lg leading-snug mb-3 group-hover:text-neutral-100">
        {event.title}
      </h2>

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.387 1.445-.96 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.977.545l.025.012.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
              clipRule="evenodd"
            />
          </svg>
          <span>{event.location}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-5 h-5 rounded-full bg-neutral-700 border border-neutral-900"
              />
            ))}
          </div>
          <span className="text-neutral-500 text-xs">
            {event.attendees} going
          </span>
        </div>
      </div>
    </article>
    </Link>
  );
}
