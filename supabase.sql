-- Core schema for FirstWedApp (run in Supabase SQL editor)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  created_at timestamptz default now()
);

create table if not exists weddings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  venue text,
  timezone text default 'UTC',
  created_at timestamptz default now()
);

create table if not exists wedding_members (
  wedding_id uuid references weddings(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text check (role in ('owner','editor','viewer')) not null,
  primary key (wedding_id, user_id)
);

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  party_id uuid,
  side text check (side in ('partner_a','partner_b','both')) default 'both'
);

create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid references guests(id) on delete cascade,
  status text check (status in ('yes','no','maybe')) not null,
  meal_choice text,
  notes text,
  responded_at timestamptz default now()
);

create table if not exists vendors (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  type text,
  name text not null,
  contact_email text,
  contact_phone text,
  website text
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete set null,
  title text,
  start_at timestamptz,
  end_at timestamptz,
  amount_cents integer,
  status text check (status in ('inquiry','booked','paid','cancelled')) default 'inquiry'
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  title text not null,
  due_date date,
  completed boolean default false,
  assignee_user_id uuid references auth.users(id),
  assignee_kind text check (assignee_kind in ('user','guest','vendor','officiant','venue')),
  assignee_ref_id uuid
);

create table if not exists timeline_events (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  title text not null,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  notes text
);

-- Access codes per wedding and role types
create table if not exists wedding_access_codes (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  role_type text check (role_type in ('bride_groom','best_man','maid_of_honor','bridesmaid','groomsman','planner','officiant','guest','vendor','venue')) not null,
  code_hash text not null,
  code_hint text,
  expires_at timestamptz,
  max_uses integer,
  used_count integer default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- Extend wedding_members with domain role type and permission level
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'wedding_members' and column_name = 'role_type'
  ) then
    alter table wedding_members
      add column role_type text check (role_type in ('bride_groom','best_man','maid_of_honor','bridesmaid','groomsman','planner','officiant','guest','vendor','venue'));
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'wedding_members' and column_name = 'permission'
  ) then
    alter table wedding_members
      add column permission text check (permission in ('owner','editor','viewer')) default 'viewer';
  end if;
end $$;

-- Helper to check bcrypt hash (pgcrypto needed)
-- create extension if not exists pgcrypto; -- enable this once in your project

-- Verify access code for a wedding and role
create or replace function public.verify_wedding_code(wid uuid, role_in text, code_in text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  valid boolean;
begin
  select exists (
    select 1
    from wedding_access_codes c
    where c.wedding_id = wid
      and c.role_type = role_in
      and c.active = true
      and (c.expires_at is null or c.expires_at > now())
      and (c.max_uses is null or c.used_count < c.max_uses)
      and crypt(code_in, c.code_hash) = c.code_hash
  ) into valid;
  return valid;
end;
$$;

-- Join current user to wedding with role using a valid code
create or replace function public.join_wedding_with_code(wid uuid, role_in text, code_in text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ok boolean;
  perm text;
begin
  ok := public.verify_wedding_code(wid, role_in, code_in);
  if not ok then
    return false;
  end if;
  -- map domain roles to permissions
  perm := case
    when role_in in ('bride_groom','planner') then 'editor'
    else 'viewer'
  end;
  insert into wedding_members (wedding_id, user_id, role, role_type, permission)
  values (wid, auth.uid(), perm, role_in, perm)
  on conflict (wedding_id, user_id) do update
    set role_type = excluded.role_type,
        permission = excluded.permission;

  update wedding_access_codes
    set used_count = used_count + 1
    where wedding_id = wid and role_type = role_in
      and crypt(code_in, code_hash) = code_hash;

  return true;
end;
$$;

create table if not exists budget_items (
  id uuid primary key default gen_random_uuid(),
  wedding_id uuid references weddings(id) on delete cascade,
  category text,
  planned_cents integer default 0,
  actual_cents integer default 0,
  notes text
);

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'budget_items' and column_name = 'due_date'
  ) then
    alter table budget_items add column due_date date;
  end if;
end $$;

-- Row Level Security (RLS) and policies
-- Migrate user references to auth.users
do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'wedding_members_user_id_fkey'
  ) then
    alter table wedding_members drop constraint wedding_members_user_id_fkey;
  end if;
exception when others then null;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.table_constraints
    where constraint_name = 'tasks_assignee_user_id_fkey'
  ) then
    alter table tasks drop constraint tasks_assignee_user_id_fkey;
  end if;
exception when others then null;
end $$;

alter table wedding_members alter column user_id type uuid using user_id::uuid;
alter table tasks alter column assignee_user_id type uuid using assignee_user_id::uuid;

alter table wedding_members
  add constraint wedding_members_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table tasks
  add constraint tasks_assignee_user_id_fkey
  foreign key (assignee_user_id) references auth.users(id) on delete set null;

-- Helper function: check if current user is member of a wedding
create or replace function public.is_wedding_member(wid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from wedding_members wm
    where wm.wedding_id = wid
      and wm.user_id = auth.uid()
  );
$$;

-- Enable RLS
alter table weddings enable row level security;
alter table wedding_members enable row level security;
alter table guests enable row level security;
alter table rsvps enable row level security;
alter table vendors enable row level security;
alter table bookings enable row level security;
alter table tasks enable row level security;
alter table timeline_events enable row level security;
alter table budget_items enable row level security;
alter table wedding_access_codes enable row level security;

-- Weddings: members can select; owners can update/delete; any authenticated can insert
create policy "weddings_select_members"
  on weddings for select
  using (public.is_wedding_member(id));

create policy "weddings_insert_auth"
  on weddings for insert
  with check (auth.role() = 'authenticated');

create policy "weddings_update_owner"
  on weddings for update
  using (
    exists (
      select 1 from wedding_members wm
      where wm.wedding_id = weddings.id
        and wm.user_id = auth.uid()
        and wm.role = 'owner'
    )
  )
  with check (
    exists (
      select 1 from wedding_members wm
      where wm.wedding_id = weddings.id
        and wm.user_id = auth.uid()
        and wm.role = 'owner'
    )
  );

create policy "weddings_delete_owner"
  on weddings for delete
  using (
    exists (
      select 1 from wedding_members wm
      where wm.wedding_id = weddings.id
        and wm.user_id = auth.uid()
        and wm.role = 'owner'
    )
  );

-- Wedding members: users manage their own membership
create policy "members_select_self_or_same_wedding"
  on wedding_members for select
  using (user_id = auth.uid() or public.is_wedding_member(wedding_id));

create policy "members_insert_self"
  on wedding_members for insert
  with check (user_id = auth.uid());

create policy "members_update_self"
  on wedding_members for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "members_delete_self"
  on wedding_members for delete
  using (user_id = auth.uid());

-- Generic member access for wedding-scoped tables
create policy "guests_member_all" on guests for all
  using (public.is_wedding_member(wedding_id))
  with check (public.is_wedding_member(wedding_id));

create policy "vendors_member_all" on vendors for all
  using (public.is_wedding_member(wedding_id))
  with check (public.is_wedding_member(wedding_id));

create policy "bookings_member_all" on bookings for all
  using (public.is_wedding_member(wedding_id))
  with check (public.is_wedding_member(wedding_id));

create policy "tasks_member_all" on tasks for all
  using (public.is_wedding_member(wedding_id))
  with check (public.is_wedding_member(wedding_id));

create policy "timeline_member_all" on timeline_events for all
  using (public.is_wedding_member(wedding_id))
  with check (public.is_wedding_member(wedding_id));

create policy "budget_member_all" on budget_items for all
  using (public.is_wedding_member(wedding_id))
  with check (public.is_wedding_member(wedding_id));

-- Access codes: allow no direct access; only via security definer functions
revoke all on table wedding_access_codes from anon, authenticated;

-- RSVPs need join through guests to resolve wedding
create policy "rsvps_member_all" on rsvps for all
  using (
    exists (
      select 1
      from guests g
      join wedding_members wm on wm.wedding_id = g.wedding_id
      where g.id = rsvps.guest_id
        and wm.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from guests g
      join wedding_members wm on wm.wedding_id = g.wedding_id
      where g.id = rsvps.guest_id
        and wm.user_id = auth.uid()
    )
  );
