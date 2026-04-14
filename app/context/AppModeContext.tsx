"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type AppMode = "explorer" | "manager";

const STORAGE_KEY = "parche:mode";

type AppModeContextValue = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
};

const AppModeContext = createContext<AppModeContextValue | null>(null);

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>(() => {
    if (typeof window === "undefined") return "explorer";
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "explorer" || stored === "manager" ? stored : "explorer";
  });

  const setMode = useCallback((next: AppMode) => {
    localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((current) => {
      const next: AppMode = current === "explorer" ? "manager" : "explorer";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <AppModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </AppModeContext.Provider>
  );
}

export function useAppMode(): AppModeContextValue {
  const ctx = useContext(AppModeContext);
  if (!ctx) throw new Error("useAppMode must be used inside AppModeProvider");
  return ctx;
}
