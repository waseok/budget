"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { HomeIcon, PersonIcon, ReceiptIcon, WalletIcon, WishIcon } from "@/components/icons";

const navItems = [
  { label: "대시보드", href: "/", icon: HomeIcon },
  { label: "예산", href: "/budgets", icon: WalletIcon },
  { label: "지출", href: "/expenses", icon: ReceiptIcon },
  { label: "위시리스트", href: "/wishlist", icon: WishIcon },
  { label: "로그인", href: "/login", icon: PersonIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="eyebrow">Budget Board</p>
        <h2 className="sidebar-title">예산 관리 보드</h2>
        <p className="muted sidebar-copy">예산과 소비 흐름을 차분하게 정리하는 개인 대시보드</p>
      </div>
      <nav>
        <ul className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} className={`nav-link${isActive ? " active" : ""}`}>
                  <Icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
