"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  FileCheck,
  FileText,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  Zap
} from "lucide-react";

export default function SuperAdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "system" | "logs">("overview");

  const orgMetrics = {
    total: 3,
    active: 2,
    testing: 1,
    disabled: 0
  };

  const userMetrics = {
    total: 45,
    recentJoined: 6,
    activeToday: 28
  };

  const systemMetrics = {
    aiRequests: "1,240건",
    documentsGenerated: "850건",
    errorRate: "0.02%",
    apiStatus: "🟢 정상 작동중 (Operational)"
  };

  const sampleOrgs = [
    { id: "org-a", name: "기관 A (본점)", users: 15, residents: 35, status: "active", createdAt: "2026-07-15" },
    { id: "org-b", name: "기관 B (지점)", users: 8, residents: 20, status: "active", createdAt: "2026-07-28" },
    { id: "org-c", name: "기관 C (베타)", users: 4, residents: 10, status: "testing", createdAt: "2026-08-01" }
  ];

  return (
    <div className="space-y-6 text-xs max-w-6xl mx-auto py-4">
      {/* Super Admin Top Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
              👑 SaaS Super-Admin
            </Badge>
            <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
              운영자 콘솔
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            System Clock: 2026-08-02 03:07 KST
          </span>
        </div>

        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <ShieldCheck size={28} className="text-amber-400" /> ERP 서비스 전체 주간보호 센터 관제 센터
        </h1>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          고객 주간보호센터 목록, 종사자 사용자 수, AI 생성 트래픽 및 멀티테넌트 SaaS API 헬스 모니터링을 관제합니다.
        </p>

        {/* Quick Nav Links */}
        <div className="pt-2 flex flex-wrap gap-2">
          <Link href="/admin/organizations">
            <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-8 px-3">
              🏢 고객 기관 목록 관리 ➔
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="secondary" className="font-bold text-xs h-8 px-3">
              👥전체 종사자 사용자 계정 ➔
            </Button>
          </Link>
          <Link href="/admin/beta-checklist">
            <Button variant="secondary" className="font-bold text-xs h-8 px-3">
              📋 기관별 베타 준비 체크리스트 ➔
            </Button>
          </Link>
          <Link href="/import">
            <Button variant="secondary" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 px-3">
              📁 CSV 데이터 일괄 이관 ➔
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-500 block">전체 주간보호 센터</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900">{orgMetrics.total}개소</span>
            <Badge className="bg-emerald-100 text-emerald-900 font-bold">활성 {orgMetrics.active} / 테스트 {orgMetrics.testing}</Badge>
          </div>
          <span className="text-[10px] text-slate-400">Multi-tenant RLS 테넌트 정상 가동</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-500 block">전체 등록 종사자 수</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-indigo-900">{userMetrics.total}명</span>
            <Badge className="bg-sky-100 text-sky-900 font-bold">오늘 접속 {userMetrics.activeToday}명</Badge>
          </div>
          <span className="text-[10px] text-slate-400">시설장, 복지사, 간호사, 요양보호사</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-500 block">누적 AI 20종 문서 생성</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-sky-600">{systemMetrics.documentsGenerated}</span>
            <Badge className="bg-amber-100 text-amber-900 font-bold">요청 {systemMetrics.aiRequests}</Badge>
          </div>
          <span className="text-[10px] text-slate-400">Fact-Grounded Zero-Hallucination</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
          <span className="text-[11px] font-extrabold text-slate-500 block">SaaS API 및 DB 상태</span>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-black text-emerald-600">정상 가동</span>
            <Badge className="bg-emerald-100 text-emerald-900 font-bold">오류율 {systemMetrics.errorRate}</Badge>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">{systemMetrics.apiStatus}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Building2 size={16} className="text-sky-600" /> 주요 고객사 기관 현황
          </h2>
          <Link href="/admin/organizations" className="text-sky-600 font-bold text-xs hover:underline">
            전체 보기 ➔
          </Link>
        </div>

        <div className="space-y-2">
          {sampleOrgs.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 hover:bg-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-800 font-black text-xs">
                  {org.name.slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-xs">{org.name}</span>
                    <Badge className={org.status === "active" ? "bg-emerald-100 text-emerald-900 font-bold text-[10px]" : "bg-amber-100 text-amber-900 font-bold text-[10px]"}>
                      {org.status === "active" ? "🟢 운영중" : "🟠 테스트중"}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    등록일: {org.createdAt} | 테넌트 ID: <code className="font-mono text-slate-700">{org.id}</code>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <span className="font-black text-slate-900 block text-xs">{org.residents}명 / {org.users}명</span>
                  <span className="text-[10px] text-slate-400">수급자 / 종사자</span>
                </div>
                <Link href={`/admin/organizations/${org.id}`}>
                  <Button variant="secondary" className="font-bold text-[11px] h-7 px-2.5">
                    관리 ➔
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
