"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";
import { useAppMode } from "@/app/hooks/useAppMode";

export default function ProfileMenu() {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [open, setOpen] = useState(false);
  const { mode, toggleMode } = useAppMode();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
        setAuthReady(true);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  async function handleLogout() {
    setOpen(false);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (!authReady) return null;

  if (!userId) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div ref={menuRef} className="relative">

      {/* Avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
        aria-expanded={open}
        className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/15 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 text-neutral-300"
        >
          <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-lg bg-neutral-900 border border-white/10 shadow-xl shadow-black/50 py-1 z-50">
          <button
            onClick={() => {
              setOpen(false);
              toggleMode();
              router.push(mode === "explorer" ? "/manager" : "/");
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 transition-colors"
          >
            {mode === "explorer" ? "Switch to Manager Mode" : "Switch to Explorer Mode"}
          </button>
          <button
            onClick={() => { setOpen(false); router.push("/settings"); }}
            className="w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-white/5 transition-colors"
          >
            Settings
          </button>
          <div className="my-1 border-t border-white/8" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
