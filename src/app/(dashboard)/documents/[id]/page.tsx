"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Eye, History, Printer, Save, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const docId = resolvedParams.id;
  const [activeTab, setActiveTab] = useState<"preview" | "edit" | "versions">("preview");

  // Editable Form State
  const [formData, setFormData] = useState({
    residentName: "김순자 어르신",
    careNumber: "L8230192301",
    grade: "3등급",
    physicalNotes: "식사 전량 섭취, 송영차량 이동 안전 케어",
    cognitiveNotes: "칠교놀이 60분 참여, 회상 대화 적극 소통",
    nursingNotes: "혈압 120/80, 체온 36.5℃, 점심 식후 약 투약"
  });

  const [message, setMessage] = useState("");

  function handleSave() {
    setMessage("서식 수정 내용이 저장되었습니다.");
    setActiveTab("preview");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/documents" className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline mb-2">
          <ArrowLeft size={16} /> 서식 목록으로 돌아가기
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div>
            <Badge>장기요양기관 지정 서식</Badge>
            <h1 className="mt-2 text-2xl font-black text-slate-900">장기요양 급여제공기록지 (주·야간보호)</h1>
            <p className="mt-1 text-xs font-semibold text-slate-500">서식코드: [별지 제24호 서식] | 문서 ID: {docId} | 작성일자: 2026년 7월 30일</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="text-xs font-bold" onClick={() => window.print()}>
              <Printer size={15} /> 인쇄하기
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700 text-xs font-bold">
              <Send size={15} /> 시설장 결재 상신
            </Button>
          </div>
        </div>
      </div>

      {message && <div className="rounded-lg bg-sky-50 border border-sky-200 p-3 text-xs font-bold text-sky-800">{message}</div>}

      {/* 3 Distinct View Tabs: Preview / Edit / Versions */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition ${activeTab === "preview" ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
          onClick={() => setActiveTab("preview")}
        >
          <Eye size={16} /> 미리보기 (법정 서식)
        </button>
        <button
          type="button"
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition ${activeTab === "edit" ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
          onClick={() => setActiveTab("edit")}
        >
          <Edit3 size={16} /> 서식 내용 편집
        </button>
        <button
          type="button"
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border transition ${activeTab === "versions" ? "bg-sky-600 text-white border-sky-600 shadow-xs" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}
          onClick={() => setActiveTab("versions")}
        >
          <History size={16} /> 버전 이력 (Version History)
        </button>
      </div>

      {/* 1. Preview Mode */}
      {activeTab === "preview" && (
        <div className="rounded-2xl border border-slate-300 bg-white p-8 shadow-md font-sans text-xs space-y-6">
          <div className="border-b-2 border-slate-800 pb-4 text-center">
            <h2 className="text-xl font-black text-slate-900">장기요양 급여제공기록지 (주·야간보호)</h2>
            <p className="text-slate-500 text-[11px] mt-1">국민건강보험공단 노인장기요양보험법 시행규칙 [별지 제24호서식]</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
            <div>수급자 성명: <span className="font-bold">{formData.residentName}</span></div>
            <div>장기요양인정번호: <span className="font-mono font-bold">{formData.careNumber}</span></div>
            <div>장기요양등급: <span className="font-bold">{formData.grade}</span></div>
            <div>기관명: <span className="font-bold">행복주간보호센터 (1234567890)</span></div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">일일 케어 및 급여 제공 상세</h3>
            <table className="w-full border-collapse border border-slate-300 text-center text-xs">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="border border-slate-300 p-2">구분</th>
                  <th className="border border-slate-300 p-2">세부 항목</th>
                  <th className="border border-slate-300 p-2">제공 내역</th>
                  <th className="border border-slate-300 p-2">제공자</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold">신체활동 지원</td>
                  <td className="border border-slate-300 p-2">세면, 식사, 이동도움</td>
                  <td className="border border-slate-300 p-2 text-left px-3">{formData.physicalNotes}</td>
                  <td className="border border-slate-300 p-2">요양보호사</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold">인지관리 지원</td>
                  <td className="border border-slate-300 p-2">인지자극, 회상요법</td>
                  <td className="border border-slate-300 p-2 text-left px-3">{formData.cognitiveNotes}</td>
                  <td className="border border-slate-300 p-2">사회복지사</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-bold">간호 및 처치</td>
                  <td className="border border-slate-300 p-2">혈압, 체온, 투약</td>
                  <td className="border border-slate-300 p-2 text-left px-3">{formData.nursingNotes}</td>
                  <td className="border border-slate-300 p-2">간호조무사</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Edit Mode */}
      {activeTab === "edit" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">급여제공기록지 서식 데이터 편집</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">수급자 성함</label>
              <input
                className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-sky-300 font-semibold text-slate-900"
                value={formData.residentName}
                onChange={(e) => setFormData({ ...formData, residentName: e.target.value })}
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">장기요양 인정번호</label>
              <input
                className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-sky-300 font-mono text-slate-900"
                value={formData.careNumber}
                onChange={(e) => setFormData({ ...formData, careNumber: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">신체활동 지원 기록</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-sky-300 text-slate-900"
              rows={2}
              value={formData.physicalNotes}
              onChange={(e) => setFormData({ ...formData, physicalNotes: e.target.value })}
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">인지관리 지원 기록</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-sky-300 text-slate-900"
              rows={2}
              value={formData.cognitiveNotes}
              onChange={(e) => setFormData({ ...formData, cognitiveNotes: e.target.value })}
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">간호 및 처치 기록</label>
            <textarea
              className="w-full rounded-lg border border-slate-200 p-2.5 outline-none focus:ring-2 focus:ring-sky-300 text-slate-900"
              rows={2}
              value={formData.nursingNotes}
              onChange={(e) => setFormData({ ...formData, nursingNotes: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button className="bg-sky-600 hover:bg-sky-700 font-bold text-xs" onClick={handleSave}>
              <Save size={15} /> 저장하고 미리보기로 이동
            </Button>
          </div>
        </div>
      )}

      {/* 3. Version History Mode */}
      {activeTab === "versions" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 text-xs">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">문서 수정 및 결재 이력 (Version History)</h2>
          <div className="space-y-3 font-semibold">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">v1.2 (최종 결재본)</span>
                <p className="text-slate-500 font-normal">2026-07-30 17:30 · 시설장 승인완료 (체온, 식사 기록 검증)</p>
              </div>
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 font-bold">현재 버전</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">v1.1 (수정 초안)</span>
                <p className="text-slate-500 font-normal">2026-07-30 14:10 · 요양보호사 신체활동 보행 조력 문구 추가</p>
              </div>
              <Button variant="secondary" className="text-[11px] font-bold py-1 h-7">비교</Button>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900">v1.0 (최초 작성)</span>
                <p className="text-slate-500 font-normal">2026-07-30 09:00 · 박지영 사회복지사 일괄 자동 생성</p>
              </div>
              <Button variant="secondary" className="text-[11px] font-bold py-1 h-7">복원</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
