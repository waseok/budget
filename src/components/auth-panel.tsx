"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export function AuthPanel() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleEmailAuth = () => {
    setError("");
    setMessage("");

    startTransition(async () => {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        router.push("/");
        router.refresh();
        return;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      setMessage("회원가입이 완료되었습니다. 이메일 인증이 켜져 있으면 메일을 먼저 확인해주세요.");
    });
  };

  return (
    <section className="panel auth-panel">
      <div className="auth-toggle">
        <button
          type="button"
          className={mode === "signin" ? "toggle-button active" : "toggle-button"}
          onClick={() => setMode("signin")}
        >
          로그인
        </button>
        <button
          type="button"
          className={mode === "signup" ? "toggle-button active" : "toggle-button"}
          onClick={() => setMode("signup")}
        >
          회원가입
        </button>
      </div>

      <div className="auth-copy">
        <p className="eyebrow">계정 인증</p>
        <h1>{mode === "signin" ? "이메일과 비밀번호로 로그인" : "이메일로 회원가입"}</h1>
        <p className="muted">
          {mode === "signin"
            ? "가입한 계정으로 바로 로그인해서 예산 데이터를 이어서 관리할 수 있어요."
            : "새 계정을 만든 뒤 내 예산과 지출 기록을 저장해서 사용할 수 있어요."}
        </p>
      </div>

      <div className="auth-form">
        <label>
          <span>이메일</span>
          <input
            type="email"
            placeholder="teacher@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          <span>비밀번호</span>
          <input
            type="password"
            placeholder="8자 이상 입력"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button
          type="button"
          className="primary-button auth-submit"
          onClick={handleEmailAuth}
          disabled={isPending}
        >
          {mode === "signin" ? "로그인하기" : "회원가입하기"}
        </button>
      </div>

      {message ? <p className="success-message">{message}</p> : null}
      {error ? <p className="error-message">{error}</p> : null}
    </section>
  );
}
