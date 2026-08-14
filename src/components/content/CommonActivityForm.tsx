"use client";

import { useState } from "react";
import { Copy, FolderOpen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import type { ActivityCategory, ActivityMood, CommonActivity } from "@/types/integrated-care";

type Props = {
  activity: CommonActivity;
  onApply: (updated: CommonActivity) => void;
  selectedResidentCount: number;
};

const categoryOptions: ActivityCategory[] = ["인지", "신체", "여가", "사회적응", "정서지원", "기타"];
const moodOptions: ActivityMood[] = ["활기참", "안정적", "차분함", "산만함", "참여저조"];

export function CommonActivityForm({ activity, onApply, selectedResidentCount }: Props) {
  const [form, setForm] = useState<CommonActivity>(activity);
  const [message, setMessage] = useState("");

  function handleChange<K extends keyof CommonActivity>(key: K, value: CommonActivity[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    onApply(form);
    setMessage(`선택된 ${selectedResidentCount}명 어르신 공통 기록에 반영되었습니다.`);
    setTimeout(() => setMessage(""), 3000);
  }

  function handleCopyRecent() {
    setForm({
      ...activity,
      title: "오전 실버 건강체조 및 스트레칭",
      category: "신체",
      content: "음악에 맞추어 손뼉 치기, 어깨 넓히기 스트레칭 및 가벼운 제자리 걸음 체조 수행",
      mood: "활기참"
    });
    setMessage("최근 실행한 활동 내용이 복사되었습니다.");
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
          <span>📌 공통활동 입력</span>
          <span className="text-slate-500 font-normal text-xs">(1회 입력 ➔ {selectedResidentCount}명 동시 적용)</span>
        </h3>
        <div className="flex gap-1 text-[11px]">
          <button
            type="button"
            className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-bold text-slate-700 hover:bg-slate-200"
            onClick={() => alert("기존 저장된 프로그램 템플릿 12종 목록에서 선택할 수 있습니다.")}
          >
            <FolderOpen size={12} /> 불러오기
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-bold text-slate-700 hover:bg-slate-200"
            onClick={handleCopyRecent}
          >
            <Copy size={12} /> 최근 활동 복사
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2">
          <label className="font-bold text-slate-700 block mb-1">프로그램명</label>
          <Input
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="예: 오후 뇌자극 칠교놀이 및 인지교구 훈련"
          />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">프로그램 영역</label>
          <select
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-300"
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value as ActivityCategory)}
          >
            {categoryOptions.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">실시 시간</label>
          <Input value={form.time} onChange={(e) => handleChange("time", e.target.value)} placeholder="14:00 ~ 15:00" />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">담당자</label>
          <Input value={form.instructor} onChange={(e) => handleChange("instructor", e.target.value)} placeholder="담당 사회복지사" />
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">공통 분위기</label>
          <select
            className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-sky-300"
            value={form.mood}
            onChange={(e) => handleChange("mood", e.target.value as ActivityMood)}
          >
            {moodOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="font-bold text-slate-700 block mb-1">활동 목표</label>
          <Input
            value={form.goal}
            onChange={(e) => handleChange("goal", e.target.value)}
            placeholder="시공간 지각 능력 향상 및 소근육 유연성 유지"
          />
        </div>

        <div className="col-span-2">
          <label className="font-bold text-slate-700 block mb-1">진행 내용</label>
          <Textarea
            className="min-h-16 text-xs p-2.5"
            value={form.content}
            onChange={(e) => handleChange("content", e.target.value)}
            placeholder="도안 카드를 보며 칠교 조각 7개를 조합하여 맞추기"
          />
        </div>

        <div className="col-span-2">
          <label className="font-bold text-slate-700 block mb-1">준비물 & 공통 관찰 내용</label>
          <Input
            value={form.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="원목 칠교 교구 세트, 집중 시간 지속됨"
          />
        </div>
      </div>

      {message && <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 font-bold text-emerald-800">{message}</div>}

      <div className="flex gap-2 pt-1">
        <Button className="flex-1 bg-sky-600 hover:bg-sky-700 text-xs font-bold h-9" onClick={handleApply}>
          ⚡ 공통활동 {selectedResidentCount}명에게 적용
        </Button>
        <Button variant="secondary" className="text-xs font-bold h-9" onClick={() => setMessage("임시저장되었습니다.")}>
          <Save size={14} /> 임시저장
        </Button>
      </div>
    </div>
  );
}
