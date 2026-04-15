import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL 환경변수가 설정되지 않았습니다.");
  }

  // 서버 액션/라우트는 custom session(app_sessions) 기반이라 JWT(auth.uid())를 쓰지 않습니다.
  // RLS가 켜진 환경에서도 동작하도록 service role을 우선 사용하고, 없으면 anon key로 폴백합니다.
  const key = serviceRoleKey ?? anonKey;

  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY가 필요합니다.");
  }

  return createSupabaseClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
