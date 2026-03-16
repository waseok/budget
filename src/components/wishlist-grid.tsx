import Image from "next/image";

import { formatCurrency } from "@/lib/format";

type WishlistItem = {
  id: string;
  title: string;
  note: string | null;
  expectedPrice: number | null;
  priority: "low" | "medium" | "high";
  imageUrl: string | null;
  productUrl: string | null;
};

const priorityLabel = {
  low: "낮음",
  medium: "중간",
  high: "높음",
};

function isAllowedImage(url: string | null) {
  if (!url) return false;

  try {
    const parsed = new URL(url);
    return ["images.unsplash.com", "www.gimkit.com", "gimkit.com"].includes(parsed.hostname);
  } catch {
    return false;
  }
}

export function WishlistGrid({ items }: { items: WishlistItem[] }) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">구매 계획</p>
          <h2>위시리스트</h2>
        </div>
        <a href="/wishlist" className="text-link">
          목록 페이지
        </a>
      </div>
      <div className="wishlist-grid">
        {items.map((item) => {
          const imageSrc = isAllowedImage(item.imageUrl)
            ? item.imageUrl!
            : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

          return (
            <article key={item.id} className="wishlist-card">
              <div className="wishlist-image-wrap">
                <Image src={imageSrc} alt={item.title} fill className="wishlist-image" />
              </div>
              <div className="wishlist-body">
                <div className="wishlist-head">
                  <h3>{item.title}</h3>
                  <span className={`priority-pill priority-${item.priority}`}>
                    우선순위 {priorityLabel[item.priority]}
                  </span>
                </div>
                <p className="muted">{item.note ?? "메모가 아직 없습니다."}</p>
                <div className="wishlist-footer">
                  <strong>{formatCurrency(item.expectedPrice ?? 0)}</strong>
                  {item.productUrl ? (
                    <a href={item.productUrl} className="text-link">
                      링크 열기
                    </a>
                  ) : (
                    <span className="muted">링크 없음</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
