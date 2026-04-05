import Link from "next/link";
import type { EventWithMeta } from "@/app/lib/events";
import { formatEventDate } from "@/app/lib/events";
import { TAG_CONFIG } from "@/app/lib/tagConfig";

export default function EventCard({ event }: { event: EventWithMeta }) {
  const tag = TAG_CONFIG[event.tag] ?? TAG_CONFIG["social"];

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="flex flex-col rounded-2xl bg-white/5 border border-white/8 overflow-hidden transition-all duration-300 hover:bg-white/8 hover:border-white/15 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">

        {/* Image area */}
        <div
          className={`relative h-36 sm:h-40 lg:h-44 bg-gradient-to-br ${tag.imageBg} flex items-end p-3 sm:p-4`}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgbW9kZT0ib3ZlcmxheSIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDYiLz48L3N2Zz4=')] opacity-40" />

          {/* Tag badge */}
          <span
            className={`relative z-10 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${tag.color}`}
          >
            {tag.label}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 sm:p-5">
          <p className="text-neutral-500 text-xs mb-2">{formatEventDate(event.event_date)}</p>

          <h2 className="text-white font-semibold text-base sm:text-lg lg:text-[1.05rem] leading-snug mb-3 group-hover:text-neutral-100 transition-colors line-clamp-2">
            {event.title}
          </h2>

          <div className="flex-1" />

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/6">
            <div className="flex items-center gap-1.5 text-neutral-500 text-xs min-w-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-3.5 h-3.5 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.387 1.445-.96 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.977.545l.025.012.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="truncate">{event.location}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              <div className="flex -space-x-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-4.5 h-4.5 rounded-full bg-neutral-700 border border-neutral-900"
                  />
                ))}
              </div>
              <span className="text-neutral-500 text-xs tabular-nums">
                {event.attendee_count}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
