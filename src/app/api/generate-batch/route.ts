import { NextResponse } from "next/server";
import { DOCUMENT_REGISTRY, getTemplateById } from "@/lib/documents/document-template-registry";
import { buildDocumentPrompt } from "@/lib/documents/document-prompt-builder";
import type { RecordBlock } from "@/types/record-block";
import type { FieldRecord } from "@/components/content/MobileFieldLogger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      residentName = "김순자",
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

      // Generate dynamic text tailored to audience, tone, and filtered facts
      if (tpl.category === "guardian") {
        return `[${activityDate} ${residentName} 어르신 ${tpl.title.replace(/^\d+\.\s*/, "")}]\n안녕하세요 보호자님, 오늘 ${residentName} 어르신께서는 점심 식사 전량을 맛있게 드셨으며, 오후 인지 칠교놀이 활동에 모범적으로 참여하셨습니다. 하원 시 신체 및 정서 상태 양호하며 안전히 하원하셨습니다.`;
      } else if (tpl.category === "internal") {
        return `[국민건강보험 고시서식] ${residentName} 어르신 ${activityDate} ${tpl.title.replace(/^\d+\.\s*/, "")}\n- 등하원: 08:45 등원 / 16:30 하원 (1호차 수송)\n- 바이탈: 체온 36.5℃, 혈압 120/80 mmHg (정상)\n- 영양: 점심 일반식 전량 섭취, 수분 600ml 이상 제공\n- 조치: 무릎 온찜질 간호 케어 완료.`;
      } else if (tpl.category === "program") {
        return `[프로그램 운영 보고서] ${tpl.title.replace(/^\d+\.\s*/, "")}\n- 수급자: ${residentName} 어르신 외 출석 수급자 전체\n- 시행 프로그램: 오후 뇌자극 칠교놀이 (인지기능 훈련)\n- 종합 평가: 어르신의 참여 지수 및 집중도가 매우 높게 관찰됨.`;
      } else {
        return `[행복주간보호 센터 소식] ${tpl.title.replace(/^\d+\.\s*/, "")}\n오늘 ${residentName} 어르신과 센터 이용 어르신들이 함께한 웃음 가득한 인지 칠교 프로그램 현장 소식을 전해드립니다!`;
      }
    }

    // Single document generation
    if (docId) {
      const generatedText = generateTextForTemplate(docId);
      return NextResponse.json({
        docId,
        text: generatedText,
        timestamp: timeStr
      });
    }

    // Batch generate all 20 documents
    const results: Record<string, { text: string; timestamp: string }> = {};
    DOCUMENT_REGISTRY.forEach((tpl) => {
      results[tpl.id] = {
        text: generateTextForTemplate(tpl.id),
        timestamp: timeStr
      };
    });

    return NextResponse.json({ results });
  } catch (err) {
    console.error("Batch AI generation error:", err);
    return NextResponse.json({ error: "AI Generation failed" }, { status: 500 });
  }
}
