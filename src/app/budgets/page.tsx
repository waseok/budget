import { BudgetList } from "@/components/budget-list";
import { BudgetForm, CategoryForm } from "@/components/forms";
import { EmptyState } from "@/components/empty-state";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getDashboardData } from "@/lib/data";

export default async function BudgetsPage() {
  const data = await getDashboardData();

  return (
    <main className="app-shell">
      <Sidebar user={data.user?.name} />
      <div className="content-shell">
        <Topbar name={data.user?.name} />
        {!data.user ? (
          <EmptyState
            title="로그인이 필요합니다."
            description="로그인 후 예산을 추가하고 수정하거나 삭제할 수 있습니다."
          />
        ) : (
          <>
            <section className="section-stack">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">새 예산</p>
                  <h2>예산 추가</h2>
                </div>
              </div>
              <BudgetForm />
            </section>
            <section className="section-stack">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">예산 항목 추가</p>
                  <h2>카테고리 입력</h2>
                </div>
              </div>
              <CategoryForm budgets={data.budgets.map((budget) => ({ id: budget.id, name: budget.name }))} />
            </section>
            <BudgetList budgets={data.budgets} />
          </>
        )}
      </div>
    </main>
  );
}
