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
      href={loggedIn ? "/create" : "/login"}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/8 border border-white/10 text-white text-sm font-medium hover:bg-white/15 hover:border-white/20 transition-colors"
    >
      <span className="text-base leading-none">+</span>
      <span className="hidden sm:inline">Create Event</span>
    </Link>
  );
}
