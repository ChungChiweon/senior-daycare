import { HandoverBoardStudio } from "@/components/erp/HandoverBoardStudio";

export const metadata = {
  title: "현장 인수인계 보드 | 주간보호 ERP",
  description: "요양보호사, 간호사, 사회복지사 현장 교대 전달사항 및 1-Tap 업무 요청 전환"
};

export default function HandoverPage() {
  return <HandoverBoardStudio />;
}
