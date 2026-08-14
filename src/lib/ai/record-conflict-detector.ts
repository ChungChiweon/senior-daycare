import type { RecordBlock } from "@/types/record-block";

export type ConflictStatus = "detected" | "reviewing" | "resolved";

export type RecordConflict = {
  id: string;
  organizationId: string;
  residentId: string;
  residentName: string;
  sourceBlockIds: string[];
  conflictType: "meal_intake" | "vital_condition" | "behavior_mood" | "mobility_pain";
  description: string;
  status: ConflictStatus;
  detectedAt: string;
};

// Key phrases that indicate opposing observation facts
const OPPOSING_PAIRS = [
  {
    type: "meal_intake" as const,
    label: "식사량 관찰 기록 상충",
    positive: ["식사 양호", "전량 섭취", "식사 잘하심", "식욕 우수"],
    negative: ["식사 섭취 저조", "식사 50% 거부", "식욕 부진", "식사 못하심"]
  },
  {
    type: "vital_condition" as const,
    label: "건강/바이탈 관찰 기록 상충",
    positive: ["체온 정상", "혈압 양호", "건강 상태 양호"],
    negative: ["미열 발생", "고혈압 관찰", "두통 호소", "어지럼증"]
  },
  {
    type: "mobility_pain" as const,
    label: "보행/통증 관찰 기록 상충",
    positive: ["자발적 보행 원활", "통증 없음"],
    negative: ["무릎 통증 호소", "보행 시 부축 필요", "우측 다리 불편"]
  }
];

export function detectRecordConflicts(
  blocks: RecordBlock[],
  residentName: string = "이용자",
  residentId: string = "res-01"
): RecordConflict[] {
  const conflicts: RecordConflict[] = [];

  OPPOSING_PAIRS.forEach((pair, idx) => {
    const positiveBlocks = blocks.filter((b) =>
      pair.positive.some((posKey) => (b.editedText || b.aiDraft).includes(posKey))
    );
    const negativeBlocks = blocks.filter((b) =>
      pair.negative.some((negKey) => (b.editedText || b.aiDraft).includes(negKey))
    );

    if (positiveBlocks.length > 0 && negativeBlocks.length > 0) {
      conflicts.push({
        id: `conflict-${Date.now()}-${idx}`,
        organizationId: "org-daycare-a",
        residentId,
        residentName,
        sourceBlockIds: [...positiveBlocks.map((b) => b.id), ...negativeBlocks.map((b) => b.id)],
        conflictType: pair.type,
        description: `[${pair.label}] 동일 일자 수집된 팩트 간 모순 감지: 요양보호사/간호사 간 관찰 기록 내용이 상충됩니다. (확인 팩트: "${positiveBlocks[0]?.title}" vs "${negativeBlocks[0]?.title}")`,
        status: "detected",
        detectedAt: new Date().toLocaleString("ko-KR")
      });
    }
  });

  return conflicts;
}
