import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { getAdminAlumniRecords, getAdminEventRecords, getAdminNewsletterRecords } from '@/lib/queries/admin';

function toCsv(rows: { id: string; primary: string; secondary: string; tertiary?: string; badge?: string }[]) {
  const header = ['id', 'primary', 'secondary', 'tertiary', 'badge'];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const lines = rows.map((row) => [row.id, row.primary, row.secondary, row.tertiary || '', row.badge || ''].map(escape).join(','));
  return [header.join(','), ...lines].join('\n');
}

export async function GET(_: Request, context: { params: Promise<{ type: string }> }) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { type } = await context.params;
  let rows;
  if (type === 'alumni') rows = await getAdminAlumniRecords();
  else if (type === 'events') rows = await getAdminEventRecords();
  else if (type === 'newsletters') rows = await getAdminNewsletterRecords();
  else return NextResponse.json({ error: 'Unsupported export type.' }, { status: 400 });

  return new NextResponse(toCsv(rows), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${type}-export.csv"`
    }
  });
}
