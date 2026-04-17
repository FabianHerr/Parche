"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

export default function AuthButton() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id ?? null);
        setAuthReady(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    setLoading(true);
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
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-sm font-medium text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
    >
      {loading ? "..." : "Log out"}
    </button>
  );
}
