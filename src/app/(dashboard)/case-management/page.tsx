"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Plus, UserCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PracticeTimelineView from "@/components/erp/PracticeTimelineView";
import PracticeGuidanceCard from "@/components/erp/PracticeGuidanceCard";
import IntakeWizardModal from "@/components/erp/IntakeWizardModal";
import ReAssessmentCompareView from "@/components/erp/ReAssessmentCompareView";
import { SocialWorkReminderEngine } from "@/lib/social-work-reminder-engine";
import type { CaseConferenceRecord, IntakeData, NeedsAssessment } from "@/types/social-work-practice";
import type { Resident } from "@/data/mock-daycare-store";
import { useCurrentUser } from "@/hooks/use-auth-org";

type SubTabKey =
  | "cases"
  | "timeline"
  | "intake_history"
  | "assessment"
  | "reassessment_compare"
  | "plans"
  | "conferences";

export default function CaseManagementPage() {
  const currentUser = useCurrentUser();
  const [activeTab, setActiveTab] = useState<SubTabKey>("cases");
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [intakeList, setIntakeList] = useState<IntakeData[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [conferences, setConferences] = useState<CaseConferenceRecord[]>([]);
  const [createdTaskMessage, setCreatedTaskMessage] = useState("");

  // Conference 2-Field Form state
  const [conferenceResident, setConferenceResident] = useState("");
  const [newDiscussed, setNewDiscussed] = useState("");
  const [newDecision, setNewDecision] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("간호조무사");

  // Load Single Source of Truth on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const rawRes = localStorage.getItem("silvercare.residents");
      if (rawRes) {
        try {
          const parsed = JSON.parse(rawRes);
          if (Array.isArray(parsed)) {
            setResidents(parsed);
            if (parsed.length > 0) {
              setConferenceResident(parsed[0].name);
            }
          }
        } catch {
          setResidents([]);
        }
      }

      const rawIntakes = localStorage.getItem("silvercare.intakes");
      if (rawIntakes) {
        try {
          const parsedIntakes = JSON.parse(rawIntakes);
          if (Array.isArray(parsedIntakes)) {
            setIntakeList(parsedIntakes);
          }
        } catch {
          setIntakeList([]);
        }
      }

      const rawConfs = localStorage.getItem("silvercare.conferences");
      if (rawConfs) {
        try {
          const parsedConfs = JSON.parse(rawConfs);
          if (Array.isArray(parsedConfs)) {
            setConferences(parsedConfs);
          }
        } catch {
          setConferences([]);
        }
      }
    }
  }, []);

  const activeResidentName = intakeList[0]?.resident_name || residents[0]?.name || "";
  const reminder = activeResidentName ? SocialWorkReminderEngine.getCounselingReminder(activeResidentName) : null;

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
    const updated = [data, ...intakeList.filter((i) => i.id !== data.id)];
    setIntakeList(updated);

    // Refresh resident list
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("silvercare.residents");
      if (raw) {
        try {
          setResidents(JSON.parse(raw));
        } catch {
          // ignore
        }
      }
    }
  };

  // Save 2-field Case Conference record
  const handleSave2FieldConference = () => {
    if (!newDiscussed.trim() || !newDecision.trim()) return;

    const resName = conferenceResident || activeResidentName || "이용자";
    const newConf: CaseConferenceRecord = {
      id: `conf-${Date.now()}`,
      resident_name: resName,
      conference_date: new Date().toISOString().split("T")[0],
      discussed_facts: newDiscussed.trim(),
      attendees: [currentUser?.roleLabel || "사회복지사", "시설장"],
      worker_judgment: "현장 간소 기록 기반 작성 완료",
      decisions: [newDecision.trim()],
      assignee: taskAssignee,
      due_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      reflect_in_service_plan: false,
      share_with_guardian: false,
      followup_review_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      status: "in_progress"
    };

    const updated = [newConf, ...conferences];
    setConferences(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("silvercare.conferences", JSON.stringify(updated));
    }
    setNewDiscussed("");
    setNewDecision("");
  };

  // 30-Second Task Creation (Auto-populates decision text)
  const handleCreateTaskFromConference = (conf: CaseConferenceRecord) => {
    setCreatedTaskMessage(`⚡ [사례회의 30초 Task 생성] 결정사항("${conf.decisions[0]}") ➔ 담당자(${conf.assignee})에게 업무 요청이 자동 발행되었습니다!`);
    setTimeout(() => setCreatedTaskMessage(""), 4000);
  };

  const handleTogglePlanReflection = (confId: string) => {
    const updated = conferences.map((c) =>
      c.id === confId ? { ...c, reflect_in_service_plan: !c.reflect_in_service_plan } : c
    );
    setConferences(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("silvercare.conferences", JSON.stringify(updated));
    }
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
      {reminder && <PracticeGuidanceCard reminder={reminder} />}

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
        {activeTab === "timeline" && (
          <PracticeTimelineView
            residentName={activeResidentName}
            timelineSteps={[]}
          />
        )}

        {activeTab === "reassessment_compare" && (
          <ReAssessmentCompareView
            residentName={activeResidentName}
            prevAssessment={null}
            currAssessment={null}
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
                      초기상담: {item.initial_counseling || "(기록 내용 없음)"}
                    </p>
                    <div className="text-[11px] text-slate-400">
                      담당 복지사: {item.assigned_worker || "담당자 미지정"} | 등록일: {item.created_at}
                    </div>
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
                  {conferences.map((conf, idx) => (
                    <tr key={`conf-${idx}`}>
                      <td className="p-3 font-bold">{conf.resident_name} 어르신</td>
                      <td className="p-3">사례회의 ({conf.discussed_facts.slice(0, 20)}...)</td>
                      <td className="p-3">{conf.assignee || "담당자"}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-indigo-800 font-bold">회의완료</span>
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
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">대상 어르신</label>
                  {residents.length > 0 ? (
                    <select
                      value={conferenceResident}
                      onChange={(e) => setConferenceResident(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                    >
                      {residents.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name} 어르신 ({r.grade})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={conferenceResident}
                      onChange={(e) => setConferenceResident(e.target.value)}
                      placeholder="대상 어르신 성명 입력"
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white font-semibold"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">1. 논의 내용 *</label>
                  <input
                    type="text"
                    value={newDiscussed}
                    onChange={(e) => setNewDiscussed(e.target.value)}
                    placeholder="예: 오후 시간대 어지럼증 호소 관찰 팩트 공유"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">2. 결정사항 *</label>
                  <input
                    type="text"
                    value={newDecision}
                    onChange={(e) => setNewDecision(e.target.value)}
                    placeholder="예: 일 2회 혈압 측정 및 보호자 복약 재확인"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-bold">업무 담당자:</span>
                  <input
                    type="text"
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    placeholder="담당자명 (예: 간호조무사)"
                    className="p-1.5 px-2.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                  />
                </div>
                <Button
                  onClick={handleSave2FieldConference}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9 px-4"
                >
                  <CheckCircle2 size={16} />
                  <span>사례회의 기록 저장</span>
                </Button>
              </div>
            </div>

            {createdTaskMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-xs rounded-xl flex items-center gap-2">
                <Zap size={16} className="text-emerald-600" />
                <span>{createdTaskMessage}</span>
              </div>
            )}

            {/* Conference Records List */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900">최근 사례회의 이력</h3>
              {conferences.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                  등록된 사례회의 기록이 없습니다. 위 간편 입력을 통해 2개 필드만으로 회의를 기록하세요.
                </div>
              ) : (
                conferences.map((conf) => (
                  <div key={conf.id} className="p-4 border rounded-xl bg-white space-y-3">
                    <div className="flex justify-between items-center font-bold text-slate-900 border-b pb-2">
                      <span className="text-sky-700">{conf.resident_name} 사례회의 ({conf.conference_date})</span>
                      <span className="text-[11px] text-slate-400">참석: {conf.attendees.join(", ")}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                      <div className="p-2.5 bg-slate-50 rounded-lg">
                        <span className="font-bold text-slate-500 block mb-1">💬 논의 내용</span>
                        <p>{conf.discussed_facts}</p>
                      </div>
                      <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded-lg">
                        <span className="font-bold text-amber-800 block mb-1">🎯 결정사항</span>
                        <p className="font-semibold text-amber-950">{conf.decisions[0]}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px]">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleTogglePlanReflection(conf.id)}
                          className={`px-2.5 py-1 rounded-md font-bold transition ${
                            conf.reflect_in_service_plan
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {conf.reflect_in_service_plan ? "✓ 급여계획 반영 설정됨" : "+ 급여계획 연계"}
                        </button>
                      </div>
                      <Button
                        onClick={() => handleCreateTaskFromConference(conf)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-7 px-3 flex items-center gap-1"
                      >
                        <Zap size={13} className="text-amber-400" />
                        <span>30초 Task 생성</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
