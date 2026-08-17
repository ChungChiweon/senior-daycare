"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  MessageSquare,
  Send,
  Sparkles
} from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth-org";
import { useOrganizationProfile } from "@/hooks/use-organization-profile";

type FeedbackCategory = "feature" | "ux" | "workflow" | "trust";

type FeedbackItem = {
  id: string;
  orgName: string;
  userName: string;
  userRole: string;
  category: FeedbackCategory;
  categoryLabel: string;
  screen: string;
  type: "bug" | "inconvenience" | "improvement" | "feature_request" | "other";
  typeLabel: string;
  content: string;
  status: "received" | "reviewing" | "resolved";
  createdAt: string;
};

export default function BetaFeedbackPage() {
  const currentUser = useCurrentUser();
  const orgState = useOrganizationProfile();
  const orgName = orgState.status === "ready" ? orgState.org.name : "소속 기관이 설정되지 않았습니다.";
  const [activeTab, setActiveTab] = useState<"feedback" | "interview">("feedback");
  const [screen, setScreen] = useState("오늘의 케어 / AI 문서 생성");
  const [category, setCategory] = useState<FeedbackCategory>("workflow");
  const [type, setType] = useState<FeedbackItem["type"]>("improvement");
  const [content, setContent] = useState("");
  const [notification, setNotification] = useState("");

  const exitInterviews = [
    {
      roleTitle: "시설장 (관리자) Exit 인터뷰",
      questions: [
        "1. ERP 도입 후 전체 센터 운영 관리 효율성에 도움이 되었습니까?",
        "2. 가장 가치 있다고 느낀 핵심 기능은 무엇입니까? (예: 20종 AI 문서, 1-Tap 서명)",
        "3. 베타 종료 후 월 구독 비용을 지불하고 지속 사용할 의향이 있습니까?"
      ]
    },
    {
      roleTitle: "사회복지사 Exit 인터뷰",
      questions: [
        "1. 20종 AI 문서 생성을 통해 일일 문서 작성 시간이 실제 얼마나 줄었습니까?",
        "2. AI가 동적으로 생성한 문안이 현장 실정에 자연스럽게 부합합니까?",
        "3. 가장 개선이 시급한 화면이나 작업 흐름은 무엇입니까?"
      ]
    },
    {
      roleTitle: "요양보호사 (현장 케어) Exit 인터뷰",
      questions: [
        "1. 모바일 스마트폰 1-Tap 케어 입력이 구두/종이 기록보다 쉬웠습니까?",
        "2. 바쁜 현장 업무 중 스마트폰으로 실시간 접수가 가능했습니까?",
        "3. 현장에서 자주 누락되거나 빠진 기록 항목이 있었습니까?"
      ]
    },
    {
      roleTitle: "사무원 (행정) Exit 인터뷰",
      questions: [
        "1. 장기요양 본인부담금 수납 및 계약서 관리에 도움이 되었습니까?",
        "2. 기존 공단 롱텀(Longterm) 시스템이나 엑셀과의 충돌이 있었습니까?"
      ]
    }
  ];

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    {
      id: "fb-101",
      orgName: "기관 A",
      userName: "박지영 사회복지사",
      userRole: "social_worker",
      category: "workflow",
      categoryLabel: "업무 영향 (Workflow)",
      screen: "오늘의 케어 입력",
      type: "improvement",
      typeLabel: "기능 개선",
      content: "어르신 식사 섭취량 선택 시 1-Tap 터치 반응 속도를 조금 더 빠르게 개선해주시면 감사하겠습니다.",
      status: "resolved",
      createdAt: "2026-08-01 16:20"
    },
    {
      id: "fb-102",
      orgName: "기관 A",
      userName: "이간호 간호조무사",
      userRole: "nurse",
      category: "feature",
      categoryLabel: "기능 (Feature)",
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

    const catLabels: Record<FeedbackCategory, string> = {
      feature: "기능 (Feature)",
      ux: "UX (사용성)",
      workflow: "업무 영향 (Workflow)",
      trust: "신뢰성 (AI Trust)"
    };

    const typeLabels: Record<FeedbackItem["type"], string> = {
      bug: "시스템 오류",
      inconvenience: "사용 불편",
      improvement: "기능 개선",
      feature_request: "신규 요청",
      other: "기타 의견"
    };

    const newFb: FeedbackItem = {
      id: `fb-${Date.now()}`,
      orgName,
      userName: currentUser?.name ? `${currentUser.name} (${currentUser.roleLabel})` : "사회복지사",
      userRole: currentUser?.roleCode || "social_worker",
      category,
      categoryLabel: catLabels[category],
      screen,
      type,
      typeLabel: typeLabels[type],
      content,
      status: "received",
      createdAt: new Date().toLocaleString("ko-KR")
    };

    setFeedbacks([newFb, ...feedbacks]);
    setContent("");
    setNotification("💌 구조화된 현장 피드백이 전송되었습니다!");
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

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <Button
          variant={activeTab === "feedback" ? "primary" : "secondary"}
          onClick={() => setActiveTab("feedback")}
          className="font-bold text-xs h-8 px-3"
        >
          💬 현장 피드백 접수 ({feedbacks.length}건)
        </Button>
        <Button
          variant={activeTab === "interview" ? "primary" : "secondary"}
          onClick={() => setActiveTab("interview")}
          className="font-bold text-xs h-8 px-3"
        >
          📝 4개 직종별 Exit 심층 인터뷰 질문지
        </Button>
      </div>

      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-bold text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {activeTab === "interview" ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 p-5 text-white shadow-xs space-y-2">
            <h2 className="text-sm font-black flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" /> 베타 종료 후 4개 직종별 Exit 인터뷰 표준 템플릿
            </h2>
            <p className="text-xs text-indigo-200">
              파일럿 4주차 운영 평가 단계에서 시설장, 복지사, 요양보호사, 사무원의 현장 체감 가치를 조사하는 질문지입니다.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {exitInterviews.map((ei, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
                <h3 className="font-black text-slate-900 text-xs text-sky-700">{ei.roleTitle}</h3>
                <div className="space-y-1.5 pt-1">
                  {ei.questions.map((q, qIdx) => (
                    <div key={qIdx} className="rounded-xl bg-slate-50 p-2.5 text-[11px] font-medium text-slate-800 border border-slate-100">
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Submission Form */}
          <form onSubmit={handleSubmitFeedback} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-2">
              <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
                <Send size={16} className="text-sky-600" /> 현장 개선 의견 및 피드백 작성
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
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
                <label className="font-extrabold text-slate-700 block text-[11px]">4대 분류</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
                >
                  <option value="workflow">업무 영향 (Workflow)</option>
                  <option value="feature">기능 (Feature)</option>
                  <option value="ux">UX 사용성</option>
                  <option value="trust">신뢰성 (AI Trust)</option>
                </select>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-xs">{fb.userName} ({fb.userRole})</span>
                      <Badge className="bg-slate-100 text-slate-700 text-[10px] font-bold">{fb.orgName}</Badge>
                      <Badge className="bg-slate-200 text-slate-800 text-[10px]">{fb.screen}</Badge>
                      <Badge className="bg-indigo-100 text-indigo-900 text-[10px] font-bold">{fb.categoryLabel}</Badge>
                      <Badge className="bg-sky-100 text-sky-900 text-[10px]">{fb.typeLabel}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(fb.status)}
                      <span className="text-[10px] text-slate-400">{fb.createdAt}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{fb.content}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
