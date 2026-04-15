import { formatCurrency } from "@/lib/format";
import { WishlistThumbnail } from "@/components/wishlist-thumbnail";

type WishlistItem = {
  id: string;
  title: string;
  note: string | null;
  expectedPrice: number | null;
  priority: "low" | "medium" | "high";
  status: "considering" | "planned" | "purchased";
  imageUrl: string | null;
  productUrl: string | null;
};

const priorityLabel = {
  low: "낮음",
  medium: "중간",
  high: "높음",
};

const priorityClasses = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

export function WishlistGrid({ items }: { items: WishlistItem[] }) {
  const visibleItems = items.filter((item) => item.status !== "purchased");

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-1 font-headline">
            구매 계획
          </p>
          <h2 className="text-lg font-medium text-slate-900 font-headline m-0">위시리스트</h2>
        </div>
        <a
          href="/wishlist"
          className="text-sm font-medium text-blue-600 hover:text-blue-700 font-headline transition-colors"
        >
          목록 페이지
        </a>
      </div>
      {visibleItems.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">위시리스트가 비어 있습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {visibleItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="relative aspect-video">
                  <WishlistThumbnail imageUrl={item.imageUrl} title={item.title} />
                </div>
                <div className="p-3 grid gap-2">
                  <div className="grid gap-1.5">
                    <h3 className="text-sm font-medium text-slate-800 truncate m-0">{item.title}</h3>
                    <span
                      className={`w-fit text-xs font-medium px-2 py-0.5 rounded-full ${priorityClasses[item.priority]}`}
                    >
                      우선순위 {priorityLabel[item.priority]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 m-0 truncate">{item.note ?? "메모가 아직 없습니다."}</p>
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-medium text-slate-800 font-headline">
                      {formatCurrency(item.expectedPrice ?? 0)}
                    </strong>
                    {item.productUrl ? (
                      <a
                        href={item.productUrl}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        링크 열기
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">링크 없음</span>
                    )}
                  </div>
                </div>
              </article>
          ))}
        </div>
      )}
    </section>
  );
}
