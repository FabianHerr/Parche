import type { EventWithMeta } from "@/app/lib/db/events";
import EventCard from "@/app/components/events/EventCard";

export default function EventList({ events }: { events: EventWithMeta[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
