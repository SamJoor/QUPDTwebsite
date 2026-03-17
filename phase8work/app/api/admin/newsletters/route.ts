import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { adminNewsletterSchema } from '@/lib/validations/admin';
import { persistAdminNewsletter, updateAdminNewsletter } from '@/lib/actions/admin-persist';
import { getAdminNewsletterRecords } from '@/lib/queries/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteDemoRecord } from '@/lib/demo-store';

export async function GET() {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = await getAdminNewsletterRecords();
  return NextResponse.json({ rows });
}

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await request.json().catch(() => null);
  const parsed = adminNewsletterSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid newsletter payload.' }, { status: 400 });

  const result = await persistAdminNewsletter(parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });

  return NextResponse.json({ message: result.mode === 'demo' ? 'Newsletter saved in demo mode and written locally.' : 'Newsletter created successfully.' });
}

export async function PUT(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const json = await request.json().catch(() => null);
  const parsed = adminNewsletterSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid newsletter payload.' }, { status: 400 });

  const result = await updateAdminNewsletter(id, parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ message: result.mode === 'demo' ? 'Newsletter updated in demo mode.' : 'Newsletter updated successfully.' });
}

export async function DELETE(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 });

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    await deleteDemoRecord('newsletters', id);
    return NextResponse.json({ message: 'Deleted from local demo store.' });
  }

  const { error } = await supabase.from('newsletters').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: 'Newsletter deleted.' });
}
