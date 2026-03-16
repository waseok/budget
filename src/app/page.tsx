import { BudgetList } from "@/components/budget-list";
import { BudgetForm, ExpenseForm, WishlistForm } from "@/components/forms";
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

  return (
    <main className="app-shell">
      <Sidebar />
      <div className="content-shell">
        <Topbar email={data.user?.email} />

        <section className="hero-simple">
          <p className="eyebrow">나의 예산 현황</p>
          <h1>예산, 지출, 위시리스트를 한 화면에서 관리하세요.</h1>
          <p className="hero-subtle">복잡한 설명 없이 필요한 숫자와 관리 기능만 먼저 보여줍니다.</p>
        </section>

        {data.user ? (
          <>
            <section className="summary-grid">
              <SummaryCard
                label="전체 예산"
                value={formatCurrency(totalBudget)}
                helper="등록된 전체 금액"
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
                label="남은 잔액"
                value={formatCurrency(totalRemaining)}
                helper="지금 남아 있는 금액"
                icon={<ChartIcon className="card-icon" />}
                tone="green"
              />
              <SummaryCard
                label="위시리스트"
                value={formatCurrency(wishlistBudget)}
                helper="구매 예정 금액"
                icon={<WishIcon className="card-icon" />}
                tone="pink"
              />
            </section>

            {data.budgets.length > 0 ? (
              <section className="budget-usage-grid">
                {data.budgets.map((budget, index) => {
                  const spent = budget.categories.reduce((sum, item) => sum + item.spentAmount, 0);
                  const usage = budget.totalAmount > 0 ? (spent / budget.totalAmount) * 100 : 0;
                  const tone = index % 3 === 0 ? "blue" : index % 3 === 1 ? "orange" : "green";

                  return (
                    <article key={budget.id} className="clean-card usage-card">
                      <DonutChart
                        value={usage}
                        centerTitle={budget.name}
                        centerSubtitle="사용률"
                        tone={tone}
                      />
                    </article>
                  );
                })}
              </section>
            ) : null}

            <section className="focus-grid">
              <article className="clean-card">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">빠른 입력</p>
                    <h2>바로 추가</h2>
                  </div>
                </div>
                <div className="quick-forms">
                  <BudgetForm />
                  <ExpenseForm categories={categories.map((item) => ({ id: item.id, name: item.name }))} />
                  <WishlistForm categories={categories.map((item) => ({ id: item.id, name: item.name }))} />
                </div>
              </article>
            </section>

            <BudgetList budgets={data.budgets} />

            {data.budgets.length === 0 ? (
              <EmptyState
                title="먼저 예산을 하나 만들어주세요."
                description="예산을 만든 뒤 예산 항목까지 추가하면 지출과 위시리스트 연결이 가능합니다."
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
            title="로그인 후 바로 예산을 관리할 수 있습니다."
            description="회원가입 또는 로그인 후 예산 추가, 수정, 삭제 기능을 사용할 수 있습니다."
          />
        )}
      </div>
    </main>
  );
}
