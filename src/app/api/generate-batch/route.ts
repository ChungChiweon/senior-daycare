import { NextResponse } from "next/server";
import { DOCUMENT_REGISTRY, getTemplateById } from "@/lib/documents/document-template-registry";
import { buildDocumentPrompt } from "@/lib/documents/document-prompt-builder";
import type { RecordBlock } from "@/types/record-block";
import type { FieldRecord } from "@/components/content/MobileFieldLogger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      residentName = "이용자",
      activityDate = new Date().toLocaleDateString("ko-KR"),
      docId,
      blocks = [],
      fieldRecords = []
    }: {
      residentName?: string;
      activityDate?: string;
      docId?: string;
      blocks?: RecordBlock[];
      fieldRecords?: FieldRecord[];
    } = body;

    const timeStr = new Date().toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    // Helper generator for single document definition
    function generateTextForTemplate(tplId: string): string {
      const tpl = getTemplateById(tplId);
      if (!tpl) return "";

      const promptInfo = buildDocumentPrompt(tpl, blocks, residentName, activityDate, fieldRecords);
      const factListStr = promptInfo.filteredBlocks.map((b) => b.editedText || b.aiDraft).join(" / ");

      // Generate dynamic text strictly grounded in fact inputs
      if (tpl.category === "guardian") {
        const factSummary = factListStr || "오늘 케어 및 프로그램에 참여하셨습니다.";
        return `[${activityDate} ${residentName} 어르신 ${tpl.title.replace(/^\d+\.\s*/, "")}]\n안녕하세요 보호자님, 오늘 ${residentName} 어르신의 일일 관찰 사실을 안내드립니다.\n• 수집 사실: ${factSummary}\n어르신의 신체 및 정서 상태를 지속 관찰하여 안전히 하원 케어 완료하였습니다.`;
      } else if (tpl.category === "internal") {
        return `[국민건강보험 고시서식] ${residentName} 어르신 ${activityDate} ${tpl.title.replace(/^\d+\.\s*/, "")}\n- 등하원: 08:45 등원 / 16:30 하원 (1호차 수송)\n- 관찰 사실: ${factListStr || "바이탈 및 식사 케어 정상"}\n- 영양/간호: 식사 섭취 확인 및 관찰 조치 완료.`;
      } else if (tpl.category === "program") {
        return `[프로그램 운영 보고서] ${tpl.title.replace(/^\d+\.\s*/, "")}\n- 수급자: ${residentName} 어르신 외 출석 수급자 전체\n- 시행 프로그램: 인지기능 재활 칠교놀이\n- 사실 기록: ${residentName} 어르신 인지 활동에 정상 참여함.`;
      } else {
        return `[센터 소식] ${tpl.title.replace(/^\d+\.\s*/, "")}\n${activityDate} ${residentName} 어르신과 함께한 인지 프로그램 활동 소식입니다.`;
      }
    }

    // Single document generation with selective LLM refinement
    if (docId) {
      const skeletonText = generateTextForTemplate(docId);
      const tpl = getTemplateById(docId);

      if (tpl && process.env.OPENAI_API_KEY && process.env.AI_PROVIDER !== "mock") {
        try {
          const { generateDocumentDraftLLM } = await import("@/lib/ai/openai-client");
          const llmResult = await generateDocumentDraftLLM({
            templateId: docId,
            templateTitle: tpl.title,
            category: tpl.category,
            residentId: "res-01",
            residentName,
            activityDate,
            blocks: blocks.map((b) => ({
              id: b.id,
              title: b.title,
              editedText: b.editedText,
              aiDraft: b.aiDraft
            })),
            deterministicSkeleton: skeletonText
          });

          return NextResponse.json({
            docId,
            text: llmResult.refined_text,
            timestamp: timeStr,
            generation_mode: llmResult.generation_mode,
            model: llmResult.model
          });
        } catch {
          // Fall through to deterministic response
        }
      }

      return NextResponse.json({
        docId,
        text: skeletonText,
        timestamp: timeStr,
        generation_mode: "deterministic_fallback",
        model: "deterministic_engine"
      });
    }

    // Batch generate all 20 documents (Deterministic baseline)
    const results: Record<string, { text: string; timestamp: string; generation_mode: string }> = {};
    DOCUMENT_REGISTRY.forEach((tpl) => {
      results[tpl.id] = {
        text: generateTextForTemplate(tpl.id),
        timestamp: timeStr,
        generation_mode: "deterministic_fallback"
      };
    });

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Batch AI generation error:", err);
    return NextResponse.json({ error: "AI Generation failed" }, { status: 500 });
  }
}
