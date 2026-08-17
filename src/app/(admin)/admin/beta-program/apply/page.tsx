"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

export default function BetaInstitutionApplyPage() {
  const [centerName, setCenterName] = useState("기관 C (신규 신청)");
  const [residentCount, setResidentCount] = useState<number>(30);
  const [hasSocialWorker, setHasSocialWorker] = useState<boolean>(true);
  const [hasStaffTraining, setHasStaffTraining] = useState<boolean>(true);
  const [hasSampleDocs, setHasSampleDocs] = useState<boolean>(true);
  const [hasTestPeriod, setHasTestPeriod] = useState<boolean>(true);
  const [itLevel, setItLevel] = useState("중간 (스마트폰 카카오톡 활용 가능)");
  const [evaluated, setEvaluated] = useState(false);

  // Evaluates score
  const isGreen =
    residentCount >= 20 &&
    hasSocialWorker &&
    hasStaffTraining &&
    hasSampleDocs &&
    hasTestPeriod;

  const isYellow = residentCount >= 15 && hasSocialWorker;

  function handleEvaluate(e: React.FormEvent) {
    e.preventDefault();
    setEvaluated(true);
  }

  return (
    <div className="space-y-6 text-xs max-w-3xl mx-auto py-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <Link href="/admin/beta-program" className="text-sky-600 font-bold hover:underline">
            ← 베타 파일럿 프로그램 목록으로
          </Link>
          <span className="text-slate-300">|</span>
          <Badge className="bg-amber-400 text-slate-950 font-black text-xs">
            기관 자격 진단 스크리너
          </Badge>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleEvaluate} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-base font-black text-slate-900 flex items-center gap-2">
            <ShieldCheck size={20} className="text-sky-600" /> 신규 베타 참여 주간보호센터 적합성 진단 (`/admin/beta-program/apply`)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            주간보호센터의 어르신 규모, 종사자 협조 여부 및 IT 활용 수준을 평가하여 Green/Yellow/Red 사전 판정을 내립니다.
          </p>
        </div>

        {/* Section 1: Institution Conditions */}
        <div className="space-y-3">
          <h2 className="font-black text-slate-900 text-xs border-b border-slate-100 pb-1">
            1. 베타 기관 필수 적합 조건
          </h2>

          <div className="space-y-2">
            <div className="space-y-1">
              <label className="font-extrabold text-slate-700 block text-[11px]">이용자 수급자 인원 규모 (명)</label>
              <input
                type="number"
                value={residentCount}
                onChange={(e) => setResidentCount(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs font-bold text-slate-900 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 pt-1">
              <label className="rounded-xl border border-slate-200 p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasSocialWorker}
                  onChange={(e) => setHasSocialWorker(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="font-bold text-slate-800 text-[11px]">사회복지사 전담 인력 협조 가능</span>
              </label>

              <label className="rounded-xl border border-slate-200 p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasStaffTraining}
                  onChange={(e) => setHasStaffTraining(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="font-bold text-slate-800 text-[11px]">전 직원 10분 교육 참여 가능</span>
              </label>

              <label className="rounded-xl border border-slate-200 p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasSampleDocs}
                  onChange={(e) => setHasSampleDocs(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="font-bold text-slate-800 text-[11px]">기존 수급자 및 샘플 문서 제공 가능</span>
              </label>

              <label className="rounded-xl border border-slate-200 p-3 flex items-center gap-2 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={hasTestPeriod}
                  onChange={(e) => setHasTestPeriod(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span className="font-bold text-slate-800 text-[11px]">4주 파일럿 테스트 기간 확보 가능</span>
              </label>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black text-xs h-10 shadow-md">
          센터 진단 평가 실시 및 판정 출력
        </Button>
      </form>

      {/* Decision Output Box */}
      {evaluated && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="font-black text-slate-900 text-sm">
              📋 [{centerName}] 베타 파일럿 최종 평가 결과
            </h2>
          </div>

          {isGreen ? (
            <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-4 space-y-2 text-emerald-950">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-black text-sm px-3 py-1">
                  🟢 Green: 최적합 (Highly Recommended)
                </Badge>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                어르신 정원 20명 이상 및 전담 사회복지사와 현장 교육 여건이 완벽히 갖추어져 즉시 4주 파일럿 프로그램 생성이 가능합니다!
              </p>
              <div className="pt-2">
                <Link href="/onboarding">
                  <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4">
                    즉시 기관 온보딩 라우트로 이동 ➔
                  </Button>
                </Link>
              </div>
            </div>
          ) : isYellow ? (
            <div className="rounded-xl bg-amber-50 border border-amber-300 p-4 space-y-2 text-amber-950">
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-600 text-white font-black text-sm px-3 py-1">
                  🟡 Yellow: 조건부 적합 (Conditional)
                </Badge>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                일부 필수 조건(교육 시간 확보 또는 엑셀 CSV 샘플 지원)이 미비합니다. 사전 조율 후 참여가 가능합니다.
              </p>
            </div>
          ) : (
            <div className="rounded-xl bg-red-50 border border-red-300 p-4 space-y-2 text-red-950">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-600 text-white font-black text-sm px-3 py-1">
                  🔴 Red: 부적합 (Unsuited)
                </Badge>
              </div>
              <p className="text-xs font-medium leading-relaxed">
                이용자 정원 수 미달 또는 전담 사회복지사 부재로 파일럿 가동이 어렵습니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
