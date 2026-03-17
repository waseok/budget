-- ============================================================
-- Budget App - Custom Auth Migration
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- 1. Custom auth tables
CREATE TABLE IF NOT EXISTS app_users (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  username             TEXT        UNIQUE NOT NULL CHECK (char_length(username) >= 2),
  name                 TEXT        NOT NULL,
  password_hash        TEXT        NOT NULL,
  security_question    TEXT        NOT NULL,
  security_answer_hash TEXT        NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS app_sessions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  token      TEXT        UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Disable RLS (Next.js server actions enforce auth boundaries)
ALTER TABLE app_users          DISABLE ROW LEVEL SECURITY;
ALTER TABLE app_sessions       DISABLE ROW LEVEL SECURITY;
ALTER TABLE budgets            DISABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories  DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses           DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items     DISABLE ROW LEVEL SECURITY;

-- 3. Remove FK constraints that reference auth.users
ALTER TABLE budgets         DROP CONSTRAINT IF EXISTS budgets_user_id_fkey;
ALTER TABLE wishlist_items  DROP CONSTRAINT IF EXISTS wishlist_items_user_id_fkey;
