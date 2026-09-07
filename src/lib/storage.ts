import type { PortfolioItem, Testimonial, QuoteRequest, Order } from "@/types";
import { supabase, ADMIN_EMAIL } from "@/lib/supabaseClient";

// ════════════════════════════════════════════════════════════════════════
// This file used to read/write everything to localStorage. Every function
// below now talks to Supabase (Postgres + Auth + Storage) instead, so data
// is shared across devices/browsers and survives clearing site data.
// See supabase/schema.sql for the tables + security rules this relies on.
// ════════════════════════════════════════════════════════════════════════

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

// ─── Mappers: DB (snake_case) ⇆ App types (camelCase) ─────────────────

const mapPortfolio = (row: any): PortfolioItem => ({
  id: row.id,
  title: row.title,
  category: row.category,
  description: row.description,
  imageUrl: row.image_url,
  featured: row.featured,
  createdAt: row.created_at,
});

const mapTestimonial = (row: any): Testimonial => ({
  id: row.id,
  name: row.name,
  company: row.company,
  rating: row.rating,
  message: row.message,
  avatarUrl: row.avatar_url ?? undefined,
  approved: row.approved,
  createdAt: row.created_at,
});

const mapQuote = (row: any): QuoteRequest => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  service: row.service,
  details: row.details,
  budget: row.budget,
  deadline: row.deadline,
  status: row.status,
  createdAt: row.created_at,
});

const mapOrder = (row: any): Order => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  service: row.service,
  quantity: row.quantity,
  specifications: row.specifications,
  deliveryAddress: row.delivery_address,
  total: row.total,
  status: row.status,
  createdAt: row.created_at,
});

// ─── Portfolio ─────────────────────────────────────────────────────────

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapPortfolio);
}

export type NewPortfolioItem = Omit<PortfolioItem, "id" | "createdAt">;

export async function addPortfolioItem(item: NewPortfolioItem): Promise<PortfolioItem> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      title: item.title,
      category: item.category,
      description: item.description,
      image_url: item.imageUrl,
      featured: item.featured,
    })
    .select()
    .single();
  throwIfError(error);
  return mapPortfolio(data);
}

export async function updatePortfolioItem(
  id: string,
  item: NewPortfolioItem
): Promise<PortfolioItem> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .update({
      title: item.title,
      category: item.category,
      description: item.description,
      image_url: item.imageUrl,
      featured: item.featured,
    })
    .eq("id", id)
    .select()
    .single();
  throwIfError(error);
  return mapPortfolio(data);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  throwIfError(error);
}

/**
 * Uploads an image file to the "portfolio-images" Supabase Storage bucket
 * and returns its public URL. Replaces the old base64-into-localStorage
 * approach, so there's no 2MB size ceiling and images are shared, not
 * stuck in one browser.
 */
export async function uploadPortfolioImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(path, file, { upsert: false });
  throwIfError(uploadError);

  const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
  return data.publicUrl;
}

// ─── Testimonials ──────────────────────────────────────────────────────

/** Admin-only: every testimonial, pending or approved. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapTestimonial);
}

/** Public: only approved testimonials, for the Testimonials page. */
export async function addTestimonial(t: NewTestimonial): Promise<Testimonial> {
  const { error } = await supabase.from("testimonials").insert({
    name: t.name,
    company: t.company,
    rating: t.rating,
    message: t.message,
    avatar_url: t.avatarUrl ?? null,
    approved: false,
  });
  throwIfError(error);
  return {
    id: crypto.randomUUID(),
    name: t.name,
    company: t.company,
    rating: t.rating,
    message: t.message,
    avatarUrl: t.avatarUrl,
    approved: false,
    createdAt: new Date().toISOString(),
  };
}

// ─── Quote Requests ─────────────────────────────────────────────────────

/** Admin-only. */
export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapQuote);
}

export type NewQuoteRequest = Omit<QuoteRequest, "id" | "createdAt" | "status">;

export async function addQuoteRequest(q: NewQuoteRequest): Promise<QuoteRequest> {
  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      name: q.name,
      email: q.email,
      phone: q.phone,
      service: q.service,
      details: q.details,
      budget: q.budget,
      deadline: q.deadline,
      status: "new",
    })
    .select()
    .single();
  throwIfError(error);
  return mapQuote(data);
}

export async function updateQuoteStatus(
  id: string,
  status: QuoteRequest["status"]
): Promise<void> {
  const { error } = await supabase.from("quote_requests").update({ status }).eq("id", id);
  throwIfError(error);
}

// ─── Orders ──────────────────────────────────────────────────────────────

/** Admin-only. */
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  throwIfError(error);
  return (data ?? []).map(mapOrder);
}

export type NewOrder = Omit<Order, "id" | "createdAt" | "status" | "total">;

export async function addOrder(o: NewOrder): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      name: o.name,
      email: o.email,
      phone: o.phone,
      service: o.service,
      quantity: o.quantity,
      specifications: o.specifications,
      delivery_address: o.deliveryAddress,
      status: "pending",
    })
    .select()
    .single();
  throwIfError(error);
  return mapOrder(data);
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  throwIfError(error);
}

// ─── Admin Auth (real Supabase Auth session, not a localStorage flag) ──

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  await supabase.auth.signOut();
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

/** Fires immediately with the current state, then on every change. */
export function onAdminAuthStateChange(callback: (loggedIn: boolean) => void): () => void {
  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });
  return () => sub.subscription.unsubscribe();
}
