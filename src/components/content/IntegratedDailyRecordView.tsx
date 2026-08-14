"use client";

import { useMemo, useState } from "react";
import { Edit3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-auth-org";
import type {
  CommonActivity,
  IndividualCare,
  IndividualResponse,
  IntegratedResident,
  SectionKey
} from "@/types/integrated-care";

type Props = {
  resident: IntegratedResident;
  date: string;
  commonActivities: CommonActivity[];
  individualResponse?: IndividualResponse;
  individualCare?: IndividualCare;
  onOrganizeRecord: () => void;
  isOrganized: boolean;
};

type SectionItem = {
  key: SectionKey;
  title: string;
  isEntered: boolean;
  rawValues: string[];
  synthesizedText: string;
  isInternal: boolean;
};

export function IntegratedDailyRecordView({
  resident,
  date,
  commonActivities,
  individualResponse,
  individualCare,
  onOrganizeRecord,
  isOrganized
}: Props) {
  const currentUser = useCurrentUser();
  const [editingKey, setEditingKey] = useState<SectionKey | null>(null);
  const [customTexts, setCustomTexts] = useState<Record<string, string>>({});

  const morningActivity = commonActivities.find((a) => a.category === "신체") || commonActivities[0];
  const afternoonActivity = commonActivities.find((a) => a.category === "인지") || commonActivities[1];

  const sections: SectionItem[] = useMemo(() => {
    const care = individualCare;
    const resp = individualResponse;

    const items: SectionItem[] = [
      {
        key: "checkin",
        title: "1. 입실 · 송영",
        isEntered: Boolean(care?.checkinTime),
        rawValues: [
          care?.checkinTime ? `입실: ${care.checkinTime}` : "",
          care?.shuttleIn ? `등원: ${care.shuttleIn}` : "",
          care?.shuttleNote ? `노트: ${care.shuttleNote}` : ""
        ].filter(Boolean),
        synthesizedText: care?.checkinTime
          ? `오전 ${care.checkinTime}에 ${care.shuttleIn || "송영 차편"}으로 등원하셨으며, ${care.shuttleNote || "밝고 건강한 표정으로 등원 조력 완료함."}`
          : "아직 입력되지 않았습니다.",
        isInternal: false
      },
      {
        key: "vitals",
        title: "2. 건강 확인 · 활력징후",
        isEntered: Boolean(care?.temperature || care?.bloodPressure),
        rawValues: [
          care?.temperature ? `체온: ${care.temperature}` : "",
          care?.bloodPressure ? `혈압: ${care.bloodPressure}` : "",
          care?.bloodSugar ? `혈당: ${care.bloodSugar}` : "",
          care?.walkStatus ? `보행: ${care.walkStatus}` : ""
        ].filter(Boolean),
        synthesizedText: care?.temperature
          ? `체온 ${care.temperature}, 혈압 ${care.bloodPressure}로 측정되어 당일 활력징후 이상 소견 없으며, ${care.walkStatus || "자립 보행"}을 유지하심.`
          : "아직 입력되지 않았습니다.",
        isInternal: true
      },
      {
        key: "morning_activity",
        title: "3. 오전 활동",
        isEntered: Boolean(morningActivity),
        rawValues: [
          morningActivity ? `프로그램: ${morningActivity.title}` : "",
          resp?.engagement ? `참여도: ${resp.engagement}` : "",
          resp?.emotionalResponse ? `반응: ${resp.emotionalResponse}` : ""
        ].filter(Boolean),
        synthesizedText: morningActivity
          ? `오전 ${morningActivity.title} 프로그램에 ${resp?.engagement || "적극적으로"} 참여하셨으며, ${resp?.emotionalResponse || "즐거운"} 정서적 반응을 보이심.`
          : "아직 입력되지 않았습니다.",
        isInternal: false
      },
      {
        key: "meal",
        title: "4. 식사 · 수분",
        isEntered: Boolean(care?.meal),
        rawValues: [
          care?.meal ? `식사량: ${care.meal}` : "",
          care?.water ? `수분: ${care.water}` : "",
          care?.snack ? `간식: ${care.snack}` : ""
        ].filter(Boolean),
        synthesizedText: care?.meal
          ? `점심 식사는 제공량의 ${care.meal} 섭취하셨고 수분은 ${care.water || "보통"} 수준으로 소화 원활함.${care?.snack ? ` (간식: ${care.snack})` : ""}`
          : "아직 입력되지 않았습니다.",
        isInternal: false
      },
      {
        key: "medication",
        title: "5. 투약",
        isEntered: Boolean(care?.medicationState),
        rawValues: [
          care?.medicationState ? `투약: ${care.medicationState}` : "",
          care?.medicationNote ? `메모: ${care.medicationNote}` : ""
        ].filter(Boolean),
        synthesizedText: care?.medicationState
          ? `지정 투약: ${care.medicationState}.${care?.medicationNote ? ` (${care.medicationNote})` : ""}`
          : "아직 입력되지 않았습니다.",
        isInternal: true
      },
      {
        key: "excretion",
        title: "6. 배설",
        isEntered: Boolean(care?.excretion),
        rawValues: [care?.excretion ? `상태: ${care.excretion}` : ""].filter(Boolean),
        synthesizedText: care?.excretion ? `배설 현황: 당일 ${care.excretion} 상태로 특이 배설 케어 요구 없음.` : "아직 입력되지 않았습니다.",
        isInternal: true
      },
      {
        key: "sleep",
        title: "7. 휴식 · 수면",
        isEntered: Boolean(care?.sleep),
        rawValues: [care?.sleep ? `수면: ${care.sleep}` : ""].filter(Boolean),
        synthesizedText: care?.sleep ? `식후 및 오후 일정 중 약 ${care.sleep} 휴식을 취하여 체력 완충함.` : "아직 입력되지 않았습니다.",
        isInternal: false
      },
      {
        key: "afternoon_activity",
        title: "8. 오후 활동",
        isEntered: Boolean(afternoonActivity),
        rawValues: [
          afternoonActivity ? `프로그램: ${afternoonActivity.title}` : "",
          resp?.assistanceLevel ? `도움수준: ${resp.assistanceLevel}` : "",
          resp?.note ? `메모: ${resp.note}` : ""
        ].filter(Boolean),
        synthesizedText: afternoonActivity
          ? `오후 ${afternoonActivity.title}에 동참하여 ${resp?.assistanceLevel || "독립적으로"} 활동을 수행하셨음.${resp?.note ? ` ${resp.note}` : ""}`
          : "아직 입력되지 않았습니다.",
        isInternal: false
      },
      {
        key: "mood_walk",
        title: "9. 정서 · 행동 · 인지 · 이동 상태",
        isEntered: Boolean(care?.moodState || resp?.emotionalResponse),
        rawValues: [
          care?.moodState ? `정서: ${care.moodState}` : "",
          care?.walkStatus ? `이동: ${care.walkStatus}` : ""
        ].filter(Boolean),
        synthesizedText: `전반적인 정서 상태는 ${care?.moodState || resp?.emotionalResponse || "안정적"}이며 이동 시 안전 관찰 유지함.`,
        isInternal: false
      },
      {
        key: "notes",
        title: "10. 특이사항",
        isEntered: Boolean(care?.notes),
        rawValues: [care?.notes ? `내용: ${care.notes}` : ""].filter(Boolean),
        synthesizedText: care?.notes ? care.notes : "특이 행동 및 급격한 건강 변화 없음.",
        isInternal: true
      },
      {
        key: "actions",
        title: "11. 센터 조치",
        isEntered: Boolean(care?.actions && care.actions.length > 0),
        rawValues: care?.actions || [],
        synthesizedText: care?.actions && care.actions.length > 0 ? `센터 담당 조치: ${care.actions.join(", ")} 수행 완료.` : "추가 조치 필요 없음.",
        isInternal: true
      },
      {
        key: "guardian_notice",
        title: "12. 보호자 전달사항",
        isEntered: Boolean(care?.guardianNotice),
        rawValues: [care?.guardianNotice ? `구분: ${care.guardianNotice}` : ""].filter(Boolean),
        synthesizedText: care?.guardianNotice
          ? `보호자 안내: ${care.guardianNotice}.${care?.notes ? ` (${care.notes})` : ""}`
          : "아직 입력되지 않았습니다.",
        isInternal: false
      }
    ];

    return items;
  }, [individualCare, individualResponse, morningActivity, afternoonActivity]);

  const enteredCount = sections.filter((s) => s.isEntered).length;
  const completionRate = Math.round((enteredCount / 12) * 100);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Resident Header Profile Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-black text-base shadow-xs">
            {resident.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">{resident.name} 어르신</h2>
              <Badge className="bg-sky-100 text-sky-800 text-xs px-2 py-0.5">{resident.grade}</Badge>
              <span className="text-xs text-slate-500 font-semibold">{resident.careNumber}</span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              일자: {date} · 담당: {currentUser?.name ? `${currentUser.name} (${currentUser.roleLabel})` : "담당 사회복지사"} · 소속: {resident.group}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[11px] font-bold text-slate-500">기록 작성률</span>
            <span className="text-base font-black text-sky-700">{completionRate}%</span>
          </div>
          <Badge className={isOrganized ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
            {isOrganized ? "기록 정리 완료" : "초안 정리 대기"}
          </Badge>
        </div>
      </div>

      {/* AI Action Button & Rules Banner */}
      <div className="rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 p-4 space-y-2">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-bold text-sky-950 text-sm flex items-center gap-1.5">
              <Sparkles size={16} className="text-sky-600" /> 입력 내용으로 기록 정리
            </h3>
            <p className="text-xs text-sky-800">
              입력된 사실만 사용하여 12개 영역 통합 기록 문장으로 자동 정리합니다. (미입력 사실 임의 추가 금지)
            </p>
          </div>
          <Button className="bg-sky-600 hover:bg-sky-700 font-bold text-xs h-10 px-4 shrink-0" onClick={onOrganizeRecord}>
            <Sparkles size={14} /> 입력 내용으로 기록 정리
          </Button>
        </div>
        <div className="flex flex-wrap gap-3 text-[11px] text-sky-900 font-medium pt-1 border-t border-sky-200/60">
          <span>✅ 입력 사실만 문장화</span>
          <span>🔒 의학 진단 미생성</span>
          <span>🔍 사실-문장 추적 보장</span>
          <span>✏️ 정리 후 사용자 검토 필수</span>
        </div>
      </div>

      {/* 12 Fixed Structured Sections Preview */}
      <div className="space-y-3 pt-1">
        <h3 className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>📋 12개 표준 영역 통합 기록 구조</span>
          <span className="text-slate-400 font-normal">({enteredCount}/12 영역 입력됨)</span>
        </h3>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {sections.map((sec) => {
            const isEditing = editingKey === sec.key;
            const currentText = customTexts[sec.key] || sec.synthesizedText;

            return (
              <div
                key={sec.key}
                className={`rounded-lg border p-3 space-y-1.5 transition ${sec.isEntered ? "bg-white border-slate-200 shadow-2xs" : "bg-slate-50 border-dashed border-slate-200"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 flex items-center gap-1">
                    {sec.title}
                    {sec.isInternal ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">🔒 내부</span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800">💬 보호자</span>
                    )}
                  </span>
                  {sec.isEntered && (
                    <button
                      type="button"
                      className="text-[11px] font-bold text-sky-700 hover:underline flex items-center gap-0.5"
                      onClick={() => setEditingKey(isEditing ? null : sec.key)}
                    >
                      <Edit3 size={11} /> {isEditing ? "완료" : "수정"}
                    </button>
                  )}
                </div>

                {/* Raw Value Badges */}
                {sec.rawValues.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sec.rawValues.map((v, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                        {v}
                      </span>
                    ))}
                  </div>
                )}

                {/* Synthesized Text or Unentered Message */}
                {!sec.isEntered ? (
                  <p className="text-xs text-slate-400 font-medium italic">“아직 입력되지 않았습니다.”</p>
                ) : isEditing ? (
                  <textarea
                    className="w-full text-xs border border-slate-300 rounded p-2 focus:ring-2 focus:ring-sky-300 outline-none"
                    rows={2}
                    value={currentText}
                    onChange={(e) => setCustomTexts({ ...customTexts, [sec.key]: e.target.value })}
                  />
                ) : (
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">{isOrganized ? currentText : "입력값 적용 대기 중..."}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
