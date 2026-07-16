create extension if not exists "pgcrypto";

create type pool_role as enum ('member', 'moderator', 'steward');
create type outcome_status as enum ('pending', 'approved', 'rejected');
create type outcome_category as enum ('Team formed', 'Company created', 'Product launched', 'Funding raised', 'Research published', 'Event completed', 'Goal reached', 'Other');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  username text not null unique,
  avatar_url text,
  bio text default '',
  can_do text default '',
  wants_to_build text default '',
  looking_for text default '',
  availability text default '',
  preferred_commitment text default '',
  location text default '',
  links text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pools (
  id uuid primary key default gen_random_uuid(),
  steward_id uuid not null references profiles(id) on delete restrict,
  title text not null,
  slug text not null unique,
  cover_url text,
  summary text not null,
  description text not null,
  category text not null,
  location text default 'Remote',
  is_private boolean not null default false,
  rules text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pool_members (
  pool_id uuid not null references pools(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role pool_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (pool_id, profile_id)
);

create table posts (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references pools(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table mission_updates (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references pools(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table outcomes (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references pools(id) on delete cascade,
  submitter_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category outcome_category not null,
  outcome_date date not null,
  external_link text,
  image_url text,
  status outcome_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table outcome_members (
  outcome_id uuid not null references outcomes(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  primary key (outcome_id, profile_id)
);

create table conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table conversation_members (
  conversation_id uuid not null references conversations(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  primary key (conversation_id, profile_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table moderators (
  pool_id uuid not null references pools(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (pool_id, profile_id)
);

create table access_requests (
  id uuid primary key default gen_random_uuid(),
  pool_id uuid not null references pools(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pool_id, profile_id)
);

create index profiles_username_idx on profiles(username);
create index pools_slug_idx on pools(slug);
create index pools_category_idx on pools(category);
create index pool_members_profile_idx on pool_members(profile_id);
create index posts_pool_created_idx on posts(pool_id, created_at desc);
create index comments_post_created_idx on comments(post_id, created_at);
create index outcomes_pool_status_idx on outcomes(pool_id, status);
create index messages_conversation_created_idx on messages(conversation_id, created_at);

alter table profiles enable row level security;
alter table pools enable row level security;
alter table pool_members enable row level security;
alter table posts enable row level security;
alter table comments enable row level security;
alter table mission_updates enable row level security;
alter table outcomes enable row level security;
alter table outcome_members enable row level security;
alter table conversations enable row level security;
alter table conversation_members enable row level security;
alter table messages enable row level security;
alter table moderators enable row level security;
alter table access_requests enable row level security;

create or replace function is_pool_member(target_pool uuid, target_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from pool_members where pool_id = target_pool and profile_id = target_user);
$$;

create or replace function can_moderate_pool(target_pool uuid, target_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from pool_members
    where pool_id = target_pool and profile_id = target_user and role in ('steward', 'moderator')
  );
$$;

create or replace function can_read_pool(target_pool uuid, target_user uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from pools
    where id = target_pool and (is_private = false or is_pool_member(target_pool, target_user))
  );
$$;

create policy "Profiles are public" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Users insert own profile" on profiles for insert with check (id = auth.uid());

create policy "Public pools are readable" on pools for select using (is_private = false or is_pool_member(id));
create policy "Authenticated users create stewarded pools" on pools for insert with check (steward_id = auth.uid());
create policy "Stewards edit pools" on pools for update using (steward_id = auth.uid()) with check (steward_id = auth.uid());

create policy "Readable memberships for readable pools" on pool_members for select using (can_read_pool(pool_id));
create policy "Users join public pools" on pool_members for insert with check (
  profile_id = auth.uid() and exists (select 1 from pools where pools.id = pool_id and pools.is_private = false)
);
create policy "Users leave own non-steward membership" on pool_members for delete using (profile_id = auth.uid() and role <> 'steward');
create policy "Moderators manage members" on pool_members for update using (can_moderate_pool(pool_id)) with check (can_moderate_pool(pool_id));
create policy "Moderators remove members" on pool_members for delete using (can_moderate_pool(pool_id));

create policy "Read posts in readable pools" on posts for select using (can_read_pool(pool_id));
create policy "Members post in joined pools" on posts for insert with check (author_id = auth.uid() and is_pool_member(pool_id));
create policy "Authors update own posts" on posts for update using (author_id = auth.uid()) with check (author_id = auth.uid());
create policy "Authors or moderators delete posts" on posts for delete using (author_id = auth.uid() or can_moderate_pool(pool_id));

create policy "Read comments on readable posts" on comments for select using (
  exists (select 1 from posts where posts.id = post_id and can_read_pool(posts.pool_id))
);
create policy "Members comment in joined pools" on comments for insert with check (
  author_id = auth.uid() and exists (select 1 from posts where posts.id = post_id and is_pool_member(posts.pool_id))
);
create policy "Authors delete own comments" on comments for delete using (author_id = auth.uid());

create policy "Read mission updates in readable pools" on mission_updates for select using (can_read_pool(pool_id));
create policy "Moderators publish mission updates" on mission_updates for insert with check (author_id = auth.uid() and can_moderate_pool(pool_id));
create policy "Moderators edit mission updates" on mission_updates for update using (can_moderate_pool(pool_id)) with check (can_moderate_pool(pool_id));
create policy "Moderators delete mission updates" on mission_updates for delete using (can_moderate_pool(pool_id));

create policy "Read approved outcomes in readable pools" on outcomes for select using (can_read_pool(pool_id) and (status = 'approved' or submitter_id = auth.uid() or can_moderate_pool(pool_id)));
create policy "Members submit outcomes" on outcomes for insert with check (submitter_id = auth.uid() and is_pool_member(pool_id));
create policy "Submitters edit pending outcomes" on outcomes for update using (submitter_id = auth.uid() and status = 'pending') with check (submitter_id = auth.uid());
create policy "Moderators verify outcomes" on outcomes for update using (can_moderate_pool(pool_id)) with check (can_moderate_pool(pool_id));

create policy "Read outcome members through readable outcomes" on outcome_members for select using (
  exists (select 1 from outcomes where outcomes.id = outcome_id and can_read_pool(outcomes.pool_id))
);
create policy "Submitters attach outcome members" on outcome_members for insert with check (
  exists (select 1 from outcomes where outcomes.id = outcome_id and outcomes.submitter_id = auth.uid())
);

create policy "Conversation members read conversations" on conversations for select using (
  exists (select 1 from conversation_members where conversation_id = id and profile_id = auth.uid())
);
create policy "Authenticated users create conversations" on conversations for insert with check (auth.uid() is not null);

create policy "Conversation members visible to each other" on conversation_members for select using (
  exists (select 1 from conversation_members cm where cm.conversation_id = conversation_id and cm.profile_id = auth.uid())
);
create policy "Users add themselves to conversations" on conversation_members for insert with check (profile_id = auth.uid());

create policy "Conversation members read messages" on messages for select using (
  exists (select 1 from conversation_members where conversation_id = messages.conversation_id and profile_id = auth.uid())
);
create policy "Conversation members send messages" on messages for insert with check (
  sender_id = auth.uid() and exists (select 1 from conversation_members where conversation_id = messages.conversation_id and profile_id = auth.uid())
);

create policy "Read moderators in readable pools" on moderators for select using (can_read_pool(pool_id));
create policy "Stewards manage moderators" on moderators for all using (
  exists (select 1 from pools where pools.id = pool_id and pools.steward_id = auth.uid())
) with check (
  exists (select 1 from pools where pools.id = pool_id and pools.steward_id = auth.uid())
);

create policy "Users create own access requests" on access_requests for insert with check (profile_id = auth.uid());
create policy "Users read own or moderator access requests" on access_requests for select using (profile_id = auth.uid() or can_moderate_pool(pool_id));
create policy "Moderators update access requests" on access_requests for update using (can_moderate_pool(pool_id)) with check (can_moderate_pool(pool_id));
