import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations/forms';
import { persistContactSubmission } from '@/lib/actions/persist';

export async function POST(request: Request) {
  const json = await request.json();
  const result = contactSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistContactSubmission(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save contact submission.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'Your message was saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so this ran in demo mode.',
    topic: result.data.topic
  });
}
