"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Lightbulb, X } from "lucide-react";
import type { PracticeReminder } from "@/lib/social-work-reminder-engine";

type PracticeGuidanceCardProps = {
  reminder: PracticeReminder;
};

export default function PracticeGuidanceCard({
  reminder
}: PracticeGuidanceCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Collapsed by default into 1-line summary bar

  if (isDismissed) return null;

  return (
    <div className="rounded-xl border border-sky-200/90 bg-sky-50/70 p-2.5 text-xs shadow-2xs space-y-1.5 transition-all">
      {/* 1-Line Summary Bar (Takes 3 seconds to glance, no required inputs) */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Badge className="bg-sky-600 text-white font-bold text-[10px] px-2 py-0.5 flex items-center gap-1 shrink-0">
            <Lightbulb size={12} /> 실천 1줄 참고
          </Badge>
          <span className="font-bold text-slate-900 text-xs truncate">
            💡 {reminder.question}
          </span>
          {reminder.relatedGoalSummary && (
            <span className="hidden md:inline text-[11px] text-indigo-700 font-semibold truncate shrink-0">
              (🔗 {reminder.relatedGoalSummary})
            </span>
          )}
        </div>

        {/* 1-Click Dismiss / Expand Controls (Zero required response) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-sky-100/60 text-[10px] font-bold flex items-center gap-0.5"
            title="체크리스트 상세"
          >
            <span>{isExpanded ? "접기" : "상세"}</span>
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-sky-100/60"
            title="닫기 (0초 패스)"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Optional Detail Checklist (Only shown if user explicitly expands, zero input required) */}
      {isExpanded && (
        <div className="pt-2 border-t border-sky-200/60 space-y-1 text-[11px] text-slate-700 animate-in fade-in duration-100">
          <span className="font-bold text-slate-500 block">체크리스트 (참고용 / 답변 저장 불필요):</span>
          <ul className="space-y-1 pl-1">
            {reminder.checklistItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-1.5 text-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
