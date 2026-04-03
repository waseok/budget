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

const priorityClasses = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
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
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1 font-headline">
            구매 계획
          </p>
          <h2 className="text-lg font-bold text-slate-900 font-headline m-0">위시리스트</h2>
        </div>
        <a
          href="/wishlist"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 font-headline transition-colors"
        >
          목록 페이지
        </a>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">위시리스트가 비어 있습니다.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => {
            const imageSrc = isAllowedImage(item.imageUrl)
              ? item.imageUrl!
              : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

            return (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                <div className="relative aspect-video">
                  <Image src={imageSrc} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-3 grid gap-2">
                  <div className="grid gap-1.5">
                    <h3 className="text-sm font-semibold text-slate-800 truncate m-0">{item.title}</h3>
                    <span
                      className={`w-fit text-xs font-semibold px-2 py-0.5 rounded-full ${priorityClasses[item.priority]}`}
                    >
                      우선순위 {priorityLabel[item.priority]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 m-0 truncate">{item.note ?? "메모가 아직 없습니다."}</p>
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-sm font-bold text-slate-800 font-headline">
                      {formatCurrency(item.expectedPrice ?? 0)}
                    </strong>
                    {item.productUrl ? (
                      <a
                        href={item.productUrl}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        링크 열기
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">링크 없음</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
