-- Supabase SQL - Supabase Dashboard > SQL Editor me paste karo
create table if not exists profiles (
  id uuid primary key references auth.users(id),
  name text,
  created_at timestamptz default now()
);

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  type text check (type in ('income','expense')),
  amount numeric not null,
  category text,
  note text,
  date date default current_date,
  created_at timestamptz default now()
);

create table if not exists budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  month text,
  amount numeric
);

alter table transactions enable row level security;
create policy "users own tx" on transactions
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Future: AI chat history
create table if not exists ai_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  role text,
  content text,
  created_at timestamptz default now()
);

alter table ai_chats enable row level security;
create policy "users own chats" on ai_chats
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
