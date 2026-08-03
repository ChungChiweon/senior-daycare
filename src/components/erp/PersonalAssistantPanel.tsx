"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Moon,
  PanelRightClose,
  Settings,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";
import type { AssistantPreparedItem, PersonalAssistantContext } from "@/types/personal-assistant";

const MOCK_CONTEXT: PersonalAssistantContext = {
  user_id: "u-social-01",
  user_name: "김복지 사회복지사",
  organization_id: "org-01",
  role: "사회복지사",
  today_tasks: [
    { id: "t1", title: "강태호 어르신 혈압 모니터링 후속 체크", due: "14:00", done: false },
    { id: "t2", title: "김순자 어르신 재사정 서식 팩트 정리", due: "16:30", done: true },
    { id: "t3", title: "신규 어르신 보호자 상담 회신", due: "17:00", done: false }
  ],
  pending_approvals: 2,
  upcoming_reviews: 1,
  unanswered_communications: 3,
  recent_records_count: 14,
  frequently_used_documents: ["급여제공기록지", "욕구사정서", "사례회의록"],
  prepared_items: [
    {
      id: "prep-01",
      user_id: "u-social-01",
      type: "counseling_summary",
      source_record_ids: ["rec-counsel-99"],
      title: "강태호 어르신 보호자 면담 초안",
      prepared_content: "• 요청사항: 주말 송영 시 차 휠체어 지원 희망\n• 후속과제: 송영 담당 운전기사 전달사항 등록",
      requires_human_decision: true,
      status: "prepared",
      created_at: "10분 전"
    },
    {
      id: "prep-02",
      user_id: "u-social-01",
      type: "conference_task_draft",
      source_record_ids: ["conf-01"],
      title: "사례회의 결정사항 ERP Task 발행 초안",
      prepared_content: "• 내용: 일 2회 혈압 측정 및 보호자 처방약 대조\n• 담당: 최간호 간호조무사 (기한: 2026.08.10)",
      requires_human_decision: true,
      status: "prepared",
      created_at: "30분 전"
    }
  ],
  assistant_preferences: {
    frequently_used_documents: ["급여제공기록지", "욕구사정서"],
    notification_frequency: "important_only",
    use_end_of_day_summary: true,
    default_panel_collapsed: false,
    visible_task_types: ["tasks", "approvals"],
    tone_style: "professional"
  }
};

export default function PersonalAssistantPanel() {
  const [isOpen, setIsOpen] = useState(false); // Collapsed by default for max screen space
  const [activeTab, setActiveTab] = useState<"today" | "drafts" | "replies" | "deadlines" | "eod">("today");
  const [preparedItems, setPreparedItems] = useState<AssistantPreparedItem[]>(MOCK_CONTEXT.prepared_items);
  const [showSettings, setShowSettings] = useState(false);
  const [toneStyle, setToneStyle] = useState<"professional" | "concise">("professional");
  const [acceptedMessage, setAcceptedMessage] = useState("");

  const handleAcceptItem = (id: string) => {
    setPreparedItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "accepted" } : item)));
    setAcceptedMessage("✅ 초안을 검토 후 최종 확정하였습니다. (ERP 업무 반영 완료)");
    setTimeout(() => setAcceptedMessage(""), 3000);
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
                  <h3 className="font-extrabold text-sm text-white">{MOCK_CONTEXT.user_name}의 AI 비서</h3>
                  <Badge className="bg-emerald-500 text-white text-[9px] font-bold py-0">개인 비서</Badge>
                </div>
                <span className="text-[11px] text-slate-400">반복·행정 업무 조용한 보조</span>
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
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                🔒 <strong>개인 프라이버시 준수</strong>: 본 AI 비서의 초안 및 대화 내용은 개인 전용이며, 기관 관리자가 조회할 수 없습니다.
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
              <CheckCircle2 size={13} /> 오늘 할 일 ({MOCK_CONTEXT.today_tasks.filter((t) => !t.done).length})
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
              <MessageSquare size={13} /> 회신 필요 ({MOCK_CONTEXT.unanswered_communications})
            </button>

            <button
              onClick={() => setActiveTab("deadlines")}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition flex items-center gap-1 shrink-0 ${
                activeTab === "deadlines" ? "bg-white text-sky-700 shadow-2xs border border-slate-200" : "text-slate-600"
              }`}
            >
              <Clock size={13} /> 마감/결재 ({MOCK_CONTEXT.pending_approvals})
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
            {acceptedMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>{acceptedMessage}</span>
              </div>
            )}

            {/* TAB 1: Today's Tasks */}
            {activeTab === "today" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>오늘의 우선순위 정리 (기한 순)</span>
                  <span className="text-[10px]">AI 우선순위 강제 변경 차단</span>
                </div>
                <div className="space-y-2">
                  {MOCK_CONTEXT.today_tasks.map((task) => (
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
                  <span>AI 비서가 조용히 준비한 초안</span>
                  <Badge className="bg-sky-100 text-sky-800 text-[10px]">자동 확정 0건 (사람 검토 필수)</Badge>
                </div>

                {preparedItems.filter((i) => i.status === "prepared").length === 0 ? (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed">
                    현재 검토 대기 중인 비서 초안이 없습니다.
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
                          <pre className="text-[11px] font-sans text-slate-800 bg-white p-2 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                            {item.prepared_content}
                          </pre>
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDismissItem(item.id)}
                              className="px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-slate-800"
                            >
                              삭제
                            </button>
                            <Button
                              onClick={() => handleAcceptItem(item.id)}
                              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] h-7 px-3 flex items-center gap-1"
                            >
                              <CheckCircle2 size={13} />
                              <span>1-Click 검토 후 최종 확정</span>
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
                  <p className="text-slate-600 text-[11px]">오후 프로그램 참여 모습사진 및 주말약 대조건 회신 요구</p>
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
                  <p className="text-slate-600 text-[11px]">시설장 최종 승인 대기 중인 문서 서식</p>
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
                    <p>• 오늘 완료 업무: 케어기록 14건, 재사정 1건</p>
                    <p>• 미완료 업무: 보호자 안부전화 1건 (내일 오전 확인)</p>
                    <p>• 내일 주요 일정: 다학제 사례회의 14:00 예정</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer status */}
          <div className="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>AI 비서 상태: 정상 작동 중</span>
            <button
              onClick={() => setIsOpen(false)}
              className="font-bold text-slate-700 hover:text-slate-900 underline"
            >
              패널 닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
