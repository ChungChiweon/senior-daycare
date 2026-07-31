import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SilverCare AI | 주간보호센터 사회복지사 업무 자동화 SaaS",
  description: "노인 주간보호센터(데이케어센터) 사회복지사를 위한 어르신 일일 알림장, 급여제공기록지, 가정통신문, 홍보글 AI 자동생성 솔루션"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
