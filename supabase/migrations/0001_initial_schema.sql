-- Enable necessary extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Users table (extends auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  credits integer default 100 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Videos table
create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  description text,
  original_url text,
  original_file text,
  duration integer not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')) not null,
  error text,
  settings jsonb default '{
    "enhance": false,
    "captions": false,
    "background_music": null
  }'::jsonb not null,
  output_files jsonb default '[]'::jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Credits transactions table
create table public.credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  amount integer not null,
  type text check (type in ('purchase', 'usage', 'bonus', 'refund')) not null,
  description text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  stripe_subscription_id text unique,
  stripe_customer_id text not null,
  stripe_price_id text not null,
  status text check (status in ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')) not null,
  current_period_start timestamp with time zone not null,
  current_period_end timestamp with time zone not null,
  cancel_at timestamp with time zone,
  canceled_at timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index videos_user_id_idx on public.videos (user_id);
create index videos_status_idx on public.videos (status);
create index credit_transactions_user_id_idx on public.credit_transactions (user_id);
create index credit_transactions_type_idx on public.credit_transactions (type);
create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_status_idx on public.subscriptions (status);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Create updated_at triggers
create trigger handle_users_updated_at
  before update on public.users
  for each row execute procedure public.handle_updated_at();

create trigger handle_videos_updated_at
  before update on public.videos
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.videos enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.subscriptions enable row level security;

-- Create RLS policies
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

-- Credit transactions policies
create policy "Users can view their own credit transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

-- Subscriptions policies
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Create function to update user credits
create or replace function public.update_user_credits()
returns trigger as $$
begin
  update public.users
  set credits = credits + new.amount
  where id = new.user_id;
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to update user credits on credit transaction
create trigger update_user_credits_after_transaction
  after insert on public.credit_transactions
  for each row execute procedure public.update_user_credits();