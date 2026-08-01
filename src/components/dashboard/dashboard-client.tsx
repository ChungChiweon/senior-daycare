"use client";

import { useState } from "react";
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
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoleDashboardSwitcher } from "@/components/dashboard/RoleDashboardSwitcher";

export function DashboardClient() {
  const [activeSubTab, setActiveSubTab] = useState<"home" | "tasks" | "handover" | "alerts">("home");

  const kpis = [
    { label: "이용 예정 인원", value: "12명", change: "오늘 등원 대상", color: "text-slate-900", icon: Users, bg: "bg-sky-50 text-sky-700" },
    { label: "입실 인원", value: "9명", change: "출석률 75%", color: "text-emerald-700", icon: UserCheck, bg: "bg-emerald-50 text-emerald-700" },
    { label: "퇴실 인원", value: "2명", change: "송영 1차 출발", color: "text-slate-700", icon: LogOut, bg: "bg-slate-100 text-slate-700" },
    { label: "송영 진행", value: "3건", change: "1호차, 2호차 운행중", color: "text-sky-700", icon: Truck, bg: "bg-sky-50 text-sky-700" },
    { label: "건강 이상", value: "2명", change: "혈압/체온 관찰", color: "text-amber-700", icon: AlertTriangle, bg: "bg-amber-50 text-amber-700" }
  ];

  const todayTasks = [
    { id: "t1", name: "김순자 어르신 케어 기록 작성", category: "일일 케어", time: "09:00", status: "미작성", color: "bg-amber-100 text-amber-800" },
    { id: "t2", name: "이용자 가족 (이철수) 상담", category: "상담 일정", time: "10:00", status: "예정", color: "bg-sky-100 text-sky-800" },
    { id: "t3", name: "제공기록지 일괄 검토 및 승인", category: "승인 센터", time: "10:30", status: "대기", color: "bg-purple-100 text-purple-800" },
    { id: "t4", name: "8월 월간 프로그램 계획서 수립", category: "프로그램", time: "11:00", status: "완료", color: "bg-emerald-100 text-emerald-800" },
    { id: "t5", name: "박용식 어르신 보호자 알림장 발송", category: "보호자 소통", time: "16:00", status: "완료", color: "bg-emerald-100 text-emerald-800" }
  ];

  const handovers = [
    { icon: "⚠️", title: "특이사항 관찰", desc: "박용식 어르신: 미열(37.2℃) 관찰 필요, 보행 시 미끄럼 조력", time: "08:50" },
    { icon: "💊", title: "투약 및 간호", desc: "김순자 어르신: 고혈압약 식후 즉시 복용 완료", time: "09:15" },
    { icon: "👤", title: "보호자 특별 요청", desc: "정동진 어르신 보호자: 오후 수면 30분 관찰 및 사진 요청", time: "09:30" },
    { icon: "📋", title: "미완료 서류 업무", desc: "급여제공기록지 3건 미작성, 3분기 욕구평가 1건 서명대기", time: "10:00" }
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
            <Badge>행복주간보호센터</Badge>
            <span className="text-xs font-semibold text-slate-500">2026년 7월 30일 (목)</span>
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

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: "home", label: "🏠 홈 대시보드" },
          { id: "tasks", label: "📋 오늘의 업무 (5)" },
          { id: "handover", label: "🔄 근무 인수인계 (4)" },
          { id: "alerts", label: "🔔 시스템 알림 (3)" }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`px-4 py-2 text-xs font-bold rounded-lg transition border ${activeSubTab === tab.id ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            onClick={() => setActiveSubTab(tab.id as "home" | "tasks" | "handover" | "alerts")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeSubTab === "home" && (
        <>
          {/* Top 5 KPI Cards */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{kpi.label}</span>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.bg}`}>
                      <Icon size={18} />
                    </div>
                  </div>
                  <div className={`mt-2 text-2xl font-black ${kpi.color}`}>{kpi.value}</div>
                  <span className="text-[11px] font-semibold text-slate-400 mt-1 block">{kpi.change}</span>
                </div>
              );
            })}
          </div>

          {/* Main 2 Column Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left 2 Cols: Today's Tasks & Handover */}
            <div className="space-y-6 lg:col-span-2">
              {/* Today's Tasks Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="text-sky-600" size={18} /> 오늘의 주요 업무
                  </h2>
                  <button
                    type="button"
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-0.5"
                    onClick={() => setActiveSubTab("tasks")}
                  >
                    전체보기 <ChevronRight size={14} />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 mt-2">
                  {todayTasks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between py-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="h-2 w-2 rounded-full bg-sky-500"></span>
                        <span className="font-bold text-slate-900">{t.name}</span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 font-semibold">{t.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400 font-mono">{t.time}</span>
                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${t.color}`}>{t.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Handover Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    🔄 근무 인수인계 요약
                  </h2>
                  <button
                    type="button"
                    className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-0.5"
                    onClick={() => setActiveSubTab("handover")}
                  >
                    전체보기 <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-3 mt-3">
                  {handovers.map((h, idx) => (
                    <div key={idx} className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex items-start gap-3 text-xs">
                      <span className="text-lg">{h.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{h.title}</span>
                          <span className="text-[11px] font-mono text-slate-400">{h.time}</span>
                        </div>
                        <p className="text-slate-600 font-semibold mt-1">{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Analytics Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Donut Chart Mock */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">이용자 건강 상태 분포</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 via-amber-400 to-sky-500 p-3 shadow-inner">
                      <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-white text-center">
                        <span className="text-base font-black text-slate-900">12명</span>
                        <span className="text-[9px] font-bold text-slate-400">전체</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-xs font-semibold">
                      <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>양호 8명 (67%)</div>
                      <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>주의 2명 (17%)</div>
                      <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>건강이상 1명 (8%)</div>
                      <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>미입실 1명 (8%)</div>
                    </div>
                  </div>
                </div>

                {/* Program Status */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">당일 프로그램 일정</h3>
                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between p-2 rounded-lg bg-sky-50 border border-sky-100 text-sky-900">
                      <span>오전 건강체조</span>
                      <span className="font-bold">완료 (11명)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900">
                      <span>오후 칠교놀이</span>
                      <span className="font-bold">진행중 (9명)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      <span>원예치료 화분</span>
                      <span className="font-bold">15:30 예정</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Quick Actions & Notification Center */}
            <div className="space-y-6">
              {/* Quick Action Grid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">⚡ 빠른 실행 (Quick Actions)</h2>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((qa) => {
                    const QIcon = qa.icon;
                    return (
                      <Link
                        key={qa.label}
                        href={qa.href}
                        className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-700 transition"
                      >
                        <QIcon size={20} className="text-sky-600" />
                        {qa.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Notification Center */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Bell size={16} className="text-sky-600" /> 시스템 알림 센터
                  </h2>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">5건 미확인</span>
                </div>
                <div className="space-y-2 text-xs font-semibold">
                  <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                    <span className="font-bold block mb-0.5">⚠️ 건강 이상 발생 알림</span>
                    박용식 어르신 체온 37.2℃ 기록 (간호팀 확인)
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900">
                    <span className="font-bold block mb-0.5">📑 승인 대기 알림</span>
                    급여제공기록지 12건 결재 상신되었습니다.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                    <span className="font-bold block mb-0.5">💬 보호자 메시지 수신</span>
                    이철수 보호자: 오늘 송영 출발 10분 전 연락 요청
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeSubTab === "tasks" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">오늘의 업무 목록 상세</h2>
          <div className="divide-y divide-slate-100 text-xs">
            {todayTasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 text-sm">{t.name}</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 font-semibold">{t.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-mono">{t.time}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${t.color}`}>{t.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "handover" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">근무 인수인계 이력</h2>
          <div className="space-y-3">
            {handovers.map((h, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold">
                <div className="flex justify-between items-center text-slate-900 font-bold text-sm">
                  <span>{h.icon} {h.title}</span>
                  <span className="text-slate-400 font-mono text-xs">{h.time}</span>
                </div>
                <p className="mt-2 text-slate-700">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === "alerts" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">시스템 전체 알림</h2>
          <p className="text-xs text-slate-500">최근 발생한 케어, 결재, 송영 및 알림장 전송 상태 로그입니다.</p>
        </div>
      )}
    </div>
  );
}
