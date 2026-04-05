import type { EventWithMeta } from "@/app/lib/events";
import { TAG_CONFIG, ALL_TAGS } from "@/app/lib/tagConfig";

export default function Sidebar({ events }: { events: EventWithMeta[] }) {

  const countFor = (tag: string) =>
    tag === "all"
      ? events.length
      : events.filter((e) => e.tag === tag).length;

  const byDate = events.reduce<Record<string, number>>((acc, e) => {
    const day = new Date(e.event_date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    acc[day] = (acc[day] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <aside className="hidden lg:flex flex-col w-52 xl:w-60 shrink-0 border-r border-white/8 pl-6 pr-6 py-14">
      <div className="sticky top-20 flex flex-col gap-8">
        {/* Categories */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-3">
            Categories
          </p>
          <nav className="flex flex-col gap-0.5">
            {/* All */}
            <button className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm bg-white/8 text-white font-medium transition-colors">
              <span>All</span>
              <span className="text-xs text-neutral-600 tabular-nums">{countFor("all")}</span>
            </button>

            {ALL_TAGS.map((tag) => {
              const { label, color } = TAG_CONFIG[tag];
              const dotColor = color.split(" ")[0];
              return (
                <button
                  key={tag}
                  className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm text-neutral-400 hover:bg-white/5 hover:text-neutral-200 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    {label}
                  </span>
                  <span className="text-xs text-neutral-600 tabular-nums">{countFor(tag)}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-white/8" />

        {/* Upcoming dates */}
        <div>
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-3">
            This Week
          </p>
          <ul className="flex flex-col gap-2">
            {Object.entries(byDate).map(([day, count]) => (
              <li
                key={day}
                className="flex items-center justify-between text-sm text-neutral-500"
              >
                <span>{day}</span>
                <span className="text-xs text-neutral-700 tabular-nums">
                  {count} {count === 1 ? "event" : "events"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
