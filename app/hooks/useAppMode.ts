"use client";

import { useState, useEffect, useCallback } from "react";

export type AppMode = "explorer" | "manager";

const STORAGE_KEY = "parche:mode";

export function useAppMode() {
  const [mode, setMode] = useState<AppMode>("explorer");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "explorer" || stored === "manager") {
      setMode(stored);
    }
  }, []);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next: AppMode = current === "explorer" ? "manager" : "explorer";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { mode, toggleMode };
}
