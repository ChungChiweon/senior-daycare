"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, MapPin, Phone, ShieldCheck, Users, Zap } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [centerName, setCenterName] = useState("");
  const [businessNum, setBusinessNum] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleCreateOrganization(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      localStorage.setItem("silvercare.hasOrganization", "true");
      localStorage.setItem("silvercare.activeRole", "manager");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }, 1200);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-xs py-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-xl space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-sky-400/20 text-sky-200 border-sky-300/30 text-xs font-bold">
            🏢 센터 관리자 전용
          </Badge>
          <Badge className="bg-emerald-400/20 text-emerald-200 border-emerald-300/30 text-xs font-bold">
            SaaS 온보딩
          </Badge>
        </div>
        <h1 className="text-xl font-black text-white flex items-center gap-2">
          <Building2 size={24} className="text-sky-400" /> 주간보호 센터 신규 생성 (Onboarding)
        </h1>
        <p className="text-xs text-sky-100 mt-0.5">
          기관 정보를 등록하시면 등록한 관리자 계정에 시설장(`manager`) 권한이 자동 부여되며, 즉시 직원 초대 및 수급자 등록이 가능합니다.
        </p>
      </div>

      {isSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 font-black text-emerald-900 text-sm flex items-center gap-2 shadow-xs">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>🎉 [${centerName}] 주간보호센터가 성공적으로 생성되었습니다! 대시보드로 이동합니다...</span>
        </div>
      )}

      <form onSubmit={handleCreateOrganization} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-sm font-black text-slate-900">📋 기본 기관 정보 입력</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">기관명 (센터 대표 명칭)</label>
            <input
              type="text"
              required
              value={centerName}
              onChange={(e) => setCenterName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 font-bold focus:border-sky-500 focus:bg-white focus:outline-none"
              placeholder="예: 우리 기관명"
            />
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">고유 사업자등록번호</label>
            <input
              type="text"
              required
              value={businessNum}
              onChange={(e) => setBusinessNum(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 text-xs text-slate-900 font-bold focus:border-sky-500 focus:bg-white focus:outline-none font-mono"
              placeholder="000-00-00000"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">센터 소재지 도로명 주소</label>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 font-bold focus:border-sky-500 focus:bg-white focus:outline-none"
                placeholder="서울특별시 강남구..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">대표 전화번호</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 font-bold focus:border-sky-500 focus:bg-white focus:outline-none"
                placeholder="02-000-0000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-700 block text-[11px]">인증 정원 규모 (명)</label>
            <div className="relative">
              <Users size={15} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="number"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-9 pr-3 text-xs text-slate-900 font-bold focus:border-sky-500 focus:bg-white focus:outline-none"
                placeholder="35"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-sky-50 border border-sky-200 p-3 space-y-1 text-sky-950 font-medium">
          <span className="font-bold text-xs flex items-center gap-1 text-sky-900">
            <ShieldCheck size={14} className="text-sky-600" /> 시설장 자동 권한 안내
          </span>
          <p className="text-[11px] text-sky-800 leading-relaxed">
            기관 생성을 완료하면 현재 계정에 <strong>시설장 (`manager`)</strong> 권한이 부여되며, RLS 멀티테넌트 데이터베이스에 독립된 테넌트 ID가 할당됩니다.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black text-xs h-10 shadow-md flex items-center justify-center gap-2"
        >
          <Zap size={16} />
          <span>{isLoading ? "기관 멀티테넌트 테넌트 생성 중..." : "주간보호 센터 생성 완료 및 업무 시작"}</span>
        </Button>
      </form>
    </div>
  );
}
