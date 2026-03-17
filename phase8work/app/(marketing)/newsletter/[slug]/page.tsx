import { notFound } from 'next/navigation';
import { getNewsletterBySlug } from '@/lib/queries/public';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';

export default async function NewsletterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const issue = await getNewsletterBySlug(slug);

  if (!issue) return notFound();

  return (
    <>
      <PageHero eyebrow={issue.category} title={issue.title} description={issue.date} />
      <SectionShell title="Issue summary" description={issue.excerpt}>
        <div className="surface p-8">
          <div className="space-y-4">
            {issue.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </SectionShell>
    </>
  );
}
