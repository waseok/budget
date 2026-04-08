"use client";

import { useState } from "react";

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
  budgetName: string;
};

type CategoryOption = {
  id: string;
  name: string;
  color: string;
};

export function ExpenseManager({
  expenses,
  categories,
}: {
  expenses: ExpenseItem[];
  categories: CategoryOption[];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const colorMap = Object.fromEntries(categories.map((c) => [c.id, c.color]));

  if (expenses.length === 0) return null;

  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">지출 관리</p>
          <h2>수정 / 삭제</h2>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: "10px",
        }}
      >
        {expenses.map((expense) => {
          const isOpen = expandedId === expense.id;
          const color = colorMap[expense.categoryId] ?? "#2563eb";
          return (
            <article key={expense.id} className="manager-item" style={{ padding: 0, overflow: "hidden" }}>
              {/* 요약 헤더 — 항상 표시 */}
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : expense.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "12px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {expense.title}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {expense.budgetName} - {expense.categoryName} · {formatDate(expense.spentOn)}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.82rem", fontWeight: 600, color: "var(--blue)" }}>
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--muted)", flexShrink: 0, marginTop: 2 }}>
                  {isOpen ? "▾" : "▸"}
                </span>
              </button>

              {/* 편집 폼 — 펼쳐질 때만 표시 */}
              {isOpen && (
                <div style={{ borderTop: "1px solid var(--line)", padding: "12px 14px" }}>
                  <form action={async (fd) => { await updateExpense(fd); setExpandedId(null); }} className="manager-form">
                    <input type="hidden" name="expense_id" value={expense.id} />
                    <label>
                      <span>지출명</span>
                      <input name="title" defaultValue={expense.title} required />
                    </label>
                    <label>
                      <span>예산 항목</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: colorMap[expense.categoryId] ?? "#2563eb",
                            flexShrink: 0,
                          }}
                        />
                        <select name="category_id" defaultValue={expense.categoryId} required style={{ flex: 1 }}>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
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
                      <textarea name="note" rows={2} defaultValue={expense.note ?? ""} />
                    </label>
                    <div className="manager-actions">
                      <button type="submit" className="primary-button">수정 저장</button>
                    </div>
                  </form>
                  <form action={deleteExpense} className="delete-form" style={{ marginTop: 6 }}>
                    <input type="hidden" name="expense_id" value={expense.id} />
                    <ConfirmDeleteButton
                      className="danger-button"
                      message={`"${expense.title}" 지출을 삭제하시겠습니까?`}
                    >
                      지출 삭제
                    </ConfirmDeleteButton>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
