"use client";

import { Badge } from "@/components/ui/badge";
import { Compass, FileQuestion } from "lucide-react";
import type { NeedsAssessment, ServiceGoal } from "@/types/social-work-practice";

export type PracticeTimelineStep = {
  date: string;
  stage: "need" | "plan" | "service" | "observation" | "eval";
  stageLabel: string;
  title: string;
  description: string;
  workerName: string;
  isHumanEvaluated: boolean;
};

type PracticeTimelineViewProps = {
  residentName?: string;
  needsAssessment?: NeedsAssessment;
  goals?: ServiceGoal[];
  timelineSteps?: PracticeTimelineStep[];
};

export default function PracticeTimelineView({
  residentName = "",
  needsAssessment,
  goals = [],
  timelineSteps = []
}: PracticeTimelineViewProps) {
  function getStageBadge(stage: PracticeTimelineStep["stage"]) {
    switch (stage) {
      case "need":
        return <Badge className="bg-amber-100 text-amber-900 font-bold">1. 욕구 발견</Badge>;
      case "plan":
        return <Badge className="bg-sky-100 text-sky-900 font-bold">2. 서비스 계획</Badge>;
      case "service":
        return <Badge className="bg-indigo-100 text-indigo-900 font-bold">3. 서비스 제공</Badge>;
      case "observation":
        return <Badge className="bg-purple-100 text-purple-900 font-bold">4. 관찰 기록</Badge>;
      case "eval":
        return <Badge className="bg-emerald-100 text-emerald-900 font-bold">5. 종합 평가</Badge>;
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 text-xs">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Compass size={18} className="text-sky-600" />
            {residentName ? `[${residentName} 어르신] ` : ""}사회복지 실천 타임라인 (Practice Timeline)
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            욕구 사정부터 서비스 계획, 일일 케어 관찰, 최종 평가까지 실천의 흐름을 한눈에 조망합니다. (해석은 사람이 전담)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {needsAssessment && (
            <Badge className="bg-amber-100 text-amber-900 font-bold text-[10px]">
              사정일: {needsAssessment.assessment_date}
            </Badge>
          )}
          {goals.length > 0 && (
            <Badge className="bg-sky-100 text-sky-900 font-bold text-[10px]">
              목표 {goals.length}건 등록
            </Badge>
          )}
          <Badge className="bg-slate-900 text-white font-bold text-[10px]">
            👤 Human Social Worker Evaluated
          </Badge>
        </div>
      </div>

      {/* 5-Stage Practice Flow Stepper */}
      <div className="grid gap-2 sm:grid-cols-5 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
        <div className="text-center space-y-0.5">
          <span className="font-black text-amber-700 text-xs block">1. 욕구 발견</span>
          <span className="text-[10px] text-slate-500 block">초기사정·상담</span>
        </div>
        <div className="text-center space-y-0.5 border-l border-slate-200">
          <span className="font-black text-sky-700 text-xs block">2. 서비스 계획</span>
          <span className="text-[10px] text-slate-500 block">개별목표·개입</span>
        </div>
        <div className="text-center space-y-0.5 border-l border-slate-200">
          <span className="font-black text-indigo-700 text-xs block">3. 서비스 제공</span>
          <span className="text-[10px] text-slate-500 block">프로그램·케어</span>
        </div>
        <div className="text-center space-y-0.5 border-l border-slate-200">
          <span className="font-black text-purple-700 text-xs block">4. 관찰 기록</span>
          <span className="text-[10px] text-slate-500 block">RecordBlock 관찰</span>
        </div>
        <div className="text-center space-y-0.5 border-l border-slate-200">
          <span className="font-black text-emerald-700 text-xs block">5. 종합 평가</span>
          <span className="text-[10px] text-slate-500 block">사회복지사 주도</span>
        </div>
      </div>

      {/* Clean Empty State or Timeline Steps Stream */}
      {timelineSteps.length === 0 ? (
        <div className="py-10 px-4 text-center space-y-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <div className="mx-auto w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <FileQuestion size={20} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-700 text-xs">표시할 실천 타임라인 기록이 없습니다.</p>
            <p className="text-[11px] text-slate-400">
              초기상담, 욕구사정, 일일 케어 관찰, 사례회의가 기록되면 실천 타임라인이 자동으로 구성됩니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 border-l-2 border-slate-200 ml-3 py-2">
          {timelineSteps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white bg-sky-600 shadow-2xs" />
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-1.5 hover:bg-white transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-400 font-mono text-[11px]">{step.date}</span>
                    {getStageBadge(step.stage)}
                    <span className="font-black text-slate-900 text-xs">{step.title}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500">{step.workerName || "담당자"}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
