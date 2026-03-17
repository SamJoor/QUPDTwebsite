import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getNewsletters } from '@/lib/queries/public';
import { NewsletterCard } from '@/components/cards/newsletter-card';
import { NewsletterSignupForm } from '@/components/forms/newsletter-signup-form';

export default async function NewsletterPage() {
  const issues = await getNewsletters();
  return (
    <>
      <PageHero
        eyebrow="Newsletter & Communication"
        title="A newsletter system built for credibility and long-term deliverability"
        description="This page now includes a real working signup form posting to an API route with validation, plus a usable archive structure for future issues."
      />
      <SectionShell title="Newsletter signup" description="The form is production-minded: validated, API-backed, and ready to connect to Supabase or Resend once your environment is set up.">
        <NewsletterSignupForm />
      </SectionShell>
      <SectionShell eyebrow="Archive" title="Recent issues" description="An archive reinforces chapter momentum and gives alumni a reason to return between major events.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue) => (
            <NewsletterCard key={issue.slug} issue={issue} />
          ))}
        </div>
      </SectionShell>
    </>
  );
}
