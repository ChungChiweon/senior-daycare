"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Badge
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Flag,
  Layers
} from "lucide-react";

type BetaInstitutionStatus =
  | "recruiting"
  | "preparing"
  | "onboarding"
  | "operating"
  | "completed"
  | "converted";

type BetaInstitution = {
  id: string;
  name: string;
  status: BetaInstitutionStatus;
  statusLabel: string;
  managerName: string;
  startDate: string;
  testPeriodWeeks: number;
  currentWeek: number;
  capacity: number;
  keyIssue: string;
  satisfactionScore: number; // 1-5
};

export default function SuperAdminBetaProgramPage() {
  const [institutions, setInstitutions] = useState<BetaInstitution[]>([
    {
      id: "org-daycare-a",
      name: "기관 A (본점)",
      status: "operating",
      statusLabel: "🔵 파일럿 3주차 가동중",
      managerName: "김철수 시설장",
      startDate: "2026-07-15",
      testPeriodWeeks: 4,
      currentWeek: 3,
      capacity: 35,
      keyIssue: "요양보호사 모바일 케어 터치 1-Tap 반응 속도 개선 요청",
      satisfactionScore: 4.8
    },
    {
      id: "org-daycare-b",
      name: "기관 B (지점)",
      status: "onboarding",
      statusLabel: "🟠 파일럿 1주차 온보딩",
      managerName: "이강남 원장님",
      startDate: "2026-07-28",
      testPeriodWeeks: 4,
      currentWeek: 1,
      capacity: 20,
      keyIssue: "CSV 수급자 20명 일괄 업로드 파싱 매핑 검수 진행중",
      satisfactionScore: 4.2
    },
    {
      id: "org-daycare-c",
      name: "미소시니어 데이케어 (분당점)",
      status: "preparing",
      statusLabel: "🟡 사전 준비 (Week 0)",
      managerName: "박미소 센터장",
      startDate: "2026-08-05",
      testPeriodWeeks: 4,
      currentWeek: 0,
      capacity: 25,
      keyIssue: "사회복지사 10분 튜토리얼 교육 예정",
      satisfactionScore: 4.0
    }
  ]);

  const weekTimeline = [
    { week: 0, label: "Week 0 사전준비", desc: "기관생성, 계정/권한, CSV 수급자 이관, 문서 템플릿" },
    { week: 1, label: "Week 1 기본적응", desc: "로그인율 90%, 이용자 조회, 케어 기록 팩트 접수" },
    { week: 2, label: "Week 2 업무전환", desc: "AI 20종 문서 생성, 수정 및 전자 결재 1-Tap 서명" },
    { week: 3, label: "Week 3 운영안정화", desc: "미완료 기록 차단, 협업 전환, 팩트 모순 충돌 해결" },
    { week: 4, label: "Week 4 평가/전환", desc: "시간 절감 측정, Exit 인터뷰, 정식 SaaS 전환 결정" }
  ];

  function getStatusBadge(status: BetaInstitutionStatus) {
    switch (status) {
      case "converted":
        return <Badge className="bg-emerald-100 text-emerald-900 font-bold">🟢 정식 SaaS 전환 완료</Badge>;
      case "operating":
        return <Badge className="bg-sky-100 text-sky-900 font-bold">🔵 파일럿 실전 가동중</Badge>;
      case "onboarding":
        return <Badge className="bg-amber-100 text-amber-900 font-bold">🟠 온보딩 진행중</Badge>;
      case "preparing":
        return <Badge className="bg-yellow-100 text-yellow-900 font-bold">🟡 사전 준비 (Week 0)</Badge>;
      case "completed":
        return <Badge className="bg-purple-100 text-purple-900 font-bold">🟣 파일럿 평가 완료</Badge>;
      case "recruiting":
        return <Badge className="bg-slate-100 text-slate-900 font-bold">⚪ 모집 예정</Badge>;
    }
  }

  return (
    <div className="space-y-6 text-xs max-w-6xl mx-auto py-4">
      {/* Super Admin Top Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
              👑 Beta Cohort Admin
            </Badge>
            <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
              파일럿 운영 관제
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">1st Pilot Program 2026</span>
        </div>

        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Flag size={28} className="text-amber-400" /> 주간보호 센터 베타 파일럿 프로그램 관제 센터 (`/admin/beta-program`)
        </h1>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          참여 주간보호센터별 모집 ➔ 사전준비 ➔ 온보딩 ➔ 4주 파일럿 가동 ➔ Exit 인터뷰 ➔ 정식 SaaS 전환을 관제합니다.
        </p>

        <div className="pt-2 flex flex-wrap gap-2">
          <Link href="/admin/beta-program/apply">
            <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-8 px-3 flex items-center gap-1">
              <CheckCircle2 size={14} />
              <span>+ 신규 베타 기관 자격 진단 평가 ➔</span>
            </Button>
          </Link>
          <Link href="/admin/beta-checklist">
            <Button variant="secondary" className="font-bold text-xs h-8 px-3">
              📋 5단계 온보딩 체크리스트 ➔
            </Button>
          </Link>
          <Link href="/admin/beta-report">
            <Button variant="secondary" className="font-bold text-xs h-8 px-3">
              📊 파일럿 KPI 및 정식 전환 판정 ➔
            </Button>
          </Link>
        </div>
      </div>

      {/* 4-Week Timeline Process Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Clock size={16} className="text-sky-600" /> 첫 4주 파일럿 운영 타임라인 표준 프로세스
        </h2>

        <div className="grid gap-3 sm:grid-cols-5">
          {weekTimeline.map((wt) => (
            <div key={wt.week} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-xs">{wt.label}</span>
                <Badge className="bg-sky-100 text-sky-900 font-bold text-[9px]">Standard</Badge>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">{wt.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Beta Institutions List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Layers size={16} className="text-indigo-600" /> 파일럿 참여 고객사 현황 ({institutions.length}개소)
          </h2>
          <span className="text-[11px] text-slate-400 font-bold">평균 만족도: ⭐ 4.3 / 5.0</span>
        </div>

        <div className="space-y-3">
          {institutions.map((inst) => (
            <div
              key={inst.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 hover:bg-white transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{inst.name}</span>
                  {getStatusBadge(inst.status)}
                </div>
                <div className="flex items-center gap-3 text-right">
                  <span className="text-[11px] font-bold text-amber-600">⭐ {inst.satisfactionScore} / 5.0</span>
                  <span className="text-[11px] text-slate-500">시작일: {inst.startDate}</span>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3 text-xs">
                <div>
                  <span className="font-extrabold text-slate-500 block text-[10px]">대표 관리자 & 정원</span>
                  <span className="font-bold text-slate-900">{inst.managerName} (어르신 {inst.capacity}명)</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-500 block text-[10px]">현재 진행 주차</span>
                  <span className="font-black text-sky-600">{inst.currentWeek}주차 진행중 ({inst.testPeriodWeeks}주 파일럿)</span>
                </div>
                <div>
                  <span className="font-extrabold text-slate-500 block text-[10px]">주요 관리 이슈</span>
                  <span className="font-medium text-slate-700 line-clamp-1">{inst.keyIssue}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Link href="/admin/beta-checklist">
                  <Button variant="secondary" className="font-bold text-[11px] h-7 px-3">
                    온보딩 체크리스트 ➔
                  </Button>
                </Link>
                <Link href="/admin/beta-report">
                  <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] h-7 px-3">
                    4주 KPI 및 정식 전환 판정 ➔
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
