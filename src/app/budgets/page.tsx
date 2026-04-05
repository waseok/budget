import { BudgetList } from "@/components/budget-list";
import { BudgetForm, CategoryForm } from "@/components/forms";
import { EmptyState } from "@/components/empty-state";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getCurrentUser, getBudgetsWithCategories } from "@/lib/data";
import { getSession } from "@/lib/auth";

export default async function BudgetsPage() {
  const user = await getCurrentUser();
  const session = await getSession();
  const budgets = session ? await getBudgetsWithCategories(session) : [];

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar user={user?.name} />
      <div className="flex-1 flex flex-col ml-72 max-lg:ml-0">
        <Topbar name={user?.name} />
        <div className="flex-1 p-8">
        {!user ? (
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
              <CategoryForm budgets={budgets.map((budget) => ({ id: budget.id, name: budget.name }))} />
            </section>
            <BudgetList budgets={budgets} />
          </>
        )}
        </div>
      </div>
    </main>
  );
}
