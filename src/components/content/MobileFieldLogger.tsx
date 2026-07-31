"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, PhoneCall, Plus, Save, Smartphone, Sparkles } from "lucide-react";

export type FieldRecord = {
  id: string;
  residentId: string;
  residentName: string;
  category: "병원동행" | "야외나들이" | "방문케어" | "장보기" | "기타외근";
  timeStr: string;
  location: string;
  note: string;
  actionsTaken: string;
  createdAt: string;
};

type Props = {
  residents: { id: string; name: string }[];
  onSaveFieldRecord: (record: FieldRecord) => void;
};

export function MobileFieldLogger({ residents, onSaveFieldRecord }: Props) {
  const [selectedResidentId, setSelectedResidentId] = useState(residents[0]?.id || "res-01");
  const [category, setCategory] = useState<FieldRecord["category"]>("병원동행");
  const [location, setLocation] = useState("행복종합병원 내과");
  const [note, setNote] = useState("정기 혈압 및 당뇨 검진 동행. 진료결과 바이탈 양호하며 처방약 수령함.");
  const [actionsTaken, setActionsTaken] = useState("차량 안전 수송 및 원내 간호팀 수령약 전달 완료.");
  const [isOpen, setIsOpen] = useState(false);

  function handleSave() {
    const resident = residents.find((r) => r.id === selectedResidentId) || residents[0];
    const newRecord: FieldRecord = {
      id: `field-${Date.now()}`,
      residentId: selectedResidentId,
      residentName: resident ? resident.name : "김순자",
      category,
      timeStr: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      location,
      note,
      actionsTaken,
      createdAt: new Date().toISOString()
    };

    onSaveFieldRecord(newRecord);
    setIsOpen(false);
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-3 shadow-xs space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
          <Smartphone size={15} className="text-emerald-600" />
          <span>📱 모바일 외근 현장 기록 등록</span>
          <Badge className="bg-emerald-100 text-emerald-800 text-[10px] border-emerald-300">실시간 연동</Badge>
        </div>
        <Button
          variant="secondary"
          onClick={() => setIsOpen(!isOpen)}
          className="font-bold text-[11px] h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isOpen ? "닫기" : "📱 외근 기록 추가하기"}
        </Button>
      </div>

      {isOpen && (
        <div className="rounded-lg bg-white p-3 border border-emerald-200 space-y-2.5 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">대상 수급자</label>
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                className="h-8 w-full rounded border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-900"
              >
                {residents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} 어르신
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">외근 유형</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FieldRecord["category"])}
                className="h-8 w-full rounded border border-slate-200 bg-slate-50 px-2 text-xs font-bold text-slate-900"
              >
                <option value="병원동행">🏥 병원 동행</option>
                <option value="야외나들이">🌳 야외 산책/나들이</option>
                <option value="방문케어">🚗 방문 가정 케어</option>
                <option value="장보기">🛍️ 장보기/야외활동</option>
                <option value="기타외근">📝 기타 외근</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">외근 장소/기관명</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-8 w-full rounded border border-slate-200 bg-slate-50 px-2 text-xs font-medium"
              placeholder="예: 행복종합병원, 수목원"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">현장 관찰 내용 (모바일 간편 메모)</label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded border border-slate-200 bg-slate-50 p-2 text-xs leading-relaxed"
              placeholder="외근 중 어르신 반응 및 상태 메모"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">현장 조치 사항</label>
            <input
              type="text"
              value={actionsTaken}
              onChange={(e) => setActionsTaken(e.target.value)}
              className="h-8 w-full rounded border border-slate-200 bg-slate-50 px-2 text-xs font-medium"
              placeholder="예: 원내 전달 및 수령약 복용 안내 완료"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 flex items-center justify-center gap-1.5"
          >
            <Save size={14} /> 📱 외근 기록 저장 (AI 생성 영역에 즉시 반영)
          </Button>
        </div>
      )}
    </div>
  );
}
