import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatContentType(type: string) {
  const names: Record<string, string> = {
    notice: "어르신 일일 알림장",
    newsletter: "급여제공기록/소식지",
    homepage: "센터 홈페이지 게시글",
    blog: "네이버 블로그 홍보글",
    instagram: "인스타그램 소식"
  };

  return names[type] ?? type;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}
