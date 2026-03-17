import { EmptyState } from "@/components/empty-state";
import { ExpenseForm } from "@/components/forms";
import { ExpenseManager } from "@/components/expense-manager";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getDashboardData } from "@/lib/data";

export default async function ExpensesPage() {
  const data = await getDashboardData();
  const categories = data.budgets.flatMap((budget) => budget.categories);

  return (
    <main className="app-shell">
      <Sidebar />
      <div className="content-shell">
        <Topbar name={data.user?.name} />
        {!data.user ? (
          <EmptyState
            title="로그인이 필요합니다."
            description="로그인 후 지출 내역을 추가, 수정, 삭제할 수 있습니다."
          />
        ) : (
          <>
            <ExpenseForm categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
            <ExpenseManager
              expenses={data.expenses}
              categories={categories.map((category) => ({ id: category.id, name: category.name }))}
            />
          </>
        )}
      </div>
    </main>
  );
}
