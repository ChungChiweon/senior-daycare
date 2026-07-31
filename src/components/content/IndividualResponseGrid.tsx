"use client";

import { useMemo, useState } from "react";
import { Zap } from "lucide-react";
import type {
  AssistanceLevel,
  EmotionalResponse,
  EngagementLevel,
  IndividualResponse,
  IntegratedResident
} from "@/types/integrated-care";

type Props = {
  residents: IntegratedResident[];
  responses: Record<string, IndividualResponse>;
  onChangeResponse: (residentId: string, updated: IndividualResponse) => void;
  onBatchApplyAll: (engagement: EngagementLevel, emotional: EmotionalResponse, assistance: AssistanceLevel) => void;
};

const engagementOptions: EngagementLevel[] = ["적극적", "보통", "소극적", "불참"];
const emotionalOptions: EmotionalResponse[] = ["즐거움", "안정", "피곤", "불안", "거부", "무반응"];
const assistanceOptions: AssistanceLevel[] = ["독립 수행", "말로 안내", "부분 도움", "지속 도움", "전적 도움"];

export function IndividualResponseGrid({ residents, responses, onChangeResponse, onBatchApplyAll }: Props) {
  const [filterMode, setFilterMode] = useState<"ALL" | "UNENTERED" | "ABNORMAL">("ALL");

  const unenteredCount = useMemo(() => {
    return residents.filter((r) => !responses[r.id] || !responses[r.id].engagement).length;
  }, [residents, responses]);

  const abnormalCount = useMemo(() => {
    return residents.filter((r) => {
      const res = responses[r.id];
      if (!res) return false;
      return res.engagement === "소극적" || res.emotionalResponse === "피곤" || res.emotionalResponse === "불안" || res.emotionalResponse === "거부";
    }).length;
  }, [residents, responses]);

  const displayedResidents = useMemo(() => {
    return residents.filter((r) => {
      if (filterMode === "UNENTERED") {
        return !responses[r.id] || !responses[r.id].engagement;
      }
      if (filterMode === "ABNORMAL") {
        const res = responses[r.id];
        if (!res) return false;
        return res.engagement === "소극적" || res.emotionalResponse === "피곤" || res.emotionalResponse === "불안" || res.emotionalResponse === "거부";
      }
      return true;
    });
  }, [residents, responses, filterMode]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <span>⚡ 이용자별 참여도 · 개인 반응 빠른 입력</span>
          <span className="text-slate-500 font-normal text-xs">({residents.length}명 대상)</span>
        </h3>

        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            className="flex items-center gap-1 rounded bg-indigo-50 px-2.5 py-1 font-bold text-indigo-800 hover:bg-indigo-100"
            onClick={() => onBatchApplyAll("적극적", "즐거움", "독립 수행")}
          >
            <Zap size={13} /> 전체 기본값 일괄 적용 (적극/즐거움/독립)
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition ${filterMode === "ALL" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"}`}
          onClick={() => setFilterMode("ALL")}
        >
          전체 ({residents.length})
        </button>
        <button
          type="button"
          className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition ${filterMode === "UNENTERED" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-amber-700 border-amber-200"}`}
          onClick={() => setFilterMode("UNENTERED")}
        >
          ⚠️ 미입력 ({unenteredCount})
        </button>
        <button
          type="button"
          className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition ${filterMode === "ABNORMAL" ? "bg-rose-600 text-white border-rose-600" : "bg-white text-rose-700 border-rose-200"}`}
          onClick={() => setFilterMode("ABNORMAL")}
        >
          🚨 이상/피로 반응 ({abnormalCount})
        </button>
      </div>

      {/* Grid Cards for Quick Select */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {displayedResidents.map((resident) => {
          const resp = responses[resident.id] || {
            residentId: resident.id,
            engagement: "적극적",
            emotionalResponse: "즐거움",
            assistanceLevel: "독립 수행",
            note: ""
          };

          return (
            <div key={resident.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-xs">
                    {resident.name[0]}
                  </div>
                  <span className="font-bold text-slate-900 text-xs">{resident.name} 어르신</span>
                  <span className="text-[10px] text-slate-500 font-medium">({resident.grade})</span>
                </div>
                {resp.note && <span className="text-[10px] font-semibold text-sky-700 truncate max-w-[180px]">메모: {resp.note}</span>}
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px]">
                {/* 참여도 */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">참여도</label>
                  <select
                    className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
                    value={resp.engagement}
                    onChange={(e) => onChangeResponse(resident.id, { ...resp, engagement: e.target.value as EngagementLevel })}
                  >
                    {engagementOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 정서 반응 */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">정서 반응</label>
                  <select
                    className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
                    value={resp.emotionalResponse}
                    onChange={(e) => onChangeResponse(resident.id, { ...resp, emotionalResponse: e.target.value as EmotionalResponse })}
                  >
                    {emotionalOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 도움 수준 */}
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">도움 수준</label>
                  <select
                    className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
                    value={resp.assistanceLevel}
                    onChange={(e) => onChangeResponse(resident.id, { ...resp, assistanceLevel: e.target.value as AssistanceLevel })}
                  >
                    {assistanceOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
