import { signOut } from "@/app/actions";

export function Topbar({ email }: { email?: string | null }) {
  return (
    <header className="topbar">
      <div>
        <p className="topbar-label">{email ? email : "로그인이 필요합니다"}</p>
      </div>
      {email ? (
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
