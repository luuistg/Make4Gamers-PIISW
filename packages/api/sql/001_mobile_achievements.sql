create extension if not exists pgcrypto;

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  platform_scope text not null default 'all' check (platform_scope in ('all', 'web', 'mobile')),
  badge_icon text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default timezone('utc', now()),
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  constraint user_achievements_user_id_achievement_id_key unique (user_id, achievement_id)
);

create index if not exists idx_achievements_platform_scope
  on public.achievements (platform_scope);

create index if not exists idx_user_achievements_user_id
  on public.user_achievements (user_id);

create index if not exists idx_user_achievements_achievement_id
  on public.user_achievements (achievement_id);

alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'achievements'
      and policyname = 'Authenticated users can read active achievements'
  ) then
    create policy "Authenticated users can read active achievements"
      on public.achievements
      for select
      to authenticated
      using (is_active = true);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_achievements'
      and policyname = 'Users can read their own achievements'
  ) then
    create policy "Users can read their own achievements"
      on public.user_achievements
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_achievements'
      and policyname = 'Users can insert their own achievements'
  ) then
    create policy "Users can insert their own achievements"
      on public.user_achievements
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;
end $$;

insert into public.achievements (
  code,
  title,
  description,
  platform_scope,
  badge_icon,
  is_active
)
values (
  'mobile_first_game_launch',
  'Primer juego en movil',
  'Abre tu primer juego desde la app movil de la plataforma.',
  'mobile',
  'gamepad-2',
  true
)
on conflict (code) do update
set
  title = excluded.title,
  description = excluded.description,
  platform_scope = excluded.platform_scope,
  badge_icon = excluded.badge_icon,
  is_active = excluded.is_active;
