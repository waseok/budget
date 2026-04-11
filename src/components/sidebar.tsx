"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { signOut } from "@/app/actions";

const navItems = [
  { label: "대시보드", href: "/", icon: "dashboard" },
  { label: "예산", href: "/budgets", icon: "account_balance_wallet" },
  { label: "지출", href: "/expenses", icon: "receipt_long" },
  { label: "위시리스트", href: "/wishlist", icon: "favorite" },
];

export function Sidebar({ user }: { user?: string | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center"
        aria-label="메뉴 열기"
      >
        <span
          className="material-symbols-outlined text-slate-600 text-xl"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
        >
          menu
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Close button (mobile only) */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 lg:hidden w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
          aria-label="메뉴 닫기"
        >
          <span
            className="material-symbols-outlined text-slate-500 text-lg"
            style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
          >
            close
          </span>
        </button>

        {/* Brand */}
        <div className="px-6 pt-8 pb-6">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1">Premium Wealth Management</p>
          <h2
            className="font-headline text-xl font-medium leading-tight"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
          >
            Financial Atelier
          </h2>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-headline font-medium text-sm transition-all duration-150 ${
                      isActive
                        ? "bg-blue-50/80 text-blue-700"
                        : "text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-xl leading-none"
                      style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom user area */}
        <div className="px-3 pb-6 pt-4">
          {user ? (
            <div className="bg-slate-50/50 rounded-3xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-headline font-medium text-sm flex-shrink-0">
                  {user.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user}님</p>
                  <p className="text-xs text-slate-400">회원</p>
                </div>
              </div>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full text-xs font-medium text-slate-500 hover:text-slate-700 bg-white/80 hover:bg-white rounded-xl py-2 px-3 transition-colors border border-slate-100"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-headline font-medium text-sm transition-all duration-150"
            >
              <span
                className="material-symbols-outlined text-xl leading-none"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
              >
                login
              </span>
              <span>로그인</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
