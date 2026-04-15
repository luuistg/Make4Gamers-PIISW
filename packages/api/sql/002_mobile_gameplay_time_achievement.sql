create table if not exists public.user_gameplay_stats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_key text not null,
  game_title text,
  played_seconds integer not null default 0 check (played_seconds >= 0),
  last_played_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  constraint user_gameplay_stats_user_id_game_key_key unique (user_id, game_key)
);

create index if not exists idx_user_gameplay_stats_user_id
  on public.user_gameplay_stats (user_id);

create index if not exists idx_user_gameplay_stats_game_key
  on public.user_gameplay_stats (game_key);

alter table public.user_gameplay_stats enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_gameplay_stats'
      and policyname = 'Users can read their own gameplay stats'
  ) then
    create policy "Users can read their own gameplay stats"
      on public.user_gameplay_stats
      for select
      to authenticated
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_gameplay_stats'
      and policyname = 'Users can insert their own gameplay stats'
  ) then
    create policy "Users can insert their own gameplay stats"
      on public.user_gameplay_stats
      for insert
      to authenticated
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_gameplay_stats'
      and policyname = 'Users can update their own gameplay stats'
  ) then
    create policy "Users can update their own gameplay stats"
      on public.user_gameplay_stats
      for update
      to authenticated
      using (auth.uid() = user_id)
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
  'mobile_one_hour_single_game',
  'Maraton de una hora',
  'Acumula una hora de juego en un unico juego desde la app movil.',
  'mobile',
  'clock-3',
  true
)
on conflict (code) do update
set
  title = excluded.title,
  description = excluded.description,
  platform_scope = excluded.platform_scope,
  badge_icon = excluded.badge_icon,
  is_active = excluded.is_active;
