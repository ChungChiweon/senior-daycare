import type { ServiceGoal } from "@/types/social-work-practice";

export type ReminderType = "counseling" | "program" | "unusual" | "goal_link";

export type PracticeReminder = {
  id: string;
  type: ReminderType;
  title: string;
  question: string;
  checklistItems: string[];
  relatedGoalSummary?: string;
};

/**
 * AI Social Work Practice Reminder Engine
 * 
 * STRICT POLICY:
 * 1. AI DOES NOT DIAGNOSE OR EVALUATE (No "영양 문제", No "우울 위험", No "인지 저하")
 * 2. Provides ONLY objective observation prompts & practice reflective questions
 * 3. Keeps human social workers in complete control
 */
export class SocialWorkReminderEngine {
  /**
   * Generates reflective guidance for Counseling Records
   */
  static getCounselingReminder(residentName: string): PracticeReminder {
    return {
      id: `rem-counseling-${Date.now()}`,
      type: "counseling",
      title: "💡 실천 관점 확인",
      question: `[${residentName} 어르신] 상담 내용 기록 후 다음 사정 관점을 검토해볼까요?`,
      checklistItems: [
        "어르신 본인이 직접 표현하신 욕구가 명확히 기재되어 있는가?",
        "보호자의 개별 요청 또는 비상 연락 사항이 포함되었는가?",
        "현재 설정된 욕구 사정 및 서비스 계획과 연결되는 부분이 있는가?",
        "추가 관찰이나 간호/요양팀 간 협업 공유가 필요한 사항인가?"
      ]
    };
  }

  /**
   * Generates reflective guidance for Program Participation Records
   */
  static getProgramReminder(residentName: string, programName: string): PracticeReminder {
    return {
      id: `rem-program-${Date.now()}`,
      type: "program",
      title: "💡 변화 관찰 리마인더",
      question: `[${residentName} 어르신] '${programName}' 참여 과정에서 관찰된 내용입니다.`,
      checklistItems: [
        "이전 회기 대비 참여 태도나 신체/인지 반응에 변화가 있으셨나요?",
        "개별 지원(보조 도구, 일대일 케어)이 필요했던 순간이 있었나요?",
        "프로그램 참여 성과가 서비스 목표 달성에 긍정적 영향을 미쳤나요?"
      ]
    };
  }

  /**
   * Generates reflective guidance for RecordBlocks / Unusual Notes
   */
  static getUnusualRecordReminder(
    residentName: string,
    category: string,
    contentSnippet: string,
    existingGoals: ServiceGoal[] = []
  ): PracticeReminder {
    // Check if content snippet contains meal or attendance changes
    const isMealRelated = contentSnippet.includes("식사") || contentSnippet.includes("섭취") || contentSnippet.includes("반공기");
    
    let mainQuestion = `[${residentName} 어르신] 관찰 팩트가 등록되었습니다. 다음 항목을 체크해보세요.`;
    if (isMealRelated) {
      mainQuestion = `[${residentName} 어르신] 최근 식사 섭취 관련 변화가 기록되었습니다. 추가 확인이 필요한지 검토해주세요.`;
    }

    // Match with existing goals (non-diagnostic linking)
    const matchedGoal = existingGoals.find(g => g.resident_id && g.status === "active");
    const goalSummary = matchedGoal
      ? `연결된 기존 목표: [${matchedGoal.need_category}] ${matchedGoal.goal}`
      : undefined;

    return {
      id: `rem-unusual-${Date.now()}`,
      type: "unusual",
      title: "💡 실천 기록 검토",
      question: mainQuestion,
      checklistItems: [
        "이 상황은 일시적 해프닝인가, 혹은 지속적 반복 관찰 대상인가?",
        "보호자에게 신속히 인지시켜야 할 전달사항인가?",
        "현재 설정된 개별 급여 제공 계획/서비스 목표와 연관되는가?"
      ],
      relatedGoalSummary: goalSummary
    };
  }

  /**
   * Links daily Care Fact with active Service Goal (Non-diagnostic connection hint)
   */
  static checkGoalConnectionHint(
    recordCategory: string,
    goals: ServiceGoal[]
  ): string | null {
    if (!goals || goals.length === 0) return null;

    const activeGoal = goals.find(g => g.status === "active");
    if (!activeGoal) return null;

    return `💡 [서비스 목표 연동] 기존 목표 '${activeGoal.goal}'와(과) 관련된 기록입니다. 서비스 목표 재검토 여부를 확인해주세요.`;
  }
}
