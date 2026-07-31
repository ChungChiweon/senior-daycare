import { ContentStudio } from "@/components/content/content-studio";

export default function NewsletterPage() {
  return (
    <ContentStudio
      type="newsletter"
      description="급여제공기록지 및 월간 가정통신문 초안을 사회복지사 서식에 맞게 생성합니다."
      placeholders={["급여제공기록", "월간 소식지", "건강관리 가이드"]}
    />
  );
}
