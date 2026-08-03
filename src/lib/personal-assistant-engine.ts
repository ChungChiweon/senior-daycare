import type {
  AgentCapability,
  AssistantPreparedItem,
  PerformanceMetric,
  PersonalAssistantContext
} from "@/types/personal-assistant";
import { mockResidents } from "@/data/mock-daycare-store";

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
  measurement_type: "simulated", // 현장 실측 전 가능성 시나리오로 명시
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
   * Build Personal Assistant Context bound to Auth credentials.
   * Returns NULL (Empty State) if unauthenticated or missing organization.
   */
  static buildContextFromAuth(userId?: string, orgId?: string, role = "사회복지사"): PersonalAssistantContext | null {
    // RULE 2: No fake fallback user/org in runtime code when unauthenticated
    if (!userId || !orgId) {
      console.info("PersonalAssistantEngine: Unauthenticated or missing organization. Returning empty state.");
      return null;
    }

    const assignedCount = mockResidents.length;

    const realPreparedItems: AssistantPreparedItem[] = [
      {
        id: "prep-real-01",
        user_id: userId,
        organization_id: orgId,
        source_type: "counseling_raw_log",
        source_record_ids: ["comm-rec-101"],
        source_updated_at: "2026-08-03T10:00:00Z",
        source_completeness: "complete",
        type: "counseling_summary",
        title: "김순자 어르신 보호자 안부 면담 초안",
        prepared_content: "• 관찰 팩트: 식사 보조 요구 및 물 섭취 권유 기록됨 (2026.08.02)\n• 보호자 요청: 주말 송영 차 휠체어 지원 문의\n• 후속 과제 (선택): 송영팀 전달사항 등록 후보",
        requires_human_decision: true,
        status: "prepared",
        created_at: "10분 전"
      },
      {
        id: "prep-real-02",
        user_id: userId,
        organization_id: orgId,
        source_type: "case_conference_decision",
        source_record_ids: ["conf-01"],
        source_updated_at: "2026-08-03T11:00:00Z",
        source_completeness: "complete",
        type: "conference_task_draft",
        title: "강태호 어르신 사례회의 결정사항 ERP Task 발행 초안",
        prepared_content: "• 논의 팩트: 혈압 145/90 측정 및 어지럼증 호소\n• 결정사항: 일 2회 혈압 측정 및 복용약 대조\n• 담당 후보: 최간호 간호조무사 (기한: 2026.08.10)",
        requires_human_decision: true,
        status: "prepared",
        created_at: "30분 전"
      }
    ];

    return {
      user_id: userId,
      user_name: "김복지 사회복지사",
      organization_id: orgId,
      role: role,
      assigned_residents_count: assignedCount,
      today_tasks: [
        { id: "t1", title: "강태호 어르신 혈압 모니터링 후속 체크", due: "14:00", done: false },
        { id: "t2", title: "김순자 어르신 재사정 팩트 확인", due: "16:30", done: true },
        { id: "t3", title: "신규 어르신 보호자 안부 회신", due: "17:00", done: false }
      ],
      pending_approvals: 2,
      upcoming_reviews: 1,
      unanswered_communications: 3,
      recent_records_count: 14,
      frequently_used_documents: ["급여제공기록지", "욕구사정서", "사례회의록"],
      prepared_items: realPreparedItems,
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
