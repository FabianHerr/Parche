import { getEvents } from "@/app/lib/events";
import EventList from "@/app/components/EventList";
import Sidebar from "@/app/components/Sidebar";
import { TAG_CONFIG, ALL_TAGS } from "@/app/lib/tagConfig";

const TAG_DOTS: Record<string, string> = {
  music:   "bg-violet-400",
  sport:   "bg-emerald-400",
  social:  "bg-sky-400",
  dance:   "bg-rose-400",
  culture: "bg-amber-400",
};

export default async function Home() {
  const events = await getEvents();

  return (
    <main className="flex-1 w-full lg:flex">
      <Sidebar events={events} />

      {/* Content area */}
      <div className="flex-1 min-w-0 px-4 sm:px-5 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="w-full max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              Your Feed
            </h1>
          </div>

          {/* Category filter pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-7" style={{ scrollbarWidth: "none" }}>
            <button className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white text-black transition-all duration-150">
              All
            </button>
            {ALL_TAGS.map((tag) => {
              const { label } = TAG_CONFIG[tag];
              const dot = TAG_DOTS[tag] ?? "bg-white/30";
              return (
                <button
                  key={tag}
                  className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.05] border border-white/[0.06] text-white/50 hover:bg-white/[0.08] hover:text-white/80 transition-all duration-150"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                  {label}
                </button>
              );
            })}
          </div>

          <EventList events={events} />
        </div>
      </div>
    </main>
  );
}
