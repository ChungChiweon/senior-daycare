import type { ErpRole, ErpTask, ErpTaskStatus, TaskComment, TaskHistoryItem } from "@/types/erp-task";

const STORAGE_KEY = "silvercare.erpTasks";

const MOCK_INITIAL_TASKS: ErpTask[] = [
  {
    requestId: "REQ-2026-001",
    title: "김순자 어르신 무릎 온찜질 지원 및 가정 케어 가이드 전달",
    content: "보호자님께서 무릎 불편감을 언급하셨습니다. 하원 전 15분 무릎 온찜질 케어 후 알림장에 온찜질 당부 메시지를 포함해 주세요.",
    requesterName: "박지영 사회복지사",
    requesterRole: "social_worker",
    assigneeName: "이간호 간호조무사",
    assigneeRole: "nurse",
    residentId: "res-01",
    residentName: "김순자",
    taskCategory: "guardian_request",
    relatedDocId: "doc_01",
    relatedDocTitle: "보호자 일일 알림장",
    relatedBlockId: "blk-010",
    priority: "urgent",
    requestedAt: "2026-08-01 09:30",
    dueDate: "2026-08-01 16:00",
    status: "in_progress",
    comments: [
      {
        id: "cmt-1",
        authorName: "이간호 간호조무사",
        authorRole: "nurse",
        content: "오후 14:00 물리치료실에서 온찜질 15분 실시 예정입니다.",
        createdAt: "2026-08-01 10:15"
      }
    ],
    history: [
      {
        id: "hist-1",
        actorName: "박지영 사회복지사",
        actorRole: "social_worker",
        actionType: "created",
        toStatus: "unconfirmed",
        note: "보호자 상담 접수 후 협업 요청 생성",
        timestamp: "2026-08-01 09:30"
      },
      {
        id: "hist-2",
        actorName: "이간호 간호조무사",
        actorRole: "nurse",
        actionType: "status_changed",
        fromStatus: "unconfirmed",
        toStatus: "in_progress",
        note: "확인 후 케어 진행 중",
        timestamp: "2026-08-01 10:15"
      }
    ]
  },
  {
    requestId: "REQ-2026-002",
    title: "박영수 어르신 신규 당뇨 처방약 변경 수령 및 투약 기록",
    content: "보호자님이 아침 송영 시 전달해 주신 신규 점심 처방약(식후 30분) 정량 복용 확인 및 바이탈 기록 요청.",
    requesterName: "김송영 요양보호사",
    requesterRole: "field_staff",
    assigneeName: "이간호 간호조무사",
    assigneeRole: "nurse",
    residentId: "res-02",
    residentName: "박영수",
    taskCategory: "health_care",
    relatedDocId: "doc_08",
    relatedDocTitle: "건강·투약·바이탈 보고서",
    relatedBlockId: "blk-004",
    priority: "high",
    requestedAt: "2026-08-01 08:50",
    dueDate: "2026-08-01 13:00",
    status: "completed",
    resolutionText: "점심 식후 12:40 정량 투약 완료. 혈당 125 mg/dL 측정 정상.",
    approverName: "김철수 센터장",
    comments: [
      {
        id: "cmt-2",
        authorName: "이간호 간호조무사",
        authorRole: "nurse",
        content: "점심 투약 및 혈당 체크 완료했습니다.",
        createdAt: "2026-08-01 12:45"
      }
    ],
    history: [
      {
        id: "hist-3",
        actorName: "김송영 요양보호사",
        actorRole: "field_staff",
        actionType: "created",
        toStatus: "unconfirmed",
        note: "송영 시 수령약 전달",
        timestamp: "2026-08-01 08:50"
      },
      {
        id: "hist-4",
        actorName: "이간호 간호조무사",
        actorRole: "nurse",
        actionType: "status_changed",
        fromStatus: "in_progress",
        toStatus: "completed",
        note: "투약 조치 및 완료 확인",
        timestamp: "2026-08-01 12:45"
      }
    ]
  },
  {
    requestId: "REQ-2026-003",
    title: "7월 장기요양급여 제공기록지 최종 결재 및 건보공단 제출",
    content: "전체 18명 수급자 제공기록지 블록 검토가 완료되었습니다. 센터장 최종 서명 후 공단 전송 바랍니다.",
    requesterName: "박지영 사회복지사",
    requesterRole: "social_worker",
    assigneeName: "김철수 센터장",
    assigneeRole: "manager",
    taskCategory: "approval",
    relatedDocId: "doc_06",
    relatedDocTitle: "장기요양급여 제공기록 문안",
    priority: "normal",
    requestedAt: "2026-08-01 11:00",
    dueDate: "2026-08-01 18:00",
    status: "completion_requested",
    comments: [],
    history: [
      {
        id: "hist-5",
        actorName: "박지영 사회복지사",
        actorRole: "social_worker",
        actionType: "created",
        toStatus: "completion_requested",
        note: "서류 작성 및 전자 결재 요청 제출",
        timestamp: "2026-08-01 11:00"
      }
    ]
  },
  {
    requestId: "REQ-2026-004",
    title: "이정자 어르신 등급 재판정 서류 본인부담금 감경 동의서 확인",
    content: "8월 장기요양 등급 갱신 서류 중 보호자 동의 서명 누락건 확인 및 보호자 팩스 전송 안내.",
    requesterName: "최사무 행정주임",
    requesterRole: "clerk",
    assigneeName: "박지영 사회복지사",
    assigneeRole: "social_worker",
    residentId: "res-03",
    residentName: "이정자",
    taskCategory: "facility",
    priority: "normal",
    requestedAt: "2026-08-01 10:00",
    dueDate: "2026-08-02 17:00",
    status: "support_needed",
    comments: [
      {
        id: "cmt-3",
        authorName: "박지영 사회복지사",
        authorRole: "social_worker",
        content: "보호자 통화 완료하였으며 오늘 하원 시간 방문하여 서명하시기로 하셨습니다.",
        createdAt: "2026-08-01 11:30"
      }
    ],
    history: [
      {
        id: "hist-6",
        actorName: "최사무 행정주임",
        actorRole: "clerk",
        actionType: "created",
        toStatus: "unconfirmed",
        note: "행정 서류 누락건 확인 요청",
        timestamp: "2026-08-01 10:00"
      }
    ]
  }
];

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage [${key}]`, err);
  }
}

export class LocalTaskRepository {
  getTasks(): ErpTask[] {
    return readStorage<ErpTask[]>(STORAGE_KEY, []);
  }

  saveTask(task: ErpTask): void {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.requestId === task.requestId);
    if (idx >= 0) {
      tasks[idx] = task;
    } else {
      tasks.unshift(task);
    }
    writeStorage(STORAGE_KEY, tasks);
  }

  updateTaskStatus(
    requestId: string,
    newStatus: ErpTaskStatus,
    actorName: string,
    actorRole: ErpRole,
    note: string = ""
  ): ErpTask | null {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.requestId === requestId);
    if (idx < 0) return null;

    const current = tasks[idx];
    const historyItem: TaskHistoryItem = {
      id: `hist-${Date.now()}`,
      actorName,
      actorRole,
      actionType: "status_changed",
      fromStatus: current.status,
      toStatus: newStatus,
      note: note || `상태 변경: ${newStatus}`,
      timestamp: new Date().toLocaleString("ko-KR")
    };

    const updated: ErpTask = {
      ...current,
      status: newStatus,
      resolutionText: newStatus === "completed" ? note || "완료 처리됨" : current.resolutionText,
      history: [historyItem, ...current.history]
    };

    tasks[idx] = updated;
    writeStorage(STORAGE_KEY, tasks);
    return updated;
  }

  addComment(requestId: string, comment: TaskComment): ErpTask | null {
    const tasks = this.getTasks();
    const idx = tasks.findIndex((t) => t.requestId === requestId);
    if (idx < 0) return null;

    const current = tasks[idx];
    const updated: ErpTask = {
      ...current,
      comments: [...current.comments, comment]
    };

    tasks[idx] = updated;
    writeStorage(STORAGE_KEY, tasks);
    return updated;
  }

  getTasksByResident(residentId: string): ErpTask[] {
    const tasks = this.getTasks();
    return tasks.filter((t) => t.residentId === residentId);
  }
}

export const localTaskRepository = new LocalTaskRepository();
