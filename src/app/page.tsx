import { DonutChart } from "@/components/donut-chart";
import { EmptyState } from "@/components/empty-state";
import { ChartIcon, ReceiptIcon, WalletIcon, WishIcon } from "@/components/icons";
import { RecentExpenses } from "@/components/recent-expenses";
import { Sidebar } from "@/components/sidebar";
import { SummaryCard } from "@/components/summary-card";
import { Topbar } from "@/components/topbar";
import { WishlistGrid } from "@/components/wishlist-grid";
import { getDashboardData } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function HomePage() {
  const data = await getDashboardData();
  const categories = data.budgets.flatMap((budget) => budget.categories);
  const totalBudget = data.budgets.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalSpent = categories.reduce((sum, item) => sum + item.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const wishlistBudget = data.wishlistItems.reduce((sum, item) => sum + (item.expectedPrice ?? 0), 0);
  const rawUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const usageDisplay = rawUsage === 0 ? "0" : rawUsage < 1 ? "< 1" : Math.round(rawUsage).toString();

  return (
    <main className="app-shell">
      <Sidebar user={data.user?.name} />
      <div className="content-shell">
        <Topbar name={data.user?.name} />

        <section className="hero-panel">
          <div className="hero-copy">
            <h1>예산 흐름을 한눈에 보고, 바로 정리하세요.</h1>
            <p className="hero-subtle">
              예산·지출·위시리스트를 체계적으로 관리하는 개인 예산 보드입니다.
            </p>
            <div className="hero-actions">
              <a href="/expenses" className="primary-button">지출 추가</a>
              <a href="/budgets" className="secondary-button">예산 관리</a>
            </div>
          </div>

          <div className="hero-spotlight clean-card">
            <div className="hero-spotlight-value">{usageDisplay}%</div>
            <p className="muted" style={{ margin: 0 }}>전체 예산 사용률</p>
            <div className="hero-mini-list">
              <div>
                <span>전체 예산</span>
                <strong>{formatCurrency(totalBudget)}</strong>
              </div>
              <div>
                <span>사용 금액</span>
                <strong>{formatCurrency(totalSpent)}</strong>
              </div>
              <div>
                <span>잔액</span>
                <strong style={{ color: totalRemaining < 0 ? "var(--danger)" : "var(--green)" }}>
                  {formatCurrency(totalRemaining)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {data.user ? (
          <>
            <section className="summary-grid">
              <SummaryCard label="전체 예산" value={formatCurrency(totalBudget)} helper="등록된 전체 예산 금액" icon={<WalletIcon className="card-icon" />} tone="blue" />
              <SummaryCard label="누적 지출" value={formatCurrency(totalSpent)} helper="현재까지 사용한 금액" icon={<ReceiptIcon className="card-icon" />} tone="orange" />
              <SummaryCard label="남은 예산" value={formatCurrency(totalRemaining)} helper="지금 남아 있는 사용 가능 금액" icon={<ChartIcon className="card-icon" />} tone="green" />
              <SummaryCard label="위시리스트" value={formatCurrency(wishlistBudget)} helper="구매 예정 금액 합계" icon={<WishIcon className="card-icon" />} tone="pink" />
            </section>

            {data.budgets.length > 0 && (
              <section className="section-stack">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Usage Overview</p>
                    <h2>예산별 사용률</h2>
                  </div>
                </div>
                <div className="budget-usage-grid">
                  {data.budgets.map((budget, index) => {
                    const spent = budget.categories.reduce((sum, item) => sum + item.spentAmount, 0);
                    const usage = budget.totalAmount > 0 ? (spent / budget.totalAmount) * 100 : 0;
                    const tone = index % 3 === 0 ? "blue" : index % 3 === 1 ? "orange" : "green";
                    return (
                      <article key={budget.id} className="usage-card">
                        <DonutChart value={usage} centerTitle={budget.name} centerSubtitle="사용률" tone={tone} />
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {data.budgets.length === 0 ? (
              <EmptyState
                title="먼저 예산을 만들고, 이어서 예산 항목까지 추가해보세요."
                description="예산 탭에서 예산을 추가하면 지출과 위시리스트가 연결됩니다."
              />
            ) : (
              <div className="two-column-grid">
                <RecentExpenses expenses={data.expenses} />
                <WishlistGrid items={data.wishlistItems} />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="로그인하면 바로 예산 관리 화면을 사용할 수 있습니다."
            description="회원가입 또는 로그인 후 예산, 지출, 위시리스트까지 한 번에 관리할 수 있습니다."
          />
        )}
      </div>
    </main>
  );
}
