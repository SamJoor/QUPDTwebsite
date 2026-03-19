import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { getAlumniProfiles } from "@/lib/queries/public";
import { AlumniDirectory } from "@/components/sections/alumni-directory";
import { CTASection } from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";

function isAllowedRole(role?: string | null) {
  return role === "active" || role === "alumni" || role === "admin";
}

export default async function AlumniPage() {
  const session = await getSessionUser();

  if (!session || !isAllowedRole(session.role)) {
    redirect("/active/login");
  }

  const profiles = await getAlumniProfiles();

  return (
    <>
      <PageHero
        eyebrow="Alumni Directory"
        title="A professional network rooted in brotherhood"
        description="This directory is limited to verified chapter members, alumni, and administrators so the network remains useful without exposing internal access publicly."
      />

      <SectionShell
        title="Search the network"
        description="Search by name, company, industry, class year, location, major, or mentor status. Sensitive contact details remain protected."
      >
        <AlumniDirectory profiles={profiles} />
      </SectionShell>

      <CTASection
        eyebrow="Protected Access"
        title="Keep the network useful while protecting internal data"
        description="The alumni directory is now restricted to authenticated active members, alumni, and admins. Public visitors are redirected to sign in."
        actions={
          <Button href="/contact" variant="secondary">
            Update your information
          </Button>
        }
      />
    </>
  );
}