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

alter table if exists member_claim_tokens enable row level security;
drop policy if exists "Admins can manage claim tokens" on member_claim_tokens;
