"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, Sparkles, X } from "lucide-react";

type GuidanceProps = {
  title: string;
  description: string;
  tip?: string;
  actionLabel?: string;
  actionHref?: string;
};

export function InAppGuidanceBanner({
  title,
  description,
  tip,
  actionLabel,
  actionHref
}: GuidanceProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 via-indigo-50/50 to-white p-4 shadow-2xs space-y-2 text-xs relative mb-4">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition"
      >
        <X size={15} />
      </button>

      <div className="flex items-center gap-2">
        <Badge className="bg-sky-600 text-white font-bold text-[10px] flex items-center gap-1">
          <Lightbulb size={12} /> 스마트 현장 도움말
        </Badge>
        <h3 className="font-black text-slate-900 text-xs">{title}</h3>
      </div>

      <p className="text-slate-700 font-medium leading-relaxed">{description}</p>

      {tip && (
        <div className="rounded-lg bg-white/80 border border-sky-100 p-2 text-sky-950 font-medium text-[11px] flex items-center gap-1.5">
          <Sparkles size={14} className="text-sky-600 shrink-0" />
          <span><strong>꿀팁:</strong> {tip}</span>
        </div>
      )}

      {actionLabel && actionHref && (
        <div className="pt-1">
          <Link href={actionHref}>
            <Button className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] h-7 px-3 flex items-center gap-1">
              <span>{actionLabel}</span>
              <ChevronRight size={12} />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
