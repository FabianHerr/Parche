"use client";

import { useRouter } from "next/navigation";
import { useAppMode } from "@/app/context/AppModeContext";

export default function NavLogo() {
  const router = useRouter();
  const { setMode } = useAppMode();

  function handleClick() {
    setMode("explorer");
    router.push("/");
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150"
    >
      <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
      <span className="text-white font-semibold text-base tracking-tight">Parche</span>
    </button>
  );
}
