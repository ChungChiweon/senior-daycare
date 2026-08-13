"use client";

import { Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>본인부담금 & 공단청구</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">수납 및 장기요양 청구 관리</h1>
          <p className="mt-1 text-sm text-slate-600">
            수급자 등급별 급여수가 산정, 본인부담금(15%/9%/6%/면제) 명세서 청구 및 수납 입금 현황을 관리합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Send size={18} /> 본인부담금 모바일 청구서 전체발송
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">이번달 총 발생 청구액</span>
          <div className="mt-2 text-3xl font-black text-slate-900">₩0</div>
          <span className="text-xs text-slate-500 font-semibold">공단 청구액 (85%)</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">본인부담금 수납완료</span>
          <div className="mt-2 text-3xl font-black text-emerald-600">₩0</div>
          <span className="text-xs text-emerald-700 font-bold">수납률 0%</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-400">미수금</span>
          <div className="mt-2 text-3xl font-black text-amber-600">₩0</div>
          <span className="text-xs text-amber-700 font-bold">미수 0건</span>
        </div>
      </div>
    </div>
  );
}
