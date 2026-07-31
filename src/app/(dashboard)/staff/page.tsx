"use client";

import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StaffPage() {
  const staffMembers = [
    { name: "김시설장", role: "시설장", type: "상근", phone: "010-1111-2222", status: "근무중" },
    { name: "박지영", role: "사회복지사 (선임)", type: "상근", phone: "010-2222-3333", status: "근무중" },
    { name: "김민석", role: "사회복지사", type: "상근", phone: "010-3333-4444", status: "근무중" },
    { name: "정요양", role: "요양보호사 (조장)", type: "교대", phone: "010-4444-5555", status: "근무중" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>인력 배치 기준</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">직원 및 근무 관리</h1>
          <p className="mt-1 text-sm text-slate-600">
            주간보호센터 사회복지사, 요양보호사, 간호조무사, 운전원 근무 배치표와 자격증을 관리합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Plus size={18} /> 직원 등록
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {staffMembers.map((s) => (
          <div key={s.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-800 text-sm">
                {s.name[0]}
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base">{s.name}</h2>
                <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">{s.role}</span>
              </div>
            </div>
            <div className="mt-3 space-y-1 text-xs text-slate-600 font-semibold">
              <div>근무 형태: <span className="font-bold text-slate-800">{s.type}</span></div>
              <div>연락처: <span className="font-bold text-slate-800">{s.phone}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
