"use client";

import { Badge } from "@/components/ui/badge";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Zap
} from "lucide-react";

type Props = {
  residentName: string;
  residentId?: string;
  gradeLabel?: string;
  age?: number;
};

export function ResidentSummaryCard({
  residentName,
  residentId = "res-01",
  gradeLabel = "3등급 (중증/인지케어)",
  age = 83
}: Props) {
  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50/80 via-white to-sky-50/30 p-4 sm:p-5 shadow-sm space-y-4 text-xs">
      {/* Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-sky-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white font-black text-xl shadow-md">
            {residentName.slice(0, 1)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-black text-slate-900">{residentName} 어르신</h2>
              <Badge className="bg-sky-600 text-white font-bold text-[10px]">{gradeLabel}</Badge>
              <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-extrabold text-[10px]">
                🟢 현재 상태: 안정
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              83세 (여) | 장기요양인정번호: L0029384710 | 주간보호 1그룹 담당
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Badge className="bg-white text-slate-700 font-bold border border-slate-200">
            ⚡ 5초 종합 브리핑 카드
          </Badge>
        </div>
      </div>

      {/* 4-Box Key Situation Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Recent Changes */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5 shadow-2xs">
          <span className="font-extrabold text-slate-800 text-[11px] flex items-center gap-1">
            <Activity size={13} className="text-sky-600" /> 최근 주요 변화
          </span>
          <ul className="space-y-1 text-slate-700 font-medium text-[11px]">
            <li className="flex items-center gap-1 text-amber-900 font-bold">
              • 식사량 70% 섭취 (식사 조력 제공)
            </li>
            <li className="flex items-center gap-1">
              • 오늘 14:00 보호자 상담 예정
            </li>
          </ul>
        </div>

        {/* 2. Caution Points */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 space-y-1.5 shadow-2xs">
          <span className="font-extrabold text-amber-950 text-[11px] flex items-center gap-1">
            <AlertTriangle size={13} className="text-amber-600" /> 케어 주의사항
          </span>
          <ul className="space-y-1 text-amber-900 font-bold text-[11px]">
            <li className="flex items-center gap-1">• 보행 및 이동 시 수성 부축 필요</li>
            <li className="flex items-center gap-1">• 무릎 불편감 및 적외선 온찜질 관찰</li>
          </ul>
        </div>

        {/* 3. Recent Tasks */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-3 space-y-1.5 shadow-2xs">
          <span className="font-extrabold text-indigo-950 text-[11px] flex items-center gap-1">
            <Zap size={13} className="text-indigo-600" /> 진행 중인 업무 요청
          </span>
          <ul className="space-y-1 text-indigo-900 font-bold text-[11px]">
            <li className="flex items-center gap-1">• 무릎 온찜질 지원 처리 (간호팀)</li>
            <li className="flex items-center gap-1">• 보호자 일일 알림장 발송 대기</li>
          </ul>
        </div>

        {/* 4. Recent Records */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 space-y-1.5 shadow-2xs">
          <span className="font-extrabold text-emerald-950 text-[11px] flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-600" /> 오늘 완료 케어 기록
          </span>
          <ul className="space-y-1 text-emerald-900 font-bold text-[11px]">
            <li className="flex items-center gap-1">• 08:30 1호차 등원 송영 완료</li>
            <li className="flex items-center gap-1">• 10:30 칠교 뇌자극 인지 참여</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
