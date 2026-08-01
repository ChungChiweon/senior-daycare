"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle2, Lock, Mail, Phone, User, Zap } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("manager");
  const [isLoading, setIsLoading] = useState(false);

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("silvercare.hasOrganization", "false");
      router.push("/onboarding");
    }, 1000);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8 shadow-2xl space-y-5 text-xs text-slate-300">
        <div className="text-center space-y-1">
          <Badge className="bg-sky-500/20 text-sky-300 border-sky-400/30 text-[10px] font-bold mb-1">
            신규 센터 관리자 회원가입
          </Badge>
          <h1 className="text-xl font-black text-white tracking-tight">주간보호 센터 ERP 시작하기</h1>
          <p className="text-xs text-slate-400">
            가입 후 기관 온보딩을 진행하시면 시설장 권한이 자동 부여됩니다.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="font-extrabold text-slate-300 block text-[11px]">성함</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white font-medium focus:border-sky-500 focus:outline-none"
                placeholder="홍길동 센터장"
              />
            </div>
          </div>

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

          <div className="space-y-1">
            <label className="font-extrabold text-slate-300 block text-[11px]">휴대폰 번호</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-9 pr-3 text-xs text-white font-medium focus:border-sky-500 focus:outline-none"
                placeholder="010-1234-5678"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black text-xs h-10 shadow-md mt-2"
          >
            {isLoading ? "가입 계정 생성 중..." : "회원가입 후 기관 온보딩 진행"}
          </Button>
        </form>

        <div className="border-t border-slate-800 pt-3 text-center text-[11px]">
          <Link href="/auth/login" className="font-bold text-slate-400 hover:text-white">
            이미 계정이 있으신가요? 로그인으로 이동 ➔
          </Link>
        </div>
      </div>
    </div>
  );
}
