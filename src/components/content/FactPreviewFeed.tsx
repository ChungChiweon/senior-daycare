"use client";

import { Badge } from "@/components/ui/badge";
import type { FieldRecord } from "./MobileFieldLogger";
import { CheckCircle2, MapPin, Smartphone, Sparkles, UserCheck } from "lucide-react";

type Props = {
  residentName: string;
  fieldRecords: FieldRecord[];
  selectedResidentCount: number;
};

export function FactPreviewFeed({ residentName, fieldRecords, selectedResidentCount }: Props) {
  const residentFieldRecords = fieldRecords.filter(
    (r) => r.residentName === residentName || r.residentId === "res-01"
  );

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/50 p-3.5 shadow-2xs space-y-2.5 text-xs">
      <div className="flex items-center justify-between border-b border-sky-100 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-sky-950 text-xs">
          <Sparkles size={15} className="text-sky-600" />
          <span>📌 AI 생성 전 수집된 사실 데이터 피드 ({residentName} 어르신)</span>
        </div>
        <Badge className="bg-sky-600 text-white font-bold text-[10px]">
          20종 문서 자동 반영 준비 완료
        </Badge>
      </div>

      {/* Quick Summary Badges */}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <Badge className="bg-white text-slate-700 font-bold border border-slate-200 flex items-center gap-1">
          <UserCheck size={12} className="text-sky-600" /> 선택 수급자: {selectedResidentCount}명
        </Badge>
        <Badge className="bg-white text-slate-700 font-bold border border-slate-200">
          🏃 공통 프로그램: 오후 뇌자극 칠교놀이
        </Badge>
        <Badge className="bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300 flex items-center gap-1">
          <Smartphone size={12} /> 모바일 외근 기록: {residentFieldRecords.length}건 수집
        </Badge>
      </div>

      {/* Mobile Field Records Feed List */}
      {residentFieldRecords.length > 0 ? (
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-700 block">📱 접수된 외근/현장 케어 기록 (AI 문안에 합성됨):</span>
          {residentFieldRecords.map((rec) => (
            <div key={rec.id} className="rounded-lg bg-white border border-emerald-200 p-2.5 space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-emerald-900 text-xs flex items-center gap-1">
                  <Smartphone size={12} className="text-emerald-600" /> [{rec.category}] {rec.residentName} 어르신 ({rec.timeStr})
                </span>
                <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5">
                  <MapPin size={10} /> {rec.location}
                </span>
              </div>
              <p className="text-xs text-slate-800 font-medium leading-relaxed">{rec.note}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-500 font-semibold">
                <span>조치: {rec.actionsTaken}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <CheckCircle2 size={11} /> 20종 문서 합성 반영됨
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white/70 border border-slate-200 p-2 text-center text-[11px] text-slate-500 font-medium">
          등록된 외근/현장 기록이 없습니다. 모바일에서 외근 기록을 추가하시면 여기에 실시간 수집되어 20종 문서에 자동 합성됩니다.
        </div>
      )}
    </div>
  );
}
