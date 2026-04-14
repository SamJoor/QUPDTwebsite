import { NextResponse } from 'next/server';
import { activeClaimCompleteSchema } from '@/lib/validations/member';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { consumeActiveClaimToken, getActiveClaimTokenRecord, isActiveClaimTokenUsable } from '@/lib/auth/active-claim';
import { checkRateLimit } from '@/lib/auth/rate-limit';

type MemberAccountRow = {
  id: string;
  auth_user_id: string | null;
  auth_email: string;
};

async function findAuthUserIdByEmail(email: string) {
  const supabase = getSupabaseAdmin();
  const admin = supabase.auth.admin as any;
  const { data, error } = await admin.listUsers?.();
  if (error) throw new Error(error.message);
  const users = (data?.users ?? []) as Array<{ id: string; email?: string | null }>;
  return users.find((user) => (user.email || '').toLowerCase() === email.toLowerCase())?.id ?? null;
}

export async function POST(request: Request) {
  const ip = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`active-claim-complete:${ip}`, 10, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many setup attempts. Please wait 10 minutes.' }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = activeClaimCompleteSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid account setup submission.' }, { status: 400 });
  }

  try {
    const tokenRecord = await getActiveClaimTokenRecord(parsed.data.token);
    if (!tokenRecord || !isActiveClaimTokenUsable(tokenRecord)) {
      return NextResponse.json({ error: 'This setup link is invalid or has expired.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const profileRes = await supabase
      .from('alumni_profiles')
      .select('id, member_status')
      .eq('id', tokenRecord.alumni_profile_id)
      .maybeSingle();

    if (profileRes.error || !profileRes.data?.id || profileRes.data.member_status !== 'active') {
      return NextResponse.json({ error: 'This record is no longer eligible for active-member setup.' }, { status: 403 });
    }

    const existingRes = await supabase
      .from('member_accounts')
      .select('id, auth_user_id, auth_email')
      .eq('auth_email', tokenRecord.auth_email)
      .maybeSingle();

    if (existingRes.error) {
      return NextResponse.json({ error: existingRes.error.message }, { status: 500 });
    }

    const existing = existingRes.data as MemberAccountRow | null;

    let authUserId = existing?.auth_user_id ?? null;
    if (!authUserId) {
      authUserId = await findAuthUserIdByEmail(tokenRecord.auth_email);
    }

    if (authUserId) {
      const { error: updateError } = await supabase.auth.admin.updateUserById(authUserId, {
        password: parsed.data.password,
        email_confirm: true,
        user_metadata: {
          member_status: 'active'
        }
      });

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
      }
    } else {
      const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
        email: tokenRecord.auth_email,
        password: parsed.data.password,
        email_confirm: true,
        user_metadata: { member_status: 'active' }
      });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 400 });
      }

      authUserId = createdUser.user?.id ?? null;
    }

    const { error: upsertError } = await supabase
      .from('member_accounts')
      .upsert({
        alumni_profile_id: tokenRecord.alumni_profile_id,
        auth_user_id: authUserId,
        auth_email: tokenRecord.auth_email,
        claim_status: 'linked'
      }, { onConflict: 'auth_email' });

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 400 });
    }

    await consumeActiveClaimToken(tokenRecord.id);

    return NextResponse.json({
      ok: true,
      message: 'Password set successfully. You can sign in with your email and password now.'
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unable to finish account setup.'
    }, { status: 500 });
  }
}
