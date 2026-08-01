"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  MessageSquare,
  Smartphone,
  Sparkles,
  Truck,
  UserCheck,
  Zap
} from "lucide-react";
import type { RecordBlock } from "@/types/record-block";
import type { FieldRecord } from "@/components/content/MobileFieldLogger";
import type { ErpTask } from "@/types/erp-task";

export type TimelineEvent = {
  id: string;
  timeStr: string;
  title: string;
  category: "송영" | "바이탈" | "프로그램" | "식사" | "보호자" | "외근" | "조치";
  authorName: string;
  authorRole: string;
  detailText: string;
  sourceBlockId?: string;
  sourceBlockTitle?: string;
  relatedDocTitle?: string;
};

type Props = {
  residentName: string;
  residentId?: string;
  blocks?: RecordBlock[];
  fieldRecords?: FieldRecord[];
  tasks?: ErpTask[];
};

export function ResidentTimeline({
  residentName,
  residentId = "res-01",
  blocks = [],
  fieldRecords = [],
  tasks = []
}: Props) {
  // Built chronological events
  const events: TimelineEvent[] = useMemo(() => {
    const list: TimelineEvent[] = [
      {
        id: "evt-1",
        timeStr: "08:30",
        title: "송영 등원 완료",
        category: "송영",
        authorName: "김운전 기사님",
        authorRole: "운전원",
        detailText: "1호차 안전 등원 완료. 어르신 기분 활기차며 체온 36.5℃ 측정.",
        sourceBlockId: "blk-001",
        sourceBlockTitle: "출결 및 송영 기록"
      },
      {
        id: "evt-2",
        timeStr: "09:10",
        title: "아침 바이탈 & 건강 측정",
        category: "바이탈",
        authorName: "이간호 간호조무사",
        authorRole: "간호인력",
        detailText: "혈압 120/80 mmHg, 혈당 110 mg/dL (정상 범주 확인).",
        sourceBlockId: "blk-002",
        sourceBlockTitle: "건강 및 바이탈 블록",
        relatedDocTitle: "8. 건강·투약·바이탈 보고서"
      },
      {
        id: "evt-3",
        timeStr: "10:30",
        title: "오전 뇌자극 인지 칠교 프로그램",
        category: "프로그램",
        authorName: "박지영 사회복지사",
        authorRole: "사회복지사",
        detailText: "칠교 도형 맞추기 모범 수행. 집중도 상, 만족도 높음.",
        sourceBlockId: "blk-003",
        sourceBlockTitle: "공통 프로그램 참여 블록",
        relatedDocTitle: "1. 보호자 일일 알림장"
      },
      {
        id: "evt-4",
        timeStr: "12:20",
        title: "점심 식사 케어 (전량 섭취)",
        category: "식사",
        authorName: "김송영 요양보호사",
        authorRole: "요양보호사",
        detailText: "일반식 전량 드셨으며 수분 200ml 섭취. 식후 처방약 정량 투약 완료.",
        sourceBlockId: "blk-004",
        sourceBlockTitle: "식사 및 수분 섭취 블록",
        relatedDocTitle: "6. 장기요양급여 제공기록"
      },
      {
        id: "evt-5",
        timeStr: "14:15",
        title: "행복종합병원 정기검진 외근 동행",
        category: "외근",
        authorName: "박지영 사회복지사",
        authorRole: "사회복지사",
        detailText: "혈압/당뇨 정기검진 동행. 진료 소견 양호하며 수령약 간호팀 전달 완료.",
        sourceBlockId: "field-1",
        sourceBlockTitle: "모바일 외근 케어 블록"
      },
      {
        id: "evt-6",
        timeStr: "14:40",
        title: "보호자 무릎 온찜질 요청 접수",
        category: "보호자",
        authorName: "박지영 사회복지사",
        authorRole: "사회복지사",
        detailText: "보호자 전화 상담: 무릎 불편감 언급하여 온찜질 지원 케어 요청 접수.",
        sourceBlockId: "blk-010",
        sourceBlockTitle: "보호자 소통 및 특이사항"
      },
      {
        id: "evt-7",
        timeStr: "15:15",
        title: "물리치료실 무릎 온찜질 15분 조치 완료",
        category: "조치",
        authorName: "이간호 간호조무사",
        authorRole: "간호인력",
        detailText: "무릎 적외선 온찜질 15분 제공 완료. 어르신 시원하시다며 호전 반응.",
        sourceBlockId: "blk-011",
        sourceBlockTitle: "케어 조치 결과 블록",
        relatedDocTitle: "1. 보호자 일일 알림장"
      }
    ];

    return list;
  }, []);

  function getCategoryBadge(cat: TimelineEvent["category"]) {
    switch (cat) {
      case "송영":
        return <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-bold">🚍 송영</Badge>;
      case "바이탈":
        return <Badge className="bg-rose-100 text-rose-900 border-rose-300 font-bold">🩺 바이탈</Badge>;
      case "프로그램":
        return <Badge className="bg-indigo-100 text-indigo-900 border-indigo-300 font-bold">🎨 프로그램</Badge>;
      case "식사":
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold">🍚 식사/투약</Badge>;
      case "보호자":
        return <Badge className="bg-purple-100 text-purple-900 border-purple-300 font-bold">💬 보호자</Badge>;
      case "외근":
        return <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">📱 외근</Badge>;
      case "조치":
        return <Badge className="bg-teal-100 text-teal-900 border-teal-300 font-bold">✅ 조치완료</Badge>;
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-extrabold text-sm text-slate-900">
              ⏱️ {residentName} 어르신 통합 하루 타임라인
            </span>
            <Badge className="bg-sky-600 text-white font-bold text-[10px]">ERP 실시간 연결</Badge>
          </div>
          <p className="text-[11px] text-slate-500">
            송영 ➔ 바이탈 ➔ 프로그램 ➔ 식사 ➔ 외근 ➔ 보호자 요청 ➔ 케어 조치가 모두 원본 RecordBlock과 20종 문서로 자동 연결됩니다.
          </p>
        </div>
        <span className="text-[11px] font-bold text-slate-400">총 {events.length}개 케어 이력</span>
      </div>

      {/* Chronological Timeline Stream */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((evt) => (
          <div key={evt.id} className="relative group">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-sky-500 shadow-xs group-hover:scale-125 transition-transform" />

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-1.5 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1">
                    <Clock size={12} className="text-sky-600" /> {evt.timeStr}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{evt.title}</span>
                  {getCategoryBadge(evt.category)}
                </div>
                <span className="text-[10px] text-slate-400 font-bold">
                  작성자: {evt.authorName} ({evt.authorRole})
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-normal">
                {evt.detailText}
              </p>

              {/* Connected Source RecordBlock & Generated Document Links */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-[10px]">
                {evt.sourceBlockTitle && (
                  <span className="bg-amber-100/70 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1">
                    <Zap size={10} /> 원본 RecordBlock: {evt.sourceBlockTitle}
                  </span>
                )}

                {evt.relatedDocTitle && (
                  <span className="bg-purple-100/70 text-purple-900 font-bold px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                    <FileText size={10} /> 연관 20종 문서: {evt.relatedDocTitle}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
