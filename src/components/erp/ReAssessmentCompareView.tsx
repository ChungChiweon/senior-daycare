"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Columns, FileText, Sparkles, Zap } from "lucide-react";
import type { NeedsAssessment } from "@/types/social-work-practice";

type ReAssessmentCompareViewProps = {
  residentName: string;
  prevAssessment: NeedsAssessment;
  currAssessment: NeedsAssessment;
  onSaveInterpretation: (interpretation: string, planReviewNeeded: boolean) => void;
};

export default function ReAssessmentCompareView({
  residentName,
  prevAssessment,
  currAssessment,
  onSaveInterpretation
}: ReAssessmentCompareViewProps) {
  const [interpretation, setInterpretation] = useState(
    "최근 기록된 식사 섭취 관찰 팩트를 기반으로 수저 사용 보조 및 개별 케어목표 재검토를 진행함."
  );
  const [planReviewNeeded, setPlanReviewNeeded] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Pre-loaded facts from system repository (0 duplicate re-typing)
  const preloadedSystemFacts = [
    "일일 케어 관찰: 점심 식사 섭취 둔화 및 물 섭취 권유 관찰됨 (2026.04.10)",
    "기존 서비스 목표: 신체 잔존기능 유지 및 수저 사용 서포트 (활성 중)",
    "이전 사정일자: 2025.10.15 (김사회 복지사 작성)"
  ];

  const aiFactSummary = `[AI 팩트 자동 차이 요약 - 재입력 0회]
• 신체 욕구: 이전 "자가 식사 가능" ➔ 현재 "보조 필요 및 반상 식사"
• 인지 욕구: 이전 "단기 기억 정상" ➔ 현재 "프로그램 시 반복 안내 요구"
• 사회관계: 이전 "소극 참여" ➔ 현재 "원예 프로그램 선호 표출"`;

  const categories = [
    { title: "1. 신체적 욕구", prev: prevAssessment.physical_needs, curr: currAssessment.physical_needs },
    { title: "2. 인지적 욕구", prev: prevAssessment.cognitive_needs, curr: currAssessment.cognitive_needs },
    { title: "3. 정서적 욕구", prev: prevAssessment.emotional_needs, curr: currAssessment.emotional_needs },
    { title: "4. 가족 욕구", prev: prevAssessment.family_needs, curr: currAssessment.family_needs },
    { title: "5. 사회적 관계 욕구", prev: prevAssessment.social_relationship_needs, curr: currAssessment.social_relationship_needs },
    { title: "6. 환경적 욕구", prev: prevAssessment.environment_needs, curr: currAssessment.environment_needs }
  ];

  const handleSave = () => {
    onSaveInterpretation(interpretation, planReviewNeeded);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white font-bold text-[10px]">자동 준비 재사정 대조</Badge>
            <span className="text-xs text-slate-500 font-semibold">이전 vs 현재 6대 욕구사정 Side-by-Side</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            <Columns size={20} className="text-indigo-600" /> [{residentName} 어르신] 재사정 자동 대조 (중복 입력 0회)
          </h2>
        </div>
        <Badge className="bg-slate-900 text-white font-bold text-[10px]">
          ⚡ 기존 데이터 100% 프리로드
        </Badge>
      </div>

      {/* Preloaded System Facts Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
        <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
          <Zap size={14} className="text-amber-500" />
          <span>시스템 자동 불러온 기존 데이터 (재입력 0회)</span>
        </div>
        <ul className="text-xs space-y-1 text-slate-600 font-medium pl-1">
          {preloadedSystemFacts.map((fact, idx) => (
            <li key={idx} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* AI Fact Diff Summary Box (Strictly Non-diagnostic) */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <Sparkles size={16} className="text-indigo-600" />
          <span>AI 팩트 차이 자동 추출</span>
        </div>
        <pre className="text-xs font-medium text-indigo-950 whitespace-pre-wrap font-sans leading-relaxed">
          {aiFactSummary}
        </pre>
        <p className="text-[11px] text-indigo-700 font-medium">
          ⛔ <strong>AI 판단 차단</strong>: 개선/악화 및 위험도는 사회복지사가 최종 결정합니다.
        </p>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 bg-slate-100 p-3 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
          <div className="flex items-center justify-between">
            <span>📅 이전 사정일: {prevAssessment.assessment_date}</span>
            <span className="text-slate-500">작성자: {prevAssessment.worker_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>📅 현재 사정일: {currAssessment.assessment_date}</span>
            <span className="text-indigo-700">작성자: {currAssessment.worker_name}</span>
          </div>
        </div>

        <div className="space-y-3">
          {categories.map((cat, idx) => {
            const isChanged = cat.prev !== cat.curr;

            return (
              <div
                key={idx}
                className={`border rounded-xl p-4 transition ${
                  isChanged ? "border-amber-300 bg-amber-50/20" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>{cat.title}</span>
                    {isChanged && <Badge className="bg-amber-500 text-white font-bold text-[9px]">변경 감지</Badge>}
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">이전 내용</span>
                    <p>{cat.prev}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-900 font-semibold space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 block flex items-center gap-1">
                      <span>현재 내용</span>
                      <ArrowRight size={12} />
                    </span>
                    <p>{cat.curr}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Human Social Worker Interpretation Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
          <FileText size={16} className="text-indigo-600" /> 최종 사실 및 해석 작성 (Human Social Worker)
        </h3>

        <div>
          <textarea
            rows={3}
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={planReviewNeeded}
              onChange={(e) => setPlanReviewNeeded(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-bold text-slate-800">
              📋 [개별 급여제공계획] 수정을 검토합니다.
            </span>
          </label>

          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-5 flex items-center gap-1.5"
          >
            <CheckCircle2 size={16} />
            <span>재사정 최종 해석 저장</span>
          </Button>
        </div>

        {isSaved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>재사정 해석이 저장되었습니다.</span>
          </div>
        )}
      </div>
    </div>
  );
}
