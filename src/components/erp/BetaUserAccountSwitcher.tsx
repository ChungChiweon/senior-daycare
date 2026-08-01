"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BETA_STAFF_ACCOUNTS,
  type BetaStaffAccount
} from "@/lib/data/beta-institution-seed";
import {
  Check,
  ChevronDown,
  Shield,
  Smartphone,
  UserCheck,
  Users
} from "lucide-react";

export function BetaUserAccountSwitcher() {
  const [activeStaff, setActiveStaff] = useState<BetaStaffAccount>(BETA_STAFF_ACCOUNTS[0]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem("silvercare.activeStaffId");
    if (savedId) {
      const found = BETA_STAFF_ACCOUNTS.find((s) => s.id === savedId);
      if (found) setActiveStaff(found);
    }
  }, []);

  function handleSelectStaff(staff: BetaStaffAccount) {
    setActiveStaff(staff);
    localStorage.setItem("silvercare.activeStaffId", staff.id);
    localStorage.setItem("silvercare.activeRole", staff.roleCode === "driver" ? "field_staff" : staff.roleCode);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-sky-50 px-3 py-1.5 text-xs font-bold text-indigo-950 hover:bg-indigo-100 transition shadow-2xs"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white font-extrabold text-[11px]">
          {activeStaff.name.slice(0, 1)}
        </div>
        <div className="text-left hidden sm:block">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-slate-900">{activeStaff.name}</span>
            <Badge className="bg-indigo-600 text-white text-[9px] px-1.5 py-0 font-bold">
              {activeStaff.roleLabel}
            </Badge>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{activeStaff.title}</span>
        </div>
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-black text-slate-900 text-xs flex items-center gap-1">
              <Users size={14} className="text-indigo-600" /> 주간보호센터 A 직원 계정 전환 (15명)
            </span>
            <span className="text-[10px] text-slate-400 font-bold">베타 모드</span>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {BETA_STAFF_ACCOUNTS.map((staff) => {
              const isSelected = staff.id === activeStaff.id;

              return (
                <div
                  key={staff.id}
                  onClick={() => handleSelectStaff(staff)}
                  className={`flex items-center justify-between rounded-xl p-2 cursor-pointer text-xs transition ${
                    isSelected
                      ? "bg-indigo-50 border border-indigo-200"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-200 text-slate-800 font-black text-xs">
                      {staff.name.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs">{staff.name}</span>
                        <span className="text-[10px] text-indigo-700 font-extrabold">{staff.roleLabel}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block">{staff.title}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {staff.mobileOnly && (
                      <Badge className="bg-amber-100 text-amber-900 text-[9px] font-bold">
                        📱 모바일
                      </Badge>
                    )}
                    {isSelected && <Check size={16} className="text-indigo-600 shrink-0" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
