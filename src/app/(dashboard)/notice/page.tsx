import { ContentStudio } from "@/components/content/content-studio";

export default function NoticePage() {
  return (
    <ContentStudio
      type="notice"
      description="어르신의 당일 케어(건강·식사·투약) 및 활동 내용을 바탕으로 보호자용 알림장 문안을 생성합니다."
      placeholders={["실버건강체조", "뇌자극 칠교놀이", "원예치료"]}
    />
  );
}
