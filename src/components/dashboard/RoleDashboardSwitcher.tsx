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
  Users,
  Zap
} from "lucide-react";
import type { ErpRole } from "@/types/erp-task";

const ROLES_LIST: { role: ErpRole; title: string; subtitle: string; iconStr: string }[] = [
  { role: "social_worker", title: "사회복지사", subtitle: "사례·프로그램·알림장 담당", iconStr: "📋" },
  { role: "manager", title: "시설장", subtitle: "센터 운영·최종 승인·리스크 총괄", iconStr: "🏛️" },
  { role: "clerk", title: "사무원", subtitle: "수납·청구·행정·계약 관리", iconStr: "💳" },
  { role: "nurse", title: "간호인력", subtitle: "바이탈·투약·신체 건강 케어", iconStr: "🩺" },
  { role: "field_staff", title: "요양보호사", subtitle: "일일 현장 케어·송영 동행", iconStr: "🤝" }
];

export function RoleDashboardSwitcher() {
  const [activeRole, setActiveRole] = useState<ErpRole>("social_worker");

  useEffect(() => {
    const storedRole = window.localStorage.getItem("silvercare.activeRole") as ErpRole | null;
    if (storedRole && ROLES_LIST.some((r) => r.role === storedRole)) {
      setActiveRole(storedRole);
    }
  }, []);

  function handleSelectRole(role: ErpRole) {
    setActiveRole(role);
    window.localStorage.setItem("silvercare.activeRole", role);
  }

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
              <div className="text-2xl font-black text-slate-900">4건</div>
              <p className="text-[10px] text-purple-700 font-bold">김순자 어르신 외 3건 접수</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <Sparkles size={14} className="text-sky-600" /> 20종 AI 문서 작성 필요
              </span>
              <div className="text-2xl font-black text-sky-900">5건</div>
              <p className="text-[10px] text-sky-700 font-bold">일일 알림장 3건, 송영보고 2건</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <CheckSquare size={14} className="text-amber-600" /> 결재 승인 대기
              </span>
              <div className="text-2xl font-black text-amber-900">3건</div>
              <p className="text-[10px] text-amber-700 font-bold">센터장 승인 대기 중</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <Activity size={14} className="text-emerald-600" /> 인지 프로그램 결과
              </span>
              <div className="text-2xl font-black text-emerald-900">완료 (10:30)</div>
              <p className="text-[10px] text-emerald-700 font-bold">칠교 뇌자극 케어 결과 18명 연동</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <Zap size={14} className="text-sky-600" /> 사회복지사 오늘 집중 케어 목록
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div>
                  <span className="font-bold text-slate-900 text-xs">김순자 어르신 무릎 온찜질 알림장 전달</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">보호자 전화 요청건 알림장 반영 작성 필요</p>
                </div>
                <Link href="/create">
                  <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-8">
                    AI 문서 생성
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 p-3">
                <div>
                  <span className="font-bold text-slate-900 text-xs">8월 신규 수급자 입소 상담 및 급여계획서 수립</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">14:00 보호자 내방 예정</p>
                </div>
                <Link href="/case-management">
                  <Button variant="secondary" className="font-bold text-xs h-8">
                    사례 관리
                  </Button>
                </Link>
              </div>
            </div>
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
              <div className="text-2xl font-black text-emerald-950">18명 / 20명 (90%)</div>
              <p className="text-[10px] text-emerald-700 font-bold">1호차/2호차 송영 안전 완료</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                <CheckSquare size={14} className="text-amber-600" /> 센터장 전자 결재 대기
              </span>
              <div className="text-2xl font-black text-amber-950">3건 결재 필요</div>
              <p className="text-[10px] text-amber-700 font-bold">급여제공기록지, 안전점검표</p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-red-800 font-bold text-[11px] flex items-center gap-1">
                <ShieldAlert size={14} className="text-red-600" /> 리스크 점검 대상
              </span>
              <div className="text-2xl font-black text-red-950">🔴 2건 긴급</div>
              <p className="text-[10px] text-red-700 font-bold">박영수 어르신 혈당 주의</p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-purple-800 font-bold text-[11px] flex items-center gap-1">
                <Award size={14} className="text-purple-600" /> 건보공단 평가 준비 충족도
              </span>
              <div className="text-2xl font-black text-purple-950">94.2점 (A등급)</div>
              <p className="text-[10px] text-purple-700 font-bold">평가 지표 자동 모니터링</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/approvals" className="flex-1">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10">
                ✍️ 전자 결재 센터 바로가기 (3건 대기)
              </Button>
            </Link>
            <Link href="/risk-center" className="flex-1">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-10">
                🚨 운영 리스크 센터 확인하기
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 3. CLERK (사무원) DASHBOARD */}
      {activeRole === "clerk" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <CreditCard size={14} className="text-sky-600" /> 7월 본인부담금 수납률
              </span>
              <div className="text-2xl font-black text-sky-900">92% 수납 완료</div>
              <p className="text-[10px] text-sky-700 font-bold">미수금 2건 (자동 알림 발송 가능)</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <FileCheck size={14} className="text-purple-600" /> 장기요양 계약 갱신
              </span>
              <div className="text-2xl font-black text-purple-900">2건 임박</div>
              <p className="text-[10px] text-purple-700 font-bold">이정자 어르신 등급 재판정 서류</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <UserCheck size={14} className="text-emerald-600" /> 직원 출퇴근 및 야간 근태
              </span>
              <div className="text-2xl font-black text-emerald-900">12명 정상</div>
              <p className="text-[10px] text-emerald-700 font-bold">요양보호사 6명, 사회복지사 2명</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-1 shadow-2xs">
              <span className="text-slate-500 font-bold text-[11px] flex items-center gap-1">
                <FileSpreadsheet size={14} className="text-slate-600" /> 공단 청구 파일 명세
              </span>
              <div className="text-2xl font-black text-slate-900">생성 준비 완료</div>
              <p className="text-[10px] text-slate-500 font-bold">8월 초 청구 일정 정상</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. NURSE (간호인력) DASHBOARD */}
      {activeRole === "nurse" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-rose-800 font-bold text-[11px] flex items-center gap-1">
                <Heart size={14} className="text-rose-600" /> 오늘 아침 바이탈 측정이력
              </span>
              <div className="text-2xl font-black text-rose-950">18명 측정 완료</div>
              <p className="text-[10px] text-rose-700 font-bold">혈압/체온 정상범위 기록</p>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-sky-800 font-bold text-[11px] flex items-center gap-1">
                <Activity size={14} className="text-sky-600" /> 점심 식후 지정 투약
              </span>
              <div className="text-2xl font-black text-sky-950">12명 전원 투약</div>
              <p className="text-[10px] text-sky-700 font-bold">박영수 어르신 신규 당뇨약 확인</p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-amber-800 font-bold text-[11px] flex items-center gap-1">
                <Zap size={14} className="text-amber-600" /> 특이사항 간호 처치
              </span>
              <div className="text-2xl font-black text-amber-950">김순자 어르신 온찜질</div>
              <p className="text-[10px] text-amber-700 font-bold">오후 14:00 물리치료실 15분 처치 완료</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. FIELD STAFF (요양보호사) DASHBOARD */}
      {activeRole === "field_staff" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-sky-200 bg-sky-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-sky-800 font-bold text-[11px] flex items-center gap-1">
                <Activity size={14} className="text-sky-600" /> 오늘의 현장 케어 대상
              </span>
              <div className="text-2xl font-black text-sky-950">담당 그룹 6명</div>
              <p className="text-[10px] text-sky-700 font-bold">식사 지원, 신체활동 케어</p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                <CheckSquare size={14} className="text-emerald-600" /> 모바일 현장 기록 입력
              </span>
              <div className="text-2xl font-black text-emerald-950">1-Tap 터치 입력</div>
              <p className="text-[10px] text-emerald-700 font-bold">식사량/배설/보행 3초 기록 완료</p>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 space-y-1 shadow-2xs">
              <span className="text-purple-800 font-bold text-[11px] flex items-center gap-1">
                <Users size={14} className="text-purple-600" /> 하원 송영 안전 확인
              </span>
              <div className="text-2xl font-black text-purple-950">16:30 하원 탑승</div>
              <p className="text-[10px] text-purple-700 font-bold">소지품 챙김 및 안전벨트 점검</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
