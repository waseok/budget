import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "예산 관리 보드",
  description: "예산, 지출, 위시리스트를 함께 관리하는 개인 예산 대시보드",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
