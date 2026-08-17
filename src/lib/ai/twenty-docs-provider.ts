import type { GeneratedDocItem, UnifiedGenerationInput } from "@/types/content";

export function generateTwentyDocs(input: UnifiedGenerationInput, isTrialMode = false): GeneratedDocItem[] {
  const senior = input.seniorName ? `${input.seniorName} 어르신` : "어르신";
  const place = input.institution?.name ?? "소속 기관이 설정되지 않았습니다.";
  const activity = input.activityName || "실버 건강체조 및 뇌자극 칠교놀이";
  const date = input.activityDate || new Date().toISOString().split("T")[0];
  const health = input.healthStatus || "양호 (혈압 120/80, 체온 36.5℃)";
  const meal = input.mealStatus || "전량 섭취";
  const med = input.medicationStatus || "지정 투약 완료";
  const progCat = input.programCategory || "신체활동 / 인지자극";
  const hasPhotos = input.uploadedImages && input.uploadedImages.length > 0;
  const photoNote = hasPhotos ? `첨부 사진(${input.uploadedImages.length}장) 생생 관찰 반영` : "텍스트 기반 자동 연동";

  const nowTime = "방금 전";

  const rawDocs: Omit<GeneratedDocItem, "id" | "characterCount" | "status" | "lastModified" | "isLocked">[] = [
    // ---------------- [보호자 소통] (5종) ----------------
    {
      docKey: "doc-01",
      title: "1. 보호자 일일 알림장",
      category: "guardian",
      categoryLabel: "보호자 소통",
      isInternal: false,
      content: `[${place} 일일 알림장]
${senior} 보호자님, 안녕하십니까.
오늘 어르신께서는 ${activity} 프로그램에 밝은 웃음으로 참여하셨습니다.
점심 식사(${meal})와 점심 식후 약 투약(${med})도 안심하고 섭취하셨으며, 건강 상태(${health})도 아주 양호하십니다.
${photoNote}
가정에서도 편안한 휴식 취하실 수 있도록 함께해 주시기 바랍니다. 늘 따뜻한 관심에 감사드립니다.`
    },
    {
      docKey: "doc-02",
      title: "2. 보호자 문자 요약",
      category: "guardian",
      categoryLabel: "보호자 소통",
      isInternal: false,
      content: `[${place}] ${senior} 오늘 센터 케어 현황: 식사(${meal}), 투약(${med}), 건강(${health}). 오늘 ${activity}에 매우 즐겁게 참여하셨습니다.`
    },
    {
      docKey: "doc-03",
      title: "3. 카카오 알림톡 문안",
      category: "guardian",
      categoryLabel: "보호자 소통",
      isInternal: false,
      content: `💬 [카카오 알림톡] ${place} 안내
${senior} 보호자님, 오늘 어르신의 센터 케어 일지가 등록되었습니다.
• 당일 활동: ${activity} (${progCat})
• 바이탈/건강: ${health}
• 식사/투약: ${meal} / ${med}
아래 링크를 누르시면 오늘 활동 사진과 상세 급여제공 기록을 확인하실 수 있습니다.`
    },
    {
      docKey: "doc-04",
      title: "4. 보호자 상담 후속 안내문",
      category: "guardian",
      categoryLabel: "보호자 소통",
      isInternal: false,
      content: `[보호자 정기 상담 후속 안내]
수신: ${senior} 보호자님
발신: ${place} 담당 사회복지사
안내 내용: 어르신의 최근 센터 내 보행 및 소근육 유연성 유지 활동 경과를 전달해 드립니다. 가정 내에서도 야간 보행 시 미끄럼 방지 양말 착용을 당부드립니다.`
    },
    {
      docKey: "doc-05",
      title: "5. 월간 생활 요약문",
      category: "guardian",
      categoryLabel: "보호자 소통",
      isInternal: false,
      content: `[${senior} 월간 센터 생활 리포트]
• 출석률: 95% (20일 출석)
• 주요 활동: 신체유연성 체조, 뇌자극 교구 칠교놀이, 원예치료
• 종합 의견: 다른 수급자분들과 활발히 담소를 나누시며 매우 안정적이고 건강한 한 달을 보내셨습니다.`
    },

    // ---------------- [법정·내부 기록] (6종) ----------------
    {
      docKey: "doc-06",
      title: "6. 장기요양급여 제공기록 문안",
      category: "internal",
      categoryLabel: "법정·내부 기록",
      isInternal: true,
      content: `[장기요양 급여제공기록지 - 별지 제24호서식 연동]
수급자: ${senior} (3등급) | 일자: ${date}
1. 신체활동 지원: 식사수발(${meal}), 이동도움, 세면 케어 완료
2. 인지관리 지원: ${activity} (${progCat}) 60분 수행
3. 간호 및 처치: 혈압/체온 측정(${health}), 점심 식후 지정 약 투약(${med})`
    },
    {
      docKey: "doc-07",
      title: "7. 이용자 일일 관찰기록",
      category: "internal",
      categoryLabel: "법정·내부 기록",
      isInternal: true,
      content: `[일일 수급자 행동 관찰 일지]
수급자: ${senior} | 관찰일: ${date}
오전 등원 시 기분 매우 밝으셨으며, ${activity} 진행 중 교구 조각을 능숙하게 맞추시며 자신감을 표출함. 보행 시 가벼운 조력으로 안전 이동 완료.`
    },
    {
      docKey: "doc-08",
      title: "8. 건강·투약 특이사항 기록",
      category: "internal",
      categoryLabel: "법정·내부 기록",
      isInternal: true,
      content: `[간호·투약 관리 일지]
수급자: ${senior}
• 바이탈 측정: ${health}
• 식사 현황: ${meal}
• 투약 현황: ${med}
• 특이사항: 소화 상태 양호하며, 수분 섭취(일 800ml 이상) 지속 안내함.`
    },
    {
      docKey: "doc-09",
      title: "9. 프로그램 참여·반응 기록",
      category: "internal",
      categoryLabel: "법정·내부 기록",
      isInternal: true,
      content: `[프로그램 참여 수행 평가]
프로그램: ${activity}
참여자: ${senior}
반응도: 5.0 / 5.0 (매우 적극적)
소견: 손가락 소근육 움직임이 유연하며 인지 지시사항을 정확히 이해하고 완수함.`
    },
    {
      docKey: "doc-10",
      title: "10. 사회복지사 업무일지",
      category: "internal",
      categoryLabel: "법정·내부 기록",
      isInternal: true,
      content: `[사회복지사 일일 업무일지]
일자: ${date} | 담당: 담당 사회복지사
1. 등하원 송영 차량 1호차 안전 점검 및 탑승 확인 (12명)
2. ${activity} 프로그램 준비 및 어르신 참여 유도
3. 급여제공기록지 당일 미작성분 점검 및 보호자 알림장 일괄 생성`
    },
    {
      docKey: "doc-11",
      title: "11. 직원 인수인계 문안",
      category: "internal",
      categoryLabel: "법정·내부 기록",
      isInternal: true,
      content: `[교대 근무 인수인계 노트]
수진자: ${senior}
• 건강: ${health} (이상 없음)
• 하원 송영: 1호차 16:30 출발 예정
• 당부사항: 하원 조력 시 미끄럼 주의 및 보호자 수령 확인 필수.`
    },

    // ---------------- [프로그램 문서] (4종) ----------------
    {
      docKey: "doc-12",
      title: "12. 프로그램 결과기록",
      category: "program",
      categoryLabel: "프로그램 문서",
      isInternal: true,
      content: `[프로그램 운영 결과 보고서]
• 명칭: ${activity} (${progCat})
• 일시: ${date} 10:30 ~ 11:30
• 대상 인원: 12명 (입실 9명 참석, 100% 완수)
• 성과: 어르신 소근육 유연성 증진 및 인지 회상 정서적 만족도 제고`
    },
    {
      docKey: "doc-13",
      title: "13. 프로그램 평가 및 개선안",
      category: "program",
      categoryLabel: "프로그램 문서",
      isInternal: true,
      content: `[프로그램 운영 평가 및 개선 피드백]
• 평가: 어르신들의 호응도가 매우 높았으며 집중 시간 지속됨.
• 개선 제안: 다음회기에는 시각적 교구 크기를 15% 확대하여 저력 어르신의 시야 편의성을 보완할 것.`
    },
    {
      docKey: "doc-14",
      title: "14. 다음 회기 운영 제안",
      category: "program",
      categoryLabel: "프로그램 문서",
      isInternal: true,
      content: `[다음 회기 재활 프로그램 제안서]
제안 주제: 원예치료 다육식물 화분 꾸미기
기대 효과: 흙 촉감 자극을 통한 정서 안정 및 식물 관찰 인지 자극
예상 인원: 12명`
    },
    {
      docKey: "doc-15",
      title: "15. 개별 이용자 참여평가",
      category: "program",
      categoryLabel: "프로그램 문서",
      isInternal: true,
      content: `[개별 이용자 성과 평가표]
성명: ${senior}
• 이해도: A (우수)
• 협동성: A (우수)
• 신체 유연도: B+ (양호)
사회복지사 소견: 최고 모범 수급자로서 다른 어르신들에게도 박수와 격려를 유도함.`
    },

    // ---------------- [홍보·운영] (5종) ----------------
    {
      docKey: "doc-16",
      title: "16. 가정통신문 문안",
      category: "promo",
      categoryLabel: "홍보·운영",
      isInternal: false,
      content: `[${place} 가정통신문]
사랑하는 보호자님께,
어느덧 무더운 계절이 성큼 다가왔습니다.
저희 ${place}에서는 어르신들의 건강한 인지·신체 재활을 위해 매일 다채로운 ${activity} 프로그램을 운영하고 있습니다.
가정에서도 따뜻한 응원 부탁드립니다.`
    },
    {
      docKey: "doc-17",
      title: "17. 홈페이지·블로그 게시글",
      category: "promo",
      categoryLabel: "홍보·운영",
      isInternal: false,
      content: `[${place} 공지] 어르신들의 활기찬 ${activity} 소식!
안녕하세요, 노인장기요양 전문 ${place}입니다.
${date} 진행된 ${activity} 활동 현장을 소개해 드립니다. 어르신들의 밝은 웃음과 열정적인 참여로 가득했던 소중한 시간을 함께해 보세요.`
    },
    {
      docKey: "doc-18",
      title: "18. 인스타그램 게시글",
      category: "promo",
      categoryLabel: "홍보·운영",
      isInternal: false,
      content: `📸 ${place} 어르신 행복 한 컷!
오늘 어르신들과 함께한 ${activity} 시간! ❤️
웃음꽃 피어나는 신나는 인지체조로 몸도 마음도 청춘으로 돌아간 하루입니다!
#실버케어 #주간보호센터 #사회복지사 #데이케어센터 #노인복지`
    },
    {
      docKey: "doc-19",
      title: "19. 활동사진 캡션",
      category: "promo",
      categoryLabel: "홍보·운영",
      isInternal: false,
      content: `[사진 캡션] ${senior}께서 ${activity} 중 환한 미소를 지으시며 교구 조각을 완성하고 계신 모습입니다.${hasPhotos ? ` (촬영 컷: ${input.uploadedImages.length}장)` : ""}`
    },
    {
      docKey: "doc-20",
      title: "20. 센터장 보고용 요약",
      category: "promo",
      categoryLabel: "홍보·운영",
      isInternal: true,
      content: `[일일 시설장 일일 운영 보고서]
• 총 입실: 9명 (미입실 1명 결석)
• 주요 활동: ${activity} 정상 진행
• 바이탈/건강: ${senior} 포함 전원 이상 없음
• 미수금/수납: 당일 청구서발송 100% 진행 완료`
    }
  ];

  return rawDocs.map((item, idx) => {
    // Check trial lock condition: If trial mode, lock all documents beyond the first 3
    const isLocked = isTrialMode && idx >= 3;
    return {
      id: `generated-${item.docKey}`,
      ...item,
      characterCount: item.content.length,
      status: "ai_draft",
      lastModified: nowTime,
      isLocked
    };
  });
}
