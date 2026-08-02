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
      title: "Step 1. 기관 준비 (Preparation)",
      items: [
        { id: 101, label: "계약 완료 및 대표 기관 정보 등록 (명칭, 사업자번호, 대표전화)" },
        { id: 102, label: "시설장 대표 관리자 계정 생성 완료" },
        { id: 103, label: "운영 담당자 지정 및 RLS 테넌트 생성 확인" }
      ]
    },
    {
      title: "Step 2. 데이터 준비 (Data Onboarding)",
      items: [
        { id: 201, label: "어르신 이용자 35명 명부 CSV 확보 및 일괄 이관 완료" },
        { id: 202, label: "센터 직원 명단 및 직종별 역할 정보 확보" },
        { id: 203, label: "보호자 연락처 및 긴급 비상 연락망 등록" },
        { id: 204, label: "송영 차량 (1호차, 2호차) 운행 코스 등록" }
      ]
    },
    {
      title: "Step 3. 시스템 설정 (System Configuration)",
      items: [
        { id: 301, label: "직원 계정 생성 및 초대 메일 발송 완료" },
        { id: 302, label: "직종별 역할 권한 확인 (Manager/SocialWorker/Nurse/Caregiver)" },
        { id: 303, label: "20종 AI 문서 템플릿 레지스트리 정상 세팅" },
        { id: 304, label: "카카오 알림톡 및 시스템 알림 채널 설정" }
      ]
    },
    {
      title: "Step 4. 교육 (Training)",
      items: [
        { id: 401, label: "시설장 교육 완료 (대시보드/리스크센터/결재/직원관리)" },
        { id: 402, label: "사회복지사 교육 완료 (이용자관리/케어기록/AI문서/보호자소통)" },
        { id: 403, label: "사무원 교육 완료 (계약서/수납/근태관리)" },
        { id: 404, label: "현장 요양보호사/간호사 교육 완료 (모바일 1-Tap/인수인계)" }
      ]
    },
    {
      title: "Step 5. 운영 시작 (Live Operations)",
      items: [
        { id: 501, label: "오늘의 케어 첫 관찰 팩트 접수 및 작성 완료" },
        { id: 502, label: "현장 인수인계 ➔ 간호/복지팀 첫 협업 업무 요청 생성" },
        { id: 503, label: "20종 AI 문서 자동 작성 첫 테스트 완료" },
        { id: 504, label: "시설장 최종 전자 결재 서명 및 5종 PDF 출력 완료" }
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
  const totalCount = categories.reduce((acc, cat) => acc + cat.items.length, 0);
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
