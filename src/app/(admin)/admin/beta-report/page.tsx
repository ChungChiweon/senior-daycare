"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  PieChart,
  ShieldAlert,
  Sparkles,
  Users,
  Zap
} from "lucide-react";

export default function SuperAdminBetaReportPage() {
  const [activeOrgId, setActiveOrgId] = useState("org-daycare-a");

  const reports: Record<
    string,
    {
      orgName: string;
      activeUsers: number;
      totalStaff: number;
      recordsCreated: number;
      tasksConverted: number;
      aiDocsGenerated: number;
      pendingRecords: number;
      conflictCount: number;
      approvalDelayHours: number;
      errorsCount: number;
      feedbackSubmitted: number;
    }
  > = {
    "org-daycare-a": {
      orgName: "행복주간보호센터 A (본점)",
      activeUsers: 14,
      totalStaff: 15,
      recordsCreated: 420,
      tasksConverted: 38,
      aiDocsGenerated: 185,
      pendingRecords: 2,
      conflictCount: 1,
      approvalDelayHours: 0.8,
      errorsCount: 0,
      feedbackSubmitted: 4
    },
    "org-daycare-b": {
      orgName: "행복주간보호센터 B (강남점)",
      activeUsers: 6,
      totalStaff: 8,
      recordsCreated: 190,
      tasksConverted: 12,
      aiDocsGenerated: 70,
      pendingRecords: 5,
      conflictCount: 0,
      approvalDelayHours: 1.5,
      errorsCount: 1,
      feedbackSubmitted: 2
    }
  };

  const currentReport = reports[activeOrgId] || reports["org-daycare-a"];

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto py-4">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
              👑 Super-Admin Analytics
            </Badge>
            <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
              기관 품질 지표
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Real-time Analytics Engine</span>
        </div>

        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BarChart3 size={26} className="text-amber-400" /> 주간보호 센터 베타 실전 운영 분석 리포트 (`/admin/beta-report`)
        </h1>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          고객 센터별 종사자 활성율, 관찰 케어 기록 수, AI 문서 생성 트래픽 및 관찰 팩트 모순 충돌(Conflict) 지표를 관제합니다.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <span className="font-extrabold text-sky-200 text-xs">관제 대상 기관 선택:</span>
          <select
            value={activeOrgId}
            onChange={(e) => setActiveOrgId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs font-black text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="org-daycare-a">행복주간보호센터 A (활성 사용자 93%)</option>
            <option value="org-daycare-b">행복주간보호센터 B (활성 사용자 75%)</option>
          </select>
        </div>
      </div>

      {/* Section 1: Usage Metrics */}
      <div className="space-y-3">
        <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
          <Users size={16} className="text-sky-600" /> 1. 센터 사용 현황 (Usage Metrics)
        </h2>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">활성 종사자 비율</span>
            <span className="text-2xl font-black text-slate-900">
              {currentReport.activeUsers}명 / {currentReport.totalStaff}명
            </span>
            <Badge className="bg-emerald-100 text-emerald-900 font-bold">
              활성율 {Math.round((currentReport.activeUsers / currentReport.totalStaff) * 100)}%
            </Badge>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">누적 케어 기록 수</span>
            <span className="text-2xl font-black text-indigo-900">{currentReport.recordsCreated}건</span>
            <span className="text-[10px] text-slate-400 font-bold block">1-Tap 관찰 접수</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">협업 업무 전환 수</span>
            <span className="text-2xl font-black text-sky-600">{currentReport.tasksConverted}건</span>
            <span className="text-[10px] text-slate-400 font-bold block">현장 ➔ 간호/복지 전환</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">AI 20종 문서 생성</span>
            <span className="text-2xl font-black text-emerald-600">{currentReport.aiDocsGenerated}건</span>
            <span className="text-[10px] text-slate-400 font-bold block">Fact-Grounded</span>
          </div>
        </div>
      </div>

      {/* Section 2: Quality Metrics */}
      <div className="space-y-3">
        <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
          <ShieldAlert size={16} className="text-amber-600" /> 2. 서비스 품질 및 안전 지표 (Quality Metrics)
        </h2>

        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">관찰 팩트 충돌(Conflict)</span>
            <span className="text-2xl font-black text-amber-600">{currentReport.conflictCount}건</span>
            <Badge className="bg-amber-100 text-amber-900 font-bold">AI 승인 보장 경고</Badge>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">평균 결재 대기 시간</span>
            <span className="text-2xl font-black text-slate-900">{currentReport.approvalDelayHours}시간</span>
            <span className="text-[10px] text-slate-400 font-bold block">시설장 1-Tap 서명</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">미완료 케어 기록</span>
            <span className="text-2xl font-black text-slate-700">{currentReport.pendingRecords}건</span>
            <span className="text-[10px] text-slate-400 font-bold block">당일 보완 예정</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">시스템 오류 발생</span>
            <span className="text-2xl font-black text-emerald-600">{currentReport.errorsCount}건</span>
            <Badge className="bg-emerald-100 text-emerald-900 font-bold">안정성 100%</Badge>
          </div>
        </div>
      </div>

      {/* Section 3: Time Savings & Impact Metrics */}
      <div className="space-y-3">
        <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-200 pb-2">
          <Zap size={16} className="text-emerald-600" /> 3. 행정시간 절감 체감 지표 (Impact Metrics)
        </h2>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">일일 행정시간 단축</span>
            <span className="text-2xl font-black text-emerald-600">하루 110분 절감</span>
            <span className="text-[10px] text-slate-400 font-bold block">사회복지사 1인당 (2시간 ➔ 10분)</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">AI 생성 문안 직접 수정률</span>
            <span className="text-2xl font-black text-sky-600">4.2%</span>
            <span className="text-[10px] text-slate-400 font-bold block">Zero-Hallucination 95.8% 적합</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-1">
            <span className="text-[11px] font-extrabold text-slate-500 block">기존 종이/카톡 구두 수검 감소</span>
            <span className="text-2xl font-black text-indigo-900">85% 대체 완료</span>
            <span className="text-[10px] text-slate-400 font-bold block">1-Tap 디지털 수검 완비</span>
          </div>
        </div>
      </div>

      {/* Section 4: Exit Satisfaction & Conversion Decision */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
          <div>
            <h2 className="text-base font-black text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 size={20} className="text-emerald-600" /> 4. 베타 파일럿 최종 평가 및 정식 SaaS 전환 판정
            </h2>
            <span className="text-xs text-emerald-800 font-medium">
              4주간의 현장 데이터, 직종별 Exit 인터뷰 및 KPI를 종합한 최종 판정입니다.
            </span>
          </div>
          <Badge className="bg-emerald-600 text-white font-black text-sm px-3 py-1">
            🟢 정식 SaaS 전환 확정
          </Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl bg-white p-3 border border-emerald-200 space-y-1">
            <span className="font-extrabold text-slate-500 block text-[10px]">시설장 총괄 만족도</span>
            <span className="font-black text-slate-900 text-sm">⭐ 4.9 / 5.0</span>
            <span className="text-[10px] text-emerald-700 font-bold block">"전자 결재 서명 및 서류 수검 시간 획기적 단축"</span>
          </div>

          <div className="rounded-xl bg-white p-3 border border-emerald-200 space-y-1">
            <span className="font-extrabold text-slate-500 block text-[10px]">사회복지사 문서 만족도</span>
            <span className="font-black text-slate-900 text-sm">⭐ 4.8 / 5.0</span>
            <span className="text-[10px] text-emerald-700 font-bold block">"20종 AI 급여 제공 기록 자동화 극찬"</span>
          </div>

          <div className="rounded-xl bg-white p-3 border border-emerald-200 space-y-1">
            <span className="font-extrabold text-slate-500 block text-[10px]">베타 종료 후 유료 구독 의향</span>
            <span className="font-black text-emerald-900 text-sm">100% 지속 이용 의향</span>
            <span className="text-[10px] text-emerald-700 font-bold block">정식 SaaS 계약서 전달 완료</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="secondary" className="font-bold text-xs h-9 px-4">
            개선 후 재테스트 판정
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs h-9 px-5 shadow-md">
            🎉 정식 SaaS 전환 유료 계약 완료 ➔
          </Button>
        </div>
      </div>
    </div>
  );
}
