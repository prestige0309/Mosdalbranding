import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Loud console warning instead of a silent failure — every DB call below
  // will fail until these are set.
  // eslint-disable-next-line no-console
  console.error(
    "Missing Supabase config. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file at the project root (see .env.example)."
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    // Supabase's SDK persists the auth session itself (this is standard for
    // any browser app — it's how the site "remembers" the admin is logged
    // in). The important change is that there's no more custom
    // localStorage.setItem("mosdal_admin", "true") flag: the real session
    // is a signed token issued by Supabase Auth, and every read/write to
    // the database is checked against it server-side via Row Level
    // Security — not trusted from the client.
    persistSession: true,
    autoRefreshToken: true,
  },
});

// The single admin account's email. The admin only ever types the
// password; this constant just tells Supabase Auth which account to sign
// into. Create this user once in Supabase Dashboard → Authentication →
// Users → Add user (see README).
export const ADMIN_EMAIL =
  (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) || "admin@mosdal.com";
