"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/actions";
import { HomeIcon, PersonIcon, ReceiptIcon, WalletIcon, WishIcon } from "@/components/icons";

const navItems = [
  { label: "대시보드", href: "/", icon: HomeIcon },
  { label: "예산", href: "/budgets", icon: WalletIcon },
  { label: "지출", href: "/expenses", icon: ReceiptIcon },
  { label: "위시리스트", href: "/wishlist", icon: WishIcon },
];

export function Sidebar({ user }: { user?: string | null }) {
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
      <div className="sidebar-auth">
        {user ? (
          <form action={signOut}>
            <p className="sidebar-username">{user}님</p>
            <button type="submit" className="secondary-button sidebar-logout">로그아웃</button>
          </form>
        ) : (
          <Link href="/login" className="nav-link">
            <PersonIcon className="nav-icon" />
            <span>로그인</span>
          </Link>
        )}
      </div>
    </aside>
  );
}

