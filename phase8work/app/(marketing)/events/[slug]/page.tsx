import { notFound } from 'next/navigation';
import { getEventBySlug } from '@/lib/queries/public';
import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { RSVPForm } from '@/components/forms/rsvp-form';

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return notFound();

  return (
    <>
      <PageHero eyebrow="Event Detail" title={event.title} description={`${event.date} · ${event.time} · ${event.location}`} />
      <SectionShell title="About this event" description={event.description}>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="surface p-8">
            {event.audience ? <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">Audience: {event.audience}</p> : null}
            <div className="mt-5 space-y-4">
              {event.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            {event.tags?.length ? (
              <div className="mt-6 flex flex-wrap gap-2 text-sm text-fraternity-slate">
                {event.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-fraternity-parchment px-3 py-1.5">{tag}</span>
                ))}
              </div>
            ) : null}
            {event.schedule?.length ? (
              <div className="mt-8 rounded-3xl bg-fraternity-cream p-6">
                <h3 className="text-2xl">Event schedule</h3>
                <div className="mt-5 space-y-4">
                  {event.schedule.map((item) => (
                    <div key={item.time + item.label} className="flex items-start justify-between gap-4 border-b border-black/5 pb-4 last:border-b-0 last:pb-0">
                      <p className="min-w-28 font-semibold text-fraternity-charcoal">{item.time}</p>
                      <p className="flex-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <RSVPForm eventSlug={event.slug} eventTitle={event.title} />
        </div>
      </SectionShell>
    </>
  );
}
