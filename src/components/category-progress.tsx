import { formatCurrency } from "@/lib/format";

type BudgetCategorySummary = {
  id: string;
  name: string;
  allocated: number;
  spent: number;
  color: string;
};

export function CategoryProgress({ category }: { category: BudgetCategorySummary }) {
  const remaining = category.allocated - category.spent;
  const progress = category.allocated > 0 ? Math.min((category.spent / category.allocated) * 100, 100) : 0;

  return (
    <article className="panel category-card">
      <div className="category-top">
        <div>
          <p className="eyebrow">예산 항목</p>
          <h3>{category.name}</h3>
        </div>
        <span className="color-dot" style={{ backgroundColor: category.color }} />
      </div>
      <div className="category-progress-meta">
        <strong>{Math.round(progress)}%</strong>
        <span className="muted">사용 중</span>
      </div>
      <div className="progress-track" aria-hidden="true">
        <div
          className="progress-fill"
          style={{ width: `${progress}%`, backgroundColor: category.color }}
        />
      </div>
      <div className="category-stats">
        <div>
          <span>배정</span>
          <strong>{formatCurrency(category.allocated)}</strong>
        </div>
        <div>
          <span>지출</span>
          <strong>{formatCurrency(category.spent)}</strong>
        </div>
        <div>
          <span>잔액</span>
          <strong>{formatCurrency(remaining)}</strong>
        </div>
      </div>
    </article>
  );
}
