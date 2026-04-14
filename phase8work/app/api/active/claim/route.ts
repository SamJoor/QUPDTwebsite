import { NextResponse } from 'next/server';
import { activeClaimRequestSchema } from '@/lib/validations/member';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { issueActiveClaimToken } from '@/lib/auth/active-claim';
import { sendActiveClaimEmail } from '@/lib/email/send-active-claim-email';
import { checkRateLimit } from '@/lib/auth/rate-limit';

export async function POST(request: Request) {
  const ip = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!checkRateLimit(`active-claim-request:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many setup requests. Please wait 10 minutes.' }, { status: 429 });
  }

  const json = await request.json().catch(() => null);
  const parsed = activeClaimRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const normalizedEmail = parsed.data.email.toLowerCase().trim();
  if (!checkRateLimit(`active-claim-request-email:${normalizedEmail}`, 3, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many setup requests for this email. Please wait 10 minutes.' }, { status: 429 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const lookup = await supabase
      .from('alumni_private_details')
      .select('alumni_profile_id, email, alumni_profiles(member_status)')
      .eq('email', normalizedEmail)
      .maybeSingle();

    const profile = Array.isArray((lookup.data as any)?.alumni_profiles)
      ? (lookup.data as any)?.alumni_profiles?.[0]
      : (lookup.data as any)?.alumni_profiles;

    if (!lookup.data?.alumni_profile_id || profile?.member_status !== 'active') {
      return NextResponse.json({
        ok: true,
        message: 'If that email matches an active-member record, we sent a secure setup link.'
      });
    }

    const issued = await issueActiveClaimToken({
      email: normalizedEmail,
      alumniProfileId: lookup.data.alumni_profile_id
    });

    const delivery = await sendActiveClaimEmail({
      to: normalizedEmail,
      claimUrl: issued.url,
      expiresAt: issued.expiresAt
    });

    if (!delivery.sent) {
      if (delivery.mode === 'preview' && process.env.NODE_ENV !== 'production') {
        return NextResponse.json({
          ok: true,
          message: 'Resend is not configured, so no email was sent. Use the preview link below for local testing.',
          previewUrl: issued.url
        });
      }

      return NextResponse.json({ error: delivery.error || 'Unable to send the setup email.' }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: 'If that email matches an active-member record, we sent a secure setup link.'
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unable to start secure account setup.'
    }, { status: 500 });
  }
}
