export type PreparedItemStatus = "prepared" | "reviewed" | "accepted" | "dismissed";

export type AssistantPreparedItem = {
  id: string;
  user_id: string;
  type: "counseling_summary" | "conference_task_draft" | "monthly_doc_draft" | "handover_note";
  source_record_ids: string[];
  title: string;
  prepared_content: string;
  requires_human_decision: boolean;
  status: PreparedItemStatus;
  created_at: string;
  expires_at?: string;
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
  today_tasks: { id: string; title: string; due: string; done: boolean }[];
  pending_approvals: number;
  upcoming_reviews: number;
  unanswered_communications: number;
  recent_records_count: number;
  frequently_used_documents: string[];
  prepared_items: AssistantPreparedItem[];
  assistant_preferences: AssistantPreferences;
};
