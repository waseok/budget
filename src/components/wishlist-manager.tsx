import { deleteWishlistItem, updateWishlistItem } from "@/app/actions";
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

type Option = {
  id: string;
  name: string;
};

export function WishlistManager({
  items,
  categories,
}: {
  items: WishlistItem[];
  categories: Option[];
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
          <article key={item.id} className="manager-item">
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
                <span>연결 예산 세부 항목</span>
                <select name="category_id" defaultValue={item.categoryId ?? ""}>
                  <option value="">선택 안 함</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
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
        ))}
      </div>
    </section>
  );
}
