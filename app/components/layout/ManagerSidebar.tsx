"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV = [
  {
    label: "Overview",
    href: "/manager",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "My Events",
    href: "/manager/events",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "Create Event",
    href: "/manager/create",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
      </svg>
    ),
  },
];

export default function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-52 xl:w-60 shrink-0 border-r border-white/[0.06] px-6 py-14">
      <div className="sticky top-20 flex flex-col gap-6">

        <p className="text-xs font-medium tracking-widest text-white/30 uppercase">
          Manager
        </p>

        <nav className="flex flex-col gap-0.5">
          {NAV.map(({ label, href, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 w-full py-2 rounded-lg text-sm transition-all duration-150 ${
                  active
                    ? "border-l-2 border-orange-500 pl-[10px] pr-3 bg-white/[0.05] text-white font-medium"
                    : "border-l-2 border-transparent pl-[10px] pr-3 text-white/45 hover:bg-white/[0.04] hover:text-white/75"
                }`}
              >
                {icon}
                {label}
              </Link>
            );
          })}
        </nav>

      </div>
    </aside>
  );
}
