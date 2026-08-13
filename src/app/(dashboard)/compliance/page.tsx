"use client";

import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CompliancePage() {
  const checkItems: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>국민건강보험공단 평가지표</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">평가 · 감사 대응 자동 점검</h1>
          <p className="mt-1 text-sm text-slate-600">
            주간보호센터 평가 항목(신체케어, 인지, 서류 누락, 안전교육)을 실시간 자동 진단합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Sparkles size={18} /> 평가지표 진단 리포트 생성
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">평가 예상 점수</span>
          <div className="mt-2 text-3xl font-black text-emerald-600">0점</div>
          <span className="text-xs text-slate-500 font-bold">진단 데이터 대기</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">서류 완비율</span>
          <div className="mt-2 text-3xl font-black text-slate-900">0%</div>
          <span className="text-xs text-slate-500 font-semibold">누락 서류 0건</span>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">공단 지표별 세부 점검 결과</h2>
        {checkItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            실습 중 등록된 케어 기록과 결재 서류를 바탕으로 자동 평가 점검이 계산됩니다.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {checkItems.map((item) => (
              <div key={item.code} className="flex items-center justify-between py-3 font-semibold">
                <div>
                  <span className="font-mono text-slate-400 mr-2">{item.code}</span>
                  <span className="text-slate-900 font-bold">{item.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-700">{item.score}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${item.status === "양호" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
