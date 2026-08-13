"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ApprovalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [appr, setAppr] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("silvercare.approvals");
    if (saved) {
      try {
        const list = JSON.parse(saved);
        const found = list.find((a: any) => a.id === resolvedParams.id);
        if (found) {
          setAppr(found);
          setStatus(found.status);
        }
      } catch {
        // fallback
      }
    }
    setLoading(false);
  }, [resolvedParams.id]);

  if (!loading && !appr) {
    return (
      <div className="space-y-6">
        <Link href="/approvals" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft size={16} /> 결재 목록으로 돌아가기
        </Link>
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <h3 className="text-base font-black text-slate-900">결재 문서를 찾을 수 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            상신된 결재 기안서가 없거나 삭제되었습니다.
          </p>
        </div>
      </div>
    );
  }

  if (loading || !appr) {
    return <div className="p-8 text-center text-slate-400 text-xs">불러오는 중...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/approvals" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft size={16} /> 결재 목록으로 돌아가기
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">{appr.category}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${status === "승인완료" ? "bg-emerald-100 text-emerald-800" : status === "승인대기" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
                {status}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-black text-slate-900">{appr.title}</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">기안자: {appr.author} ({appr.role}) | 기안일시: {appr.date}</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold" onClick={() => setStatus("승인완료")}>
              <Check size={16} /> 최종 승인
            </Button>
            <Button variant="secondary" className="text-xs font-bold text-amber-700" onClick={() => setStatus("수정요청")}>
              <RotateCcw size={16} /> 보완 요청
            </Button>
            <Button variant="secondary" className="text-xs font-bold text-rose-600" onClick={() => setStatus("반려")}>
              <X size={16} /> 반려
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">결재 기안 내용 및 요약</h2>
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs font-medium text-slate-800 leading-relaxed">
          {appr.summary}
        </div>

        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">전자 결재 및 변경 이력 로그 (Version Log)</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="font-semibold text-slate-700">v1.0 {appr.author} 기안 제출 완료</span>
            <span className="text-slate-400">{appr.date}</span>
          </div>
          {status === "승인완료" && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100 font-bold text-emerald-900">
              <span>v1.1 시설장 최종 전자승인 완료</span>
              <span>2026-07-30 18:00</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
