import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { adminEventSchema } from '@/lib/validations/admin';
import { persistAdminEvent, updateAdminEvent } from '@/lib/actions/admin-persist';
import { getAdminEventRecords } from '@/lib/queries/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteDemoRecord } from '@/lib/demo-store';

export async function GET() {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await getAdminEventRecords();
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = adminEventSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid event payload.' }, { status: 400 });

  const result = await persistAdminEvent(parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ message: result.mode === 'demo' ? 'Event created in demo mode and saved locally.' : 'Event created successfully.' });
}

export async function PUT(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = adminEventSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid event payload.' }, { status: 400 });

  const result = await updateAdminEvent(id, parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ message: result.mode === 'demo' ? 'Event updated in demo mode.' : 'Event updated successfully.' });
}

export async function DELETE(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await deleteDemoRecord('events', id);
    return NextResponse.json({ message: 'Deleted from local demo store.' });
  }

  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Event deleted.' });
}
