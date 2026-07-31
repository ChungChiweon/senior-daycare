"use client";

import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>경영 및 급여 통계</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">운영 통계 및 급여제공율 리포트</h1>
          <p className="mt-1 text-sm text-slate-600">
            월간 어르신 출석률, 신체·인지 프로그램 참여 비율, 장기요양 평가 점수 리포트를 제공합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Download size={18} /> 월간 보고서 엑셀/PDF 다운로드
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">7월 어르신 평균 출석률</span>
          <div className="mt-2 text-3xl font-black text-emerald-600">95.4%</div>
          <span className="text-xs text-emerald-700 font-bold">전월 대비 +2.1% 증가</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">급여제공기록지 당일 작성률</span>
          <div className="mt-2 text-3xl font-black text-sky-600">100%</div>
          <span className="text-xs text-sky-700 font-bold">지연 작성 0건</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">보호자 알림장 만족도</span>
          <div className="mt-2 text-3xl font-black text-purple-600">4.9 / 5.0</div>
          <span className="text-xs text-purple-700 font-bold">카카오 알림톡 오픈율 98%</span>
        </div>
      </div>
    </div>
  );
}
