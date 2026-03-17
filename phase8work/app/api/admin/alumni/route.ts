import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { adminAlumniSchema } from '@/lib/validations/admin';
import { persistAdminAlumni, updateAdminAlumni } from '@/lib/actions/admin-persist';
import { getAdminAlumniRecords } from '@/lib/queries/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteDemoRecord } from '@/lib/demo-store';

export async function GET() {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await getAdminAlumniRecords();
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = adminAlumniSchema.safeParse(json);

  if (!parsed.success) return NextResponse.json({ error: 'Invalid alumni payload.' }, { status: 400 });

  const result = await persistAdminAlumni(parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ message: result.mode === 'demo' ? 'Saved in demo mode and written to the local demo store.' : 'Alumni profile created successfully.' });
}

export async function PUT(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = adminAlumniSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid alumni payload.' }, { status: 400 });

  const result = await updateAdminAlumni(id, parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ message: result.mode === 'demo' ? 'Updated in local demo store.' : 'Alumni profile updated successfully.' });
}

export async function DELETE(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await deleteDemoRecord('alumni', id);
    return NextResponse.json({ message: 'Deleted from local demo store.' });
  }

  await supabase.from('alumni_private_details').delete().eq('alumni_profile_id', id);
  const { error } = await supabase.from('alumni_profiles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Alumni profile deleted.' });
}
