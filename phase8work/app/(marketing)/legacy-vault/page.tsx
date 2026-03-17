import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getLegacyVaultItems } from '@/lib/queries/public';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';

export default async function LegacyVaultPage() {
  const items = await getLegacyVaultItems();
  return (
    <>
      <PageHero
        eyebrow="Legacy Vault"
        title="Preserve the chapter memory with dignity and depth"
        description="The archive is now structured as a real content experience with categorized legacy items and future-ready contribution pathways."
      />
      <SectionShell title="Featured archive categories" description="Use structured records so every upload or memory has a title, type, era, contributor, and description.">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="surface p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">{item.type}</p>
              <h3 className="mt-3 text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm font-medium text-fraternity-charcoal">{item.era}</p>
              <p className="mt-4">{item.description}</p>
            </div>
          ))}
        </div>
      </SectionShell>
      <CTASection
        eyebrow="Contribute to the archive"
        title="Invite alumni to help preserve the chapter story"
        description="The next build can connect this to Supabase storage and a moderation queue for photos, scanned letters, memories, and reunion media."
        actions={<Button href="/contact" variant="secondary">Submit a memory or artifact</Button>}
      />
    </>
  );
}
