"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronUp, Lightbulb, X } from "lucide-react";
import type { PracticeReminder } from "@/lib/social-work-reminder-engine";

type PracticeGuidanceCardProps = {
  reminder: PracticeReminder;
  onSaveReflection?: (selectedItems: string[]) => void;
};

export default function PracticeGuidanceCard({
  reminder,
  onSaveReflection
}: PracticeGuidanceCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});

  if (isDismissed) return null;

  function toggleCheck(idx: number) {
    setCheckedMap((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  }

  const checkedCount = Object.values(checkedMap).filter(Boolean).length;

  return (
    <div className="rounded-xl border border-sky-200/80 bg-gradient-to-r from-sky-50/70 via-indigo-50/40 to-slate-50 p-3 text-xs shadow-2xs space-y-2 transition-all">
      {/* Card Top Banner Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Badge className="bg-sky-600 text-white font-bold text-[10px] px-2 py-0.5 flex items-center gap-1">
            <Lightbulb size={12} /> {reminder.title}
          </Badge>
          <span className="font-extrabold text-slate-800 text-[11px] line-clamp-1">
            {reminder.question}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"
            title={isExpanded ? "접기" : "펼치기"}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"
            title="닫기 (무시)"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Goal Link Hint */}
      {reminder.relatedGoalSummary && (
        <div className="rounded-lg bg-indigo-100/60 border border-indigo-200/60 p-2 font-bold text-indigo-950 text-[11px]">
          🔗 {reminder.relatedGoalSummary}
        </div>
      )}

      {/* Checklist (Collapsible) */}
      {isExpanded && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[10px] font-bold text-slate-500">
            사회복지사 실천 검토 체크리스트 (선택 항목):
          </p>
          <div className="space-y-1">
            {reminder.checklistItems.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-2 p-1.5 rounded-lg border border-slate-200/60 bg-white hover:bg-sky-50/50 cursor-pointer transition text-[11px]"
              >
                <input
                  type="checkbox"
                  checked={!!checkedMap[idx]}
                  onChange={() => toggleCheck(idx)}
                  className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                />
                <span className={checkedMap[idx] ? "font-bold text-slate-900 line-through text-slate-400" : "font-medium text-slate-700"}>
                  {item}
                </span>
              </label>
            ))}
          </div>

          {checkedCount > 0 && onSaveReflection && (
            <div className="flex justify-end pt-1">
              <Button
                onClick={() => {
                  const selected = reminder.checklistItems.filter((_, idx) => checkedMap[idx]);
                  onSaveReflection?.(selected);
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] h-6 px-2.5 flex items-center gap-1"
              >
                <CheckCircle2 size={12} />
                <span>검토 기록 저장 ({checkedCount}개)</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
