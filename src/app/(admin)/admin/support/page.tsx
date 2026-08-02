"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, LifeBuoy, MessageSquare, Search, ShieldCheck, UserCheck } from "lucide-react";

type SupportTicket = {
  id: string;
  orgName: string;
  requesterName: string;
  title: string;
  priority: "high" | "normal" | "low";
  assignee: string;
  status: "received" | "reviewing" | "in_progress" | "completed";
  response?: string;
  createdAt: string;
};

export default function SuperAdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: "sup-01",
      orgName: "행복주간보호센터 A",
      requesterName: "김철수 시설장",
      title: "급여제공기록지 직인 도장 이미지 등록 및 서명 서식 가이드 요청",
      priority: "high",
      assignee: "CS팀 최기술",
      status: "completed",
      response: "시설장 설정 메뉴에서 센터 직인 이미지 PNG 업로드 가이드를 제공하고 연동 완료해드렸습니다.",
      createdAt: "2026-08-01 11:30"
    },
    {
      id: "sup-02",
      orgName: "행복주간보호센터 B",
      requesterName: "이강남 원장님",
      title: "어르신 20명 CSV 명부 파일 일괄 업로드 매핑 오류 문의",
      priority: "high",
      assignee: "SaaS운영 박지원",
      status: "in_progress",
      response: "생년월일 날짜 포맷(YYYY-MM-DD) 유효성 원인 파악 중입니다.",
      createdAt: "2026-08-01 14:10"
    }
  ]);

  function updateTicketStatus(id: string, status: SupportTicket["status"]) {
    setTickets(
      tickets.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  function getStatusBadge(status: SupportTicket["status"]) {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-900 font-bold">🟢 처리 완료</Badge>;
      case "in_progress":
        return <Badge className="bg-sky-100 text-sky-900 font-bold">🔵 처리 진행중</Badge>;
      case "reviewing":
        return <Badge className="bg-amber-100 text-amber-900 font-bold">🟠 내용 확인중</Badge>;
      case "received":
        return <Badge className="bg-slate-100 text-slate-900 font-bold">⚪ 접수 완료</Badge>;
    }
  }

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
              👑 Super-Admin Support Log
            </Badge>
            <span className="text-xs font-semibold text-slate-500">고객 지원 관제 센터</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <LifeBuoy size={24} className="text-sky-600" /> 주간보호센터 문의 및 기술 지원 관제 (`/admin/support`)
          </h1>
        </div>
      </div>

      {/* Tickets List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-black text-slate-900 text-sm">
            고객 센터 문의 접수 및 처리 현황 ({tickets.length}건)
          </span>
        </div>

        <div className="space-y-3">
          {tickets.map((tk) => (
            <div key={tk.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3 hover:bg-white transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-100 text-indigo-900 font-bold text-[10px]">{tk.orgName}</Badge>
                  <span className="font-black text-slate-900 text-xs">{tk.requesterName}</span>
                  {getStatusBadge(tk.status)}
                </div>
                <span className="text-[10px] text-slate-400 font-medium">담당자: {tk.assignee} | 접수일: {tk.createdAt}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-black text-slate-900 text-xs">{tk.title}</h3>
                {tk.response && (
                  <div className="rounded-lg bg-sky-50 border border-sky-100 p-2.5 text-sky-950 font-medium leading-relaxed">
                    💬 <strong>운영진 답변:</strong> {tk.response}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  onClick={() => updateTicketStatus(tk.id, "in_progress")}
                  variant="secondary"
                  className="font-bold text-[11px] h-7 px-2.5"
                >
                  처리중 전환
                </Button>
                <Button
                  onClick={() => updateTicketStatus(tk.id, "completed")}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] h-7 px-2.5"
                >
                  처리 완료 처리
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
