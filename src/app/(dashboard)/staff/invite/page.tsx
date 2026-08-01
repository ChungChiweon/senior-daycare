"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  Mail,
  Plus,
  Send,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users
} from "lucide-react";
import type { ErpRole } from "@/types/erp-task";

type StaffInviteItem = {
  id: string;
  email: string;
  name: string;
  role: ErpRole | "driver";
  roleLabel: string;
  status: "invited" | "joined" | "pending_approval";
  invitedAt: string;
};

export default function StaffInvitePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<ErpRole | "driver">("social_worker");
  const [notification, setNotification] = useState("");

  const [invites, setInvites] = useState<StaffInviteItem[]>([
    {
      id: "inv-1",
      email: "park.social@daycare-a.com",
      name: "박지영",
      role: "social_worker",
      roleLabel: "사회복지사",
      status: "joined",
      invitedAt: "2026-08-01 09:30"
    },
    {
      id: "inv-2",
      email: "lee.nurse@daycare-a.com",
      name: "이간호",
      role: "nurse",
      roleLabel: "간호조무사",
      status: "joined",
      invitedAt: "2026-08-01 10:15"
    },
    {
      id: "inv-3",
      email: "kim.care@daycare-a.com",
      name: "김송영",
      role: "field_staff",
      roleLabel: "요양보호사",
      status: "pending_approval",
      invitedAt: "2026-08-01 14:00"
    },
    {
      id: "inv-4",
      email: "choi.clerk@daycare-a.com",
      name: "최사무",
      role: "clerk",
      roleLabel: "사무원",
      status: "invited",
      invitedAt: "2026-08-01 16:45"
    }
  ]);

  function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !name) return;

    const roleLabels: Record<string, string> = {
      social_worker: "사회복지사",
      clerk: "사무원",
      nurse: "간호인력",
      field_staff: "요양보호사",
      driver: "운전원"
    };

    const newInvite: StaffInviteItem = {
      id: `inv-${Date.now()}`,
      email,
      name,
      role,
      roleLabel: roleLabels[role] || role,
      status: "invited",
      invitedAt: new Date().toLocaleString("ko-KR")
    };

    setInvites([newInvite, ...invites]);
    setEmail("");
    setName("");
    setNotification(`✉️ [${name} ${roleLabels[role]}] 님에게 기관 소속 초대 메일이 발송되었습니다!`);
    setTimeout(() => setNotification(""), 4000);
  }

  function getStatusBadge(status: StaffInviteItem["status"]) {
    switch (status) {
      case "joined":
        return <Badge className="bg-emerald-100 text-emerald-900 border-emerald-300 font-bold">🟢 가입 완료</Badge>;
      case "pending_approval":
        return <Badge className="bg-amber-100 text-amber-900 border-amber-300 font-bold">🟠 승인 대기</Badge>;
      case "invited":
        return <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-bold">🔵 초대 발송</Badge>;
    }
  }

  return (
    <div className="space-y-6 text-xs max-w-4xl mx-auto">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
            시설장/관리자 전용
          </Badge>
          <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
            SaaS 계정 초청
          </Badge>
        </div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <UserPlus size={22} className="text-sky-400" /> 센터 신규 직원 초대 및 권한 부여 (`/staff/invite`)
        </h1>
        <p className="text-xs text-sky-100 mt-0.5">
          주간보호센터 종사자(사회복지사, 사무원, 간호사, 요양보호사, 운전원)의 이메일로 초대장을 발송하고 RLS 테넌트 접근 권한을 부여합니다.
        </p>
      </div>

      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-bold text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Invite Form */}
      <form onSubmit={handleSendInvite} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Mail size={16} className="text-sky-600" /> 신규 직원 초대장 발송
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">직원 성함</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              placeholder="예: 이복지"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">이메일 주소</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
              placeholder="email@center.com"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">직종 역할 (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2 text-xs font-bold text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
            >
              <option value="social_worker">사회복지사 (복지/문서)</option>
              <option value="clerk">사무원 (행정/수납)</option>
              <option value="nurse">간호조무사 (건강/바이탈)</option>
              <option value="field_staff">요양보호사 (모바일/케어)</option>
              <option value="driver">운전원 (송영/운행)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9 px-4 flex items-center gap-1.5 shadow-xs">
            <Send size={14} />
            <span>초대 이메일 발송하기</span>
          </Button>
        </div>
      </form>

      {/* Invites List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-black text-slate-900 text-sm flex items-center gap-1.5">
            <Users size={16} className="text-indigo-600" /> 센터 직원 초대 현황 ({invites.length}명)
          </span>
        </div>

        <div className="space-y-2">
          {invites.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 hover:bg-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-slate-800 font-black text-xs">
                  {inv.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-xs">{inv.name}</span>
                    <Badge className="bg-indigo-100 text-indigo-900 font-bold text-[10px]">
                      {inv.roleLabel}
                    </Badge>
                    {getStatusBadge(inv.status)}
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">{inv.email}</span>
                </div>
              </div>

              <span className="text-[10px] text-slate-400 font-medium">
                초대일: {inv.invitedAt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
