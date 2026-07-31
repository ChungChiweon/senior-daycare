"use client";

import { useMemo, useState } from "react";
import { Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { DocAvailability, DocCategory } from "@/types/integrated-care";

type Props = {
  docs: DocAvailability[];
  completionRate: number;
  onSelectDoc: (docKey: string) => void;
  selectedDocKey: string | null;
  onOpenDocEditor: (docKey: string) => void;
};

export function GeneratedDocumentPanel({
  docs,
  completionRate,
  onSelectDoc,
  selectedDocKey,
  onOpenDocEditor
}: Props) {
  const [activeTab, setActiveTab] = useState<"ALL" | DocCategory>("ALL");

  const availableCount = useMemo(() => docs.filter((d) => d.status === "available" || d.status === "completed").length, [docs]);
  const needsInputCount = useMemo(() => docs.filter((d) => d.status !== "available" && d.status !== "completed").length, [docs]);

  const filteredDocs = useMemo(() => {
    if (activeTab === "ALL") return docs;
    return docs.filter((d) => d.category === activeTab);
  }, [docs, activeTab]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4 text-xs">
      {/* Stat Banner */}
      <div className="rounded-lg bg-slate-900 text-white p-3.5 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-700 pb-2">
          <span className="font-bold text-xs">📊 기록 작성률 및 문서 가능 현황</span>
          <span className="text-base font-black text-sky-400">{completionRate}%</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center text-[11px] pt-0.5">
          <div className="rounded bg-slate-800 p-1.5">
            <span className="block text-slate-400 font-bold">생성 가능</span>
            <span className="text-sm font-black text-emerald-400">{availableCount}종</span>
          </div>
          <div className="rounded bg-slate-800 p-1.5">
            <span className="block text-slate-400 font-bold">추가 입력 필요</span>
            <span className="text-sm font-black text-amber-400">{needsInputCount}종</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 pb-2 text-[11px]">
        {[
          ["ALL", "전체 (20)"],
          ["guardian", "보호자 (5)"],
          ["internal", "법정·내부 (6)"],
          ["program", "프로그램 (4)"],
          ["promo", "홍보·운영 (5)"]
        ].map(([cat, label]) => (
          <button
            key={cat}
            type="button"
            className={`whitespace-nowrap px-2 py-1 rounded font-bold transition ${activeTab === cat ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            onClick={() => setActiveTab(cat as "ALL" | DocCategory)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 20 Docs Status List */}
      <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
        {filteredDocs.map((doc) => {
          const isSelected = selectedDocKey === doc.docKey;
          const isAvailable = doc.status === "available" || doc.status === "completed";

          return (
            <button
              key={doc.docKey}
              type="button"
              className={`w-full text-left p-2.5 rounded-lg border transition flex items-center justify-between ${isSelected ? "bg-sky-50 border-sky-500 shadow-2xs" : "bg-white border-slate-200 hover:bg-slate-50"}`}
              onClick={() => {
                onSelectDoc(doc.docKey);
                if (isAvailable) {
                  onOpenDocEditor(doc.docKey);
                }
              }}
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900 truncate">{doc.title}</span>
                  {doc.isInternal && <span className="text-[9px] font-bold px-1 rounded bg-slate-100 text-slate-600">내부</span>}
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">
                  {isAvailable ? "클릭 시 문서 편집기로 전환" : `필요: ${doc.requiredFields.join(", ")}`}
                </p>
              </div>

              <StatusBadge status={doc.status} label={doc.statusLabel} />
            </button>
          );
        })}
      </div>

      {/* Visual Content Conversion Feature (Preparation State) */}
      <div className="border-t border-slate-100 pt-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
            🎨 시각 콘텐츠로 변환
          </span>
          <Badge className="bg-slate-100 text-slate-600 text-[10px] px-1.5">후속 단계</Badge>
        </div>
        <p className="text-[11px] text-slate-500">
          통합 기록 및 텍스트 문서 저장 완료 후 활성화됩니다. (카드뉴스, 인포그래픽 변환)
        </p>

        <Button disabled variant="secondary" className="w-full text-xs font-bold h-9 opacity-60">
          <Image size={14} /> 시각 콘텐츠로 변환 (준비 중)
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  if (status === "available" || status === "completed") {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">생성 가능</span>;
  }
  if (status === "consent_needed") {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 shrink-0">동의 필요</span>;
  }
  if (status === "accumulated_needed") {
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 shrink-0">누적 필요</span>;
  }
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 shrink-0">입력 필요</span>;
}
