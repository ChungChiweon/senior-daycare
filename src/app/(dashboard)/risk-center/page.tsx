"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck,
  Heart,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Zap
} from "lucide-react";

export default function RiskCenterPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "red" | "orange" | "yellow">("all");
  const [processedIds, setProcessedIds] = useState<string[]>([]);
  const [riskItems, setRiskItems] = useState<any[]>([]);

  function handleQuickProcess(id: string, title: string) {
    setProcessedIds((prev) => [...prev, id]);
  }

  const filteredItems = riskItems.filter((item) => {
    if (processedIds.includes(item.id)) return false;
    if (selectedCategory === "all") return true;
    return item.severity === selectedCategory;
  });

  const redCount = riskItems.filter((i) => i.severity === "red" && !processedIds.includes(i.id)).length;
  const orangeCount = riskItems.filter((i) => i.severity === "orange" && !processedIds.includes(i.id)).length;
  const yellowCount = riskItems.filter((i) => i.severity === "yellow" && !processedIds.includes(i.id)).length;

  return (
    <div className="space-y-5 text-xs">
      {/* 🚀 Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 p-5 text-white shadow-lg space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-red-500/20 text-red-200 border-red-300/30 text-xs font-bold">
                시설장 핵심 가치 모듈
              </Badge>
              <Badge className="bg-amber-500/20 text-amber-200 border-amber-300/30 text-xs font-bold">
                실시간 운영 감지
              </Badge>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              <ShieldAlert size={22} className="text-red-400" /> 주간보호 운영 리스크 센터 (`/risk-center`)
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              건강 미완료, 특이사항 미조치, 결재 대기, 평가 누락을 실시간 감지하고 원클릭으로 해당 처리 화면으로 이동합니다.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-xs">
            <div className="text-center px-2 border-r border-white/20">
              <span className="text-[10px] text-red-300 font-bold block">🔴 긴급</span>
              <span className="text-lg font-black text-white">{redCount}건</span>
            </div>
            <div className="text-center px-2 border-r border-white/20">
              <span className="text-[10px] text-amber-300 font-bold block">🟠 주의</span>
              <span className="text-lg font-black text-white">{orangeCount}건</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-yellow-300 font-bold block">🟡 점검</span>
              <span className="text-lg font-black text-white">{yellowCount}건</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-1.5">
          {[
            ["all", `전체 리스크 (${filteredItems.length}건)`],
            ["red", `🔴 긴급 확인 (${redCount}건)`],
            ["orange", `🟠 주의/지연 (${orangeCount}건)`],
            ["yellow", `🟡 점검/행정 (${yellowCount}건)`]
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedCategory(key as "all" | "red" | "orange" | "yellow")}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition ${
                selectedCategory === key
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Feed Cards or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-1">
            <CheckCircle2 size={28} />
          </div>
          <h3 className="text-base font-black text-slate-900">현재 감지된 운영 리스크가 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            가상 어르신을 등록하고 일일 케어 또는 업무 요청을 생성하면 결재 지연이나 바이탈 누락 등이 실시간으로 자동 감지됩니다.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filteredItems.map((item) => {
            const isRed = item.severity === "red";
            const isOrange = item.severity === "orange";

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 space-y-3 transition-all shadow-2xs hover:shadow-md ${
                  isRed
                    ? "border-red-300 bg-red-50/40"
                    : isOrange
                    ? "border-amber-300 bg-amber-50/40"
                    : "border-yellow-300 bg-yellow-50/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] text-slate-900">{item.categoryLabel}</span>
                  <span className="text-[10px] font-bold text-slate-500">담당: {item.assigneeName}</span>
                </div>

                <div>
                  <h3 className="font-black text-slate-900 text-sm leading-snug">{item.title}</h3>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed font-normal">{item.desc}</p>
                </div>

                {item.residentName && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-sky-800">
                    <span>👤 관련 수급자:</span>
                    <span>{item.residentName}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <Button
                    variant="secondary"
                    onClick={() => handleQuickProcess(item.id, item.title)}
                    className="bg-white text-slate-700 hover:bg-slate-100 font-bold text-xs h-8"
                  >
                    <CheckCircle2 size={14} className="text-emerald-600 mr-1" /> 임시 세이프 처리
                  </Button>

                  <Link href={item.actionHref}>
                    <Button
                      className={`font-black text-xs h-8 flex items-center gap-1 shadow-xs ${
                        isRed
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : isOrange
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight size={13} />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
