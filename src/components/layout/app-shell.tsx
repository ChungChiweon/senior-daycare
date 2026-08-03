import type { PropsWithChildren } from "react";
import { MobileBottomSheet } from "@/components/layout/mobile-bottom-sheet";
import { SidebarV2 } from "@/components/layout/sidebar-v2";
import { GlobalErpSearch } from "@/components/erp/GlobalErpSearch";
import { ErpBreadcrumb } from "@/components/layout/ErpBreadcrumb";
import { BetaUserAccountSwitcher } from "@/components/erp/BetaUserAccountSwitcher";
import PersonalAssistantPanel from "@/components/erp/PersonalAssistantPanel";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] bg-slate-100">
        <SidebarV2 />
        <main className="w-full flex-1 min-w-0 px-4 pb-20 pt-4 sm:px-6 lg:px-8 lg:pb-10 space-y-3">
          <div className="flex flex-col gap-2 border-b border-slate-200/80 pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="w-full max-w-xl">
                <GlobalErpSearch />
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-700">행복주간보호 ERP 가동 중</span>
                </div>
                <BetaUserAccountSwitcher />
              </div>
            </div>
            <ErpBreadcrumb />
          </div>
          {children}
        </main>
      </div>
      <PersonalAssistantPanel />
      <MobileBottomSheet />
    </div>
  );
}
