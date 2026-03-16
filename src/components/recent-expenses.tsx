import { formatCurrency, formatDate } from "@/lib/format";

type ExpenseItem = {
  id: string;
  title: string;
  categoryName?: string;
  category?: string;
  amount: number;
  spentOn: string;
};

export function RecentExpenses({ expenses }: { expenses: ExpenseItem[] }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">최근 활동</p>
          <h2>최근 지출 내역</h2>
        </div>
        <a href="/expenses" className="text-link">
          전체 보기
        </a>
      </div>
      <div className="expense-list">
        {expenses.map((expense) => (
          <article key={expense.id} className="expense-row">
            <div>
              <h3>{expense.title}</h3>
              <p className="muted">
                {expense.categoryName ?? expense.category ?? "미분류"} · {formatDate(expense.spentOn)}
              </p>
            </div>
            <strong>{formatCurrency(expense.amount)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
