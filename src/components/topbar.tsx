import { signOut } from "@/app/actions";

export function Topbar({ name }: { name?: string | null }) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">{name ? `${name}님` : "로그인이 필요합니다"}</p>
      </div>
      {name ? (
        <form action={signOut}>
          <button type="submit" className="secondary-button">
            로그아웃
          </button>
        </form>
      ) : (
        <a href="/login" className="secondary-button">
          로그인
        </a>
      )}
    </header>
  );
}
