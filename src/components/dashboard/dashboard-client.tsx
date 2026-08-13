"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  FileSpreadsheet,
  LogOut,
  MessageSquare,
  Search,
  Sparkles,
  Truck,
  UserCheck,
  UserPlus,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoleDashboardSwitcher } from "@/components/dashboard/RoleDashboardSwitcher";
import { OnboardingChecklistWidget } from "@/components/dashboard/OnboardingChecklistWidget";
import type { Resident } from "@/data/mock-daycare-store";

export function DashboardClient() {
  const [activeSubTab, setActiveSubTab] = useState<"home" | "tasks" | "handover" | "alerts">("home");
  const [residents, setResidents] = useState<Resident[]>([]);
  const [userTasks, setUserTasks] = useState<{ id: string; name: string; category: string; time: string; status: string }[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawRes = localStorage.getItem("silvercare.residents");
      if (rawRes) {
        try {
          setResidents(JSON.parse(rawRes));
        } catch {
          setResidents([]);
        }
      }

      const rawTasks = localStorage.getItem("silvercare.tasks");
      if (rawTasks) {
        try {
          setUserTasks(JSON.parse(rawTasks));
        } catch {
          setUserTasks([]);
        }
      }
    }
  }, []);

  const attendingCount = residents.filter((r) => r.attendance === "입실").length;
  const leftCount = residents.filter((r) => r.attendance === "퇴실").length;
  const shuttleCount = residents.filter((r) => r.shuttleRoute).length;
  const cautionCount = residents.filter((r) => r.healthStatus === "건강이상" || r.healthStatus === "주의요망").length;

  const kpis = [
    {
      label: "이용 예정 인원",
      value: `${residents.length}명`,
      change: residents.length === 0 ? "등록된 이용자 없음" : "오늘 등원 대상",
      color: "text-slate-900",
      icon: Users,
      bg: "bg-sky-50 text-sky-700"
    },
    {
      label: "입실 인원",
      value: `${attendingCount}명`,
      change: residents.length === 0 ? "0%" : `출석률 ${Math.round((attendingCount / (residents.length || 1)) * 100)}%`,
      color: "text-emerald-700",
      icon: UserCheck,
      bg: "bg-emerald-50 text-emerald-700"
    },
    {
      label: "퇴실 인원",
      value: `${leftCount}명`,
      change: leftCount === 0 ? "퇴실 전" : "하원 완료",
      color: "text-slate-700",
      icon: LogOut,
      bg: "bg-slate-100 text-slate-700"
    },
    {
      label: "송영 이용",
      value: `${shuttleCount}건`,
      change: shuttleCount === 0 ? "송영 미배정" : "차량 배정 완료",
      color: "text-sky-700",
      icon: Truck,
      bg: "bg-sky-50 text-sky-700"
    },
    {
      label: "주의 관찰",
      value: `${cautionCount}명`,
      change: cautionCount === 0 ? "특이사항 없음" : "혈압/체온 관찰",
      color: "text-amber-700",
      icon: AlertTriangle,
      bg: "bg-amber-50 text-amber-700"
    }
  ];

  const quickActions = [
    { label: "일일 케어 입력", href: "/daily-care", icon: Activity },
    { label: "알림장 작성", href: "/communications", icon: MessageSquare },
    { label: "사례관리 수립", href: "/case-management", icon: FileCheck },
    { label: "프로그램 계획", href: "/programs", icon: Calendar },
    { label: "제공기록지 출력", href: "/documents", icon: FileSpreadsheet },
    { label: "수급자 검색", href: "/residents", icon: Search }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge>주간보호센터 Hands-on Beta</Badge>
            <span className="text-xs font-semibold text-slate-500">실습 모드 가동 중</span>
          </div>
          <h1 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">주간보호 사회복지사 업무 대시보드</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/daily-care">
            <Button className="bg-sky-600 hover:bg-sky-700 font-bold text-xs">
              <Activity size={16} /> 오늘의 케어 입력
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="secondary" className="font-bold text-xs">
              <Sparkles size={16} /> AI 문서 생성
            </Button>
          </Link>
        </div>
      </div>

      {/* Role Dashboard Switcher Bar */}
      <RoleDashboardSwitcher />

      {/* Onboarding Checklist Widget */}
      <OnboardingChecklistWidget />

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "home", label: "🏠 홈 대시보드" },
          { id: "tasks", label: `📋 오늘의 업무 (${userTasks.length})` },
          { id: "handover", label: "🔄 근무 인수인계 (0)" },
          { id: "alerts", label: "🔔 시스템 알림 (0)" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`px-4 py-2 text-xs font-bold rounded-lg transition border ${
              activeSubTab === tab.id
                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setActiveSubTab(tab.id as "home" | "tasks" | "handover" | "alerts")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeSubTab === "home" && (
        <div className="space-y-6">
          {/* KPI 5 Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {kpis.map((k, idx) => {
              const Icon = k.icon;
              return (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{k.label}</span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${k.bg}`}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <div className={`text-2xl font-black ${k.color}`}>{k.value}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">{k.change}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Grid */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-extrabold text-slate-900">⚡ 사회복지사 빠른 실무 바로가기</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
              {quickActions.map((act, i) => {
                const Icon = act.icon;
                return (
                  <Link
                    key={i}
                    href={act.href}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 text-center transition hover:border-sky-500 hover:bg-white hover:shadow-xs group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sky-600 shadow-2xs group-hover:scale-110 transition">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{act.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "tasks" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900">📋 오늘의 실무 업무 목록</h3>
            <Link href="/tasks">
              <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-8">
                + 신규 업무 직접 등록
              </Button>
            </Link>
          </div>

          {userTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed text-xs space-y-1">
              <p className="font-bold text-slate-600">아직 등록된 오늘 업무가 없습니다.</p>
              <p className="text-[11px] text-slate-400">
                실습 중 필요한 업무를 직접 등록하시면 개인 AI 비서가 기한과 우선순위를 챙겨드립니다.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {userTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border">
                  <div>
                    <span className="font-bold text-slate-900 text-xs">{t.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2">{t.category} · {t.time}</span>
                  </div>
                  <span className="text-xs font-bold text-sky-700">{t.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSubTab === "handover" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed text-xs space-y-2">
          <p className="font-bold text-slate-700">오늘 등록된 인수인계 특이사항이 없습니다.</p>
          <p className="text-[11px] text-slate-500">
            일일 케어 및 관찰 기록을 작성하시면 퇴근 전 인수인계 요약이 자동으로 연동됩니다.
          </p>
          <Link href="/handover">
            <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-8 mt-2">
              현장 인수인계 작성하기
            </Button>
          </Link>
        </div>
      )}

      {activeSubTab === "alerts" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed text-xs space-y-1">
          <p className="font-bold text-slate-600">현재 대기 중인 시스템 알림이 없습니다.</p>
          <p className="text-[11px] text-slate-400">모든 어르신 케어 및 행정 상태가 정상입니다.</p>
        </div>
      )}
    </div>
  );
}
