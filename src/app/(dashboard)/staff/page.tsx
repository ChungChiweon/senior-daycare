"use client";

import { useState } from "react";
import { Plus, X, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BETA_ACCOUNTS = [
  { name: "사회복지사 A", role: "사회복지사 (선임)", type: "실습 계정 A", email: "beta-sw-a@silvercare.internal" },
  { name: "사회복지사 B", role: "사회복지사", type: "실습 계정 B", email: "beta-sw-b@silvercare.internal" },
  { name: "사회복지사 C", role: "사회복지사", type: "실습 계정 C", email: "beta-sw-c@silvercare.internal" },
];

type StaffMember = {
  id: string;
  name: string;
  role: string;
  type: string;
  email: string;
};

export default function StaffPage() {
  const [extra, setExtra] = useState<StaffMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // form state
  const [fname, setFname] = useState("");
  const [frole, setFrole] = useState("사회복지사");
  const [ftype, setFtype] = useState("현장직");
  const [femail, setFemail] = useState("");

  const allMembers: StaffMember[] = [
    ...BETA_ACCOUNTS.map((a) => ({ id: a.email, ...a })),
    ...extra,
  ];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fname.trim()) return;
    setExtra((prev) => [
      ...prev,
      {
        id: `staff-${Date.now()}`,
        name: fname.trim(),
        role: frole,
        type: ftype,
        email: femail.trim() || `${fname.trim().replace(/\s/g, "")}.beta@silvercare.internal`,
      },
    ]);
    setIsOpen(false);
    setFname(""); setFrole("사회복지사"); setFtype("현장직"); setFemail("");
  };

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
        <Button onClick={() => setIsOpen(true)} className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Plus size={18} /> 직원 등록
        </Button>
      </div>

      {allMembers.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <Users size={28} />
          </div>
          <h3 className="text-base font-black text-slate-900">등록된 직원이 없습니다.</h3>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {allMembers.map((s) => (
            <div key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
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
      )}

      {/* 직원 등록 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">직원 등록</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">이름 *</label>
                <input required value={fname} onChange={(e) => setFname(e.target.value)}
                  placeholder="예: 사회복지사 D"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">직종</label>
                  <select value={frole} onChange={(e) => setFrole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none">
                    <option>사회복지사</option>
                    <option>요양보호사</option>
                    <option>간호조무사</option>
                    <option>물리치료사</option>
                    <option>작업치료사</option>
                    <option>영양사</option>
                    <option>조리원</option>
                    <option>운전원</option>
                    <option>사무원</option>
                    <option>시설장</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">구분</label>
                  <select value={ftype} onChange={(e) => setFtype(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none">
                    <option>현장직</option>
                    <option>실습 계정</option>
                    <option>관리직</option>
                    <option>시간제</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">로그인 ID (이메일, 선택)</label>
                <input value={femail} onChange={(e) => setFemail(e.target.value)}
                  placeholder="예: staff-d@silvercare.internal"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none" />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} className="text-xs h-9">취소</Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9">등록 완료</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
