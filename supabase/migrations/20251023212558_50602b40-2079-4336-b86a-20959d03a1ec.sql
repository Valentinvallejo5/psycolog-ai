-- ============================================
-- psicolog.ia - Complete Database Schema
-- ============================================

-- 1. PROFILES TABLE
-- User profile metadata
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  language_preference text not null default 'es' check (language_preference in ('es', 'en')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

-- RLS: Users can only read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, language_preference)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'language_preference', 'es')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. USER ROLES TABLE
-- Roles enum
create type public.app_role as enum ('user', 'admin');

-- User roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null default 'user',
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Auto-assign 'user' role on signup
create or replace function public.assign_default_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  return new;
end;
$$;

create trigger on_user_role_assignment
  after insert on auth.users
  for each row execute procedure public.assign_default_role();

-- 3. SUBSCRIPTION PLANS TABLE
-- Subscription tiers
create type public.plan_type as enum ('free', 'monthly', 'annual');

create table public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  plan plan_type not null default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.subscription_plans enable row level security;

-- RLS: Users can view their own subscription
create policy "Users can view own subscription"
  on public.subscription_plans for select
  using (auth.uid() = user_id);

-- Auto-create free plan on signup
create or replace function public.create_default_subscription()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.subscription_plans (user_id, plan)
  values (new.id, 'free');
  return new;
end;
$$;

create trigger on_subscription_created
  after insert on auth.users
  for each row execute procedure public.create_default_subscription();

-- 4. CHAT MESSAGES TABLE
-- Chat history
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now()
);

create index idx_chat_messages_user_id on public.chat_messages(user_id);
create index idx_chat_messages_created_at on public.chat_messages(created_at);

alter table public.chat_messages enable row level security;

-- RLS: Users can only access their own messages
create policy "Users can view own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

-- 5. SLIDER PREFERENCES TABLE
-- Slider settings (saved only for paid users)
create table public.slider_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  tone integer not null default 50 check (tone >= 0 and tone <= 100),
  mood integer not null default 50 check (mood >= 0 and mood <= 100),
  interaction integer not null default 50 check (interaction >= 0 and interaction <= 100),
  updated_at timestamp with time zone default now()
);

alter table public.slider_preferences enable row level security;

-- RLS: Users can view/update their own preferences
create policy "Users can view own preferences"
  on public.slider_preferences for select
  using (auth.uid() = user_id);

create policy "Users can upsert own preferences"
  on public.slider_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.slider_preferences for update
  using (auth.uid() = user_id);

-- 6. CONVERSATION SUMMARIES TABLE
-- Long-term memory for paid users
create table public.conversation_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  summary_text text not null,
  topic_tags text[],
  mood_trajectory jsonb,
  key_facts text[],
  created_at timestamp with time zone default now()
);

create index idx_summaries_user_id on public.conversation_summaries(user_id);

alter table public.conversation_summaries enable row level security;

-- RLS: Users can view their own summaries
create policy "Users can view own summaries"
  on public.conversation_summaries for select
  using (auth.uid() = user_id);