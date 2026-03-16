"use client";

import { useMemo, useState } from "react";

import { deleteBudget, updateBudget } from "@/app/actions";
import { formatCurrency } from "@/lib/format";

type BudgetItem = {
  id: string;
  name: string;
  totalAmount: number;
  periodLabel: string | null;
  categories: Array<{
    id: string;
    name: string;
    allocatedAmount: number;
    spentAmount: number;
    color: string;
  }>;
};

type SortValue = "latest" | "name" | "amount";

export function BudgetList({ budgets }: { budgets: BudgetItem[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("latest");

  const filteredBudgets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let items = budgets.filter((budget) => {
      if (!normalized) return true;
      return (
        budget.name.toLowerCase().includes(normalized) ||
        (budget.periodLabel ?? "").toLowerCase().includes(normalized)
      );
    });

    items = [...items].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "ko");
      if (sort === "amount") return b.totalAmount - a.totalAmount;
      return 0;
    });

    return items;
  }, [budgets, query, sort]);

  if (budgets.length === 0) return null;

  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">예산 관리</p>
          <h2>예산 추가, 수정, 삭제</h2>
        </div>
      </div>

      <div className="toolbar-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예산 이름 또는 기간 검색"
        />
        <select value={sort} onChange={(event) => setSort(event.target.value as SortValue)}>
          <option value="latest">기본 순서</option>
          <option value="name">이름순</option>
          <option value="amount">예산 큰 순</option>
        </select>
      </div>

      <div className="budget-list">
        {filteredBudgets.map((budget) => {
          const spent = budget.categories.reduce((sum, item) => sum + item.spentAmount, 0);
          const usage = budget.totalAmount > 0 ? Math.round((spent / budget.totalAmount) * 100) : 0;

          return (
            <article key={budget.id} className="budget-item">
              <div className="budget-item-top">
                <div>
                  <p className="budget-item-label">{budget.periodLabel ?? "기간 미설정"}</p>
                  <h3>{budget.name}</h3>
                </div>
                <div className="budget-badge">{usage}% 사용</div>
              </div>

              <div className="budget-overview">
                <div>
                  <span>전체 예산</span>
                  <strong>{formatCurrency(budget.totalAmount)}</strong>
                </div>
                <div>
                  <span>누적 지출</span>
                  <strong>{formatCurrency(spent)}</strong>
                </div>
              </div>

              <form action={updateBudget} className="budget-edit-form">
                <input type="hidden" name="budget_id" value={budget.id} />
                <label>
                  <span>예산 이름</span>
                  <input name="name" defaultValue={budget.name} required />
                </label>
                <label>
                  <span>총 예산</span>
                  <input
                    name="total_amount"
                    type="number"
                    min="0"
                    step="1000"
                    defaultValue={budget.totalAmount}
                    required
                  />
                </label>
                <label>
                  <span>기간</span>
                  <input name="period_label" defaultValue={budget.periodLabel ?? ""} />
                </label>
                <div className="budget-actions">
                  <button type="submit" className="primary-button">
                    수정 저장
                  </button>
                </div>
              </form>

              <form action={deleteBudget} className="delete-form">
                <input type="hidden" name="budget_id" value={budget.id} />
                <button type="submit" className="danger-button">
                  예산 삭제
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}
