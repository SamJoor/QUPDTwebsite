alter table if exists alumni_private_details add column if not exists email_visibility text default 'members';
alter table if exists alumni_private_details add column if not exists phone_visibility text default 'private';
alter table if exists alumni_private_details add column if not exists linkedin_visibility text default 'public';

create table if not exists member_accounts (
  id uuid primary key default gen_random_uuid(),
  alumni_profile_id uuid not null unique references alumni_profiles(id) on delete cascade,
  auth_user_id uuid,
  auth_email text unique not null,
  claim_status text default 'linked',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists set_member_accounts_updated_at on member_accounts;
create trigger set_member_accounts_updated_at
before update on member_accounts
for each row execute function set_updated_at();
