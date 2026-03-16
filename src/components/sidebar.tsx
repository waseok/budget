const navItems = [
  { label: "대시보드", href: "/" },
  { label: "예산", href: "/budgets" },
  { label: "지출", href: "/expenses" },
  { label: "위시리스트", href: "/wishlist" },
  { label: "로그인", href: "/login" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <p className="eyebrow">Budget Board</p>
        <h2 className="sidebar-title">예산 관리 보드</h2>
        <p className="muted sidebar-copy">예산과 소비 흐름을 차분하게 정리하는 개인 대시보드</p>
      </div>
      <nav>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="nav-link">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
