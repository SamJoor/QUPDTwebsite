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

drop trigger if exists set_legacy_submissions_updated_at on legacy_submissions;
create trigger set_legacy_submissions_updated_at
before update on legacy_submissions
for each row execute function set_updated_at();

alter table if exists legacy_vault_items
  add column if not exists source_submission_id uuid references legacy_submissions(id) on delete set null,
  add column if not exists published_at timestamptz;

create index if not exists idx_legacy_submissions_status on legacy_submissions(status);
create index if not exists idx_legacy_submissions_release_at on legacy_submissions(release_at);

alter table if exists legacy_submissions enable row level security;
drop policy if exists "Admins can manage legacy submissions" on legacy_submissions;
