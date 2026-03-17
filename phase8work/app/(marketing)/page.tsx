import { PageHero } from '@/components/sections/page-hero';
import { Button } from '@/components/ui/button';
import { SectionShell } from '@/components/sections/section-shell';
import { chapterStats, alumniSpotlight, events, newsletters, values } from '@/lib/constants/site';
import { StatCard } from '@/components/cards/stat-card';
import { ValueCard } from '@/components/cards/value-card';
import { EventCard } from '@/components/cards/event-card';
import { NewsletterCard } from '@/components/cards/newsletter-card';
import { SpotlightCard } from '@/components/cards/spotlight-card';
import { Container } from '@/components/layout/container';
import { CTASection } from '@/components/sections/cta-section';
import { getHomePageContent } from '@/lib/queries/content';

export default async function HomePage() {
  const content = await getHomePageContent();

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
        actions={
          <>
            <Button href="/contact">Join the Alumni Network</Button>
            <Button href="/events" variant="secondary">View Events</Button>
            <Button href="/mentorship" variant="ghost">Become a Mentor</Button>
          </>
        }
      />

      <SectionShell
        eyebrow={content.missionEyebrow}
        title={content.missionTitle}
        description={content.missionDescription}
      >
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <ValueCard key={value.title} title={value.title} description={value.description} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.statsEyebrow}
        title={content.statsTitle}
        description={content.statsDescription}
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {chapterStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.eventsEyebrow}
        title={content.eventsTitle}
        description={content.eventsDescription}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.slug} event={event} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.newsletterEyebrow}
        title={content.newsletterTitle}
        description={content.newsletterDescription}
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {newsletters.map((issue) => (
            <NewsletterCard key={issue.slug} issue={issue} />
          ))}
        </div>
      </SectionShell>

      <SectionShell
        eyebrow={content.spotlightEyebrow}
        title={content.spotlightTitle}
        description={content.spotlightDescription}
      >
        <SpotlightCard spotlight={alumniSpotlight} />
      </SectionShell>

      <section className="section-padding pt-0">
        <Container>
          <div className="surface grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">{content.legacyEyebrow}</p>
              <h2 className="mt-3 text-3xl md:text-4xl">{content.legacyTitle}</h2>
              <p className="mt-4 max-w-2xl text-lg">{content.legacyDescription}</p>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <Button href="/legacy-vault">Explore the Legacy Vault</Button>
            </div>
          </div>
        </Container>
      </section>

      <CTASection
        eyebrow={content.finalCtaEyebrow}
        title={content.finalCtaTitle}
        description={content.finalCtaDescription}
        actions={
          <>
            <Button href="/contact" variant="secondary">Stay connected</Button>
            <Button href="/mentorship">Become a mentor</Button>
          </>
        }
      />
    </>
  );
}
