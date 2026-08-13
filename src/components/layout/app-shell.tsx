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
                {process.env.NEXT_PUBLIC_APP_ENV === "staging" && (
                  <span className="px-2 py-0.5 text-[10px] font-black tracking-wider bg-amber-500/10 text-amber-800 border border-amber-500/30 rounded-md">
                    STAGING / TEST DATA ONLY
                  </span>
                )}
                <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-700">ERP 가동 중</span>
                </div>
                <BetaUserAccountSwitcher />
              </div>
            </div>
            {process.env.NEXT_PUBLIC_APP_ENV === "staging" && (
              <div className="bg-amber-50 border border-amber-200/80 px-3 py-1.5 rounded-lg flex items-center justify-between text-xs text-amber-900">
                <span className="font-semibold">
                  ⚠️ 베타 기간에는 실제 어르신 개인정보를 입력하지 마세요. 가명, 가상 연락처, 가상 상담 내용으로 테스트해주세요.
                </span>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  예시: 테스트어르신01 / 010-0000-0001
                </span>
              </div>
            )}
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
