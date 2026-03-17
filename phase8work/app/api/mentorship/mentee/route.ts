import { NextResponse } from 'next/server';
import { menteeSchema } from '@/lib/validations/forms';
import { persistMenteeRequest } from '@/lib/actions/persist';

export async function POST(request: Request) {
  const json = await request.json();
  const result = menteeSchema.safeParse(json);

  if (!result.success) {
    return NextResponse.json({ error: result.error.issues[0]?.message ?? 'Invalid request.' }, { status: 400 });
  }

  const persistence = await persistMenteeRequest(result.data);

  if (persistence.mode === 'supabase' && !persistence.persisted) {
    return NextResponse.json({ error: persistence.error ?? 'Failed to save mentee request.' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    mode: persistence.mode,
    message: persistence.mode === 'supabase'
      ? 'Mentee request saved successfully.'
      : 'Validated successfully. Supabase is not connected yet, so this ran in demo mode.'
  });
}
