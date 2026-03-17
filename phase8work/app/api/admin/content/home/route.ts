import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { adminHomePageSchema } from '@/lib/validations/admin';
import { updateHomePageContent } from '@/lib/actions/admin-persist';

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const json = await request.json().catch(() => null);
  const parsed = adminHomePageSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid home page payload.' }, { status: 400 });
  const result = await updateHomePageContent(parsed.data);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ message: result.mode === 'demo' ? 'Home page content saved in demo mode.' : 'Home page content saved.' });
}
