import { cache } from "react";

import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type DashboardData = {
  user: { id: string; name: string; username: string } | null;
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
      expenses: Array<{
        id: string;
        title: string;
        amount: number;
        spentOn: string;
        note: string | null;
      }>;
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

export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const user = await getSession();

  if (!user) {
    return { user: null, budgets: [], expenses: [], wishlistItems: [] };
  }

  const supabase = await createClient();

  const { data: budgets } = await supabase
    .from("budgets")
    .select(
      "id, name, total_amount, period_label, budget_categories(id, name, allocated_amount, color, expenses(id, title, amount, spent_on, note))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  // Collect category IDs so we can filter expenses by ownership
  const categoryIds =
    budgets?.flatMap((b) => (b.budget_categories ?? []).map((c: { id: string }) => c.id)) ?? [];

  const [{ data: expenses }, { data: wishlistItems }] = await Promise.all([
    categoryIds.length > 0
      ? supabase
          .from("expenses")
          .select("id, title, amount, spent_on, note, category_id, budget_categories(name)")
          .in("category_id", categoryIds)
          .order("spent_on", { ascending: false })
          .limit(20)
      : Promise.resolve({ data: [] as unknown[] }),
    supabase
      .from("wishlist_items")
      .select("id, title, memo, expected_price, priority, image_url, product_url, category_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  return {
    user: { id: user.id, name: user.name, username: user.username },
    budgets:
      budgets?.map((budget) => ({
        id: budget.id,
        name: budget.name,
        totalAmount: Number(budget.total_amount),
        periodLabel: budget.period_label,
        categories:
          budget.budget_categories?.map((category: { id: string; name: string; allocated_amount: number; color: string; expenses?: { id: string; title: string; amount: number; spent_on: string; note: string | null }[] }) => ({
            id: category.id,
            name: category.name,
            allocatedAmount: Number(category.allocated_amount),
            spentAmount:
              category.expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) ?? 0,
            color: category.color ?? "#2563eb",
            expenses:
              category.expenses
                ?.map((e) => ({
                  id: e.id,
                  title: e.title,
                  amount: Number(e.amount),
                  spentOn: e.spent_on,
                  note: e.note,
                }))
                .sort((a, b) => b.spentOn.localeCompare(a.spentOn)) ?? [],
          })) ?? [],
      })) ?? [],
    expenses:
      (expenses as Array<{ id: string; title: string; amount: number; spent_on: string; note: string | null; category_id: string; budget_categories: { name?: string } | { name?: string }[] | null }>)?.map((expense) => ({
        id: expense.id,
        title: expense.title,
        amount: Number(expense.amount),
        spentOn: expense.spent_on,
        note: expense.note,
        categoryId: expense.category_id,
        categoryName:
          Array.isArray(expense.budget_categories) && expense.budget_categories[0]
            ? expense.budget_categories[0].name ?? "Uncategorized"
            : (expense.budget_categories as { name?: string } | null)?.name ?? "Uncategorized",
      })) ?? [],
    wishlistItems:
      (wishlistItems as Array<{ id: string; title: string; memo: string | null; expected_price: number | null; priority: "low" | "medium" | "high"; image_url: string | null; product_url: string | null; category_id: string | null }>)?.map((item) => ({
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
