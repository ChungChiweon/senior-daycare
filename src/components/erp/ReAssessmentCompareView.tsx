"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Columns, FileQuestion, FileText, Sparkles, Zap } from "lucide-react";
import type { NeedsAssessment } from "@/types/social-work-practice";

type ReAssessmentCompareViewProps = {
  residentName?: string;
  prevAssessment?: NeedsAssessment | null;
  currAssessment?: NeedsAssessment | null;
  onSaveInterpretation?: (interpretation: string, planReviewNeeded: boolean) => void;
};

export default function ReAssessmentCompareView({
  residentName = "",
  prevAssessment,
  currAssessment,
  onSaveInterpretation
}: ReAssessmentCompareViewProps) {
  const [interpretation, setInterpretation] = useState("");
  const [planReviewNeeded, setPlanReviewNeeded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Clean Empty State when no previous/current assessment exists
  if (!prevAssessment || !currAssessment) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <FileQuestion size={24} />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-bold text-slate-900 text-sm">
            {residentName ? `[${residentName} 어르신] ` : ""}재사정 대조 데이터 대기
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            아직 등록된 이전 사정이 없습니다. 초기 사정 이후 재사정 결과를 비교할 수 있습니다.
          </p>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
            ℹ️ 초기 욕구사정 작성 후 정기 재사정이 완료되면 Side-by-Side 대조 화면이 활성화됩니다.
          </span>
        </div>
      </div>
    );
  }

  const categories = [
    { title: "1. 신체적 욕구", prev: prevAssessment.physical_needs, curr: currAssessment.physical_needs },
    { title: "2. 인지적 욕구", prev: prevAssessment.cognitive_needs, curr: currAssessment.cognitive_needs },
    { title: "3. 정서적 욕구", prev: prevAssessment.emotional_needs, curr: currAssessment.emotional_needs },
    { title: "4. 가족 욕구", prev: prevAssessment.family_needs, curr: currAssessment.family_needs },
    { title: "5. 사회적 관계 욕구", prev: prevAssessment.social_relationship_needs, curr: currAssessment.social_relationship_needs },
    { title: "6. 환경적 욕구", prev: prevAssessment.environment_needs, curr: currAssessment.environment_needs }
  ];

  const changedCategories = categories.filter((c) => c.prev !== c.curr);

  const handleSave = () => {
    if (onSaveInterpretation) {
      onSaveInterpretation(interpretation, planReviewNeeded);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white font-bold text-[10px]">재사정 6대 욕구 대조</Badge>
            <span className="text-xs text-slate-500 font-semibold">이전 vs 현재 욕구사정 Side-by-Side</span>
          </div>
          <h2 className="text-lg font-black text-slate-900 mt-1 flex items-center gap-2">
            <Columns size={20} className="text-indigo-600" /> [{residentName || prevAssessment.resident_name}] 재사정 비교
          </h2>
        </div>
        <Badge className="bg-slate-900 text-white font-bold text-[10px]">
          변경 감지: {changedCategories.length}개 영역
        </Badge>
      </div>

      {/* AI Fact Diff Summary Box (Strictly Non-diagnostic) */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs">
          <Sparkles size={16} className="text-indigo-600" />
          <span>사정 항목 변경점 요약</span>
        </div>
        {changedCategories.length === 0 ? (
          <p className="text-xs text-slate-600 font-medium">이전 사정 대비 내용 변경점이 없습니다.</p>
        ) : (
          <ul className="text-xs font-medium text-indigo-950 space-y-1">
            {changedCategories.map((c, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="font-bold shrink-0">• {c.title}:</span>
                <span className="text-slate-600 line-clamp-1">{c.prev}</span>
                <ArrowRight size={12} className="shrink-0 mt-0.5 text-indigo-600" />
                <span className="font-bold text-indigo-900 line-clamp-1">{c.curr}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-indigo-700 font-medium pt-1">
          ⛔ <strong>AI 판단 차단</strong>: 개선/악화 및 위험도는 사회복지사가 최종 결정합니다.
        </p>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 bg-slate-100 p-3 rounded-xl text-xs font-bold text-slate-700 border border-slate-200">
          <div className="flex items-center justify-between">
            <span>📅 이전 사정일: {prevAssessment.assessment_date}</span>
            <span className="text-slate-500">작성자: {prevAssessment.worker_name || "미지정"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>📅 현재 사정일: {currAssessment.assessment_date}</span>
            <span className="text-indigo-700">작성자: {currAssessment.worker_name || "미지정"}</span>
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
                    <p className="leading-relaxed">{cat.prev || "(기록 없음)"}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-900 font-semibold space-y-1">
                    <span className="text-[10px] font-bold text-indigo-600 block flex items-center gap-1">
                      <span>현재 내용</span>
                      <ArrowRight size={12} />
                    </span>
                    <p className="leading-relaxed">{cat.curr || "(기록 없음)"}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Social Worker Interpretation & Plan Revision */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <h4 className="font-bold text-xs text-slate-900">사회복지사 종합 소견 및 계획 변경 여부</h4>
        <textarea
          rows={3}
          value={interpretation}
          onChange={(e) => setInterpretation(e.target.value)}
          placeholder="재사정 결과에 대한 사회복지사의 전문적 판단 소견을 기록하세요..."
          className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={planReviewNeeded}
              onChange={(e) => setPlanReviewNeeded(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>개별 급여제공계획(Care Plan) 재검토 및 수정 필요</span>
          </label>
          <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8 px-4">
            {isSaved ? "저장 완료!" : "소견 저장"}
          </Button>
        </div>
      </div>
    </div>
  );
}
