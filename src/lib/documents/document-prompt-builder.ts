import type { DocumentTemplateDefinition } from "@/types/document-template";
import type { RecordBlock } from "@/types/record-block";
import type { FieldRecord } from "@/components/content/MobileFieldLogger";

export type PromptBuildResult = {
  filteredBlocks: RecordBlock[];
  excludedBlockTitles: string[];
  systemInstruction: string;
  userPrompt: string;
};

export function buildDocumentPrompt(
  template: DocumentTemplateDefinition,
  blocks: RecordBlock[],
  residentName: string,
  activityDate: string,
  fieldRecords: FieldRecord[] = []
): PromptBuildResult {
  const excludedBlockTitles: string[] = [];

  // Filter blocks based on template rules
  const filteredBlocks = blocks.filter((b) => {
    // Check if block type is explicitly excluded
    if (template.excludedBlocks.includes(b.blockType)) {
      excludedBlockTitles.push(b.title);
      return false;
    }

    // Check visibility scope restrictions (e.g. internal_only excluded for guardian/public docs)
    if (!template.allowedVisibilityScopes.includes(b.visibilityScope)) {
      excludedBlockTitles.push(`${b.title} (보안 등급 제한: ${b.visibilityScope})`);
      return false;
    }

    return true;
  });

  // Filter relevant field records for this resident
  const residentFieldRecords = fieldRecords.filter(
    (f) => f.residentName === residentName || f.residentId === "res-01"
  );

  const blockSummaryText = filteredBlocks
    .map((b) => `- [${b.title}]: ${b.editedText || b.aiDraft}`)
    .join("\n");

  const fieldRecordsText = residentFieldRecords
    .map((f) => `- [📱 외근/현장 ${f.category}] 장소: ${f.location} (${f.timeStr}) / 내용: ${f.note} / 조치: ${f.actionsTaken}`)
    .join("\n");

  const toneInstruction = {
    warm: "다정하고 따뜻하며 안심을 주는 톤",
    formal_legal: "공통 서식 규정에 맞춘 정중하고 객관적인 공식 행정 톤",
    concise: "핵심만 신속히 파악할 수 있는 명확한 단문 요약 톤",
    promo: "생생하고 호감도를 높이는 마케팅 홍보 톤"
  }[template.tone];

  const lengthInstruction = {
    short: "1~2문장 내외 (90자 이내)",
    medium: "3~5문장 내외 (단락 구분)",
    long: "상세한 서술형 보고서 폼 (여러 단락과 항목별 구별)"
  }[template.targetLength];

  const systemInstruction = `당신은 노인주간보호센터 전문 AI 사회복지사 작성 보조 엔진입니다.
제공된 입력 사실(RecordBlock 및 외근 기록)만을 엄격히 바탕으로 [${template.title}] 문안을 생성하십시오.
- 작성 대상: ${template.targetAudienceLabel}
- 문체 톤: ${toneInstruction}
- 분량 지침: ${lengthInstruction}
- 보안 규칙: 허용되지 않은 민감 블록(${template.excludedBlocks.join(", ") || "없음"})은 절대로 문안에 포함하지 마십시오.
- ⭐ 할루시네이션 방지 규칙 (Zero-Hallucination Guardrail):
  1. 입력된 팩트에 없는 추측성 판단(예: "활력이 증가했습니다", "통증이 완화되었습니다", "성격이 밝아졌습니다", "건강 상태가 향상되었습니다")을 절대로 임의 작성하지 마십시오.
  2. 오직 수집된 팩트(식사량, 프로그램 참여 사실, 통증 표현 사실, 휴식 조치)만 객관적 사실 어조로 서술하십시오.`;

  const userPrompt = `[기초 입력 정보]
- 수급자명: ${residentName} 어르신
- 일자: ${activityDate}
- 작성 문서: ${template.title} (${template.description})

[수집된 사실 데이터 (RecordBlock)]
${blockSummaryText || "기초 기록 정보 없음"}

${fieldRecordsText ? `[접수된 모바일 외근 현장 기록]\n${fieldRecordsText}` : ""}

위 수집 사실만을 명확히 조합하여 최종 [${template.title}] 문안을 완성해 주십시오.`;

  return {
    filteredBlocks,
    excludedBlockTitles,
    systemInstruction,
    userPrompt
  };
}
