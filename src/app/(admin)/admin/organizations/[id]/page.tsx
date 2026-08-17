"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  ShieldAlert,
  UserCheck,
  Users
} from "lucide-react";

export default function SuperAdminOrganizationDetailPage() {
  const params = useParams();
  const orgId = (params?.id as string) || "org-daycare-a";

  const [supportMemo, setSupportMemo] = useState("2026-08-01: 원장님께서 CSV 수급자 35명 데이터 일괄 등록 지원 완료함.");
  const [notification, setNotification] = useState("");

  const orgDetail = {
    id: orgId,
    name: "기관 A (본점)",
    businessNum: "124-81-90234",
    address: "서울특별시 마포구 상암산로 76",
    phone: "02-304-8899",
    capacity: 35,
    status: "active",
    createdAt: "2026-07-15",
    managerName: "김철수 시설장",
    managerEmail: "manager@daycare-a.com"
  };

  const staffList = [
    { name: "김철수", role: "시설장", email: "manager@daycare-a.com" },
    { name: "박지영", role: "사회복지사", email: "park.social@daycare-a.com" },
    { name: "이간호", role: "간호조무사", email: "lee.nurse@daycare-a.com" },
    { name: "김송영", role: "요양보호사", email: "kim.care@daycare-a.com" },
    { name: "최사무", role: "사무원", email: "choi.clerk@daycare-a.com" }
  ];

  function handleSaveMemo(e: React.FormEvent) {
    e.preventDefault();
    setNotification("💾 운영자 지원 문의 메모가 성공적으로 저장되었습니다.");
    setTimeout(() => setNotification(""), 3000);
  }

  return (
    <div className="space-y-6 text-xs max-w-4xl mx-auto py-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/admin/organizations" className="text-sky-600 font-bold hover:underline">
            ← 기관 목록으로 돌아가기
          </Link>
          <span className="text-slate-300">|</span>
          <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
            Super-Admin 관제
          </Badge>
        </div>
      </div>

      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 font-bold text-emerald-900 text-xs flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Org Information Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 size={24} className="text-sky-600" />
            <div>
              <h1 className="text-lg font-black text-slate-900">{orgDetail.name}</h1>
              <span className="text-[11px] text-slate-400 font-mono">테넌트 ID: {orgDetail.id}</span>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-900 font-bold text-xs">🟢 운영 활성화 (Active)</Badge>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="space-y-1">
            <span className="font-extrabold text-slate-500 block">사업자등록번호</span>
            <span className="font-bold text-slate-900 font-mono">{orgDetail.businessNum}</span>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-slate-500 block">소재지 주소</span>
            <span className="font-bold text-slate-900">{orgDetail.address}</span>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-slate-500 block">대표 시설장</span>
            <span className="font-bold text-slate-900">{orgDetail.managerName} ({orgDetail.managerEmail})</span>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-slate-500 block">정원 및 전화번호</span>
            <span className="font-bold text-slate-900">{orgDetail.capacity}명 정원 / {orgDetail.phone}</span>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Users size={16} className="text-indigo-600" /> 소속 종사자 사용자 ({staffList.length}명)
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {staffList.map((st, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 flex items-center justify-between">
              <div>
                <span className="font-black text-slate-900 text-xs block">{st.name} ({st.role})</span>
                <span className="text-[10px] text-slate-400 font-mono">{st.email}</span>
              </div>
              <Badge className="bg-sky-100 text-sky-900 font-bold text-[10px]">정상</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Support Memo Box */}
      <form onSubmit={handleSaveMemo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <h2 className="font-black text-slate-900 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <MessageSquare size={16} className="text-amber-600" /> SaaS 운영자 지원 문의 메모 (Support Notes)
        </h2>
        <textarea
          rows={3}
          value={supportMemo}
          onChange={(e) => setSupportMemo(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-sky-500 focus:bg-white focus:outline-none"
        />
        <div className="flex justify-end">
          <Button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-8 px-4">
            지원 메모 저장하기
          </Button>
        </div>
      </form>
    </div>
  );
}
