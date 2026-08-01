import { OperationCalendarStudio } from "@/components/erp/OperationCalendarStudio";

export const metadata = {
  title: "운영 캘린더 | 주간보호 ERP",
  description: "센터 전체 일정, 송영, 프로그램, 보호자 상담, 서류 결재 및 업무 요청 마감 종합 관리"
};

export default function CalendarPage() {
  return <OperationCalendarStudio />;
}
