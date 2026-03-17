import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/auth/session';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { newsletterHtmlTemplate, newsletterTextTemplate } from '@/lib/email/templates';
import { hasResendConfigured, sendNewsletterEmail } from '@/lib/email/resend';
import { readDemoStore, writeDemoStore } from '@/lib/demo-store';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await requireSession('admin');
  if (!session) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const newsletterId = typeof body?.newsletterId === 'string' ? body.newsletterId : '';
  if (!newsletterId) return NextResponse.json({ error: 'newsletterId is required.' }, { status: 400 });

  const supabase = createServerSupabaseClient();

  if (!supabase) {
    const store = await readDemoStore();
    const issue = store.newsletters.find((entry) => entry.id === newsletterId);
    if (!issue) return NextResponse.json({ error: 'Newsletter not found.' }, { status: 404 });
    issue.status = 'sent';
    await writeDemoStore(store);
    return NextResponse.json({ ok: true, mode: 'demo', message: 'Marked as sent in demo mode. Connect Resend + Supabase subscribers for live sends.' });
  }

  const { data: issue, error: issueError } = await supabase
    .from('newsletters')
    .select('id, title, slug, summary, body_content, subject_line')
    .eq('id', newsletterId)
    .maybeSingle();

  if (issueError || !issue) return NextResponse.json({ error: issueError?.message || 'Newsletter not found.' }, { status: 404 });

  const { data: subscribers, error: subsError } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('is_active', true)
    .limit(50);

  if (subsError) return NextResponse.json({ error: subsError.message }, { status: 500 });

  const emails = (subscribers || []).map((row: { email: string | null }) => row.email).filter(Boolean) as string[];
  if (emails.length === 0) return NextResponse.json({ ok: true, mode: 'preview', message: 'No active subscribers found yet.' });

  if (!hasResendConfigured()) {
    await supabase.from('newsletters').update({ status: 'sent' }).eq('id', newsletterId);
    return NextResponse.json({ ok: true, mode: 'preview', message: `Preview mode: found ${emails.length} active subscribers. Add RESEND_API_KEY and RESEND_FROM_EMAIL to send live.` });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/newsletter/${issue.slug}` : undefined;
  const result = await sendNewsletterEmail({
    to: emails,
    subject: issue.subject_line || issue.title,
    html: newsletterHtmlTemplate({ title: issue.title, summary: issue.summary || '', body: issue.body_content || '', siteUrl }),
    text: newsletterTextTemplate({ title: issue.title, summary: issue.summary || '', body: issue.body_content || '', siteUrl }),
  });

  if (!result.sent) return NextResponse.json({ error: result.error || 'Unable to send newsletter.' }, { status: 500 });

  await supabase.from('newsletters').update({ status: 'sent' }).eq('id', newsletterId);
  return NextResponse.json({ ok: true, mode: result.mode, message: `Newsletter sent to ${result.count} subscribers.` });
}
