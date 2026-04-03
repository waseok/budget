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
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1 font-headline">
            최근 활동
          </p>
          <h2 className="text-lg font-bold text-slate-900 font-headline m-0">최근 지출 내역</h2>
        </div>
        <a
          href="/expenses"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 font-headline transition-colors"
        >
          전체 보기
        </a>
      </div>
      <div className="space-y-1">
        {expenses.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">지출 내역이 없습니다.</p>
        ) : (
          expenses.map((expense) => (
            <article
              key={expense.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-slate-50 last:border-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                  <span
                    className="material-symbols-outlined text-slate-400 text-sm"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    receipt_long
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{expense.title}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {expense.categoryName ?? expense.category ?? "미분류"} · {formatDate(expense.spentOn)}
                  </p>
                </div>
              </div>
              <strong className="text-sm font-bold text-slate-800 font-headline flex-shrink-0">
                {formatCurrency(expense.amount)}
              </strong>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
