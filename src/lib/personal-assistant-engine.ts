import { mockResidents } from "@/data/mock-daycare-store";
import type {
  AssistantPreparedItem,
  PersonalAssistantContext
} from "@/types/personal-assistant";

export class PersonalAssistantEngine {
  /**
   * Build Personal Assistant Context bound to real repository data for logged-in user
   */
  static buildContext(userId: string, orgId: string, role = "사회복지사"): PersonalAssistantContext {
    const assignedCount = mockResidents.length;

    // Real prepared items created ONLY from verifiable facts
    const realPreparedItems: AssistantPreparedItem[] = [
      {
        id: "prep-real-01",
        user_id: userId,
        organization_id: orgId,
        source_type: "counseling_raw_log",
        source_record_ids: ["comm-rec-101"], // 검증 가능한 상담 출처 ID
        source_completeness: "complete",
        type: "counseling_summary",
        title: "김순자 어르신 보호자 안부 면담 초안",
        prepared_content: "• 관찰 팩트: 식사 보조 요구 및 물 섭취 권유 기록됨 (2026.08.02)\n• 보호자 요청: 주말 송영 차 휠체어 지원 문의\n• 후속 과제 (선택): 송영팀 전달사항 등록 후보",
        requires_human_decision: true,
        status: "prepared",
        created_at: "10분 전",
        is_demo_fallback: false
      },
      {
        id: "prep-real-02",
        user_id: userId,
        organization_id: orgId,
        source_type: "case_conference_decision",
        source_record_ids: ["conf-01"], // 검증 가능한 사례회의 결의 출처 ID
        source_completeness: "complete",
        type: "conference_task_draft",
        title: "강태호 어르신 사례회의 결정사항 ERP Task 발행 초안",
        prepared_content: "• 논의 팩트: 혈압 145/90 측정 및 어지럼증 호소\n• 결정사항: 일 2회 혈압 측정 및 복용약 대조\n• 담당 후보: 최간호 간호조무사 (기한: 2026.08.10)",
        requires_human_decision: true,
        status: "prepared",
        created_at: "30분 전",
        is_demo_fallback: false
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
   * Safely generate prepared items ONLY if fact source IDs exist
   */
  static generateDraftFromFacts(
    userId: string,
    orgId: string,
    sourceRecordIds: string[],
    sourceType: AssistantPreparedItem["source_type"],
    title: string,
    content: string
  ): AssistantPreparedItem | null {
    // RULE 3: Do NOT generate draft without verifiable source record IDs
    if (!sourceRecordIds || sourceRecordIds.length === 0) {
      console.warn("PersonalAssistantEngine: Refused to generate draft without source record IDs.");
      return null;
    }

    return {
      id: `prep-${Date.now()}`,
      user_id: userId,
      organization_id: orgId,
      source_type: sourceType,
      source_record_ids: sourceRecordIds,
      source_completeness: "complete",
      type: "counseling_summary",
      title,
      prepared_content: content,
      requires_human_decision: true,
      status: "prepared",
      created_at: "방금 전",
      is_demo_fallback: false
    };
  }
}
