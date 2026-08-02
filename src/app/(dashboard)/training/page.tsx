"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  GraduationCap
} from "lucide-react";
import type { ErpRole } from "@/types/erp-task";

type TrainingCourse = {
  role: ErpRole | "driver";
  roleTitle: string;
  badgeColor: string;
  description: string;
  items: { id: number; title: string; desc: string; href: string }[];
};

export default function StaffTrainingPage() {
  const [selectedRole, setSelectedRole] = useState<ErpRole | "driver">("social_worker");
  const [completedItems, setCompletedItems] = useState<number[]>([201, 202, 401]);

  const courses: TrainingCourse[] = [
    {
      role: "manager",
      roleTitle: "시설장 (관리자)",
      badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
      description: "주간보호센터 전체 운영 대시보드, 리스크 센터, 20종 AI 문서 최종 전자 결재 서명 및 직원 관리",
      items: [
        { id: 101, title: "1. 센터 운영 대시보드 확인", desc: "이용 예정 인원, 입실율, 송영 차량 현황 실시간 파악", href: "/dashboard" },
        { id: 102, title: "2. 운영 리스크 센터 감시", desc: "건강 이상, 낙상 위험어르신 및 안전 사고 3단계 경보", href: "/risk-center" },
        { id: 103, title: "3. 문서 전자 결재 및 승인", desc: "사회복지사가 생성한 AI 문서 1-Tap 서명 및 승인 완료", href: "/approvals" },
        { id: 104, title: "4. 직원 초청 및 권한 관리", desc: "새 종사자 이메일 초청 및 직종별 RLS 접근 권한 할당", href: "/staff/invite" }
      ]
    },
    {
      role: "social_worker",
      roleTitle: "사회복지사",
      badgeColor: "bg-sky-100 text-sky-900 border-sky-300",
      description: "수급자 프로필 관리, 일일 관찰 팩트 입력, 20종 AI 급여 문서 동적 생성 및 알림톡 전송",
      items: [
        { id: 201, title: "1. 어르신 이용자 정보 관리", desc: "장기요양 등급, 주소, 비상연락처 및 케어 주의사항 등록", href: "/residents" },
        { id: 202, title: "2. 1-Tap 오늘의 케어 작성", desc: "신체, 인지, 식사, 바이탈 관찰 팩트 터치 접수", href: "/daily-care" },
        { id: 203, title: "3. 20종 레지스트리 AI 문서 생성", desc: "급여제공기록지, 상태변화기록 등 AI 자동 작성", href: "/create" },
        { id: 204, title: "4. 보호자 알림장 카카오 발송", desc: "보호자 맞춤 일일 소통 메시지 전송 및 이력 확인", href: "/communications" }
      ]
    },
    {
      role: "nurse",
      roleTitle: "간호인력 (간호조무사)",
      badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
      description: "체온, 혈압, 혈당 측정, 투약 케어 일지 작성 및 수급자 물리치료/찜질 간호 기록",
      items: [
        { id: 301, title: "1. 바이탈 수치 일괄 입력", desc: "오전/오후 체온, 수시 혈압 측정치 기록", href: "/daily-care" },
        { id: 302, title: "2. 투약 케어 및 약 복용 확인", desc: "처방약 복용 여부 및 투약 시간 체크", href: "/daily-care" },
        { id: 303, title: "3. 건강 특이사항 간호 전달", desc: "이상 혈압 및 발열 어르신 협업 업무 생성", href: "/tasks" }
      ]
    },
    {
      role: "field_staff",
      roleTitle: "요양보호사 (현장 케어)",
      badgeColor: "bg-amber-100 text-amber-900 border-amber-300",
      description: "모바일 스마트폰 1-Tap 생활 케어 기록, 근무 교대 인수인계 및 특이사항 업무 전달",
      items: [
        { id: 401, title: "1. 모바일 1-Tap 케어 터치", desc: "식사 섭취량, 배설 횟수, 프로그램 참가 1초 터치", href: "/daily-care" },
        { id: 402, title: "2. 현장 교대 인수인계 접수", desc: "오전/오후 조 인수인계 사항 모바일 확인", href: "/handover" },
        { id: 403, title: "3. 간호팀/복지팀 협업 요청", desc: "무릎 통증 등 현장 이상 발견 시 1-Tap 업무 전달", href: "/tasks" }
      ]
    },
    {
      role: "clerk",
      roleTitle: "사무원 (행정/수납)",
      badgeColor: "bg-indigo-100 text-indigo-900 border-indigo-300",
      description: "이용계약서 관리, 본인부담금 청구 수납, 공단 급여 청구 지원 및 센터 행정 서류 관리",
      items: [
        { id: 501, title: "1. 수급자 계약서 관리", desc: "장기요양 이용계약서 생성 및 전자 서명 보관", href: "/documents" },
        { id: 502, title: "2. 본인부담금 청구 및 수납", desc: "월별 본인부담금 입금 처리 및 영수증 발행", href: "/billing" },
        { id: 503, title: "3. 종사자 근태 및 출석 현황", desc: "직원 일자별 출석 및 근무 일수 확인", href: "/staff" }
      ]
    }
  ];

  const currentCourse = courses.find((c) => c.role === selectedRole) || courses[1];

  function toggleItem(id: number) {
    if (completedItems.includes(id)) {
      setCompletedItems(completedItems.filter((i) => i !== id));
    } else {
      setCompletedItems([...completedItems, id]);
    }
  }

  const courseItemIds = currentCourse.items.map((i) => i.id);
  const doneCount = currentCourse.items.filter((i) => completedItems.includes(i.id)).length;
  const progressPercent = Math.round((doneCount / currentCourse.items.length) * 100);

  return (
    <div className="space-y-6 text-xs max-w-4xl mx-auto py-4">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
            🎓 신규 종사자 10분 가이드
          </Badge>
          <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
            SaaS 학습 튜토리얼
          </Badge>
        </div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <GraduationCap size={24} className="text-sky-400" /> 주간보호 센터 직종별 직원 교육 모드 (`/training`)
        </h1>
        <p className="text-xs text-sky-100 mt-0.5">
          시설장, 사회복지사, 간호사, 요양보호사, 사무원 각 직종별 핵심 4단계 실전 업무 과제를 이수하여 바로 업무에 적용하세요.
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {courses.map((c) => (
          <button
            key={c.role}
            type="button"
            onClick={() => setSelectedRole(c.role)}
            className={`px-3.5 py-2 text-xs font-black rounded-xl transition border flex items-center gap-1.5 ${
              selectedRole === c.role
                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <span>{c.roleTitle}</span>
          </button>
        ))}
      </div>

      {/* Course Detail Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">{currentCourse.roleTitle} 과정</h2>
              <Badge className={currentCourse.badgeColor}>필수 튜토리얼</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{currentCourse.description}</p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-extrabold text-slate-500 block">교육 이수율</span>
            <span className="text-xl font-black text-sky-600">{progressPercent}%</span>
            <span className="text-[10px] text-slate-400 font-bold block">
              ({doneCount} / {currentCourse.items.length}개 완료)
            </span>
          </div>
        </div>

        {/* Tasks Stream */}
        <div className="space-y-3">
          {currentCourse.items.map((it) => {
            const isDone = completedItems.includes(it.id);

            return (
              <div
                key={it.id}
                onClick={() => toggleItem(it.id)}
                className={`rounded-xl border p-3.5 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone
                    ? "bg-emerald-50/60 border-emerald-300"
                    : "bg-slate-50/60 border-slate-200 hover:bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isDone ? (
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                  ) : (
                    <Circle size={20} className="text-slate-400 shrink-0" />
                  )}
                  <div>
                    <span className={`font-black text-xs block ${isDone ? "text-slate-900 line-through opacity-80" : "text-slate-900"}`}>
                      {it.title}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{it.desc}</span>
                  </div>
                </div>

                <Link
                  href={it.href}
                  onClick={(e) => e.stopPropagation()}
                  className="self-end sm:self-auto"
                >
                  <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] h-8 px-3 flex items-center gap-1 shadow-xs">
                    <span>기능 실행</span>
                    <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
