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
  source_completeness: "complete" | "partial";
  type: "counseling_summary" | "conference_task_draft" | "monthly_doc_draft" | "handover_note";
  title: string;
  prepared_content: string;
  requires_human_decision: boolean;
  status: PreparedItemStatus;
  created_at: string;
  expires_at?: string;
  is_demo_fallback?: boolean;
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
