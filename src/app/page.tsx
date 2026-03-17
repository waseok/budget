import { BudgetList } from "@/components/budget-list";
import { BudgetForm, CategoryForm, ExpenseForm, WishlistForm } from "@/components/forms";
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
  const budgetOptions = data.budgets.map((budget) => ({ id: budget.id, name: budget.name }));
  const categories = data.budgets.flatMap((budget) => budget.categories);
  const totalBudget = data.budgets.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalSpent = categories.reduce((sum, item) => sum + item.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const wishlistBudget = data.wishlistItems.reduce((sum, item) => sum + (item.expectedPrice ?? 0), 0);
  const usageRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <main className="app-shell">
      <Sidebar user={data.user?.name} />
      <div className="content-shell">
        <Topbar name={data.user?.name} />

        <section className="hero-panel">
          <div className="hero-copy">
            <h1>예산 흐름을 한 화면에서 보고, 바로 기록하고, 바로 정리하세요.</h1>
            <p className="hero-subtle">
              예산, 예산 항목, 지출, 위시리스트를 따로 헤매지 않도록 첫 화면을 작업 허브처럼
              구성했습니다. 지금 필요한 숫자와 바로 입력할 폼을 한 번에 볼 수 있습니다.
            </p>
            <div className="hero-actions">
              <a href="#quick-actions" className="primary-button">
                바로 입력하기
              </a>
              <a href="/budgets" className="secondary-button">
                예산 목록 보기
              </a>
            </div>
          </div>

          <div className="hero-spotlight clean-card">
            <div className="hero-spotlight-value">{usageRate}%</div>
            <p className="muted">
              전체 예산 대비 현재 사용률입니다. 위시리스트를 연결하려면 예산만이 아니라 예산
              항목까지 먼저 준비되어 있어야 합니다.
            </p>
            <div className="hero-mini-list">
              <div>
                <span>활성 예산</span>
                <strong>{data.budgets.length}개</strong>
              </div>
              <div>
                <span>예산 항목</span>
                <strong>{categories.length}개</strong>
              </div>
              <div>
                <span>위시리스트</span>
                <strong>{data.wishlistItems.length}개</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="hero-stat-strip">
          <article className="hero-stat-card">
            <span>남은 예산</span>
            <strong>{formatCurrency(totalRemaining)}</strong>
            <p>현재 등록된 지출 기준으로 바로 쓸 수 있는 금액</p>
          </article>
          <article className="hero-stat-card">
            <span>위시리스트 예상</span>
            <strong>{formatCurrency(wishlistBudget)}</strong>
            <p>구매 후보 전체를 합산한 예상 지출 금액</p>
          </article>
          <article className="hero-stat-card">
            <span>추천 순서</span>
            <strong>예산 → 항목 → 지출/위시</strong>
            <p>위시리스트 드롭다운은 예산 항목을 추가해야 채워집니다</p>
          </article>
        </section>

        {data.user ? (
          <>
            <section className="summary-grid">
              <SummaryCard
                label="전체 예산"
                value={formatCurrency(totalBudget)}
                helper="등록된 전체 예산 금액"
                icon={<WalletIcon className="card-icon" />}
                tone="blue"
              />
              <SummaryCard
                label="누적 지출"
                value={formatCurrency(totalSpent)}
                helper="현재까지 사용한 금액"
                icon={<ReceiptIcon className="card-icon" />}
                tone="orange"
              />
              <SummaryCard
                label="남은 예산"
                value={formatCurrency(totalRemaining)}
                helper="지금 남아 있는 사용 가능 금액"
                icon={<ChartIcon className="card-icon" />}
                tone="green"
              />
              <SummaryCard
                label="위시리스트"
                value={formatCurrency(wishlistBudget)}
                helper="구매 예정 금액 합계"
                icon={<WishIcon className="card-icon" />}
                tone="pink"
              />
            </section>

            {data.budgets.length > 0 ? (
              <section className="section-stack">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Usage Overview</p>
                    <h2>예산별 사용률을 한눈에 확인하세요</h2>
                  </div>
                </div>
                <div className="budget-usage-grid">
                  {data.budgets.map((budget, index) => {
                    const spent = budget.categories.reduce((sum, item) => sum + item.spentAmount, 0);
                    const usage = budget.totalAmount > 0 ? (spent / budget.totalAmount) * 100 : 0;
                    const tone = index % 3 === 0 ? "blue" : index % 3 === 1 ? "orange" : "green";

                    return (
                      <article key={budget.id} className="usage-card">
                        <DonutChart
                          value={usage}
                          centerTitle={budget.name}
                          centerSubtitle="사용률"
                          tone={tone}
                        />
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            <section id="quick-actions" className="focus-grid">
              <article className="clean-card">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Quick Actions</p>
                    <h2>홈에서 바로 추가하고 연결 흐름까지 이어가세요</h2>
                    <p className="muted section-description">
                      위시리스트는 예산이 아니라 예산 항목에 연결됩니다. 그래서 예산을 만든 뒤에는
                      항목을 먼저 추가하는 순서가 가장 자연스럽습니다.
                    </p>
                  </div>
                </div>
                <div className="quick-forms">
                  <BudgetForm />
                  <CategoryForm budgets={budgetOptions} />
                  <ExpenseForm budgets={data.budgets.map((b) => ({ id: b.id, name: b.name, categories: b.categories.map((c) => ({ id: c.id, name: c.name })) }))} />
                  <WishlistForm categories={categories.map((item) => ({ id: item.id, name: item.name }))} />
                </div>
              </article>
            </section>

            <BudgetList budgets={data.budgets} />

            {data.budgets.length === 0 ? (
              <EmptyState
                title="먼저 예산을 만들고, 이어서 예산 항목까지 추가해보세요."
                description="예산 항목이 생기면 지출과 위시리스트가 자연스럽게 연결됩니다. 홈의 빠른 입력 영역에서 바로 이어서 등록할 수 있습니다."
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
            description="회원가입 또는 로그인 후 예산, 예산 항목, 지출, 위시리스트까지 한 번에 관리할 수 있습니다."
          />
        )}
      </div>
    </main>
  );
}
