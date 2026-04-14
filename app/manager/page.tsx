import Link from "next/link";

const ACTIONS = [
  {
    href: "/manager/create",
    label: "Create Event",
    description: "Share something new with Montreal. Add photos, pick a category, and publish in minutes.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>
    ),
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    border: "border-violet-500/20 hover:border-violet-500/40",
    iconBg: "bg-violet-500/15 text-violet-300",
    cta: "Create now →",
  },
  {
    href: "/manager/events",
    label: "My Events",
    description: "View, edit, and manage everything you've published. Track attendance and make updates.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
      </svg>
    ),
    gradient: "from-sky-500/20 via-sky-500/5 to-transparent",
    border: "border-sky-500/20 hover:border-sky-500/40",
    iconBg: "bg-sky-500/15 text-sky-300",
    cta: "View all →",
  },
];

const TIPS = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500">
        <path fillRule="evenodd" d="M1 5.25A2.25 2.25 0 013.25 3h13.5A2.25 2.25 0 0119 5.25v9.5A2.25 2.25 0 0116.75 17H3.25A2.25 2.25 0 011 14.75v-9.5zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-2.69l-2.22-2.219a.75.75 0 00-1.06 0l-1.91 1.909.47.47a.75.75 0 11-1.06 1.06L6.53 8.091a.75.75 0 00-1.06 0l-2.97 2.97zM12 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
      </svg>
    ),
    text: "Add photos — events with images get significantly more attendance.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500">
        <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 15.327 17 13.4 17 10c0-3.866-3.134-7-7-7S3 6.134 3 10c0 3.4 1.698 5.327 3.354 6.584.829.8 1.654 1.381 2.274 1.765a10.63 10.63 0 00.757.433 5.741 5.741 0 00.281.14l.018.008.006.003zM10 11.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" />
      </svg>
    ),
    text: "Pick the right category so the right crowd discovers your event.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
      </svg>
    ),
    text: "Write a clear description: what to expect, who it's for, and what makes it special.",
  },
];

export default function ManagerHomePage() {
  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-10 sm:mb-12">
        <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-2">
          Manager Mode
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Welcome back
        </h1>
        <p className="text-neutral-400 text-sm mt-2">
          Create and manage your events in Montreal.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12 sm:mb-14">
        {ACTIONS.map(({ href, label, description, icon, gradient, border, iconBg, cta }) => (
          <Link
            key={href}
            href={href}
            className={`group relative flex flex-col gap-6 rounded-2xl bg-gradient-to-br ${gradient} border ${border} p-8 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
              {icon}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-white font-semibold text-lg leading-snug">{label}</p>
              <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
            </div>
            <span className="text-xs font-semibold text-neutral-500 group-hover:text-neutral-200 transition-colors">
              {cta}
            </span>
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-white/8 mb-10 sm:mb-12" />

      {/* Tips */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-neutral-500 uppercase mb-5">
          Tips for better events
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TIPS.map(({ icon, text }) => (
            <div
              key={text}
              className="flex flex-col gap-3 rounded-xl bg-white/4 border border-white/8 px-5 py-4"
            >
              {icon}
              <p className="text-neutral-400 text-xs leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
