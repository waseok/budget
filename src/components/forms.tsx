"use client";

import { useState } from "react";

import {
  createBudget,
  createCategory,
  createExpense,
  createWishlistItem,
} from "@/app/actions";

type Option = {
  id: string;
  name: string;
};

export function BudgetForm() {
  return (
    <form action={createBudget} className="form-card clean-card">
      <div className="form-heading">
        <p className="eyebrow">새 예산</p>
        <h2>예산 추가</h2>
      </div>
      <label>
        <span>예산 이름</span>
        <input name="name" placeholder="예: 2026년 1분기 생활비" required />
      </label>
      <label>
        <span>총 예산</span>
        <input name="total_amount" type="number" min="0" step="1000" placeholder="1500000" required />
      </label>
      <label>
        <span>기간</span>
        <input name="period_label" placeholder="예: 2026년 1분기" />
      </label>
      <button type="submit" className="primary-button">
        저장
      </button>
    </form>
  );
}

export function CategoryForm({ budgets }: { budgets: Option[] }) {
  return (
    <form action={createCategory} className="form-card clean-card">
      <div className="form-heading">
        <p className="eyebrow">예산 항목</p>
        <h2>세부 항목 추가</h2>
        <p className="field-help">항목명 없이 금액만 입력해도 됩니다. 예산을 세부 항목 없이 통으로 관리할 때 사용하세요.</p>
      </div>
      <label>
        <span>예산</span>
        <select name="budget_id" required defaultValue="" disabled={budgets.length === 0}>
          <option value="" disabled>
            {budgets.length === 0 ? "먼저 예산을 추가해주세요" : "예산 선택"}
          </option>
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>항목 이름 <span style={{ fontWeight: 400, color: "var(--muted)" }}>(선택)</span></span>
        <input name="name" placeholder="예: 교통비 — 비워도 됩니다" />
      </label>
      <label>
        <span>배정 금액</span>
        <input name="allocated_amount" type="number" min="0" step="1000" placeholder="300000" required />
      </label>
      <label>
        <span>색상</span>
        <input name="color" type="color" defaultValue="#2563eb" />
      </label>
      <button type="submit" className="primary-button">
        추가
      </button>
    </form>
  );
}

type BudgetWithCategories = {
  id: string;
  name: string;
  categories: Option[];
};

export function ExpenseForm({ budgets }: { budgets: BudgetWithCategories[] }) {
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  const filteredCategories =
    budgets.find((b) => b.id === selectedBudgetId)?.categories ?? [];

  const noBudgets = budgets.length === 0;

  return (
    <form action={createExpense} className="form-card clean-card">
      <div className="form-heading">
        <p className="eyebrow">지출 기록</p>
        <h2>지출 추가</h2>
      </div>
      <label>
        <span>예산</span>
        <select
          value={selectedBudgetId}
          onChange={(e) => setSelectedBudgetId(e.target.value)}
          disabled={noBudgets}
          required
        >
          <option value="" disabled>
            {noBudgets ? "먼저 예산을 추가해주세요" : "예산 선택"}
          </option>
          {budgets.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </label>
      <label>
        <span>세부 항목</span>
        <select name="category_id" required defaultValue="" disabled={!selectedBudgetId}>
          <option value="" disabled>
            {!selectedBudgetId
              ? "예산을 먼저 선택하세요"
              : filteredCategories.length === 0
              ? "이 예산에 세부 항목이 없습니다"
              : "세부 항목 선택"}
          </option>
          {filteredCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>
      <label>
        <span>지출명</span>
        <input name="title" placeholder="예: 주말 외식" required />
      </label>
      <label>
        <span>금액</span>
        <input name="amount" type="number" min="1" step="1" placeholder="65800" required />
      </label>
      <label>
        <span>지출일</span>
        <input name="spent_on" type="date" required />
      </label>
      <label>
        <span>메모</span>
        <textarea name="note" rows={3} placeholder="선택 입력" />
      </label>
      <button type="submit" className="primary-button">
        추가
      </button>
    </form>
  );
}

export function WishlistForm({ categories }: { categories: Option[] }) {
  return (
    <form action={createWishlistItem} className="form-card clean-card">
      <div className="form-heading">
        <p className="eyebrow">위시리스트</p>
        <h2>물품 추가</h2>
      </div>
      <label>
        <span>물건 이름</span>
        <input name="title" placeholder="예: 여행용 캐리어" required />
      </label>
      <label>
        <span>상품 링크</span>
        <input name="product_url" type="url" placeholder="https://..." />
      </label>
      <label>
        <span>이미지 URL</span>
        <input name="image_url" type="url" placeholder="https://..." />
      </label>
      <label>
        <span>예상 가격</span>
        <input name="expected_price" type="number" min="0" step="1000" placeholder="89000" />
      </label>
      <label>
        <span>연결 예산 항목</span>
        <select name="category_id" defaultValue="" disabled={categories.length === 0}>
          <option value="">
            {categories.length === 0 ? "먼저 예산 항목을 추가해주세요" : "선택 안 함"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <p className="field-help">
        예산만 추가하면 여기 드롭다운에는 보이지 않고, 예산 안에 항목을 추가해야 선택할 수
        있습니다.
      </p>
      <label>
        <span>우선순위</span>
        <select name="priority" defaultValue="medium">
          <option value="high">높음</option>
          <option value="medium">중간</option>
          <option value="low">낮음</option>
        </select>
      </label>
      <button type="submit" className="primary-button">
        추가
      </button>
    </form>
  );
}
