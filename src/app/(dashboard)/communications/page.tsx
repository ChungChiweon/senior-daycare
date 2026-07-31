"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockResidents } from "@/data/mock-daycare-store";

export default function CommunicationsPage() {
  const [selectedResident, setSelectedResident] = useState(mockResidents[0].id);
  const [channel, setChannel] = useState<"kakao" | "sms">("kakao");
  const [message, setMessage] = useState("");

  const currentResident = mockResidents.find((r) => r.id === selectedResident) ?? mockResidents[0];

  function generateAiNotice() {
    const text = `[행복주간보호센터 일일 알림장]
${currentResident.name} 어르신 보호자님, 안녕하십니까.
오늘 어르신께서는 신체 건강체조와 뇌자극 프로그램에 환한 웃음으로 참여하셨습니다.
점심 식사(${currentResident.mealLunch})와 지정 투약(${currentResident.medication})도 안심하고 섭취하셨으며, 혈압(${currentResident.bloodPressure})과 체온(${currentResident.temperature}) 모두 건강한 상태입니다.
늘 따뜻한 관심에 감사드리며, 가정에서도 편안한 저녁 시간 보내시길 바랍니다.`;

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

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        {/* Left Resident Selection List */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">어르신 선택</h2>
          <div className="space-y-2">
            {mockResidents.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`w-full text-left p-3 rounded-lg border transition ${selectedResident === r.id ? "bg-sky-50 border-sky-500 shadow-xs" : "bg-white border-slate-200 hover:bg-slate-50"}`}
                onClick={() => setSelectedResident(r.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{r.name} 어르신</span>
                  <span className="text-xs font-semibold text-slate-500">{r.guardianName} ({r.guardianRelation})</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 flex justify-between">
                  <span>체온: {r.temperature}</span>
                  <span className="font-bold text-sky-700">{r.recordStatus}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Composer Workspace */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{currentResident.name} 어르신 알림장 작성</h2>
              <p className="text-xs text-slate-500">보호자: {currentResident.guardianName} ({currentResident.guardianPhone})</p>
            </div>
            <Button className="bg-sky-600 hover:bg-sky-700 font-bold text-xs" onClick={generateAiNotice}>
              <Sparkles size={16} /> AI 알림장 문안 생성
            </Button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${channel === "kakao" ? "bg-amber-400 text-slate-900 border-amber-400" : "bg-white border-slate-200 text-slate-600"}`}
              onClick={() => setChannel("kakao")}
            >
              💬 카카오 알림톡 전송
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${channel === "sms" ? "bg-sky-600 text-white border-sky-600" : "bg-white border-slate-200 text-slate-600"}`}
              onClick={() => setChannel("sms")}
            >
              📱 SMS 문자 전송
            </button>
          </div>

          <textarea
            className="w-full min-h-64 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-sans leading-relaxed text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-sky-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="[AI 알림장 문안 생성] 버튼을 누르시면 어르신의 당일 건강/식사/투약 상태 기반 메시지가 자동 작성됩니다..."
          />

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="secondary" className="text-xs font-bold" onClick={() => navigator.clipboard.writeText(message)}>
              텍스트 복사
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold">
              <Send size={15} /> 보호자 전송
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
