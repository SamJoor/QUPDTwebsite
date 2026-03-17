import { NextResponse } from 'next/server';
import { rsvpSchema } from '@/lib/validations/forms';
import { persistEventRsvp } from '@/lib/actions/persist';

export async function POST(request: Request) {
  const json = await request.json();
  const result = rsvpSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistEventRsvp(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save RSVP.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'RSVP saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so this ran in demo mode.'
  });
}
