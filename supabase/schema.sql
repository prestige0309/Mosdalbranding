-- ════════════════════════════════════════════════════════════════════════
-- Mosdal Branding Solution — Supabase schema
-- ════════════════════════════════════════════════════════════════════════
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste all of this → Run).
--
-- What this sets up:
--   1. Four tables: portfolio_items, testimonials, quote_requests, orders
--   2. Row Level Security so:
--        - anyone (site visitors) can submit a quote, an order, or a
--          testimonial, and can read the public portfolio + approved
--          testimonials
--        - only a signed-in admin (via Supabase Auth) can read quotes/
--          orders, approve/reject testimonials, and add/edit/delete
--          portfolio items
--   3. A public storage bucket for portfolio images, writable only by
--      the signed-in admin.
--   4. Seed data so the site isn't empty on first load.
-- ════════════════════════════════════════════════════════════════════════

-- ─── Extensions ────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Tables ────────────────────────────────────────────────────────────

create table if not exists public.portfolio_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null check (category in ('branding','print','merchandise','signage','apparel')),
  description text not null default '',
  image_url   text not null,
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  company     text not null default '',
  rating      int not null check (rating between 1 and 5),
  message     text not null,
  avatar_url  text,
  approved    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null,
  service     text not null,
  details     text not null default '',
  budget      text not null default '',
  deadline    text not null default '',
  status      text not null default 'new' check (status in ('new','reviewed','quoted')),
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  email             text not null,
  phone             text not null,
  service           text not null,
  quantity          int not null default 1,
  specifications    text not null default '',
  delivery_address  text not null default '',
  total             text not null default 'TBD — Subject to quotation',
  status            text not null default 'pending' check (status in ('pending','in_progress','completed','cancelled')),
  created_at        timestamptz not null default now()
);

-- ─── Row Level Security ────────────────────────────────────────────────

alter table public.portfolio_items enable row level security;
alter table public.testimonials    enable row level security;
alter table public.quote_requests  enable row level security;
alter table public.orders          enable row level security;

-- Portfolio: public can read everything; only a signed-in admin can write.
drop policy if exists "portfolio_public_read" on public.portfolio_items;
create policy "portfolio_public_read" on public.portfolio_items
  for select using (true);

drop policy if exists "portfolio_admin_write" on public.portfolio_items;
create policy "portfolio_admin_write" on public.portfolio_items
  for insert to authenticated with check (true);

drop policy if exists "portfolio_admin_update" on public.portfolio_items;
create policy "portfolio_admin_update" on public.portfolio_items
  for update to authenticated using (true) with check (true);

drop policy if exists "portfolio_admin_delete" on public.portfolio_items;
create policy "portfolio_admin_delete" on public.portfolio_items
  for delete to authenticated using (true);

-- Testimonials: public can read only approved reviews, and can submit new
-- ones (always unapproved). Only the admin can see pending ones, approve,
-- or delete.
drop policy if exists "testimonials_public_read_approved" on public.testimonials;
create policy "testimonials_public_read_approved" on public.testimonials
  for select to anon using (approved = true);

drop policy if exists "testimonials_admin_read_all" on public.testimonials;
create policy "testimonials_admin_read_all" on public.testimonials
  for select to authenticated using (true);

drop policy if exists "testimonials_public_submit" on public.testimonials;
create policy "testimonials_public_submit" on public.testimonials
  for insert to anon, authenticated with check (approved = false);

drop policy if exists "testimonials_admin_update" on public.testimonials;
create policy "testimonials_admin_update" on public.testimonials
  for update to authenticated using (true) with check (true);

drop policy if exists "testimonials_admin_delete" on public.testimonials;
create policy "testimonials_admin_delete" on public.testimonials
  for delete to authenticated using (true);

-- Quote requests: anyone can submit one; only the admin can read/update them.
drop policy if exists "quotes_public_submit" on public.quote_requests;
create policy "quotes_public_submit" on public.quote_requests
  for insert to anon, authenticated with check (status = 'new');

drop policy if exists "quotes_admin_read" on public.quote_requests;
create policy "quotes_admin_read" on public.quote_requests
  for select to authenticated using (true);

drop policy if exists "quotes_admin_update" on public.quote_requests;
create policy "quotes_admin_update" on public.quote_requests
  for update to authenticated using (true) with check (true);

-- Orders: anyone can submit one; only the admin can read/update them.
drop policy if exists "orders_public_submit" on public.orders;
create policy "orders_public_submit" on public.orders
  for insert to anon, authenticated with check (status = 'pending');

drop policy if exists "orders_admin_read" on public.orders;
create policy "orders_admin_read" on public.orders
  for select to authenticated using (true);

drop policy if exists "orders_admin_update" on public.orders;
create policy "orders_admin_update" on public.orders
  for update to authenticated using (true) with check (true);

-- ─── Storage bucket for portfolio images ───────────────────────────────

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "portfolio_images_public_read" on storage.objects;
create policy "portfolio_images_public_read" on storage.objects
  for select using (bucket_id = 'portfolio-images');

drop policy if exists "portfolio_images_admin_write" on storage.objects;
create policy "portfolio_images_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio-images');

drop policy if exists "portfolio_images_admin_update" on storage.objects;
create policy "portfolio_images_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio-images');

drop policy if exists "portfolio_images_admin_delete" on storage.objects;
create policy "portfolio_images_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio-images');

-- ─── Seed data (safe to skip/delete if you want to start empty) ───────

insert into public.portfolio_items (title, category, description, image_url, featured, created_at) values
('TechHub Lagos Brand Identity', 'branding', 'Complete brand identity including logo, color system, and brand guidelines for a tech co-working space.', 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80', true, '2026-08-01'),
('FoodCo Premium Packaging', 'print', 'Custom packaging design and production for a premium food brand''s product line.', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80', true, '2026-07-20'),
('Apex Fitness Apparel Line', 'apparel', 'Screen-printed gym wear collection for a fitness brand — 500+ units delivered.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', true, '2026-07-15'),
('Summit Conference Signage', 'signage', 'Full event signage suite including rollups, backdrop banners, and directional signs.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', false, '2026-07-10'),
('GreenLeaf Branded Merch', 'merchandise', 'Corporate gift set with branded mugs, notebooks, and tote bags for an eco-friendly brand.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80', false, '2026-07-05'),
('Nova Realty Business Cards', 'print', 'Luxury matte business cards with gold foil accent for a premium real estate company.', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', false, '2026-06-28'),
('Kalahari Restaurant Branding', 'branding', 'Full restaurant branding — logo, menu design, signage, and branded packaging.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', true, '2026-06-20'),
('CityRun Marathon Shirts', 'apparel', '2,000 custom printed finisher T-shirts for the annual city marathon event.', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80', false, '2026-06-10'),
('Metro Mall Wayfinding', 'signage', 'Complete wayfinding and directional signage system for a large retail mall.', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80', false, '2026-06-01'),
('Your Branding Project', 'branding', 'Add a short description of this project here.', '/portfolio/branding-1.svg', false, '2026-08-10'),
('Your Branding Project', 'branding', 'Add a short description of this project here.', '/portfolio/branding-2.svg', false, '2026-08-10'),
('Your Print Project', 'print', 'Add a short description of this project here.', '/portfolio/print-1.svg', false, '2026-08-10'),
('Your Print Project', 'print', 'Add a short description of this project here.', '/portfolio/print-2.svg', false, '2026-08-10'),
('Your Apparel Project', 'apparel', 'Add a short description of this project here.', '/portfolio/apparel-1.svg', false, '2026-08-10'),
('Your Apparel Project', 'apparel', 'Add a short description of this project here.', '/portfolio/apparel-2.svg', false, '2026-08-10'),
('Your Signage Project', 'signage', 'Add a short description of this project here.', '/portfolio/signage-1.svg', false, '2026-08-10'),
('Your Signage Project', 'signage', 'Add a short description of this project here.', '/portfolio/signage-2.svg', false, '2026-08-10'),
('Your Merchandise Project', 'merchandise', 'Add a short description of this project here.', '/portfolio/merchandise-1.svg', false, '2026-08-10'),
('Your Merchandise Project', 'merchandise', 'Add a short description of this project here.', '/portfolio/merchandise-2.svg', false, '2026-08-10')
on conflict do nothing;

insert into public.testimonials (name, company, rating, message, avatar_url, approved, created_at) values
('Adaeze Okonkwo', 'TechHub Lagos', 5, 'Mosdal Branding Solution completely transformed our brand identity. The quality of their work is unmatched — every detail was executed perfectly. Our clients constantly ask about our branded materials!', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&q=80', true, '2026-08-05'),
('Emeka Obi', 'Apex Fitness', 5, 'Fast turnaround, incredible quality, and the team genuinely cares about getting your brand right. We''ve ordered apparel three times and it gets better each time.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80', true, '2026-07-22'),
('Fatima Al-Hassan', 'GreenLeaf Organics', 5, 'The branded merchandise set they created for our corporate event was stunning. Guests were genuinely impressed. Will definitely use Mosdal Branding Solution for all future projects.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80', true, '2026-07-10'),
('Chukwudi Nwachukwu', 'Nova Realty', 4, 'Our business cards look absolutely premium. The gold foil finish was exactly what I envisioned. Professional service from start to finish.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80', true, '2026-07-01'),
('Ngozi Eze', 'Kalahari Restaurant', 5, 'From our logo to menus to signage — Mosdal Branding Solution handled everything beautifully. Our restaurant brand looks cohesive and professional. Highly recommend!', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', true, '2026-06-25'),
('Tunde Adesanya', 'CityRun Events', 5, '2,000 shirts printed and delivered on time, with zero defects. The quality was excellent and our marathon participants loved them. Mosdal Branding Solution is our go-to for events.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80', true, '2026-06-15')
on conflict do nothing;
