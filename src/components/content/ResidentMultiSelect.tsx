"use client";

import { useMemo, useState } from "react";
import { Check, Search, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CareGroup, IntegratedResident } from "@/types/integrated-care";

type Props = {
  residents: IntegratedResident[];
  selectedIds: string[];
  onSelectChange: (nextSelectedIds: string[]) => void;
};

export function ResidentMultiSelect({ residents, selectedIds, onSelectChange }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroupFilter, setActiveGroupFilter] = useState<"ALL" | CareGroup>("ALL");
  const [attendanceOnlyFilter, setAttendanceOnlyFilter] = useState(true);

  const totalCount = residents.length;
  const attendedCount = useMemo(() => residents.filter((r) => r.attendanceStatus === "출석").length, [residents]);
  const selectedCount = selectedIds.length;

  const filteredResidents = useMemo(() => {
    return residents.filter((r) => {
      const matchSearch = r.name.includes(searchTerm) || r.careNumber.includes(searchTerm);
      const matchGroup = activeGroupFilter === "ALL" || r.group === activeGroupFilter;
      const matchAttendance = !attendanceOnlyFilter || r.attendanceStatus === "출석";
      return matchSearch && matchGroup && matchAttendance;
    });
  }, [residents, searchTerm, activeGroupFilter, attendanceOnlyFilter]);

  function handleToggle(resident: IntegratedResident) {
    if (resident.attendanceStatus === "결석") {
      // Allow selecting if explicitly forced, but warn
      if (selectedIds.includes(resident.id)) {
        onSelectChange(selectedIds.filter((id) => id !== resident.id));
      } else {
        const confirmSelect = confirm(`${resident.name} 어르신은 결석 상태입니다. 선택 목록에 추가하시겠습니까?`);
        if (confirmSelect) {
          onSelectChange([...selectedIds, resident.id]);
        }
      }
      return;
    }

    if (selectedIds.includes(resident.id)) {
      onSelectChange(selectedIds.filter((id) => id !== resident.id));
    } else {
      onSelectChange([...selectedIds, resident.id]);
    }
  }

  function handleSelectAllAttended() {
    const attendedIds = residents.filter((r) => r.attendanceStatus === "출석").map((r) => r.id);
    onSelectChange(attendedIds);
  }

  function handleDeselectAll() {
    onSelectChange([]);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
      {/* Top Banner Stats */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-sky-600" />
          <span className="text-xs font-bold text-slate-900">
            오늘 이용자 <strong className="text-sky-700">{totalCount}명</strong> · 출석 <strong className="text-emerald-700">{attendedCount}명</strong> · 선택 <strong className="text-indigo-700">{selectedCount}명</strong>
          </span>
        </div>
        <div className="flex gap-1.5 text-[11px]">
          <button
            type="button"
            className="rounded bg-sky-50 px-2 py-1 font-bold text-sky-800 hover:bg-sky-100"
            onClick={handleSelectAllAttended}
          >
            출석자 전체 선택
          </button>
          <button
            type="button"
            className="rounded bg-slate-100 px-2 py-1 font-bold text-slate-600 hover:bg-slate-200"
            onClick={handleDeselectAll}
          >
            선택 해제
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[140px]">
          <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs font-medium text-slate-800 outline-none focus:border-sky-500 focus:bg-white"
            placeholder="이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-1 text-[11px]">
          {(["ALL", "A그룹", "B그룹", "C그룹"] as const).map((group) => (
            <button
              key={group}
              type="button"
              className={`h-8 rounded-lg px-2.5 font-bold transition border ${activeGroupFilter === group ? "bg-sky-600 text-white border-sky-600" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
              onClick={() => setActiveGroupFilter(group)}
            >
              {group === "ALL" ? "전체 그룹" : group}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer ml-auto">
          <input
            type="checkbox"
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            checked={attendanceOnlyFilter}
            onChange={(e) => setAttendanceOnlyFilter(e.target.checked)}
          />
          <span>출석자만</span>
        </label>
      </div>

      {/* Resident Avatar Chips */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4 max-h-[180px] overflow-y-auto pr-1">
        {filteredResidents.map((resident) => {
          const isSelected = selectedIds.includes(resident.id);
          const isAbsent = resident.attendanceStatus === "결석";

          return (
            <button
              key={resident.id}
              type="button"
              className={`flex items-center justify-between p-2 rounded-lg border text-left transition relative ${isSelected ? "bg-sky-50 border-sky-500 text-sky-900 shadow-2xs" : isAbsent ? "bg-slate-100 border-slate-200 text-slate-400 opacity-60" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              onClick={() => handleToggle(resident)}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-900 font-black text-xs shrink-0">
                  {resident.name[0]}
                </div>
                <div className="truncate">
                  <span className="block font-bold text-xs truncate">{resident.name}</span>
                  <span className="block text-[10px] text-slate-500 font-medium">
                    {resident.grade} · {resident.group}
                  </span>
                </div>
              </div>

              {isSelected ? (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-600 text-white shrink-0">
                  <Check size={12} />
                </div>
              ) : isAbsent ? (
                <Badge className="bg-rose-100 text-rose-700 text-[10px] px-1 py-0 border-0">결석</Badge>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
