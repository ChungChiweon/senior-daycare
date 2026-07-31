"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, LayoutGrid, List, Search, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockResidents } from "@/data/mock-daycare-store";

export default function ResidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("전체");
  const [cautionOnly, setCautionOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const filteredResidents = mockResidents.filter((r) => {
    const matchesSearch = r.name.includes(searchTerm) || r.careNumber.includes(searchTerm) || r.guardianName.includes(searchTerm);
    const matchesGrade = gradeFilter === "전체" || r.grade === gradeFilter;
    const matchesCaution = !cautionOnly || Boolean(r.cautionNotes);
    return matchesSearch && matchesGrade && matchesCaution;
  });

  return (
    <div className="space-y-6">
      {/* Top Title & Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>이용자(수급자) 관리</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">어르신 이용자 목록</h1>
          <p className="mt-1 text-sm text-slate-600">
            주간보호센터 수급자 기본 정보, 장기요양 등급, 보호자 연락처 및 개별 케어 특이사항을 관리합니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <UserPlus size={18} />
          신규 어르신 등록
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-60 flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <Input
              className="pl-9 text-xs"
              placeholder="어르신 성함, 인정번호, 보호자 성함 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["전체", "1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급"].map((g) => (
              <button
                key={g}
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${gradeFilter === g ? "bg-sky-600 text-white border-sky-600" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}`}
                onClick={() => setGradeFilter(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-slate-100 pt-3 sm:border-t-0 sm:pt-0">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              className="rounded text-sky-600"
              checked={cautionOnly}
              onChange={(e) => setCautionOnly(e.target.checked)}
            />
            <AlertCircle size={15} className="text-amber-500" />
            주의 필요 어르신만 보기
          </label>

          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              className={`rounded-md p-1.5 ${viewMode === "card" ? "bg-white text-sky-600 shadow-xs" : "text-slate-500"}`}
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`rounded-md p-1.5 ${viewMode === "table" ? "bg-white text-sky-600 shadow-xs" : "text-slate-500"}`}
              onClick={() => setViewMode("table")}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredResidents.map((r) => (
            <Link
              key={r.id}
              href={`/residents/${r.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-500 hover:shadow-md block"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-800 text-base">
                    {r.initial}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600">{r.name} 어르신</h2>
                    <p className="text-xs text-slate-500">
                      {r.gender} · {r.age}세 ({r.birthDate})
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 border border-sky-200">
                  {r.gradeLabel}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">장기요양번호</span>
                  <span className="font-semibold text-slate-800">{r.careNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">보호자 / 관계</span>
                  <span className="font-semibold text-slate-800">
                    {r.guardianName} ({r.guardianRelation}) · {r.guardianPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">송영 노선</span>
                  <span className="font-semibold text-slate-800">{r.shuttleRoute}</span>
                </div>
              </div>

              {r.cautionNotes && (
                <div className="mt-3 rounded-lg bg-amber-50 p-2.5 text-xs font-semibold text-amber-800 border border-amber-200">
                  ⚠️ {r.cautionNotes}
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-3 font-bold">성함</th>
                <th className="px-4 py-3 font-bold">성별/나이</th>
                <th className="px-4 py-3 font-bold">인정등급</th>
                <th className="px-4 py-3 font-bold">인정번호</th>
                <th className="px-4 py-3 font-bold">보호자</th>
                <th className="px-4 py-3 font-bold">송영차량</th>
                <th className="px-4 py-3 font-bold">출석상태</th>
                <th className="px-4 py-3 font-bold">상세</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {filteredResidents.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-900">{r.name}</td>
                  <td className="px-4 py-3">
                    {r.gender} ({r.age}세)
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-700">
                      {r.gradeLabel}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono">{r.careNumber}</td>
                  <td className="px-4 py-3">
                    {r.guardianName} ({r.guardianRelation})
                  </td>
                  <td className="px-4 py-3">{r.shuttleRoute}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${r.attendance === "입실" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {r.attendance}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/residents/${r.id}`} className="text-sky-600 hover:underline">
                      보기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
