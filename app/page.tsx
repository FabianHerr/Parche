import { getEvents } from "@/app/lib/events";
import EventList from "@/app/components/EventList";
import Sidebar from "@/app/components/Sidebar";

export default async function Home() {
  const events = await getEvents();

  return (
    <main className="flex-1 w-full lg:flex">
      <Sidebar events={events} />

      {/* Content area */}
      <div className="flex-1 min-w-0 px-4 sm:px-5 lg:px-8 py-8 sm:py-10 lg:py-14">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">
            Montreal · Today
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Your Feed
          </h1>
        </div>

        {/* Filter pills — mobile & tablet only */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide lg:hidden">
          {["all", "music", "sport", "social", "dance", "culture"].map(
            (filter) => (
              <button
                key={filter}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-white text-black"
                    : "bg-white/5 text-neutral-400 hover:bg-white/10"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            )
          )}
        </div>

        <EventList events={events} />
      </div>
    </main>
  );
}
