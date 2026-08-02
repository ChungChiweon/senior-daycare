"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockResidents, Resident } from "@/data/mock-daycare-store";
import PracticeGuidanceCard from "@/components/erp/PracticeGuidanceCard";
import { SocialWorkReminderEngine } from "@/lib/social-work-reminder-engine";

export default function DailyCarePage() {
  const [residents, setResidents] = useState<Resident[]>(mockResidents);
  const [activeTab, setActiveTab] = useState<"quick" | "vitals" | "meds" | "exceptions">("quick");
  const [expandedId, setExpandedId] = useState<string | null>("res-01");
  const [message, setMessage] = useState("");

  const unusualReminder = SocialWorkReminderEngine.getUnusualRecordReminder(
    "김순자",
    "식사/케어",
    "점심 식사 섭취량 둔화 및 물 섭취 권유 관찰됨"
  );

  useEffect(() => {
    const saved = localStorage.getItem("silvercare.dailyCare");
    if (saved) {
      try {
        setResidents(JSON.parse(saved));
      } catch {
        // Fallback to mock
      }
    }
  }, []);

  const saveState = (updated: Resident[]) => {
    setResidents(updated);
    localStorage.setItem("silvercare.dailyCare", JSON.stringify(updated));
  };

  function applyNormalToAll() {
    const updated = residents.map((r) =>
      r.attendance === "입실"
        ? {
            ...r,
            healthStatus: "양호" as const,
            bloodPressure: "120/80",
            temperature: "36.5℃",
            mealLunch: "전량" as const,
            mealSnack: "완료" as const,
            medication: "완료" as const,
            recordStatus: "작성완료" as const
          }
        : r
    );
    saveState(updated);
    setMessage("입실 어르신 전체 항목이 정상(전량/완료/양호)으로 일괄 설정되어 저장되었습니다.");
  }

  function updateResident(id: string, updates: Partial<Resident>) {
    const updated = residents.map((r) => (r.id === id ? { ...r, ...updates, recordStatus: "작성완료" as const } : r));
    saveState(updated);
    setMessage("어르신 케어 항목이 업데이트 되었습니다.");
  }

  return (
    <div className="space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <Badge>요양보호사 · 사회복지사 전용</Badge>
            <span className="text-xs font-semibold text-sky-600">오늘의 케어 및 급여제공기록</span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">오늘의 케어 기록 (원클릭 칩 입력)</h1>
          <p className="mt-1 text-sm text-slate-600">
            정상 항목은 [전체 정상 일괄 적용]을 누르고, 특별 건강/식사/투약 이상 항목만 원클릭 칩으로 손쉽게 수정하세요.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold" onClick={applyNormalToAll}>
          <CheckCircle2 size={18} />
          입실 어르신 전체 정상 일괄 적용
        </Button>
      </div>

      {message && <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 text-xs font-bold text-sky-800">{message}</div>}

      {/* Non-intrusive Social Work Practice Guidance Card */}
      <PracticeGuidanceCard reminder={unusualReminder} />

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${activeTab === "quick" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"}`}
          onClick={() => setActiveTab("quick")}
        >
          ⚡ 쾌속 칩 케어 입력
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${activeTab === "vitals" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"}`}
          onClick={() => setActiveTab("vitals")}
        >
          🩺 건강·바이탈 기록
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${activeTab === "meds" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"}`}
          onClick={() => setActiveTab("meds")}
        >
          💊 투약 케어
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${activeTab === "exceptions" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"}`}
          onClick={() => setActiveTab("exceptions")}
        >
          ⚠️ 특이사항 관찰
        </button>
      </div>

      {/* Quick Resident Input Cards List */}
      <div className="space-y-4">
        {residents.map((r) => {
          const isExpanded = expandedId === r.id;
          return (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
              <div
                className="flex cursor-pointer items-center justify-between"
                onClick={() => setExpandedId(isExpanded ? null : r.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-800 text-sm">
                    {r.initial}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-base">{r.name} 어르신</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{r.gradeLabel}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${r.attendance === "입실" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {r.attendance} ({r.attendanceTime})
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      건강: <span className="font-semibold text-slate-700">{r.healthStatus}</span> | 혈압: {r.bloodPressure} | 체온: {r.temperature} | 식사: {r.mealLunch} | 투약: {r.medication}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${r.recordStatus === "작성완료" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                    {r.recordStatus}
                  </span>
                  <ChevronDown className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} size={20} />
                </div>
              </div>

              {/* Accordion Content for Editing Care Data */}
              {isExpanded && (
                <div className="mt-4 border-t border-slate-100 pt-4 space-y-4">
                  {/* Health Status Chips */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">건강 상태</span>
                    <div className="flex flex-wrap gap-2">
                      {(["양호", "건강이상", "주의요망"] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${r.healthStatus === st ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                          onClick={() => updateResident(r.id, { healthStatus: st })}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Lunch Meal Chips */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">점심 식사량</span>
                    <div className="flex flex-wrap gap-2">
                      {(["전량", "2/3", "1/2", "거부"] as const).map((ml) => (
                        <button
                          key={ml}
                          type="button"
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${r.mealLunch === ml ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                          onClick={() => updateResident(r.id, { mealLunch: ml })}
                        >
                          {ml}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Medication Status Chips */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">점심 식후 투약</span>
                    <div className="flex flex-wrap gap-2">
                      {(["완료", "미투약", "해당없음"] as const).map((med) => (
                        <button
                          key={med}
                          type="button"
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${r.medication === med ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                          onClick={() => updateResident(r.id, { medication: med })}
                        >
                          {med}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Phrase Chips for Caution Notes */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-1.5">특이사항 관찰 문구 칩</span>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[
                        "기분 매우 밝으심",
                        "프로그램 적극 참여",
                        "소화 양호",
                        "무릎 관절통 호소",
                        "오후 나른함 호소",
                        "보행 시 조력 필요"
                      ].map((phrase) => (
                        <button
                          key={phrase}
                          type="button"
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-sky-100 hover:text-sky-800"
                          onClick={() =>
                            updateResident(r.id, {
                              cautionNotes: r.cautionNotes ? `${r.cautionNotes}, ${phrase}` : phrase
                            })
                          }
                        >
                          + {phrase}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-sky-300"
                      rows={2}
                      value={r.cautionNotes ?? ""}
                      onChange={(e) => updateResident(r.id, { cautionNotes: e.target.value })}
                      placeholder="특이사항 및 관찰 소견을 입력하세요..."
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
