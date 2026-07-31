import type { PropsWithChildren } from "react";
import { MobileBottomSheet } from "@/components/layout/mobile-bottom-sheet";
import { SidebarV2 } from "@/components/layout/sidebar-v2";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] bg-slate-100">
        <SidebarV2 />
        <main className="w-full flex-1 min-w-0 px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileBottomSheet />
    </div>
  );
}
