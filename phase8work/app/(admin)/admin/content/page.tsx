import { ApiForm } from '@/components/forms/api-form';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getAboutPageContent, getHomePageContent } from '@/lib/queries/content';

export default async function ContentAdminPage() {
  const [home, about] = await Promise.all([getHomePageContent(), getAboutPageContent()]);

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl">Site content management</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">Phase 8 lets officers update core Home and About page copy without opening code files. Content saves either to Supabase or the local demo store depending on your environment.</p>
      </div>

      <ApiForm title="Home page copy" description="Update hero language, section intros, and the final call to action." endpoint="/api/admin/content/home" successMessage="Home page content saved." submitLabel="Save home page">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Hero eyebrow"><Input name="heroEyebrow" defaultValue={home.heroEyebrow} required /></Field>
          <Field label="Hero title"><Input name="heroTitle" defaultValue={home.heroTitle} required /></Field>
        </div>
        <Field label="Hero description"><Textarea name="heroDescription" rows={3} defaultValue={home.heroDescription} required /></Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Mission eyebrow"><Input name="missionEyebrow" defaultValue={home.missionEyebrow} required /></Field>
          <Field label="Mission title"><Input name="missionTitle" defaultValue={home.missionTitle} required /></Field>
        </div>
        <Field label="Mission description"><Textarea name="missionDescription" rows={3} defaultValue={home.missionDescription} required /></Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Stats title"><Input name="statsTitle" defaultValue={home.statsTitle} required /></Field>
          <Field label="Events title"><Input name="eventsTitle" defaultValue={home.eventsTitle} required /></Field>
          <Field label="Newsletter title"><Input name="newsletterTitle" defaultValue={home.newsletterTitle} required /></Field>
          <Field label="Spotlight title"><Input name="spotlightTitle" defaultValue={home.spotlightTitle} required /></Field>
          <Field label="Legacy eyebrow"><Input name="legacyEyebrow" defaultValue={home.legacyEyebrow} required /></Field>
          <Field label="Legacy title"><Input name="legacyTitle" defaultValue={home.legacyTitle} required /></Field>
          <Field label="Final CTA eyebrow"><Input name="finalCtaEyebrow" defaultValue={home.finalCtaEyebrow} required /></Field>
          <Field label="Final CTA title"><Input name="finalCtaTitle" defaultValue={home.finalCtaTitle} required /></Field>
          <input type="hidden" name="valuesEyebrow" defaultValue={home.valuesEyebrow} />
          <input type="hidden" name="valuesTitle" defaultValue={home.valuesTitle} />
          <input type="hidden" name="valuesDescription" defaultValue={home.valuesDescription} />
          <input type="hidden" name="statsEyebrow" defaultValue={home.statsEyebrow} />
          <input type="hidden" name="eventsEyebrow" defaultValue={home.eventsEyebrow} />
          <input type="hidden" name="newsletterEyebrow" defaultValue={home.newsletterEyebrow} />
          <input type="hidden" name="spotlightEyebrow" defaultValue={home.spotlightEyebrow} />
        </div>
        <Field label="Stats description"><Textarea name="statsDescription" rows={3} defaultValue={home.statsDescription} required /></Field>
        <Field label="Events description"><Textarea name="eventsDescription" rows={3} defaultValue={home.eventsDescription} required /></Field>
        <Field label="Newsletter description"><Textarea name="newsletterDescription" rows={3} defaultValue={home.newsletterDescription} required /></Field>
        <Field label="Spotlight description"><Textarea name="spotlightDescription" rows={3} defaultValue={home.spotlightDescription} required /></Field>
        <Field label="Legacy description"><Textarea name="legacyDescription" rows={3} defaultValue={home.legacyDescription} required /></Field>
        <Field label="Final CTA description"><Textarea name="finalCtaDescription" rows={3} defaultValue={home.finalCtaDescription} required /></Field>
      </ApiForm>

      <ApiForm title="About page copy" description="Manage the chapter overview, core themes, and timeline intro copy." endpoint="/api/admin/content/about" successMessage="About page content saved." submitLabel="Save about page">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Hero eyebrow"><Input name="heroEyebrow" defaultValue={about.heroEyebrow} required /></Field>
          <Field label="Hero title"><Input name="heroTitle" defaultValue={about.heroTitle} required /></Field>
          <Field label="Overview title"><Input name="overviewTitle" defaultValue={about.overviewTitle} required /></Field>
          <Field label="Themes title"><Input name="themesTitle" defaultValue={about.themesTitle} required /></Field>
          <Field label="Timeline eyebrow"><Input name="timelineEyebrow" defaultValue={about.timelineEyebrow} required /></Field>
          <Field label="Timeline title"><Input name="timelineTitle" defaultValue={about.timelineTitle} required /></Field>
        </div>
        <Field label="Hero description"><Textarea name="heroDescription" rows={3} defaultValue={about.heroDescription} required /></Field>
        <Field label="Overview description"><Textarea name="overviewDescription" rows={3} defaultValue={about.overviewDescription} required /></Field>
        <Field label="Overview body"><Textarea name="overviewBody" rows={4} defaultValue={about.overviewBody} required /></Field>
        <Field label="Overview secondary body"><Textarea name="overviewBodySecondary" rows={4} defaultValue={about.overviewBodySecondary} required /></Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Theme one title"><Input name="themeOneTitle" defaultValue={about.themeOneTitle} required /></Field>
          <Field label="Theme two title"><Input name="themeTwoTitle" defaultValue={about.themeTwoTitle} required /></Field>
          <Field label="Theme three title"><Input name="themeThreeTitle" defaultValue={about.themeThreeTitle} required /></Field>
        </div>
        <Field label="Theme one description"><Textarea name="themeOneDescription" rows={2} defaultValue={about.themeOneDescription} required /></Field>
        <Field label="Theme two description"><Textarea name="themeTwoDescription" rows={2} defaultValue={about.themeTwoDescription} required /></Field>
        <Field label="Theme three description"><Textarea name="themeThreeDescription" rows={2} defaultValue={about.themeThreeDescription} required /></Field>
        <Field label="Timeline description"><Textarea name="timelineDescription" rows={3} defaultValue={about.timelineDescription} required /></Field>
      </ApiForm>
    </div>
  );
}
