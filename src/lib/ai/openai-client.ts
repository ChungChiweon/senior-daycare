/**
 * Server-Only OpenAI Client & Hybrid LLM Generator
 * Provides selective LLM refinement for:
 * 1. consultation_summary
 * 2. document_draft
 * 3. guardian_notice_draft
 * With automatic deterministic fallback and strict social work guardrails.
 *
 * Uses OpenAI Responses API (client.responses.create) which is required for
 * gpt-5-mini and newer models. store:false prevents data retention.
 */

import OpenAI from "openai";
import {
  SOCIAL_WORK_SYSTEM_INSTRUCTION,
  validateSocialWorkOutput,
  logAiUsage
} from "@/lib/ai/social-work-guardrails";
import { FeatureKillSwitchStore } from "@/lib/feature-kill-switch";

export type ConsultationSummaryInput = {
  organizationId?: string;
  residentId: string;
  residentName: string;
  facts: Array<{
    source_id: string;
    date: string;
    type: string;
    text: string;
  }>;
  service_goal?: string;
  requested_output?: string;
};

export type ConsultationSummaryOutput = {
  summary: string;
  talking_points: string[];
  source_ids: string[];
  uncertain_points: string[];
  prohibited_judgment_detected: boolean;
  generation_mode: "llm_refined" | "deterministic_fallback";
  model: string;
};

export type DocumentDraftInput = {
  organizationId?: string;
  templateId: string;
  templateTitle: string;
  category: "guardian" | "internal" | "program" | "operation";
  residentId: string;
  residentName: string;
  activityDate: string;
  blocks: Array<{
    id: string;
    title: string;
    editedText?: string;
    aiDraft?: string;
  }>;
  deterministicSkeleton: string;
};

export type DocumentDraftOutput = {
  document_title: string;
  refined_text: string;
  source_ids: string[];
  generation_mode: "llm_refined" | "deterministic_fallback";
  model: string;
};

export type GuardianNoticeInput = {
  organizationId?: string;
  residentId: string;
  residentName: string;
  guardianName?: string;
  mealStatus: string;
  medicationStatus: string;
  bloodPressure: string;
  temperature: string;
  activityName?: string;
  cautionNotes?: string;
  activityDate: string;
  institutionName?: string;
};

export type GuardianNoticeOutput = {
  notice_title: string;
  notice_body: string;
  generation_mode: "llm_refined" | "deterministic_fallback";
  model: string;
};

function getOpenAiClient(): { client: OpenAI | null; model: string; isEnabled: boolean } {
  const apiKey = process.env.OPENAI_API_KEY;
  const isEnabled = Boolean(apiKey && apiKey.trim().length > 0 && process.env.AI_PROVIDER !== "mock");
  const model = process.env.AI_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!isEnabled || !apiKey) {
    return { client: null, model, isEnabled: false };
  }

  try {
    const client = new OpenAI({ apiKey: apiKey.trim() });
    return { client, model, isEnabled: true };
  } catch (err) {
    console.error("[OpenAI Client Init Error]:", err);
    return { client: null, model, isEnabled: false };
  }
}

/**
 * Call Responses API and return the text content safely.
 *
 * Key design decisions:
 * - No text.format (json_object): gpt-5-mini does not support this parameter;
 *   JSON structure is enforced via prompt instructions instead.
 * - Never calls response.output_text getter: that getter THROWS if output is
 *   empty, which cannot be caught with `??`. Instead, we iterate response.output
 *   directly and return "{}" on empty — triggering graceful deterministic fallback.
 * - store: false: prevents OpenAI from retaining request/response data.
 */
async function callResponsesAPI(
  client: OpenAI,
  model: string,
  systemInstruction: string,
  userPrompt: string,
  maxOutputTokens: number
): Promise<{ text: string; inputTokens: number; outputTokens: number; actualModel: string }> {
  const response = await client.responses.create({
    model,
    store: false,
    instructions: systemInstruction,
    input: userPrompt,
    max_output_tokens: maxOutputTokens
  });

  // Safe extraction — do NOT use response.output_text getter (throws on empty output)
  let text = "{}";
  for (const item of response.output ?? []) {
    if (item.type === "message") {
      for (const content of item.content ?? []) {
        if (content.type === "output_text" && content.text) {
          text = content.text;
          break;
        }
      }
    }
    if (text !== "{}") break;
  }

  return {
    text,
    inputTokens: response.usage?.input_tokens ?? 0,
    outputTokens: response.usage?.output_tokens ?? 0,
    actualModel: response.model ?? model
  };
}

// -------------------------------------------------------------------------------------------------
// 1. Consultation Summary (A)
// -------------------------------------------------------------------------------------------------
export async function generateConsultationSummaryLLM(
  input: ConsultationSummaryInput
): Promise<ConsultationSummaryOutput> {
  const startTime = Date.now();
  const orgId = input.organizationId || "org-hands-on-beta";
  const sourceIds = input.facts.map((f) => f.source_id);

  // Fallback builder (Deterministic)
  const buildDeterministicSummary = (fallbackReason?: string): ConsultationSummaryOutput => {
    const factSummaryText =
      input.facts.length > 0
        ? input.facts.map((f) => `• [${f.date}] ${f.text}`).join("\n")
        : "최근 등록된 특이사항 및 관찰 기록이 정상 유지되고 있습니다.";

    logAiUsage({
      timestamp: new Date().toISOString(),
      task: "consultation_summary",
      model: "deterministic_engine",
      latencyMs: Date.now() - startTime,
      success: true,
      generationMode: "deterministic_fallback",
      fallbackReason
    });

    return {
      summary: `${input.residentName} 어르신 최근 기록 팩트 요약:\n${factSummaryText}`,
      talking_points: [
        `어르신 당일 케어 및 주간 활동 정상 참여 안내`,
        input.service_goal ? `현재 목표("${input.service_goal}") 진행 상태 공유` : "가정 내 컨디션 및 수면 상태 확인"
      ],
      source_ids: sourceIds,
      uncertain_points: ["가정 내 주말 복약 및 보행 상태 확인 필요"],
      prohibited_judgment_detected: false,
      generation_mode: "deterministic_fallback",
      model: "deterministic_engine"
    };
  };

  // Check Kill Switch
  if (!FeatureKillSwitchStore.isFeatureEnabled(orgId, "consultation_summary")) {
    return buildDeterministicSummary("Kill Switch Disabled");
  }

  const { client, model, isEnabled } = getOpenAiClient();
  if (!isEnabled || !client) {
    return buildDeterministicSummary("OpenAI API Key Not Configured");
  }

  // Token Guard: limit facts to top 20
  const boundedFacts = input.facts.slice(0, 20);

  try {
    const userPrompt = `다음 수급자 관찰 팩트 목록을 바탕으로 보호자 상담 준비용 팩트 요약을 작성해주세요.
반드시 JSON 객체로 반환하세요:
{
  "summary": "어르신 최근 사실 요약 (진단이나 상태 악화 단정 표현 절대 금지, 관찰된 사실만 간결히)",
  "talking_points": ["보호자 상담 시 안내할 핵심 팩트 1", "핵심 팩트 2"],
  "source_ids": ["인용된 source_id 목록"],
  "uncertain_points": ["사회복지사가 보호자에게 직접 확인해야 할 항목"]
}

[수급자]: ${input.residentName}
[서비스 목표]: ${input.service_goal || "기능 유지 및 안전한 일상생활 지원"}
[제공된 사실(Facts)]:
${JSON.stringify(boundedFacts, null, 2)}`;

    const result = await callResponsesAPI(client, model, SOCIAL_WORK_SYSTEM_INSTRUCTION, userPrompt, 600);
    const parsed = JSON.parse(result.text);

    const validation = validateSocialWorkOutput(
      parsed.summary + " " + (parsed.talking_points || []).join(" "),
      sourceIds,
      parsed.source_ids || []
    );

    if (!validation.isValid) {
      return buildDeterministicSummary(validation.reason);
    }

    logAiUsage({
      timestamp: new Date().toISOString(),
      task: "consultation_summary",
      model: result.actualModel,
      inputTokenEstimate: result.inputTokens,
      outputTokenEstimate: result.outputTokens,
      latencyMs: Date.now() - startTime,
      success: true,
      generationMode: "llm_refined"
    });

    return {
      summary: parsed.summary || buildDeterministicSummary().summary,
      talking_points: Array.isArray(parsed.talking_points) ? parsed.talking_points : [],
      source_ids: Array.isArray(parsed.source_ids) ? parsed.source_ids : sourceIds,
      uncertain_points: Array.isArray(parsed.uncertain_points) ? parsed.uncertain_points : [],
      prohibited_judgment_detected: false,
      generation_mode: "llm_refined",
      model: result.actualModel
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "OpenAI API Call Exception";
    console.error("[generateConsultationSummaryLLM Error]:", errorMsg);
    return buildDeterministicSummary(`API Exception: ${errorMsg}`);
  }
}

// -------------------------------------------------------------------------------------------------
// 2. Document Draft Refinement (B)
// -------------------------------------------------------------------------------------------------
export async function generateDocumentDraftLLM(
  input: DocumentDraftInput
): Promise<DocumentDraftOutput> {
  const startTime = Date.now();
  const orgId = input.organizationId || "org-hands-on-beta";
  const sourceIds = input.blocks.map((b) => b.id);

  // Fallback builder (Deterministic Skeleton)
  const buildDeterministicDraft = (fallbackReason?: string): DocumentDraftOutput => {
    logAiUsage({
      timestamp: new Date().toISOString(),
      task: "document_draft",
      model: "deterministic_engine",
      latencyMs: Date.now() - startTime,
      success: true,
      generationMode: "deterministic_fallback",
      fallbackReason
    });

    return {
      document_title: input.templateTitle,
      refined_text: input.deterministicSkeleton,
      source_ids: sourceIds,
      generation_mode: "deterministic_fallback",
      model: "deterministic_engine"
    };
  };

  // Check Kill Switch
  if (!FeatureKillSwitchStore.isFeatureEnabled(orgId, "document_draft")) {
    return buildDeterministicDraft("Kill Switch Disabled");
  }

  const { client, model, isEnabled } = getOpenAiClient();
  if (!isEnabled || !client) {
    return buildDeterministicDraft("OpenAI API Key Not Configured");
  }

  // Token Guard: limit blocks to top 30
  const boundedBlocks = input.blocks.slice(0, 30);

  try {
    const userPrompt = `다음 노인 주간보호센터 서식의 기초 초안(deterministic skeleton)을 바탕으로, 문장을 자연스럽고 명확한 행정 서식 문체로 정돈해주세요.
주의: 숫자, 날짜, 어르신 이름, 바이탈 수치, 식사량, 투약 사실 등 원본 사실은 임의로 변경하거나 추가하지 마세요.
반드시 JSON 객체로 반환하세요:
{
  "document_title": "${input.templateTitle}",
  "refined_text": "정돈된 서식 본문",
  "source_ids": ["인용된 block id 목록"]
}

[서식 종류]: ${input.templateTitle} (${input.category})
[수급자명]: ${input.residentName}
[일자]: ${input.activityDate}
[기초 서식 초안(Skeleton)]:
${input.deterministicSkeleton}

[참고 원본 블록(Facts)]:
${JSON.stringify(boundedBlocks, null, 2)}`;

    const result = await callResponsesAPI(client, model, SOCIAL_WORK_SYSTEM_INSTRUCTION, userPrompt, 800);
    const parsed = JSON.parse(result.text);

    const validation = validateSocialWorkOutput(
      parsed.refined_text,
      sourceIds,
      parsed.source_ids || []
    );

    if (!validation.isValid) {
      return buildDeterministicDraft(validation.reason);
    }

    logAiUsage({
      timestamp: new Date().toISOString(),
      task: "document_draft",
      model: result.actualModel,
      inputTokenEstimate: result.inputTokens,
      outputTokenEstimate: result.outputTokens,
      latencyMs: Date.now() - startTime,
      success: true,
      generationMode: "llm_refined"
    });

    return {
      document_title: parsed.document_title || input.templateTitle,
      refined_text: parsed.refined_text || input.deterministicSkeleton,
      source_ids: Array.isArray(parsed.source_ids) ? parsed.source_ids : sourceIds,
      generation_mode: "llm_refined",
      model: result.actualModel
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "OpenAI API Call Exception";
    console.error("[generateDocumentDraftLLM Error]:", errorMsg);
    return buildDeterministicDraft(`API Exception: ${errorMsg}`);
  }
}

// -------------------------------------------------------------------------------------------------
// 3. Guardian Notice Draft (C)
// -------------------------------------------------------------------------------------------------
export async function generateGuardianNoticeLLM(
  input: GuardianNoticeInput
): Promise<GuardianNoticeOutput> {
  const startTime = Date.now();
  const orgId = input.organizationId || "org-hands-on-beta";
  const place = input.institutionName || "행복주간보호센터";

  // Fallback builder (Deterministic Notice)
  const buildDeterministicNotice = (fallbackReason?: string): GuardianNoticeOutput => {
    logAiUsage({
      timestamp: new Date().toISOString(),
      task: "guardian_notice",
      model: "deterministic_engine",
      latencyMs: Date.now() - startTime,
      success: true,
      generationMode: "deterministic_fallback",
      fallbackReason
    });

    const text = `[${place} 일일 알림장]
${input.residentName} 어르신 보호자님, 안녕하십니까.
오늘 어르신께서는 센터 일일 케어와 프로그램(${input.activityName || "맞춤형 인지·신체활동"})에 참여하셨습니다.
점심 식사(${input.mealStatus || "전량"})와 지정 투약(${input.medicationStatus || "완료"})을 안심하고 섭취하셨으며, 혈압(${input.bloodPressure || "120/80"})과 체온(${input.temperature || "36.5℃"})을 확인하였습니다.
${input.cautionNotes ? `• 특이사항 안내: ${input.cautionNotes}\n` : ""}가정에서도 편안하고 건강한 저녁 시간 보내시길 바랍니다.`;

    return {
      notice_title: `${input.residentName} 어르신 일일 알림장`,
      notice_body: text,
      generation_mode: "deterministic_fallback",
      model: "deterministic_engine"
    };
  };

  // Check Kill Switch
  if (!FeatureKillSwitchStore.isFeatureEnabled(orgId, "consultation_summary")) {
    return buildDeterministicNotice("Kill Switch Disabled");
  }

  const { client, model, isEnabled } = getOpenAiClient();
  if (!isEnabled || !client) {
    return buildDeterministicNotice("OpenAI API Key Not Configured");
  }

  try {
    const userPrompt = `다음 주간보호 어르신의 일일 관찰 팩트를 바탕으로, 보호자가 읽기 쉬운 다정하고 안심을 주는 일일 알림장을 작성해주세요.
금지: '건강 악화', '인지 저하', '우울감 의심' 등 진단/낙인 표현 절대 금지. 오직 관찰된 사실만 따뜻하게 안내.
반드시 JSON 객체로 반환하세요:
{
  "notice_title": "[${place}] ${input.residentName} 어르신 오늘 알림장",
  "notice_body": "보호자 알림장 전문"
}

[기관명]: ${place}
[어르신 성함]: ${input.residentName}
[보호자]: ${input.guardianName || "보호자님"}
[일자]: ${input.activityDate}
[식사량]: ${input.mealStatus}
[지정 투약]: ${input.medicationStatus}
[바이탈(혈압/체온)]: ${input.bloodPressure} / ${input.temperature}
[진행 프로그램]: ${input.activityName || "신체유연성 체조 및 인지활동"}
[특이 관찰 사실]: ${input.cautionNotes || "특이사항 없이 밝은 모습으로 활동 완료"}`;

    const result = await callResponsesAPI(client, model, SOCIAL_WORK_SYSTEM_INSTRUCTION, userPrompt, 500);
    const parsed = JSON.parse(result.text);

    const validation = validateSocialWorkOutput(parsed.notice_body || "");

    if (!validation.isValid) {
      return buildDeterministicNotice(validation.reason);
    }

    logAiUsage({
      timestamp: new Date().toISOString(),
      task: "guardian_notice",
      model: result.actualModel,
      inputTokenEstimate: result.inputTokens,
      outputTokenEstimate: result.outputTokens,
      latencyMs: Date.now() - startTime,
      success: true,
      generationMode: "llm_refined"
    });

    return {
      notice_title: parsed.notice_title || `${input.residentName} 어르신 일일 알림장`,
      notice_body: parsed.notice_body || buildDeterministicNotice().notice_body,
      generation_mode: "llm_refined",
      model: result.actualModel
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "OpenAI API Call Exception";
    console.error("[generateGuardianNoticeLLM Error]:", errorMsg);
    return buildDeterministicNotice(`API Exception: ${errorMsg}`);
  }
}
