"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, Users, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resident } from "@/data/mock-daycare-store";
import PracticeGuidanceCard from "@/components/erp/PracticeGuidanceCard";
import { SocialWorkReminderEngine } from "@/lib/social-work-reminder-engine";

export default function DailyCarePage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [activeTab, setActiveTab] = useState<"quick" | "vitals" | "meds" | "exceptions">("quick");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const unusualReminder = SocialWorkReminderEngine.getUnusualRecordReminder(
    "이용자",
    "식사/케어",
    "점심 식사 섭취량 둔화 및 물 섭취 권유 관찰됨"
  );

  useEffect(() => {
    const loadData = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("silvercare.dailyCare") || localStorage.getItem("silvercare.residents");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
              setResidents(parsed);
              if (parsed.length > 0) {
                setExpandedId((prev) => prev || parsed[0].id);
              }
            }
          } catch {
            setResidents([]);
          }
        } else {
          setResidents([]);
        }
      }
    };
    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  const saveState = (updated: Resident[]) => {
    setResidents(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("silvercare.dailyCare", JSON.stringify(updated));
      localStorage.setItem("silvercare.residents", JSON.stringify(updated));
    }
  };

  function applyNormalToAll() {
    if (residents.length === 0) return;
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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>오늘의 케어 & 급여제공기록</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">일일 관찰 케어 입력</h1>
          <p className="mt-1 text-sm text-slate-600">
            당일 입실 어르신의 식사, 투약, 바이탈(혈압/체온), 신체활동 및 특이사항을 빠르게 기록합니다.
          </p>
        </div>
        {residents.length > 0 && (
          <Button onClick={applyNormalToAll} className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs">
            <CheckCircle2 size={16} />
            입실 어르신 전체 정상 일괄 적용
          </Button>
        )}
      </div>

      {message && (
        <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 text-xs font-bold text-sky-800">
          {message}
        </div>
      )}

      {/* Non-intrusive Social Work Practice Guidance Card */}
      <PracticeGuidanceCard reminder={unusualReminder} />

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${
            activeTab === "quick" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"
          }`}
          onClick={() => setActiveTab("quick")}
        >
          ⚡ 쾌속 칩 케어 입력
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${
            activeTab === "vitals" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"
          }`}
          onClick={() => setActiveTab("vitals")}
        >
          🩺 건강·바이탈 기록
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${
            activeTab === "meds" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"
          }`}
          onClick={() => setActiveTab("meds")}
        >
          💊 투약 케어
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-xs font-bold rounded-lg ${
            activeTab === "exceptions" ? "bg-sky-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50 border"
          }`}
          onClick={() => setActiveTab("exceptions")}
        >
          ⚠️ 특이사항 관찰
        </button>
      </div>

      {/* EMPTY STATE UI */}
      {residents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600 mb-1">
            <Users size={32} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">아직 등록된 이용자가 없습니다.</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              먼저 이용자 관리 메뉴에서 가상 이용자를 등록해주시면 일일 관찰 케어 기록을 작성하실 수 있습니다.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/residents">
              <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-10 px-5 shadow-md">
                <UserPlus size={16} />
                + 가상 이용자 등록하러 가기
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        /* Quick Resident Input Cards List */
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
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {r.gradeLabel}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            r.attendance === "입실"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {r.attendance} ({r.attendanceTime})
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {r.shuttleRoute} · 체온: {r.temperature} · 혈압: {r.bloodPressure}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        r.recordStatus === "작성완료"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.recordStatus}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-4 border-t border-slate-100 pt-4 space-y-4 text-xs">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {/* Lunch Meal */}
                      <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
                        <span className="font-bold text-slate-700 block">점심 식사 섭취</span>
                        <div className="flex gap-1">
                          {(["전량", "2/3", "1/2", "거부"] as const).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`flex-1 rounded py-1.5 font-bold transition text-xs ${
                                r.mealLunch === opt
                                  ? "bg-sky-600 text-white"
                                  : "bg-white border text-slate-600 hover:bg-slate-100"
                              }`}
                              onClick={() => updateResident(r.id, { mealLunch: opt })}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Afternoon Snack */}
                      <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
                        <span className="font-bold text-slate-700 block">오후 간식</span>
                        <div className="flex gap-1">
                          {(["완료", "미섭취"] as const).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`flex-1 rounded py-1.5 font-bold transition text-xs ${
                                r.mealSnack === opt
                                  ? "bg-sky-600 text-white"
                                  : "bg-white border text-slate-600 hover:bg-slate-100"
                              }`}
                              onClick={() => updateResident(r.id, { mealSnack: opt })}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Medication */}
                      <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
                        <span className="font-bold text-slate-700 block">투약 관리</span>
                        <div className="flex gap-1">
                          {(["완료", "해당없음", "미투약"] as const).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`flex-1 rounded py-1.5 font-bold transition text-xs ${
                                r.medication === opt
                                  ? "bg-sky-600 text-white"
                                  : "bg-white border text-slate-600 hover:bg-slate-100"
                              }`}
                              onClick={() => updateResident(r.id, { medication: opt })}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Health Status */}
                      <div className="space-y-1.5 rounded-lg bg-slate-50 p-3">
                        <span className="font-bold text-slate-700 block">건강 상태</span>
                        <div className="flex gap-1">
                          {(["양호", "건강이상", "주의요망"] as const).map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              className={`flex-1 rounded py-1.5 font-bold transition text-xs ${
                                r.healthStatus === opt
                                  ? opt === "양호"
                                    ? "bg-emerald-600 text-white"
                                    : "bg-amber-600 text-white"
                                  : "bg-white border text-slate-600 hover:bg-slate-100"
                              }`}
                              onClick={() => updateResident(r.id, { healthStatus: opt })}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Vitals Input */}
                    <div className="flex flex-wrap gap-4 items-center rounded-lg bg-slate-50 p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">혈압:</span>
                        <input
                          type="text"
                          value={r.bloodPressure}
                          onChange={(e) => updateResident(r.id, { bloodPressure: e.target.value })}
                          className="w-24 rounded border border-slate-300 bg-white p-1 text-center font-mono font-bold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700">체온:</span>
                        <input
                          type="text"
                          value={r.temperature}
                          onChange={(e) => updateResident(r.id, { temperature: e.target.value })}
                          className="w-20 rounded border border-slate-300 bg-white p-1 text-center font-mono font-bold"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <span className="font-bold text-slate-700 shrink-0">특이사항/관찰:</span>
                        <input
                          type="text"
                          value={r.cautionNotes || ""}
                          placeholder="오후 프로그램 참여를 원하지 않아 휴식함 등"
                          onChange={(e) => updateResident(r.id, { cautionNotes: e.target.value })}
                          className="w-full rounded border border-slate-300 bg-white p-1 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
