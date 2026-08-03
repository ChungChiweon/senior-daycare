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
  | "monitoring"
  | "evaluations"
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
    discussed_facts: "최근 오후 시간대 어지럼증 호소 및 혈압 145/90 측정 증가 팩트 공유.",
    attendees: ["김시설 시설장", "박복지 사회복지사", "최간호 간호조무사", "이요양 보호사"],
    worker_judgment: "투약 수유 시간 대조 및 수분 섭취 일지 강화 필요. 무리한 체조 차단.",
    decisions: [
      "1. 일 2회(오전/오후) 혈압 모니터링 수행",
      "2. 보호자 상담을 통한 처방약 재확인",
      "3. 휠체어 송영 지원 변경 여부 검토"
    ],
    assignee: "최간호 간호조무사 / 박복지 사회복지사",
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
  const [conferences, setConferences] = useState<CaseConferenceRecord[]>(MOCK_CONFERENCES);
  const [createdTaskMessage, setCreatedTaskMessage] = useState("");

  const reminder = SocialWorkReminderEngine.getCounselingReminder("강태호");

  const subtabs: { key: SubTabKey; label: string }[] = [
    { key: "cases", label: "📋 사례 목록" },
    { key: "intake_history", label: "📄 통합 인테이크 이력" },
    { key: "timeline", label: "🧭 실천 타임라인 (Practice Timeline)" },
    { key: "reassessment_compare", label: "🔄 재사정 Side-by-Side 대조" },
    { key: "assessment", label: "🩺 사정평가 (욕구·낙상·욕창·CIST)" },
    { key: "plans", label: "📝 서비스계획 (Care Plan)" },
    { key: "conferences", label: "👥 사례회의 & 후속조치 연동" }
  ];

  const handleSaveIntake = (data: IntakeData, isDraft: boolean) => {
    setIntakeList((prev) => [data, ...prev]);
  };

  const handleCreateTaskFromConference = (conf: CaseConferenceRecord) => {
    setCreatedTaskMessage(`⚡ [사례회의 결정사항] 어르신 [${conf.resident_name}] 관련 ERP 후속 업무 요청(Task)이 담당자(${conf.assignee})에게 성공적으로 발행되었습니다!`);
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
            신규 통합 인테이크, 6대 욕구사정, 재사정 대조, 사례회의 후속조치 및 개별 급여제공계획을 통합 관리합니다.
          </p>
        </div>
        <Button
          onClick={() => setIsIntakeModalOpen(true)}
          className="bg-sky-600 hover:bg-sky-700 font-bold flex items-center gap-1.5"
        >
          <Plus size={18} />
          <span>신규 이용자 통합 인테이크 등록</span>
        </Button>
      </div>

      {/* Integrated Intake Wizard Modal */}
      <IntakeWizardModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSave={handleSaveIntake}
      />

      {/* Non-intrusive Social Work Practice Guidance Card */}
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
                + 신규 인테이크 등록
              </Button>
            </div>

            {intakeList.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                등록된 신규 인테이크 이력이 없습니다. 위 버튼을 눌러 7단계 인테이크를 시작하세요.
              </div>
            ) : (
              <div className="space-y-3">
                {intakeList.map((item, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-white space-y-2">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{item.resident_name || "이름 미입력"} 어르신 ({item.care_level})</span>
                      <Badge className={item.status === "draft" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}>
                        {item.status === "draft" ? "임시저장" : "등록완료"}
                      </Badge>
                    </div>
                    <p className="text-slate-600 line-clamp-2">
                      초기상담: {item.initial_counseling || "(상담 내용 미입력)"}
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
                <div className="text-2xl font-black text-slate-900 mt-1">6건</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">이번달 신규 사례</span>
                <div className="text-2xl font-black text-sky-600 mt-1">2건</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                <span className="text-xs font-bold text-slate-400">종결된 사례</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">1건</div>
              </div>
            </div>

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
                <tr>
                  <td className="p-3 font-bold">강태호 어르신</td>
                  <td className="p-3">건강 악화 및 혈압 상승 대응</td>
                  <td className="p-3">박지영</td>
                  <td className="p-3">
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sky-800 font-bold">진행중</span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">윤복순 어르신</td>
                  <td className="p-3">낙상 위험 집중 보행 관리</td>
                  <td className="p-3">박지영</td>
                  <td className="p-3">
                    <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-sky-800 font-bold">진행중</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              어르신 사정평가 (욕구·낙상·욕창·CIST)
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-4 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>김순자 어르신 (재사정)</span>
                  <span className="text-slate-400">2026-07-15</span>
                </div>
                <div className="text-slate-600">낙상위험: 중위험(8점) | CIST: 22점(경도인지) | 신체소근육 유연성 유지 욕구</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              개별 급여제공계획 (Care Plan)
            </h2>
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 font-semibold space-y-2">
              <div className="font-bold text-sm">윤복순 어르신 낙상 예방 및 보행 안정 케어플랜</div>
              <p>주 3회 하체 근력 체조, 이동 시 요양보호사 1대1 조력, 슬리퍼 대신 미끄럼방지 양말 착용</p>
            </div>
          </div>
        )}

        {/* Case Conference Studio Subtab */}
        {activeTab === "conferences" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">다학제 사례회의 기록 및 후속조치 연동 Studio</h2>
                <span className="text-slate-500 font-medium">
                  사례회의 결정사항을 서비스계획에 즉시 수동 반영하고 ERP 업무 요청(Task)으로 전환합니다.
                </span>
              </div>
              <Badge className="bg-slate-900 text-white font-bold text-[10px]">
                👤 사회복지사 수동 선택 필수 (자동 반영 차단)
              </Badge>
            </div>

            {createdTaskMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{createdTaskMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              {conferences.map((conf) => (
                <div key={conf.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50 space-y-4">
                  {/* Conf Top Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-sky-600 text-white font-bold text-[10px]">{conf.resident_name}</Badge>
                      <span className="font-extrabold text-slate-900 text-sm">사례회의록 (일자: {conf.conference_date})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500 font-medium">처리기한: {conf.due_date}</span>
                      <Badge className={conf.status === "completed" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"}>
                        {conf.status === "in_progress" ? "후속조치 진행중" : "완료"}
                      </Badge>
                    </div>
                  </div>

                  {/* Facts & Attendees */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">1. 논의된 관찰 팩트</span>
                      <p className="font-medium text-slate-800">{conf.discussed_facts}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 block">2. 참석자</span>
                      <div className="flex flex-wrap gap-1">
                        {conf.attendees.map((att, i) => (
                          <Badge key={i} className="bg-slate-100 text-slate-700 text-[10px]">
                            {att}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Worker Judgment */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-sky-600 block flex items-center gap-1">
                      <UserCheck size={12} /> 3. 사회복지사 전문 판단
                    </span>
                    <p className="font-semibold text-slate-900">{conf.worker_judgment}</p>
                  </div>

                  {/* Decision Items */}
                  <div className="bg-sky-50/60 p-3.5 rounded-lg border border-sky-200 space-y-2">
                    <span className="text-[11px] font-black text-sky-950 block">4. 사례회의 결정사항</span>
                    <ul className="space-y-1 text-slate-800 font-semibold pl-1">
                      {conf.decisions.map((dec, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                          <span>{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 bg-white p-3 rounded-lg border">
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                        <input
                          type="checkbox"
                          checked={conf.reflect_in_service_plan}
                          onChange={() => handleTogglePlanReflection(conf.id)}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span>📝 결정사항을 [개별 급여제공계획]에 수동 반영합니다.</span>
                      </label>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium pl-6">
                        <span>보호자 공유 여부: {conf.share_with_guardian ? "✅ 공유 완료" : "미공유"}</span>
                        <span>후속 확인일: {conf.followup_review_date}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleCreateTaskFromConference(conf)}
                      className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-8 px-3 flex items-center gap-1 shrink-0"
                    >
                      <Zap size={14} />
                      <span>결정사항으로 업무 요청 생성</span>
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
