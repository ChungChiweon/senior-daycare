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
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Users,
  Zap,
  HelpCircle,
  TrendingDown
} from "lucide-react";
import { FieldBetaMeasurementEngine } from "@/lib/field-beta-measurement-engine";
import type { MeasurementType } from "@/types/field-beta-measurement";

export default function SuperAdminBetaReportPage() {
  const [activeOrgId, setActiveOrgId] = useState("org-daycare-a");
  const [activeTab, setActiveTab] = useState<MeasurementType>("field"); // "field" vs "simulated"

  const metrics = FieldBetaMeasurementEngine.calculateMetrics(activeTab);

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
              Field Beta Measurement Pack
            </Badge>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Real-time Field Metrics</span>
        </div>

        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BarChart3 size={26} className="text-amber-400" /> 현장 베타 실측 리포트 (`/admin/beta-report`)
        </h1>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
          실제 사회복지사 현장 베타(Pilot)의 업무시간 절감, 중복 입력 감소, 초안 채택률, 인간 판단 침범 신고 및 방해도를 측정합니다.
        </p>

        <div className="pt-2 flex items-center gap-3">
          <span className="font-extrabold text-sky-200 text-xs">관제 대상 기관 선택:</span>
          <select
            value={activeOrgId}
            onChange={(e) => setActiveOrgId(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-xs font-black text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="org-daycare-a">기관 A (본점)</option>
            <option value="org-daycare-b">기관 B (지점)</option>
          </select>
        </div>
      </div>

      {/* Measurement Mode Tabs: Field vs Simulated */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("field")}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 ${
              activeTab === "field"
                ? "bg-slate-900 text-amber-400 shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Activity size={16} />
            <span>[현장 실측 (Field Beta)]</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("simulated")}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs transition flex items-center gap-1.5 ${
              activeTab === "simulated"
                ? "bg-slate-900 text-sky-400 shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Sparkles size={16} />
            <span>[시뮬레이션 (Simulated)]</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500">
          * 시뮬레이션 데이터는 현장 실측 성과 지표에 합산되지 않습니다.
        </div>
      </div>

      {/* Warning for Field Data with < 3 Participants */}
      {activeTab === "field" && metrics.is_case_observation && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-600 shrink-0" />
          <span>
            ⚠️ 베타 참여자 {metrics.participant_count}명 (3명 미만)으로 통계적 성과가 아닌 <strong>사례 관찰 (Case Observation)</strong>으로 표기됩니다.
          </span>
        </div>
      )}

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 block">참여 종사자 수</span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-black text-slate-900">{metrics.participant_count}명</span>
            {metrics.is_case_observation && (
              <Badge className="bg-amber-100 text-amber-800 text-[9px] font-bold">사례 관찰</Badge>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 block">완료된 베타 업무</span>
          <span className="text-xl font-black text-slate-900">{metrics.completed_tasks_count}건</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 block">평균 완료시간 변화</span>
          <div className="flex items-baseline gap-1 text-slate-900">
            <span className="text-xl font-black">{metrics.avg_duration_erp_with_ai_sec}초</span>
            <span className="text-[10px] text-slate-400 line-through">({metrics.avg_duration_erp_only_sec}초)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 block">평균 클릭 수 변화</span>
          <div className="flex items-baseline gap-1 text-slate-900">
            <span className="text-xl font-black">{metrics.avg_clicks_erp_with_ai}회</span>
            <span className="text-[10px] text-slate-400 line-through">({metrics.avg_clicks_erp_only}회)</span>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* A/B Comparison Metrics */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <TrendingDown size={16} className="text-sky-600" /> A/B 업무 절감 항목 비교
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-700">화면 이동 횟수:</span>
              <span className="font-extrabold text-slate-900">
                {metrics.avg_navigations_erp_with_ai}회 <span className="text-slate-400 font-normal">(기존: {metrics.avg_navigations_erp_only}회)</span>
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-700">입력 문자 수 ( 자):</span>
              <span className="font-extrabold text-slate-900">
                {metrics.avg_chars_erp_with_ai}자 <span className="text-slate-400 font-normal">(기존: {metrics.avg_chars_erp_only}자)</span>
              </span>
            </div>

            <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
              <span className="font-bold text-slate-700">중복 팩트 재입력 수:</span>
              <span className="font-extrabold text-emerald-700">
                {metrics.avg_duplicate_inputs_erp_with_ai}회 <span className="text-slate-400 font-normal">(기존: {metrics.avg_duplicate_inputs_erp_only}회)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Draft Adoption Rates */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
            <FileCheck size={16} className="text-emerald-600" /> 초안 채택 · 수정 · 폐기 비율
          </h3>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="block text-[10px] text-emerald-700 font-bold">그대로 채택</span>
              <span className="text-base font-black text-emerald-900">{metrics.draft_adoption_rates.as_is}%</span>
            </div>
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg">
              <span className="block text-[10px] text-sky-700 font-bold">일부 수정 사용</span>
              <span className="text-base font-black text-sky-900">{metrics.draft_adoption_rates.modified}%</span>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="block text-[10px] text-amber-700 font-bold">대부분 수정</span>
              <span className="text-base font-black text-amber-900">{metrics.draft_adoption_rates.heavily_modified}%</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="block text-[10px] text-slate-500 font-bold">초안 폐기</span>
              <span className="text-base font-black text-slate-800">{metrics.draft_adoption_rates.dismissed}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety & Interruption Feedback Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Human Judgment Safety Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldAlert size={16} className="text-rose-600" /> 인간 판단 침범 신고 현황
            </h3>
            <Badge className={metrics.safety_issues_count === 0 ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}>
              신고 {metrics.safety_issues_count}건
            </Badge>
          </div>
          <p className="text-slate-600 text-[11px]">
            • 판단 대행 / 판단적 표현 / 주관적 유도 문항 신고 내역입니다. (목표: 0건 유지)
          </p>
        </div>

        {/* Work Interruption Feedback Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
              <Zap size={16} className="text-amber-500" /> 업무 방해도 1클릭 평가
            </h3>
            <span className="text-slate-500 text-[11px]">목표: 방해 응답 20% 미만</span>
          </div>
          <div className="flex gap-2 text-center text-xs">
            <div className="flex-1 p-2 bg-emerald-50 rounded-lg font-bold text-emerald-800">
              도움됨 {metrics.interruption_feedback_rates.helpful}%
            </div>
            <div className="flex-1 p-2 bg-slate-100 rounded-lg font-bold text-slate-700">
              차이없음 {metrics.interruption_feedback_rates.neutral}%
            </div>
            <div className="flex-1 p-2 bg-rose-50 rounded-lg font-bold text-rose-800">
              방해됨 {metrics.interruption_feedback_rates.interrupted}%
            </div>
          </div>
        </div>
      </div>

      {/* Field Interview Guide Questions (7대 현장 인터뷰 질의) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
          <MessageSquare size={16} className="text-indigo-600" /> 현장 사회복지사 7대 인터뷰 가이드
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
          <div className="p-2.5 bg-slate-50 rounded-lg border">1. 실제로 줄어든 업무는 무엇인가?</div>
          <div className="p-2.5 bg-slate-50 rounded-lg border">2. 오히려 늘어난 업무는 무엇인가?</div>
          <div className="p-2.5 bg-slate-50 rounded-lg border">3. 가장 자주 사용한 비서 기능은 무엇인가?</div>
          <div className="p-2.5 bg-slate-50 rounded-lg border">4. 믿기 어려웠던 초안은 무엇인가?</div>
          <div className="p-2.5 bg-slate-50 rounded-lg border">5. AI가 침범한다고 느낀 순간이 있었는가?</div>
          <div className="p-2.5 bg-slate-50 rounded-lg border">6. 없으면 불편할 정도로 유용한 기능은 무엇인가?</div>
          <div className="p-2.5 bg-slate-50 rounded-lg border col-span-1 sm:col-span-2">7. 제거해야 할 기능은 무엇인가?</div>
        </div>
      </div>
    </div>
  );
}
