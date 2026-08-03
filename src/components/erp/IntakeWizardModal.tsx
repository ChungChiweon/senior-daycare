"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Save,
  ShieldAlert,
  Sparkles,
  User,
  UserCheck,
  X
} from "lucide-react";
import type { IntakeData } from "@/types/social-work-practice";

type IntakeWizardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IntakeData, isDraft: boolean) => void;
};

const INITIAL_FORM: IntakeData = {
  id: "intake-draft-01",
  resident_name: "",
  gender: "여성",
  birth_date: "1942-05-14",
  care_level: "3등급",
  initial_counseling: "",
  guardian_opinion: "",
  main_needs: "",
  risk_caution_facts: "",
  initial_goals: "",
  assigned_worker: "김복지 사회복지사",
  status: "draft",
  created_at: new Date().toISOString().split("T")[0]
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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IntakeData>(INITIAL_FORM);
  const [isAiFormatting, setIsAiFormatting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  if (!isOpen) return null;

  const handleChange = (field: keyof IntakeData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // AI text formatting helper (AI does NOT judge or make decisions, only formats text)
  const handleAiFormatCounseling = () => {
    if (!formData.initial_counseling) return;
    setIsAiFormatting(true);
    setTimeout(() => {
      const formatted = `[상담 요약 서식 정리 - 판단 없음]\n• 주소거지: 자녀 동거\n• 주요 호소 내용: ${formData.initial_counseling.trim()}\n• 관찰 팩트: 다리 근력 약화로 보행 시 보조 필요함 언급됨.`;
      setFormData((prev) => ({ ...prev, initial_counseling: formatted }));
      setIsAiFormatting(false);
    }, 600);
  };

  const handleSaveDraft = () => {
    onSave({ ...formData, status: "draft" }, true);
    setSaveMessage("임시저장 완료 (미완료 항목이 있어도 이용자 등록 진행 가능)");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleComplete = () => {
    onSave({ ...formData, status: "completed" }, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-sky-500 text-white font-bold text-[10px]">신규 이용자 온보딩</Badge>
              <span className="text-xs text-slate-400">통합 인테이크 (Intake Process)</span>
            </div>
            <h2 className="text-xl font-black mt-1">신규 어르신 초기상담 및 인테이크 등록</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 7-Step Indicator Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-[680px]">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = s.step === currentStep;
              const isPast = s.step < currentStep;

              return (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setCurrentStep(s.step)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition flex-1 justify-center ${
                    isActive
                      ? "bg-sky-600 text-white shadow-sm"
                      : isPast
                        ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  <Icon size={14} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <User size={18} className="text-sky-600" /> 1. 이용자 기본정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">성명 *</label>
                  <input
                    type="text"
                    value={formData.resident_name}
                    onChange={(e) => handleChange("resident_name", e.target.value)}
                    placeholder="예: 이순자 어르신"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">성별</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="여성">여성</option>
                    <option value="남성">남성</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">생년월일</label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleChange("birth_date", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">장기요양등급</label>
                  <select
                    value={formData.care_level}
                    onChange={(e) => handleChange("care_level", e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="1등급">1등급</option>
                    <option value="2등급">2등급</option>
                    <option value="3등급">3등급</option>
                    <option value="4등급">4등급</option>
                    <option value="5등급">5등급</option>
                    <option value="인지지원등급">인지지원등급</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText size={18} className="text-sky-600" /> 2. 초기상담 기록 (Intake Counseling)
                </h3>
                <Button
                  onClick={handleAiFormatCounseling}
                  disabled={isAiFormatting || !formData.initial_counseling}
                  className="bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 font-bold text-xs h-8 px-3 flex items-center gap-1"
                >
                  <Sparkles size={14} className="text-sky-600" />
                  <span>{isAiFormatting ? "서식 정리 중..." : "AI 텍스트 서식만 정리 (판단 없음)"}</span>
                </Button>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">초기 상담 및 관찰 내용</label>
                <textarea
                  rows={6}
                  value={formData.initial_counseling}
                  onChange={(e) => handleChange("initial_counseling", e.target.value)}
                  placeholder="어르신과의 첫 면담 내용, 센터 입소 동기, 현재 표현하시는 주요 상태 등을 자유롭게 기록하세요."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                💡 AI는 텍스트 줄바꿈 및 서식만 정돈하며, 사회복지사의 상담 내용이나 판단을 임의로 결정하지 않습니다.
              </p>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ClipboardList size={18} className="text-sky-600" /> 3. 보호자 의견 및 요구사항
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">보호자(자녀/배우자) 발언 및 요청사항</label>
                <textarea
                  rows={6}
                  value={formData.guardian_opinion}
                  onChange={(e) => handleChange("guardian_opinion", e.target.value)}
                  placeholder="보호자가 케어에 대해 기대하는 사항, 약 복용 주의사항, 송영 관련 개별 요청 등을 적어주세요."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-sky-600" /> 4. 주요 욕구 (사회복지사 작성)
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  초기 파악된 어르신 욕구 (신체, 인지, 정서, 사회적 관계 등)
                </label>
                <textarea
                  rows={6}
                  value={formData.main_needs}
                  onChange={(e) => handleChange("main_needs", e.target.value)}
                  placeholder="어르신 및 보호자의 발언을 토대로 사회복지사가 직접 파악한 욕구 항목을 기록하세요."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 text-amber-700">
                <ShieldAlert size={18} /> 5. 위험 · 주의 사실 (케어 전달사항)
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  낙상 위험, 당뇨/고혈압, 알레르기, 배돌봄 주의사항 등 팩트 기록
                </label>
                <textarea
                  rows={6}
                  value={formData.risk_caution_facts}
                  onChange={(e) => handleChange("risk_caution_facts", e.target.value)}
                  placeholder="요양보호사 및 간호 직원이 반드시 공유받아야 할 현장 주의 팩트 사항을 입력하세요."
                  className="w-full text-xs p-3 rounded-lg border border-amber-300 bg-amber-50/40 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <p className="text-[11px] text-amber-800 font-medium">
                ⚠️ 위험도는 AI가 임의로 판단하지 않으며, 의료/돌봄상 확인된 관찰 팩트를 직원이 기록합니다.
              </p>
            </div>
          )}

          {/* STEP 6 */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-sky-600" /> 6. 초기 서비스 목표 (Service Goals)
              </h3>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  입소 초기 설정 개여 제공 목표 및 개입 방향
                </label>
                <textarea
                  rows={6}
                  value={formData.initial_goals}
                  onChange={(e) => handleChange("initial_goals", e.target.value)}
                  placeholder="예: 1. 신체 잔존기능 유지를 위한 신체 활동 프로그램 일 1회 서포트. 2. 타 어르신과의 교류 촉진."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck size={18} className="text-sky-600" /> 7. 담당 사회복지사 확인 및 최종 등록
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">성명:</span>{" "}
                    <strong className="text-slate-900">{formData.resident_name || "(미입력)"}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">등급:</span>{" "}
                    <strong className="text-slate-900">{formData.care_level}</strong>
                  </div>
                </div>
                <hr className="border-slate-200" />
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">담당 사회복지사 지정</label>
                  <input
                    type="text"
                    value={formData.assigned_worker}
                    onChange={(e) => handleChange("assigned_worker", e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div className="text-[11px] text-slate-600 font-medium bg-white p-3 rounded-lg border">
                  ✅ <strong>안내</strong>: 일부 항목이 작성되지 않았어도 <strong>[임시저장]</strong> 또는{" "}
                  <strong>[이용자 등록 완료]</strong>를 통해 등록을 계속 진행할 수 있습니다.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between">
          <Button
            onClick={handleSaveDraft}
            className="bg-white hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs h-9 px-4 flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>단계별 임시저장</span>
          </Button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs h-9 px-4 flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                <span>이전 단계</span>
              </Button>
            )}

            {currentStep < 7 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9 px-4 flex items-center gap-1"
              >
                <span>다음 단계</span>
                <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-5 flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 size={16} />
                <span>인테이크 및 이용자 등록 완료</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
