"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Send,
  Sparkles,
  UserCheck,
  Zap
} from "lucide-react";
import type { ErpRole } from "@/types/erp-task";

type FeedbackItem = {
  id: string;
  orgName: string;
  userName: string;
  userRole: string;
  screen: string;
  type: "bug" | "inconvenience" | "improvement" | "feature_request" | "other";
  typeLabel: string;
  content: string;
  status: "received" | "reviewing" | "resolved";
  createdAt: string;
};

export default function BetaFeedbackPage() {
  const [screen, setScreen] = useState("오늘의 케어 / AI 문서 생성");
  const [type, setType] = useState<FeedbackItem["type"]>("improvement");
  const [content, setContent] = useState("");
  const [notification, setNotification] = useState("");

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: "fb-101",
      orgName: "행복주간보호센터 A",
      userName: "박지영 사회복지사",
      userRole: "social_worker",
      screen: "오늘의 케어 입력",
      type: "improvement",
      typeLabel: "기능 개선",
      content: "어르신 식사 섭취량 선택 시 1-Tap 터치 반응 속도를 조금 더 빠르게 개선해주시면 감사하겠습니다.",
      status: "resolved",
      createdAt: "2026-08-01 16:20"
    },
    {
      id: "fb-102",
      orgName: "행복주간보호센터 A",
      userName: "이간호 간호조무사",
      userRole: "nurse",
      screen: "바이탈 입력",
      type: "feature_request",
      typeLabel: "신규 기능 요청",
      content: "혈압 수치 입력 시 저혈압(90 이하) 자동 경보 팝업이 뜨는 기능이 추가되면 좋겠습니다.",
      status: "reviewing",
      createdAt: "2026-08-01 17:40"
    }
  ]);

  function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!content) return;

    const typeLabels: Record<FeedbackItem["type"], string> = {
      bug: "시스템 오류",
      inconvenience: "사용 불편",
      improvement: "기능 개선",
      feature_request: "신규 요청",
      other: "기타 의견"
    };

    const newFb: FeedbackItem = {
      id: `fb-${Date.now()}`,
      orgName: "행복주간보호센터 A",
      userName: "박지영 사회복지사",
      userRole: "social_worker",
      screen,
      type,
      typeLabel: typeLabels[type],
      content,
      status: "received",
      createdAt: new Date().toLocaleString("ko-KR")
    };

    setFeedbacks([newFb, ...feedbacks]);
    setContent("");
    setNotification("💌 현장 종사자 피드백이 개발 및 서비스 운영진에게 성공적으로 전달되었습니다!");
    setTimeout(() => setNotification(""), 4000);
  }

  function getStatusBadge(status: FeedbackItem["status"]) {
    switch (status) {
      case "resolved":
        return <Badge className="bg-emerald-100 text-emerald-900 font-bold">🟢 답변 및 개선 완료</Badge>;
      case "reviewing":
        return <Badge className="bg-sky-100 text-sky-900 font-bold">🔵 담당자 검토중</Badge>;
      case "received":
        return <Badge className="bg-amber-100 text-amber-900 font-bold">🟠 접수 완료</Badge>;
    }
  }

  return (
    <div className="space-y-6 text-xs max-w-4xl mx-auto py-4">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
            💬 현장 목소리 수집
          </Badge>
          <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
            베타 핫라인
          </Badge>
        </div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <MessageSquare size={22} className="text-sky-400" /> 주간보호 센터 현장 종사자 피드백 (`/feedback`)
        </h1>
        <p className="text-xs text-sky-100 mt-0.5">
          실제 업무 중 느끼신 시스템 오류, 사용 불편 및 아이디어를 남겨주시면 24시간 내 답변 및 서비스 반영 결과를 확인하실 수 있습니다.
        </p>
      </div>

      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-bold text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmitFeedback} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Send size={16} className="text-sky-600" /> 현장 개선 의견 및 피드백 작성
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">관련 화면 / 기능</label>
            <input
              type="text"
              required
              value={screen}
              onChange={(e) => setScreen(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              placeholder="예: 오늘의 케어 / AI 문서 생성"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">의견 유형</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
            >
              <option value="improvement">기능 개선 (추천)</option>
              <option value="inconvenience">사용 불편</option>
              <option value="bug">시스템 오류 버그</option>
              <option value="feature_request">신규 기능 요청</option>
              <option value="other">기타 문의사항</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-extrabold text-slate-700 block text-[11px]">상세 의견 내용</label>
          <textarea
            rows={3}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
            placeholder="현장에서 사용하며 발생한 구체적인 내용 및 아이디어를 자유롭게 작성해주세요..."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-9 px-5 flex items-center gap-1.5 shadow-xs">
            <Send size={14} />
            <span>피드백 즉시 제출하기</span>
          </Button>
        </div>
      </form>

      {/* Submitted History */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-black text-slate-900 text-sm">
            등록된 피드백 및 개발진 답변 이력 ({feedbacks.length}건)
          </span>
        </div>

        <div className="space-y-3">
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2 hover:bg-white transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-900 font-bold text-[10px]">{fb.typeLabel}</Badge>
                  <span className="font-black text-slate-900 text-xs">{fb.userName}</span>
                  <span className="text-[11px] text-slate-500 font-medium">({fb.screen})</span>
                </div>
                {getStatusBadge(fb.status)}
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                "{fb.content}"
              </p>

              <span className="text-[10px] text-slate-400 font-medium block text-right">
                작성일: {fb.createdAt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
