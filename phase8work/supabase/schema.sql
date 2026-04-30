create extension if not exists pgcrypto;

create table if not exists alumni_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  graduation_year integer,
  major text,
  company text,
  job_title text,
  industry text,
  location text,
  linkedin_url text,
  short_bio text,
  willing_to_mentor boolean default false,
  willing_to_donate boolean default false,
  is_featured boolean default false,
  is_public boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists alumni_private_details (
  id uuid primary key default gen_random_uuid(),
  alumni_profile_id uuid not null unique references alumni_profiles(id) on delete cascade,
  email text,
  phone text,
  mailing_address text,
  visibility_notes text,
  admin_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  event_date date not null,
  event_time text,
  location text,
  description text,
  is_featured boolean default false,
  status text default 'published',
  created_at timestamptz default now()
);

create table if not exists event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  full_name text not null,
  email text not null,
  graduation_year integer,
  guest_count integer default 0,
  notes text,
  created_at timestamptz default now()
);

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text unique not null,
  graduation_year integer,
  subscriber_type text,
  is_active boolean default true,
  subscribed_at timestamptz default now()
);

create table if not exists newsletters (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subject_line text,
  summary text,
  body_content text,
  issue_date date,
  status text default 'draft',
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists mentors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  graduation_year integer,
  company text,
  job_title text,
  industry text,
  mentoring_areas text,
  preferred_contact_method text,
  availability text,
  created_at timestamptz default now()
);

create table if not exists mentee_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  class_year text,
  career_interests text,
  goals text,
  linkedin_url text,
  preferred_mentor_background text,
  created_at timestamptz default now()
);

create table if not exists spotlight_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  post_type text not null,
  excerpt text,
  body_content text,
  is_featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  media_type text not null,
  file_url text,
  event_id uuid references events(id) on delete set null,
  year_label text,
  caption text,
  created_at timestamptz default now()
);

create table if not exists legacy_vault_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  item_type text not null,
  year_label text,
  description text,
  file_url text,
  contributor_name text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists legacy_submissions (
  id uuid primary key default gen_random_uuid(),
  submitted_by_profile_id uuid references alumni_profiles(id) on delete set null,
  submitted_by_user_id uuid,
  member_status_at_submission text,
  full_name text not null,
  email text,
  graduation_year integer,
  graduation_term text,
  graduation_date date,
  title text not null,
  memory_body text not null,
  media_type text not null default 'memory',
  storage_bucket text,
  storage_path text,
  file_url text,
  consent_to_publish boolean not null default false,
  status text not null default 'submitted',
  release_at timestamptz not null,
  reviewed_at timestamptz,
  reviewed_by text,
  published_at timestamptz,
  release_email_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  inquiry_type text,
  message text,
  created_at timestamptz default now()
);

create table if not exists donation_interest_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  support_area text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references admin_users(id) on delete cascade,
  role text not null,
  created_at timestamptz default now()
);


alter table if exists events add column if not exists audience text;
alter table if exists events add column if not exists image_hint text;
alter table if exists events add column if not exists body_content text;
alter table if exists events add column if not exists tags text[] default '{}';
alter table if exists newsletters add column if not exists category text;
alter table if exists mentors add column if not exists email text;
alter table if exists mentee_requests add column if not exists email text;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_alumni_profiles_updated_at on alumni_profiles;
create trigger set_alumni_profiles_updated_at
before update on alumni_profiles
for each row execute function set_updated_at();

drop trigger if exists set_alumni_private_details_updated_at on alumni_private_details;
create trigger set_alumni_private_details_updated_at
before update on alumni_private_details
for each row execute function set_updated_at();

drop trigger if exists set_legacy_submissions_updated_at on legacy_submissions;
create trigger set_legacy_submissions_updated_at
before update on legacy_submissions
for each row execute function set_updated_at();

alter table alumni_profiles enable row level security;
alter table alumni_private_details enable row level security;
alter table events enable row level security;
alter table newsletters enable row level security;
alter table legacy_vault_items enable row level security;
alter table if exists legacy_submissions enable row level security;

drop policy if exists "Public can read public alumni profiles" on alumni_profiles;
create policy "Public can read public alumni profiles" on alumni_profiles
for select using (is_public = true);

drop policy if exists "Public can read published events" on events;
create policy "Public can read published events" on events
for select using (status = 'published');

drop policy if exists "Public can read published newsletters" on newsletters;
create policy "Public can read published newsletters" on newsletters
for select using (status in ('published', 'sent'));

drop policy if exists "Public can read approved legacy items" on legacy_vault_items;
create policy "Public can read approved legacy items" on legacy_vault_items
for select using (status = 'approved');

alter table if exists media_items add column if not exists storage_bucket text;
alter table if exists media_items add column if not exists storage_path text;
alter table if exists legacy_vault_items add column if not exists source_submission_id uuid references legacy_submissions(id) on delete set null;
alter table if exists legacy_vault_items add column if not exists published_at timestamptz;

create index if not exists idx_legacy_submissions_status on legacy_submissions(status);
create index if not exists idx_legacy_submissions_release_at on legacy_submissions(release_at);


create table if not exists member_accounts (
  id uuid primary key default gen_random_uuid(),
  alumni_profile_id uuid not null unique references alumni_profiles(id) on delete cascade,
  auth_user_id uuid,
  auth_email text unique not null,
  claim_status text default 'linked',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table if exists alumni_private_details add column if not exists email_visibility text default 'members';
alter table if exists alumni_private_details add column if not exists phone_visibility text default 'private';
alter table if exists alumni_private_details add column if not exists linkedin_visibility text default 'public';

drop trigger if exists set_member_accounts_updated_at on member_accounts;
create trigger set_member_accounts_updated_at
before update on member_accounts
for each row execute function set_updated_at();

create table if not exists member_claim_tokens (
  id uuid primary key default gen_random_uuid(),
  claim_type text not null,
  alumni_profile_id uuid not null references alumni_profiles(id) on delete cascade,
  auth_email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_member_claim_tokens_email on member_claim_tokens(auth_email);
create index if not exists idx_member_claim_tokens_profile on member_claim_tokens(alumni_profile_id);
create index if not exists idx_member_claim_tokens_claim_type on member_claim_tokens(claim_type);

alter table if exists member_accounts enable row level security;
drop policy if exists "Admins can manage member links" on member_accounts;
create policy "Admins can manage member links" on member_accounts
for all using (true) with check (true);

alter table if exists member_claim_tokens enable row level security;
drop policy if exists "Admins can manage claim tokens" on member_claim_tokens;
