import { events } from "@/app/lib/events";
import EventList from "@/app/components/EventList";

export default function Home() {
  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-1">
          Medellín · Today
        </p>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Your Feed
        </h1>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {["All", "Music", "Sport", "Social", "Dance", "Culture"].map(
          (filter) => (
            <button
              key={filter}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === "All"
                  ? "bg-white text-black"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          )
        )}
      </div>

      <EventList events={events} />
    </main>
  );
}
