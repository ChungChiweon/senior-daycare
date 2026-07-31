"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPrograms } from "@/data/mock-daycare-store";

export default function ProgramsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>신체 · 인지 · 정서 재활</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">어르신 프로그램 관리</h1>
          <p className="mt-1 text-sm text-slate-600">
            신체유연성, 뇌자극 인지훈련, 회상요법 및 원예치료 등 월간/일간 프로그램 일정과 참여 현황을 관리합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Plus size={18} />
          프로그램 등록
        </Button>
      </div>

      {/* Program Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockPrograms.map((p) => (
          <Link
            key={p.id}
            href={`/programs/${p.id}`}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-500 hover:shadow-md block"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                {p.category}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.status === "완료" ? "bg-emerald-100 text-emerald-800" : p.status === "진행중" ? "bg-sky-100 text-sky-800" : "bg-slate-100 text-slate-700"}`}>
                {p.status}
              </span>
            </div>

            <h2 className="mt-3 text-lg font-bold text-slate-900 group-hover:text-sky-600">{p.title}</h2>
            <p className="mt-2 text-xs text-slate-600 line-clamp-2">{p.description}</p>

            <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500 font-semibold">
              <div className="flex items-center justify-between">
                <span>진행 시간</span>
                <span className="font-bold text-slate-800">{p.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>진행 강사 / 사회복지사</span>
                <span className="font-bold text-slate-800">{p.instructor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>참석 인원</span>
                <span className="font-bold text-sky-700">
                  {p.attendedCount}명 / 대상 {p.targetCount}명
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
