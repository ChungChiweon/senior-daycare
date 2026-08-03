import type {
  BetaReportMetrics,
  FieldBetaMeasurementLog,
  MeasurementType
} from "@/types/field-beta-measurement";

// Mock Store for Field Measurement Pack Logs
const INITIAL_SIMULATED_LOGS: FieldBetaMeasurementLog[] = [
  {
    id: "sim-log-01",
    measurement_type: "simulated",
    mode: "erp_only",
    organization_id: "org-demo-01",
    participant_id: "sw-simulated-01",
    role: "사회복지사",
    scenario_id: "scenario_1_morning_check",
    started_at: "2026-08-03T08:30:00Z",
    completed_at: "2026-08-03T08:33:30Z",
    duration_seconds: 210,
    click_count: 8,
    navigation_count: 4,
    typed_character_count: 0,
    duplicate_input_count: 0
  },
  {
    id: "sim-log-02",
    measurement_type: "simulated",
    mode: "erp_with_ai",
    organization_id: "org-demo-01",
    participant_id: "sw-simulated-01",
    role: "사회복지사",
    scenario_id: "scenario_1_morning_check",
    started_at: "2026-08-03T08:35:00Z",
    completed_at: "2026-08-03T08:35:30Z",
    duration_seconds: 30,
    click_count: 1,
    navigation_count: 0,
    typed_character_count: 0,
    duplicate_input_count: 0,
    interruption_feedback: { rating: "helpful" }
  }
];

const INITIAL_FIELD_LOGS: FieldBetaMeasurementLog[] = [
  {
    id: "field-log-01",
    measurement_type: "field",
    mode: "erp_with_ai",
    organization_id: "org-beta-pilot-01",
    participant_id: "sw-anon-701", // PII 최소화 익명 ID
    role: "사회복지사",
    scenario_id: "scenario_2_daily_observation",
    started_at: "2026-08-04T09:10:00Z",
    completed_at: "2026-08-04T09:12:00Z",
    duration_seconds: 120,
    click_count: 3,
    navigation_count: 1,
    typed_character_count: 35,
    duplicate_input_count: 0,
    ai_draft_used: "modified",
    safety_check: {
      ai_attempted_judgment: false,
      included_judgmental_expression: false,
      factual_inaccuracy: false,
      induced_user_decision: false,
      is_safety_issue: false
    },
    interruption_feedback: { rating: "helpful" }
  },
  {
    id: "field-log-02",
    measurement_type: "field",
    mode: "erp_with_ai",
    organization_id: "org-beta-pilot-01",
    participant_id: "sw-anon-702", // PII 최소화 익명 ID (총 2명)
    role: "사회복지사",
    scenario_id: "scenario_3_guardian_counseling",
    started_at: "2026-08-04T10:00:00Z",
    completed_at: "2026-08-04T10:03:00Z",
    duration_seconds: 180,
    click_count: 4,
    navigation_count: 1,
    typed_character_count: 60,
    duplicate_input_count: 0,
    ai_draft_used: "as_is",
    safety_check: {
      ai_attempted_judgment: false,
      included_judgmental_expression: false,
      factual_inaccuracy: false,
      induced_user_decision: false,
      is_safety_issue: false
    },
    interruption_feedback: { rating: "helpful" }
  }
];

const fieldMeasurementLogs: FieldBetaMeasurementLog[] = [...INITIAL_SIMULATED_LOGS, ...INITIAL_FIELD_LOGS];

export class FieldBetaMeasurementEngine {
  /**
   * Log a new measurement entry ensuring PII protection
   */
  static logMeasurement(entry: Omit<FieldBetaMeasurementLog, "id">): FieldBetaMeasurementLog {
    // Strip sensitive raw text (Privacy by Design)
    const sanitizedEntry: FieldBetaMeasurementLog = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    };
    fieldMeasurementLogs.push(sanitizedEntry);
    return sanitizedEntry;
  }

  /**
   * Calculate aggregated report metrics strictly separated by measurement_type ("field" vs "simulated")
   */
  static calculateMetrics(type: MeasurementType): BetaReportMetrics {
    const filteredLogs = fieldMeasurementLogs.filter((log) => log.measurement_type === type);

    const uniqueParticipants = new Set(filteredLogs.map((l) => l.participant_id));
    const participantCount = uniqueParticipants.size;
    const isCaseObservation = type === "field" && participantCount < 3;

    const erpOnlyLogs = filteredLogs.filter((l) => l.mode === "erp_only");
    const erpWithAiLogs = filteredLogs.filter((l) => l.mode === "erp_with_ai");

    const avg = (arr: number[]) => (arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

    const draftUsages = erpWithAiLogs.map((l) => l.ai_draft_used).filter(Boolean);
    const draftTotal = draftUsages.length || 1;

    const safetyIssuesCount = filteredLogs.filter((l) => l.safety_check?.is_safety_issue).length;

    const feedbackRatings = erpWithAiLogs.map((l) => l.interruption_feedback?.rating).filter(Boolean);
    const feedbackTotal = feedbackRatings.length || 1;

    return {
      measurement_type: type,
      participant_count: participantCount,
      completed_tasks_count: filteredLogs.length,
      is_case_observation: isCaseObservation,

      avg_duration_erp_only_sec: avg(erpOnlyLogs.map((l) => l.duration_seconds)),
      avg_duration_erp_with_ai_sec: avg(erpWithAiLogs.map((l) => l.duration_seconds)),

      avg_clicks_erp_only: avg(erpOnlyLogs.map((l) => l.click_count)),
      avg_clicks_erp_with_ai: avg(erpWithAiLogs.map((l) => l.click_count)),

      avg_navigations_erp_only: avg(erpOnlyLogs.map((l) => l.navigation_count)),
      avg_navigations_erp_with_ai: avg(erpWithAiLogs.map((l) => l.navigation_count)),

      avg_chars_erp_only: avg(erpOnlyLogs.map((l) => l.typed_character_count)),
      avg_chars_erp_with_ai: avg(erpWithAiLogs.map((l) => l.typed_character_count)),

      avg_duplicate_inputs_erp_only: avg(erpOnlyLogs.map((l) => l.duplicate_input_count)),
      avg_duplicate_inputs_erp_with_ai: avg(erpWithAiLogs.map((l) => l.duplicate_input_count)),

      draft_adoption_rates: {
        as_is: Math.round((draftUsages.filter((u) => u === "as_is").length / draftTotal) * 100),
        modified: Math.round((draftUsages.filter((u) => u === "modified").length / draftTotal) * 100),
        heavily_modified: Math.round((draftUsages.filter((u) => u === "heavily_modified").length / draftTotal) * 100),
        dismissed: Math.round((draftUsages.filter((u) => u === "dismissed").length / draftTotal) * 100)
      },

      safety_issues_count: safetyIssuesCount,

      interruption_feedback_rates: {
        helpful: Math.round((feedbackRatings.filter((r) => r === "helpful").length / feedbackTotal) * 100),
        neutral: Math.round((feedbackRatings.filter((r) => r === "neutral").length / feedbackTotal) * 100),
        interrupted: Math.round((feedbackRatings.filter((r) => r === "interrupted").length / feedbackTotal) * 100)
      },

      ai_failures_count: 0,
      erp_stoppages_count: 0
    };
  }
}
