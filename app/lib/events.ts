export type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  description: string;
  attendees: number;
  tag: string;
  tagColor: string;
};

export const events: Event[] = [
  {
    id: 1,
    title: "Rooftop Sunset Sessions",
    date: "Sat, Apr 5 · 6:00 PM",
    location: "El Poblado, Medellín",
    description:
      "Golden hour vibes above the city. Join us for a curated DJ set, craft drinks, and good people as the sun dips behind the Andes. All genres welcome — house, Afrobeat, reggaeton. Bring your crew.",
    attendees: 48,
    tag: "Music",
    tagColor: "bg-violet-500/20 text-violet-300",
  },
  {
    id: 2,
    title: "Night Run — Cerro Nutibara",
    date: "Sun, Apr 6 · 5:30 AM",
    location: "Nutibara Hill, Medellín",
    description:
      "Start your Sunday right. We meet at the base of Cerro Nutibara at 5:30 AM for a 6 km trail run with panoramic city views at the top. All paces welcome. Water and post-run coffee included.",
    attendees: 27,
    tag: "Sport",
    tagColor: "bg-emerald-500/20 text-emerald-300",
  },
  {
    id: 3,
    title: "Open Mic & Craft Beer",
    date: "Fri, Apr 11 · 8:00 PM",
    location: "Laureles, Medellín",
    description:
      "Got a song, a poem, or a story? Grab the mic. Or just grab a beer and cheer on the brave ones. The city's most laid-back open mic returns to its favourite bar in Laureles. No sign-up needed.",
    attendees: 63,
    tag: "Social",
    tagColor: "bg-amber-500/20 text-amber-300",
  },
  {
    id: 4,
    title: "Salsa Workshop — Beginners",
    date: "Thu, Apr 10 · 7:00 PM",
    location: "Centro, Medellín",
    description:
      "Never danced salsa? Perfect. This session is built for absolute beginners. Professional instructors break down the basics in a fun, no-pressure environment. Comfortable shoes recommended. Partners provided.",
    attendees: 19,
    tag: "Dance",
    tagColor: "bg-rose-500/20 text-rose-300",
  },
  {
    id: 5,
    title: "Street Art Tour",
    date: "Sat, Apr 12 · 10:00 AM",
    location: "Comuna 13, Medellín",
    description:
      "Walk through one of the world's most famous urban art districts with a local guide who lived through its transformation. Learn the stories behind the murals, the artists, and the community that made it happen.",
    attendees: 34,
    tag: "Culture",
    tagColor: "bg-sky-500/20 text-sky-300",
  },
];

export function getEventById(id: number): Event | undefined {
  return events.find((e) => e.id === id);
}
