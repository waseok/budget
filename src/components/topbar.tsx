import { signOut } from "@/app/actions";

export function Topbar({ name }: { name?: string | null }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-white/90 backdrop-blur border-b border-slate-100">
      {/* Spacer for mobile hamburger button */}
      <div className="w-10 lg:hidden flex-shrink-0" />

      {/* Search */}
      <div className="relative w-96 max-lg:w-full max-lg:max-w-xs">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none"
          style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}
        >
          search
        </span>
        <input
          type="search"
          placeholder="검색..."
          className="w-full bg-slate-100/80 border-0 rounded-full pl-10 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-px h-6 bg-slate-200 max-sm:hidden" />

        {name ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 font-headline max-sm:hidden">{name}님</span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-headline font-semibold text-sm flex-shrink-0">
              {name.charAt(0).toUpperCase()}
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg py-1.5 px-3 transition-colors max-sm:hidden"
              >
                로그아웃
              </button>
            </form>
          </div>
        ) : (
          <a
            href="/login"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg py-1.5 px-3 transition-colors font-headline"
          >
            로그인
          </a>
        )}
      </div>
    </header>
  );
}
