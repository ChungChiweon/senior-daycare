"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommonActivityForm } from "@/components/content/CommonActivityForm";
import { DocumentAssemblyPanel } from "@/components/content/DocumentAssemblyPanel";
import { DocumentGeneratorPanel } from "@/components/content/DocumentGeneratorPanel";
import { IndividualCareForm } from "@/components/content/IndividualCareForm";
import { IndividualResponseGrid } from "@/components/content/IndividualResponseGrid";
import { MobileFieldLogger, type FieldRecord } from "@/components/content/MobileFieldLogger";
import { MobileFieldStudio } from "@/components/content/MobileFieldStudio";
import { FactPreviewFeed } from "@/components/content/FactPreviewFeed";
import { FieldRecordSummaryPanel } from "@/components/content/FieldRecordSummaryPanel";
import { RecordBlockEditor } from "@/components/content/RecordBlockEditor";
import { ResidentMultiSelect } from "@/components/content/ResidentMultiSelect";
import {
  MOCK_RECORD_BLOCKS,
  MOCK_DOCUMENT_TEMPLATES
} from "@/data/mock-record-blocks";
import {
  MOCK_COMMON_ACTIVITIES,
  MOCK_INDIVIDUAL_CARES,
  MOCK_INDIVIDUAL_RESPONSES,
  MOCK_RESIDENTS as BASE_RESIDENTS
} from "@/data/mock-integrated-care";
import { localRecordBlockRepository } from "@/lib/repository/local-record-block-repository";
import { localDocumentRepository } from "@/lib/repository/local-document-repository";
import type { DocumentSnapshot } from "@/lib/repository/document-repository";
import type {
  AssistanceLevel,
  CommonActivity,
  EmotionalResponse,
  EngagementLevel,
  IndividualCare,
  IndividualResponse,
  IntegratedResident
} from "@/types/integrated-care";
import type { BlockType, RecordBlock, VisibilityScope } from "@/types/record-block";

export function UnifiedContentStudio() {
  const today = new Date().toISOString().slice(0, 10);
  const [currentDate, setCurrentDate] = useState(today);

  // Residents & Selected Store
  const [residents, setResidents] = useState<IntegratedResident[]>([]);
  const [selectedResidentIds, setSelectedResidentIds] = useState<string[]>([]);
  const [activeResidentId, setActiveResidentId] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("silvercare.residents");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setResidents(
            parsed.map((r: any) => ({
              id: r.id,
              name: r.name,
              gender: (r.gender as any) || "여",
              age: r.age || 80,
              grade: (r.careGrade as any) || "3등급",
              careNumber: r.careNumber || "L1234567890",
              attendanceStatus: "출석",
              group: "A그룹",
              photoUrl: "",
              hasPhotoConsent: true
            }))
          );
          setSelectedResidentIds(parsed.map((r: any) => r.id));
          setActiveResidentId(parsed[0].id);
        }
      } catch {
        // fallback
      }
    }
  }, []);

  // Activities & Care Data Store
  const [commonActivities, setCommonActivities] = useState<CommonActivity[]>([]);
  const [individualResponses, setIndividualResponses] = useState<Record<string, IndividualResponse>>({});
  const [individualCares, setIndividualCares] = useState<Record<string, IndividualCare>>({});

  // Mobile Out-of-office Field Records
  const [fieldRecords, setFieldRecords] = useState<FieldRecord[]>([]);

  function handleSaveFieldRecord(newRecord: FieldRecord) {
    setFieldRecords((prev) => [newRecord, ...prev]);
    localRecordBlockRepository.saveFieldRecord(newRecord);
    setNotification(`📱 [${newRecord.residentName} 어르신] 모바일 외근 현장 기록이 영구 저장소(silvercare.fieldRecords 및 RecordBlock)에 보관되었습니다.`);
  }

  // RecordBlocks Store
  const [recordBlocks, setRecordBlocks] = useState<RecordBlock[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("tpl_care_record_hwpx");

  // Mobile Step Wizard State (1~4)
  const [mobileStep, setMobileStep] = useState<number>(1);
  const [notification, setNotification] = useState("");
  const [isBlockEditorOpen, setIsBlockEditorOpen] = useState<boolean>(false);

  const activeResident = useMemo<IntegratedResident>(() => {
    return (
      residents.find((r) => r.id === activeResidentId) ||
      residents[0] || {
        id: "",
        name: "미지정",
        gender: "여",
        age: 80,
        grade: "3등급",
        careNumber: "L1234567890",
        attendanceStatus: "결석",
        group: "A그룹",
        hasPhotoConsent: true
      }
    );
  }, [residents, activeResidentId]);

  const activeCare = useMemo(() => {
    return (
      individualCares[activeResidentId] || {
        residentId: activeResidentId,
        checkinTime: "08:45",
        checkoutTime: "16:30",
        shuttleIn: "1호차",
        shuttleOut: "1호차",
        shuttleNote: "",
        temperature: "36.5℃",
        bloodPressure: "120/80 mmHg",
        pulse: "72회/분",
        bloodSugar: "110 mg/dL",
        pain: "없음",
        skinCondition: "양호",
        walkStatus: "자립 보행",
        symptom: "없음",
        meal: "전량",
        water: "충분",
        snack: "전량",
        mealAssistance: "자립 식사",
        swallowingNote: "",
        medicationState: "예정대로 투약",
        medicationNote: "점심 식후 정량 투약",
        excretion: "정상",
        sleep: "30~60분",
        moodState: "활기참",
        notes: "",
        staffAssigned: "박지영 사회복지사",
        actions: [],
        guardianNotice: "알림장 포함",
        privacyScopes: { health: "internal_only", meal: "guardian_ok" }
      }
    );
  }, [individualCares, activeResidentId]);

  const selectedResidents = useMemo(() => {
    return residents.filter((r) => selectedResidentIds.includes(r.id));
  }, [residents, selectedResidentIds]);

  // Handle Common Activity Apply
  function handleApplyCommonActivity(updatedAct: CommonActivity) {
    setCommonActivities((prev) => prev.map((a) => (a.id === updatedAct.id ? updatedAct : a)));
    setNotification(`공통활동 [${updatedAct.title}]이 선택된 ${selectedResidentIds.length}명 이용자에게 반영되었습니다.`);
  }

  // Handle Individual Response Update
  function handleUpdateResponse(residentId: string, updated: IndividualResponse) {
    setIndividualResponses((prev) => ({ ...prev, [residentId]: updated }));
  }

  // Batch Apply All
  function handleBatchApplyAll(engagement: EngagementLevel, emotional: EmotionalResponse, assistance: AssistanceLevel) {
    setIndividualResponses((prev) => {
      const next = { ...prev };
      selectedResidentIds.forEach((id) => {
        next[id] = {
          residentId: id,
          engagement,
          emotionalResponse: emotional,
          assistanceLevel: assistance,
          note: next[id]?.note || ""
        };
      });
      return next;
    });
    setNotification(`선택된 ${selectedResidentIds.length}명 이용자에게 개별 반응이 일괄 적용되었습니다.`);
  }

  // Handle Individual Care Update
  function handleUpdateCare(updatedCare: IndividualCare) {
    setIndividualCares((prev) => ({ ...prev, [updatedCare.residentId]: updatedCare }));
  }

  // RecordBlock Updates via Repository
  function handleUpdateBlockText(blockId: string, text: string) {
    const updated = localRecordBlockRepository.updateBlockText(blockId, text);
    if (updated) {
      setRecordBlocks((prev) => prev.map((b) => (b.id === blockId ? updated : b)));
      // Priority 4: Mark existing document snapshots as requiring new version!
      localDocumentRepository.markRequiresNewVersion(activeResidentId, blockId);
      setNotification("기록 블록 문안이 저장소에 업데이트되었습니다. (문서 snapshot: 새 버전 필요 표시)");
    }
  }

  function handleUpdateBlockScope(blockId: string, scope: VisibilityScope) {
    const updated = localRecordBlockRepository.updateBlockScope(blockId, scope);
    if (updated) {
      setRecordBlocks((prev) => prev.map((b) => (b.id === blockId ? updated : b)));
    }
  }

  function handleApproveBlock(blockId: string) {
    const updated = localRecordBlockRepository.approveBlock(blockId);
    if (updated) {
      setRecordBlocks((prev) => prev.map((b) => (b.id === blockId ? updated : b)));
      setNotification("기록 블록 승인 상태가 저장소에 기록되었습니다.");
    }
  }

  function handleSaveDocumentSnapshot(templateId: string, assembledText: string) {
    const snapshot: DocumentSnapshot = {
      documentId: `doc-${Date.now()}`,
      templateId,
      residentId: activeResidentId,
      residentName: activeResident.name,
      sourceBlockIds: recordBlocks.map((b) => b.id),
      sourceBlockVersions: Object.fromEntries(recordBlocks.map((b) => [b.id, b.version])),
      assembledText,
      editedText: assembledText,
      approvalStatus: "approved",
      requiresNewVersion: false,
      exportedFiles: [{ type: "pdf", filename: `${activeResident.name}_care_record.pdf`, exportedAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localDocumentRepository.saveSnapshot(snapshot);
    setNotification(`[${activeResident.name} 어르신] 문서 스냅샷이 버전 저장소에 기록되었습니다.`);
  }

  function handleRegenerateAiBlock(blockId: string) {
    setNotification("AI 재생성 비교 검토 창이 열렸습니다.");
  }

  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);

  if (isMobileMode) {
    return (
      <MobileFieldStudio
        residents={selectedResidents}
        selectedResidentId={activeResidentId}
        onSelectResident={setActiveResidentId}
        fieldRecords={fieldRecords}
        onSaveFieldRecord={handleSaveFieldRecord}
        onGenerateDocQuick={(title) => {
          setNotification(`📱 모바일에서 [${title}] 문안이 바로 발송 채널로 제출되었습니다.`);
        }}
        onSwitchToDesktop={() => setIsMobileMode(false)}
      />
    );
  }

  if (residents.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-6 text-white shadow-lg space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
              통합 사회복지 업무 스튜디오
            </Badge>
            <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
              20종 문서 일괄 생성
            </Badge>
          </div>
          <h1 className="mt-2 text-xl lg:text-2xl font-black text-white tracking-tight">
            오늘 기록 한 번으로 <span className="text-sky-300 underline underline-offset-4 font-black">20종 문서</span>가 자동 작성됩니다.
          </h1>
          <p className="mt-1 text-xs text-sky-100 font-medium max-w-3xl leading-relaxed">
            공통활동 및 이용자 사실을 입력하면 20종 문서가 바로 완성됩니다.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600 mb-1">
            <Users size={28} />
          </div>
          <h3 className="text-base font-black text-slate-900">등록된 이용자가 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            통합 문서 작성을 위해 먼저 [이용자 관리] 메뉴에서 가상 이용자(어르신)를 직접 등록해주세요.
          </p>
          <Link href="/residents">
            <Button className="bg-sky-600 hover:bg-sky-700 font-bold text-xs">
              + 가상 이용자 등록하러 가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-6 text-white shadow-lg space-y-3">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
                통합 사회복지 업무 스튜디오
              </Badge>
              <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
                20종 문서 일괄 생성
              </Badge>
            </div>
            <h1 className="mt-2 text-xl lg:text-2xl font-black text-white tracking-tight">
              오늘 기록 한 번으로 <span className="text-sky-300 underline underline-offset-4 font-black">20종 문서</span>가 자동 작성됩니다.
            </h1>
            <p className="mt-1 text-xs text-sky-100 font-medium max-w-3xl leading-relaxed">
              공통활동 및 이용자 사실을 입력하면 20종 문서가 바로 완성됩니다. 민감한 개인정보 블록은 상단 보안 버튼을 통해 별도 편집기에서 안전하게 확인/수정할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              onClick={() => setIsMobileMode(true)}
              className="bg-emerald-500 hover:bg-emerald-600 font-black text-xs h-10 px-3.5 flex items-center gap-1.5 shadow-md text-slate-950"
            >
              📱 모바일 현장 전용 뷰
            </Button>
            <Button
              onClick={() => setIsBlockEditorOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 font-extrabold text-xs h-10 px-4 flex items-center gap-2 shadow-md border border-amber-300/30 text-slate-950"
            >
              🔒 개인정보 · AI 블록 정밀 편집
            </Button>

            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 border border-white/20">
              <Calendar size={15} />
              <input
                type="date"
                className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                value={currentDate}
                onChange={(e) => setCurrentDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Slogan & Notification Bar */}
        <div className="rounded-xl bg-sky-950/70 border border-sky-400/30 p-2.5 text-xs font-bold text-sky-200 flex items-center justify-between">
          <span>💡 “공통활동 한 번 입력으로 20종 문서 자동 작성 | 개인정보 정밀 편집은 상단 🔒 보안 버튼 클릭”</span>
          {notification && <span className="text-emerald-300 font-bold text-[11px] animate-pulse">✨ {notification}</span>}
        </div>
      </div>

      {/* Mobile 4-Step Wizard Bar */}
      <div className="flex lg:hidden overflow-x-auto gap-1 border-b border-slate-200 pb-2">
        {[
          [1, "1. 사실 입력"],
          [2, "2. 20종 문서 생성"],
          [3, "3. HWPX/PDF 조립"],
          [4, "🔒 4. AI 블록 보안 편집"]
        ].map(([step, label]) => (
          <button
            key={step}
            type="button"
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
              mobileStep === step ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-600 border-slate-200"
            }`}
            onClick={() => {
              if (step === 4) {
                setIsBlockEditorOpen(true);
              } else {
                setMobileStep(step as number);
              }
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Desktop 3-Column Layout (Swapped: Left Fact Inputs, Center 20 Document Generator, Right Document Assembly) */}
      <div className="grid gap-5 lg:grid-cols-[380px_1fr_340px]">
        {/* Left Column: 사실 입력 (Group & Individual Fact Inputs + Mobile Field Logger) */}
        <div className={`space-y-4 ${mobileStep === 1 ? "block" : "hidden lg:block"}`}>
          <ResidentMultiSelect
            residents={residents}
            selectedIds={selectedResidentIds}
            onSelectChange={setSelectedResidentIds}
          />

          <MobileFieldLogger
            residents={selectedResidents}
            onSaveFieldRecord={handleSaveFieldRecord}
          />

          <CommonActivityForm
            activity={commonActivities[0]}
            onApply={handleApplyCommonActivity}
            selectedResidentCount={selectedResidentIds.length}
          />

          <IndividualResponseGrid
            residents={selectedResidents}
            responses={individualResponses}
            onChangeResponse={handleUpdateResponse}
            onBatchApplyAll={handleBatchApplyAll}
          />

          <IndividualCareForm
            residents={selectedResidents}
            activeResidentId={activeResidentId}
            onSelectResident={setActiveResidentId}
            careData={activeCare}
            onChangeCare={handleUpdateCare}
          />
        </div>

        {/* Center Column (MAIN WORKSPACE): AI 생성 전 사실 피드 & 20종 자동 생성 패널 */}
        <div className={`space-y-4 ${mobileStep === 2 ? "block" : "hidden lg:block"}`}>
          {/* Privacy Access Banner */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs flex items-center justify-between font-bold text-amber-900 shadow-2xs">
            <span className="flex items-center gap-2">
              🔒 바이탈·투약·특이사항 등 민감 정보는 별도 보안 영역에서 관리됩니다.
            </span>
            <Button
              onClick={() => setIsBlockEditorOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 font-bold text-xs h-7 px-3 text-white"
            >
              🔒 AI 블록 정밀 편집기 열기
            </Button>
          </div>

          {/* Collapsible Today's Out-of-office Field Record Aggregation Panel */}
          <FieldRecordSummaryPanel
            fieldRecords={fieldRecords}
            onApplyToDocs={() => {
              setNotification("✨ 오늘 수집된 외근 기록이 20종 문서 합성 엔진에 연동되었습니다.");
              setTimeout(() => setNotification(""), 3500);
            }}
          />

          {/* Live Fact Preview Feed (AI 생성 전 실시간 접수 사실 데이터 표시 영역) */}
          <FactPreviewFeed
            residentName={activeResident.name}
            fieldRecords={fieldRecords}
            selectedResidentCount={selectedResidentIds.length}
          />

          <DocumentGeneratorPanel
            residentName={activeResident.name}
            blocks={recordBlocks}
            fieldRecords={fieldRecords}
            residents={selectedResidents}
            activeResidentId={activeResidentId}
            onSelectResident={setActiveResidentId}
          />

          <DocumentAssemblyPanel
            templates={MOCK_DOCUMENT_TEMPLATES}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={setSelectedTemplateId}
            blocks={recordBlocks}
            residentName={activeResident.name}
          />
        </div>
      </div>
    </div>
  );
}
