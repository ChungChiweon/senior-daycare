export type ErpTaskStatus =
  | "unconfirmed" // 확인 전
  | "confirmed" // 확인 완료
  | "in_progress" // 진행 중
  | "support_needed" // 지원 필요
  | "completion_requested" // 완료 요청
  | "completed" // 완료 확인
  | "deferred" // 보류
  | "re_requested"; // 재요청

export type ErpTaskPriority = "urgent" | "high" | "normal" | "low";

export type ErpTaskCategory =
  | "guardian_request" // 보호자 요청
  | "health_care" // 건강·간호 케어
  | "document_draft" // 문서 작성
  | "approval" // 결재 승인
  | "program" // 프로그램
  | "facility" // 시설·송영
  | "general"; // 일반 협업

export type ErpRole = "manager" | "social_worker" | "clerk" | "field_staff" | "nurse";

export type TaskHistoryItem = {
  id: string;
  actorName: string;
  actorRole: ErpRole;
  actionType: "created" | "status_changed" | "comment_added" | "assignee_changed";
  fromStatus?: ErpTaskStatus;
  toStatus?: ErpTaskStatus;
  note: string;
  timestamp: string;
};

export type TaskComment = {
  id: string;
  authorName: string;
  authorRole: ErpRole;
  content: string;
  createdAt: string;
};

export type ErpTask = {
  requestId: string;
  title: string;
  content: string;
  requesterName: string;
  requesterRole: ErpRole;
  assigneeName: string;
  assigneeRole: ErpRole;
  residentId?: string;
  residentName?: string;
  taskCategory: ErpTaskCategory;
  relatedDocId?: string;
  relatedDocTitle?: string;
  relatedBlockId?: string;
  priority: ErpTaskPriority;
  requestedAt: string;
  dueDate: string;
  status: ErpTaskStatus;
  resolutionText?: string;
  approverName?: string;
  comments: TaskComment[];
  history: TaskHistoryItem[];
};
