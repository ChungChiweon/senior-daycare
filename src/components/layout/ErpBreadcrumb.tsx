"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  dashboard: "홈 대시보드",
  dailycare: "오늘의 케어",
  "daily-care": "오늘의 케어",
  create: "통합 문서 AI (20종)",
  handover: "현장 인수인계 📱",
  tasks: "협업 업무 센터 ⚡",
  calendar: "운영 캘린더 🗓️",
  residents: "이용자 관리",
  "case-management": "사례관리 & 케어플랜",
  programs: "프로그램 관리",
  communications: "보호자 소통 & 알림장",
  "risk-center": "운영 리스크 센터 🔴",
  documents: "문서 자동화",
  approvals: "전자 결재 센터 ✍️",
  compliance: "평가·감사 대응",
  schedule: "일정 & 송영 노선",
  billing: "수납 & 급여 청구",
  staff: "직원 & 근태 관리",
  reports: "센터 통계 & 리포트",
  settings: "기관 정보 설정",
  saved: "문서 보관함"
};

export function ErpBreadcrumb() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/dashboard") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold py-1">
        <Home size={13} className="text-sky-600" />
        <span>주간보호 통합 ERP</span>
        <ChevronRight size={12} className="text-slate-300" />
        <span className="text-slate-900 font-extrabold">홈 대시보드</span>
      </div>
    );
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-bold py-1 overflow-x-auto">
      <Link href="/dashboard" className="flex items-center gap-1 hover:text-sky-700 transition shrink-0">
        <Home size={13} className="text-sky-600" />
        <span>홈</span>
      </Link>

      {segments.map((segment, index) => {
        const url = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;
        const label = ROUTE_LABELS[segment] || (segment.startsWith("res-") ? "이용자 상세" : segment);

        return (
          <div key={url} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight size={12} className="text-slate-300" />
            {isLast ? (
              <span className="text-slate-900 font-extrabold">{label}</span>
            ) : (
              <Link href={url} className="hover:text-sky-700 transition">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
