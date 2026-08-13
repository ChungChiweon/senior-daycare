import type {
  AgentCapability,
  AssistantPreparedItem,
  PerformanceMetric,
  PersonalAssistantContext
} from "@/types/personal-assistant";

export const AUTO_ALLOWED_CAPABILITIES = new Set<AgentCapability>([
  "read",
  "search",
  "summarize",
  "compare",
  "prepare_draft",
  "prepare_task_candidate",
  "notify"
]);

export const HUMAN_APPROVAL_REQUIRED_CAPABILITIES = new Set<AgentCapability>([
  "save_institution_record",
  "assign_task",
  "update_service_plan",
  "send_guardian_message",
  "submit_external_document",
  "request_approval",
  "finalize_document"
]);

export class AgentCapabilityGuard {
  /**
   * Service-layer enforcement: Prevent AI Agent from executing high-risk actions without explicit user approval.
   */
  static executeCapability(capability: AgentCapability, hasHumanApproval: boolean): void {
    if (HUMAN_APPROVAL_REQUIRED_CAPABILITIES.has(capability) && !hasHumanApproval) {
      throw new Error(
        `[AgentCapabilityGuard Error] Action '${capability}' requires explicit human approval. Execution blocked at service layer.`
      );
    }
  }
}

export const SIMULATED_PERFORMANCE_METRICS: PerformanceMetric = {
  scenario_id: "scen-day-01-simulated",
  measurement_type: "simulated",
  measured_at: "2026-08-03",
  participant_count: 1,
  clicks_without_ai: 28,
  clicks_with_ai: 14,
  chars_without_ai: 1200,
  chars_with_ai: 180,
  evidence_reference: "업무 절감 가능성 검증용 시나리오 결과 (시뮬레이션)"
};

export class PersonalAssistantEngine {
  /**
   * Build Personal Assistant Context bound to Auth credentials and Real User-Entered Data.
   * In fresh Beta state, starts with 0 pre-seeded mock records and displays clean Empty States.
   */
  static buildContextFromAuth(
    userId?: string,
    orgId?: string,
    role = "사회복지사",
    userEnteredTasks: { id: string; title: string; due: string; done: boolean }[] = [],
    userEnteredPreparedItems: AssistantPreparedItem[] = [],
    assignedResidentsCount = 0,
    recentRecordsCount = 0
  ): PersonalAssistantContext | null {
    if (!userId || !orgId) {
      console.info("PersonalAssistantEngine: Unauthenticated or missing organization. Returning empty state.");
      return null;
    }

    return {
      user_id: userId,
      user_name: role === "사회복지사" ? "사회복지사 (베타 참여자)" : "기관 관리자",
      organization_id: orgId,
      role: role,
      assigned_residents_count: assignedResidentsCount,
      today_tasks: userEnteredTasks,
      pending_approvals: 0,
      upcoming_reviews: 0,
      unanswered_communications: 0,
      recent_records_count: recentRecordsCount,
      frequently_used_documents: ["급여제공기록지", "욕구사정서", "사례회의록"],
      prepared_items: userEnteredPreparedItems,
      assistant_preferences: {
        frequently_used_documents: ["급여제공기록지", "욕구사정서"],
        notification_frequency: "important_only",
        use_end_of_day_summary: true,
        default_panel_collapsed: true,
        visible_task_types: ["tasks", "approvals"],
        tone_style: "professional"
      },
      is_fallback_mode: false
    };
  }

  /**
   * Validate if the draft's source record has been updated since draft creation (Stale Draft Detection)
   */
  static validatePreparedItemStaleness(
    item: AssistantPreparedItem,
    latestSourceUpdatedAt?: string
  ): { isStale: boolean; errorMessage?: string } {
    if (!latestSourceUpdatedAt || !item.source_updated_at) {
      return { isStale: false };
    }

    if (new Date(latestSourceUpdatedAt) > new Date(item.source_updated_at)) {
      return {
        isStale: true,
        errorMessage: "초안 생성 후 원본 기록이 변경되었습니다. 다시 준비해주세요."
      };
    }

    return { isStale: false };
  }
}
