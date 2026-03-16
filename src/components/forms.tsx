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
        <input name="name" placeholder="예: 2026년 1학기 학급 운영비" required />
      </label>
      <label>
        <span>총 예산</span>
        <input name="total_amount" type="number" min="0" step="1000" placeholder="1500000" required />
      </label>
      <label>
        <span>기간</span>
        <input name="period_label" placeholder="예: 2026년 1학기" />
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
        <h2>항목 추가</h2>
      </div>
      <label>
        <span>예산</span>
        <select name="budget_id" required defaultValue="">
          <option value="" disabled>
            예산 선택
          </option>
          {budgets.map((budget) => (
            <option key={budget.id} value={budget.id}>
              {budget.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>항목 이름</span>
        <input name="name" placeholder="예: 교실 소모품" required />
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

export function ExpenseForm({ categories }: { categories: Option[] }) {
  return (
    <form action={createExpense} className="form-card clean-card">
      <div className="form-heading">
        <p className="eyebrow">지출 기록</p>
        <h2>지출 추가</h2>
      </div>
      <label>
        <span>예산 항목</span>
        <select name="category_id" required defaultValue="" disabled={categories.length === 0}>
          <option value="" disabled>
            {categories.length === 0 ? "먼저 예산 항목을 추가하세요" : "항목 선택"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>지출명</span>
        <input name="title" placeholder="예: 활동지 인쇄" required />
      </label>
      <label>
        <span>금액</span>
        <input name="amount" type="number" min="1" step="1000" placeholder="25000" required />
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
        <input name="title" placeholder="예: 라벨 프린터" required />
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
            {categories.length === 0 ? "먼저 예산 항목을 추가하세요" : "선택 안 함"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <p className="field-help">예산만 추가해선 안 보이고, 예산 안에 항목을 추가해야 여기에 나타납니다.</p>
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
