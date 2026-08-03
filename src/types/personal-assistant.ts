export type PreparedItemStatus = "prepared" | "reviewed" | "accepted" | "dismissed";

export type AssistantSourceType =
  | "daily_record_block"
  | "case_conference_decision"
  | "counseling_raw_log"
  | "handover_fact";

export type AssistantPreparedItem = {
  id: string;
  user_id: string;
  organization_id: string;
  source_type: AssistantSourceType;
  source_record_ids: string[]; // 필수: 출처 팩트 ID
  source_version_id?: string;
  source_updated_at?: string; // 원본 수정 시각 (Stale 검증용)
  source_completeness: "complete" | "partial";
  type: "counseling_summary" | "conference_task_draft" | "monthly_doc_draft" | "handover_note";
  title: string;
  prepared_content: string;
  requires_human_decision: boolean;
  status: PreparedItemStatus;
  created_at: string;
  expires_at?: string;
  is_stale?: boolean;
};

export type AutoAllowedCapability =
  | "read"
  | "search"
  | "summarize"
  | "compare"
  | "prepare_draft"
  | "prepare_task_candidate"
  | "notify";

export type HumanApprovalRequiredCapability =
  | "save_institution_record"
  | "assign_task"
  | "update_service_plan"
  | "send_guardian_message"
  | "submit_external_document"
  | "request_approval"
  | "finalize_document";

export type AgentCapability = AutoAllowedCapability | HumanApprovalRequiredCapability;

export type PerformanceMetric = {
  scenario_id: string;
  measurement_type: "demo" | "simulated" | "field";
  measured_at: string;
  participant_count: number;
  clicks_without_ai: number;
  clicks_with_ai: number;
  chars_without_ai: number;
  chars_with_ai: number;
  evidence_reference: string;
};

export type AssistantPreferences = {
  frequently_used_documents: string[];
  notification_frequency: "all" | "important_only" | "silent";
  use_end_of_day_summary: boolean;
  default_panel_collapsed: boolean;
  visible_task_types: string[];
  tone_style: "professional" | "concise" | "friendly";
};

export type PersonalAssistantContext = {
  user_id: string;
  user_name: string;
  organization_id: string;
  role: string;
  assigned_residents_count: number;
  today_tasks: { id: string; title: string; due: string; done: boolean }[];
  pending_approvals: number;
  upcoming_reviews: number;
  unanswered_communications: number;
  recent_records_count: number;
  frequently_used_documents: string[];
  prepared_items: AssistantPreparedItem[];
  assistant_preferences: AssistantPreferences;
  is_fallback_mode?: boolean;
};
