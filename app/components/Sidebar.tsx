import type { EventWithMeta } from "@/app/lib/events";
import { TAG_CONFIG, ALL_TAGS } from "@/app/lib/tagConfig";

const TAG_DOTS: Record<string, string> = {
  music:   "bg-violet-400",
  sport:   "bg-emerald-400",
  social:  "bg-sky-400",
  dance:   "bg-rose-400",
  culture: "bg-amber-400",
};

type Props =
  | { variant?: "feed"; events: EventWithMeta[] }
  | { variant: "create"; events?: never };

export default function Sidebar({ variant = "feed", events = [] }: Props) {

  if (variant === "create") {
    return (
      <aside className="hidden lg:flex flex-col w-52 xl:w-60 shrink-0 border-r border-white/[0.06] px-6 py-14">
        <div className="sticky top-20 flex flex-col gap-8">
          <div>
            <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-1.5">
              New Event
            </p>
            <h2 className="text-sm font-semibold text-white">Create Event</h2>
            <p className="text-xs text-white/40 mt-2 leading-relaxed">
              Share something happening in Montreal.
            </p>
          </div>

          <div className="border-t border-white/[0.06]" />

          <div>
            <p className="text-xs font-medium tracking-widest text-white/30 uppercase mb-3">
              Tips
            </p>
            <ul className="flex flex-col gap-3">
              {[
                "Give it a clear, specific title",
                "Add a description people will understand",
                "Upload at least one image",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-xs text-white/40 leading-relaxed">
                  <span className="mt-1 w-1 h-1 rounded-full bg-white/20 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    );
  }

  void events;

  return (
    <aside className="hidden lg:flex flex-col w-52 xl:w-60 shrink-0 border-r border-white/[0.06] px-6 py-14">
      <div className="sticky top-20 flex flex-col gap-6">

        <p className="text-xs font-medium tracking-widest text-white/30 uppercase">
          Categories
        </p>

        <nav className="flex flex-col gap-0.5">
          <button className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm bg-white/[0.06] text-white font-medium transition-all duration-150">
            <span className="w-2 h-2 rounded-full bg-white/40 shrink-0" />
            All
          </button>

          {ALL_TAGS.map((tag) => {
            const { label } = TAG_CONFIG[tag];
            const dot = TAG_DOTS[tag] ?? "bg-white/30";
            return (
              <button
                key={tag}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-white/45 hover:bg-white/[0.04] hover:text-white/80 transition-all duration-150"
              >
                <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                {label}
              </button>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}
