"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Award,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  FileText,
  Filter,
  MessageSquare,
  Sparkles,
  Truck,
  UserCheck,
  Users,
  Zap
} from "lucide-react";
import { localTaskRepository } from "@/lib/repository/local-task-repository";
import type { ErpTask } from "@/types/erp-task";

export type CalendarEventType =
  | "shuttle" // 송영
  | "program" // 프로그램
  | "counseling" // 보호자/상담
  | "task_deadline" // 업무요청 마감
  | "compliance" // 평가/점검
  | "approval"; // 서류 결재

export type CalendarEvent = {
  id: string;
  type: CalendarEventType;
  title: string;
  dateStr: string;
  timeStr: string;
  assigneeName: string;
  residentName?: string;
  relatedDocTitle?: string;
  statusLabel: string;
  detailText: string;
};

export function OperationCalendarStudio() {
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("month");
  const [selectedFilter, setSelectedFilter] = useState<"all" | CalendarEventType>("all");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [tasks, setTasks] = useState<ErpTask[]>([]);

  useEffect(() => {
    setTasks(localTaskRepository.getTasks());
  }, []);

  // Built Calendar Events merging static center schedule + dynamic ErpTask deadlines
  const events: CalendarEvent[] = useMemo(() => {
    const list: CalendarEvent[] = [
      {
        id: "cal-1",
        type: "shuttle",
        title: "1호차/2호차 아침 등원 송영 운행",
        dateStr: "2026-08-01",
        timeStr: "08:30 ~ 09:30",
        assigneeName: "김운전 기사님",
        statusLabel: "완료 (18명 등원)",
        detailText: "강남/역삼 노선 18명 안전 탑승 및 체온 측정이 완료되었습니다."
      },
      {
        id: "cal-2",
        type: "program",
        title: "오전 뇌자극 칠교 인지 재활 프로그램",
        dateStr: "2026-08-01",
        timeStr: "10:30 ~ 11:30",
        assigneeName: "박지영 사회복지사",
        residentName: "김순자 어르신 외 17명",
        relatedDocTitle: "1. 보호자 일일 알림장",
        statusLabel: "완료",
        detailText: "어르신 집중도 높음. 프로그램 수행 사진 촬영 완료."
      },
      {
        id: "cal-3",
        type: "counseling",
        title: "김순자 어르신 주보호자 내방 및 등급상담",
        dateStr: "2026-08-01",
        timeStr: "14:00 ~ 14:40",
        assigneeName: "박지영 사회복지사",
        residentName: "김순자 어르신",
        statusLabel: "예정",
        detailText: "가정 내 야간 보행 케어 및 무릎 온찜질 지원 관련 내방 상담."
      },
      {
        id: "cal-4",
        type: "compliance",
        title: "건보공단 주간보호 소방안전대피 훈련 점검",
        dateStr: "2026-08-01",
        timeStr: "15:30 ~ 16:30",
        assigneeName: "최사무 행정주임",
        relatedDocTitle: "15. 시설 안전 및 대피 훈련 보고서",
        statusLabel: "진행중",
        detailText: "수급자 비상대피 참가자 명부 및 서명 확인 점검."
      },
      {
        id: "cal-5",
        type: "approval",
        title: "7월 장기요양급여 제공기록지 센터장 전자 결재 마감",
        dateStr: "2026-08-01",
        timeStr: "17:00 마감",
        assigneeName: "김철수 센터장",
        relatedDocTitle: "6. 장기요양급여 제공기록 문안",
        statusLabel: "결재대기 (3건)",
        detailText: "18명 전체 수급자 제공기록지 최종 서명 및 공단 전송 준비."
      }
    ];

    // Merge tasks that have due dates
    tasks.forEach((t) => {
      list.push({
        id: `cal-task-${t.requestId}`,
        type: "task_deadline",
        title: `[업무 마감] ${t.title}`,
        dateStr: t.dueDate.slice(0, 10),
        timeStr: t.dueDate.slice(11) || "17:00",
        assigneeName: t.assigneeName,
        residentName: t.residentName,
        relatedDocTitle: t.relatedDocTitle,
        statusLabel: t.status === "completed" ? "완료됨" : "진행중",
        detailText: t.content
      });
    });

    return list;
  }, [tasks]);

  const filteredEvents = useMemo(() => {
    if (selectedFilter === "all") return events;
    return events.filter((e) => e.type === selectedFilter);
  }, [events, selectedFilter]);

  function getTypeBadge(type: CalendarEventType) {
    switch (type) {
      case "shuttle":
        return <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-bold">🚍 송영</Badge>;
      case "program":
        return <Badge className="bg-indigo-100 text-indigo-900 border-indigo-300 font-bold">🎨 프로그램</Badge>;
      case "counseling":
        return <Badge className="bg-purple-100 text-purple-900 border-purple-300 font-bold">💬 상담/내방</Badge>;
      case "task_deadline":
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold">⚡ 업무 마감</Badge>;
      case "compliance":
        return <Badge className="bg-rose-100 text-rose-900 border-rose-300 font-bold">🏆 평가/점검</Badge>;
      case "approval":
        return <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">✍️ 결재 마감</Badge>;
    }
  }

  return (
    <div className="space-y-4 text-xs">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
                센터 통합 일정 허브
              </Badge>
              <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
                업무 마감 자동 연동
              </Badge>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <CalendarIcon size={22} className="text-sky-400" /> 주간보호 센터 운영 캘린더 (`/calendar`)
            </h1>
            <p className="text-xs text-sky-100 mt-0.5">
              프로그램, 상담 내방, 송영, 서류 결재 마감, 평가 준비, 협업 업무 마감일을 한곳에서 종합 모니터링합니다.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 backdrop-blur-xs">
            {[
              ["day", "오늘 일정"],
              ["week", "주간 뷰"],
              ["month", "월간 뷰"]
            ].map(([v, label]) => (
              <button
                key={v}
                type="button"
                onClick={() => setViewMode(v as "day" | "week" | "month")}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                  viewMode === v
                    ? "bg-sky-500 text-white shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-1.5 border-b border-slate-200 pb-2">
        {[
          ["all", "전체 일정"],
          ["program", "🎨 프로그램"],
          ["counseling", "💬 상담/내방"],
          ["task_deadline", "⚡ 업무 마감"],
          ["shuttle", "🚍 송영"],
          ["compliance", "🏆 평가점검"],
          ["approval", "✍️ 서류결재"]
        ].map(([fKey, label]) => (
          <button
            key={fKey}
            type="button"
            onClick={() => setSelectedFilter(fKey as "all" | CalendarEventType)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition ${
              selectedFilter === fKey
                ? "bg-sky-600 text-white shadow-2xs"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Calendar Main Grid / Event Stream */}
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Left: Schedule Feed List */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-black text-slate-900 text-sm">
              📅 2026년 8월 센터 운영 일정 목록 ({filteredEvents.length}건)
            </span>
            <span className="text-[11px] text-slate-400 font-bold">2026-08-01 (토) 기준</span>
          </div>

          <div className="space-y-2.5">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                      <Clock size={13} className="text-sky-600" /> {evt.timeStr}
                    </span>
                    {getTypeBadge(evt.type)}
                  </div>
                  <Badge className="bg-slate-200 text-slate-800 font-bold">
                    {evt.statusLabel}
                  </Badge>
                </div>

                <h3 className="font-extrabold text-slate-900 text-xs leading-snug">{evt.title}</h3>

                <p className="text-[11px] text-slate-600 line-clamp-2">{evt.detailText}</p>

                <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-[10px] text-slate-500 font-medium">
                  <span>담당자: <strong className="text-slate-800">{evt.assigneeName}</strong></span>
                  {evt.residentName && (
                    <span className="text-sky-800 font-bold">👤 {evt.residentName}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Event Details Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
          <span className="font-black text-slate-900 text-xs block border-b border-slate-100 pb-2">
            🔍 일정 상세 및 연동 업무
          </span>

          {selectedEvent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {getTypeBadge(selectedEvent.type)}
                <span className="text-[10px] text-slate-400 font-mono">{selectedEvent.dateStr}</span>
              </div>

              <h2 className="font-black text-slate-900 text-sm leading-snug">
                {selectedEvent.title}
              </h2>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">운행/진행 시간</span>
                  <span className="font-bold text-slate-800">{selectedEvent.timeStr}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px]">담당자</span>
                  <span className="font-bold text-slate-800">{selectedEvent.assigneeName}</span>
                </div>
                {selectedEvent.residentName && (
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">관련 어르신</span>
                    <span className="font-bold text-sky-800">{selectedEvent.residentName}</span>
                  </div>
                )}
                {selectedEvent.relatedDocTitle && (
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">연관 20종 문서</span>
                    <span className="font-bold text-purple-800">{selectedEvent.relatedDocTitle}</span>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                <span className="font-bold text-slate-700 block text-[11px] mb-1">📋 상세 내용</span>
                <p className="text-xs text-slate-800 leading-relaxed font-normal">
                  {selectedEvent.detailText}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              왼쪽 일정 항목을 클릭하면 상세 연동 정보가 표시됩니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
