"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppMode } from "@/app/context/AppModeContext";
import { NAV } from "@/app/components/layout/ManagerSidebar";

export default function ManagerDrawer() {
  const { mode } = useAppMode();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (mode !== "manager") return null;

  return (
    <>
      {/* Hamburger button — mobile only, left side of navbar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-[75vw] max-w-[280px] bg-[#111111] border-r border-white/[0.06] flex flex-col lg:hidden transition-transform duration-200 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/[0.06] shrink-0">
          <p className="text-xs font-medium tracking-widest text-white/30 uppercase">
            Manager
          </p>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/45 hover:text-white hover:bg-white/[0.06] transition-colors duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links — same style as ManagerSidebar */}
        <nav className="flex flex-col gap-0.5 px-4 py-5">
          {NAV.map(({ label, href, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
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
    </>
  );
}
