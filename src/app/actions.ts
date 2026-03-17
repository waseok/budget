"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSession, deleteSession, getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// ── Helpers ───────────────────────────────────────────────────────────────

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string" || !value.trim()) throw new Error(`${key} 값이 필요합니다.`);
  return value.trim();
}

function optionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function requiredNumber(formData: FormData, key: string) {
  const value = Number(requiredString(formData, key));
  if (Number.isNaN(value) || value < 0) throw new Error(`${key} 값이 올바르지 않습니다.`);
  return value;
}

async function requireUser() {
  const user = await getSession();
  if (!user) redirect("/login");
  return { supabase: await createClient(), user: user! };
}

// ── Auth ──────────────────────────────────────────────────────────────────

export async function signIn(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const username = requiredString(formData, "username");
  const password = requiredString(formData, "password");

  const supabase = await createClient();
  const { data: user } = await supabase
    .from("app_users")
    .select("id, password_hash")
    .eq("username", username)
    .single();

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const username = requiredString(formData, "username");
  const name = requiredString(formData, "name");
  const password = requiredString(formData, "password");
  const confirmPassword = requiredString(formData, "confirm_password");
  const securityQuestion = requiredString(formData, "security_question");
  const securityAnswer = requiredString(formData, "security_answer");

  if (password !== confirmPassword) return { error: "비밀번호가 일치하지 않습니다." };
  if (password.length < 6) return { error: "비밀번호는 6자 이상이어야 합니다." };
  if (username.length < 2) return { error: "아이디는 2자 이상이어야 합니다." };

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("app_users")
    .select("id")
    .eq("username", username)
    .single();

  if (existing) return { error: "이미 사용 중인 아이디입니다." };

  const { data: user, error: insertError } = await supabase
    .from("app_users")
    .insert({
      username,
      name,
      password_hash: hashPassword(password),
      security_question: securityQuestion,
      security_answer_hash: hashPassword(securityAnswer.toLowerCase().trim()),
    })
    .select("id")
    .single();

  if (insertError || !user) return { error: insertError?.message ?? "회원가입에 실패했습니다." };

  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect("/");
}

export async function signOut() {
  await deleteSession();
  redirect("/login");
}

export async function getSecurityQuestion(
  _prevState: { error: string; question?: string; username?: string } | null,
  formData: FormData,
): Promise<{ error: string; question?: string; username?: string }> {
  const username = requiredString(formData, "username");

  const supabase = await createClient();
  const { data: user } = await supabase
    .from("app_users")
    .select("security_question")
    .eq("username", username)
    .single();

  if (!user) return { error: "존재하지 않는 아이디입니다." };
  return { error: "", question: user.security_question, username };
}

export async function resetPassword(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const username = requiredString(formData, "username");
  const answer = requiredString(formData, "security_answer");
  const newPassword = requiredString(formData, "new_password");
  const confirmPassword = requiredString(formData, "confirm_password");

  if (newPassword !== confirmPassword) return { error: "비밀번호가 일치하지 않습니다." };
  if (newPassword.length < 6) return { error: "비밀번호는 6자 이상이어야 합니다." };

  const supabase = await createClient();
  const { data: user } = await supabase
    .from("app_users")
    .select("id, security_answer_hash")
    .eq("username", username)
    .single();

  if (!user || !verifyPassword(answer.toLowerCase().trim(), user.security_answer_hash)) {
    return { error: "비밀 답변이 올바르지 않습니다." };
  }

  const { error: updateError } = await supabase
    .from("app_users")
    .update({ password_hash: hashPassword(newPassword) })
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };

  await createSession(user.id);
  revalidatePath("/", "layout");
  redirect("/");
}

// ── Budget ────────────────────────────────────────────────────────────────

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
