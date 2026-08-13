"use client";

import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StaffPage() {
  const staffMembers = [
    { name: "사회복지사 A", role: "사회복지사 (선임)", type: "실습 계정 A", email: "beta-sw-a@silvercare.internal", status: "온라인" },
    { name: "사회복지사 B", role: "사회복지사", type: "실습 계정 B", email: "beta-sw-b@silvercare.internal", status: "대기" },
    { name: "사회복지사 C", role: "사회복지사", type: "실습 계정 C", email: "beta-sw-c@silvercare.internal", status: "대기" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>인력 배치 기준</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">직원 및 실습 계정 관리</h1>
          <p className="mt-1 text-sm text-slate-600">
            베타 실습에 참여 중인 사회복지사 계정 및 인력 배치를 관리합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Plus size={18} /> 직원 등록
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {staffMembers.map((s) => (
          <div key={s.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-800 text-sm">
                {s.name[s.name.length - 1]}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">{s.name}</h2>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">{s.role}</span>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-600 font-semibold">
              <div>구분: <span className="font-bold text-slate-800">{s.type}</span></div>
              <div>로그인 ID: <span className="font-bold text-slate-800">{s.email}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
