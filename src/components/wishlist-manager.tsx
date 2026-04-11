"use client";

import { useMemo, useState } from "react";

import { deleteWishlistItem, updateWishlistItem } from "@/app/actions";
import { type BudgetForWishlist } from "@/components/forms";
import { ConfirmDeleteButton } from "@/components/confirm-delete-button";
import { CurrencyInput } from "@/components/currency-input";
import { WishlistThumbnail } from "@/components/wishlist-thumbnail";
import { formatCurrency } from "@/lib/format";

type WishlistItem = {
  id: string;
  title: string;
  note: string | null;
  expectedPrice: number | null;
  priority: "low" | "medium" | "high";
  imageUrl: string | null;
  productUrl: string | null;
  categoryId: string | null;
};

function WishlistItemRow({ item, budgets }: { item: WishlistItem; budgets: BudgetForWishlist[] }) {
  const initialBudgetId = useMemo(() => {
    if (!item.categoryId) return "";
    return budgets.find((bg) => bg.categories.some((c) => c.id === item.categoryId))?.id ?? "";
  }, [budgets, item.categoryId]);

  const [selectedBudgetId, setSelectedBudgetId] = useState(initialBudgetId);
  const [selectedCategoryId, setSelectedCategoryId] = useState(item.categoryId ?? "");

  const selectedBudget = budgets.find((b) => b.id === selectedBudgetId);
  const filteredCategories = selectedBudget?.categories ?? [];
  const noBudgets = budgets.length === 0;

  return (
    <article className="manager-item">
      <div className="manager-header">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
          <WishlistThumbnail imageUrl={item.imageUrl} title={item.title} sizes="56px" />
        </div>
        <div className="min-w-0 flex-1">
          <h3>{item.title}</h3>
          <p className="muted">
            {formatCurrency(item.expectedPrice ?? 0)} · 우선순위 {item.priority}
          </p>
        </div>
      </div>
      <form action={updateWishlistItem} className="manager-form">
        <input type="hidden" name="wishlist_id" value={item.id} />
        <label>
          <span>물건 이름</span>
          <input name="title" defaultValue={item.title} required />
        </label>
        <label>
          <span>상품 링크</span>
          <input name="product_url" type="url" defaultValue={item.productUrl ?? ""} />
        </label>
        <label>
          <span>썸네일 이미지 URL</span>
          <input name="image_url" type="url" defaultValue={item.imageUrl ?? ""} />
        </label>
        <label>
          <span>예상 가격</span>
          <CurrencyInput
            name="expected_price"
            defaultValue={item.expectedPrice ?? undefined}
            placeholder="10원 단위까지 입력 가능"
          />
        </label>
        <label>
          <span>통예산</span>
          <select
            value={selectedBudgetId}
            onChange={(e) => {
              setSelectedBudgetId(e.target.value);
              setSelectedCategoryId("");
            }}
            disabled={noBudgets}
          >
            <option value="" disabled>
              {noBudgets ? "먼저 예산 탭에서 예산을 추가해주세요" : "예산 선택"}
            </option>
            {budgets.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>연결 예산 세부 항목</span>
          <select
            name="category_id"
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            disabled={!selectedBudgetId}
          >
            <option value="">
              {!selectedBudgetId
                ? "먼저 통예산을 선택하세요"
                : filteredCategories.length === 0
                  ? "이 예산에 세부 항목이 없습니다"
                  : "선택 안 함"}
            </option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>우선순위</span>
          <select name="priority" defaultValue={item.priority}>
            <option value="high">높음</option>
            <option value="medium">중간</option>
            <option value="low">낮음</option>
          </select>
        </label>
        <label>
          <span>메모</span>
          <textarea name="memo" rows={3} defaultValue={item.note ?? ""} />
        </label>
        <div className="manager-actions">
          <button type="submit" className="primary-button">
            수정 저장
          </button>
        </div>
      </form>
      <form action={deleteWishlistItem} className="delete-form">
        <input type="hidden" name="wishlist_id" value={item.id} />
        <ConfirmDeleteButton
          className="danger-button"
          message={`"${item.title}" 항목을 삭제하시겠습니까?`}
        >
          위시리스트 삭제
        </ConfirmDeleteButton>
      </form>
    </article>
  );
}

export function WishlistManager({
  items,
  budgets,
}: {
  items: WishlistItem[];
  budgets: BudgetForWishlist[];
}) {
  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">위시리스트 관리</p>
          <h2>수정 / 삭제</h2>
        </div>
      </div>
      <div className="manager-list">
        {items.map((item) => (
          <WishlistItemRow key={item.id} item={item} budgets={budgets} />
        ))}
      </div>
    </section>
  );
}
