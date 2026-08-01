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

  function handleQuickProcess(id: string, title: string) {
    setProcessedIds((prev) => [...prev, id]);
  }

  const riskItems = [
    {
      id: "risk-red-1",
      severity: "red",
      categoryLabel: "🔴 긴급 확인 (건강/바이탈 누락)",
      title: "박영수 어르신 점심 혈당 측정 및 투약 관찰 미완료",
      desc: "신규 당뇨 처방약 변경 수령건. 점심 식후 혈당 측정 이력 미등록 상태입니다.",
      residentName: "박영수 어르신",
      residentId: "res-02",
      assigneeName: "이간호 간호조무사",
      actionLabel: "🩺 혈당/투약 즉시 기록",
      actionHref: "/residents/res-02?tab=health"
    },
    {
      id: "risk-red-2",
      severity: "red",
      categoryLabel: "🔴 긴급 확인 (특이사항 미조치)",
      title: "김순자 어르신 무릎 온찜질 케어 요청 미확인",
      desc: "보호자 전화 요청건(09:30 접수). 오후 온찜질 조치 결과 미등록 상태입니다.",
      residentName: "김순자 어르신",
      residentId: "res-01",
      assigneeName: "이간호 간호조무사",
      actionLabel: "🤝 협업 센터에서 조치 처리",
      actionHref: "/tasks"
    },
    {
      id: "risk-red-3",
      severity: "red",
      categoryLabel: "🔴 긴급 확인 (전자 결재 대기)",
      title: "7월 장기요양급여 제공기록지 최종 결재 (3건 대기)",
      desc: "전체 수급자 18명 제공기록지 블록 검토가 완료되어 센터장 전자 서명이 필요합니다.",
      residentName: "전체 수급자 18명",
      assigneeName: "김철수 센터장",
      actionLabel: "✍️ 전자 결재 센터로 이동",
      actionHref: "/approvals"
    },
    {
      id: "risk-orange-1",
      severity: "orange",
      categoryLabel: "🟠 주의/지연 (업무 처리 지연)",
      title: "이정자 어르신 등급 갱신 본인부담금 감경 동의서 서명 누락",
      desc: "마감일: 8월 2일. 보호자방문 서명 동의가 1일 지연 중입니다.",
      residentName: "이정자 어르신",
      residentId: "res-03",
      assigneeName: "박지영 사회복지사",
      actionLabel: "📋 사례 및 계약 서류 점검",
      actionHref: "/case-management"
    },
    {
      id: "risk-orange-2",
      severity: "orange",
      categoryLabel: "🟠 주의/지연 (작성 예정 기록)",
      title: "8월 월간 뇌자극 인지 프로그램 계획서 미작성",
      desc: "익월 프로그램 계획 및 강사 일정 확정 서류 작성이 예정되어 있습니다.",
      assigneeName: "박지영 사회복지사",
      actionLabel: "🎨 프로그램 수립",
      actionHref: "/programs"
    },
    {
      id: "risk-yellow-1",
      severity: "yellow",
      categoryLabel: "🟡 점검/행정 (건보공단 평가 누락)",
      title: "3분기 비상 대피 소방안전 훈련 수급자 참여 서명 1건 미비",
      desc: "공단 주간보호 평가 28번 항목. 비상대피 훈련사진 및 참가자 서명 확인 필요.",
      assigneeName: "최사무 행정주임",
      actionLabel: "🏆 평가 점검 센터",
      actionHref: "/compliance"
    }
  ];

  const filteredItems = riskItems.filter((item) => {
    if (processedIds.includes(item.id)) return false;
    if (selectedCategory === "all") return true;
    return item.severity === selectedCategory;
  });

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
              <span className="text-lg font-black text-white">3건</span>
            </div>
            <div className="text-center px-2 border-r border-white/20">
              <span className="text-[10px] text-amber-300 font-bold block">🟠 주의</span>
              <span className="text-lg font-black text-white">2건</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[10px] text-yellow-300 font-bold block">🟡 점검</span>
              <span className="text-lg font-black text-white">1건</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex gap-1.5">
          {[
            ["all", "전체 리스크 (6건)"],
            ["red", "🔴 긴급 확인 (3건)"],
            ["orange", "🟠 주의/지연 (2건)"],
            ["yellow", "🟡 점검/행정 (1건)"]
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

      {/* Risk Feed Cards */}
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
    </div>
  );
}
