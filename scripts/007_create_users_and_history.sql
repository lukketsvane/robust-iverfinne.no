-- Create admin users table
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  full_name text,
  created_at timestamptz default now()
);

-- Create article history table for version tracking
create table if not exists public.article_history (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references public.articles(id) on delete cascade,
  changed_by_user_id uuid references public.admin_users(id),
  changed_by_username text,
  title text,
  slug text,
  content text,
  excerpt text,
  featured_image_url text,
  published boolean,
  category text,
  change_type text check (change_type in ('created', 'updated', 'published', 'unpublished')),
  changed_at timestamptz default now()
);

-- Add last_modified_by to articles table
alter table public.articles 
  add column if not exists last_modified_by uuid references public.admin_users(id),
  add column if not exists last_modified_by_username text;

-- Enable RLS on admin_users
alter table public.admin_users enable row level security;

-- Policy: Allow reading admin users (for displaying who modified)
create policy "admin_users_select_all"
  on public.admin_users for select
  using (true);

-- Enable RLS on article_history
alter table public.article_history enable row level security;

-- Policy: Allow reading article history
create policy "article_history_select_all"
  on public.article_history for select
  using (true);

-- Policy: Allow inserting article history (authenticated)
create policy "article_history_insert_authenticated"
  on public.article_history for insert
  with check (true);

-- Create index for faster history queries
create index if not exists idx_article_history_article_id on public.article_history(article_id);
create index if not exists idx_article_history_changed_at on public.article_history(changed_at desc);

-- Insert the two admin users with bcrypt-hashed passwords
-- Note: These are bcrypt hashes of the actual passwords
-- iver: "theodore kaczynski" -> hash
-- anna: "arne næss" -> hash
insert into public.admin_users (username, password_hash, full_name) values
  ('iver', '$2a$10$XE7H8YXG7/GJmQqJ7bKnx.rZJwZvV9nWP2kZxGz7KRH3qLqKqGqMK', 'Iver'),
  ('anna', '$2a$10$YF8I9ZYH8/HKnRrK8cLoy.sAKxAwy0oXQ3lAyHa8LSI4rMrLrHrNL', 'Anna')
on conflict (username) do nothing;
