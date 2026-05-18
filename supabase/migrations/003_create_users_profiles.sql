-- Create Profiles Table (Linked to Supabase Auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  organization_id uuid references public.organizations on delete set null,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'analyst', 'viewer')),
  avatar_url text,
  preferences jsonb default '{"theme": "dark", "language": "en"}'::jsonb not null,
  last_seen_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger function to automatically create a profile for new auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Executive Analyst'),
    new.raw_user_meta_data->>'avatar_url',
    'viewer'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
