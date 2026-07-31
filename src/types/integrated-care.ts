export type AttendanceStatus = "출석" | "결석" | "미등원";
export type CareGroup = "A그룹" | "B그룹" | "C그룹";

export type IntegratedResident = {
  id: string;
  name: string;
  gender: "남" | "여";
  age: number;
  grade: "1등급" | "2등급" | "3등급" | "4등급" | "5등급" | "인지지원등급";
  careNumber: string;
  attendanceStatus: AttendanceStatus;
  group: CareGroup;
  photoUrl?: string;
  hasPhotoConsent: boolean;
};

export type ActivityCategory = "인지" | "신체" | "여가" | "사회적응" | "정서지원" | "기타";
export type ActivityMood = "활기참" | "안정적" | "차분함" | "산만함" | "참여저조";

export type CommonActivity = {
  id: string;
  title: string;
  category: ActivityCategory;
  time: string;
  instructor: string;
  goal: string;
  content: string;
  supplies: string;
  mood: ActivityMood;
  notes: string;
  photos: string[];
  targetResidentIds: string[];
};

export type EngagementLevel = "적극적" | "보통" | "소극적" | "불참";
export type EmotionalResponse = "즐거움" | "안정" | "피곤" | "불안" | "거부" | "무반응";
export type AssistanceLevel = "독립 수행" | "말로 안내" | "부분 도움" | "지속 도움" | "전적 도움";

export type IndividualResponse = {
  residentId: string;
  engagement: EngagementLevel;
  emotionalResponse: EmotionalResponse;
  assistanceLevel: AssistanceLevel;
  note: string;
};

export type MealAmount = "전량" | "3/4" | "절반" | "1/4" | "거의 미섭취" | "거부";
export type WaterAmount = "충분" | "보통" | "부족";
export type MedicationState = "없음" | "예정대로 투약" | "지연 투약" | "투약 거부" | "보호자 확인 필요";
export type ExcretionState = "정상" | "배변" | "배뇨" | "변비" | "설사" | "실금" | "도움 필요";
export type SleepState = "수면 없음" | "30분 미만" | "30~60분" | "1시간 이상" | "숙면" | "뒤척임" | "휴식만 함";
export type MoodState = "안정" | "활기참" | "우울" | "불안" | "초조" | "공격적 행동" | "반복 행동" | "인지 혼란";
export type CareAction = "휴식 제공" | "활력징후 재확인" | "간호인력 확인" | "보호자 연락" | "병원 방문 권고" | "시설장 보고" | "추가 관찰" | "기타";
export type GuardianNoticeType = "전달 필요 없음" | "알림장 포함" | "전화 필요" | "긴급 연락" | "내부 기록만";

export type PrivacyScope = "internal_only" | "guardian_ok" | "auto_doc_ok" | "promo_ok" | "consent_needed";

export type IndividualCare = {
  residentId: string;
  checkinTime: string;
  checkoutTime: string;
  shuttleIn: string;
  shuttleOut: string;
  shuttleNote: string;
  temperature: string;
  bloodPressure: string;
  pulse: string;
  bloodSugar: string;
  pain: string;
  skinCondition: string;
  walkStatus: string;
  symptom: string;
  meal: MealAmount;
  water: WaterAmount;
  snack: string;
  mealAssistance: string;
  swallowingNote: string;
  medicationState: MedicationState;
  medicationNote: string;
  excretion: ExcretionState;
  sleep: SleepState;
  moodState: MoodState;
  notes: string;
  staffAssigned: string;
  actions: CareAction[];
  guardianNotice: GuardianNoticeType;
  privacyScopes: Record<string, PrivacyScope>;
};

export type SectionKey =
  | "checkin"
  | "vitals"
  | "morning_activity"
  | "meal"
  | "medication"
  | "excretion"
  | "sleep"
  | "afternoon_activity"
  | "mood_walk"
  | "notes"
  | "actions"
  | "guardian_notice";

export type RecordSectionItem = {
  key: SectionKey;
  title: string;
  rawValues: string[];
  synthesizedText: string;
  isEntered: boolean;
  isOrganized: boolean;
  privacyScope: PrivacyScope;
};

export type IntegratedDailyRecord = {
  residentId: string;
  date: string;
  completionRate: number;
  isSaved: boolean;
  isOrganized: boolean;
  sections: RecordSectionItem[];
};

export type DocStatus =
  | "available"
  | "needs_input"
  | "consent_needed"
  | "accumulated_needed"
  | "completed"
  | "approved"
  | "sent";

export type DocCategory = "guardian" | "internal" | "program" | "promo";

export type DocAvailability = {
  docKey: string;
  title: string;
  category: DocCategory;
  categoryLabel: string;
  status: DocStatus;
  statusLabel: string;
  isInternal: boolean;
  requiredFields: string[];
};
