import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { ContactForm } from '@/components/forms/contact-form';

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & Get Involved"
        title="Create a clear path back into the chapter"
        description="This page now includes a real validated contact form so alumni interest, volunteer outreach, and update requests can flow through one dependable intake point."
      />
      <SectionShell title="Reconnect with the chapter" description="Use this form as the central intake for alumni reconnection, chapter support, event ideas, and story submissions.">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ContactForm />
          <div className="surface p-6 md:p-8">
            <h3 className="text-2xl">Recommended follow-up workflow</h3>
            <div className="mt-5 space-y-4 text-sm text-fraternity-slate">
              <p><span className="font-semibold text-fraternity-charcoal">Directory updates:</span> Route to alumni chair or secretary for record review.</p>
              <p><span className="font-semibold text-fraternity-charcoal">Mentor interest:</span> Route to mentorship lead or alumni engagement officer.</p>
              <p><span className="font-semibold text-fraternity-charcoal">Legacy contributions:</span> Route to historian, webmaster, or chapter archivist.</p>
              <p><span className="font-semibold text-fraternity-charcoal">Donation/support:</span> Route to alumni board or fundraising lead once giving workflows are ready.</p>
            </div>
          </div>
        </div>
      </SectionShell>
    </>
  );
}
