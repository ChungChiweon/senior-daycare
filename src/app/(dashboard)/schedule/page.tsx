"use client";

import { Plus, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SchedulePage() {
  const routes: any[] = [];

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
        <Button className="bg-sky-600 hover:bg-sky-700 font-bold">
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
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {routes.map((r) => (
            <div key={r.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="text-sky-600" size={20} /> {r.name}
                </h2>
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800">
                  {r.count}명 탑승 예정
                </span>
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
    </div>
  );
}
