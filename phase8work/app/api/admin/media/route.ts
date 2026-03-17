import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { adminMediaSchema } from '@/lib/validations/admin';
import { persistAdminMedia, updateAdminMedia } from '@/lib/actions/admin-persist';
import { getAdminMediaRecords } from '@/lib/queries/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteDemoRecord } from '@/lib/demo-store';

export async function GET() {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await getAdminMediaRecords();
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = adminMediaSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid media payload.' }, { status: 400 });

  const result = await persistAdminMedia(parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ message: result.mode === 'demo' ? 'Media record saved in demo mode and written locally.' : 'Media metadata saved successfully.' });
}

export async function PUT(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = adminMediaSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid media payload.' }, { status: 400 });

  const result = await updateAdminMedia(id, parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ message: result.mode === 'demo' ? 'Media updated in demo mode.' : 'Media metadata updated successfully.' });
}

export async function DELETE(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await deleteDemoRecord('media', id);
    return NextResponse.json({ message: 'Deleted from local demo store.' });
  }

  const { error } = await supabase.from('media_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Media record deleted.' });
}
