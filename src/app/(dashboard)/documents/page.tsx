"use client";

import Link from "next/link";
import { FileSpreadsheet, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DocumentsPage() {
  const docList: any[] = [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>공단 평가 대응서식</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">문서 자동화 & 장기요양 서식함</h1>
          <p className="mt-1 text-sm text-slate-600">
            일일 케어 입력 데이터가 법정 장기요양 급여제공기록지 및 결재 양식으로 실시간 자동 변환됩니다.
          </p>
        </div>
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Printer size={18} /> 서식 인쇄 / PDF 출력
        </Button>
      </div>

      {docList.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <h3 className="text-base font-black text-slate-900">생성된 문서 서식이 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            통합 문서 AI 메뉴에서 일일 케어 또는 가정통신문 등의 문서를 생성하면 자동으로 보관됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {docList.map((d) => (
            <Link
              key={d.id}
              href={`/documents/${d.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-sky-500 hover:shadow-md block"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 font-bold text-sky-800">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-sky-600">{d.title}</h2>
                    <p className="text-xs text-slate-500">
                      분류: {d.category} | 작성: {d.author} | 작성일: {d.date}
                    </p>
                  </div>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${d.status === "승인완료" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  {d.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
