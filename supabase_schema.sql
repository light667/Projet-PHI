-- Schéma Supabase/PostgreSQL minimal pour Phi.
-- À exécuter dans Supabase SQL Editor avant le premier déploiement.

create table if not exists public.user_credits (
  user_id text primary key,
  balance integer not null default 50 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.user_credits(user_id) on delete cascade,
  amount integer not null,
  description text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  title text not null,
  template text not null default 'template',
  content_json jsonb not null default '{}'::jsonb,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  visibility text not null default 'private' check (visibility in ('public', 'private')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Migrations idempotentes pour les bases déjà créées avant ce schéma.
alter table public.portfolios
  add column if not exists user_id text;

alter table public.portfolios
  add column if not exists title text;

alter table public.portfolios
  add column if not exists template text not null default 'template';

alter table public.portfolios
  add column if not exists content_json jsonb not null default '{}'::jsonb;

alter table public.portfolios
  add column if not exists slug text;

alter table public.portfolios
  add column if not exists visibility text not null default 'private';

alter table public.portfolios
  add column if not exists status text not null default 'draft';

alter table public.portfolios
  add column if not exists published_at timestamptz;

alter table public.portfolios
  add column if not exists updated_at timestamptz not null default now();

alter table public.portfolios
  add column if not exists created_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolios_visibility_check'
  ) then
    alter table public.portfolios
      add constraint portfolios_visibility_check
      check (visibility in ('public', 'private'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'portfolios_status_check'
  ) then
    alter table public.portfolios
      add constraint portfolios_status_check
      check (status in ('draft', 'published', 'archived'));
  end if;
end $$;

create index if not exists portfolios_user_id_idx on public.portfolios(user_id);
create index if not exists portfolios_public_slug_idx
  on public.portfolios(slug)
  where status = 'published' and visibility = 'public';

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

-- Le backend utilise la service role key; les politiques RLS ci-dessous protègent
-- surtout les accès directs éventuels depuis des clients Supabase.
alter table public.user_credits enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.portfolios enable row level security;
alter table public.chat_messages enable row level security;

create policy "Public portfolios are readable"
  on public.portfolios for select
  using (status = 'published' and visibility = 'public');
