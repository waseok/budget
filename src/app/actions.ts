"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${key} 값이 필요합니다.`);
  }
  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function requiredNumber(formData: FormData, key: string) {
  const value = Number(requiredString(formData, key));
  if (Number.isNaN(value) || value < 0) {
    throw new Error(`${key} 값이 올바르지 않습니다.`);
  }
  return value;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createBudget(formData: FormData) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase.from("budgets").insert({
    user_id: user.id,
    name: requiredString(formData, "name"),
    total_amount: requiredNumber(formData, "total_amount"),
    period_label: optionalString(formData, "period_label"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/budgets");
}

export async function updateBudget(formData: FormData) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("budgets")
    .update({
      name: requiredString(formData, "name"),
      total_amount: requiredNumber(formData, "total_amount"),
      period_label: optionalString(formData, "period_label"),
    })
    .eq("id", requiredString(formData, "budget_id"))
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/budgets");
}

export async function deleteBudget(formData: FormData) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("budgets")
    .delete()
    .eq("id", requiredString(formData, "budget_id"))
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/budgets");
}

export async function createCategory(formData: FormData) {
  const { supabase } = await requireUser();

  const { error } = await supabase.from("budget_categories").insert({
    budget_id: requiredString(formData, "budget_id"),
    name: requiredString(formData, "name"),
    allocated_amount: requiredNumber(formData, "allocated_amount"),
    color: optionalString(formData, "color") ?? "#2563eb",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/budgets");
}

export async function createExpense(formData: FormData) {
  const { supabase } = await requireUser();

  const { error } = await supabase.from("expenses").insert({
    category_id: requiredString(formData, "category_id"),
    title: requiredString(formData, "title"),
    amount: requiredNumber(formData, "amount"),
    spent_on: requiredString(formData, "spent_on"),
    note: optionalString(formData, "note"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/expenses");
}

export async function updateExpense(formData: FormData) {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("expenses")
    .update({
      category_id: requiredString(formData, "category_id"),
      title: requiredString(formData, "title"),
      amount: requiredNumber(formData, "amount"),
      spent_on: requiredString(formData, "spent_on"),
      note: optionalString(formData, "note"),
    })
    .eq("id", requiredString(formData, "expense_id"));

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/expenses");
}

export async function deleteExpense(formData: FormData) {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", requiredString(formData, "expense_id"));

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/expenses");
}

export async function createWishlistItem(formData: FormData) {
  const { supabase, user } = await requireUser();
  const expectedPrice = optionalString(formData, "expected_price");

  const { error } = await supabase.from("wishlist_items").insert({
    user_id: user.id,
    category_id: optionalString(formData, "category_id"),
    title: requiredString(formData, "title"),
    product_url: optionalString(formData, "product_url"),
    image_url: optionalString(formData, "image_url"),
    expected_price: expectedPrice ? Number(expectedPrice) : null,
    priority: requiredString(formData, "priority"),
    memo: optionalString(formData, "memo"),
  });

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/wishlist");
}

export async function updateWishlistItem(formData: FormData) {
  const { supabase } = await requireUser();
  const expectedPrice = optionalString(formData, "expected_price");

  const { error } = await supabase
    .from("wishlist_items")
    .update({
      category_id: optionalString(formData, "category_id"),
      title: requiredString(formData, "title"),
      product_url: optionalString(formData, "product_url"),
      image_url: optionalString(formData, "image_url"),
      expected_price: expectedPrice ? Number(expectedPrice) : null,
      priority: requiredString(formData, "priority"),
      memo: optionalString(formData, "memo"),
    })
    .eq("id", requiredString(formData, "wishlist_id"));

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/wishlist");
}

export async function deleteWishlistItem(formData: FormData) {
  const { supabase } = await requireUser();

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("id", requiredString(formData, "wishlist_id"));

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/wishlist");
}
