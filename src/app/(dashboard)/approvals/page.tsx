"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockApprovals, ApprovalItem } from "@/data/mock-daycare-store";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [filter, setFilter] = useState<string>("전체");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("silvercare.approvals");
    if (saved) {
      try {
        setApprovals(JSON.parse(saved));
      } catch {
        // fallback
      }
    }
  }, []);

  const saveApprovals = (updated: ApprovalItem[]) => {
    setApprovals(updated);
    localStorage.setItem("silvercare.approvals", JSON.stringify(updated));
  };

  function handleAction(id: string, status: "승인완료" | "반려" | "수정요청") {
    const updated = approvals.map((a) => (a.id === id ? { ...a, status } : a));
    saveApprovals(updated);
    setMessage(`결재 건(${id}) 상태가 [${status}]로 변경되었습니다.`);
  }

  const filtered = approvals.filter((a) => filter === "전체" || a.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>전자 결재 시스템</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">결재 승인 센터</h1>
          <p className="mt-1 text-sm text-slate-600">
            급여제공기록지, 사례관리, 프로그램 계획서 및 기관 안전점검 서류 결재 승인을 처리합니다.
          </p>
        </div>
        <div className="flex gap-2">
          {["전체", "승인대기", "승인완료", "수정요청", "반려"].map((st) => (
            <button
              key={st}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${filter === st ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-600 border-slate-200"}`}
              onClick={() => setFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {message && <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 text-xs font-bold text-sky-800">{message}</div>}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <h3 className="text-base font-black text-slate-900">결재 대기 중인 문서가 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            문서 작성 메뉴에서 기안서를 상신하면 결재 승인 목록에 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-bold text-sky-800">{a.category}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${a.status === "승인완료" ? "bg-emerald-100 text-emerald-800" : a.status === "승인대기" ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}>
                    {a.status}
                  </span>
                </div>
                <Link href={`/approvals/${a.id}`} className="mt-2 text-base font-bold text-slate-900 hover:text-sky-600 block">
                  {a.title}
                </Link>
                <p className="mt-1 text-xs text-slate-500 font-semibold">
                  기안자: {a.author} ({a.role}) | 기안일: {a.date}
                </p>
                <p className="mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">
                  {a.summary}
                </p>
              </div>

              <div className="flex gap-2 sm:flex-col">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold" onClick={() => handleAction(a.id, "승인완료")}>
                  <Check size={14} /> 승인
                </Button>
                <Button variant="secondary" className="text-xs font-bold text-rose-600" onClick={() => handleAction(a.id, "반려")}>
                  <X size={14} /> 반려
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
