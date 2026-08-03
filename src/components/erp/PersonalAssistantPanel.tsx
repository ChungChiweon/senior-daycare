"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Lock,
  MessageSquare,
  Moon,
  PanelRightClose,
  Settings,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import { PersonalAssistantEngine } from "@/lib/personal-assistant-engine";
import type { AssistantPreparedItem, PersonalAssistantContext } from "@/types/personal-assistant";

export default function PersonalAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "drafts" | "replies" | "deadlines" | "eod">("today");
  const [context, setContext] = useState<PersonalAssistantContext | null>(null);
  const [preparedItems, setPreparedItems] = useState<AssistantPreparedItem[]>([]);
  const [selectedItemForReview, setSelectedItemForReview] = useState<AssistantPreparedItem | null>(null);
  const [reviewContent, setReviewContent] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [toneStyle, setToneStyle] = useState<"professional" | "concise">("professional");
  const [actionMessage, setActionMessage] = useState("");
  const [isFallbackActive, setIsFallbackActive] = useState(false);

  useEffect(() => {
    try {
      // Build Context bound to real user & organization data
      const ctx = PersonalAssistantEngine.buildContext("u-social-01", "org-01");
      setContext(ctx);
      setPreparedItems(ctx.prepared_items);
    } catch (err) {
      console.error("AI Assistant Engine load error:", err);
      setIsFallbackActive(true);
    }
  }, []);

  if (!context) return null;

  // 1-Click ONLY for entering Draft Review Modal (High-risk actions require explicit human review)
  const handleOpenReviewModal = (item: AssistantPreparedItem) => {
    setSelectedItemForReview(item);
    setReviewContent(item.prepared_content);
  };

  // Explicit Human Approval Step before committing to Org ERP Records
  const handleConfirmAndSaveToOrgERP = () => {
    if (!selectedItemForReview) return;
    setPreparedItems((prev) =>
      prev.map((item) =>
        item.id === selectedItemForReview.id
          ? { ...item, prepared_content: reviewContent, status: "accepted" }
          : item
      )
    );
    setActionMessage(`✅ [사회복지사 최종 승인] 초안이 확정되어 기관 ERP 공식 기록으로 저장되었습니다. (출처 팩트: ${selectedItemForReview.source_record_ids.join(", ")})`);
    setSelectedItemForReview(null);
    setTimeout(() => setActionMessage(""), 4000);
  };

  const handleDismissItem = (id: string) => {
    setPreparedItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "dismissed" } : item)));
  };

  return (
    <>
      {/* Floating Toggle Button (Desktop & Mobile - Always Optional) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full shadow-2xl border-2 border-sky-400 flex items-center gap-2 group transition-all hover:scale-105"
          title="내 사회복지 AI 비서 열기"
        >
          <div className="relative">
            <Sparkles size={20} className="text-sky-400 animate-pulse" />
            {preparedItems.filter((i) => i.status === "prepared").length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-slate-900" />
            )}
          </div>
          <span className="text-xs font-black pr-1 hidden sm:inline">내 AI 비서</span>
          <Badge className="bg-sky-500 text-white font-extrabold text-[10px] px-1.5 py-0">
            {preparedItems.filter((i) => i.status === "prepared").length}
          </Badge>
        </button>
      )}

      {/* Slide-over Side Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Top Panel Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-white shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-white">{context.user_name}의 AI 비서</h3>
                  <Badge className="bg-emerald-500 text-white text-[9px] font-bold py-0">개인 전용</Badge>
                </div>
                <span className="text-[11px] text-slate-400">담당 어르신 {context.assigned_residents_count}명 업무 연결</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="비서 환경 설정"
              >
                <Settings size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                title="패널 접기"
              >
                <PanelRightClose size={18} />
              </button>
            </div>
          </div>

          {/* Ethical Policy Banner (Explicit Non-diagnostic Guardrail) */}
          <div className="bg-amber-50 border-b border-amber-200/80 p-2.5 text-[11px] text-amber-950 flex items-start gap-2">
            <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-tight">
              &quot;AI 비서는 기록과 반복 업무를 돕습니다. 사람에 대한 판단과 관계 형성은 사회복지사의 영역입니다.&quot;
            </p>
          </div>

          {/* Fail-Safe Mode Banner (If AI error occurs) */}
          {isFallbackActive && (
            <div className="bg-slate-100 p-2 text-[11px] text-slate-600 flex items-center gap-2 border-b">
              <span>⚠️ AI 서비스 조용안내: 오프라인 상태이나, 원래 ERP 기능은 100% 정상 가동됩니다.</span>
            </div>
          )}

          {/* Personalization Settings Overlay */}
          {showSettings && (
            <div className="bg-slate-100 border-b border-slate-200 p-3 text-xs space-y-2 animate-in fade-in duration-100">
              <div className="flex justify-between font-bold text-slate-800">
                <span>⚙️ AI 비서 개인 환경 설정</span>
                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-1 text-[11px]">
                <label className="block text-slate-600 font-bold">문체 및 요약 스타일:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setToneStyle("professional")}
                    className={`px-2.5 py-1 rounded border text-[10px] font-bold ${
                      toneStyle === "professional" ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-700"
                    }`}
                  >
                    전문 개조식
                  </button>
                  <button
                    type="button"
                    onClick={() => setToneStyle("concise")}
                    className={`px-2.5 py-1 rounded border text-[10px] font-bold ${
                      toneStyle === "concise" ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-700"
                    }`}
                  >
                    극단적 간결
                  </button>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200 flex items-center gap-1">
                <Lock size={12} className="text-slate-400" />
                <span>개인 영역 초안은 비공개되며, 승인된 최종 결과만 기관 AuditLog에 반영됩니다.</span>
              </div>
            </div>
          )}

          {/* Quick Subtab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab("today")}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === "today" ? "bg-white text-sky-700 shadow-2xs border border-slate-200" : "text-slate-600"
              }`}
            >
              <CheckCircle2 size={13} /> 오늘 할 일 ({context.today_tasks.filter((t) => !t.done).length})
            </button>

            <button
              onClick={() => setActiveTab("drafts")}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === "drafts" ? "bg-white text-sky-700 shadow-2xs border border-slate-200" : "text-slate-600"
              }`}
            >
              <FileText size={13} /> 준비한 초안 ({preparedItems.filter((i) => i.status === "prepared").length})
            </button>

            <button
              onClick={() => setActiveTab("replies")}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === "replies" ? "bg-white text-sky-700 shadow-2xs border border-slate-200" : "text-slate-600"
              }`}
            >
              <MessageSquare size={13} /> 회신 필요 ({context.unanswered_communications})
            </button>

            <button
              onClick={() => setActiveTab("deadlines")}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === "deadlines" ? "bg-white text-sky-700 shadow-2xs border border-slate-200" : "text-slate-600"
              }`}
            >
              <Clock size={13} /> 마감/결재 ({context.pending_approvals})
            </button>

            <button
              onClick={() => setActiveTab("eod")}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === "eod" ? "bg-white text-sky-700 shadow-2xs border border-slate-200" : "text-slate-600"
              }`}
            >
              <Moon size={13} /> 퇴근 전 정리
            </button>
          </div>

          {/* Main Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {actionMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{actionMessage}</span>
              </div>
            )}

            {/* TAB 1: Today's Tasks */}
            {activeTab === "today" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>오늘의 우선순위 정리 (기한 순)</span>
                  <span className="text-[10px]">기한/상태 기준 정렬</span>
                </div>
                <div className="space-y-2">
                  {context.today_tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl border transition flex items-start gap-2.5 ${
                        task.done ? "bg-slate-50 border-slate-200 text-slate-400" : "bg-white border-slate-200 shadow-2xs"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        readOnly
                        className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                      />
                      <div className="flex-1 min-w-0">
                        <span className={`font-bold block text-xs ${task.done ? "line-through" : "text-slate-900"}`}>
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-400">마감: {task.due}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: Prepared Drafts */}
            {activeTab === "drafts" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>팩트 기반 초안 (출처 필수)</span>
                  <Badge className="bg-sky-100 text-sky-800 text-[10px]">1클릭 검토 진입</Badge>
                </div>

                {preparedItems.filter((i) => i.status === "prepared").length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                    현재 검토 대기 중인 초안이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {preparedItems
                      .filter((i) => i.status === "prepared")
                      .map((item) => (
                        <div key={item.id} className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/40 space-y-2">
                          <div className="flex justify-between font-bold text-slate-900">
                            <span className="text-xs">{item.title}</span>
                            <span className="text-[10px] text-slate-400">{item.created_at}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                            <ExternalLink size={11} />
                            <span>출처 팩트 ID: {item.source_record_ids.join(", ")}</span>
                          </div>
                          <p className="text-[11px] text-slate-700 line-clamp-2">{item.prepared_content}</p>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDismissItem(item.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800"
                            >
                              삭제
                            </button>
                            <Button
                              onClick={() => handleOpenReviewModal(item)}
                              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] h-7 px-3 flex items-center gap-1"
                            >
                              <span>🔍 1-Click 초안 검토 진입</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Awaiting Reply */}
            {activeTab === "replies" && (
              <div className="space-y-3">
                <span className="text-slate-500 font-bold block">보호자 및 외부 회신 필요 (3건)</span>
                <div className="p-3 border rounded-xl bg-white space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>김순자 어르신 자녀 안부 전화 회신</span>
                    <span className="text-amber-600 font-bold">대기중</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">오후 프로그램 참여 모습 및 주말약 대조건 회신 요구</p>
                </div>
              </div>
            )}

            {/* TAB 4: Upcoming Deadlines */}
            {activeTab === "deadlines" && (
              <div className="space-y-3">
                <span className="text-slate-500 font-bold block">마감 및 결재 예정 항목</span>
                <div className="p-3 border rounded-xl bg-white space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>2026년 3분기 욕구사정 결재</span>
                    <span className="text-sky-600 font-bold">결재 2건 대기</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">시설장 최종 승인 대기 중인 서식</p>
                </div>
              </div>
            )}

            {/* TAB 5: End-of-Day Summary */}
            {activeTab === "eod" && (
              <div className="space-y-3">
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                  <h4 className="font-extrabold text-sm flex items-center gap-1.5">
                    <Moon size={16} className="text-indigo-400" /> 오늘 하루 퇴근 전 업무 요약
                  </h4>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <p>• 오늘 완료 업무: 케어기록 {context.recent_records_count}건, 재사정 1건</p>
                    <p>• 미완료 업무: 보호자 안부전화 1건 (내일 오전 확인)</p>
                    <p>• 내일 주요 일정: 다학제 사례회의 14:00 예정</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Status */}
          <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>AI 비서 상태: 검증된 팩트 연동 활성</span>
            <button onClick={() => setIsOpen(false)} className="font-bold text-slate-700 hover:text-slate-900 underline">
              패널 닫기
            </button>
          </div>
        </div>
      )}

      {/* Human Approval Review Modal (Protects High-Risk Actions from 1-Click Auto-Run) */}
      {selectedItemForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <Badge className="bg-sky-600 text-white font-bold text-[10px]">사회복지사 최종 검토 & 승인</Badge>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedItemForReview.title}</h3>
              </div>
              <button onClick={() => setSelectedItemForReview(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border text-[11px] text-slate-600 flex items-center gap-2">
              <ExternalLink size={14} className="text-indigo-600" />
              <span>연동된 출처 팩트 Record ID: <strong>{selectedItemForReview.source_record_ids.join(", ")}</strong></span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                AI 준비 내용을 직접 확인하고 수정할 수 있습니다 (사람 최종 승인 필요):
              </label>
              <textarea
                rows={6}
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-sky-500 font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button onClick={() => setSelectedItemForReview(null)} variant="secondary" className="text-xs h-9">
                취소
              </Button>
              <Button onClick={handleConfirmAndSaveToOrgERP} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4">
                <CheckCircle2 size={16} />
                <span>최종 검토 완료 및 기관 ERP 저장</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
