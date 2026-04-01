import { notFound } from "next/navigation";
import Link from "next/link";
import { events, getEventById } from "@/app/lib/events";
import RsvpSection from "@/app/components/RsvpSection";

export function generateStaticParams() {
  return events.map((event) => ({ id: String(event.id) }));
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = getEventById(Number(id));

  if (!event) notFound();

  return (
    <main className="flex-1 px-4 py-8 max-w-lg mx-auto w-full">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 text-sm mb-8 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        Back to feed
      </Link>

      {/* Tag */}
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-4 ${event.tagColor}`}
      >
        {event.tag}
      </span>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white tracking-tight leading-tight mb-6">
        {event.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-2.5 text-neutral-400 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 shrink-0 text-neutral-600"
          >
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
              clipRule="evenodd"
            />
          </svg>
          {event.date}
        </div>

        <div className="flex items-center gap-2.5 text-neutral-400 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 shrink-0 text-neutral-600"
          >
            <path
              fillRule="evenodd"
              d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.387 1.445-.96 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.977.545l.025.012.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
              clipRule="evenodd"
            />
          </svg>
          {event.location}
        </div>

        <RsvpSection initialAttendees={event.attendees} />
      </div>

      {/* Divider */}
      <div className="border-t border-white/8 mb-6" />

      {/* Description */}
      <p className="text-neutral-400 text-sm leading-relaxed mb-8">
        {event.description}
      </p>

    </main>
  );
}
