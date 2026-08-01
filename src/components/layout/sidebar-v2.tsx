"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Award,
  Building2,
  Calendar,
  CheckSquare,
  CreditCard,
  FileCheck,
  FileSpreadsheet,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PieChart,
  Settings,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

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
      { href: "/daily-care", label: "오늘의 케어", icon: Activity, badge: "필수" },
      { href: "/tasks", label: "협업 업무 센터", icon: CheckSquare, badge: "N" },
      { href: "/create", label: "통합 문서 AI", icon: Sparkles }
    ]
  },
  {
    groupName: "이용자",
    items: [
      { href: "/residents", label: "이용자 관리", icon: Users },
      { href: "/case-management", label: "사례관리", icon: FileCheck },
      { href: "/programs", label: "프로그램", icon: Activity },
      { href: "/communications", label: "보호자 소통", icon: MessageSquare }
    ]
  },
  {
    groupName: "운영",
    items: [
      { href: "/risk-center", label: "운영 리스크 센터", icon: ShieldAlert, badge: "🔴 3" },
      { href: "/documents", label: "문서 자동화", icon: FileSpreadsheet },
      { href: "/approvals", label: "승인 센터", icon: CheckSquare, badge: "5" },
      { href: "/compliance", label: "평가·감사 대응", icon: Award },
      { href: "/schedule", label: "일정·송영", icon: Calendar },
      { href: "/billing", label: "수납·청구", icon: CreditCard }
    ]
  },
  {
    groupName: "기관",
    items: [
      { href: "/staff", label: "직원·근무", icon: UserCheck },
      { href: "/reports", label: "통계·리포트", icon: PieChart },
      { href: "/settings", label: "기관 설정", icon: Settings }
    ]
  }
];

export function SidebarV2() {
  const pathname = usePathname();
  const router = useRouter();
  const [email, setEmail] = useState("사회복지사 (행복주간보호)");

  useEffect(() => {
    const raw = window.localStorage.getItem("silvercare.demoUser");
    if (raw) {
      const user = JSON.parse(raw) as { email?: string };
      if (user.email) setEmail(user.email);
    }
  }, []);

  async function logout() {
    try {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut().catch(() => {});
      }
    } catch {
      // ignore
    }
    window.localStorage.removeItem("silvercare.demoUser");
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-60 border-r border-slate-800 bg-[#0d1b2a] text-slate-200 lg:flex lg:flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 px-5 pt-5 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500 text-white font-bold shadow-md">
          <Building2 size={20} />
        </div>
        <div>
          <p className="text-base font-bold text-white tracking-tight">행복주간보호센터</p>
          <p className="text-[11px] font-semibold text-sky-400">장기요양 운영 SaaS</p>
        </div>
      </Link>

      <nav className="mt-2 flex-1 overflow-y-auto px-3 space-y-4">
        {navGroups.map((group) => (
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
        <p className="truncate text-xs font-semibold text-slate-400">{email}</p>
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
