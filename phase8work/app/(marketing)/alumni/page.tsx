import { PageHero } from '@/components/sections/page-hero';
import { SectionShell } from '@/components/sections/section-shell';
import { getAlumniProfiles } from '@/lib/queries/public';
import { AlumniDirectory } from '@/components/sections/alumni-directory';
import { CTASection } from '@/components/sections/cta-section';
import { Button } from '@/components/ui/button';

export default async function AlumniPage() {
  const profiles = await getAlumniProfiles();
  return (
    <>
      <PageHero
        eyebrow="Alumni Directory"
        title="A professional network rooted in brotherhood"
        description="This directory now includes working client-side search and filter functionality so it behaves like a real alumni network immediately, even before Supabase is connected."
      />
      <SectionShell title="Search the network" description="Search by name, company, industry, class year, location, major, or mentor status. Public-facing fields remain intentionally limited.">
        <AlumniDirectory profiles={profiles} />
      </SectionShell>
      <CTASection
        eyebrow="Privacy by Design"
        title="Keep sensitive contact details protected by default"
        description="In production, public cards should remain limited while email, phone, and editable profile settings stay behind authenticated alumni or admin access."
        actions={<Button href="/contact" variant="secondary">Update your information</Button>}
      />
    </>
  );
}
