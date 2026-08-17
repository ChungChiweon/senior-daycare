"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckSquare,
  CreditCard,
  FileCheck,
  FileSpreadsheet,
  Flag,
  GraduationCap,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  MessageSquare,
  PieChart,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Upload,
  UserCheck,
  UserPlus,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useCurrentUser } from "@/hooks/use-auth-org";
import { useOrganizationProfile } from "@/hooks/use-organization-profile";
import { facilityTypeLabel } from "@/types/organization";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
};

type NavGroup = {
  groupName: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    groupName: "오늘",
    items: [
      { href: "/dashboard", label: "홈", icon: LayoutDashboard },
      { href: "/handover", label: "현장 인수인계", icon: Smartphone },
      { href: "/daily-care", label: "오늘의 케어", icon: Activity },
      { href: "/tasks", label: "협업 업무 센터", icon: CheckSquare },
      { href: "/create", label: "통합 문서 AI", icon: Sparkles }
    ]
  },
  {
    groupName: "이용자",
    items: [
      { href: "/residents", label: "이용자 관리", icon: Users },
      { href: "/import", label: "CSV 일괄 이관", icon: Upload },
      { href: "/case-management", label: "사례관리", icon: FileCheck },
      { href: "/programs", label: "프로그램", icon: Activity },
      { href: "/communications", label: "보호자 소통", icon: MessageSquare }
    ]
  },
  {
    groupName: "운영",
    items: [
      { href: "/calendar", label: "운영 캘린더", icon: Calendar },
      { href: "/risk-center", label: "운영 리스크 센터", icon: ShieldAlert },
      { href: "/documents", label: "문서 자동화", icon: FileSpreadsheet },
      { href: "/approvals", label: "승인 센터", icon: CheckSquare },
      { href: "/compliance", label: "평가·감사 대응", icon: Award },
      { href: "/schedule", label: "일정·송영", icon: Calendar },
      { href: "/billing", label: "수납·청구", icon: CreditCard }
    ]
  },
  {
    groupName: "기관",
    items: [
      { href: "/admin/beta-program", label: "베타 파일럿 관제", icon: Flag },
      { href: "/training", label: "직원 교육 모드", icon: GraduationCap },
      { href: "/feedback", label: "현장 피드백", icon: MessageSquare },
      { href: "/admin", label: "SaaS 슈퍼어드민", icon: ShieldCheck },
      { href: "/admin/beta-report", label: "베타 분석 리포트", icon: BarChart3 },
      { href: "/admin/support", label: "고객 지원 센터", icon: LifeBuoy },
      { href: "/staff/invite", label: "직원 초대", icon: UserPlus },
      { href: "/onboarding", label: "기관 온보딩", icon: Building2 },
      { href: "/staff", label: "직원·근무", icon: UserCheck },
      { href: "/reports", label: "통계·리포트", icon: PieChart },
      { href: "/settings", label: "기관 설정", icon: Settings }
    ]
  }
];

export function SidebarV2() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const orgState = useOrganizationProfile();
  const [email, setEmail] = useState("");

  const isManagerOrAdmin = ["facility_manager", "organization_admin", "manager", "superadmin"].includes(orgState.role ?? "");

  const visibleNavGroups = navGroups.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (item.href.startsWith("/admin") && !isManagerOrAdmin) return false;
      return true;
    })
  })).filter((group) => group.items.length > 0);

  useEffect(() => {
    // 로그인 사용자 이메일 표시
    const raw = window.localStorage.getItem("silvercare.demoUser");
    if (raw) {
      try {
        const user = JSON.parse(raw) as { email?: string };
        if (user.email) setEmail(user.email);
      } catch { /* ignore */ }
    }
    if (!email && currentUser?.name) setEmail(currentUser.name);
  }, [currentUser, email]);

  async function logout() {
    try {
      const supabase = createClient();
      if (supabase) await supabase.auth.signOut().catch(() => {});
    } catch { /* ignore */ }
    window.localStorage.removeItem("silvercare.demoUser");
    router.push("/login");
  }

  // ── 기관 정보 렌더 ─────────────────────────────────────────────────────────
  const org = orgState.org;
  const orgName = org?.name ?? (orgState.status === "missing" ? "소속 기관이 설정되지 않았습니다." : "로딩 중...");
  const orgSubtitle = org ? facilityTypeLabel(org.facility_type) : "장기요양 운영 SaaS";
  const logoUrl = org?.logo_url;

  return (
    <aside className="sticky top-0 hidden h-screen w-60 border-r border-slate-800 bg-[#0d1b2a] text-slate-200 lg:flex lg:flex-col">
      {/* 기관 로고 + 이름 */}
      <Link href="/dashboard" className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white font-bold shadow-md overflow-hidden">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={orgName}
              fill
              sizes="36px"
              className="object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <Building2 size={20} />
          )}
        </div>
        <div className="min-w-0">
          <p
            className={cn(
              "text-base font-bold tracking-tight truncate",
              orgState.status === "missing" ? "text-amber-400" : "text-white"
            )}
            title={orgName}
          >
            {orgName}
          </p>
          <p className="text-[11px] font-semibold text-sky-400 truncate">{orgSubtitle}</p>
        </div>
      </Link>

      {/* 소속 기관 없음 경고 */}
      {orgState.status === "missing" && (
        <div className="mx-3 mb-2 rounded-md bg-amber-900/40 border border-amber-700/50 px-3 py-2 text-[11px] text-amber-300">
          기관 설정이 필요합니다.{" "}
          <Link href="/settings" className="underline hover:text-amber-100">설정하기 →</Link>
        </div>
      )}

      <nav className="mt-2 flex-1 overflow-y-auto px-3 space-y-4">
        {visibleNavGroups.map((group) => (
          <div key={group.groupName}>
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {group.groupName}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex h-9 items-center justify-between rounded-md px-3 text-xs font-semibold transition hover:bg-slate-800 hover:text-white",
                      active ? "bg-sky-600 text-white font-bold shadow-sm" : "text-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={16} className={active ? "text-white" : "text-slate-400"} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", active ? "bg-white/20 text-white" : "bg-sky-500/20 text-sky-300")}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <p className="truncate text-xs font-semibold text-slate-400">{email || currentUser?.name}</p>
        <button
          type="button"
          className="mt-2 flex h-8 w-full items-center gap-2 rounded-md px-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
          onClick={logout}
        >
          <LogOut size={14} />
          로그아웃
        </button>
      </div>
    </aside>
  );
}
