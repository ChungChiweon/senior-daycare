"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, LayoutGrid, List, Search, UserPlus, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Resident } from "@/data/mock-daycare-store";

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("전체");
  const [cautionOnly, setCautionOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for manual registration
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"남" | "여">("여");
  const [age, setAge] = useState(82);
  const [birthDate, setBirthDate] = useState("1944.03.15");
  const [grade, setGrade] = useState<"1등급" | "2등급" | "3등급" | "4등급" | "5등급" | "인지지원등급">("3등급");
  const [careNumber, setCareNumber] = useState("L8200000001");
  const [guardianName, setGuardianName] = useState("보호자01");
  const [guardianRelation, setGuardianRelation] = useState("자녀");
  const [guardianPhone, setGuardianPhone] = useState("010-0000-0001");
  const [shuttleRoute, setShuttleRoute] = useState("송영 1호차 (08:30)");
  const [cautionNotes, setCautionNotes] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("silvercare.residents");
      if (raw) {
        try {
          setResidents(JSON.parse(raw));
        } catch {
          setResidents([]);
        }
      }
    }
  }, []);

  const saveResidents = (newList: Resident[]) => {
    setResidents(newList);
    if (typeof window !== "undefined") {
      localStorage.setItem("silvercare.residents", JSON.stringify(newList));
    }
  };

  const handleAddResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newRes: Resident = {
      id: `res-${Date.now()}`,
      name: name.trim(),
      initial: name.trim().slice(-2) || name.trim(),
      gender,
      age: Number(age) || 80,
      birthDate,
      grade,
      gradeLabel: grade,
      careNumber,
      group: "A",
      guardianName,
      guardianRelation,
      guardianPhone,
      attendance: "입실",
      attendanceTime: "09:00",
      shuttleRoute,
      healthStatus: "양호",
      bloodPressure: "120/80",
      temperature: "36.5℃",
      mealLunch: "전량",
      mealSnack: "완료",
      medication: "완료",
      recordStatus: "기록미작성",
      cautionNotes: cautionNotes.trim() || undefined
    };

    const updated = [newRes, ...residents];
    saveResidents(updated);
    setIsAddModalOpen(false);

    // Reset form
    setName("");
    setCautionNotes("");
  };

  const filteredResidents = residents.filter((r) => {
    const matchesSearch =
      r.name.includes(searchTerm) ||
      r.careNumber.includes(searchTerm) ||
      r.guardianName.includes(searchTerm);
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
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 font-bold">
          <UserPlus size={18} />
          신규 가상 어르신 등록
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-60 flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <Input
              className="pl-9 text-xs"
              placeholder="어르신 가명, 인정번호, 보호자 성함 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["전체", "1등급", "2등급", "3등급", "4등급", "5등급", "인지지원등급"].map((g) => (
              <button
                key={g}
                type="button"
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition border ${
                  gradeFilter === g
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
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

      {/* EMPTY STATE UI */}
      {residents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600 mb-1">
            <Users size={32} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">아직 등록된 이용자가 없습니다.</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              테스트용 가상 이용자를 직접 등록해 업무 흐름을 시작해보세요.<br />
              <strong className="text-amber-700">⚠️ 베타 기간에는 실제 개인정보가 아닌 가명과 가상 연락처를 사용해주세요.</strong>
            </p>
          </div>
          <div className="pt-2">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-10 px-5 shadow-md"
            >
              <UserPlus size={16} />
              + 테스트용 가상 이용자 직접 등록 (예: 테스트이용자-A01)
            </Button>
          </div>
        </div>
      ) : filteredResidents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 text-xs">
          검색 조건에 일치하는 어르신이 없습니다.
        </div>
      ) : viewMode === "card" ? (
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
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        r.attendance === "입실" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}
                    >
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

      {/* Manual Virtual Senior Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">가상 이용자(수급자) 직접 등록</h3>
                <p className="text-[11px] text-amber-700 font-semibold mt-0.5">
                  ⚠️ 베타 기간에는 실제 개인정보가 아닌 가명으로 입력해주세요.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddResident} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">이용자 가명 *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 테스트이용자-A01"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">성별</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "남" | "여")}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  >
                    <option value="여">여성</option>
                    <option value="남">남성</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">가상 생년월일</label>
                  <input
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    placeholder="1944.03.15"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">장기요양 등급</label>
                  <select
                    value={grade}
                    onChange={(e) =>
                      setGrade(e.target.value as "1등급" | "2등급" | "3등급" | "4등급" | "5등급" | "인지지원등급")
                    }
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  >
                    <option value="1등급">1등급</option>
                    <option value="2등급">2등급</option>
                    <option value="3등급">3등급</option>
                    <option value="4등급">4등급</option>
                    <option value="5등급">5등급</option>
                    <option value="인지지원등급">인지지원등급</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">가상 보호자명</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="보호자01"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">관계</label>
                  <input
                    type="text"
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value)}
                    placeholder="자녀"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">가상 연락처</label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="010-0000-0001"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">송영 차량 노선</label>
                <input
                  type="text"
                  value={shuttleRoute}
                  onChange={(e) => setShuttleRoute(e.target.value)}
                  placeholder="송영 1호차 (08:30)"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">케어 주의사항 (선택)</label>
                <input
                  type="text"
                  value={cautionNotes}
                  onChange={(e) => setCautionNotes(e.target.value)}
                  placeholder="예: 오후 물 섭취 권유 필요, 무릎 부축"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs h-9"
                >
                  취소
                </Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9">
                  등록 완료
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
