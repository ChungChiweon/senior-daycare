"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  Award,
  Calendar,
  CheckSquare,
  Clock,
  CreditCard,
  FileCheck,
  FileSpreadsheet,
  Heart,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  Zap
} from "lucide-react";
import type { ErpRole } from "@/types/erp-task";
import type { Resident } from "@/data/mock-daycare-store";

const ROLES_LIST: { role: ErpRole; title: string; subtitle: string; iconStr: string }[] = [
  { role: "social_worker", title: "사회복지사", subtitle: "사례·프로그램·알림장 담당", iconStr: "📋" },
  { role: "manager", title: "시설장", subtitle: "센터 운영·최종 승인·리스크 총괄", iconStr: "🏛️" },
  { role: "clerk", title: "사무원", subtitle: "수납·청구·행정·계약 관리", iconStr: "💳" },
  { role: "nurse", title: "간호인력", subtitle: "바이탈·투약·신체 건강 케어", iconStr: "🩺" },
  { role: "field_staff", title: "요양보호사", subtitle: "일일 현장 케어·송영 동행", iconStr: "🤝" }
];

export function RoleDashboardSwitcher() {
  const [activeRole, setActiveRole] = useState<ErpRole>("social_worker");
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = window.localStorage.getItem("silvercare.activeRole") as ErpRole | null;
      if (storedRole && ROLES_LIST.some((r) => r.role === storedRole)) {
        setActiveRole(storedRole);
      }

      const raw = window.localStorage.getItem("silvercare.residents");
      if (raw) {
        try {
          setResidents(JSON.parse(raw));
        } catch {
          setResidents([]);
        }
      }
    }
  }, []);

  function handleSelectRole(role: ErpRole) {
    setActiveRole(role);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("silvercare.activeRole", role);
    }
  }

  const attendingCount = residents.filter((r) => r.attendance === "입실").length;
  const cautionCount = residents.filter((r) => r.healthStatus === "건강이상" || r.healthStatus === "주의요망").length;

  return (
    <div className="space-y-5 text-xs">
      {/* Role Switcher Top Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-extrabold text-sm text-slate-900">
                👤 로그인 역할별 맞춤 뷰 대시보드
              </span>
              <Badge className="bg-sky-600 text-white font-bold text-[10px]">
                5개 역할 전환 가능
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500">
              시설장, 사회복지사, 사무원, 간호인력, 요양보호사의 직무에 맞춘 실무 업무 대시보드를 제공합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold text-slate-700">현재 선택 역할:</span>
            <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-extrabold text-xs">
              {ROLES_LIST.find((r) => r.role === activeRole)?.iconStr}{" "}
              {ROLES_LIST.find((r) => r.role === activeRole)?.title}
            </Badge>
          </div>
        </div>

        {/* Role Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {ROLES_LIST.map((r) => {
            const isSelected = r.role === activeRole;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => handleSelectRole(r.role)}
                className={`rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? "border-sky-500 bg-sky-50/70 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm">{r.iconStr}</span>
                  <span className={`font-extrabold text-xs ${isSelected ? "text-sky-950" : "text-slate-800"}`}>
                    {r.title}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-1">{r.subtitle}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC WIDGETS BY ROLE */}

      {/* 1. SOCIAL WORKER (사회복지사) DASHBOARD */}
      {activeRole === "social_worker" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <MessageSquare size={14} className="text-purple-600" /> 오늘 보호자 상담/요청
              </span>
              <div className="text-2xl font-black text-slate-900">0건</div>
              <p className="text-[10px] text-purple-700 font-bold">등록된 상담 요청 없음</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <Sparkles size={14} className="text-sky-600" /> 20종 AI 문서 작성
              </span>
              <div className="text-2xl font-black text-sky-900">0건</div>
              <p className="text-[10px] text-sky-700 font-bold">대기 중인 문서 없음</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <CheckSquare size={14} className="text-amber-600" /> 결재 승인 대기
              </span>
              <div className="text-2xl font-black text-amber-900">0건</div>
              <p className="text-[10px] text-amber-700 font-bold">대기 중인 결재 없음</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <Activity size={14} className="text-emerald-600" /> 인지 프로그램 결과
              </span>
              <div className="text-2xl font-black text-emerald-900">0건</div>
              <p className="text-[10px] text-emerald-700 font-bold">등록된 프로그램 없음</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                <Zap size={14} className="text-sky-600" /> 사회복지사 오늘 집중 케어 목록
              </h3>
              <Link href="/residents">
                <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-7 px-3">
                  + 가상 이용자 등록
                </Button>
              </Link>
            </div>

            {residents.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed text-xs space-y-1">
                <p className="font-bold text-slate-600">아직 등록된 이용자가 없습니다.</p>
                <p className="text-[11px] text-slate-400">
                  테스트용 가상 이용자를 직접 등록해주시면 집중 케어 및 AI 비서 실습이 활성화됩니다.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {residents.slice(0, 3).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3">
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{r.name} 어르신 케어 기록 작성</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{r.gradeLabel} · {r.shuttleRoute}</p>
                    </div>
                    <Link href="/daily-care">
                      <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-8">
                        케어 입력
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. FACILITY MANAGER (시설장) DASHBOARD */}
      {activeRole === "manager" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                <Users size={14} className="text-emerald-600" /> 오늘 출석 및 이용률
              </span>
              <div className="text-2xl font-black text-emerald-950">{attendingCount}명 / {residents.length}명</div>
              <p className="text-[10px] text-emerald-700 font-bold">등원 현황 실시간 집계</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                <CheckSquare size={14} className="text-amber-600" /> 센터장 전자 결재 대기
              </span>
              <div className="text-2xl font-black text-amber-950">0건</div>
              <p className="text-[10px] text-amber-700 font-bold">결재 대기 문서 없음</p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-red-800 font-bold text-[11px] flex items-center gap-1">
                <ShieldAlert size={14} className="text-red-600" /> 리스크 점검 대상
              </span>
              <div className="text-2xl font-black text-red-950">{cautionCount}건</div>
              <p className="text-[10px] text-red-700 font-bold">주의 관찰 대상 어르신</p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-purple-800 font-bold text-[11px] flex items-center gap-1">
                <Award size={14} className="text-purple-600" /> 건보공단 평가 준비 충족도
              </span>
              <div className="text-2xl font-black text-purple-950">
                {residents.length === 0
                  ? "데이터 수집 대기"
                  : `${Math.round(((residents.length - cautionCount) / residents.length) * 100)}% (양호)`}
              </div>
              <p className="text-[10px] text-purple-700 font-bold">
                {residents.length === 0 ? "이용자 등록 후 평가 지표 산출" : `총 ${residents.length}명 기준 실시간 집계`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. CLERK (사무원) DASHBOARD */}
      {activeRole === "clerk" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <CreditCard size={14} className="text-sky-600" /> 당월 본인부담금 수납
              </span>
              <div className="text-2xl font-black text-slate-900">0원</div>
              <p className="text-[10px] text-slate-400 font-bold">수납 내역 대기</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <FileSpreadsheet size={14} className="text-emerald-600" /> 공단 청구 대상
              </span>
              <div className="text-2xl font-black text-emerald-900">{residents.length}명</div>
              <p className="text-[10px] text-emerald-700 font-bold">청구 데이터 생성 대기</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. NURSE (간호인력) DASHBOARD */}
      {activeRole === "nurse" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <Heart size={14} className="text-rose-600" /> 오늘 바이탈 측정 대상
              </span>
              <div className="text-2xl font-black text-slate-900">{residents.length}명</div>
              <p className="text-[10px] text-rose-700 font-bold">혈압/체온 측정 필요</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. FIELD STAFF (요양보호사) DASHBOARD */}
      {activeRole === "field_staff" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <Users size={14} className="text-sky-600" /> 오늘 담당 어르신
              </span>
              <div className="text-2xl font-black text-slate-900">{residents.length}명</div>
              <p className="text-[10px] text-sky-700 font-bold">생활 지원 및 관찰</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
