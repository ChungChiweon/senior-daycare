"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Lock, Mail, Shield, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("manager@daycare-a.com");
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setNotification("🔑 사용자 세션 인증 중...");

    setTimeout(() => {
      setIsLoading(false);
      // Check if user has an active organization
      const hasOrg = localStorage.getItem("silvercare.hasOrganization") !== "false";
      if (hasOrg) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-6 text-xs text-slate-300">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white font-black text-xl shadow-lg mb-1">
            행
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">행복주간보호 센터 ERP 로그인</h1>
          <p className="text-xs text-slate-400">
            주간보호 센터 운영, AI 문서 자동화 및 협업 멀티테넌트 SaaS
          </p>
        </div>

        {notification && (
          <div className="rounded-xl bg-sky-950 border border-sky-800 p-3 text-sky-200 font-bold flex items-center gap-2">
            <Sparkles size={15} className="text-sky-400 animate-spin" />
            <span>{notification}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="font-extrabold text-slate-300 block text-[11px]">이메일 주소</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white font-medium focus:border-sky-500 focus:outline-none"
                placeholder="email@center.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-extrabold text-slate-300 block text-[11px]">비밀번호</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white font-medium focus:border-sky-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black text-xs h-10 shadow-md"
          >
            {isLoading ? "인증 확인 중..." : "ERP 서비스 로그인"}
          </Button>
        </form>

        <div className="border-t border-slate-800 pt-4 text-center space-y-2 text-[11px]">
          <span className="text-slate-500 font-medium">아직 등록된 센터 계정이 없으신가요?</span>
          <div>
            <Link href="/auth/register" className="font-bold text-sky-400 hover:underline">
              신규 주간보호 센터 관리자 회원가입 ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
