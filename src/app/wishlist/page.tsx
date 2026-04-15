import { EmptyState } from "@/components/empty-state";
import { WishlistForm } from "@/components/forms";
import { WishlistManager } from "@/components/wishlist-manager";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { getBudgetsForWishlist, getWishlistItems } from "@/lib/data";
import { getSession } from "@/lib/auth";

export default async function WishlistPage() {
  const session = await getSession();
  const user = session
    ? { id: session.id, name: session.name, username: session.username }
    : null;

  const [budgetsForWishlist, wishlistItems] = session
    ? await Promise.all([
        getBudgetsForWishlist(session.id),
        getWishlistItems(session.id),
      ])
    : [[], []];

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar user={user?.name} />
      <div className="flex-1 flex flex-col ml-72 max-lg:ml-0">
        <Topbar name={user?.name} />
        <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
        {!user ? (
          <EmptyState
            title="로그인이 필요합니다."
            description="로그인 후 위시리스트를 추가, 수정, 삭제할 수 있습니다."
          />
        ) : (
          <div className="space-y-8">
            <WishlistForm budgets={budgetsForWishlist} />
            <WishlistManager items={wishlistItems} budgets={budgetsForWishlist} />
          </div>
        )}
        </div>
      </div>
    </main>
  );
}
