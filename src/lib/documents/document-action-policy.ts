import type { DocumentAction } from "@/types/document-template";

export type ActionConfig = {
  action: DocumentAction;
  label: string;
  buttonClass: string;
  iconName: string;
  confirmMessage: string;
};

export const ACTION_POLICY_MAP: Record<DocumentAction, ActionConfig> = {
  save: {
    action: "save",
    label: "내부에 저장",
    buttonClass: "bg-emerald-600 hover:bg-emerald-700 text-white font-bold",
    iconName: "Save",
    confirmMessage: "문서가 영구 저장소(silvercare.documentVersions)에 저장되었습니다."
  },
  send_kakao: {
    action: "send_kakao",
    label: "카카오 알림톡 발송",
    buttonClass: "bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold",
    iconName: "Send",
    confirmMessage: "보호자님 카카오 알림톡 채널로 문안이 발송되었습니다."
  },
  send_sms: {
    action: "send_sms",
    label: "문자 (SMS/LMS) 발송",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white font-bold",
    iconName: "MessageSquare",
    confirmMessage: "보호자님 핸드폰 단문 SMS 문자 메시지로 발송되었습니다."
  },
  export_pdf: {
    action: "export_pdf",
    label: "PDF 서식 출력",
    buttonClass: "bg-sky-600 hover:bg-sky-700 text-white font-bold",
    iconName: "Printer",
    confirmMessage: "실제 A4 서식 PDF 문서 다운로드가 시작되었습니다."
  },
  export_hwpx: {
    action: "export_hwpx",
    label: "HWPX 다운로드",
    buttonClass: "bg-blue-600 hover:bg-blue-700 text-white font-bold",
    iconName: "FileCode",
    confirmMessage: "한글 HWPX 서식 다운로드가 실행되었습니다."
  },
  publish: {
    action: "publish",
    label: "홍보 채널 게시",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold",
    iconName: "Share2",
    confirmMessage: "공식 마케팅/홍보 채널에 포스팅 게시물로 제출되었습니다."
  }
};

export function getActionConfig(action: DocumentAction): ActionConfig {
  return (
    ACTION_POLICY_MAP[action] || {
      action,
      label: action,
      buttonClass: "bg-slate-700 text-white font-bold",
      iconName: "Check",
      confirmMessage: "액션이 완료되었습니다."
    }
  );
}
