"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Compass } from "lucide-react";
import type { NeedsAssessment, ServiceGoal } from "@/types/social-work-practice";

type PracticeTimelineStep = {
  date: string;
  stage: "need" | "plan" | "service" | "observation" | "eval";
  stageLabel: string;
  title: string;
  description: string;
  workerName: string;
  isHumanEvaluated: boolean;
};

type PracticeTimelineViewProps = {
  residentName: string;
  needsAssessment?: NeedsAssessment;
  goals?: ServiceGoal[];
};

export default function PracticeTimelineView({
  residentName,
  needsAssessment,
  goals = []
}: PracticeTimelineViewProps) {
  const [timelineSteps] = useState<PracticeTimelineStep[]>([
    {
      date: "2026.01.15",
      stage: "need",
      stageLabel: "1. 욕구 발견",
      title: "초기 욕구 사정 (사회적 관계 감소)",
      description: "어르신 본인이 주간활동 참여 감소 및 말수 감소 욕구를 호소함.",
      workerName: "박지영 사회복지사",
      isHumanEvaluated: true
    },
    {
      date: "2026.01.20",
      stage: "plan",
      stageLabel: "2. 서비스 계획",
      title: "개별 급여 제공 계획 수립 (사회적 참여 유지)",
      description: "인지 및 신체 맞춤형 대그룹 회상 프로그램 주 3회 참여 지원 목표 설정.",
      workerName: "박지영 사회복지사",
      isHumanEvaluated: true
    },
    {
      date: "2026.02.10",
      stage: "service",
      stageLabel: "3. 서비스 제공",
      title: "인지 회상 미술 프로그램 제공",
      description: "소묘 및 색종이 모자이크 작업 시 또래 어르신과의 대화 상호작용 유도.",
      workerName: "이간호 간호조무사",
      isHumanEvaluated: true
    },
    {
      date: "2026.02.25",
      stage: "observation",
      stageLabel: "4. 관찰 기록",
      title: "일상 케어 팩트 관찰 (식사 및 프로그램 참여)",
      description: "점심 식사 섭취율 100% 및 옆자리 어르신과 웃으며 담소 나누시는 모습 관찰됨.",
      workerName: "김요양 요양보호사",
      isHumanEvaluated: true
    },
    {
      date: "2026.03.01",
      stage: "eval",
      stageLabel: "5. 종합 평가",
      title: "분기별 서비스 목표 달성도 평가",
      description: "사회적 관계 형성 및 표정 밝아짐 확인되어 기존 목표 지속 유지 판정.",
      workerName: "박지영 사회복지사",
      isHumanEvaluated: true
    }
  ]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Compass size={18} className="text-sky-600" /> [{residentName} 어르신] 사회복지 실천 타임라인 (Practice Timeline)
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">
            욕구 사정부터 서비스 계획, 일일 케어 관찰, 최종 평가까지 실천의 흐름을 한눈에 조망합니다. (해석은 사람이 전담)
          </span>
        </div>
        <div className="flex items-center gap-2">
          {needsAssessment && <Badge className="bg-amber-100 text-amber-900 font-bold text-[10px]">사정일: {needsAssessment.assessment_date}</Badge>}
          {goals.length > 0 && <Badge className="bg-sky-100 text-sky-900 font-bold text-[10px]">목표 {goals.length}건 등록</Badge>}
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

      {/* Timeline Steps Stream */}
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
                <span className="text-[10px] font-bold text-slate-500">{step.workerName}</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
