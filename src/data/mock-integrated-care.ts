import type {
  CommonActivity,
  DocAvailability,
  IndividualCare,
  IndividualResponse,
  IntegratedResident
} from "@/types/integrated-care";

export const MOCK_RESIDENTS: IntegratedResident[] = [
  {
    id: "res-01",
    name: "김순자",
    gender: "여",
    age: 82,
    grade: "3등급",
    careNumber: "L-2023-00124",
    attendanceStatus: "출석",
    group: "A그룹",
    photoUrl: "/avatars/senior-woman-1.jpg",
    hasPhotoConsent: true
  },
  {
    id: "res-02",
    name: "박영수",
    gender: "남",
    age: 85,
    grade: "2등급",
    careNumber: "L-2022-00561",
    attendanceStatus: "출석",
    group: "A그룹",
    photoUrl: "/avatars/senior-man-1.jpg",
    hasPhotoConsent: true
  },
  {
    id: "res-03",
    name: "이정희",
    gender: "여",
    age: 79,
    grade: "4등급",
    careNumber: "L-2024-00912",
    attendanceStatus: "출석",
    group: "B그룹",
    photoUrl: "/avatars/senior-woman-2.jpg",
    hasPhotoConsent: true
  },
  {
    id: "res-04",
    name: "최복례",
    gender: "여",
    age: 88,
    grade: "3등급",
    careNumber: "L-2021-00332",
    attendanceStatus: "출석",
    group: "B그룹",
    photoUrl: "/avatars/senior-woman-3.jpg",
    hasPhotoConsent: true
  },
  {
    id: "res-05",
    name: "강성호",
    gender: "남",
    age: 81,
    grade: "2등급",
    careNumber: "L-2023-00788",
    attendanceStatus: "출석",
    group: "A그룹",
    photoUrl: "/avatars/senior-man-2.jpg",
    hasPhotoConsent: false
  },
  {
    id: "res-06",
    name: "정동진",
    gender: "남",
    age: 87,
    grade: "1등급",
    careNumber: "L-2020-00109",
    attendanceStatus: "출석",
    group: "C그룹",
    photoUrl: "/avatars/senior-man-3.jpg",
    hasPhotoConsent: true
  },
  {
    id: "res-07",
    name: "윤옥선",
    gender: "여",
    age: 76,
    grade: "5등급",
    careNumber: "L-2025-00015",
    attendanceStatus: "출석",
    group: "C그룹",
    photoUrl: "/avatars/senior-woman-4.jpg",
    hasPhotoConsent: true
  },
  {
    id: "res-08",
    name: "홍길동",
    gender: "남",
    age: 84,
    grade: "3등급",
    careNumber: "L-2023-00441",
    attendanceStatus: "결석",
    group: "B그룹",
    photoUrl: "/avatars/senior-man-4.jpg",
    hasPhotoConsent: true
  }
];

export const MOCK_COMMON_ACTIVITIES: CommonActivity[] = [
  {
    id: "act-01",
    title: "오전 실버 건강체조 및 스트레칭",
    category: "신체",
    time: "10:30 ~ 11:30",
    instructor: "김철수 물리치료사 / 박지영 사회복지사",
    goal: "상·하체 근육 유연성 유지 및 혈액순환 촉진",
    content: "음악에 맞추어 손뼉 치기, 어깨 넓히기 스트레칭 및 가벼운 제자리 걸음 체조 수행",
    supplies: "체조용 세라밴드, 음악 재생기",
    mood: "활기참",
    notes: "어르신들 전반적으로 호응이 매우 우수함",
    photos: ["/images/gym-1.jpg", "/images/gym-2.jpg"],
    targetResidentIds: ["res-01", "res-02", "res-03", "res-04", "res-05", "res-06", "res-07"]
  },
  {
    id: "act-02",
    title: "오후 뇌자극 칠교놀이 및 인지교구 훈련",
    category: "인지",
    time: "14:00 ~ 15:00",
    instructor: "박지영 사회복지사",
    goal: "시공간 지각 능력 향상 및 소근육 유연성 유지",
    content: "단계별 도안 카드를 보며 칠교 조각 7개를 조합하여 동물 및 집 모양 완성하기",
    supplies: "원목 칠교 교구 세트, 단계별 도안 카드",
    mood: "안정적",
    notes: "소근육 유연성이 낮은 어르신은 워크북 가이드 카드 제공",
    photos: ["/images/puzzle-1.jpg"],
    targetResidentIds: ["res-01", "res-02", "res-03", "res-04", "res-05", "res-06", "res-07"]
  }
];

export const MOCK_INDIVIDUAL_RESPONSES: Record<string, IndividualResponse> = {
  "res-01": {
    residentId: "res-01",
    engagement: "적극적",
    emotionalResponse: "즐거움",
    assistanceLevel: "독립 수행",
    note: "칠교 완성 후 활짝 웃으시며 다른 어르신들께 박수와 도움을 건넴"
  },
  "res-02": {
    residentId: "res-02",
    engagement: "보통",
    emotionalResponse: "안정",
    assistanceLevel: "부분 도움",
    note: "색상 및 각도 구분 시 말로 가볍게 안내해 드리자 능숙히 완성함"
  },
  "res-03": {
    residentId: "res-03",
    engagement: "소극적",
    emotionalResponse: "피곤",
    assistanceLevel: "지속 도움",
    note: "소근육 피로감 보여 중간 휴식 제공 후 가벼운 난이도로 재참여 조력"
  },
  "res-04": {
    residentId: "res-04",
    engagement: "적극적",
    emotionalResponse: "즐거움",
    assistanceLevel: "독립 수행",
    note: "체조 동작을 또렷하게 따라 하시고 칠교 도안 3개를 가장 먼저 완성함"
  },
  "res-05": {
    residentId: "res-05",
    engagement: "보통",
    emotionalResponse: "안정",
    assistanceLevel: "부분 도움",
    note: "혈압 수치 상승에 따라 강도 완화 스트레칭 위주 참여 유도"
  },
  "res-06": {
    residentId: "res-06",
    engagement: "소극적",
    emotionalResponse: "피곤",
    assistanceLevel: "전적 도움",
    note: "휠체어 착석 상태에서 사회복지사의 소근육 1:1 조력으로 상체 반응 유도"
  },
  "res-07": {
    residentId: "res-07",
    engagement: "보통",
    emotionalResponse: "안정",
    assistanceLevel: "말로 안내",
    note: "신규 입소 어르신으로 차분히 설명드리며 칠교 맞추기 시도 완수"
  },
  "res-08": {
    residentId: "res-08",
    engagement: "불참",
    emotionalResponse: "무반응",
    assistanceLevel: "독립 수행",
    note: "당일 결석 (병원 정기 검진)"
  }
};

export const MOCK_INDIVIDUAL_CARES: Record<string, IndividualCare> = {
  "res-01": {
    residentId: "res-01",
    checkinTime: "08:45",
    checkoutTime: "16:30",
    shuttleIn: "1호차 (08:30 탑승)",
    shuttleOut: "1호차 (16:30 하원)",
    shuttleNote: "밝은 표정으로 탑승",
    temperature: "36.5℃",
    bloodPressure: "120/80 mmHg",
    pulse: "72회/분",
    bloodSugar: "110 mg/dL",
    pain: "없음",
    skinCondition: "양호",
    walkStatus: "자립 보행",
    symptom: "특이증상 없음",
    meal: "전량",
    water: "충분",
    snack: "고구마 1개 및 두유 전량 섭취",
    mealAssistance: "자립 식사",
    swallowingNote: "사래 없음",
    medicationState: "예정대로 투약",
    medicationNote: "점심 식후 고혈압약 1정 정량 투약 완료",
    excretion: "정상",
    sleep: "30~60분",
    moodState: "활기참",
    notes: "하원 전 무릎 가벼운 불편감 언급하셨으나 스트레칭 후 호전됨",
    staffAssigned: "박지영 사회복지사",
    actions: ["휴식 제공", "보호자 연락"],
    guardianNotice: "알림장 포함",
    privacyScopes: {
      health: "internal_only",
      meal: "guardian_ok",
      medication: "internal_only",
      excretion: "internal_only",
      notes: "guardian_ok"
    }
  },
  "res-02": {
    residentId: "res-02",
    checkinTime: "08:50",
    checkoutTime: "16:30",
    shuttleIn: "1호차",
    shuttleOut: "1호차",
    shuttleNote: "보행 안전 조력",
    temperature: "36.6℃",
    bloodPressure: "128/82 mmHg",
    pulse: "75회/분",
    bloodSugar: "125 mg/dL",
    pain: "없음",
    skinCondition: "양호",
    walkStatus: "지팡이 자립 보행",
    symptom: "이상 없음",
    meal: "3/4",
    water: "보통",
    snack: "두유 전량",
    mealAssistance: "부분 도움",
    swallowingNote: "이상 없음",
    medicationState: "예정대로 투약",
    medicationNote: "당뇨약 점심 식후 복용",
    excretion: "배변",
    sleep: "1시간 이상",
    moodState: "안정",
    notes: "식사 조각 크기 작게 자르는 도움 제공함",
    staffAssigned: "김철수 요양보호사",
    actions: ["휴식 제공"],
    guardianNotice: "알림장 포함",
    privacyScopes: {
      health: "internal_only",
      meal: "guardian_ok",
      medication: "internal_only"
    }
  },
  "res-03": {
    residentId: "res-03",
    checkinTime: "09:00",
    checkoutTime: "16:30",
    shuttleIn: "2호차",
    shuttleOut: "2호차",
    shuttleNote: "피곤한 기색으로 등원",
    temperature: "36.8℃",
    bloodPressure: "135/88 mmHg",
    pulse: "78회/분",
    bloodSugar: "140 mg/dL",
    pain: "약간의 피로감",
    skinCondition: "건조",
    walkStatus: "워커 보행 도움",
    symptom: "식욕 저하",
    meal: "절반",
    water: "부족",
    snack: "간식 소량 섭취",
    mealAssistance: "지속 도움",
    swallowingNote: "천천히 삼키도록 관찰",
    medicationState: "보호자 확인 필요",
    medicationNote: "투약약 일부 미지참하여 보호자 확인 전화 진행",
    excretion: "도움 필요",
    sleep: "1시간 이상",
    moodState: "우울",
    notes: "오후 식욕 저하로 죽식 변경 검토 및 수분 섭취 권장",
    staffAssigned: "박지영 사회복지사",
    actions: ["휴식 제공", "활력징후 재확인", "보호자 연락"],
    guardianNotice: "전화 필요",
    privacyScopes: {
      health: "internal_only",
      meal: "guardian_ok",
      medication: "internal_only"
    }
  }
};

export const MOCK_DOC_AVAILABILITIES: DocAvailability[] = [
  // 보호자 소통 (5종)
  { docKey: "doc-01", title: "1. 보호자 일일 알림장", category: "guardian", categoryLabel: "보호자 소통", status: "available", statusLabel: "생성 가능", isInternal: false, requiredFields: ["meal", "activity", "health"] },
  { docKey: "doc-02", title: "2. 보호자 문자 요약 (SMS)", category: "guardian", categoryLabel: "보호자 소통", status: "available", statusLabel: "생성 가능", isInternal: false, requiredFields: ["meal", "activity"] },
  { docKey: "doc-03", title: "3. 카카오 알림톡 문안", category: "guardian", categoryLabel: "보호자 소통", status: "available", statusLabel: "생성 가능", isInternal: false, requiredFields: ["meal", "vitals"] },
  { docKey: "doc-04", title: "4. 보호자 상담 후속 안내문", category: "guardian", categoryLabel: "보호자 소통", status: "needs_input", statusLabel: "추가 입력 필요", isInternal: false, requiredFields: ["counseling_date"] },
  { docKey: "doc-05", title: "5. 월간 생활 요약문", category: "guardian", categoryLabel: "보호자 소통", status: "accumulated_needed", statusLabel: "누적 기록 필요", isInternal: false, requiredFields: ["monthly_records"] },

  // 법정·내부 기록 (6종)
  { docKey: "doc-06", title: "6. 장기요양급여 제공기록 문안", category: "internal", categoryLabel: "법정·내부 기록", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["meal", "medication", "vitals"] },
  { docKey: "doc-07", title: "7. 이용자 일일 관찰기록", category: "internal", categoryLabel: "법정·내부 기록", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["mood", "activity"] },
  { docKey: "doc-08", title: "8. 건강·투약 특이사항 기록", category: "internal", categoryLabel: "법정·내부 기록", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["vitals", "medication"] },
  { docKey: "doc-09", title: "9. 프로그램 참여·반응 기록", category: "internal", categoryLabel: "법정·내부 기록", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["engagement", "emotional"] },
  { docKey: "doc-10", title: "10. 사회복지사 업무일지", category: "internal", categoryLabel: "법정·내부 기록", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["shuttle", "activity"] },
  { docKey: "doc-11", title: "11. 직원 인수인계 문안", category: "internal", categoryLabel: "법정·내부 기록", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["notes", "actions"] },

  // 프로그램 문서 (4종)
  { docKey: "doc-12", title: "12. 프로그램 결과기록", category: "program", categoryLabel: "프로그램 문서", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["activity_name"] },
  { docKey: "doc-13", title: "13. 프로그램 평가 및 개선안", category: "program", categoryLabel: "프로그램 문서", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["activity_feedback"] },
  { docKey: "doc-14", title: "14. 다음 회기 운영 제안", category: "program", categoryLabel: "프로그램 문서", status: "needs_input", statusLabel: "추가 입력 필요", isInternal: true, requiredFields: ["next_plan"] },
  { docKey: "doc-15", title: "15. 개별 이용자 참여평가", category: "program", categoryLabel: "프로그램 문서", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["individual_response"] },

  // 운영·홍보 (5종)
  { docKey: "doc-16", title: "16. 가정통신문 문안", category: "promo", categoryLabel: "운영·홍보", status: "available", statusLabel: "생성 가능", isInternal: false, requiredFields: ["activity"] },
  { docKey: "doc-17", title: "17. 센터장 보고용 요약", category: "promo", categoryLabel: "운영·홍보", status: "available", statusLabel: "생성 가능", isInternal: true, requiredFields: ["attendance", "vitals"] },
  { docKey: "doc-18", title: "18. 홈페이지·블로그 게시글", category: "promo", categoryLabel: "운영·홍보", status: "consent_needed", statusLabel: "사진 동의 확인 필요", isInternal: false, requiredFields: ["photo_consent"] },
  { docKey: "doc-19", title: "19. 인스타그램 게시글", category: "promo", categoryLabel: "운영·홍보", status: "consent_needed", statusLabel: "사진 동의 확인 필요", isInternal: false, requiredFields: ["photo_consent"] },
  { docKey: "doc-20", title: "20. 활동사진 캡션", category: "promo", categoryLabel: "운영·홍보", status: "needs_input", statusLabel: "추가 입력 필요", isInternal: false, requiredFields: ["photo_upload"] }
];
