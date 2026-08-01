import type { PropsWithChildren } from "react";
import { MobileBottomSheet } from "@/components/layout/mobile-bottom-sheet";
import { SidebarV2 } from "@/components/layout/sidebar-v2";
import { GlobalErpSearch } from "@/components/erp/GlobalErpSearch";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] bg-slate-100">
        <SidebarV2 />
        <main className="w-full flex-1 min-w-0 px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-10 space-y-4">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-3">
            <div className="w-full max-w-xl">
              <GlobalErpSearch />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-700">행복주간보호 ERP 실시간 가동 중</span>
            </div>
          </div>
          {children}
        </main>
      </div>
      <MobileBottomSheet />
    </div>
  );
}
