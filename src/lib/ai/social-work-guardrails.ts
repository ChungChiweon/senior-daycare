/**
 * Social Work Practice Ethical Guardrails & Validation Layer
 * Enforces human-centered non-diagnostic boundaries on all AI-generated text.
 */

export const SOCIAL_WORK_SYSTEM_INSTRUCTION = `You are a documentation assistant for social workers in a Senior Daycare Center (노인 주간보호센터).

You may:
- summarize verified facts
- reorganize observations
- improve readability and administrative phrasing
- prepare neutral drafts

You must not:
- diagnose
- infer mental or medical conditions
- determine risk levels
- decide service needs
- recommend interventions
- label the resident
- claim improvement or deterioration without explicit factual evidence
- invent facts
- create dates, names, measurements, or events not supplied

If evidence is insufficient, state that confirmation by the social worker is required.
All outputs are drafts and require human review.
Output language: Korean (한국어).`;

/**
 * Prohibited judgmental and diagnostic phrases in Korean social work practice
 */
export const PROHIBITED_JUDGMENT_PATTERNS = [
  /우울증(으로|이|인 것으로)\s*(진단|판단|추정|보임|의심)/i,
  /치매(가|로)\s*(악화|진행|심화|추정)/i,
  /인지\s*기능(이|은)\s*(현저히\s*)?저하(되었습니다|된\s*것으로)/i,
  /건강\s*상태가\s*악화(되었습니다|된\s*것으로)/i,
  /위험도(가|는)\s*(극심|높음|심각|확정)/i,
  /약물(을|의)?\s*(증량|변경|투약\s*변경)이?\s*(필수|요구|권고|결정)/i,
  /병원(으로\s*)?(이송|입원)이?\s*(시급|필수|결정)/i,
  /문제\s*행동(자|을\s*일으킴)/i,
  /낙상\s*고위험군으로\s*확정/i,
  /서비스(를|의)?\s*(중단|변경|취소)해야\s*함/i
];

export type ValidationResult = {
  isValid: boolean;
  prohibitedPatternFound?: string;
  invalidSourceIds?: string[];
  reason?: string;
};

/**
 * Validates AI output against social work practice boundaries
 */
export function validateSocialWorkOutput(
  text: string,
  allowedSourceIds: string[] = [],
  returnedSourceIds: string[] = []
): ValidationResult {
  if (!text || typeof text !== "string") {
    return { isValid: false, reason: "출력 텍스트가 비어 있습니다." };
  }

  // 1. Check for prohibited diagnostic or labeling patterns
  for (const pattern of PROHIBITED_JUDGMENT_PATTERNS) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        prohibitedPatternFound: pattern.source,
        reason: `사회복지 실천 가드레일 위반: 허가되지 않은 진단/낙인/위험도 단정 표현 감지 (${pattern.source})`
      };
    }
  }

  // 2. Validate that returned source_ids are a subset of allowed source_ids
  if (returnedSourceIds.length > 0 && allowedSourceIds.length > 0) {
    const invalidIds = returnedSourceIds.filter((id) => !allowedSourceIds.includes(id));
    if (invalidIds.length > 0) {
      return {
        isValid: false,
        invalidSourceIds: invalidIds,
        reason: `유효하지 않은 출처 ID 반환: ${invalidIds.join(", ")}`
      };
    }
  }

  return { isValid: true };
}

export type AiUsageMetric = {
  timestamp: string;
  task: "consultation_summary" | "document_draft" | "guardian_notice" | "content_generation";
  model: string;
  inputTokenEstimate?: number;
  outputTokenEstimate?: number;
  latencyMs: number;
  success: boolean;
  generationMode: "llm_refined" | "deterministic_fallback";
  fallbackReason?: string;
};

/**
 * Anonymous AI Usage Logger (Strictly NO PII text logged)
 */
export function logAiUsage(metric: AiUsageMetric): void {
  // Format structured anonymous log for monitoring & cost governance
  const logLine = `[AI_USAGE_GUARD] ${metric.timestamp} | Task: ${metric.task} | Mode: ${metric.generationMode} | Model: ${metric.model} | Latency: ${metric.latencyMs}ms | Success: ${metric.success} ${metric.fallbackReason ? `(${metric.fallbackReason})` : ""}`;
  
  if (metric.success && metric.generationMode === "llm_refined") {
    console.info(logLine);
  } else {
    console.warn(logLine);
  }
}
