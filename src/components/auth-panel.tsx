"use client";

import { useActionState, useTransition, useState, useEffect, useRef } from "react";

import { signIn, signUp, getSecurityQuestion, resetPassword } from "@/app/actions";

function PasswordInput({ name, placeholder, autoComplete }: { name: string; placeholder?: string; autoComplete?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        required
        autoComplete={autoComplete}
        style={{ paddingRight: 44 }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted)",
          padding: 4,
          display: "flex",
          alignItems: "center",
        }}
        tabIndex={-1}
        aria-label={show ? "비밀번호 숨기기" : "비밀번호 보기"}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 20" }}>
          {show ? "visibility_off" : "visibility"}
        </span>
      </button>
    </div>
  );
}

const SAVED_ID_KEY = "budget_saved_username";

type Mode = "signin" | "signup" | "forgot";

const SECURITY_QUESTIONS = [
  "어릴 때 살았던 동네 이름은?",
  "가장 좋아하는 음식은?",
  "첫 번째 학교 이름은?",
  "가장 친한 친구 이름은?",
  "어머니의 성함은?",
];

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("signin");

  const [signInState, signInAction, signInPending] = useActionState(signIn, null);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, null);
  const [resetState, resetAction, resetPending] = useActionState(resetPassword, null);

  // 아이디 저장
  const [savedUsername, setSavedUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(SAVED_ID_KEY);
    if (saved) { setSavedUsername(saved); setRememberMe(true); }
  }, []);

  function handleSignInSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fd = new FormData(e.currentTarget);
    const username = (fd.get("username") as string).trim();
    if (rememberMe) localStorage.setItem(SAVED_ID_KEY, username);
    else localStorage.removeItem(SAVED_ID_KEY);
  }

  // Forgot password — 2-step flow managed with local state
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotUsername, setForgotUsername] = useState("");
  const [forgotQuestion, setForgotQuestion] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleModeChange(m: Mode) {
    setMode(m);
    setForgotStep(1);
    setForgotError("");
  }

  function handleGetQuestion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const username = (fd.get("username") as string).trim();
    setForgotError("");
    startTransition(async () => {
      const result = await getSecurityQuestion(null, fd);
      if (result.question) {
        setForgotUsername(username);
        setForgotQuestion(result.question);
        setForgotStep(2);
      } else {
        setForgotError(result.error);
      }
    });
  }

  const modeLabel: Record<Mode, string> = {
    signin: "로그인",
    signup: "회원가입",
    forgot: "비밀번호 찾기",
  };

  return (
    <section className="panel auth-panel">
      <div className="auth-toggle">
        {(["signin", "signup", "forgot"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={mode === m ? "toggle-button active" : "toggle-button"}
            onClick={() => handleModeChange(m)}
          >
            {modeLabel[m]}
          </button>
        ))}
      </div>

      <div className="auth-copy">
        <p className="eyebrow">계정 인증</p>
        <h1>{modeLabel[mode]}</h1>
        <p className="muted">
          {mode === "signin" && "아이디와 비밀번호로 로그인하세요."}
          {mode === "signup" && "아이디, 이름, 비밀번호로 바로 가입할 수 있습니다."}
          {mode === "forgot" && "가입 시 설정한 비밀 질문으로 비밀번호를 재설정합니다."}
        </p>
      </div>

      {/* ── 로그인 ── */}
      {mode === "signin" && (
        <form action={signInAction} className="auth-form" onSubmit={handleSignInSubmit}>
          <label>
            <span>아이디</span>
            <input
              ref={usernameRef}
              type="text"
              name="username"
              placeholder="아이디 입력"
              required
              autoComplete="username"
              defaultValue={savedUsername}
            />
          </label>
          <label>
            <span>비밀번호</span>
            <PasswordInput name="password" placeholder="비밀번호 입력" autoComplete="current-password" />
          </label>
          <div className="auth-options">
            <label className="auth-check">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>아이디 저장</span>
            </label>
            <label className="auth-check">
              <input type="checkbox" name="auto_login" />
              <span>자동 로그인</span>
            </label>
          </div>
          <button type="submit" className="primary-button auth-submit" disabled={signInPending}>
            {signInPending ? "로그인 중..." : "로그인하기"}
          </button>
          {signInState?.error && <p className="error-message">{signInState.error}</p>}
        </form>
      )}

      {/* ── 회원가입 ── */}
      {mode === "signup" && (
        <form action={signUpAction} className="auth-form">
          <label>
            <span>아이디</span>
            <input type="text" name="username" placeholder="2자 이상, 영문·숫자 권장" required autoComplete="username" />
          </label>
          <label>
            <span>이름</span>
            <input type="text" name="name" placeholder="홍길동" required />
          </label>
          <label>
            <span>비밀번호</span>
            <PasswordInput name="password" placeholder="6자 이상" autoComplete="new-password" />
          </label>
          <label>
            <span>비밀번호 확인</span>
            <PasswordInput name="confirm_password" placeholder="비밀번호 재입력" autoComplete="new-password" />
          </label>
          <label>
            <span>비밀 질문</span>
            <select name="security_question" required>
              {SECURITY_QUESTIONS.map((q) => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
          </label>
          <label>
            <span>비밀 답변</span>
            <input type="text" name="security_answer" placeholder="비밀번호 분실 시 사용됩니다" required />
          </label>
          <button type="submit" className="primary-button auth-submit" disabled={signUpPending}>
            {signUpPending ? "처리 중..." : "가입하기"}
          </button>
          {signUpState?.error && <p className="error-message">{signUpState.error}</p>}
        </form>
      )}

      {/* ── 비밀번호 찾기 ── */}
      {mode === "forgot" && (
        <>
          {forgotStep === 1 ? (
            <form onSubmit={handleGetQuestion} className="auth-form">
              <label>
                <span>아이디</span>
                <input type="text" name="username" placeholder="가입한 아이디 입력" required />
              </label>
              <button type="submit" className="primary-button auth-submit" disabled={isPending}>
                {isPending ? "확인 중..." : "비밀 질문 확인"}
              </button>
              {forgotError && <p className="error-message">{forgotError}</p>}
            </form>
          ) : (
            <form action={resetAction} className="auth-form">
              <input type="hidden" name="username" value={forgotUsername} />
              <div className="security-question-box">
                <p className="eyebrow">비밀 질문</p>
                <p className="security-question-text">{forgotQuestion}</p>
              </div>
              <label>
                <span>비밀 답변</span>
                <input type="text" name="security_answer" placeholder="답변 입력" required />
              </label>
              <label>
                <span>새 비밀번호</span>
                <PasswordInput name="new_password" placeholder="6자 이상" autoComplete="new-password" />
              </label>
              <label>
                <span>비밀번호 확인</span>
                <PasswordInput name="confirm_password" placeholder="비밀번호 재입력" autoComplete="new-password" />
              </label>
              <button type="submit" className="primary-button auth-submit" disabled={resetPending}>
                {resetPending ? "재설정 중..." : "비밀번호 재설정"}
              </button>
              {resetState?.error && <p className="error-message">{resetState.error}</p>}
              <button
                type="button"
                className="text-link"
                style={{ textAlign: "left", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                onClick={() => { setForgotStep(1); setForgotError(""); }}
              >
                ← 다른 아이디로 찾기
              </button>
            </form>
          )}
        </>
      )}
    </section>
  );
}
