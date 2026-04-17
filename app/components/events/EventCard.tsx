import Link from "next/link";
import type { EventWithMeta } from "@/app/lib/db/events";
import { formatEventDate } from "@/app/lib/db/events";
import { TAG_CONFIG } from "@/app/lib/tagConfig";
import CardImageCarousel from "@/app/components/events/CardImageCarousel";

export default function EventCard({ event }: { event: EventWithMeta }) {
  const tag = TAG_CONFIG[event.tag] ?? TAG_CONFIG["social"];

  const tagBadge = (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm ${tag.color}`}>
      {tag.label}
    </span>
  );

  const dateLabel = (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white/80 text-xs font-medium">
      {formatEventDate(event.event_date)}
    </span>
  );

  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="flex flex-col rounded-xl bg-[#111111] border border-white/[0.06] overflow-hidden transition-all duration-150 hover:border-white/[0.12] hover:scale-[1.01] hover:shadow-xl hover:shadow-black/60">

        <CardImageCarousel
          images={event.images}
          gradientClass={tag.imageBg}
          topLeft={tagBadge}
          bottomLeft={dateLabel}
        />

        {/* Card body */}
        <div className="p-4">
          <h2 className="text-white font-semibold text-sm leading-snug mb-3 line-clamp-2">
            {event.title}
          </h2>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-white/45 text-xs min-w-0">
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

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex -space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full bg-white/10 border border-[#111111]"
                  />
                ))}
              </div>
              <span className="text-white/45 text-xs tabular-nums">
                {event.attendee_count}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
