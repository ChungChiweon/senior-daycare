"use client";

import { useState } from "react";
import {
  Check,
  Edit3,
  GitCompare,
  RefreshCw,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import type { BlockDiffModalData, RecordBlock, VisibilityScope } from "@/types/record-block";

type Props = {
  blocks: RecordBlock[];
  residentName: string;
  residents?: { id: string; name: string }[];
  activeResidentId?: string;
  onSelectResident?: (id: string) => void;
  onUpdateBlockText: (blockId: string, text: string) => void;
  onUpdateBlockScope: (blockId: string, scope: VisibilityScope) => void;
  onApproveBlock: (blockId: string) => void;
  onRegenerateAiBlock: (blockId: string) => void;
};

export function RecordBlockEditor({
  blocks,
  residentName,
  residents = [],
  activeResidentId = "",
  onSelectResident,
  onUpdateBlockText,
  onUpdateBlockScope,
  onApproveBlock,
  onRegenerateAiBlock
}: Props) {
  const [diffModalData, setDiffModalData] = useState<BlockDiffModalData | null>(null);
  const [activeEditingId, setActiveEditingId] = useState<string | null>(null);

  function handleAiRegenerateClick(block: RecordBlock) {
    const currentText = block.editedText || block.aiDraft;

    // Simulated new AI draft generation
    const newAiDraft = `${block.aiDraft}\n\n(AI 톤앤매너 보완): ${residentName} 어르신의 신체·정서 반응이 더욱 상세히 관찰되어 기록 보완되었습니다.`;

    // Open Diff Comparison Modal - Do NOT overwrite user's edit silently!
    setDiffModalData({
      blockId: block.id,
      title: block.title,
      currentText,
      newAiDraft
    });
  }

  function handleApplyDiffChoice(useNewAi: boolean) {
    if (!diffModalData) return;

    if (useNewAi) {
      onUpdateBlockText(diffModalData.blockId, diffModalData.newAiDraft);
    }
    setDiffModalData(null);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* 👥 Resident Selector Tabs */}
      {residents.length > 0 && onSelectResident && (
        <div className="rounded-lg bg-slate-100 p-1.5 flex overflow-x-auto gap-1 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 self-center px-1 shrink-0">이용자 선택:</span>
          {residents.map((r) => {
            const isActive = r.id === activeResidentId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectResident(r.id)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200/60"
                }`}
              >
                {r.name} 어르신
              </button>
            );
          })}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900">🧩 AI 기록 블록 에디터 ({residentName} 어르신)</h2>
            <Badge className="bg-sky-100 text-sky-800 text-xs">RecordBlock</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            사실 입력에서 자동 구성된 12개 AI 기록 블록입니다. 상단 이용자 탭을 선택해 다른 어르신의 기록도 바로 편집할 수 있습니다.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span>작성 블록: <strong className="text-sky-700">{blocks.length}개</strong></span>
        </div>
      </div>

      {/* Record Blocks List */}
      <div className="space-y-3">
        {blocks.map((block) => {
          const isEditing = activeEditingId === block.id;
          const currentText = block.editedText || block.aiDraft;

          return (
            <div
              key={block.id}
              className={`rounded-xl border p-4 space-y-2.5 transition ${block.reviewStatus === "approved" ? "border-emerald-300 bg-emerald-50/30" : "border-slate-200 bg-white shadow-2xs"}`}
            >
              {/* Block Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{block.title}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${block.sourceType === "common" ? "bg-indigo-100 text-indigo-800" : "bg-sky-100 text-sky-800"}`}>
                    {block.sourceType === "common" ? "공통 입력" : "개별 입력"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">v{block.version}</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Visibility Scope Selector */}
                  <select
                    className={`h-6 rounded px-1.5 text-[10px] font-bold outline-none border ${block.visibilityScope === "internal_only" ? "bg-slate-100 text-slate-700 border-slate-300" : "bg-sky-50 text-sky-800 border-sky-200"}`}
                    value={block.visibilityScope}
                    onChange={(e) => onUpdateBlockScope(block.id, e.target.value as VisibilityScope)}
                  >
                    <option value="internal_only">🔒 내부 기록만</option>
                    <option value="guardian_ok">💬 보호자 공개 가능</option>
                    <option value="auto_doc_ok">📄 문서 자동 반영</option>
                    <option value="promo_ok">📢 홍보 활용 가능</option>
                  </select>

                  {/* Review Status Badge */}
                  <Badge className={block.reviewStatus === "approved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                    {block.reviewStatus === "approved" ? "승인 완료" : "검토 대기"}
                  </Badge>

                  {/* Actions */}
                  <button
                    type="button"
                    className="h-6 rounded bg-slate-100 px-2 text-[10px] font-bold text-slate-700 hover:bg-slate-200 flex items-center gap-1"
                    onClick={() => setActiveEditingId(isEditing ? null : block.id)}
                  >
                    <Edit3 size={11} /> {isEditing ? "완료" : "수정"}
                  </button>

                  <button
                    type="button"
                    className="h-6 rounded bg-sky-50 px-2 text-[10px] font-bold text-sky-800 hover:bg-sky-100 flex items-center gap-1"
                    onClick={() => handleAiRegenerateClick(block)}
                  >
                    <RefreshCw size={11} /> AI 재생성
                  </button>

                  {block.reviewStatus !== "approved" && (
                    <button
                      type="button"
                      className="h-6 rounded bg-emerald-600 px-2 text-[10px] font-bold text-white hover:bg-emerald-700 flex items-center gap-1"
                      onClick={() => onApproveBlock(block.id)}
                    >
                      <Check size={11} /> 승인
                    </button>
                  )}
                </div>
              </div>

              {/* Source Data Facts Chips */}
              <div className="flex flex-wrap gap-1 text-[10px]">
                {Object.entries(block.sourceData).map(([k, v]) => (
                  <span key={k} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                    {k}: {String(v)}
                  </span>
                ))}
              </div>

              {/* Textarea vs Formatted Text View */}
              {isEditing ? (
                <Textarea
                  className="min-h-20 text-xs leading-relaxed font-sans p-2.5 border-slate-300"
                  value={currentText}
                  onChange={(e) => onUpdateBlockText(block.id, e.target.value)}
                />
              ) : (
                <p className="text-xs text-slate-800 font-medium leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
                  {currentText}
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-0.5">
                <span>작성자: {block.author}</span>
                <span>수정: {new Date(block.updatedAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Regeneration Diff / Comparison Modal */}
      {diffModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <GitCompare size={18} className="text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">AI 재생성 비교 검토 [{diffModalData.title}]</h3>
              </div>
              <button type="button" className="text-slate-400 hover:text-slate-600" onClick={() => setDiffModalData(null)}>
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              AI 재생성 시 사용자의 기존 수정본을 덮어쓰지 않고 비교합니다. 유지할 문안을 선택해 주세요.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Left: User's Current Edit */}
              <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-bold text-slate-800">
                  <span>✏️ 사용자 현재 수정본</span>
                  <Badge className="bg-slate-200 text-slate-700">현재 보존 중</Badge>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium min-h-32">{diffModalData.currentText}</p>
                <Button variant="secondary" className="w-full text-xs font-bold h-9" onClick={() => handleApplyDiffChoice(false)}>
                  사용자 수정본 유지
                </Button>
              </div>

              {/* Right: New AI Draft */}
              <div className="rounded-xl border border-sky-300 bg-sky-50/50 p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-sky-200 pb-2 font-bold text-sky-900">
                  <span>✨ 새로 생성된 AI 문안</span>
                  <Badge className="bg-sky-600 text-white">AI 신규</Badge>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium min-h-32">{diffModalData.newAiDraft}</p>
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-xs font-bold h-9" onClick={() => handleApplyDiffChoice(true)}>
                  새 AI 문안 적용
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
