"use client";

import { Stethoscope, Utensils } from "lucide-react";
import { Input } from "@/components/ui/input";
import type {
  CareAction,
  ExcretionState,
  GuardianNoticeType,
  IndividualCare,
  IntegratedResident,
  MealAmount,
  MedicationState,
  MoodState,
  PrivacyScope,
  SleepState,
  WaterAmount
} from "@/types/integrated-care";

type Props = {
  residents: IntegratedResident[];
  activeResidentId: string;
  onSelectResident: (id: string) => void;
  careData: IndividualCare;
  onChangeCare: (updated: IndividualCare) => void;
};

const mealOptions: MealAmount[] = ["전량", "3/4", "절반", "1/4", "거의 미섭취", "거부"];
const waterOptions: WaterAmount[] = ["충분", "보통", "부족"];
const medicationOptions: MedicationState[] = ["없음", "예정대로 투약", "지연 투약", "투약 거부", "보호자 확인 필요"];
const excretionOptions: ExcretionState[] = ["정상", "배변", "배뇨", "변비", "설사", "실금", "도움 필요"];
const sleepOptions: SleepState[] = ["수면 없음", "30분 미만", "30~60분", "1시간 이상", "숙면", "뒤척임", "휴식만 함"];
const moodOptions: MoodState[] = ["안정", "활기참", "우울", "불안", "초조", "공격적 행동", "반복 행동", "인지 혼란"];
const actionList: CareAction[] = ["휴식 제공", "활력징후 재확인", "간호인력 확인", "보호자 연락", "병원 방문 권고", "시설장 보고", "추가 관찰", "기타"];
const noticeOptions: GuardianNoticeType[] = ["알림장 포함", "전달 필요 없음", "전화 필요", "긴급 연락", "내부 기록만"];

export function IndividualCareForm({ residents, activeResidentId, onSelectResident, careData, onChangeCare }: Props) {
  const activeResident = residents.find((r) => r.id === activeResidentId) || residents[0];

  function handleChange<K extends keyof IndividualCare>(key: K, value: IndividualCare[K]) {
    onChangeCare({ ...careData, [key]: value });
  }

  function handleScopeChange(field: string, scope: PrivacyScope) {
    onChangeCare({
      ...careData,
      privacyScopes: {
        ...(careData.privacyScopes || {}),
        [field]: scope
      }
    });
  }

  function toggleAction(act: CareAction) {
    const current = careData.actions || [];
    if (current.includes(act)) {
      handleChange("actions", current.filter((a) => a !== act));
    } else {
      handleChange("actions", [...current, act]);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <span>🏥 개별 케어 상세 입력</span>
        </h3>

        {/* Active Resident Selector Tab */}
        <select
          className="h-8 rounded-lg border border-sky-300 bg-sky-50 px-2 text-xs font-bold text-sky-900 outline-none"
          value={activeResidentId}
          onChange={(e) => onSelectResident(e.target.value)}
        >
          {residents.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} 어르신 ({r.grade})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {/* 건강 확인 & 활력징후 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Stethoscope size={13} className="text-rose-600" /> 건강 확인 · 활력징후
            </span>
            <PrivacyScopeSelector
              scope={careData.privacyScopes?.health || "internal_only"}
              onChange={(s) => handleScopeChange("health", s)}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">체온</label>
              <Input className="h-7 text-xs" value={careData.temperature} onChange={(e) => handleChange("temperature", e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">혈압</label>
              <Input className="h-7 text-xs" value={careData.bloodPressure} onChange={(e) => handleChange("bloodPressure", e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">혈당/맥박</label>
              <Input className="h-7 text-xs" value={careData.bloodSugar} onChange={(e) => handleChange("bloodSugar", e.target.value)} />
            </div>
          </div>
        </div>

        {/* 식사 & 수분 & 간식 */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 flex items-center gap-1">
              <Utensils size={13} className="text-amber-600" /> 식사 · 수분 · 간식
            </span>
            <PrivacyScopeSelector
              scope={careData.privacyScopes?.meal || "guardian_ok"}
              onChange={(s) => handleScopeChange("meal", s)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">점심 식사량</label>
              <select
                className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
                value={careData.meal}
                onChange={(e) => handleChange("meal", e.target.value as MealAmount)}
              >
                {mealOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 block mb-0.5">수분 섭취</label>
              <select
                className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
                value={careData.water}
                onChange={(e) => handleChange("water", e.target.value as WaterAmount)}
              >
                {waterOptions.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 투약 & 배설 & 수면 */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-0.5">투약 상태</label>
            <select
              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
              value={careData.medicationState}
              onChange={(e) => handleChange("medicationState", e.target.value as MedicationState)}
            >
              {medicationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-0.5">배설 상태</label>
            <select
              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
              value={careData.excretion}
              onChange={(e) => handleChange("excretion", e.target.value as ExcretionState)}
            >
              {excretionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-0.5">휴식/수면</label>
            <select
              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none"
              value={careData.sleep}
              onChange={(e) => handleChange("sleep", e.target.value as SleepState)}
            >
              {sleepOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 특이사항 & 센터 조치 & 보호자 전달 */}
        <div className="space-y-2">
          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-0.5">특이사항 및 신체 관찰</label>
            <Input
              className="h-7 text-xs"
              value={careData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="예: 귀가 전 무릎 가벼운 불편감 언급하셨으나 휴식 후 호전"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-1">센터 조치 사항 (다중 선택)</label>
            <div className="flex flex-wrap gap-1">
              {actionList.map((act) => {
                const selected = (careData.actions || []).includes(act);
                return (
                  <button
                    key={act}
                    type="button"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition ${selected ? "bg-rose-600 text-white border-rose-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    onClick={() => toggleAction(act)}
                  >
                    {act}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-700 block mb-0.5">보호자 전달 필요 여부</label>
            <select
              className="h-7 w-full rounded border border-slate-200 bg-white px-1.5 font-bold outline-none text-sky-900"
              value={careData.guardianNotice}
              onChange={(e) => handleChange("guardianNotice", e.target.value as GuardianNoticeType)}
            >
              {noticeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacyScopeSelector({ scope, onChange }: { scope: PrivacyScope; onChange: (s: PrivacyScope) => void }) {
  return (
    <select
      className={`h-6 rounded px-1.5 text-[10px] font-bold outline-none border ${scope === "internal_only" ? "bg-slate-100 text-slate-700 border-slate-300" : scope === "guardian_ok" ? "bg-sky-50 text-sky-800 border-sky-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}
      value={scope}
      onChange={(e) => onChange(e.target.value as PrivacyScope)}
    >
      <option value="internal_only">🔒 내부 기록만</option>
      <option value="guardian_ok">💬 보호자 공개 가능</option>
      <option value="auto_doc_ok">📄 문서 자동 반영</option>
      <option value="promo_ok">📢 홍보 활용 가능</option>
    </select>
  );
}
