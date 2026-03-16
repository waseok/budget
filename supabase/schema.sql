create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  period_label text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  budget_id uuid not null references public.budgets(id) on delete cascade,
  name text not null,
  allocated_amount numeric(12, 2) not null check (allocated_amount >= 0),
  color text default '#2563eb',
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.budget_categories(id) on delete cascade,
  title text not null,
  amount numeric(12, 2) not null check (amount > 0),
  spent_on date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.budget_categories(id) on delete set null,
  title text not null,
  product_url text,
  image_url text,
  expected_price numeric(12, 2) check (expected_price >= 0),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  status text not null default 'considering' check (status in ('considering', 'planned', 'purchased')),
  memo text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.budget_categories enable row level security;
alter table public.expenses enable row level security;
alter table public.wishlist_items enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id);

create policy "budgets_own_all"
on public.budgets for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "categories_own_all"
on public.budget_categories for all
using (
  exists (
    select 1
    from public.budgets b
    where b.id = budget_id and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.budgets b
    where b.id = budget_id and b.user_id = auth.uid()
  )
);

create policy "expenses_own_all"
on public.expenses for all
using (
  exists (
    select 1
    from public.budget_categories c
    join public.budgets b on b.id = c.budget_id
    where c.id = category_id and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.budget_categories c
    join public.budgets b on b.id = c.budget_id
    where c.id = category_id and b.user_id = auth.uid()
  )
);

create policy "wishlist_own_all"
on public.wishlist_items for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
