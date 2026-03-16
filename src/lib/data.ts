import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

export type DashboardData = {
  user: { id: string; email: string | null } | null;
  budgets: Array<{
    id: string;
    name: string;
    totalAmount: number;
    periodLabel: string | null;
    categories: Array<{
      id: string;
      name: string;
      allocatedAmount: number;
      spentAmount: number;
      color: string;
    }>;
  }>;
  expenses: Array<{
    id: string;
    title: string;
    amount: number;
    spentOn: string;
    note: string | null;
    categoryId: string;
    categoryName: string;
  }>;
  wishlistItems: Array<{
    id: string;
    title: string;
    note: string | null;
    expectedPrice: number | null;
    priority: "low" | "medium" | "high";
    imageUrl: string | null;
    productUrl: string | null;
    categoryId: string | null;
  }>;
};

async function ensureProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
    },
    { onConflict: "id" },
  );

  return user;
}

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const user = await ensureProfile();

  if (!user) {
    return { user: null, budgets: [], expenses: [], wishlistItems: [] };
  }

  const supabase = await createClient();

  const [{ data: budgets }, { data: expenses }, { data: wishlistItems }] = await Promise.all([
    supabase
      .from("budgets")
      .select("id, name, total_amount, period_label, budget_categories(id, name, allocated_amount, color, expenses(amount))")
      .order("created_at", { ascending: true }),
    supabase
      .from("expenses")
      .select("id, title, amount, spent_on, note, category_id, budget_categories(name)")
      .order("spent_on", { ascending: false })
      .limit(20),
    supabase
      .from("wishlist_items")
      .select("id, title, memo, expected_price, priority, image_url, product_url, category_id")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    user: { id: user.id, email: user.email ?? null },
    budgets:
      budgets?.map((budget) => ({
        id: budget.id,
        name: budget.name,
        totalAmount: Number(budget.total_amount),
        periodLabel: budget.period_label,
        categories:
          budget.budget_categories?.map((category) => ({
            id: category.id,
            name: category.name,
            allocatedAmount: Number(category.allocated_amount),
            spentAmount:
              category.expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) ?? 0,
            color: category.color ?? "#2563eb",
          })) ?? [],
      })) ?? [],
    expenses:
      expenses?.map((expense) => ({
        id: expense.id,
        title: expense.title,
        amount: Number(expense.amount),
        spentOn: expense.spent_on,
        note: expense.note,
        categoryId: expense.category_id,
        categoryName:
          Array.isArray(expense.budget_categories) && expense.budget_categories[0]
            ? expense.budget_categories[0].name
            : (expense.budget_categories as { name?: string } | null)?.name ?? "Uncategorized",
      })) ?? [],
    wishlistItems:
      wishlistItems?.map((item) => ({
        id: item.id,
        title: item.title,
        note: item.memo,
        expectedPrice: item.expected_price ? Number(item.expected_price) : null,
        priority: item.priority,
        imageUrl: item.image_url,
        productUrl: item.product_url,
        categoryId: item.category_id,
      })) ?? [],
  };
});
