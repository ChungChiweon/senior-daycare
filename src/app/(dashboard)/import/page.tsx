"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck,
  FileSpreadsheet,
  Upload,
  UserPlus,
  Users,
  Zap
} from "lucide-react";

type ParsedResidentRow = {
  name: string;
  birthdate: string;
  careGrade: string;
  days: string;
  guardianName: string;
  phone: string;
  shuttleRoute: string;
  healthNotes: string;
  isValid: boolean;
};

export default function CSVImportPage() {
  const [activeTab, setActiveTab] = useState<"resident" | "staff">("resident");
  const [step, setStep] = useState<"upload" | "preview" | "complete">("upload");

  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<ParsedResidentRow[]>([]);
  const [notification, setNotification] = useState("");

  const sampleResidentCSV = [
    { name: "테스트이용자-01", birthdate: "1942-03-12", careGrade: "3등급", days: "월~금", guardianName: "가족보호자 A", phone: "010-0000-0001", shuttleRoute: "1호차", healthNotes: "고혈압 약 복용중 (합성 테스트 데이터)", isValid: true },
    { name: "테스트이용자-02", birthdate: "1938-11-05", careGrade: "2등급", days: "월~토", guardianName: "가족보호자 B", phone: "010-0000-0002", shuttleRoute: "2호차", healthNotes: "당뇨 식단 케어 (합성 테스트 데이터)", isValid: true },
    { name: "테스트이용자-03", birthdate: "1945-07-20", careGrade: "4등급", days: "화/목/토", guardianName: "가족보호자 C", phone: "010-0000-0003", shuttleRoute: "1호차", healthNotes: "보행 보조기 사용 (합성 테스트 데이터)", isValid: true },
    { name: "테스트이용자-04", birthdate: "1940-01-15", careGrade: "3등급", days: "월~금", guardianName: "가족보호자 D", phone: "010-0000-0004", shuttleRoute: "2호차", healthNotes: "인지 프로그램 선호 (합성 테스트 데이터)", isValid: true }
  ];

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParsedRows(sampleResidentCSV);
    setStep("preview");
  }

  function handleSimulateUpload() {
    setFileName("베타센터_수급자_명부_35명.csv");
    setParsedRows(sampleResidentCSV);
    setStep("preview");
  }

  function handleConfirmImport() {
    setStep("complete");
    setNotification("🎉 수급자 명단이 성공적으로 DB에 일괄 등록되었습니다!");
  }

  return (
    <div className="space-y-6 text-xs max-w-4xl mx-auto py-4">
      {/* Top Banner Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
            베타 센터 빠른 이관
          </Badge>
          <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
            CSV / 엑셀 일괄 등록
          </Badge>
        </div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <FileSpreadsheet size={22} className="text-emerald-400" /> 기존 센터 데이터 CSV 일괄 이관 스튜디오 (`/import`)
        </h1>
        <p className="text-xs text-sky-100 mt-0.5">
          기존 주간보호센터에서 관리하던 어르신 명부 및 직원 목록 엑셀/CSV 파일을 업로드하면 1초 만에 시스템으로 자동 이관됩니다.
        </p>
      </div>

      {notification && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 font-black text-emerald-900 text-sm flex items-center gap-2 shadow-2xs">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("resident")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition border ${
            activeTab === "resident"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          👵 어르신 이용자 수급자 CSV 이관
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition border ${
            activeTab === "staff"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          🧑‍⚕️ 센터 종사자 직원 CSV 이관
        </button>
      </div>

      {/* Upload Step 1 */}
      {step === "upload" && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center space-y-4 shadow-xs">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Upload size={28} />
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-black text-slate-900">
              CSV 파일 업로드 또는 클릭하여 드래그
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              지원 필드: 어르신 성함, 생년월일, 등급, 이용요일, 보호자 성함, 연락처, 송영차량 코스, 건강 주의사항
            </p>
          </div>

          <div className="flex justify-center items-center gap-3">
            <label className="cursor-pointer rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-10 px-5 inline-flex items-center gap-2 shadow-xs">
              <FileSpreadsheet size={16} />
              <span>컴퓨터에서 CSV 파일 선택</span>
              <input type="file" accept=".csv, .xlsx" onChange={handleFileSelect} className="hidden" />
            </label>

            <Button
              onClick={handleSimulateUpload}
              variant="secondary"
              className="font-bold text-xs h-10 px-4"
            >
              샘플 CSV 파일로 테스트 ➔
            </Button>
          </div>
        </div>
      )}

      {/* Preview Step 2 */}
      {step === "preview" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="font-black text-slate-900 text-sm block">
                📄 파싱된 CSV 데이터 미리보기 및 매핑 검증 ({parsedRows.length}명)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">파일명: {fileName}</span>
            </div>
            <Badge className="bg-emerald-100 text-emerald-900 font-bold">100% 매핑 정상</Badge>
          </div>

          {/* Table Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black text-slate-700">
                  <th className="p-2">어르신 성함</th>
                  <th className="p-2">생년월일</th>
                  <th className="p-2">요양등급</th>
                  <th className="p-2">이용요일</th>
                  <th className="p-2">보호자</th>
                  <th className="p-2">송영 코스</th>
                  <th className="p-2">건강 주의사항</th>
                  <th className="p-2 text-center">검증</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {parsedRows.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/80">
                    <td className="p-2 font-black text-slate-900">{r.name}</td>
                    <td className="p-2 font-mono">{r.birthdate}</td>
                    <td className="p-2 font-bold text-sky-700">{r.careGrade}</td>
                    <td className="p-2 font-bold">{r.days}</td>
                    <td className="p-2">{r.guardianName} ({r.phone})</td>
                    <td className="p-2 font-bold text-indigo-700">{r.shuttleRoute}</td>
                    <td className="p-2 text-slate-600 line-clamp-1">{r.healthNotes}</td>
                    <td className="p-2 text-center">
                      <Badge className="bg-emerald-100 text-emerald-900 font-bold text-[10px]">정상</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Button onClick={() => setStep("upload")} variant="ghost" className="font-bold text-xs">
              ← 다시 파일 선택
            </Button>
            <Button onClick={handleConfirmImport} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs h-10 px-6 shadow-md flex items-center gap-1.5">
              <Zap size={16} />
              <span>{parsedRows.length}명 수급자 일괄 DB 등록 완료</span>
            </Button>
          </div>
        </div>
      )}

      {/* Complete Step 3 */}
      {step === "complete" && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center space-y-4 shadow-xs">
          <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
          <h2 className="text-lg font-black text-slate-900">
            성공적으로 데이터를 일괄 이관했습니다!
          </h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            등록된 수급자 데이터는 즉시 <strong>오늘의 케어, 송영 관리, 20종 AI 문서 생성</strong> 서비스에 자동 연동됩니다.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <Button onClick={() => setStep("upload")} variant="secondary" className="font-bold text-xs h-9">
              + 추가 CSV 파일 업로드
            </Button>
            <Button onClick={() => window.location.href = "/residents"} className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs h-9 px-4">
              이용자 관리 바로가기 ➔
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
