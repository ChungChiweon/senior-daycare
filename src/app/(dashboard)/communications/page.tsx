"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Send, Sparkles, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Resident } from "@/data/mock-daycare-store";

export default function CommunicationsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [selectedResident, setSelectedResident] = useState<string>("");
  const [channel, setChannel] = useState<"kakao" | "sms">("kakao");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("silvercare.residents");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setResidents(parsed);
            setSelectedResident(parsed[0].id);
          }
        } catch {
          setResidents([]);
        }
      }
    }
  }, []);

  const currentResident = residents.find((r) => r.id === selectedResident);

  function generateAiNotice() {
    if (!currentResident) return;
    const text = `[행복주간보호센터 일일 알림장]
${currentResident.name} 어르신 보호자님, 안녕하십니까.
오늘 어르신께서는 센터 일일 케어와 프로그램에 참여하셨습니다.
점심 식사(${currentResident.mealLunch})와 지정 투약(${currentResident.medication})을 완료하셨으며, 혈압(${currentResident.bloodPressure})과 체온(${currentResident.temperature})을 확인하였습니다.
가정에서도 편안하고 건강한 저녁 시간 보내시길 바랍니다.`;

    setMessage(text);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Badge>보호자 소통 & AI 알림장</Badge>
        <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">보호자 일일 알림장 & 소통 센터</h1>
        <p className="mt-1 text-sm text-slate-600">
          어르신의 당일 케어 일지와 사진을 기반으로 보호자용 맞춤 알림장을 초안 생성하고 카카오톡/문자로 발송합니다.
        </p>
      </div>

      {residents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-4 shadow-xs">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sky-50 text-sky-600 mb-1">
            <Users size={32} />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-slate-900">아직 등록된 이용자가 없습니다.</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              먼저 이용자 관리 메뉴에서 가상 이용자를 등록해주시면 보호자 알림장 및 소통 기능을 이용하실 수 있습니다.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/residents">
              <Button className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-10 px-5 shadow-md">
                <UserPlus size={16} />
                + 가상 이용자 등록하러 가기
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
          {/* Left Resident Selection List */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">어르신 선택</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {residents.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedResident === r.id
                      ? "bg-sky-50 border-sky-500 shadow-xs"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                  onClick={() => setSelectedResident(r.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{r.name} 어르신</span>
                    <span className="text-xs font-semibold text-slate-500">
                      {r.guardianName} ({r.guardianRelation})
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500 flex justify-between">
                    <span>체온: {r.temperature}</span>
                    <span className="font-bold text-sky-700">{r.recordStatus}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Message Compose & AI Generator */}
          {currentResident ? (
            <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{currentResident.name} 어르신 알림장</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    수신자: {currentResident.guardianName} ({currentResident.guardianPhone})
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={generateAiNotice}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9 gap-1.5"
                  >
                    <Sparkles size={15} />
                    당일 기록 기반 AI 초안 생성
                  </Button>
                </div>
              </div>

              {/* Channel Selector */}
              <div className="flex gap-2 items-center text-xs font-bold text-slate-700">
                <span>발송 채널:</span>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    channel === "kakao"
                      ? "bg-amber-400 border-amber-500 text-amber-950"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                  onClick={() => setChannel("kakao")}
                >
                  🟡 카카오톡 알림톡
                </button>
                <button
                  type="button"
                  className={`px-3 py-1.5 rounded-lg border transition ${
                    channel === "sms"
                      ? "bg-sky-600 border-sky-600 text-white"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                  onClick={() => setChannel("sms")}
                >
                  📱 LMS/SMS 문자
                </button>
              </div>

              {/* Message Content Area */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 text-xs block">알림장 본문 내용 (직접 수정 가능)</label>
                <textarea
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="당일 케어 기록 기반 AI 초안을 생성하거나 직접 내용을 입력해주세요."
                  className="w-full rounded-xl border border-slate-300 p-3 text-xs leading-relaxed focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={() => {
                    alert("보호자 알림장이 발송 대기열에 등록되었습니다.");
                    setMessage("");
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 gap-1.5"
                >
                  <Send size={15} />
                  보호자 알림장 발송
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-400 text-xs">
              어르신을 선택해주세요.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
