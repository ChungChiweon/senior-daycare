export type AuditLogEntry = {
  id: string;
  organizationId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: "create" | "update" | "delete" | "approve" | "reject" | "invite" | "role_change";
  targetType: "resident" | "record_block" | "document" | "task" | "user" | "organization";
  targetId: string;
  description: string;
  beforeData?: Record<string, unknown>;
  afterData?: Record<string, unknown>;
  timestamp: string;
};

export class AuditLogger {
  private static STORAGE_KEY = "silvercare.auditLogs";

  static getLogs(orgId: string = "org-daycare-a"): AuditLogEntry[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return this.getInitialLogs(orgId);
      const list: AuditLogEntry[] = JSON.parse(raw);
      return list.filter((l) => l.organizationId === orgId);
    } catch {
      return this.getInitialLogs(orgId);
    }
  }

  static logAction(entry: Omit<AuditLogEntry, "id" | "timestamp">): AuditLogEntry {
    const fullEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString("ko-KR")
    };

    if (typeof window !== "undefined") {
      const current = this.getLogs(entry.organizationId);
      const next = [fullEntry, ...current];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next));
    }

    return fullEntry;
  }

  private static getInitialLogs(orgId: string): AuditLogEntry[] {
    return [
      {
        id: "audit-01",
        organizationId: orgId,
        userId: "staff-01",
        userName: "김철수 센터장",
        userRole: "manager",
        action: "approve",
        targetType: "document",
        targetId: "doc-01",
        description: "김순자 어르신 장기요양급여 제공기록지 최종 전자 결재 서명 완료",
        timestamp: "2026-08-01 17:05"
      },
      {
        id: "audit-02",
        organizationId: orgId,
        userId: "staff-02",
        userName: "박지영 사회복지사",
        userRole: "social_worker",
        action: "create",
        targetType: "document",
        targetId: "doc-01",
        description: "20종 레지스트리 기반 AI 일일 알림장 동적 문안 자동 생성",
        timestamp: "2026-08-01 16:30"
      },
      {
        id: "audit-03",
        organizationId: orgId,
        userId: "staff-06",
        userName: "김송영 요양보호사",
        userRole: "field_staff",
        action: "create",
        targetType: "task",
        targetId: "req-101",
        description: "현장 모바일 인수인계 전달사항 ➔ 간호팀 무릎 온찜질 협업 업무로 1-Tap 전환",
        timestamp: "2026-08-01 14:05"
      }
    ];
  }
}
