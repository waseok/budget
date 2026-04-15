import crypto from "crypto";
import { cookies } from "next/headers";

import { createClient } from "@/lib/supabase/server";

// ── Password hashing (PBKDF2, Node.js built-in) ───────────────────────────

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(plain, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, storedHash] = stored.split(":");
  const hash = crypto.pbkdf2Sync(plain, salt, 100_000, 64, "sha512").toString("hex");
  if (storedHash.length !== hash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(storedHash, "hex"), Buffer.from(hash, "hex"));
}

// ── Session management ────────────────────────────────────────────────────

const COOKIE = "budget_session";

export type SessionUser = { id: string; username: string; name: string };

export async function createSession(userId: string, days = 30): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + days * 86_400_000).toISOString();

  const supabase = await createClient();
  const { error: sessionInsertError } = await supabase.from("app_sessions").insert({ user_id: userId, token, expires_at: expiresAt });

  if (sessionInsertError) {
    console.error("[auth.createSession] app_sessions insert failed", {
      userId,
      message: sessionInsertError.message,
      code: sessionInsertError.code,
      details: sessionInsertError.details,
      hint: sessionInsertError.hint,
    });
    throw new Error(`세션 생성 실패: ${sessionInsertError.message}`);
  }

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: days * 86_400,
    path: "/",
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("app_sessions")
    .select("expires_at, app_users(id, username, name)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!data) return null;

  const u = Array.isArray(data.app_users) ? data.app_users[0] : data.app_users;
  if (!u) return null;

  return { id: (u as SessionUser).id, username: (u as SessionUser).username, name: (u as SessionUser).name };
}

export async function deleteSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    const supabase = await createClient();
    await supabase.from("app_sessions").delete().eq("token", token);
    jar.delete(COOKIE);
  }
}
