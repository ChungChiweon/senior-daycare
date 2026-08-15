"use client";

import { useState, useEffect } from "react";
import { Plus, Truck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LS_KEY = "silvercare.routes";

type ShuttleRoute = {
  id: string;
  name: string;
  driver: string;
  assistant: string;
  time: string;
  count: number;
};

export default function SchedulePage() {
  const [routes, setRoutes] = useState<ShuttleRoute[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // form state
  const [fname, setFname] = useState("송영 1호차");
  const [fdriver, setFdriver] = useState("홍길동 운전원");
  const [fassistant, setFassistant] = useState("김미래 보호사");
  const [ftime, setFtime] = useState("08:30 출발 / 17:00 귀가");
  const [fcount, setFcount] = useState(5);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try { setRoutes(JSON.parse(raw)); } catch { setRoutes([]); }
    }
  }, []);

  const save = (list: ShuttleRoute[]) => {
    setRoutes(list);
    if (typeof window !== "undefined") localStorage.setItem(LS_KEY, JSON.stringify(list));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fname.trim()) return;
    const newRoute: ShuttleRoute = {
      id: `route-${Date.now()}`,
      name: fname.trim(),
      driver: fdriver.trim() || "미정",
      assistant: fassistant.trim() || "미정",
      time: ftime.trim() || "미정",
      count: Number(fcount) || 0,
    };
    save([...routes, newRoute]);
    setIsOpen(false);
    setFname("송영 1호차"); setFdriver("홍길동 운전원");
    setFassistant("김미래 보호사"); setFtime("08:30 출발 / 17:00 귀가"); setFcount(5);
  };

  const handleDelete = (id: string) => save(routes.filter((r) => r.id !== id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge>송영 및 일일 일정</Badge>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">일정 및 차량 송영 관리</h1>
          <p className="mt-1 text-sm text-slate-600">
            주간보호센터 등하원 차량 송영 노선, 운전원/동승보호사 배정 및 시간표를 관리합니다.
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-sky-600 hover:bg-sky-700 font-bold">
          <Plus size={18} /> 송영 노선 추가
        </Button>
      </div>

      {routes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 text-sky-600 mb-1">
            <Truck size={28} />
          </div>
          <h3 className="text-base font-black text-slate-900">등록된 송영 노선이 없습니다.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            [송영 노선 추가] 버튼을 눌러 등하원 차량 호차 및 배정 인원을 등록해보세요.
          </p>
          <Button onClick={() => setIsOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9 mt-2">
            <Plus size={15} /> 첫 번째 송영 노선 추가
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {routes.map((r) => (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="text-sky-600" size={20} /> {r.name}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                    {r.count}명 탑승 예정
                  </span>
                  <button type="button" onClick={() => handleDelete(r.id)}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded transition">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600 font-semibold">
                <div>운전원: <span className="font-bold text-slate-800">{r.driver}</span></div>
                <div>동승 보호사: <span className="font-bold text-slate-800">{r.assistant}</span></div>
                <div>운행 시간대: <span className="font-bold text-sky-700">{r.time}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 송영 노선 등록 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">송영 노선 추가</h3>
              <button type="button" onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">노선명 *</label>
                <input required value={fname} onChange={(e) => setFname(e.target.value)}
                  placeholder="예: 송영 1호차"
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">운전원</label>
                  <input value={fdriver} onChange={(e) => setFdriver(e.target.value)}
                    placeholder="홍길동 운전원"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">동승 보호사</label>
                  <input value={fassistant} onChange={(e) => setFassistant(e.target.value)}
                    placeholder="김미래 보호사"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">운행 시간대</label>
                  <input value={ftime} onChange={(e) => setFtime(e.target.value)}
                    placeholder="08:30 출발 / 17:00 귀가"
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">탑승 예정 인원</label>
                  <input type="number" min={0} max={30} value={fcount} onChange={(e) => setFcount(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs font-semibold focus:border-sky-500 focus:outline-none" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setIsOpen(false)} className="text-xs h-9">취소</Button>
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs h-9">등록 완료</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
