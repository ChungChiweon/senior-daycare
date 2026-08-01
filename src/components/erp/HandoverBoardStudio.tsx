"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  MessageSquare,
  Plus,
  ShieldAlert,
  Smartphone,
  Sparkles,
  UserCheck,
  Zap
} from "lucide-react";
import { localTaskRepository } from "@/lib/repository/local-task-repository";
import type { ErpTask } from "@/types/erp-task";

export type HandoverCard = {
  id: string;
  residentName: string;
  residentId: string;
  authorName: string;
  authorRole: string;
  timeStr: string;
  priority: "urgent" | "high" | "normal";
  status: "unconfirmed" | "confirmed" | "in_progress" | "completed";
  contentBullets: string[];
  followUpAction: string;
  connectedBlockTitle: string;
};

export function HandoverBoardStudio() {
  const [notification, setNotification] = useState("");
  const [convertedIds, setConvertedIds] = useState<string[]>([]);

  const [cards, setCards] = useState<HandoverCard[]>([
    {
      id: "ho-1",
      residentName: "김순자",
      residentId: "res-01",
      authorName: "김송영 요양보호사",
      authorRole: "요양보호사",
      timeStr: "15:45",
      priority: "high",
      status: "unconfirmed",
      contentBullets: [
        "오후 보행 시 무릎 불편감 및 약간의 우측 다리 통증 표현",
        "보호자(이철수) 전화 통화로 무릎 상태 사전 전달 완료",
        "내일 아침 등원 시 보행 상태 및 온찜질 반응 추가 관찰 필요"
      ],
      followUpAction: "간호팀 무릎 적외선 온찜질 처치 및 수급자 상태 관찰",
      connectedBlockTitle: "보호자 소통 및 특이사항 블록"
    },
    {
      id: "ho-2",
      residentName: "박영수",
      residentId: "res-02",
      authorName: "이간호 간호조무사",
      authorRole: "간호인력",
      timeStr: "13:10",
      priority: "urgent",
      status: "in_progress",
      contentBullets: [
        "점심 식후 신규 당뇨 처방약 정상 투약 완료",
        "식후 혈당 125 mg/dL 측정 (정상 범주 확인)",
        "하원 시 보호자분께 약 복용 완료 알림장 문구 기재 요망"
      ],
      followUpAction: "사회복지사 하원 알림장 당뇨약 복용 문구 반영",
      connectedBlockTitle: "건강 및 바이탈 처치 블록"
    },
    {
      id: "ho-3",
      residentName: "이정자",
      residentId: "res-03",
      authorName: "박지영 사회복지사",
      authorRole: "사회복지사",
      timeStr: "11:20",
      priority: "normal",
      status: "confirmed",
      contentBullets: [
        "8월 장기요양 등급 재판정 서류 관련 보호자 통화 완료",
        "오늘 하원 시간에 방문하여 동의 서서명 작성 예정",
        "사무실 서류 양식 준비 필요"
      ],
      followUpAction: "사무원 등급 갱신 본인부담금 서류 수령",
      connectedBlockTitle: "사례관리 및 계약 서류 블록"
    }
  ]);

  // Convert Handover Note directly to an ErpTask!
  function handleConvertToTask(card: HandoverCard) {
    const newTask: ErpTask = {
      requestId: `REQ-HO-${Date.now().toString().slice(-4)}`,
      title: `[인수인계 전환] ${card.residentName} 어르신 ${card.followUpAction}`,
      content: card.contentBullets.map((b) => `• ${b}`).join("\n"),
      requesterName: card.authorName,
      requesterRole: "field_staff",
      assigneeName: "이간호 간호조무사",
      assigneeRole: "nurse",
      residentId: card.residentId,
      residentName: card.residentName,
      taskCategory: "health_care",
      priority: card.priority,
      requestedAt: new Date().toLocaleString("ko-KR"),
      dueDate: "2026-08-01 17:30",
      status: "unconfirmed",
      comments: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          actorName: card.authorName,
          actorRole: "field_staff",
          actionType: "created",
          toStatus: "unconfirmed",
          note: "현장 인수인계 보드에서 업무 요청으로 전환 생성",
          timestamp: new Date().toLocaleString("ko-KR")
        }
      ]
    };

    localTaskRepository.saveTask(newTask);
    setConvertedIds((prev) => [...prev, card.id]);
    setNotification(`⚡ [${card.residentName} 어르신] 전달사항이 협업 업무 요청으로 즉시 전환되었습니다!`);
    setTimeout(() => setNotification(""), 4000);
  }

  function getStatusBadge(status: HandoverCard["status"]) {
    switch (status) {
      case "unconfirmed":
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold">🟠 확인 필요</Badge>;
      case "confirmed":
        return <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-bold">🔵 확인 완료</Badge>;
      case "in_progress":
        return <Badge className="bg-purple-100 text-purple-900 border-purple-300 font-bold">🟣 조치 중</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">🟢 완료</Badge>;
    }
  }

  return (
    <div className="space-y-4 text-xs max-w-4xl mx-auto">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 p-4 sm:p-5 text-white shadow-lg space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-amber-400/20 text-amber-200 border-amber-300/30 text-xs font-bold">
                📱 모바일 현장 최적화
              </Badge>
              <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
                교대 현장 전달사항
              </Badge>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <Smartphone size={22} className="text-amber-400" /> 주간보호 현장 인수인계 보드 (`/handover`)
            </h1>
            <p className="text-xs text-amber-100 mt-0.5">
              요양보호사, 간호사, 사회복지사가 이동 중 스마트폰으로 특이 전달사항을 확인하고 원클릭으로 협업 업무에 전환합니다.
            </p>
          </div>
        </div>
      </div>

      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-extrabold text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Handover Cards Stream */}
      <div className="space-y-3">
        {cards.map((card) => {
          const isConverted = convertedIds.includes(card.id);

          return (
            <div
              key={card.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 hover:border-amber-300 transition-all"
            >
              {/* Card Top Row */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">
                    👤 {card.residentName} 어르신
                  </span>
                  {getStatusBadge(card.status)}
                  {card.priority === "urgent" && (
                    <Badge className="bg-red-500 text-white font-bold animate-pulse">🔴 긴급 전달</Badge>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                  <Clock size={12} /> {card.timeStr} (작성: {card.authorName})
                </span>
              </div>

              {/* Bullets List */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-1.5 text-xs text-slate-800">
                <span className="font-bold text-slate-700 block text-[11px]">📝 주요 전달 내용</span>
                <ul className="space-y-1 pl-1">
                  {card.contentBullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 font-medium leading-relaxed">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Follow Up Action Line */}
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 space-y-0.5">
                <span className="font-extrabold text-amber-950 text-[11px] flex items-center gap-1">
                  <Zap size={13} className="text-amber-600" /> 후속 조치 당부 사항:
                </span>
                <p className="text-xs text-amber-900 font-bold leading-relaxed">
                  {card.followUpAction}
                </p>
              </div>

              {/* Action Buttons: 1-Tap Convert to ErpTask */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  <Zap size={11} className="text-amber-500" /> 연결: {card.connectedBlockTitle}
                </span>

                <div className="flex gap-2">
                  <Link href={`/residents/${card.residentId}`}>
                    <Button variant="secondary" className="font-bold text-xs h-8">
                      이용자 상세 타임라인
                    </Button>
                  </Link>

                  <Button
                    onClick={() => handleConvertToTask(card)}
                    disabled={isConverted}
                    className={`font-black text-xs h-8 flex items-center gap-1 shadow-xs ${
                      isConverted
                        ? "bg-slate-300 text-slate-600"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                  >
                    <Zap size={14} />
                    <span>{isConverted ? "✅ 업무 요청 전환 완료" : "⚡ 업무 요청으로 전환"}</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
