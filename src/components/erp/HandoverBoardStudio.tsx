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
  const [cards, setCards] = useState<HandoverCard[]>([]);

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
      requestedAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      dueDate: "당일 하원 전",
      status: "unconfirmed",
      comments: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          actorName: card.authorName,
          actorRole: "field_staff",
          actionType: "created",
          toStatus: "unconfirmed",
          note: "현장 인수인계 보드에서 원클릭 업무 요청 전환 생성됨",
          timestamp: new Date().toLocaleString("ko-KR")
        }
      ]
    };

    localTaskRepository.saveTask(newTask);
    setConvertedIds((prev) => [...prev, card.id]);
    setNotification(
      `⚡ [${card.residentName} 어르신] 전달사항이 협업 센터 업무 요청(${newTask.requestId})으로 발행되었습니다!`
    );

    setTimeout(() => {
      setNotification("");
    }, 4000);
  }

  function getStatusBadge(status: HandoverCard["status"]) {
    switch (status) {
      case "unconfirmed":
        return <Badge className="bg-amber-100 text-amber-800 font-bold text-[10px]">미확인</Badge>;
      case "in_progress":
        return <Badge className="bg-sky-100 text-sky-800 font-bold text-[10px]">조치 진행중</Badge>;
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800 font-bold text-[10px]">조치 완료</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-700 font-bold text-[10px]">확인됨</Badge>;
    }
  }

  return (
    <div className="space-y-5 text-xs">
      {/* Top Banner */}
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
      {/* Handover Cards Stream or Empty State */}
      {cards.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-1">
            <Smartphone size={28} />
          </div>
          <h3 className="text-base font-black text-slate-900">등록된 현장 인수인계 전달사항이 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            가상 어르신 케어 관찰 중 특이사항이 발생하면 교대 현장 인수인계 카드가 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {cards.map((card) => {
            const isConverted = convertedIds.includes(card.id);
            return (
              <div
                key={card.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3 hover:border-amber-300 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">
                      👤 {card.residentName} 어르신
                    </span>
                    {getStatusBadge(card.status)}
                  </div>
                  <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <Clock size={12} /> {card.timeStr} (작성: {card.authorName})
                  </span>
                </div>
                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <Button
                    onClick={() => handleConvertToTask(card)}
                    disabled={isConverted}
                    className="font-black text-xs h-8 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <Zap size={14} className="mr-1" />
                    <span>{isConverted ? "✅ 업무 요청 전환 완료" : "⚡ 업무 요청으로 전환"}</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
