import { EmptyState } from "@/components/empty-state";
import { WishlistForm } from "@/components/forms";
import { WishlistManager } from "@/components/wishlist-manager";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { WishlistGrid } from "@/components/wishlist-grid";
import { getDashboardData } from "@/lib/data";

export default async function WishlistPage() {
  const data = await getDashboardData();
  const categories = data.budgets.flatMap((budget) => budget.categories);

  return (
    <main className="app-shell">
      <Sidebar />
      <div className="content-shell">
        <Topbar name={data.user?.name} />
        {!data.user ? (
          <EmptyState
            title="로그인이 필요합니다."
            description="로그인 후 위시리스트를 추가, 수정, 삭제할 수 있습니다."
          />
        ) : (
          <>
            <WishlistForm categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
            <WishlistManager
              items={data.wishlistItems}
              categories={categories.map((category) => ({ id: category.id, name: category.name }))}
            />
            <WishlistGrid items={data.wishlistItems} />
          </>
        )}
      </div>
    </main>
  );
}
