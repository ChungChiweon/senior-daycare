export type NeedsAssessment = {
  id: string;
  resident_id: string;
  resident_name: string;
  assessment_date: string;
  physical_needs: string; // 신체적 욕구
  cognitive_needs: string; // 인지적 욕구
  emotional_needs: string; // 정서적 욕구
  family_needs: string; // 가족 욕구
  social_relationship_needs: string; // 사회적 관계 욕구
  environment_needs: string; // 환경적 욕구
  worker_id: string;
  worker_name: string;
  created_at: string;
};

export type ServiceGoalStatus = "active" | "achieved" | "revised" | "paused";

export type ServiceGoal = {
  id: string;
  resident_id: string;
  need_id?: string;
  need_category: string; // 예: 사회적 관계 감소, 인지 기능 유지
  goal: string; // 서비스 목표
  intervention_plan: string; // 개입 계획
  responsible_worker: string;
  review_date: string;
  status: ServiceGoalStatus;
};

export type PracticeReflectionQuestionType =
  | "counseling"
  | "program"
  | "unusual_note"
  | "meal_change"
  | "social_interaction";

export type PracticeReflection = {
  id: string;
  resident_id: string;
  related_record_id?: string;
  question_type: PracticeReflectionQuestionType;
  question: string;
  worker_response?: string;
  created_at: string;
};
