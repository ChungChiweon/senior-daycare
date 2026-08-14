"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ArrowRight,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Sparkles,
  UserCheck,
  Users,
  X,
  Zap
} from "lucide-react";
import { mockResidents } from "@/data/mock-daycare-store";
import { localTaskRepository } from "@/lib/repository/local-task-repository";

export function GlobalErpSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.trim().toLowerCase();

    // 1. Search Residents & Guardians from user registered state
    let registeredResidents: typeof mockResidents = [];
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("silvercare.residents");
      if (raw) {
        try {
          registeredResidents = JSON.parse(raw);
        } catch {
          registeredResidents = [];
        }
      }
    }

    const residents = registeredResidents.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.guardianName.toLowerCase().includes(q) ||
        r.careNumber.includes(q)
    );

    // 2. Search Tasks
    const tasks = localTaskRepository.getTasks().filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        (t.residentName && t.residentName.toLowerCase().includes(q))
    );

    // 3. Search Documents (user generated)
    const docs: { id: string; title: string; category: string; date: string }[] = [];

    // 4. Search RecordBlocks
    const blocks: { id: string; title: string; resident: string }[] = [];

    return { residents, tasks, docs, blocks };
  }, [query]);

  return (
    <div className="relative">
      {/* Search Input Trigger Bar */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex h-9 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-500 hover:border-sky-400 hover:shadow-2xs cursor-pointer transition"
      >
        <Search size={15} className="text-sky-600 shrink-0" />
        <span className="truncate text-slate-400">
          통합 ERP 검색 (어르신 이름, 보호자, 문서, 협업 업무)...
        </span>
        <span className="ml-auto rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
          ⌘K
        </span>
      </div>

      {/* Full Modal Search Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 space-y-4 shadow-2xl border border-slate-200">
            {/* Top Search Input */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Search size={18} className="text-sky-600 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="어르신 성함, 인정번호, 보호자, 문서명, 협업 업무 검색..."
                className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:font-normal"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            {/* Default Quick Search Presets */}
            {!query.trim() && (
              <div className="space-y-2 py-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  빠른 검색 추천 어르신
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {mockResidents.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setQuery(r.name)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-900 transition"
                    >
                      👤 {r.name} 어르신 ({r.gradeLabel})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Streams */}
            {searchResults && (
              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                {/* 1. Residents Results */}
                {searchResults.residents.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                      <Users size={14} className="text-sky-600" /> 이용자 프로필 ({searchResults.residents.length}건)
                    </span>
                    <div className="space-y-1">
                      {searchResults.residents.map((r) => (
                        <Link
                          key={r.id}
                          href={`/residents/${r.id}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 hover:bg-sky-50 hover:border-sky-300 transition text-xs"
                        >
                          <div>
                            <span className="font-extrabold text-slate-900">{r.name} 어르신</span>
                            <span className="text-slate-500 ml-2 text-[11px]">
                              {r.gender}, {r.age}세 | 보호자: {r.guardianName} ({r.guardianPhone})
                            </span>
                          </div>
                          <Badge className="bg-sky-100 text-sky-900 border-sky-300 font-bold">
                            {r.gradeLabel}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Tasks Results */}
                {searchResults.tasks.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                      <Zap size={14} className="text-indigo-600" /> 협업 업무 요청 ({searchResults.tasks.length}건)
                    </span>
                    <div className="space-y-1">
                      {searchResults.tasks.map((t) => (
                        <Link
                          key={t.requestId}
                          href="/tasks"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 hover:bg-indigo-50 hover:border-indigo-300 transition text-xs"
                        >
                          <div>
                            <span className="font-extrabold text-slate-900">{t.title}</span>
                            <span className="text-slate-500 block text-[11px]">
                              담당: {t.assigneeName} | 요청자: {t.requesterName}
                            </span>
                          </div>
                          <Badge className="bg-indigo-100 text-indigo-900 border-indigo-300 font-bold">
                            {t.requestId}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Documents Results */}
                {searchResults.docs.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                      <FileText size={14} className="text-purple-600" /> 20종 AI 생성 문서 ({searchResults.docs.length}건)
                    </span>
                    <div className="space-y-1">
                      {searchResults.docs.map((d) => (
                        <Link
                          key={d.id}
                          href="/create"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 hover:bg-purple-50 hover:border-purple-300 transition text-xs"
                        >
                          <span className="font-extrabold text-slate-900">{d.title}</span>
                          <span className="text-[10px] text-purple-700 font-bold">{d.category}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.residents.length === 0 &&
                  searchResults.tasks.length === 0 &&
                  searchResults.docs.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      검색어 &quot;{query}&quot;에 일치하는 ERP 데이터가 없습니다.
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
