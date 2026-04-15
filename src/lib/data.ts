import { cache } from "react";

import { getSession, type SessionUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// ── Shared types ──────────────────────────────────────────────────────────

export type UserInfo = { id: string; name: string; username: string };

export type BudgetCategory = {
  id: string;
  name: string;
  allocatedAmount: number;
  spentAmount: number;
  color: string;
  expenses: Array<{
    id: string;
    title: string;
    amount: number;
    spentOn: string;
    note: string | null;
  }>;
};

export type BudgetItem = {
  id: string;
  name: string;
  totalAmount: number;
  periodLabel: string | null;
  categories: BudgetCategory[];
};

export type ExpenseItem = {
  id: string;
  title: string;
  amount: number;
  spentOn: string;
  note: string | null;
  categoryId: string;
  categoryName: string;
  budgetName: string;
};

export type WishlistItem = {
  id: string;
  title: string;
  note: string | null;
  expectedPrice: number | null;
  priority: "low" | "medium" | "high";
  status: "considering" | "planned" | "purchased";
  imageUrl: string | null;
  productUrl: string | null;
  categoryId: string | null;
};

export type WishlistBudgetOption = {
  id: string;
  name: string;
  categories: Array<{ id: string; name: string }>;
};

// Keep backward compat for pages that still use the combined type
export type DashboardData = {
  user: UserInfo | null;
  budgets: BudgetItem[];
  expenses: ExpenseItem[];
  wishlistItems: WishlistItem[];
};

// ── Internal helpers ──────────────────────────────────────────────────────

type RawCategory = {
  id: string;
  name: string;
  allocated_amount: number;
  color: string;
  expenses?: { id: string; title: string; amount: number; spent_on: string; note: string | null }[];
};

function mapBudgets(raw: Array<{ id: string; name: string; total_amount: number; period_label: string | null; budget_categories?: RawCategory[] }> | null): BudgetItem[] {
  return (
    raw?.map((budget) => ({
      id: budget.id,
      name: budget.name,
      totalAmount: Number(budget.total_amount),
      periodLabel: budget.period_label,
      categories:
        budget.budget_categories?.map((c) => ({
          id: c.id,
          name: c.name,
          allocatedAmount: Number(c.allocated_amount),
          spentAmount: c.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) ?? 0,
          color: c.color ?? "#2563eb",
          expenses:
            c.expenses
              ?.map((e) => ({
                id: e.id,
                title: e.title,
                amount: Number(e.amount),
                spentOn: e.spent_on,
                note: e.note,
              }))
              .sort((a, b) => b.spentOn.localeCompare(a.spentOn)) ?? [],
        })) ?? [],
    })) ?? []
  );
}

type RawExpense = {
  id: string;
  title: string;
  amount: number;
  spent_on: string;
  note: string | null;
  category_id: string;
  budget_categories: { name?: string; budgets?: { name?: string } | { name?: string }[] | null } | { name?: string; budgets?: { name?: string } | { name?: string }[] | null }[] | null;
};

function extractName(field: { name?: string } | { name?: string }[] | null | undefined): string {
  if (Array.isArray(field)) return field[0]?.name ?? "미분류";
  return field?.name ?? "미분류";
}

function mapExpenses(raw: unknown[] | null): ExpenseItem[] {
  return (
    (raw as RawExpense[] | null)?.map((e) => {
      const cat = Array.isArray(e.budget_categories) ? e.budget_categories[0] : e.budget_categories;
      return {
        id: e.id,
        title: e.title,
        amount: Number(e.amount),
        spentOn: e.spent_on,
        note: e.note,
        categoryId: e.category_id,
        categoryName: cat?.name ?? "미분류",
        budgetName: extractName(cat?.budgets ?? null),
      };
    }) ?? []
  );
}

type RawWishlist = {
  id: string;
  title: string;
  memo: string | null;
  expected_price: number | null;
  priority: "low" | "medium" | "high";
  status: "considering" | "planned" | "purchased";
  image_url: string | null;
  product_url: string | null;
  category_id: string | null;
};

function mapWishlist(raw: unknown[] | null): WishlistItem[] {
  return (
    (raw as RawWishlist[] | null)?.map((item) => ({
      id: item.id,
      title: item.title,
      note: item.memo,
      expectedPrice: item.expected_price ? Number(item.expected_price) : null,
      priority: item.priority,
      status: item.status,
      imageUrl: item.image_url,
      productUrl: item.product_url,
      categoryId: item.category_id,
    })) ?? []
  );
}

// ── Cached session helper ─────────────────────────────────────────────────

export const getCurrentUser = cache(async (): Promise<UserInfo | null> => {
  const user = await getSession();
  if (!user) return null;
  return { id: user.id, name: user.name, username: user.username };
});

// ── Page-specific data fetchers ───────────────────────────────────────────

export const getBudgetsWithCategories = cache(async (user: SessionUser): Promise<BudgetItem[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("budgets")
    .select(
      "id, name, total_amount, period_label, budget_categories(id, name, allocated_amount, color, expenses(id, title, amount, spent_on, note))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });
  return mapBudgets(data);
});

export const getBudgetsForWishlist = cache(async (userId: string): Promise<WishlistBudgetOption[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("budgets")
    .select("id, name, budget_categories(id, name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (
    data?.map((budget) => ({
      id: budget.id,
      name: budget.name,
      categories:
        budget.budget_categories?.map((category) => ({
          id: category.id,
          name: category.name,
        })) ?? [],
    })) ?? []
  );
});

export const getRecentExpenses = cache(async (categoryIds: string[]): Promise<ExpenseItem[]> => {
  if (categoryIds.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("expenses")
    .select("id, title, amount, spent_on, note, category_id, budget_categories(name, budgets(name))")
    .in("category_id", categoryIds)
    .order("spent_on", { ascending: false })
    .limit(20);
  return mapExpenses(data);
});

export const getWishlistItems = cache(async (userId: string): Promise<WishlistItem[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishlist_items")
    .select("id, title, memo, expected_price, priority, status, image_url, product_url, category_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return mapWishlist(data);
});

// ── Combined fetcher (dashboard) ──────────────────────────────────────────

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const user = await getSession();
  if (!user) return { user: null, budgets: [], expenses: [], wishlistItems: [] };

  const budgets = await getBudgetsWithCategories(user);
  const categoryIds = budgets.flatMap((b) => b.categories.map((c) => c.id));

  const [expenses, wishlistItems] = await Promise.all([
    getRecentExpenses(categoryIds),
    getWishlistItems(user.id),
  ]);

  return {
    user: { id: user.id, name: user.name, username: user.username },
    budgets,
    expenses,
    wishlistItems,
  };
});
