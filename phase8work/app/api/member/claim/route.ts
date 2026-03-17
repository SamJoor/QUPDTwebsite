import { NextResponse } from 'next/server';
import { memberClaimSchema } from '@/lib/validations/member';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase connection is required for profile claiming in Phase 7.' }, { status: 500 });
  }

  const json = await request.json().catch(() => null);
  const parsed = memberClaimSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid claim submission.' }, { status: 400 });
  }

  const { fullName, graduationYear, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const lookup = await supabase
    .from('alumni_private_details')
    .select('alumni_profile_id, email, alumni_profiles(full_name, graduation_year, member_status, alumni_access_enabled)')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (!lookup.data?.alumni_profile_id) {
    return NextResponse.json({ error: 'No alumni record was found for that email. Ask an officer to add or correct your alumni contact email first.' }, { status: 404 });
  }

  const profile = Array.isArray((lookup.data as any).alumni_profiles)
    ? (lookup.data as any).alumni_profiles[0]
    : (lookup.data as any).alumni_profiles;

  if (!profile || profile.full_name !== fullName || Number(profile.graduation_year) !== graduationYear) {
    return NextResponse.json({ error: 'Your name or graduation year did not match the alumni record linked to that email.' }, { status: 403 });
  }

  if (profile.alumni_access_enabled === false || profile.member_status === 'active') {
    return NextResponse.json({ error: 'This record is not alumni-enabled yet. Update graduation status or alumni access in the admin workspace first.' }, { status: 403 });
  }

  const existing = await supabase.from('member_accounts').select('id').eq('auth_email', normalizedEmail).maybeSingle();
  if (existing.data?.id) {
    return NextResponse.json({ message: 'This alumni record is already claimed. You can sign in now.' });
  }

  const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, graduation_year: graduationYear }
  });

  if (createError && !/already/i.test(createError.message)) {
    return NextResponse.json({ error: createError.message }, { status: 400 });
  }

  const authUserId = createdUser.user?.id ?? null;

  const { error: upsertError } = await supabase
    .from('member_accounts')
    .upsert({
      alumni_profile_id: lookup.data.alumni_profile_id,
      auth_user_id: authUserId,
      auth_email: normalizedEmail,
      claim_status: 'linked'
    }, { onConflict: 'auth_email' });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Profile claimed successfully. You can sign in with your email and password now.' });
}
