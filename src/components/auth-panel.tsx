"use client";

import { useActionState, useState } from "react";

import { signIn, signUp } from "@/app/actions";

type Mode = "signin" | "signup";

function translateAuthError(error: string): string {
  if (error.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (error.includes("Email not confirmed")) return "이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.";
  if (error.includes("User already registered")) return "이미 가입된 이메일입니다. 로그인해주세요.";
  if (error.includes("Password should be at least")) return "비밀번호는 최소 6자 이상이어야 합니다.";
  if (error.includes("Unable to validate email address")) return "유효한 이메일 주소를 입력해주세요.";
  return error;
}

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInState, signInAction, signInPending] = useActionState(signIn, null);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, null);

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
        <h1>{mode === "signin" ? "로그인" : "회원가입"}</h1>
        <p className="muted">
          {mode === "signin"
            ? "가입한 계정으로 로그인해서 예산을 이어서 관리할 수 있어요."
            : "이름, 이메일, 비밀번호만 입력하면 바로 가입할 수 있어요."}
        </p>
      </div>

      {mode === "signin" ? (
        <form action={signInAction} className="auth-form">
          <label>
            <span>이메일</span>
            <input type="email" name="email" placeholder="teacher@example.com" required />
          </label>
          <label>
            <span>비밀번호</span>
            <input type="password" name="password" placeholder="비밀번호 입력" required />
          </label>
          <button type="submit" className="primary-button auth-submit" disabled={signInPending}>
            {signInPending ? "로그인 중..." : "로그인하기"}
          </button>
          {signInState?.error ? (
            <p className="error-message">{translateAuthError(signInState.error)}</p>
          ) : null}
        </form>
      ) : (
        <form action={signUpAction} className="auth-form">
          <label>
            <span>이름</span>
            <input type="text" name="name" placeholder="예: 홍길동" />
          </label>
          <label>
            <span>이메일</span>
            <input type="email" name="email" placeholder="teacher@example.com" required />
          </label>
          <label>
            <span>비밀번호</span>
            <input type="password" name="password" placeholder="8자 이상 입력" required />
          </label>
          <button type="submit" className="primary-button auth-submit" disabled={signUpPending}>
            {signUpPending ? "처리 중..." : "회원가입하기"}
          </button>
          {signUpState?.error ? (
            <p className="error-message">{translateAuthError(signUpState.error)}</p>
          ) : null}
          {signUpState?.message ? (
            <p className="success-message">{signUpState.message}</p>
          ) : null}
        </form>
      )}
    </section>
  );
}
