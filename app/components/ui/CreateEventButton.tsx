"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function CreateEventButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setLoggedIn(!!session?.user);
        setAuthReady(true);
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!authReady) return null;

  return (
    <Link
      href={loggedIn ? "/manager/create" : "/login"}
      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium hover:bg-orange-500/15 hover:border-orange-500/30 hover:text-orange-200 transition-all duration-150"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M8.75 3.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" />
      </svg>
      <span className="hidden sm:inline">Create</span>
    </Link>
  );
}
