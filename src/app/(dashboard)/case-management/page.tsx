"use client";

import { useState } from "react";
import { CheckCircle2, Plus, UserCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PracticeTimelineView from "@/components/erp/PracticeTimelineView";
import PracticeGuidanceCard from "@/components/erp/PracticeGuidanceCard";
import IntakeWizardModal from "@/components/erp/IntakeWizardModal";
import ReAssessmentCompareView from "@/components/erp/ReAssessmentCompareView";
import { SocialWorkReminderEngine } from "@/lib/social-work-reminder-engine";
import type { CaseConferenceRecord, IntakeData, NeedsAssessment } from "@/types/social-work-practice";

type SubTabKey =
  | "cases"
  | "timeline"
  | "intake_history"
  | "assessment"
  | "reassessment_compare"
  | "plans"
  | "conferences";

const MOCK_PREV_ASSESSMENT: NeedsAssessment = {
  id: "needs-prev-01",
  resident_id: "res-01",
  resident_name: "김순자 어르신",
  assessment_date: "2025-10-15",
  physical_needs: "자가 식사 및 보행 가능. 수저 사용 시 손떨림 미약함.",
  cognitive_needs: "날짜 및 장소 배회 없음. 단기 기억력 정상 수준.",
  emotional_needs: "우울감 없음. 자녀 방문 시 큰 만족감을 표현함.",
  family_needs: "주말 자녀 동거. 평일 주간보호 전일 이용 희망.",
  social_relationship_needs: "소극적 참여. 타 어르신과 대화 적음.",
  environment_needs: "문턱 제거 완료. 자택 화장실 안전손잡이 설치 필요.",
  worker_id: "w-01",
  worker_name: "김사회 복지사",
  created_at: "2025-10-15"
};

const MOCK_CURR_ASSESSMENT: NeedsAssessment = {
  id: "needs-curr-01",
  resident_id: "res-01",
  resident_name: "김순자 어르신",
  assessment_date: "2026-04-15",
  physical_needs: "점심 식사 섭취 속도 둔화. 수저 사용 보조 및 물 섭취 권유 관찰됨.",
  cognitive_needs: "단기 기억 저하 관찰. 미술/인지 프로그램 시 반복 설명 안내 필요.",
  emotional_needs: "우울감 미약. 오후 시간대 자녀 안부 전화 희망.",
  family_needs: "보호자 주말 케어 부담 다소 증가 호소.",
  social_relationship_needs: "원예 및 노래 교실에 적극적 관심 표출.",
  environment_needs: "자택 화장실 손잡이 설치 완료. 송영 시 차 휠체어 보조 요구.",
  worker_id: "w-02",
  worker_name: "박복지 사회복지사",
  created_at: "2026-04-15"
};

const MOCK_CONFERENCES: CaseConferenceRecord[] = [
  {
    id: "conf-01",
    resident_name: "강태호 어르신",
    conference_date: "2026-07-30",
    discussed_facts: "오후 시간대 어지럼증 호소 및 혈압 145/90 측정 증가 팩트 공유.",
    attendees: ["시설장", "사회복지사", "간호조무사"],
    worker_judgment: "투약 시간 대조 및 수분 섭취 일지 강화 필요.",
    decisions: [
      "일 2회 혈압 모니터링 및 처방약 재확인"
    ],
    assignee: "최간호 간호조무사",
    due_date: "2026-08-05",
    reflect_in_service_plan: true,
    share_with_guardian: true,
    followup_review_date: "2026-08-12",
    status: "in_progress"
  }
];

export default function CaseManagementPage() {
  const [activeTab, setActiveTab] = useState<SubTabKey>("cases");
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [intakeList, setIntakeList] = useState<IntakeData[]>([]);
  const [conferences, setConferences] = useState<CaseConferenceRecord[]>([]);
  const [createdTaskMessage, setCreatedTaskMessage] = useState("");

  // Conference 2-Field Form state
  const [newDiscussed, setNewDiscussed] = useState("");
  const [newDecision, setNewDecision] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("최간호 간호조무사");

  const reminder = SocialWorkReminderEngine.getCounselingReminder("강태호");

  const subtabs: { key: SubTabKey; label: string }[] = [
    { key: "cases", label: "📋 사례 목록" },
    { key: "intake_history", label: "📄 통합 인테이크 이력" },
    { key: "timeline", label: "🧭 실천 타임라인" },
    { key: "reassessment_compare", label: "🔄 재사정 Side-by-Side" },
    { key: "assessment", label: "🩺 사정평가" },
    { key: "plans", label: "📝 서비스계획" },
    { key: "conferences", label: "👥 사례회의 (2필드 30초 완료)" }
  ];

  const handleSaveIntake = (data: IntakeData, isDraft: boolean) => {
    setIntakeList((prev) => [data, ...prev]);
  };

  // Save 2-field Case Conference record
  const handleSave2FieldConference = () => {
    if (!newDiscussed || !newDecision) return;
    const newConf: CaseConferenceRecord = {
      id: `conf-${Date.now()}`,
      resident_name: "강태호 어르신",
      conference_date: new Date().toISOString().split("T")[0],
      discussed_facts: newDiscussed,
      attendees: ["사회복지사", "시설장"],
      worker_judgment: "현장 간속 기록 기반 작성 완료",
      decisions: [newDecision],
      assignee: taskAssignee,
      due_date: "2026-08-10",
      reflect_in_service_plan: false,
      share_with_guardian: false,
      followup_review_date: "2026-08-15",
      status: "in_progress"
    };

    setConferences((prev) => [newConf, ...prev]);
    setNewDiscussed("");
    setNewDecision("");
  };

  // 30-Second Task Creation (Auto-populates decision text)
  const handleCreateTaskFromConference = (conf: CaseConferenceRecord) => {
    setCreatedTaskMessage(`⚡ [사례회의 30초 Task 생성] 결정사항("${conf.decisions[0]}") ➔ 담당자(${conf.assignee})에게 업무 요청이 자동 발행되었습니다!`);
    setTimeout(() => setCreatedTaskMessage(""), 4000);
  };

  const handleTogglePlanReflection = (confId: string) => {
    setConferences((prev) =>
      prev.map((c) => (c.id === confId ? { ...c, reflect_in_service_plan: !c.reflect_in_service_plan } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge className="bg-sky-600 text-white font-bold">사회복지사 전문 영역</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">사례관리 센터</h1>
          <p className="mt-1 text-sm text-slate-600">
            신규 통합 인테이크, 6대 욕구사정, 재사정 대조, 사례회의 2필드 간소화 입력을 관리합니다.
          </p>
        </div>
        <Button
          onClick={() => setIsIntakeModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 font-bold flex items-center gap-1.5"
        >
          <Plus size={18} />
          <span>신규 이용자 빠른 등록 (2분 완료)</span>
        </Button>
      </div>

      {/* Integrated Intake Wizard Modal */}
      <IntakeWizardModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSave={handleSaveIntake}
      />

      {/* Non-intrusive 1-Line Social Work Practice Guidance Card */}
      <PracticeGuidanceCard reminder={reminder} />

      {/* Sub Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
        {subtabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg border transition ${
              activeTab === t.key
                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {activeTab === "timeline" && <PracticeTimelineView residentName="강태호" />}

        {activeTab === "reassessment_compare" && (
          <ReAssessmentCompareView
            residentName="김순자"
            prevAssessment={MOCK_PREV_ASSESSMENT}
            currAssessment={MOCK_CURR_ASSESSMENT}
            onSaveInterpretation={(interp, planReview) => {
              console.log("Saved interpretation:", interp, planReview);
            }}
          />
        )}

        {activeTab === "intake_history" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">통합 인테이크 등록 및 진행 이력</h2>
              <Button
                onClick={() => setIsIntakeModalOpen(true)}
                className="bg-sky-600 text-white font-bold text-xs h-8 px-3"
              >
                + 빠른 이용자 등록 (2분 완료)
              </Button>
            </div>

            {intakeList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                등록된 인테이크 이력이 없습니다. 빠른 등록 버튼으로 2분 이내 등록을 진행하세요.
              </div>
            ) : (
              <div className="space-y-3">
                {intakeList.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-white space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.resident_name || "이름 미입력"} 어르신 ({item.care_level})</span>
                      <Badge className={item.status === "draft" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}>
                        {item.status === "draft" ? "임시저장" : "빠른등록완료"}
                      </Badge>
                    </div>
                    <p className="text-slate-600 line-clamp-2">
                      초기상담: {item.initial_counseling || "(기록 내용)"}
                    </p>
                    <div className="text-[11px] text-slate-400">담당 복지사: {item.assigned_worker} | 등록일: {item.created_at}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "cases" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">진행 중 사례</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{intakeList.length + conferences.length}건</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">이번달 신규 사례</span>
                <div className="text-2xl font-black text-sky-600 mt-1">{intakeList.length}건</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">종결된 사례</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">0건</div>
              </div>
            </div>

            {intakeList.length === 0 && conferences.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed text-xs space-y-1">
                <p className="font-bold text-slate-600">아직 등록된 사례관리 이력이 없습니다.</p>
                <p className="text-[11px] text-slate-400">
                  신규 이용자 빠른 등록을 통해 인테이크를 입력하시면 사례 목록이 생성됩니다.
                </p>
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3">어르신</th>
                    <th className="p-3">사례 유형</th>
                    <th className="p-3">담당 사회복지사</th>
                    <th className="p-3">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                  {intakeList.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-3 font-bold">{item.resident_name || "가상 이용자"} 어르신</td>
                      <td className="p-3">초기 인테이크 및 욕구 사정</td>
                      <td className="p-3">{item.assigned_worker || "사회복지사"}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sky-800 font-bold">진행중</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              어르신 사정평가 (욕구·낙상·욕창·CIST)
            </h2>
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
              아직 등록된 정기 사정평가가 없습니다. 이용자 등록 후 사정평가를 작성해주세요.
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              개별 급여제공계획 (Care Plan)
            </h2>
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
              아직 등록된 급여제공계획서가 없습니다.
            </div>
          </div>
        )}

        {/* Simplified 2-Field Case Conference Subtab */}
        {activeTab === "conferences" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">사례회의 2필드 간소화 입력 및 30초 Task 생성</h2>
                <span className="text-slate-500 font-medium">
                  회의 진행 중에는 오직 <strong>[논의 내용]</strong>과 <strong>[결정사항]</strong> 2개만 기록하고, Task 생성 시 내용이 자동 채워집니다.
                </span>
              </div>
              <Badge className="bg-amber-500 text-white font-bold text-[10px]">
                ⚡ 회의 중 입력 필드 단 2개
              </Badge>
            </div>

            {/* Quick 2-Field Input Form */}
            <div className="bg-sky-50/60 border border-sky-200 rounded-xl p-4 space-y-3">
              <h3 className="font-extrabold text-sky-950 flex items-center gap-1.5">
                <Zap size={16} className="text-amber-500" /> 사례회의 2필드 간편 기록
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">1. 논의 내용 *</label>
                  <input
                    type="text"
                    value={newDiscussed}
                    onChange={(e) => setNewDiscussed(e.target.value)}
                    placeholder="예: 어르신 오후 어지럼증 호소 팩트 공유"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">2. 결정사항 *</label>
                  <input
                    type="text"
                    value={newDecision}
                    onChange={(e) => setNewDecision(e.target.value)}
                    placeholder="예: 일 2회 혈압 측정 및 보호자약 재확인"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold">담당자 선택:</span>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="text-xs p-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="최간호 간호조무사">최간호 간호조무사</option>
                    <option value="박복지 사회복지사">박복지 사회복지사</option>
                    <option value="이요양 요양보호사">이요양 요양보호사</option>
                  </select>
                </div>
                <Button
                  onClick={handleSave2FieldConference}
                  disabled={!newDiscussed || !newDecision}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-8 px-4"
                >
                  <Plus size={14} /> 사례회의록 저장
                </Button>
              </div>
            </div>

            {createdTaskMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{createdTaskMessage}</span>
              </div>
            )}

            {/* List of Conferences */}
            <div className="space-y-4">
              {conferences.map((conf) => (
                <div key={conf.id} className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-sky-600 text-white font-bold text-[10px]">{conf.resident_name}</Badge>
                      <span className="font-extrabold text-slate-900 text-xs">사례회의 (일자: {conf.conference_date})</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">담당자: {conf.assignee}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">논의 내용</span>
                      <p className="font-semibold text-slate-800">{conf.discussed_facts}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-sky-600 block">결정사항</span>
                      <p className="font-extrabold text-slate-900">{conf.decisions[0]}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={conf.reflect_in_service_plan}
                        onChange={() => handleTogglePlanReflection(conf.id)}
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span>서비스계획 수동 반영 선택</span>
                    </label>

                    <Button
                      onClick={() => handleCreateTaskFromConference(conf)}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-7 px-3 flex items-center gap-1 shrink-0"
                    >
                      <Zap size={13} />
                      <span>30초 업무 요청(Task) 자동 생성</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
