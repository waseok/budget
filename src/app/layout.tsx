import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gongGothic = localFont({
  src: [
    { path: "../fonts/GongGothic-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/GongGothic-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-gong",
  display: "swap",
});

export const metadata: Metadata = {
  title: "예산 관리 보드",
  description: "예산, 지출, 위시리스트를 함께 관리하는 개인 예산 대시보드",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={gongGothic.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
