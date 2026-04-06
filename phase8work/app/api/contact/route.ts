import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/forms';
import { persistContactSubmission } from '@/lib/actions/persist';
import { sendContactNotificationEmails } from '@/lib/email/send-contact-notification';

async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // skip if not configured

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  const data = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
  console.log('[turnstile] verify result:', JSON.stringify(data));
  return data.success === true;
}

export async function POST(request: Request) {
  const json = await request.json() as Record<string, unknown>;

  // Verify Turnstile token if the secret key is configured
  const token = typeof json['cf-turnstile-response'] === 'string' ? json['cf-turnstile-response'] : '';
  console.log('[turnstile] token present:', !!token, '| token length:', token.length);
  if (process.env.TURNSTILE_SECRET_KEY) {
    const ip = request.headers.get('CF-Connecting-IP') ?? request.headers.get('x-forwarded-for');
    const valid = await verifyTurnstile(token, ip);
    if (!valid) {
      return NextResponse.json({ error: 'Bot verification failed. Please try again.' }, { status: 400 });
    }
  }

  const result = contactSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistContactSubmission(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save contact submission.' }, { status: 500 });
  }

  // Send notification to chapter inbox + confirmation to submitter (non-blocking)
  sendContactNotificationEmails(result.data).catch((err) => {
    console.error('[contact] Email send failed:', err);
  });

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'Your message was saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so this ran in demo mode.',
    topic: result.data.topic
  });
}
