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
      <div>
        <p className="eyebrow">Budget Board</p>
        <h2 className="sidebar-title">예산 관리</h2>
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
