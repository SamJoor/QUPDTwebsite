import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { timeline } from '@/lib/constants/site';
import { TimelineItem } from '@/components/cards/timeline-item';
import { getAboutPageContent } from '@/lib/queries/content';

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <>
      <PageHero
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroDescription}
      />
      <SectionShell title={content.overviewTitle} description={content.overviewDescription}>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface p-8">
            <p>{content.overviewBody}</p>
            <p className="mt-4">{content.overviewBodySecondary}</p>
          </div>
          <div className="surface p-8">
            <h3 className="text-2xl">{content.themesTitle}</h3>
            <div className="mt-5 space-y-4 text-sm text-fraternity-slate">
              <p><span className="font-semibold text-fraternity-charcoal">{content.themeOneTitle}:</span> {content.themeOneDescription}</p>
              <p><span className="font-semibold text-fraternity-charcoal">{content.themeTwoTitle}:</span> {content.themeTwoDescription}</p>
              <p><span className="font-semibold text-fraternity-charcoal">{content.themeThreeTitle}:</span> {content.themeThreeDescription}</p>
            </div>
          </div>
        </div>
      </SectionShell>
      <SectionShell eyebrow={content.timelineEyebrow} title={content.timelineTitle} description={content.timelineDescription}>
        <div className="grid gap-8">
          {timeline.map((item) => (
            <TimelineItem key={item.year + item.title} item={item} />
          ))}
        </div>
      </SectionShell>
    </>
  );
}
