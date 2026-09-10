import type { PortfolioItem, Testimonial, QuoteRequest, Order } from "@/types";
import { supabase, ADMIN_EMAIL } from "@/lib/supabaseClient";

// ════════════════════════════════════════════════════════════════════════
// This file used to read/write everything to localStorage. Every function
// below now talks to Supabase (Postgres + Auth + Storage) instead, so data
// is shared across devices/browsers and survives clearing site data.
// See supabase/schema.sql for the tables + security rules this relies on.
// ════════════════════════════════════════════════════════════════════════

// ─── Types ─────────────────────────────────────────────────────────────

export type NewPortfolioItem = Omit<PortfolioItem, "id" | "createdAt">;
export type NewTestimonial = Omit<Testimonial, "id" | "createdAt" | "approved">;
export type NewQuoteRequest = Omit<QuoteRequest, "id" | "createdAt" | "status">;
export type NewOrder = Omit<Order, "id" | "createdAt" | "status" | "total">;

// ─── Utilities ─────────────────────────────────────────────────────────

function throwIfError(error: { message: string } | null): asserts error is null {
  if (error) throw new Error(error.message);
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

function validateFile(file: File, maxSizeMB: number = 5): void {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('File must be a JPEG, PNG, WebP, or GIF image');
  }
}

// ─── Mappers: DB (snake_case) ⇆ App types (camelCase) ─────────────────

const mapPortfolio = (row: any): PortfolioItem => ({
  id: row.id,
  title: row.title,
  category: row.category,
  description: row.description,
  imageUrl: row.image_url,
  featured: row.featured ?? false,
  createdAt: row.created_at,
});

const mapTestimonial = (row: any): Testimonial => ({
  id: row.id,
  name: row.name,
  company: row.company,
  rating: row.rating,
  message: row.message,
  avatarUrl: row.avatar_url ?? undefined,
  approved: row.approved ?? false,
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
  status: row.status ?? 'new',
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
  total: row.total ?? 0,
  status: row.status ?? 'pending',
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

export async function addPortfolioItem(item: NewPortfolioItem): Promise<PortfolioItem> {
  const { data, error } = await supabase
    .from("portfolio_items")
    .insert({
      title: item.title.trim(),
      category: item.category,
      description: item.description.trim(),
      image_url: item.imageUrl,
      featured: item.featured ?? false,
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
      title: item.title.trim(),
      category: item.category,
      description: item.description.trim(),
      image_url: item.imageUrl,
      featured: item.featured ?? false,
    })
    .eq("id", id)
    .select()
    .single();

  throwIfError(error);
  return mapPortfolio(data);
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  throwIfError(error);

  if (item?.image_url) {
    try {
      const path = item.image_url.split('/').pop();
      if (path) {
        await supabase.storage.from("portfolio-images").remove([path]);
      }
    } catch {
      // Ignore storage deletion errors
    }
  }
}

export async function uploadPortfolioImage(file: File): Promise<string> {
  validateFile(file, 5);

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(path, file, { 
      upsert: false,
      cacheControl: '3600',
    });

  throwIfError(uploadError);

  const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
  return data.publicUrl;
}

// ─── Testimonials ──────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  throwIfError(error);
  return (data ?? []).map(mapTestimonial);
}

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  throwIfError(error);
  return (data ?? []).map(mapTestimonial);
}

export async function addTestimonial(t: NewTestimonial): Promise<Testimonial> {
  const { data, error } = await supabase
    .from("testimonials")
    .insert({
      name: t.name.trim(),
      company: t.company.trim(),
      rating: t.rating,
      message: t.message.trim(),
      avatar_url: t.avatarUrl ?? null,
      approved: false,
    })
    .select()
    .single();

  throwIfError(error);
  return mapTestimonial(data);
}

export async function updateTestimonialApproval(
  id: string,
  approved: boolean
): Promise<void> {
  const { error } = await supabase
    .from("testimonials")
    .update({ approved })
    .eq("id", id);

  throwIfError(error);
}

export async function deleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  throwIfError(error);
}

// ─── Quote Requests ─────────────────────────────────────────────────────

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  const { data, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  throwIfError(error);
  return (data ?? []).map(mapQuote);
}

export async function addQuoteRequest(q: NewQuoteRequest): Promise<QuoteRequest> {
  const { data, error } = await supabase
    .from("quote_requests")
    .insert({
      name: q.name.trim(),
      email: q.email.trim().toLowerCase(),
      phone: q.phone.trim(),
      service: q.service,
      details: q.details.trim(),
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
  const { error } = await supabase
    .from("quote_requests")
    .update({ status })
    .eq("id", id);

  throwIfError(error);
}

export async function deleteQuoteRequest(id: string): Promise<void> {
  const { error } = await supabase.from("quote_requests").delete().eq("id", id);
  throwIfError(error);
}

// ─── Orders ──────────────────────────────────────────────────────────────

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  throwIfError(error);
  return (data ?? []).map(mapOrder);
}

export async function addOrder(o: NewOrder): Promise<Order> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      name: o.name.trim(),
      email: o.email.trim().toLowerCase(),
      phone: o.phone.trim(),
      service: o.service,
      quantity: o.quantity,
      specifications: o.specifications,
      delivery_address: o.deliveryAddress.trim(),
      status: "pending",
    })
    .select()
    .single();

  throwIfError(error);
  return mapOrder(data);
}

export async function updateOrderStatus(id: string, status: Order["status"]): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  throwIfError(error);
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  throwIfError(error);
}

// ─── Admin Auth ──────────────────────────────────────────────────────

export async function adminLogin(password: string): Promise<{ ok: boolean; error?: string }> {
  if (!ADMIN_EMAIL) {
    return { ok: false, error: "Admin email not configured" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminLogout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function isAdminLoggedIn(): Promise<boolean> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return false;
  return !!data.session;
}

export function onAdminAuthStateChange(callback: (loggedIn: boolean) => void): () => void {
  isAdminLoggedIn().then(callback).catch(() => callback(false));

  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(!!session);
  });

  return () => sub.subscription.unsubscribe();
}

// ─── Export all functions for easier imports ──────────────────────────

export default {
  // Portfolio
  getPortfolioItems,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  uploadPortfolioImage,
  
  // Testimonials
  getTestimonials,
  getApprovedTestimonials,
  addTestimonial,
  updateTestimonialApproval,
  deleteTestimonial,
  
  // Quote Requests
  getQuoteRequests,
  addQuoteRequest,
  updateQuoteStatus,
  deleteQuoteRequest,
  
  // Orders
  getOrders,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  
  // Auth
  adminLogin,
  adminLogout,
  isAdminLoggedIn,
  onAdminAuthStateChange,
};
