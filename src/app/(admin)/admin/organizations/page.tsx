"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, Search, ShieldCheck, Users, Zap } from "lucide-react";

export default function SuperAdminOrganizationsPage() {
  const [search, setSearch] = useState("");

  const [orgs, setOrgs] = useState([
    {
      id: "org-daycare-a",
      name: "행복주간보호센터 A (본점)",
      businessNum: "124-81-90234",
      createdAt: "2026-07-15",
      usersCount: 15,
      residentsCount: 35,
      status: "active" as const,
      address: "서울특별시 마포구 상암산로 76"
    },
    {
      id: "org-daycare-b",
      name: "행복주간보호센터 B (강남점)",
      businessNum: "284-81-01934",
      createdAt: "2026-07-28",
      usersCount: 8,
      residentsCount: 20,
      status: "active" as const,
      address: "서울특별시 강남구 학동로 201"
    },
    {
      id: "org-daycare-c",
      name: "미소시니어 데이케어센터 (베타)",
      businessNum: "305-88-12940",
      createdAt: "2026-08-01",
      usersCount: 4,
      residentsCount: 10,
      status: "testing" as const,
      address: "경기도 성남시 분당구 판교역로 12"
    }
  ]);

  function toggleOrgStatus(id: string) {
    setOrgs(
      orgs.map((o) => {
        if (o.id === id) {
          const next = o.status === "active" ? "testing" : "active";
          return { ...o, status: next };
        }
        return o;
      })
    );
  }

  const filteredOrgs = orgs.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase()) || o.businessNum.includes(search)
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
            <span className="text-xs font-semibold text-slate-500">고객 주간보호센터 목록</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Building2 size={24} className="text-sky-600" /> 주간보호센터 기관 관리 (`/admin/organizations`)
          </h1>
        </div>

        <Link href="/onboarding">
          <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-9 px-4">
            + 신규 기관 등록 (Onboarding)
          </Button>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="기관명 또는 사업자번호 검색..."
          className="w-full text-xs font-bold text-slate-900 focus:outline-none"
        />
      </div>

      {/* Organizations Table / List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-black text-slate-900 text-sm">
            등록된 주간보호센터 목록 ({filteredOrgs.length}개)
          </span>
        </div>

        <div className="space-y-3">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 gap-3 hover:bg-white transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{org.name}</span>
                  <Badge
                    className={
                      org.status === "active"
                        ? "bg-emerald-100 text-emerald-900 font-bold"
                        : "bg-amber-100 text-amber-900 font-bold"
                    }
                  >
                    {org.status === "active" ? "🟢 운영 활성" : "🟠 테스트 모드"}
                  </Badge>
                </div>

                <div className="text-[11px] text-slate-500 font-medium space-x-3">
                  <span>사업자번호: <strong className="text-slate-700 font-mono">{org.businessNum}</strong></span>
                  <span>등록일: {org.createdAt}</span>
                  <span>주소: {org.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t sm:border-t-0 pt-2 sm:pt-0">
                <div className="text-right text-[11px]">
                  <span className="font-black text-slate-900 block">어르신 {org.residentsCount}명 / 종사자 {org.usersCount}명</span>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {org.id}</span>
                </div>

                <Button
                  onClick={() => toggleOrgStatus(org.id)}
                  variant="secondary"
                  className="font-bold text-[11px] h-8 px-3"
                >
                  {org.status === "active" ? "테스트 전환" : "운영 활성화"}
                </Button>

                <Link href={`/admin/organizations/${org.id}`}>
                  <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] h-8 px-3">
                    상세 관제 ➔
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
