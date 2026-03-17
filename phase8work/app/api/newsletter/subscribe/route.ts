import { NextResponse } from 'next/server';
import { newsletterSchema } from '@/lib/validations/forms';
import { persistNewsletterSignup } from '@/lib/actions/persist';

export async function POST(request: Request) {
  const json = await request.json();
  const result = newsletterSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistNewsletterSignup(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save subscriber.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'Subscriber saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so no row was inserted.'
  });
}
