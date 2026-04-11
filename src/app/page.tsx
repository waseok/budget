import { DonutChart } from "@/components/donut-chart";
import { EmptyState } from "@/components/empty-state";
import { RecentExpenses } from "@/components/recent-expenses";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { WishlistGrid } from "@/components/wishlist-grid";
import { getDashboardData } from "@/lib/data";
import { formatCurrency } from "@/lib/format";

export default async function HomePage() {
  const data = await getDashboardData();
  const categories = data.budgets.flatMap((budget) => budget.categories);
  const totalBudget = data.budgets.reduce((sum, item) => sum + item.totalAmount, 0);
  const totalSpent = categories.reduce((sum, item) => sum + item.spentAmount, 0);
  const totalRemaining = totalBudget - totalSpent;
  const wishlistBudget = data.wishlistItems.reduce((sum, item) => sum + (item.expectedPrice ?? 0), 0);
  const rawUsage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const usageDisplay = rawUsage === 0 ? "0" : rawUsage < 1 ? "< 1" : Math.round(rawUsage).toString();

  return (
    <main className="flex min-h-screen bg-slate-50">
      <Sidebar user={data.user?.name} />
      <div className="flex-1 flex flex-col ml-72 max-lg:ml-0">
        <Topbar name={data.user?.name} />
        <div className="flex-1 p-8 max-w-[1400px] mx-auto w-full">

          {/* Page Header */}
          <div className="mb-8">
            <p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-1 font-headline">
              Portfolio Overview
            </p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h1 className="text-2xl font-medium text-slate-900 font-headline tracking-tight m-0">
                나의 예산 현황
              </h1>
              <div className="flex gap-3">
                <a
                  href="/budgets"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-headline font-medium text-sm transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-base leading-none"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    account_balance_wallet
                  </span>
                  예산 관리
                </a>
                <a
                  href="/expenses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-headline font-medium text-sm transition-colors shadow-sm"
                >
                  <span
                    className="material-symbols-outlined text-base leading-none"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    add
                  </span>
                  지출 추가
                </a>
              </div>
            </div>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-12 gap-6 mb-6">
            {/* Main Hero Card */}
            <div className="col-span-12 lg:col-span-8 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-1 font-headline">
                총 잔여 예산
              </p>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-medium text-slate-900 font-headline tracking-tight leading-none">
                  {formatCurrency(totalRemaining)}
                </span>
                <span
                  className={`text-sm font-medium px-2.5 py-1 rounded-full mb-1 ${
                    totalRemaining >= 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {totalRemaining >= 0 ? "잔여" : "초과"}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">예산 사용률</span>
                  <span className="text-sm font-medium text-slate-700 font-headline">{usageDisplay}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      rawUsage > 90 ? "bg-red-500" : rawUsage > 70 ? "bg-amber-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${Math.min(rawUsage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50/80 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 font-medium mb-1">전체 예산</p>
                  <p className="text-base font-medium text-slate-800 font-headline">{formatCurrency(totalBudget)}</p>
                </div>
                <div className="bg-slate-50/80 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 font-medium mb-1">사용 금액</p>
                  <p className="text-base font-medium text-slate-800 font-headline">{formatCurrency(totalSpent)}</p>
                </div>
                <div className="bg-slate-50/80 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 font-medium mb-1">위시리스트</p>
                  <p className="text-base font-medium text-slate-800 font-headline">{formatCurrency(wishlistBudget)}</p>
                </div>
              </div>
            </div>

            {/* Side Cards */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
              {/* Trending Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="material-symbols-outlined text-blue-600 text-xl"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    trending_up
                  </span>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-widest font-headline">
                    사용 현황
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">예산 수</span>
                    <span className="text-sm font-medium text-slate-800 font-headline">
                      {data.budgets.length}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">카테고리 수</span>
                    <span className="text-sm font-medium text-slate-800 font-headline">
                      {categories.length}개
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">최근 지출</span>
                    <span className="text-sm font-medium text-slate-800 font-headline">
                      {data.expenses.length}건
                    </span>
                  </div>
                </div>
              </div>

              {/* Tip Card */}
              <div className="bg-blue-600 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="material-symbols-outlined text-blue-200 text-xl"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                  >
                    lightbulb
                  </span>
                  <p className="text-xs font-medium text-blue-200 uppercase tracking-widest font-headline">
                    팁
                  </p>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  예산 카테고리별로 지출을 분류하면 어디서 가장 많이 쓰는지 한눈에 파악할 수 있어요.
                </p>
              </div>
            </div>
          </div>

          {data.user ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-blue-600 text-xl"
                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                      >
                        account_balance_wallet
                      </span>
                    </div>
                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide font-headline">전체 예산</p>
                  </div>
                  <p className="text-xl font-medium text-slate-900 font-headline">{formatCurrency(totalBudget)}</p>
                  <p className="text-xs text-slate-400 mt-1">등록된 전체 예산 금액</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-orange-500 text-xl"
                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                      >
                        receipt_long
                      </span>
                    </div>
                    <p className="text-xs font-medium text-orange-500 uppercase tracking-wide font-headline">누적 지출</p>
                  </div>
                  <p className="text-xl font-medium text-slate-900 font-headline">{formatCurrency(totalSpent)}</p>
                  <p className="text-xs text-slate-400 mt-1">현재까지 사용한 금액</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-emerald-600 text-xl"
                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                      >
                        bar_chart
                      </span>
                    </div>
                    <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide font-headline">남은 예산</p>
                  </div>
                  <p className={`text-xl font-medium font-headline ${totalRemaining < 0 ? "text-red-600" : "text-slate-900"}`}>
                    {formatCurrency(totalRemaining)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">지금 남아 있는 사용 가능 금액</p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                      <span
                        className="material-symbols-outlined text-pink-600 text-xl"
                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
                      >
                        favorite
                      </span>
                    </div>
                    <p className="text-xs font-medium text-pink-600 uppercase tracking-wide font-headline">위시리스트</p>
                  </div>
                  <p className="text-xl font-medium text-slate-900 font-headline">{formatCurrency(wishlistBudget)}</p>
                  <p className="text-xs text-slate-400 mt-1">구매 예정 금액 합계</p>
                </div>
              </div>

              {/* Budget Usage / Donut Charts */}
              {data.budgets.length > 0 && (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-1 font-headline">
                        Usage Overview
                      </p>
                      <h2 className="text-lg font-medium text-slate-900 font-headline m-0">예산별 사용률</h2>
                    </div>
                    <a href="/budgets" className="text-sm font-medium text-blue-600 hover:text-blue-700 font-headline transition-colors">
                      전체 보기
                    </a>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {data.budgets.map((budget, index) => {
                      const spent = budget.categories.reduce((sum, item) => sum + item.spentAmount, 0);
                      const usage = budget.totalAmount > 0 ? (spent / budget.totalAmount) * 100 : 0;
                      const tone = index % 3 === 0 ? "blue" : index % 3 === 1 ? "orange" : "green";
                      return (
                        <DonutChart key={budget.id} value={usage} centerTitle={budget.name} centerSubtitle="사용률" tone={tone} />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom: Recent Activity + Category */}
              {data.budgets.length === 0 ? (
                <EmptyState
                  title="먼저 예산을 만들고, 이어서 예산 항목까지 추가해보세요."
                  description="예산 탭에서 예산을 추가하면 지출과 위시리스트가 연결됩니다."
                />
              ) : (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-7">
                    <RecentExpenses expenses={data.expenses} />
                  </div>
                  <div className="col-span-12 lg:col-span-5">
                    <WishlistGrid items={data.wishlistItems} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="로그인하면 바로 예산 관리 화면을 사용할 수 있습니다."
              description="회원가입 또는 로그인 후 예산, 지출, 위시리스트까지 한 번에 관리할 수 있습니다."
            />
          )}
        </div>
      </div>
    </main>
  );
}
