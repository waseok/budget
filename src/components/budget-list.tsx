"use client";

import { useMemo, useState } from "react";

import { deleteBudget, deleteCategory, updateBudget, updateCategory } from "@/app/actions";
import { CurrencyInput } from "@/components/currency-input";
import { SaveIcon, TrashIcon } from "@/components/icons";
import { formatCurrency, formatDate } from "@/lib/format";

type ExpenseDetail = {
  id: string;
  title: string;
  amount: number;
  spentOn: string;
  note: string | null;
};

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
    expenses: ExpenseDetail[];
  }>;
};

type SortValue = "latest" | "name" | "amount";

export function BudgetList({ budgets }: { budgets: BudgetItem[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("latest");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

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

  const toggleCategory = (categoryId: string) => {
    if (editingCategoryId === categoryId) return;
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  if (budgets.length === 0) return null;

  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Budget Manager</p>
          <h2>예산을 검색하고 바로 수정하세요</h2>
        </div>
      </div>

      <div className="toolbar-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예산 이름 또는 기간으로 검색"
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
          const remaining = budget.totalAmount - spent;

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
                <div>
                  <span>잔액</span>
                  <strong style={{ color: remaining < 0 ? "var(--danger)" : "var(--green)" }}>
                    {formatCurrency(remaining)}
                  </strong>
                </div>
              </div>

              {/* 세부 항목별 지출 */}
              {budget.categories.length > 0 && (
                <div className="budget-cat-list">
                  <p className="budget-cat-heading">세부 항목별 지출</p>
                  {budget.categories.map((cat) => {
                    const isExpanded = expandedCategories.has(cat.id);
                    const isEditing = editingCategoryId === cat.id;
                    const catRemaining = cat.allocatedAmount - cat.spentAmount;

                    return (
                      <div key={cat.id} className="budget-cat-item">
                        <div className="budget-cat-header-wrap">
                          <button
                            type="button"
                            className="budget-cat-header"
                            onClick={() => toggleCategory(cat.id)}
                          >
                            <div className="budget-cat-left">
                              <span className="color-dot" style={{ background: cat.color }} />
                              <span className="budget-cat-name">{cat.name}</span>
                              {cat.expenses.length > 0 && (
                                <span className="budget-cat-count">{cat.expenses.length}건</span>
                              )}
                            </div>
                            <div className="budget-cat-right">
                              <span style={{ color: catRemaining < 0 ? "var(--danger)" : "var(--green)", fontWeight: 700, fontSize: "0.9rem" }}>
                                잔액 {formatCurrency(catRemaining)}
                              </span>
                              <span className="budget-cat-toggle">{isExpanded ? "▾" : "▸"}</span>
                            </div>
                          </button>
                          <button
                            type="button"
                            className="budget-cat-edit-btn"
                            onClick={() => setEditingCategoryId(isEditing ? null : cat.id)}
                            title="항목 수정"
                          >
                            ✎
                          </button>
                        </div>

                        {/* 항목 수정 폼 */}
                        {isEditing && (
                          <div className="budget-cat-edit-wrap">
                            <form
                              action={async (fd) => { await updateCategory(fd); setEditingCategoryId(null); }}
                              className="budget-cat-edit-form"
                            >
                              <input type="hidden" name="category_id" value={cat.id} />
                              <label>
                                <span>항목 이름</span>
                                <input name="name" defaultValue={cat.name} />
                              </label>
                              <label>
                                <span>배정 금액</span>
                                <CurrencyInput name="allocated_amount" defaultValue={cat.allocatedAmount} required />
                              </label>
                              <label>
                                <span>색상</span>
                                <input name="color" type="color" defaultValue={cat.color} />
                              </label>
                              <div className="budget-cat-edit-actions">
                                <button type="submit" className="primary-button btn-with-icon">
                                  <SaveIcon className="btn-icon" />저장
                                </button>
                                <button type="button" className="secondary-button" onClick={() => setEditingCategoryId(null)}>취소</button>
                              </div>
                            </form>
                            <form action={deleteCategory} className="budget-cat-delete-form">
                              <input type="hidden" name="category_id" value={cat.id} />
                              <button type="submit" className="danger-button btn-with-icon">
                                <TrashIcon className="btn-icon" />항목 삭제
                              </button>
                            </form>
                          </div>
                        )}

                        {/* 지출 내역 */}
                        {isExpanded && !isEditing && (
                          <div className="budget-cat-expenses">
                            <div className="budget-cat-summary">
                              <span>배정 {formatCurrency(cat.allocatedAmount)}</span>
                              <span>·</span>
                              <span>지출 {formatCurrency(cat.spentAmount)}</span>
                            </div>
                            {cat.expenses.length === 0 ? (
                              <p className="budget-cat-empty">지출 내역이 없습니다.</p>
                            ) : (
                              cat.expenses.map((expense) => (
                                <div key={expense.id} className="budget-cat-expense-row">
                                  <div className="budget-cat-expense-info">
                                    <span className="budget-cat-expense-title">{expense.title}</span>
                                    {expense.note && (
                                      <span className="budget-cat-expense-note">{expense.note}</span>
                                    )}
                                  </div>
                                  <div className="budget-cat-expense-right">
                                    <strong>{formatCurrency(expense.amount)}</strong>
                                    <span className="budget-cat-expense-date">{formatDate(expense.spentOn)}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 예산 수정 / 삭제 */}
              <div className="budget-form-section">
                <form action={updateBudget} className="budget-edit-form">
                  <input type="hidden" name="budget_id" value={budget.id} />
                  <label>
                    <span>예산 이름</span>
                    <input name="name" defaultValue={budget.name} required />
                  </label>
                  <label>
                    <span>총 예산</span>
                    <CurrencyInput name="total_amount" defaultValue={budget.totalAmount} required />
                  </label>
                  <label>
                    <span>기간</span>
                    <input name="period_label" defaultValue={budget.periodLabel ?? ""} />
                  </label>
                  <div className="budget-bottom-actions">
                    <button type="submit" className="primary-button btn-with-icon">
                      <SaveIcon className="btn-icon" />수정 저장
                    </button>
                    <form action={deleteBudget} style={{ flex: 1 }}>
                      <input type="hidden" name="budget_id" value={budget.id} />
                      <button type="submit" className="danger-button btn-with-icon" style={{ width: "100%" }}>
                        <TrashIcon className="btn-icon" />예산 삭제
                      </button>
                    </form>
                  </div>
                </form>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
