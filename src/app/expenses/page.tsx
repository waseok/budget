import { EmptyState } from "@/components/empty-state";
import { ExpenseForm } from "@/components/forms";
import { ExpenseManager } from "@/components/expense-manager";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getCurrentUser, getBudgetsWithCategories, getRecentExpenses } from "@/lib/data";
import { getSession } from "@/lib/auth";

export default async function ExpensesPage() {
  const user = await getCurrentUser();
  const session = await getSession();
  const budgets = session ? await getBudgetsWithCategories(session) : [];
  const categories = budgets.flatMap((b) => b.categories);
  const categoryIds = categories.map((c) => c.id);
  const expenses = await getRecentExpenses(categoryIds);

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar user={user?.name} />
      <div className="flex-1 flex flex-col ml-72 max-lg:ml-0">
        <Topbar name={user?.name} />
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {!user ? (
          <EmptyState
            title="로그인이 필요합니다."
            description="로그인 후 지출 내역을 추가, 수정, 삭제할 수 있습니다."
          />
        ) : (
          <div className="space-y-8">
            <ExpenseForm budgets={budgets.map((b) => ({
              id: b.id,
              name: b.name,
              totalAmount: b.totalAmount,
              spentAmount: b.categories.reduce((sum, c) => sum + c.spentAmount, 0),
              categories: b.categories.map((c) => ({
                id: c.id,
                name: c.name,
                color: c.color,
                allocatedAmount: c.allocatedAmount,
                spentAmount: c.spentAmount,
              })),
            }))} />
            <ExpenseManager
              expenses={expenses}
              categories={categories.map((category) => ({ id: category.id, name: category.name, color: category.color }))}
            />
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
