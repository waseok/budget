"use client";

import { deleteExpense, updateExpense } from "@/app/actions";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { CurrencyInput } from "@/components/currency-input";
import { formatCurrency, formatDate } from "@/lib/format";

type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  spentOn: string;
  note: string | null;
  categoryId: string;
  categoryName: string;
};

type Option = {
  id: string;
  name: string;
};

export function ExpenseManager({
  expenses,
  categories,
}: {
  expenses: ExpenseItem[];
  categories: Option[];
}) {
  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">지출 관리</p>
          <h2>수정 / 삭제</h2>
        </div>
      </div>
      <div className="manager-list">
        {expenses.map((expense) => (
          <article key={expense.id} className="manager-item">
            <div className="manager-header">
              <div>
                <h3>{expense.title}</h3>
                <p className="muted">
                  {expense.categoryName} · {formatDate(expense.spentOn)} · {formatCurrency(expense.amount)}
                </p>
              </div>
            </div>
            <form action={updateExpense} className="manager-form">
              <input type="hidden" name="expense_id" value={expense.id} />
              <label>
                <span>지출명</span>
                <input name="title" defaultValue={expense.title} required />
              </label>
              <label>
                <span>예산 항목</span>
                <select name="category_id" defaultValue={expense.categoryId} required>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>금액</span>
                <CurrencyInput name="amount" defaultValue={expense.amount} required />
              </label>
              <label>
                <span>지출일</span>
                <input name="spent_on" type="date" defaultValue={expense.spentOn} required />
              </label>
              <label>
                <span>메모</span>
                <textarea name="note" rows={3} defaultValue={expense.note ?? ""} />
              </label>
              <div className="manager-actions">
                <button type="submit" className="primary-button">
                  수정 저장
                </button>
              </div>
            </form>
            <form action={deleteExpense} className="delete-form">
              <input type="hidden" name="expense_id" value={expense.id} />
              <ConfirmDeleteButton
                className="danger-button"
                message={`"${expense.title}" 지출을 삭제하시겠습니까?`}
              >
                지출 삭제
              </ConfirmDeleteButton>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
