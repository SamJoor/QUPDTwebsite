import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await requireSession('alumni');
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, string> | null;
  if (!body?.fullName || !body?.email || !body?.requestedChanges) {
    return NextResponse.json({ error: 'Full name, email, and requested changes are required.' }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, mode: 'demo', message: 'Profile request captured in demo mode. Connect Supabase to route these to the admin review queue.' });
  }

  const message = [
    `Profile update request from ${body.fullName}`,
    body.graduationYear ? `Graduation year: ${body.graduationYear}` : null,
    body.linkedinUrl ? `LinkedIn: ${body.linkedinUrl}` : null,
    '',
    body.requestedChanges,
  ].filter(Boolean).join('\n');

  const { error } = await supabase.from('contact_submissions').insert({
    full_name: body.fullName,
    email: body.email,
    inquiry_type: 'profile_update_request',
    message,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, mode: 'supabase', message: 'Profile request submitted for officer review.' });
}
