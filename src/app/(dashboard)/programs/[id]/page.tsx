"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPrograms } from "@/data/mock-daycare-store";

export default function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const prog = mockPrograms.find((p) => p.id === resolvedParams.id) ?? mockPrograms[0];
  const [activeTab, setActiveTab] = useState<"plan" | "attendance" | "result" | "photos">("plan");

  const tabOptions: { val: "plan" | "attendance" | "result" | "photos"; label: string }[] = [
    { val: "plan", label: "📋 프로그램 계획서" },
    { val: "attendance", label: "👥 어르신 출석부" },
    { val: "result", label: "📝 진행 결과 및 소견" },
    { val: "photos", label: "📸 현장 사진갤러리" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Link href="/programs" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft size={16} />
          프로그램 목록으로 돌아가기
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">{prog.category}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{prog.status}</span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-slate-900">{prog.title}</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              시간: {prog.time} | 담당: {prog.instructor} | 참석: {prog.attendedCount}명 / {prog.targetCount}명
            </p>
          </div>
          <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
            <CheckCircle2 size={18} /> 출석 & 결과 일괄 등록
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {tabOptions.map((t) => (
          <button
            key={t.val}
            type="button"
            className={`px-4 py-2 text-xs font-bold rounded-lg border transition ${activeTab === t.val ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
            onClick={() => setActiveTab(t.val)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        {activeTab === "plan" && (
          <div className="space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">프로그램 운영 세부 계획</h2>
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 leading-relaxed text-slate-800">
              {prog.description}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <span className="font-bold text-slate-900 block mb-1">프로그램 기대 효과</span>
                <p className="text-slate-600">어르신의 신체 소근육 자극, 인지기능 유지, 정서적 유대감 형성 및 스트레스 해소</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <span className="font-bold text-slate-900 block mb-1">준비물 및 세팅</span>
                <p className="text-slate-600">안전 체조 매트, 의자, 교구 칠교 세트, 안내 음향 장비</p>
              </div>
            </div>
          </div>
        )}
        {activeTab !== "plan" && (
          <div className="py-12 text-center text-slate-400 text-sm font-semibold">
            선택하신 탭의 세부 참석자 정보 및 결과 데이터가 연동됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
