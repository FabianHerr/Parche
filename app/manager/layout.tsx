import type { ReactNode } from "react";
import ManagerSidebar from "@/app/components/ManagerSidebar";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex-1 w-full lg:flex">
      <ManagerSidebar />
      <div className="flex-1 min-w-0 px-4 sm:px-5 lg:px-8 py-8 sm:py-10 lg:py-14">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </main>
  );
}
