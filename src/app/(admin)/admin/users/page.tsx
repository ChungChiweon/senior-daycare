"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Search, ShieldCheck, UserCheck, Users } from "lucide-react";

export default function SuperAdminUsersPage() {
  const [search, setSearch] = useState("");

  const [users, setUsers] = useState([
    { id: "usr-1", name: "김철수", email: "manager@daycare-a.com", orgName: "행복주간보호센터 A", role: "시설장", status: "active", lastLogin: "2026-08-01 17:05" },
    { id: "usr-2", name: "박지영", email: "park.social@daycare-a.com", orgName: "행복주간보호센터 A", role: "사회복지사", status: "active", lastLogin: "2026-08-01 16:30" },
    { id: "usr-3", name: "이간호", email: "lee.nurse@daycare-a.com", orgName: "행복주간보호센터 A", role: "간호조무사", status: "active", lastLogin: "2026-08-01 15:40" },
    { id: "usr-4", name: "김송영", email: "kim.care@daycare-a.com", orgName: "행복주간보호센터 A", role: "요양보호사", status: "active", lastLogin: "2026-08-01 14:05" },
    { id: "usr-5", name: "최사무", email: "choi.clerk@daycare-a.com", orgName: "행복주간보호센터 A", role: "사무원", status: "locked", lastLogin: "2026-07-29 11:20" }
  ]);

  function toggleLock(id: string) {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          return { ...u, status: u.status === "active" ? "locked" : "active" };
        }
        return u;
      })
    );
  }

  const filteredUsers = users.filter(
    (u) => u.name.includes(search) || u.email.includes(search) || u.orgName.includes(search)
  );

  return (
    <div className="space-y-6 text-xs max-w-5xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
              👑 Super-Admin Console
            </Badge>
            <span className="text-xs font-semibold text-slate-500">전체 고객 종사자 계정</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users size={24} className="text-indigo-600" /> SaaS 사용자 통합 조회 및 보안 관리 (`/admin/users`)
          </h1>
        </div>

        <Link href="/staff/invite">
          <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-9 px-4">
            + 직원 초대 이메일 발송
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이름, 이메일 또는 센터명 검색..."
          className="w-full text-xs font-bold text-slate-900 focus:outline-none"
        />
      </div>

      {/* Users List Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-black text-slate-900 text-sm">
            등록 종사자 목록 ({filteredUsers.length}명)
          </span>
        </div>

        <div className="space-y-2">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-3 hover:bg-white transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-900 font-black text-xs">
                  {u.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-xs">{u.name}</span>
                    <Badge className="bg-indigo-100 text-indigo-900 font-bold text-[10px]">{u.role}</Badge>
                    <Badge className={u.status === "active" ? "bg-emerald-100 text-emerald-900 font-bold text-[10px]" : "bg-red-100 text-red-900 font-bold text-[10px]"}>
                      {u.status === "active" ? "🟢 정상 활성" : "🔴 계정 잠금"}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {u.email} | 소속: {u.orgName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right">
                <span className="text-[10px] text-slate-400 font-medium">최근 접속: {u.lastLogin}</span>
                <Button
                  onClick={() => toggleLock(u.id)}
                  variant="secondary"
                  className={u.status === "active" ? "font-bold text-[11px] h-7 px-2.5 text-red-600 hover:text-red-700" : "font-bold text-[11px] h-7 px-2.5 text-emerald-600 hover:text-emerald-700"}
                >
                  {u.status === "active" ? "계정 잠금" : "잠금 해제"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
