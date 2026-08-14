"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Save,
  ShieldAlert,
  Sparkles,
  User,
  UserCheck,
  Zap,
  X
} from "lucide-react";
import type { IntakeData } from "@/types/social-work-practice";
import type { Resident } from "@/data/mock-daycare-store";
import { useCurrentUser } from "@/hooks/use-auth-org";

type IntakeWizardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IntakeData, isDraft: boolean) => void;
};

const STEPS = [
  { step: 1, title: "1. 이용자 기본정보", icon: User },
  { step: 2, title: "2. 초기상담", icon: FileText },
  { step: 3, title: "3. 보호자 의견", icon: ClipboardList },
  { step: 4, title: "4. 주요 욕구", icon: Sparkles },
  { step: 5, title: "5. 위험·주의 사실", icon: ShieldAlert },
  { step: 6, title: "6. 초기 서비스 목표", icon: CheckCircle2 },
  { step: 7, title: "7. 담당자 확인", icon: UserCheck }
];

export default function IntakeWizardModal({ isOpen, onClose, onSave }: IntakeWizardModalProps) {
  const currentUser = useCurrentUser();
  const [mode, setMode] = useState<"quick" | "detailed">("quick");
  const [currentStep, setCurrentStep] = useState(1);
  const [guardianPhone, setGuardianPhone] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [saveMessage, setSaveMessage] = useState("");

  const [formData, setFormData] = useState<IntakeData>({
    id: `intake-${Date.now()}`,
    resident_name: "",
    gender: "여성",
    birth_date: "1945-01-01",
    care_level: "3등급",
    initial_counseling: "",
    guardian_opinion: "",
    main_needs: "",
    risk_caution_facts: "",
    initial_goals: "",
    assigned_worker: "",
    status: "draft",
    created_at: new Date().toISOString().split("T")[0]
  });

  // Set default assigned worker to current logged-in user
  useEffect(() => {
    if (currentUser?.name) {
      setFormData((prev) => ({
        ...prev,
        assigned_worker: prev.assigned_worker || `${currentUser.name} (${currentUser.roleLabel})`
      }));
    }
  }, [currentUser]);

  if (!isOpen) return null;

  const handleChange = (field: keyof IntakeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Helper: Persist newly registered resident to Resident Repository / LocalStorage SSOT
  const syncToResidentRepository = (intake: IntakeData): string => {
    if (typeof window === "undefined") return `res-${Date.now()}`;

    const raw = localStorage.getItem("silvercare.residents");
    let existingResidents: Resident[] = [];
    if (raw) {
      try {
        existingResidents = JSON.parse(raw);
      } catch {
        existingResidents = [];
      }
    }

    const trimmedName = intake.resident_name.trim();
    const existing = existingResidents.find((r) => r.name === trimmedName);
    const resId = existing?.id || `res-${Date.now()}`;

    const birthYear = parseInt(intake.birth_date.slice(0, 4), 10) || 1945;
    const currentYear = new Date().getFullYear();
    const computedAge = currentYear - birthYear;

    const newResident: Resident = {
      id: resId,
      name: trimmedName,
      initial: trimmedName.slice(-2) || trimmedName,
      gender: intake.gender === "남성" ? "남" : "여",
      age: computedAge > 0 && computedAge < 120 ? computedAge : 80,
      birthDate: intake.birth_date,
      grade: (intake.care_level as Resident["grade"]) || "3등급",
      gradeLabel: intake.care_level || "3등급",
      careNumber: existing?.careNumber || `L${Date.now().toString().slice(-10)}`,
      group: "A",
      guardianName: "보호자",
      guardianRelation: "가족",
      guardianPhone: guardianPhone.trim(),
      attendance: "입실",
      attendanceTime: "09:00",
      shuttleRoute: "송영 1호차 (08:30)",
      healthStatus: "양호",
      bloodPressure: "120/80",
      temperature: "36.5℃",
      mealLunch: "전량",
      mealSnack: "완료",
      medication: "완료",
      recordStatus: "기록미작성",
      cautionNotes: intake.risk_caution_facts?.trim() || undefined
    };

    const updatedResidents = existing
      ? existingResidents.map((r) => (r.id === resId ? { ...r, ...newResident } : r))
      : [newResident, ...existingResidents];

    // Single Source of Truth update
    localStorage.setItem("silvercare.residents", JSON.stringify(updatedResidents));
    localStorage.setItem("silvercare.dailyCare", JSON.stringify(updatedResidents));

    // Save intake record history
    const rawIntakes = localStorage.getItem("silvercare.intakes");
    let existingIntakes: IntakeData[] = [];
    if (rawIntakes) {
      try {
        existingIntakes = JSON.parse(rawIntakes);
      } catch {
        existingIntakes = [];
      }
    }
    const updatedIntakeData: IntakeData = {
      ...intake,
      id: intake.id || `intake-${Date.now()}`,
      resident_id: resId
    };
    const updatedIntakes = [
      updatedIntakeData,
      ...existingIntakes.filter((i) => i.id !== updatedIntakeData.id)
    ];
    localStorage.setItem("silvercare.intakes", JSON.stringify(updatedIntakes));

    // Notify other components
    window.dispatchEvent(new Event("storage"));

    return resId;
  };

  // Quick Registration Save (Takes under 2 minutes, 5 fields)
  const handleQuickRegister = () => {
    if (!formData.resident_name.trim()) {
      setSaveMessage("어르신 성명을 입력해주세요.");
      return;
    }

    const assignedWorker =
      formData.assigned_worker.trim() ||
      (currentUser?.name ? `${currentUser.name} (${currentUser.roleLabel})` : "담당 사회복지사");

    const quickData: IntakeData = {
      ...formData,
      resident_name: formData.resident_name.trim(),
      assigned_worker: assignedWorker,
      initial_counseling: formData.initial_counseling.trim() || `[빠른 등록 완료] 보호자연락처: ${guardianPhone.trim() || "미입력"}, 이용시작일: ${startDate}`,
      status: "completed"
    };

    const residentId = syncToResidentRepository(quickData);
    quickData.resident_id = residentId;

    onSave(quickData, false);
    onClose();
  };

  const handleSaveDraft = () => {
    const assignedWorker =
      formData.assigned_worker.trim() ||
      (currentUser?.name ? `${currentUser.name} (${currentUser.roleLabel})` : "담당 사회복지사");

    const draftData: IntakeData = {
      ...formData,
      resident_name: formData.resident_name.trim(),
      assigned_worker: assignedWorker,
      status: "draft"
    };

    if (draftData.resident_name) {
      const residentId = syncToResidentRepository(draftData);
      draftData.resident_id = residentId;
    }

    onSave(draftData, true);
    setSaveMessage("임시저장 완료 (나중에 언제든지 이어서 작성 가능)");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleCompleteDetailed = () => {
    if (!formData.resident_name.trim()) {
      setSaveMessage("어르신 성명을 입력해주세요.");
      return;
    }

    const assignedWorker =
      formData.assigned_worker.trim() ||
      (currentUser?.name ? `${currentUser.name} (${currentUser.roleLabel})` : "담당 사회복지사");

    const completeData: IntakeData = {
      ...formData,
      resident_name: formData.resident_name.trim(),
      assigned_worker: assignedWorker,
      status: "completed"
    };

    const residentId = syncToResidentRepository(completeData);
    completeData.resident_id = residentId;

    onSave(completeData, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-500 text-white font-bold text-[10px]">Single Source of Truth</Badge>
              <span className="text-xs text-slate-400">신규 이용자 온보딩</span>
            </div>
            <h2 className="text-lg font-black mt-0.5">신규 어르신 이용자 등록</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setMode("quick")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === "quick" ? "bg-white text-sky-700 shadow-xs border border-slate-200" : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <Zap size={15} className="text-amber-500" />
            <span>⚡ 빠른 등록 (5개 필수 필드 · 2분 완료)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("detailed")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mode === "detailed" ? "bg-white text-sky-700 shadow-xs border border-slate-200" : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            <Clock size={15} className="text-sky-600" />
            <span>📝 상세 인테이크 (나중에 작성 가능)</span>
          </button>
        </div>

        {/* MODE A: Quick Registration (2 minutes, 5 fields) */}
        {mode === "quick" && (
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {saveMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{saveMessage}</span>
              </div>
            )}

            <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3.5 text-xs text-sky-950 font-medium space-y-1">
              <p>
                ⚡ <strong>빠른 등록 원칙</strong>: 바쁜 현장 업무를 위해 <strong>성명, 생년월일, 보호자 연락처, 이용 시작일, 담당자</strong> 5개 필드만 작성하고 즉시 이용자 등록을 완료합니다.
              </p>
              <p className="text-[11px] text-sky-700">
                ※ 등록 즉시 이용자 관리(/residents)와 당일 케어(/daily-care)에 단일 데이터로 자동 연동됩니다.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">1. 어르신 성명 *</label>
                <input
                  type="text"
                  value={formData.resident_name}
                  onChange={(e) => handleChange("resident_name", e.target.value)}
                  placeholder="예: 가상 이용자 A01"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">2. 생년월일</label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleChange("birth_date", e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">3. 보호자 연락처</label>
                <input
                  type="text"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">4. 이용 시작일</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">5. 담당 사회복지사</label>
                <input
                  type="text"
                  value={formData.assigned_worker}
                  onChange={(e) => handleChange("assigned_worker", e.target.value)}
                  placeholder="담당자명 입력 (기본값: 현재 로그인 사용자)"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <Button
                onClick={handleQuickRegister}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 px-6 flex items-center gap-2 shadow-sm"
              >
                <Zap size={16} />
                <span>2분 컷 빠른 이용자 등록 완료</span>
              </Button>
            </div>
          </div>
        )}

        {/* MODE B: Detailed Intake (Optional) */}
        {mode === "detailed" && (
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Stepper */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b">
              {STEPS.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCurrentStep(s.step)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold whitespace-nowrap ${
                    s.step === currentStep ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* Step content */}
            {currentStep === 1 && (
              <div className="space-y-3 text-xs">
                <label className="block font-bold">성명</label>
                <input
                  type="text"
                  value={formData.resident_name}
                  onChange={(e) => handleChange("resident_name", e.target.value)}
                  placeholder="예: 가상 이용자 A01"
                  className="w-full p-2 border rounded font-semibold"
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-3 text-xs">
                <label className="block font-bold">초기상담 내용 (자유 양식)</label>
                <textarea
                  rows={5}
                  value={formData.initial_counseling}
                  onChange={(e) => handleChange("initial_counseling", e.target.value)}
                  placeholder="초기상담 및 이용 희망 사유 등을 자유롭게 입력하세요..."
                  className="w-full p-2 border rounded"
                />
              </div>
            )}

            {currentStep > 2 && (
              <div className="p-4 bg-slate-50 border rounded text-xs text-slate-600">
                상세 인테이크 {currentStep}단계 내용 기록 영역 (필요 시 이어서 작성)
              </div>
            )}

            <div className="flex justify-between pt-3 border-t">
              <Button onClick={handleSaveDraft} variant="secondary" className="text-xs h-8">
                <Save size={14} /> 임시저장
              </Button>
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button onClick={() => setCurrentStep((p) => p - 1)} variant="secondary" className="text-xs h-8">
                    <ChevronLeft size={14} /> 이전
                  </Button>
                )}
                {currentStep < 7 ? (
                  <Button onClick={() => setCurrentStep((p) => p + 1)} className="bg-sky-600 text-xs h-8">
                    다음 <ChevronRight size={14} />
                  </Button>
                ) : (
                  <Button onClick={handleCompleteDetailed} className="bg-emerald-600 text-xs h-8">
                    상세 인테이크 완료
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
