"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, ThumbsDown, ThumbsUp, Minus, ShieldAlert } from "lucide-react";
import type {
  BetaTaskScenario,
  HumanJudgmentSafetyCheck,
  InterruptionRating,
  InterruptionReason
} from "@/types/field-beta-measurement";

interface FieldMeasurementTrackerProps {
  scenarioId: BetaTaskScenario;
  onFeedbackSubmit?: (rating: InterruptionRating, reasons?: InterruptionReason[]) => void;
  onSafetyAuditSubmit?: (safetyCheck: HumanJudgmentSafetyCheck) => void;
}

export function FieldMeasurementTracker({
  scenarioId,
  onFeedbackSubmit,
  onSafetyAuditSubmit
}: FieldMeasurementTrackerProps) {
  const [rating, setRating] = useState<InterruptionRating | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<InterruptionReason[]>([]);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Safety check state
  const [aiAttemptedJudgment, setAiAttemptedJudgment] = useState(false);
  const [includedExpression, setIncludedExpression] = useState(false);
  const [factualInaccuracy, setFactualInaccuracy] = useState(false);
  const [inducedUserDecision, setInducedUserDecision] = useState(false);

  const handleRatingSelect = (selectedRating: InterruptionRating) => {
    setRating(selectedRating);
    if (selectedRating !== "interrupted") {
      onFeedbackSubmit?.(selectedRating);
      setSubmitted(true);
    }
  };

  const handleReasonToggle = (reason: InterruptionReason) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleInterruptedSubmit = () => {
    if (rating) {
      onFeedbackSubmit?.(rating, selectedReasons);
      setSubmitted(true);
    }
  };

  const handleSafetySubmit = () => {
    const isIssue = aiAttemptedJudgment || includedExpression || factualInaccuracy || inducedUserDecision;
    const check: HumanJudgmentSafetyCheck = {
      ai_attempted_judgment: aiAttemptedJudgment,
      included_judgmental_expression: includedExpression,
      factual_inaccuracy: factualInaccuracy,
      induced_user_decision: inducedUserDecision,
      is_safety_issue: isIssue
    };
    onSafetyAuditSubmit?.(check);
    setShowSafetyModal(false);
  };

  return (
    <div className="bg-slate-900 text-white rounded-xl p-3 border border-slate-700 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-sky-600 text-white text-[9px]">현장 베타 측정</Badge>
          <span className="font-bold text-slate-200">업무 방해도 1클릭 피드백 (선택사항, 팝업 없음)</span>
        </div>
        <button
          type="button"
          onClick={() => setShowSafetyModal(true)}
          className="text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-1"
        >
          <ShieldAlert size={12} />
          <span>AI 판단 침범 신고</span>
        </button>
      </div>

      {!submitted ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleRatingSelect("helpful")}
              className={`flex-1 py-1.5 px-2 rounded-lg border font-bold text-center flex items-center justify-center gap-1 transition ${
                rating === "helpful" ? "bg-emerald-600 border-emerald-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <ThumbsUp size={13} />
              <span>도움이 됨</span>
            </button>

            <button
              type="button"
              onClick={() => handleRatingSelect("neutral")}
              className={`flex-1 py-1.5 px-2 rounded-lg border font-bold text-center flex items-center justify-center gap-1 transition ${
                rating === "neutral" ? "bg-slate-600 border-slate-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Minus size={13} />
              <span>차이 없음</span>
            </button>

            <button
              type="button"
              onClick={() => handleRatingSelect("interrupted")}
              className={`flex-1 py-1.5 px-2 rounded-lg border font-bold text-center flex items-center justify-center gap-1 transition ${
                rating === "interrupted" ? "bg-rose-600 border-rose-500 text-white" : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <ThumbsDown size={13} />
              <span>방해됨</span>
            </button>
          </div>

          {rating === "interrupted" && (
            <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700 space-y-2 animate-in fade-in duration-100">
              <span className="block font-bold text-slate-300 text-[11px]">방해 사유를 선택해 주세요 (복수 선택 가능):</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px]">
                {[
                  { id: "too_many_notifications", label: "알림이 많음" },
                  { id: "too_many_steps", label: "확인 단계가 많음" },
                  { id: "inaccurate_info", label: "정보가 부정확함" },
                  { id: "complex_ui", label: "화면이 복잡함" },
                  { id: "faster_manually", label: "직접 하는 게 빠름" },
                  { id: "other", label: "기타" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleReasonToggle(item.id as InterruptionReason)}
                    className={`p-1 rounded border text-left font-bold transition ${
                      selectedReasons.includes(item.id as InterruptionReason)
                        ? "bg-rose-900/60 border-rose-500 text-rose-200"
                        : "bg-slate-900 border-slate-700 text-slate-400"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleInterruptedSubmit}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded text-[10px]"
                >
                  사유 제출
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 py-1">
          <Check size={14} />
          <span>피드백이 수집되었습니다. 감사합니다.</span>
        </div>
      )}

      {/* Safety Check Modal */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 text-slate-900">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 border-b pb-3 text-rose-700 font-black text-sm">
              <AlertCircle size={18} />
              <span>AI 인간 판단 침범 안전성 신고</span>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <label className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border cursor-pointer">
                <input
                  type="checkbox"
                  checked={aiAttemptedJudgment}
                  onChange={(e) => setAiAttemptedJudgment(e.target.checked)}
                  className="mt-0.5"
                />
                <span>AI가 복지사의 판단을 대신하려고 했습니까?</span>
              </label>

              <label className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border cursor-pointer">
                <input
                  type="checkbox"
                  checked={includedExpression}
                  onChange={(e) => setIncludedExpression(e.target.checked)}
                  className="mt-0.5"
                />
                <span>주관적·판단적 표현이 포함되었습니까? (예: &quot;상태 호전&quot;)</span>
              </label>

              <label className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border cursor-pointer">
                <input
                  type="checkbox"
                  checked={factualInaccuracy}
                  onChange={(e) => setFactualInaccuracy(e.target.checked)}
                  className="mt-0.5"
                />
                <span>실제 사실과 다른 내용이 존재했습니까?</span>
              </label>

              <label className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border cursor-pointer">
                <input
                  type="checkbox"
                  checked={inducedUserDecision}
                  onChange={(e) => setInducedUserDecision(e.target.checked)}
                  className="mt-0.5"
                />
                <span>사회복지사의 결정을 특정 방향으로 유도했습니까?</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t text-xs">
              <button
                type="button"
                onClick={() => setShowSafetyModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSafetySubmit}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg"
              >
                안전성 신고 제출
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
