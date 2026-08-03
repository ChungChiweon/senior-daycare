export type MeasurementType = "simulated" | "field";

export type ComparisonMode = "erp_only" | "erp_with_ai";

export type BetaTaskScenario =
  | "scenario_1_morning_check"
  | "scenario_2_daily_observation"
  | "scenario_3_guardian_counseling"
  | "scenario_4_case_conference"
  | "scenario_5_document_draft"
  | "scenario_6_end_of_day_handover";

export type DraftAdoptionState = "as_is" | "modified" | "heavily_modified" | "dismissed";

export type InterruptionReason =
  | "too_many_notifications"
  | "too_many_steps"
  | "inaccurate_info"
  | "complex_ui"
  | "faster_manually"
  | "other";

export type InterruptionRating = "helpful" | "neutral" | "interrupted";

export type HumanJudgmentSafetyCheck = {
  ai_attempted_judgment: boolean;
  included_judgmental_expression: boolean;
  factual_inaccuracy: boolean;
  induced_user_decision: boolean;
  is_safety_issue: boolean;
};

export type WorkInterruptionFeedback = {
  rating: InterruptionRating;
  interruption_reasons?: InterruptionReason[];
  user_note?: string;
};

export type FieldBetaMeasurementLog = {
  id: string;
  measurement_type: MeasurementType;
  mode: ComparisonMode;
  organization_id: string;
  participant_id: string; // 익명 ID (e.g. "sw-anon-882")
  role: string;
  scenario_id: BetaTaskScenario;
  started_at: string;
  completed_at: string;
  duration_seconds: number;
  click_count: number;
  navigation_count: number;
  typed_character_count: number;
  duplicate_input_count: number;
  ai_draft_used?: DraftAdoptionState;
  safety_check?: HumanJudgmentSafetyCheck;
  interruption_feedback?: WorkInterruptionFeedback;
};

export type FieldInterviewGuide = {
  question_1_reduced_tasks: string;
  question_2_increased_tasks: string;
  question_3_most_used_feature: string;
  question_4_hard_to_trust_draft: string;
  question_5_ai_overreach_moments: string;
  question_6_indispensable_feature: string;
  question_7_feature_to_remove: string;
};

export type BetaReportMetrics = {
  measurement_type: MeasurementType;
  participant_count: number;
  completed_tasks_count: number;
  is_case_observation: boolean; // < 3명이면 사례 관찰로 레이블
  avg_duration_erp_only_sec: number;
  avg_duration_erp_with_ai_sec: number;
  avg_clicks_erp_only: number;
  avg_clicks_erp_with_ai: number;
  avg_navigations_erp_only: number;
  avg_navigations_erp_with_ai: number;
  avg_chars_erp_only: number;
  avg_chars_erp_with_ai: number;
  avg_duplicate_inputs_erp_only: number;
  avg_duplicate_inputs_erp_with_ai: number;
  draft_adoption_rates: {
    as_is: number;
    modified: number;
    heavily_modified: number;
    dismissed: number;
  };
  safety_issues_count: number;
  interruption_feedback_rates: {
    helpful: number;
    neutral: number;
    interrupted: number;
  };
  ai_failures_count: number;
  erp_stoppages_count: number;
};
