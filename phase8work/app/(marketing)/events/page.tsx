import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getEvents } from '@/lib/queries/public';
import { EventCard } from '@/components/cards/event-card';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';

export default async function EventsPage() {
  const allEvents = await getEvents();
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Build recurring reasons for alumni to return"
        description="This section is now structured like a real event program: featured programming, upcoming events, detail pages, and RSVP-ready forms."
      />
      <SectionShell title="Featured this season" description="Lead with one flagship gathering and support it with the broader annual rhythm of chapter events.">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr_1fr]">
          {allEvents.map((event, index) => (
            <div key={event.slug} className={index === 0 ? 'lg:col-span-1' : ''}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </SectionShell>
      <SectionShell eyebrow="Programming Strategy" title="A strong alumni calendar balances tradition, utility, and energy" description="Banquets and reunions build legacy, while career nights, games, and casual summer events keep the relationship active throughout the year.">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Signature Traditions', 'Founders Day, alumni weekend, and chapter anniversaries create emotional gravity and should be treated as premium annual anchor events.'],
            ['Professional Engagement', 'Career nights and mentorship programs convert alumni goodwill into direct student value and long-term chapter relevance.'],
            ['Social Return Points', 'Golf outings, game nights, and tailgates keep the network warm between formal updates and make re-entry easier for alumni.']
          ].map(([title, copy]) => (
            <div key={title} className="surface p-6">
              <h3 className="text-2xl">{title}</h3>
              <p className="mt-4">{copy}</p>
            </div>
          ))}
        </div>
      </SectionShell>
      <CTASection
        eyebrow="Need a new gathering idea?"
        title="Invite alumni to help shape the event calendar"
        description="This is a good place to later add an event suggestion form, sponsor interest workflow, or alumni-hosted regional gathering intake."
        actions={<Button href="/contact" variant="secondary">Suggest an event</Button>}
      />
    </>
  );
}
