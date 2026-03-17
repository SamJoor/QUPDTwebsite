import { NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validations/admin';
import { createSessionToken } from '@/lib/auth/session';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createSupabaseAnonServerClient, hasSupabaseAuthEnv } from '@/lib/supabase/auth';

async function emailAllowedForRole(scope: 'admin' | 'alumni', email: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return true;

  if (scope === 'admin') {
    const { data } = await supabase.from('admin_users').select('email').eq('email', email).maybeSingle();
    return Boolean(data?.email);
  }

  const linked = await supabase.from('member_accounts').select('auth_email').eq('auth_email', email).maybeSingle();
  if (linked.data?.auth_email) return true;

  const privateMatch = await supabase
    .from('alumni_private_details')
    .select('email, alumni_profiles(member_status, alumni_access_enabled)')
    .eq('email', email)
    .maybeSingle();

  const profile = Array.isArray((privateMatch.data as any)?.alumni_profiles)
    ? (privateMatch.data as any)?.alumni_profiles?.[0]
    : (privateMatch.data as any)?.alumni_profiles;

  if (privateMatch.data?.email && profile?.alumni_access_enabled !== false && profile?.member_status !== 'active') return true;

  return false;
}

async function verifyAlumniCredentials(email: string, password: string) {
  if (hasSupabaseAuthEnv()) {
    const anon = createSupabaseAnonServerClient();
    if (anon) {
      const { data, error } = await anon.auth.signInWithPassword({ email, password });
      if (error || !data.user) {
        return { ok: false as const, error: error?.message || 'Unable to sign in with Supabase Auth.' };
      }
      return { ok: true as const, email: data.user.email || email };
    }
  }

  const expectedPassword = process.env.ALUMNI_LOGIN_PASSWORD;
  if (!expectedPassword) {
    return { ok: false as const, error: 'Missing ALUMNI_LOGIN_PASSWORD or Supabase Auth environment.' };
  }
  if (password !== expectedPassword) {
    return { ok: false as const, error: 'Incorrect password.' };
  }
  return { ok: true as const, email };
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid login submission.' }, { status: 400 });
  }

  const { email, password, scope } = parsed.data;

  if (scope === 'admin') {
    const expectedPassword = process.env.ADMIN_LOGIN_PASSWORD;
    if (!expectedPassword) {
      return NextResponse.json({ error: 'Missing ADMIN_LOGIN_PASSWORD in environment.' }, { status: 500 });
    }
    if (password !== expectedPassword) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
    }
  } else {
    const verified = await verifyAlumniCredentials(email, password);
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 401 });
    }
  }

  const allowed = await emailAllowedForRole(scope, email);
  if (!allowed) {
    return NextResponse.json({ error: 'This email is not linked yet. Claim your alumni profile first.' }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken({ role: scope, email, name: email.split('@')[0] }),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
