"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Home, Menu, Sparkles, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomSheet() {
  const pathname = usePathname();
  const [openDrawer, setOpenDrawer] = useState(false);

  const mainTabs = [
    { href: "/dashboard", label: "홈", icon: Home },
    { href: "/daily-care", label: "오늘기록", icon: Activity },
    { href: "/residents", label: "이용자", icon: Users },
    { href: "/create", label: "통합문서", icon: Sparkles }
  ];

  const drawerSections = [
    {
      title: "오늘",
      items: [
        { href: "/dashboard", label: "홈 대시보드" },
        { href: "/daily-care", label: "오늘의 케어 (칩 입력)" },
        { href: "/create", label: "통합 문서 AI 생성" }
      ]
    },
    {
      title: "이용자",
      items: [
        { href: "/residents", label: "이용자 관리 (어르신 목록)" },
        { href: "/case-management", label: "사례관리 (욕구/위험도)" },
        { href: "/programs", label: "프로그램 관리" },
        { href: "/communications", label: "보호자 소통 & AI 알림장" }
      ]
    },
    {
      title: "운영",
      items: [
        { href: "/documents", label: "문서 자동화 (서식)" },
        { href: "/approvals", label: "승인 센터 (전자결재)" },
        { href: "/compliance", label: "평가·감사 대응" },
        { href: "/schedule", label: "일정 및 차량 송영" },
        { href: "/billing", label: "수납 및 청구" }
      ]
    },
    {
      title: "기관",
      items: [
        { href: "/staff", label: "직원 관리" },
        { href: "/reports", label: "통계 및 리포트" },
        { href: "/settings", label: "기관 설정" }
      ]
    }
  ];

  return (
    <>
      {/* Fixed Bottom Nav Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 border-t border-slate-200 bg-white lg:hidden shadow-lg">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-500",
                active && "text-sky-600 font-bold"
              )}
            >
              <Icon size={18} />
              {tab.label}
            </Link>
          );
        })}
        <button
          type="button"
          className="flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-sky-600"
          onClick={() => setOpenDrawer(true)}
        >
          <Menu size={18} />
          전체
        </button>
      </nav>

      {/* Drawer Overlay */}
      {openDrawer && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">전체 메뉴</h2>
              <button
                type="button"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                onClick={() => setOpenDrawer(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 space-y-5">
              {drawerSections.map((sec) => (
                <div key={sec.title}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-sky-600 mb-2">{sec.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {sec.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-lg bg-slate-50 p-2.5 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700"
                        onClick={() => setOpenDrawer(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
