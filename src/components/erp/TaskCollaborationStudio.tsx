"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Filter,
  MessageSquare,
  Plus,
  Send,
  ShieldAlert,
  UserCheck,
  Users,
  Zap
} from "lucide-react";
import { localTaskRepository } from "@/lib/repository/local-task-repository";
import type { ErpRole, ErpTask, ErpTaskPriority, ErpTaskStatus } from "@/types/erp-task";
import { useCurrentUser } from "@/hooks/use-auth-org";
import { BETA_STAFF_ACCOUNTS } from "@/lib/data/beta-institution-seed";

type FilterTab = "my" | "requested" | "overdue" | "completed" | "all";

export function TaskCollaborationStudio() {
  const currentUser = useCurrentUser();
  const [tasks, setTasks] = useState<ErpTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("REQ-2026-001");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const [currentUserRole, setCurrentUserRole] = useState<ErpRole>(
    currentUser?.roleCode === "driver" ? "field_staff" : (currentUser?.roleCode || "social_worker")
  );
  const [currentUserName, setCurrentUserName] = useState(currentUser?.name || "사회복지사");

  // New Task Modal Form state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newAssignee, setNewAssignee] = useState("간호조무사");
  const [newResident, setNewResident] = useState("");
  const [newPriority, setNewPriority] = useState<ErpTaskPriority>("high");
  const [newDueDate, setNewDueDate] = useState("2026-08-01 17:00");

  // Comment input
  const [commentText, setCommentText] = useState("");
  const [notification, setNotification] = useState("");

  // Load tasks on mount
  useEffect(() => {
    const list = localTaskRepository.getTasks();
    setTasks(list);
    if (list.length > 0) {
      setSelectedTaskId(list[0].requestId);
    }
  }, []);

  const selectedTask = useMemo(() => {
    return tasks.find((t) => t.requestId === selectedTaskId) || tasks[0];
  }, [tasks, selectedTaskId]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (filterTab === "completed") return t.status === "completed";
      if (filterTab === "overdue") return t.priority === "urgent" || t.status === "support_needed";
      if (filterTab === "my") return t.assigneeName.includes(currentUserName);
      if (filterTab === "requested") return t.requesterName.includes(currentUserName);
      return true;
    });
  }, [tasks, filterTab, currentUserName]);

  // Handle status update (positive collaborative language)
  function handleUpdateStatus(newStatus: ErpTaskStatus, note: string) {
    if (!selectedTask) return;
    const updated = localTaskRepository.updateTaskStatus(
      selectedTask.requestId,
      newStatus,
      currentUserName,
      currentUserRole,
      note
    );
    if (updated) {
      setTasks(localTaskRepository.getTasks());
      setNotification(`✅ 업무 상태가 [${getStatusLabel(newStatus)}]로 업데이트되었습니다.`);
      setTimeout(() => setNotification(""), 3500);
    }
  }

  // Handle Comment Submission
  function handleAddComment() {
    if (!selectedTask || !commentText.trim()) return;
    const updated = localTaskRepository.addComment(selectedTask.requestId, {
      id: `cmt-${Date.now()}`,
      authorName: currentUserName,
      authorRole: currentUserRole,
      content: commentText.trim(),
      createdAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    });
    if (updated) {
      setTasks(localTaskRepository.getTasks());
      setCommentText("");
      setNotification("💬 의견/협업 메모가 등록되었습니다.");
      setTimeout(() => setNotification(""), 3000);
    }
  }

  // Handle New Task Creation
  function handleCreateTask() {
    if (!newTitle.trim()) return;
    const newTask: ErpTask = {
      requestId: `REQ-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      content: newContent.trim() || "상세 협업 요청 사항 확인 바랍니다.",
      requesterName: currentUserName,
      requesterRole: currentUserRole,
      assigneeName: newAssignee,
      assigneeRole: "nurse",
      residentId: "res-01",
      residentName: newResident.replace(" 어르신", ""),
      taskCategory: "health_care",
      priority: newPriority,
      requestedAt: new Date().toLocaleString("ko-KR"),
      dueDate: newDueDate,
      status: "unconfirmed",
      comments: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          actorName: currentUserName,
          actorRole: currentUserRole,
          actionType: "created",
          toStatus: "unconfirmed",
          note: "신규 협업 요청 생성",
          timestamp: new Date().toLocaleString("ko-KR")
        }
      ]
    };

    localTaskRepository.saveTask(newTask);
    setTasks(localTaskRepository.getTasks());
    setSelectedTaskId(newTask.requestId);
    setIsCreateOpen(false);
    setNewTitle("");
    setNewContent("");
    setNotification("✨ 신규 협업 요청이 등록되었습니다.");
    setTimeout(() => setNotification(""), 3500);
  }

  function getStatusBadge(status: ErpTaskStatus) {
    switch (status) {
      case "unconfirmed":
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold">확인 필요</Badge>;
      case "confirmed":
        return <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-bold">확인 완료</Badge>;
      case "in_progress":
        return <Badge className="bg-indigo-100 text-indigo-900 border-indigo-300 font-bold">진행 중</Badge>;
      case "support_needed":
        return <Badge className="bg-red-100 text-red-900 border-red-300 font-bold">지원 필요</Badge>;
      case "completion_requested":
        return <Badge className="bg-purple-100 text-purple-900 border-purple-300 font-bold">완료 요청</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">완료 확인</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700">보류</Badge>;
    }
  }

  function getStatusLabel(status: ErpTaskStatus) {
    switch (status) {
      case "unconfirmed":
        return "확인 필요";
      case "confirmed":
        return "확인 완료";
      case "in_progress":
        return "진행 중";
      case "support_needed":
        return "지원 필요";
      case "completion_requested":
        return "완료 요청";
      case "completed":
        return "완료 확인";
      default:
        return "보류";
    }
  }

  return (
    <div className="space-y-4 text-xs">
      {/* 🚀 Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 p-5 text-white shadow-lg space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
                ERP 실무 협업 엔진
              </Badge>
              <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
                구두/카카오톡 요청 일원화
              </Badge>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">
              현장 업무 요청 및 협업 센터 (`/tasks`)
            </h1>
            <p className="text-xs text-sky-100 mt-0.5">
              요양보호사, 간호인력, 사회복지사 간의 후속 케어 및 안내 요청을 ERP 내부에서 투명하고 긍정적인 협업 언어로 처리합니다.
            </p>
          </div>

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs h-10 px-4 shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Plus size={16} /> 신규 협업 요청 생성
          </Button>
        </div>
      </div>

      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-extrabold text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 3-Column ERP Layout */}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr_320px]">
        {/* 1. LEFT COLUMN: Task List & Filter Tabs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 space-y-3 shadow-2xs">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
              <Filter size={14} className="text-sky-600" /> 업무 목록 ({filteredTasks.length}건)
            </span>
          </div>

          <div className="flex overflow-x-auto gap-1 pb-1">
            {[
              ["all", "전체"],
              ["my", "내 업무"],
              ["requested", "요청한"],
              ["overdue", "긴급/지원"],
              ["completed", "완료"]
            ].map(([tabKey, label]) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setFilterTab(tabKey as FilterTab)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition ${
                  filterTab === tabKey
                    ? "bg-sky-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Task Items Feed */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                등록된 협업 업무가 없습니다.
              </div>
            ) : (
              filteredTasks.map((t) => {
                const isSelected = t.requestId === selectedTaskId;
                return (
                  <div
                    key={t.requestId}
                    onClick={() => setSelectedTaskId(t.requestId)}
                    className={`rounded-xl border p-3 cursor-pointer transition-all ${
                      isSelected
                        ? "border-sky-500 bg-sky-50/50 shadow-sm"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400 font-bold">{t.requestId}</span>
                      {getStatusBadge(t.status)}
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-xs leading-snug line-clamp-2">
                      {t.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 border-t border-slate-100 pt-1.5 font-medium">
                      <span>담당: <strong className="text-slate-800">{t.assigneeName}</strong></span>
                      {t.residentName && (
                        <span className="text-sky-700 font-bold">👤 {t.residentName} 어르신</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. CENTER COLUMN: Task Details & Collaboration Workflow */}
        {selectedTask ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-2xs">
            {/* Detail Top Header */}
            <div className="border-b border-slate-100 pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-slate-100 text-slate-700 font-bold">
                    {selectedTask.requestId}
                  </Badge>
                  {getStatusBadge(selectedTask.status)}
                  {selectedTask.priority === "urgent" && (
                    <Badge className="bg-red-500 text-white font-bold animate-pulse">🔴 긴급</Badge>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  요청일: {selectedTask.requestedAt} | 마감: {selectedTask.dueDate}
                </span>
              </div>

              <h2 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                {selectedTask.title}
              </h2>
            </div>

            {/* Task Main Content */}
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
              <span className="font-bold text-slate-700 block text-xs">📋 상세 요청 내용</span>
              <p className="text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                {selectedTask.content}
              </p>

              {selectedTask.resolutionText && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 mt-2 space-y-1">
                  <span className="font-extrabold text-emerald-900 text-[11px] flex items-center gap-1">
                    <CheckCircle2 size={13} /> 처리 및 완료 조치 결과:
                  </span>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {selectedTask.resolutionText}
                  </p>
                </div>
              )}
            </div>

            {/* Positive Collaborative Workflow Status Buttons */}
            <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-3 space-y-2">
              <span className="font-bold text-slate-800 block text-[11px] flex items-center gap-1">
                <Zap size={13} className="text-sky-600" /> 협업 상태 단계 업데이트 (긍정 언어 가이드 적용):
              </span>

              <div className="flex flex-wrap gap-1.5">
                <Button
                  onClick={() => handleUpdateStatus("in_progress", "담당자 확인 후 케어 진행 조치")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] h-8"
                >
                  ▶️ 진행 중 상태로 변경
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("support_needed", "추가 인력/간호 지원 필요함")}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] h-8"
                >
                  🤝 지원 필요 요청
                </Button>
                <Button
                  onClick={() => handleUpdateStatus("completed", "요청 조치 사항 완료 확인됨")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-8"
                >
                  ✅ 완료 확인 (조치 100%)
                </Button>
              </div>
            </div>

            {/* Comments / Discussion Feed */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                <MessageSquare size={14} className="text-sky-600" /> 실시간 협업 의견 및 처리 메모 ({selectedTask.comments.length}건)
              </span>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedTask.comments.map((c) => (
                  <div key={c.id} className="rounded-xl bg-slate-50 border border-slate-200 p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-[11px]">
                        {c.authorName} ({c.authorRole})
                      </span>
                      <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>

              {/* Comment Input Form */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="협업 조치 의견이나 메모를 작성하세요..."
                  className="h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs focus:bg-white focus:border-sky-400 outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <Button
                  onClick={handleAddComment}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9 px-3 flex items-center gap-1"
                >
                  <Send size={13} /> 의견 등록
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* 3. RIGHT COLUMN: Context & Related Entities */}
        {selectedTask ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 shadow-2xs">
            <span className="font-extrabold text-slate-900 text-xs block border-b border-slate-100 pb-2">
              🔗 관련 맥락 정보 (Context)
            </span>

            {/* Resident Info Context */}
            {selectedTask.residentName && (
              <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3 space-y-1.5">
                <span className="font-bold text-sky-950 text-xs flex items-center gap-1">
                  <UserCheck size={14} className="text-sky-600" /> 관련 이용자 어르신
                </span>
                <p className="font-extrabold text-slate-900 text-sm">
                  {selectedTask.residentName} 어르신
                </p>
                <p className="text-[10px] text-slate-500">
                  출석 상태: <strong className="text-emerald-700 font-bold">오늘 등원 완료 (08:45)</strong>
                </p>
              </div>
            )}

            {/* Related Document Context */}
            {selectedTask.relatedDocTitle && (
              <div className="rounded-xl border border-purple-200 bg-purple-50/40 p-3 space-y-1.5">
                <span className="font-bold text-purple-950 text-xs flex items-center gap-1">
                  <FileText size={14} className="text-purple-600" /> 연관 20종 AI 생성 문서
                </span>
                <p className="font-bold text-purple-900 text-xs">{selectedTask.relatedDocTitle}</p>
                <p className="text-[10px] text-purple-700 font-medium">
                  상태: 20종 자동 생성 및 합성 연동됨
                </p>
              </div>
            )}

            {/* Related RecordBlock Context */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-1.5">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1">
                <Zap size={14} className="text-amber-500" /> 연결된 RecordBlock
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                [{selectedTask.relatedBlockId || "blk-010"}] 특이사항 블록 - 케어 관찰 사실 연결됨
              </p>
            </div>

            {/* Workflow Activity History Log */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-800 text-xs block">📜 이력 처리 로그</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedTask.history.map((h) => (
                  <div key={h.id} className="text-[10px] text-slate-600 space-y-0.5 border-l-2 border-sky-400 pl-2">
                    <div className="font-bold text-slate-800">
                      {h.actorName} - {h.note}
                    </div>
                    <div className="text-slate-400">{h.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {!selectedTask && (
          <div className="col-span-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600 mb-1">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-base font-black text-slate-900">선택되거나 등록된 협업 업무가 없습니다.</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              상단 [+ 신규 협업 요청 생성] 버튼을 눌러 테스트용 업무 요청을 등록해보세요.
            </p>
          </div>
        )}
      </div>

      {/* Modal for Creating New Task Request */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 space-y-3 shadow-xl">
            <h3 className="font-black text-slate-900 text-base border-b border-slate-100 pb-2">
              ➕ 신규 업무 요청·협업 등록
            </h3>

            <div>
              <label className="font-bold text-slate-700 block mb-1">제목</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예: 어르신 하원 시 약물 전달 및 온찜질 케어"
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">상세 요청 내용</label>
              <textarea
                rows={3}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="담당자가 처리할 상세 협업 요청 내용"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">담당자</label>
                <select
                  value={newAssignee}
                  onChange={(e) => setNewAssignee(e.target.value)}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-bold"
                >
                  {BETA_STAFF_ACCOUNTS.map((staff) => (
                    <option key={staff.id} value={`${staff.name} (${staff.roleLabel})`}>
                      {staff.name} ({staff.roleLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">우선순위</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as ErpTaskPriority)}
                  className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-bold"
                >
                  <option value="urgent">🔴 긴급</option>
                  <option value="high">🟠 높음</option>
                  <option value="normal">🔵 보통</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                onClick={() => setIsCreateOpen(false)}
                className="flex-1 font-bold text-xs h-9 bg-slate-100 text-slate-700"
              >
                취소
              </Button>
              <Button
                onClick={handleCreateTask}
                className="flex-1 font-bold text-xs h-9 bg-sky-600 hover:bg-sky-700 text-white"
              >
                요청 등록하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
