import type { AiProvider } from "@/lib/ai/types";
import type { GeneratedContent, GenerationInput } from "@/types/content";

const toneLabels = {
  warm: "따뜻한 감성형",
  professional: "전문형",
  simple: "간단형",
  promotion: "홍보형"
};

function context(input: GenerationInput) {
  const keywordText = input.keywords.join(", ") || input.activityName || "어르신 건강체조 및 인지 훈련";
  const place = input.institution?.name ?? "실버케어 주간보호센터";
  const seniorText = input.seniorName ? `${input.seniorName} 어르신` : "어르신";
  const dateText = input.activityDate ? new Date(input.activityDate).toLocaleDateString("ko-KR") : "오늘";
  const toneText = input.tone ? toneLabels[input.tone] : "따뜻한 감성형";
  const photoText = input.analyzePhotos ? `첨부 사진 ${input.images.length}장의 밝고 건강한 모습을 함께 담았습니다.` : "";
  const healthInfo = input.healthStatus ? `건강상태: ${input.healthStatus}` : "체온·혈압 정상, 컨디션 양호";
  const mealInfo = input.mealStatus ? `식사량: ${input.mealStatus}` : "점심 전량 섭취, 간식 복용 완료";
  const medInfo = input.medicationStatus ? `투약: ${input.medicationStatus}` : "지정 투약 완료";

  return { keywordText, place, seniorText, dateText, toneText, photoText, healthInfo, mealInfo, medInfo };
}

export const mockProvider: AiProvider = {
  async generate(input: GenerationInput): Promise<GeneratedContent> {
    const { keywordText, place, seniorText, dateText, toneText, photoText, healthInfo, mealInfo, medInfo } = context(input);
    const activity = input.activityName || keywordText;

    if (input.type === "newsletter") {
      return {
        title: `${activity} 급여제공기록지 및 보호자 소식지`,
        body: `${place} 사회복지사 작성 - ${dateText} 진행된 ${activity} 관찰 및 급여제공기록입니다. ${seniorText}께서 높은 몰입도와 밝은 표정으로 프로그램에 동참하셨습니다.`,
        sections: [
          { label: "프로그램 평가 및 반응", value: `${seniorText}께서는 ${activity} 과정에서 적극적인 손동작과 소통으로 인지·신체 기능 유지에 매우 긍정적인 반응을 보이셨습니다.` },
          { label: "건강 및 돌봄 기록", value: `${healthInfo} / ${mealInfo} / ${medInfo}` },
          { label: "사회복지사 종합 소견", value: "다른 어르신들과도 웃음을 나누시며 정서적으로 안정된 하루를 보내셨습니다. 앞으로도 맞춤 케어를 지속하겠습니다." }
        ]
      };
    }

    if (input.type === "homepage") {
      return {
        title: `${activity} 센터 일상 소식`,
        body: `${dateText}, ${place}에서 진행된 ${activity} 현장 이야기입니다. 어르신들의 활기찬 웃음과 건강한 에너지가 가득했던 순간을 전합니다. ${photoText}`,
        sections: [
          { label: "오늘의 프로그램", value: `${activity}를 통해 어르신들의 맞춤형 신체·인지 재활 활동을 지원했습니다.` },
          { label: "현장 분위기", value: `${toneText} 톤으로 작성되었습니다. 어르신들께서 서로 격려하며 즐겁게 참여하셨습니다.` }
        ]
      };
    }

    if (input.type === "blog") {
      return {
        title: `[${place}] ${activity} 어르신 인지·신체 재활 프로그램 소식`,
        body: `${place}는 어르신 한 분 한 분의 건강과 존엄을 최우선으로 생각하는 노인 주간보호센터입니다. ${dateText}에는 어르신들과 함께 ${activity} 활동을 진행했습니다.`,
        sections: [
          { label: "SEO 제목", value: `주간보호센터 추천 | ${place} ${activity} 어르신 재활 프로그램` },
          { label: "프로그램의 필요성", value: `${activity}는 어르신의 뇌 자극과 소근육 유연성 유지에 탁월한 효과가 있습니다.` },
          { label: "어르신 반응 및 분위기", value: `${keywordText} 활동을 통해 어르신들께서 신체적 활력과 정서적 만족감을 얻으셨습니다.` },
          { label: "입소 및 이용 문의", value: `${place}은 맞춤형 송영 서비스, 영양 식단, 전문 사회복지사 케어를 제공합니다. 상담 문의: ${input.institution?.phone || "센터 안내 번호"}` }
        ]
      };
    }

    if (input.type === "instagram") {
      const hashtags = ["실버케어", "주간보호센터", "데이케어센터", "사회복지사", "노인복지", ...input.keywords.map((keyword) => keyword.replace(/\s/g, ""))];
      return {
        title: `${activity} 어르신 행복 한 컷 📸`,
        body: `${dateText} ${place}어르신들과 함께한 ${activity} 시간! 맑고 환한 웃음이 가득했던 오늘의 소중한 일상입니다. ❤️`,
        sections: [
          { label: "활동 메시지", value: `${activity}를 통해 몸도 마음도 더 활짝 열린 감사한 하루입니다.` }
        ],
        hashtags
      };
    }

    return {
      title: `${seniorText} 오늘 일일 알림장`,
      body: `보호자님 안녕하십니까, ${place} 사회복지사입니다. ${dateText} ${seniorText}의 건강하고 따뜻했던 일상을 전해드립니다. 😊${photoText ? ` ${photoText}` : ""}`,
      sections: [
        { label: "오늘의 일상 & 활동", value: `오늘 ${activity} 프로그램에 열정적으로 참여하시며 주변 어르신들께 즐거움을 전해주셨습니다.` },
        { label: "건강 & 식사 상태", value: `${healthInfo} / ${mealInfo} / ${medInfo}` },
        { label: "보호자 전달사항", value: "가정에서도 오늘 활동 이야기 나누어 주시며 편안한 휴식을 취하실 수 있도록 함께해 주시기 바랍니다." }
      ]
    };
  }
};
