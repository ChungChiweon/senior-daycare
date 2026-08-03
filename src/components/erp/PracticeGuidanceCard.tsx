"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronUp, EyeOff, Lightbulb, Settings, X } from "lucide-react";
import type { PracticeReminder } from "@/lib/social-work-reminder-engine";

type PracticeGuidanceCardProps = {
  reminder: PracticeReminder;
  onSaveReflection?: (selectedItems: string[]) => void;
};

type FrequencySetting = "all" | "important_only" | "hide_3days" | "hide_all";

export default function PracticeGuidanceCard({
  reminder,
  onSaveReflection
}: PracticeGuidanceCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [frequency, setFrequency] = useState<FrequencySetting>("all");
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});

  const storageKeyHideUntil = `practice_reminder_hide_${reminder.id}`;
  const storageKeyFreq = `practice_reminder_frequency`;

  useEffect(() => {
    // Check if hidden for N days
    const hideUntil = localStorage.getItem(storageKeyHideUntil);
    if (hideUntil && new Date().getTime() < Number(hideUntil)) {
      setIsDismissed(true);
    }

    // Check user frequency preference
    const savedFreq = (localStorage.getItem(storageKeyFreq) as FrequencySetting) || "all";
    setFrequency(savedFreq);
    if (savedFreq === "hide_all") {
      setIsDismissed(true);
    }
  }, [storageKeyHideUntil, storageKeyFreq]);

  if (isDismissed) return null;

  function handleHideNDays(days: number) {
    const hideUntilTime = new Date().getTime() + days * 24 * 60 * 60 * 1000;
    localStorage.setItem(storageKeyHideUntil, String(hideUntilTime));
    setIsDismissed(true);
  }

  function handleFrequencyChange(newFreq: FrequencySetting) {
    setFrequency(newFreq);
    localStorage.setItem(storageKeyFreq, newFreq);
    if (newFreq === "hide_all") {
      setIsDismissed(true);
    }
  }

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
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Badge className="bg-sky-600 text-white font-bold text-[10px] px-2 py-0.5 flex items-center gap-1 shrink-0">
            <Lightbulb size={12} /> {reminder.title}
          </Badge>
          <span className="font-extrabold text-slate-800 text-[11px] truncate">
            {reminder.question}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/50"
            title="안내 빈도 및 숨기기 설정"
          >
            <Settings size={13} />
          </button>
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
            title="닫기 (무시하고 계속 업무 진행)"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Per-user Fatigue Control Settings Overlay */}
      {showSettings && (
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg text-[11px] space-y-2 animate-in fade-in duration-100">
          <div className="flex items-center justify-between font-bold text-slate-800">
            <span>⚙️ 실천 리마인더 피로 방지 및 빈도 설정</span>
            <button
              onClick={() => setShowSettings(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleHideNDays(3)}
              className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-[10px] text-slate-700 flex items-center justify-center gap-1"
            >
              <EyeOff size={11} /> 3일간 숨기기
            </button>
            <button
              type="button"
              onClick={() => handleHideNDays(7)}
              className="p-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 font-bold text-[10px] text-slate-700 flex items-center justify-center gap-1"
            >
              <EyeOff size={11} /> 7일간 숨기기
            </button>
          </div>
          <div className="space-y-1 pt-1 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-500">안내 빈도 설정:</span>
            <div className="flex gap-2 text-[10px]">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === "all"}
                  onChange={() => handleFrequencyChange("all")}
                />
                <span>모두 표시</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === "important_only"}
                  onChange={() => handleFrequencyChange("important_only")}
                />
                <span>중요 변화만</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="freq"
                  checked={frequency === "hide_all"}
                  onChange={() => handleFrequencyChange("hide_all")}
                />
                <span>완전 숨기기</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Goal Link Hint */}
      {reminder.relatedGoalSummary && (
        <div className="rounded-lg bg-indigo-100/60 border border-indigo-200/60 p-2 font-bold text-indigo-950 text-[11px]">
          🔗 {reminder.relatedGoalSummary}
        </div>
      )}

      {/* Checklist (Collapsible) */}
      {isExpanded && (
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-500">
              사회복지사 실천 검토 체크리스트 (응답 없이 업무 진행 가능):
            </span>
            <button
              onClick={() => handleHideNDays(7)}
              className="text-slate-400 hover:text-slate-600 underline font-semibold"
            >
              7일간 안 보기
            </button>
          </div>
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
                <span className={checkedMap[idx] ? "font-bold line-through text-slate-400" : "font-medium text-slate-700"}>
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
