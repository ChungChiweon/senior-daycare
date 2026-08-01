"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Circle,
  FileText,
  Sparkles,
  UserPlus,
  Users,
  Zap
} from "lucide-react";

export function OnboardingChecklistWidget() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3]);

  const steps = [
    { id: 1, label: "기관 정보 등록", desc: "센터 대표 명칭 및 정원 등록 완료", href: "/onboarding" },
    { id: 2, label: "직원 초대 및 권한 설정", desc: "복지사/간호사/요양보호사 초청 완료", href: "/staff/invite" },
    { id: 3, label: "이용자 수급자 등록", desc: "35명 어르신 프로필 및 송영 등록 완료", href: "/residents" },
    { id: 4, label: "첫 관찰 케어 기록 작성", desc: "오늘의 케어 1-Tap 터치 관찰 접수", href: "/daily-care" },
    { id: 5, label: "AI 20종 문서 동적 생성 테스트", desc: "레지스트리 20종 AI 문서 자동 작성", href: "/create" }
  ];

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100);

  function toggleStep(id: number) {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter((s) => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  }

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white p-4 sm:p-5 shadow-xs space-y-4 text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-sky-100 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-sky-600 text-white font-bold text-[10px]">
              🚀 기관 베타 온보딩 퀘스트
            </Badge>
            <span className="text-[11px] font-extrabold text-sky-900">
              최초 센터 가입 완료율: <strong className="text-sky-600">{progressPercent}%</strong>
            </span>
          </div>
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Sparkles size={16} className="text-sky-600" /> 주간보호 센터 운영 시작 체크리스트
          </h2>
        </div>

        {/* Progress Bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-bold text-right block">
            {completedSteps.length} / {steps.length}개 과제 달성
          </span>
        </div>
      </div>

      {/* 5 Steps Stream */}
      <div className="grid gap-2 sm:grid-cols-5">
        {steps.map((st) => {
          const isDone = completedSteps.includes(st.id);

          return (
            <div
              key={st.id}
              onClick={() => toggleStep(st.id)}
              className={`rounded-xl border p-2.5 transition cursor-pointer space-y-1 flex flex-col justify-between ${
                isDone
                  ? "bg-white border-emerald-300 shadow-2xs"
                  : "bg-slate-50 border-slate-200 hover:bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400">0{st.id}단계</span>
                {isDone ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <Circle size={16} className="text-slate-300" />
                )}
              </div>

              <div>
                <span className={`font-black text-xs block leading-snug ${isDone ? "text-slate-900" : "text-slate-700"}`}>
                  {st.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium line-clamp-1 mt-0.5">{st.desc}</span>
              </div>

              <Link
                href={st.href}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-sky-600 hover:underline pt-1"
              >
                <span>이동</span>
                <ChevronRight size={10} />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
