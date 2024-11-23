-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create users table
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  avatar_url text,
  constraint email_format check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create videos table
create table if not exists public.videos (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  original_url text,
  original_file text,
  output_files jsonb default '[]'::jsonb not null,
  status text default 'pending' not null,
  error text,
  settings jsonb not null default '{
    "duration": 60,
    "enhance": false,
    "captions": false
  }'::jsonb,
  constraint status_values check (status in ('pending', 'processing', 'completed', 'failed')),
  constraint settings_format check (
    jsonb_typeof(settings) = 'object' and
    (settings->>'duration')::int > 0 and
    (settings->>'enhance')::boolean is not null and
    (settings->>'captions')::boolean is not null
  )
);

-- Create credits table
create table if not exists public.credits (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users(id) on delete cascade not null,
  amount integer not null,
  transaction_type text not null,
  description text,
  constraint transaction_type_values check (transaction_type in ('purchase', 'usage', 'bonus')),
  constraint positive_amount check (amount != 0)
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.users(id) on delete cascade not null,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  stripe_price_id text not null,
  status text not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  constraint status_values check (
    status in (
      'active',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'past_due',
      'trialing',
      'unpaid'
    )
  )
);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create updated_at triggers for all tables
create trigger handle_users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger handle_videos_updated_at
  before update on public.videos
  for each row execute procedure public.handle_updated_at();

create trigger handle_credits_updated_at
  before update on public.credits
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- Create RLS policies
alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.credits enable row level security;
alter table public.subscriptions enable row level security;

-- Users policies
create policy "Users can view their own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own data"
  on public.users for update
  using (auth.uid() = id);

-- Videos policies
create policy "Users can view their own videos"
  on public.videos for select
  using (auth.uid() = user_id);

create policy "Users can create their own videos"
  on public.videos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own videos"
  on public.videos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own videos"
  on public.videos for delete
  using (auth.uid() = user_id);

-- Credits policies
create policy "Users can view their own credits"
  on public.credits for select
  using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);