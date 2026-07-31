"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Plus,
  Save,
  Send,
  Smartphone,
  Sparkles,
  UserCheck,
  Zap
} from "lucide-react";
import type { IntegratedResident } from "@/types/integrated-care";
import type { FieldRecord } from "./MobileFieldLogger";

type Props = {
  residents: IntegratedResident[];
  selectedResidentId: string;
  onSelectResident: (id: string) => void;
  fieldRecords: FieldRecord[];
  onSaveFieldRecord: (record: FieldRecord) => void;
  onGenerateDocQuick: (docTitle: string) => void;
  onSwitchToDesktop: () => void;
};

export function MobileFieldStudio({
  residents,
  selectedResidentId,
  onSelectResident,
  fieldRecords,
  onSaveFieldRecord,
  onGenerateDocQuick,
  onSwitchToDesktop
}: Props) {
  // Mobile Tab Navigation: 'checkin' | 'field' | 'quick_care' | 'docs'
  const [mobileTab, setMobileTab] = useState<"checkin" | "field" | "quick_care" | "docs">("field");

  // Mobile quick form state
  const activeResident = useMemo(() => {
    return residents.find((r) => r.id === selectedResidentId) || residents[0];
  }, [residents, selectedResidentId]);

  const [category, setCategory] = useState<FieldRecord["category"]>("병원동행");
  const [location, setLocation] = useState("행복종합병원 내과");
  const [note, setNote] = useState("혈압/당뇨 정기검진 동행. 이상 소견 없으며 수령약 전달함.");
  const [actionsTaken, setActionsTaken] = useState("차량 안전 수송 및 원내 간호팀 전달 완료");

  // Quick 1-tap care states
  const [quickMeal, setQuickMeal] = useState("전량 섭취");
  const [quickMedication, setQuickMedication] = useState("식후 정량 투약");
  const [quickNote, setQuickNote] = useState("");
  const [notification, setNotification] = useState("");

  function handleSaveMobileField() {
    const newRecord: FieldRecord = {
      id: `field-${Date.now()}`,
      residentId: selectedResidentId,
      residentName: activeResident.name,
      category,
      timeStr: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      location,
      note,
      actionsTaken,
      createdAt: new Date().toISOString()
    };

    onSaveFieldRecord(newRecord);
    setNotification(`📱 [${activeResident.name} 어르신] 현장 기록이 등록되었습니다!`);
    setTimeout(() => setNotification(""), 3000);
  }

  function handleSaveQuickCare() {
    setNotification(`⚡ [${activeResident.name} 어르신] 케어 팩트가 등록되었습니다.`);
    setTimeout(() => setNotification(""), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-20 text-xs">
      {/* 📱 Mobile Top App Header */}
      <div className="sticky top-0 z-30 bg-slate-900 text-white p-3 shadow-md border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="text-emerald-400" size={18} />
            <div>
              <h1 className="font-extrabold text-sm text-white">행복케어 모바일 현장 모드</h1>
              <p className="text-[10px] text-slate-400 font-medium">외근 및 현장 케어 전용 터치 UX</p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="h-7 text-[10px] font-bold px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            onClick={onSwitchToDesktop}
          >
            💻 데스크톱 뷰
          </Button>
        </div>

        {/* Resident Horizontal Scroll Tabs */}
        <div className="flex overflow-x-auto gap-1.5 pt-2.5 pb-0.5 border-t border-slate-800/80 mt-2">
          {residents.map((r) => {
            const isActive = r.id === selectedResidentId;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectResident(r.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
                  isActive ? "bg-emerald-500 text-slate-950 shadow-xs font-black" : "bg-slate-800 text-slate-300"
                }`}
              >
                {r.name} ({r.attendanceStatus})
              </button>
            );
          })}
        </div>
      </div>

      {notification && (
        <div className="m-3 p-2.5 bg-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 📁 Mobile Tab View Contents */}
      <div className="p-3 space-y-3">
        {/* TAB 1: 📱 외근 현장 기록 */}
        {mobileTab === "field" && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                  <Smartphone size={16} className="text-emerald-600" />
                  <span>외근/현장 케어 기록 입력 ({activeResident.name} 어르신)</span>
                </span>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">현장 간편 모드</Badge>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">외근/현장 유형</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    ["병원동행", "🏥 병원 동행"],
                    ["야외나들이", "🌳 야외 산책/나들이"],
                    ["방문케어", "🚗 방문 가정 케어"],
                    ["장보기", "🛍️ 야외활동/장보기"]
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCategory(val as FieldRecord["category"])}
                      className={`h-9 rounded-xl font-bold text-xs border transition ${
                        category === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">장소/기관명</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-medium text-xs text-slate-900"
                  placeholder="장소 입력"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">현장 관찰 내용 (모바일 메모)</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed"
                  placeholder="어르신의 상태 및 현장 반응"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">조치 사항</label>
                <input
                  type="text"
                  value={actionsTaken}
                  onChange={(e) => setActionsTaken(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-medium text-xs text-slate-900"
                />
              </div>

              <Button
                onClick={handleSaveMobileField}
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Save size={16} /> 📱 모바일 현장 기록 저장 (20종 문서 반영)
              </Button>
            </div>

            {/* List of Today's Field Records */}
            <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 text-xs block border-b border-slate-100 pb-2">
                📌 오늘 수집된 외근 기록 ({fieldRecords.length}건)
              </span>

              {fieldRecords.length > 0 ? (
                fieldRecords.map((r) => (
                  <div key={r.id} className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-950 text-xs">
                        [{r.category}] {r.residentName} 어르신 ({r.timeStr})
                      </span>
                      <span className="text-[10px] text-slate-400">{r.location}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{r.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-3 text-xs">등록된 현장 기록이 없습니다.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ⚡ 1-Tap 터치 케어 입력 */}
        {mobileTab === "quick_care" && (
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-sm">⚡ 1-Tap 터치 케어 입력 ({activeResident.name} 어르신)</h2>
              <p className="text-[11px] text-slate-500">모바일 현장에서 원터치 버튼으로 빠르게 기록합니다.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">식사 섭취 상태</label>
                <div className="grid grid-cols-3 gap-2">
                  {["전량 섭취", "1/2 이상 섭취", "소량/거부"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuickMeal(m)}
                      className={`h-10 rounded-xl font-bold text-xs border ${
                        quickMeal === m ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">투약 상태</label>
                <div className="grid grid-cols-2 gap-2">
                  {["식후 정량 투약", "투약 확인 필요"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setQuickMedication(m)}
                      className={`h-10 rounded-xl font-bold text-xs border ${
                        quickMedication === m ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">특이 메모</label>
                <input
                  type="text"
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"
                  placeholder="예: 기분 활기참, 무릎 휴식"
                />
              </div>

              <Button
                onClick={handleSaveQuickCare}
                className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                <Zap size={16} /> 1-Tap 터치 기록 저장
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: 📑 생성 문서 빠르게 보기 */}
        {mobileTab === "docs" && (
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-sm">📑 모바일 빠른 문서 보기 ({activeResident.name} 어르신)</h2>
              <p className="text-[11px] text-slate-500">모바일에서 주요 20종 문서를 빠르게 확인하고 바로 발송합니다.</p>
            </div>

            <div className="space-y-2">
              {[
                "1. 보호자 일일 알림장",
                "2. 보호자 문자 요약 (SMS)",
                "3. 카카오 알림톡 문안",
                "6. 장기요양급여 제공기록 문안",
                "11. 직원 인수인계 문안"
              ].map((docTitle) => (
                <div key={docTitle} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">{docTitle}</span>
                    <Badge className="bg-emerald-100 text-emerald-800 text-[10px]">생성 완료</Badge>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    [{activeResident.name} 어르신] 오늘 식사 전량 섭취, 오전 칠교놀이 모범 참여, 무릎 휴식 후 안전 귀가 완료.
                  </p>

                  <div className="flex gap-2 pt-1">
                    <Button
                      onClick={() => onGenerateDocQuick(docTitle)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-8"
                    >
                      <Send size={13} /> 바로 발송하기
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ⏱️ 등하원/출결 체크 */}
        {mobileTab === "checkin" && (
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200 space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-sm">⏱️ 오늘 출결 및 등하원 현황</h2>
              <p className="text-[11px] text-slate-500">어르신의 등하원 시간을 모바일에서 실시간 확인합니다.</p>
            </div>

            <div className="space-y-2">
              {residents.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div>
                    <span className="font-extrabold text-slate-900 text-xs">{r.name} 어르신</span>
                    <p className="text-[10px] text-slate-400 font-medium">08:45 등원 | 16:30 하원 예정</p>
                  </div>
                  <Badge className={r.attendanceStatus === "출석" ? "bg-emerald-100 text-emerald-800 font-bold" : "bg-slate-200 text-slate-700"}>
                    {r.attendanceStatus}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 📱 Mobile Fixed Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white border-t border-slate-800 flex items-center justify-around h-16 px-2 shadow-2xl">
        <button
          type="button"
          onClick={() => setMobileTab("field")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            mobileTab === "field" ? "text-emerald-400 font-extrabold" : "text-slate-400"
          }`}
        >
          <Smartphone size={18} />
          <span className="text-[10px]">외근기록</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("quick_care")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            mobileTab === "quick_care" ? "text-emerald-400 font-extrabold" : "text-slate-400"
          }`}
        >
          <Zap size={18} />
          <span className="text-[10px]">1-Tap터치</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("docs")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            mobileTab === "docs" ? "text-emerald-400 font-extrabold" : "text-slate-400"
          }`}
        >
          <FileText size={18} />
          <span className="text-[10px]">생성문서</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab("checkin")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
            mobileTab === "checkin" ? "text-emerald-400 font-extrabold" : "text-slate-400"
          }`}
        >
          <Clock size={18} />
          <span className="text-[10px]">출결현황</span>
        </button>
      </div>
    </div>
  );
}
