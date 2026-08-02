"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PracticeTimelineView from "@/components/erp/PracticeTimelineView";
import PracticeGuidanceCard from "@/components/erp/PracticeGuidanceCard";
import { SocialWorkReminderEngine } from "@/lib/social-work-reminder-engine";

type SubTabKey = "cases" | "timeline" | "assessment" | "plans" | "monitoring" | "evaluations" | "conferences";

export default function CaseManagementPage() {
  const [activeTab, setActiveTab] = useState<SubTabKey>("cases");

  const reminder = SocialWorkReminderEngine.getCounselingReminder("강태호");

  const subtabs: { key: SubTabKey; label: string }[] = [
    { key: "cases", label: "📋 사례 목록" },
    { key: "timeline", label: "🧭 실천 타임라인 (Practice Timeline)" },
    { key: "assessment", label: "🩺 사정평가 (욕구·낙상·욕창·CIST)" },
    { key: "plans", label: "📝 서비스계획 (Care Plan)" },
    { key: "monitoring", label: "🔍 모니터링" },
    { key: "evaluations", label: "📊 정기 평가" },
    { key: "conferences", label: "👥 사례회의" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>사회복지사 전문 영역</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">사례관리 센터</h1>
          <p className="mt-1 text-sm text-slate-600">
            건강보험공단 장기요양 평가 기준에 따른 어르신 욕구평가, 위험도 진단, 사례회의 및 급여제공계획을 통합 관리합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Plus size={18} /> 신규 사례 등록
        </Button>
      </div>

      {/* Non-intrusive Social Work Practice Guidance Card */}
      <PracticeGuidanceCard reminder={reminder} />

      {/* Sub Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
        {subtabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg border transition ${activeTab === t.key ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        {activeTab === "timeline" && (
          <PracticeTimelineView residentName="강태호" />
        )}

        {activeTab === "cases" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">진행 중 사례</span>
                <div className="text-2xl font-black text-slate-900 mt-1">6건</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">이번달 신규 사례</span>
                <div className="text-2xl font-black text-sky-600 mt-1">2건</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">종결된 사례</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">1건</div>
              </div>
            </div>

            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                <tr>
                  <th className="p-3">어르신</th>
                  <th className="p-3">사례 유형</th>
                  <th className="p-3">담당 사회복지사</th>
                  <th className="p-3">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                <tr><td className="p-3 font-bold">강태호 어르신</td><td className="p-3">건강 악화 및 혈압 상승 대응</td><td className="p-3">박지영</td><td className="p-3"><span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sky-800 font-bold">진행중</span></td></tr>
                <tr><td className="p-3 font-bold">윤복순 어르신</td><td className="p-3">낙상 위험 집중 보행 관리</td><td className="p-3">박지영</td><td className="p-3"><span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sky-800 font-bold">진행중</span></td></tr>
                <tr><td className="p-3 font-bold">이말순 어르신</td><td className="p-3">재가 복귀 준비 케어</td><td className="p-3">김민석</td><td className="p-3"><span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-700 font-bold">종결</span></td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">어르신 사정평가 (욕구·낙상·욕창·CIST)</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-slate-900"><span>김순자 어르신 (재사정)</span><span className="text-slate-400">2026-07-15</span></div>
                <div className="text-slate-600">낙상위험: 중위험(8점) | CIST: 22점(경도인지) | 신체소근육 유연성 유지 욕구</div>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-slate-900"><span>박용식 어르신 (초기사정)</span><span className="text-slate-400">2026-07-20</span></div>
                <div className="text-slate-600">낙상위험: 고위험(14점) | 보행 미끄럼 조력 필수 소견</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">개별 급여제공계획 (Care Plan)</h2>
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 font-semibold space-y-2">
              <div className="font-bold text-sm">윤복순 어르신 낙상 예방 및 보행 안정 케어플랜</div>
              <p>주 3회 하체 근력 체조, 이동 시 요양보호사 1대1 조력, 슬리퍼 대신 미끄럼방지 양말 착용</p>
            </div>
          </div>
        )}

        {activeTab === "monitoring" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">정기 케어 모니터링 현황</h2>
            <table className="w-full text-left border-collapse border border-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-600">
                <tr><th className="p-2.5 border border-slate-200">어르신</th><th className="p-2.5 border border-slate-200">점검 항목</th><th className="p-2.5 border border-slate-200">모니터링 결과</th></tr>
              </thead>
              <tbody className="font-semibold text-slate-800">
                <tr><td className="p-2.5 border border-slate-200 font-bold">강태호 어르신</td><td className="p-2.5 border border-slate-200">혈압 및 어지럼증 추이</td><td className="p-2.5 border border-slate-200 text-emerald-700">약물 투약 후 혈압 125/82 안정화</td></tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "evaluations" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">분기별 종합 케어 평가</h2>
            <div className="p-4 border border-slate-200 rounded-xl font-semibold text-slate-800">
              2026년 2분기 어르신 케어 만족도 및 목표 달성률 평가: 평균 94점 (A등급 유지)
            </div>
          </div>
        )}

        {activeTab === "conferences" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">다학제 사례회의 회의록</h2>
            <div className="p-4 border border-slate-200 rounded-xl space-y-2">
              <div className="flex justify-between font-bold text-slate-900"><span>2026-07-30 14:00 사례회의</span><span className="text-sky-700 font-bold">예정</span></div>
              <div className="text-slate-600">참석자: 시설장, 사회복지사, 간호조무사 | 안건: 강태호 어르신 혈압 관리 방안 수립</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
