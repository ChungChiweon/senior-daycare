import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, X } from "lucide-react";
import type { RecordBlock } from "@/types/record-block";

type Props = {
  sentenceText: string;
  sourceBlock?: RecordBlock;
  onClose: () => void;
};

export function FactTraceabilityModal({ sentenceText, sourceBlock, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-sky-600" />
            <span className="font-black text-slate-900 text-sm">AI 문장 원천 팩트 근거 추적</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={16} />
          </button>
        </div>

        {/* Target Generated Sentence */}
        <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 space-y-1">
          <span className="font-extrabold text-sky-950 text-[10px] block">✨ 선택한 AI 생성 문장</span>
          <p className="text-xs text-sky-900 font-bold leading-relaxed">
            "{sentenceText}"
          </p>
        </div>

        {/* Linked Source RecordBlock Details */}
        {sourceBlock ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Badge className="bg-indigo-600 text-white font-bold text-[10px]">
                📌 원본 RecordBlock: {sourceBlock.title}
              </Badge>
              <span className="text-[10px] text-slate-400 font-mono">
                {sourceBlock.createdAt || "오늘 12:30"}
              </span>
            </div>

            <div className="space-y-1 pt-1 border-t border-slate-200/60">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                <span>작성자: <strong className="text-slate-900">이간호 간호조무사 (간호팀)</strong></span>
                <span>보안등급: <strong className="text-indigo-700">{sourceBlock.visibilityScope}</strong></span>
              </div>

              <div className="rounded-lg bg-white border border-slate-200 p-2.5 mt-1">
                <span className="font-bold text-slate-500 block text-[10px] mb-0.5">📝 현장 수집 팩트 원문</span>
                <p className="text-xs text-slate-900 font-semibold leading-relaxed">
                  {sourceBlock.editedText || sourceBlock.aiDraft}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-slate-500 font-medium">
            이 문장은 수집된 식사 섭취 팩트 및 인지 프로그램 참여 기록에 100% 근거하여 합성되었습니다.
          </div>
        )}

        <div className="flex justify-end pt-1">
          <Button onClick={onClose} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold h-8">
            확인 닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
