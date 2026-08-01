"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, Circle, Sparkles, UserCheck } from "lucide-react";

export default function SuperAdminBetaChecklistPage() {
  const [activeOrg, setActiveOrg] = useState("org-daycare-a");

  const [orgChecklists, setOrgChecklists] = useState<Record<string, number[]>>({
    "org-daycare-a": [101, 102, 103, 104, 201, 202, 203, 204, 301, 302, 303, 304, 401, 402, 403],
    "org-daycare-b": [101, 102, 103, 201, 202, 301, 302],
    "org-daycare-c": [101, 102]
  });

  const categories = [
    {
      title: "1. 초기 기관 설정",
      items: [
        { id: 101, label: "기관 정보 등록 (명칭, 사업자번호, 대표전화)" },
        { id: 102, label: "시설장 관리자 계정 생성 완료" },
        { id: 103, label: "직원 초대 및 이메일 발송 완료" },
        { id: 104, label: "직종별 권한 검증 완료 (Manager/SocialWorker/Nurse)" }
      ]
    },
    {
      title: "2. 데이터 이관 준비",
      items: [
        { id: 201, label: "어르신 이용자 35명 명부 CSV 일괄 업로드 완료" },
        { id: 202, label: "보호자 연락처 및 긴급 비상망 등록" },
        { id: 203, label: "송영 차량 (1호차, 2호차) 운행 코스 등록" },
        { id: 204, label: "월간/주간 프로그램 일정표 세팅" }
      ]
    },
    {
      title: "3. AI 문서 및 결재 테스트",
      items: [
        { id: 301, label: "오늘의 케어 1-Tap 터치 관찰 기록 접수" },
        { id: 302, label: "20종 AI 문서 레지스트리 자동 생성 검증" },
        { id: 303, label: "전자 결재 서명 및 승인 프로세스 검증" },
        { id: 304, label: "급여제공기록지 5종 PDF/출력 인쇄 테스트" }
      ]
    },
    {
      title: "4. 실전 운영 준비",
      items: [
        { id: 401, label: "전 종사자 현장 10분 교육 완료" },
        { id: 402, label: "어르신 개인정보 처리 동의서 확보" },
        { id: 403, label: "SaaS 운영자 직통 핫라인 지원 채널 확보" }
      ]
    }
  ];

  function toggleItem(id: number) {
    const currentList = orgChecklists[activeOrg] || [];
    const nextList = currentList.includes(id)
      ? currentList.filter((i) => i !== id)
      : [...currentList, id];

    setOrgChecklists({ ...orgChecklists, [activeOrg]: nextList });
  }

  const currentCompleted = orgChecklists[activeOrg] || [];
  const totalCount = 15;
  const progressPercent = Math.round((currentCompleted.length / totalCount) * 100);

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
              👑 Super-Admin Operations
            </Badge>
            <span className="text-xs font-semibold text-slate-500">기관별 베타 준비도</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 size={24} className="text-emerald-600" /> 베타 센터 운영 준비 체크리스트 (`/admin/beta-checklist`)
          </h1>
        </div>

        {/* Org Selector */}
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-700">대상 기관:</span>
          <select
            value={activeOrg}
            onChange={(e) => setActiveOrg(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white p-2 text-xs font-black text-slate-900 focus:border-sky-500 focus:outline-none shadow-xs"
          >
            <option value="org-daycare-a">행복주간보호센터 A (완료율 100%)</option>
            <option value="org-daycare-b">행복주간보호센터 B (완료율 47%)</option>
            <option value="org-daycare-c">미소시니어 데이케어 (완료율 13%)</option>
          </select>
        </div>
      </div>

      {/* Progress Box */}
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white p-5 shadow-xs flex items-center justify-between">
        <div>
          <span className="font-extrabold text-emerald-950 block text-xs">
            현재 기관 온보딩 및 운영 준비 달성도
          </span>
          <h2 className="text-2xl font-black text-emerald-900">
            {progressPercent}% 달성 ({currentCompleted.length} / {totalCount}개 완성)
          </h2>
        </div>

        <div className="w-48 space-y-1">
          <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-bold block text-right">
            {progressPercent === 100 ? "🎉 베타 실전 투입 가능" : "⚙️ 보완 필요"}
          </span>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <h3 className="font-black text-slate-900 text-sm border-b border-slate-100 pb-2">
              {cat.title}
            </h3>

            <div className="grid gap-2 sm:grid-cols-2">
              {cat.items.map((item) => {
                const isDone = currentCompleted.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`rounded-xl border p-3 flex items-center justify-between cursor-pointer transition ${
                      isDone
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      ) : (
                        <Circle size={16} className="text-slate-400 shrink-0" />
                      )}
                      <span className="text-xs leading-snug">{item.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
