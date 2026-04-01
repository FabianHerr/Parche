import type { Event } from "@/app/lib/events";
import EventCard from "@/app/components/EventCard";

export default function EventList({ events }: { events: Event[] }) {
  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
