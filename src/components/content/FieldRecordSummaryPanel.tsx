"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Filter,
  MapPin,
  RefreshCw,
  Search,
  Smartphone,
  Sparkles,
  UserCheck
} from "lucide-react";
import type { FieldRecord } from "./MobileFieldLogger";

type Props = {
  fieldRecords: FieldRecord[];
  onApplyToDocs: () => void;
};

export function FieldRecordSummaryPanel({ fieldRecords, onApplyToDocs }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = useMemo(() => {
    return fieldRecords.filter((r) => {
      const matchCat = filterCategory === "all" || r.category === filterCategory;
      const matchSearch =
        r.residentName.includes(searchQuery) ||
        r.location.includes(searchQuery) ||
        r.note.includes(searchQuery);
      return matchCat && matchSearch;
    });
  }, [fieldRecords, filterCategory, searchQuery]);

  // Group by resident name
  const residentGroups = useMemo(() => {
    const map: Record<string, FieldRecord[]> = {};
    filteredRecords.forEach((r) => {
      if (!map[r.residentName]) map[r.residentName] = [];
      map[r.residentName].push(r);
    });
    return map;
  }, [filteredRecords]);

  return (
    <div className="rounded-2xl border border-emerald-300 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-4 text-white shadow-md space-y-3">
      {/* Panel Top Header Bar */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Smartphone size={20} className="text-emerald-400 animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm text-white">
                📱 오늘 외근/현장 복귀 종합 기록 일람
              </h3>
              <Badge className="bg-emerald-400 text-slate-950 font-black text-[10px]">
                {fieldRecords.length}건 접수됨
              </Badge>
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5">
              외근 다녀온 직원들이 모바일에서 입력한 현장 기록을 한눈에 펼쳐보고 20종 문서에 즉시 합성합니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs h-8 px-3 border border-emerald-300"
            onClick={(e) => {
              e.stopPropagation();
              onApplyToDocs();
            }}
          >
            <Sparkles size={14} /> 20종 문서 자동 합성
          </Button>

          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isOpen && (
        <div className="pt-2 border-t border-emerald-800/80 space-y-3 text-xs">
          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-emerald-900">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <Filter size={13} className="text-emerald-400 shrink-0" />
              {[
                ["all", "전체 보기"],
                ["병원동행", "🏥 병원동행"],
                ["야외나들이", "🌳 야외나들이"],
                ["방문케어", "🚗 방문케어"],
                ["장보기", "🛍️ 장보기"]
              ].map(([catKey, label]) => (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setFilterCategory(catKey)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap ${
                    filterCategory === catKey
                      ? "bg-emerald-500 text-slate-950 shadow-xs"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="relative w-44">
              <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="어르신/장소/메모 검색"
                className="h-8 w-full rounded-lg bg-slate-800 border border-slate-700 pl-8 pr-2 text-[11px] text-white outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Grouped Records View */}
          {Object.keys(residentGroups).length > 0 ? (
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {Object.entries(residentGroups).map(([resName, list]) => (
                <div key={resName} className="rounded-xl bg-slate-900/90 border border-emerald-900/60 p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-extrabold text-white text-xs flex items-center gap-1.5">
                      <UserCheck size={14} className="text-emerald-400" /> {resName} 어르신 외근 기록 ({list.length}건)
                    </span>
                    <span className="text-[10px] text-emerald-300/80 font-bold">20종 문서 합성 준비 완료</span>
                  </div>

                  <div className="space-y-1.5">
                    {list.map((rec) => (
                      <div key={rec.id} className="rounded-lg bg-slate-800/80 border border-slate-700/80 p-2.5 space-y-1 text-slate-200">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-300 flex items-center gap-1">
                            <MapPin size={11} /> [{rec.category}] {rec.location} ({rec.timeStr})
                          </span>
                          <span className="text-[10px] text-slate-400">{rec.createdAt.slice(11, 16)}</span>
                        </div>

                        <p className="text-xs text-white leading-relaxed font-normal">{rec.note}</p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-700 text-[10px] text-slate-400">
                          <span>현장 조치: <strong className="text-slate-300">{rec.actionsTaken}</strong></span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 size={11} /> 20종 문서 자동 합성됨
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-6 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">검색 조건에 맞는 외근 기록이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
