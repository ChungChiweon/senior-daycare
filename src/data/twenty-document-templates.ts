import type { BlockType, DocumentCategory, DocumentTemplate } from "@/types/record-block";

export type DocumentTypeInfo = DocumentTemplate & {
  description: string;
  actionType: "save" | "send" | "publish";
  targetAudience: string;
  defaultDraftGenerator: (residentName: string, dateStr: string) => string;
};

export const TWENTY_DOCUMENT_TYPES: DocumentTypeInfo[] = [
  // 1. [보호자 소통 - 5종]
  {
    id: "doc_01",
    title: "1. 보호자 일일 알림장",
    category: "guardian",
    categoryLabel: "보호자 소통",
    isInternal: false,
    blockOrder: ["guardian_message", "meal_hydration", "common_program", "individual_participation"],
    toneStyle: "warm",
    hwpxTemplateName: "guardian_daily_notice.hwpx",
    description: "어르신의 오늘 식사, 투약, 특이사항, 프로그램 참여 모습을 담은 일일 알림장입니다.",
    actionType: "send",
    targetAudience: "보호자 (카카오톡/알림장 앱)",
    defaultDraftGenerator: (name, date) =>
      `[${date} ${name} 어르신 알림장]\n안녕하세요 보호자님, 오늘 ${name} 어르신께서는 점심 식사 전량을 맛있게 드셨으며, 오후 뇌자극 칠교놀이 프로그램에 높은 집중력으로 참여하셨습니다. 하원 시 활기찬 표정이셨으며, 무릎 휴식을 제공해 드렸으니 가정에서도 온찜질 부탁드립니다.`
  },
  {
    id: "doc_02",
    title: "2. 보호자 문자 요약",
    category: "guardian",
    categoryLabel: "보호자 소통",
    isInternal: false,
    blockOrder: ["guardian_message"],
    toneStyle: "concise",
    hwpxTemplateName: "guardian_sms_summary.hwpx",
    description: "핵심 생활 및 케어 내용만 요약한 90자 단문 LMS 문자 메시지입니다.",
    actionType: "send",
    targetAudience: "보호자 (SMS/LMS)",
    defaultDraftGenerator: (name, date) =>
      `[{{organizationName}}] ${name} 어르신 ${date} 일일요약: 식사 전량 섭취, 활력징후 정상, 오후 인지 칠교놀이 모범 참여 후 안전 귀가하셨습니다.`
  },
  {
    id: "doc_03",
    title: "3. 카카오 알림톡 문안",
    category: "guardian",
    categoryLabel: "보호자 소통",
    isInternal: false,
    blockOrder: ["attendance_transport", "guardian_message"],
    toneStyle: "warm",
    hwpxTemplateName: "kakao_alimtalk.hwpx",
    description: "카카오톡 브랜드 알림톡 전용 템플릿 서식 문안입니다.",
    actionType: "send",
    targetAudience: "보호자 (카카오 알림톡)",
    defaultDraftGenerator: (name, date) =>
      `[{{organizationName}} 알림톡]\n■ 어르신: ${name} 님\n■ 일자: ${date}\n■ 등하원: 08:45 등원 / 16:30 하원\n■ 오늘의 생활: 식사 전량 섭취, 인지 프로그램 우수 참여\n■ 전달사항: 무릎 온찜질 당부드립니다.`
  },
  {
    id: "doc_04",
    title: "4. 보호자 상담 후속 안내문",
    category: "guardian",
    categoryLabel: "보호자 소통",
    isInternal: false,
    blockOrder: ["special_notes", "actions_taken", "guardian_message"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "counseling_followup.hwpx",
    description: "생활 관찰 및 건강 특이사항에 기반한 보호자 정기 상담 안내서입니다.",
    actionType: "send",
    targetAudience: "보호자 (서면/모바일)",
    defaultDraftGenerator: (name, date) =>
      `[보호자 상담 후속 안내]\n수급자 ${name} 어르신의 ${date} 신체·인지 관찰 결과, 인지활동 참여도가 크게 향상되었습니다. 하원 전 언급하신 무릎 가벼운 불편감에 대한 센터 조치사항 및 가정 내 케어 가이드를 안내해 드립니다.`
  },
  {
    id: "doc_05",
    title: "5. 월간 생활 요약문",
    category: "guardian",
    categoryLabel: "보호자 소통",
    isInternal: false,
    blockOrder: ["attendance_transport", "health_vitals", "common_program", "individual_participation"],
    toneStyle: "warm",
    hwpxTemplateName: "monthly_life_summary.hwpx",
    description: "한 달간의 출석률, 건강 추이, 프로그램 반응을 종합한 월간 소식지입니다.",
    actionType: "send",
    targetAudience: "보호자 (월간 리포트)",
    defaultDraftGenerator: (name, date) =>
      `[${name} 어르신 월간 생활 종합 요약]\n${date} 기준, 출석률 98%로 성실히 이용하셨으며 활력징후 체온 36.5℃, 혈압 120/80 mmHg로 안정적입니다. 신체 및 인지 프로그램 종합 참여도 '우수' 판정을 받으셨습니다.`
  },

  // 2. [법정·내부 기록 - 6종]
  {
    id: "doc_06",
    title: "6. 장기요양급여 제공기록 문안",
    category: "internal",
    categoryLabel: "법정·내부 기록",
    isInternal: true,
    blockOrder: ["attendance_transport", "health_vitals", "meal_hydration", "medication", "elimination", "common_program", "individual_participation", "actions_taken"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "longterm_care_record.hwpx",
    description: "국민건강보험공단 장기요양 고시 서식에 맞춘 장기요양급여 제공기록 표준 문안입니다.",
    actionType: "save",
    targetAudience: "국민건강보험공단 / 공단 평가용",
    defaultDraftGenerator: (name, date) =>
      `[장기요양급여 제공기록지]\n일자: ${date} | 수급자: ${name}\n1. 신체활동지원: 식사 전량 도움 없이 섭취, 이동 보행 관찰.\n2. 인지관리지원: 오후 뇌자극 칠교놀이 동참.\n3. 간호및처치: 혈압 120/80 mmHg 측정, 식후 고혈압약 투약 완료.`
  },
  {
    id: "doc_07",
    title: "7. 이용자 일일 관찰기록",
    category: "internal",
    categoryLabel: "법정·내부 기록",
    isInternal: true,
    blockOrder: ["attendance_transport", "emotion_behavior_cognition", "common_program", "special_notes"],
    toneStyle: "concise",
    hwpxTemplateName: "daily_observation_log.hwpx",
    description: "어르신의 일일 신체·인지·정서 변화 상태를 정밀 기록한 내부 서식입니다.",
    actionType: "save",
    targetAudience: "시설 내부 관찰 일지",
    defaultDraftGenerator: (name, date) =>
      `[이용자 일일 관찰기록 - ${name}]\n${date} 등원 시 밝은 미소 유지. 신체 활력 안정적이며 인지 자극 프로그램 시 도안 완성 후 타 어르신들과 격려 박수 주고받음. 특이사항: 무릎 휴식 20분 제공.`
  },
  {
    id: "doc_08",
    title: "8. 건강·투약 특이사항 기록",
    category: "internal",
    categoryLabel: "법정·내부 기록",
    isInternal: true,
    blockOrder: ["health_vitals", "medication", "special_notes", "actions_taken"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "health_medication_log.hwpx",
    description: "간호 파트의 바이탈 수치, 투약 이행, 긴급 조치 내역 기록지입니다.",
    actionType: "save",
    targetAudience: "간호사 / 요양보호사",
    defaultDraftGenerator: (name, date) =>
      `[건강·투약 특이사항 - ${name}]\n${date} 체온 36.5℃, 혈압 120/80 mmHg, 혈당 110 mg/dL. 점심 식후 처방 고혈압약 1정 지도하에 안전 복용 완료. 무릎 불편감 언급하여 온찜질 조치 수행.`
  },
  {
    id: "doc_09",
    title: "9. 프로그램 참여·반응 기록",
    category: "internal",
    categoryLabel: "법정·내부 기록",
    isInternal: true,
    blockOrder: ["common_program", "individual_participation"],
    toneStyle: "concise",
    hwpxTemplateName: "program_engagement_log.hwpx",
    description: "프로그램 진행 시 수급자의 개별 참여도 및 인지 반응 세부 일지입니다.",
    actionType: "save",
    targetAudience: "사회복지사 / 프로그램 강사",
    defaultDraftGenerator: (name, date) =>
      `[프로그램 참여 일지 - ${name}]\n일자: ${date} | 프로그램: 뇌자극 칠교놀이\n참여도: 매우 적극적 | 수행능력: 우수 | 정서반응: 만족\n세부내용: 독립 조작 성공 후 주변에 소통 유도.`
  },
  {
    id: "doc_10",
    title: "10. 사회복지사 업무일지",
    category: "internal",
    categoryLabel: "법정·내부 기록",
    isInternal: true,
    blockOrder: ["attendance_transport", "common_program", "special_notes", "actions_taken"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "socialworker_worklog.hwpx",
    description: "사회복지사의 담당 수급자 일일 케어 종합 업무 일지입니다.",
    actionType: "save",
    targetAudience: "시설장 / 외부 평가",
    defaultDraftGenerator: (name, date) =>
      `[사회복지사 업무일지 - ${date}]\n담당 수급자: ${name} 외 7명\n주요 업무: 입실 확인, 인지 칠교놀이 주도 진행, 개별 상담 및 보호자 알림장 문안 확정, 귀가 송영 지도 완료.`
  },
  {
    id: "doc_11",
    title: "11. 직원 인수인계 문안",
    category: "internal",
    categoryLabel: "법정·내부 기록",
    isInternal: true,
    blockOrder: ["health_vitals", "medication", "special_notes", "actions_taken"],
    toneStyle: "concise",
    hwpxTemplateName: "staff_handover_note.hwpx",
    description: "야간 및 다음 날 근무 직원을 위한 핵심 관찰 사항 인수인계 노트입니다.",
    actionType: "save",
    targetAudience: "다음 교대 근무 직원",
    defaultDraftGenerator: (name, date) =>
      `[근무 인수인계 - ${name}]\n- 투약: 고혈압약 복용 완료\n- 케어 관찰: 하원 전 무릎 가벼운 통증 언급으로 온찜질 시행함. 내일 등원 시 무릎 보행 상태 재확인 요망.`
  },

  // 3. [프로그램 문서 - 4종]
  {
    id: "doc_12",
    title: "12. 프로그램 결과기록",
    category: "program",
    categoryLabel: "프로그램 문서",
    isInternal: true,
    blockOrder: ["common_program", "individual_participation"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "program_result_report.hwpx",
    description: "평가 항목 대비 프로그램 일일 결과 종합 보고서입니다.",
    actionType: "save",
    targetAudience: "공단 평가 / 프로그램 관리자",
    defaultDraftGenerator: (name, date) =>
      `[프로그램 결과보고서]\n일자: ${date} | 명칭: 뇌자극 칠교놀이\n참여인원: 8명 (${name} 어르신 포함)\n결과 요약: 시공간 인지 자극 목표 달성, 참여 만족도 95% 기록.`
  },
  {
    id: "doc_13",
    title: "13. 프로그램 평가 및 개선안",
    category: "program",
    categoryLabel: "프로그램 문서",
    isInternal: true,
    blockOrder: ["common_program", "individual_participation", "actions_taken"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "program_evaluation.hwpx",
    description: "프로그램 효과성 분석 및 차기 개선사항 평가서입니다.",
    actionType: "save",
    targetAudience: "사회복지사 / 시설장",
    defaultDraftGenerator: (name, date) =>
      `[프로그램 평가 및 개선안]\n성과: ${name} 어르신 등 고령 수급자의 소근육 조작 및 도안 완성률 우수.\n개선안: 다음 회기에는 난이도별 도안 3종을 채택하여 수준별 맞춤 훈련 제공 추진.`
  },
  {
    id: "doc_14",
    title: "14. 다음 회기 운영 제안",
    category: "program",
    categoryLabel: "프로그램 문서",
    isInternal: true,
    blockOrder: ["common_program", "actions_taken"],
    toneStyle: "warm",
    hwpxTemplateName: "next_session_plan.hwpx",
    description: "어르신 반응에 기반한 다음 회기 프로그램 운영 계획안입니다.",
    actionType: "save",
    targetAudience: "외부 강사 / 복지팀",
    defaultDraftGenerator: (name, date) =>
      `[차기 회기 운영 제안서]\n금일 칠교놀이 반응 호조에 따라, 다음 주에는 '전통 문양 칠교 완성하기' 주제로 확장 운영할 것을 제안합니다.`
  },
  {
    id: "doc_15",
    title: "15. 개별 이용자 참여평가",
    category: "program",
    categoryLabel: "프로그램 문서",
    isInternal: true,
    blockOrder: ["individual_participation", "special_notes"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "individual_engagement_eval.hwpx",
    description: "수급자 1인의 프로그램 종합 인지·정서 평가표입니다.",
    actionType: "save",
    targetAudience: "개별 케어 플랜 기록",
    defaultDraftGenerator: (name, date) =>
      `[개별 참여평가표 - ${name}]\n참여도: A등급 (매우 적극적)\n집중도: 25분 이상 모범 유지\n사회성: 타 어르신 격려 및 박수 호응 우수.`
  },

  // 4. [홍보·운영 - 5종]
  {
    id: "doc_16",
    title: "16. 가정통신문 문안",
    category: "promo",
    categoryLabel: "홍보·운영",
    isInternal: false,
    blockOrder: ["common_program", "guardian_message"],
    toneStyle: "warm",
    hwpxTemplateName: "home_notice.hwpx",
    description: "센터 전체 수급자 가정으로 전달되는 주간/월간 안내글입니다.",
    actionType: "publish",
    targetAudience: "전체 보호자 가정",
    defaultDraftGenerator: (name, date) =>
      `[{{organizationName}} 가정통신문]\n보호자님 안녕하십니까. ${date} 오늘 어르신들과 함께 인지 향상 칠교놀이를 진행하였습니다. 환절기 건강 관리에 유의하시기 바랍니다.`
  },
  {
    id: "doc_17",
    title: "17. 홈페이지·블로그 후기 글",
    category: "promo",
    categoryLabel: "홍보·운영",
    isInternal: false,
    blockOrder: ["common_program", "individual_participation"],
    toneStyle: "promo",
    hwpxTemplateName: "blog_review.hwpx",
    description: "네이버 블로그 및 센터 홈페이지 홍보용 활동 후기 원고입니다.",
    actionType: "publish",
    targetAudience: "네이버 블로그 / 일반 대중",
    defaultDraftGenerator: (name, date) =>
      `[{{organizationName}} 블로그] ${date} 오늘의 인지재활 이야기!\n오늘 우리 센터에서는 어르신들의 웃음꽃이 피어나는 '뇌자극 칠교놀이'를 진행했습니다! 집중해서 교구를 조작하시는 모습이 정말 멋지셨습니다!`
  },
  {
    id: "doc_18",
    title: "18. 인스타그램 카드뉴스 문안",
    category: "promo",
    categoryLabel: "홍보·운영",
    isInternal: false,
    blockOrder: ["common_program"],
    toneStyle: "promo",
    hwpxTemplateName: "instagram_cardnews.hwpx",
    description: "인스타그램 5장 템플릿용 카드뉴스 텍스트 및 해시태그 모음입니다.",
    actionType: "publish",
    targetAudience: "인스타그램 피드",
    defaultDraftGenerator: (name, date) =>
      `[카드뉴스 슬라이드 텍스트]\nSlide 1: 뇌가 쌩쌩해지는 실버 칠교놀이!\nSlide 2: 집중력 100% 어르신들의 인지재활 현장\n#주간보호센터 #노인복지 #인지재활 #데이케어센터`
  },
  {
    id: "doc_19",
    title: "19. 월간 소식지 기사",
    category: "promo",
    categoryLabel: "홍보·운영",
    isInternal: false,
    blockOrder: ["common_program", "guardian_message"],
    toneStyle: "promo",
    hwpxTemplateName: "monthly_newsletter.hwpx",
    description: "센터 월간 발행 소식지에 게재되는 현장 인터뷰 기사 문안입니다.",
    actionType: "publish",
    targetAudience: "소식지 구독자",
    defaultDraftGenerator: (name, date) =>
      `[센터 소식지 7월호 기사]\n'함께해서 더욱 즐거운 인지재활 교실'\n금월 우리 센터에서는 다양한 조작 도구를 활용한 인지 훈련을 시행하였으며, 어르신들의 밝은 웃음이 넘치는 성과를 이루었습니다.`
  },
  {
    id: "doc_20",
    title: "20. 요양보호사·직원 교육 자료",
    category: "promo",
    categoryLabel: "홍보·운영",
    isInternal: true,
    blockOrder: ["actions_taken", "special_notes"],
    toneStyle: "formal_legal",
    hwpxTemplateName: "staff_education_mat.hwpx",
    description: "현장 케어 사례 분석을 기반으로 한 요양보호사 사내 교육 직무 자료입니다.",
    actionType: "save",
    targetAudience: "요양보호사 및 직원 교육",
    defaultDraftGenerator: (name, date) =>
      `[직무 교육 자료 - 케어 모범 사례]\n주제: 하원 전 가벼운 무릎 불편감 호소 시 대응 수칙\n1. 온찜질 및 따뜻한 안심 유도\n2. 간호 파트 바이탈 측정 보고\n3. 하원 시 보호자 친절 구두 전달.`
  }
];
