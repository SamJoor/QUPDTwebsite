import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getMentorshipOpportunityBySlug,
  type MentorshipOpportunityRecord,
} from "@/lib/queries/mentorship-opportunities";
import { MentorshipOpportunityApplicationForm } from "@/components/forms/mentorship-opportunity-application-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ApplicantDefaults = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  graduationYear?: number;
  major?: string;
  linkedinUrl?: string;
  bondNumber?: string;
};

function formatLabel(value?: string | null) {
  if (!value) return "—";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function splitFullName(fullName?: string | null) {
  const value = (fullName || "").trim();
  if (!value) return { firstName: "", lastName: "" };

  const parts = value.split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

async function getApplicantDefaults(email: string): Promise<ApplicantDefaults> {
  const supabase = createServerSupabaseClient();
  if (!supabase) return {};

  const privateRes = await supabase
    .from("alumni_private_details")
    .select("email, phone, bond_number, alumni_profile_id")
    .eq("email", email)
    .maybeSingle();

  if (privateRes.error || !privateRes.data?.alumni_profile_id) {
    return { email };
  }

  const profileRes = await supabase
    .from("alumni_profiles")
    .select("full_name, graduation_year, major, linkedin")
    .eq("id", privateRes.data.alumni_profile_id)
    .maybeSingle();

  const profile = profileRes.data as
    | {
        full_name?: string | null;
        graduation_year?: number | null;
        major?: string | null;
        linkedin?: string | null;
      }
    | null;

  const { firstName, lastName } = splitFullName(profile?.full_name);

  return {
    firstName,
    lastName,
    email: privateRes.data.email || email,
    phone: privateRes.data.phone || "",
    graduationYear: profile?.graduation_year || undefined,
    major: profile?.major || "",
    linkedinUrl: profile?.linkedin || "",
    bondNumber: privateRes.data.bond_number || "",
  };
}

function SummaryCard({
  opportunity,
}: {
  opportunity: MentorshipOpportunityRecord;
}) {
  return (
    <div className="surface p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
        Opportunity summary
      </p>
      <h2 className="mt-3 text-2xl">{opportunity.title}</h2>

      <div className="mt-5 space-y-2 text-sm text-fraternity-slate">
        <p>
          <span className="font-semibold text-fraternity-charcoal">Type:</span>{" "}
          {formatLabel(opportunity.opportunity_type)}
        </p>
        <p>
          <span className="font-semibold text-fraternity-charcoal">Company:</span>{" "}
          {opportunity.company || "Phi Delta Theta Alumni Opportunity"}
        </p>
        <p>
          <span className="font-semibold text-fraternity-charcoal">Location:</span>{" "}
          {opportunity.location || "—"}
        </p>
        <p>
          <span className="font-semibold text-fraternity-charcoal">Industry:</span>{" "}
          {opportunity.industry || "—"}
        </p>
        <p>
          <span className="font-semibold text-fraternity-charcoal">
            Preferred major:
          </span>{" "}
          {opportunity.preferred_major || "—"}
        </p>
      </div>

      <p className="mt-6 text-fraternity-slate">{opportunity.description}</p>

      <div className="mt-6">
        <Link
          href={`/mentorship/${opportunity.slug || opportunity.id}`}
          className="text-sm font-semibold text-fraternity-burgundy hover:opacity-80"
        >
          View full opportunity details
        </Link>
      </div>
    </div>
  );
}

export default async function MentorshipOpportunityApplyPage({
  params,
}: PageProps) {
  const session = await requireSession("active");

  if (!session) {
    redirect("/active/login");
  }

  const { slug } = await params;
  const opportunity = await getMentorshipOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  const applicantDefaults = await getApplicantDefaults(session.email);

  return (
    <>
      <PageHero
        eyebrow="Apply"
        title={`Apply for ${opportunity.title}`}
        description="Applications are restricted to verified active members. Your submission is checked against fraternity records before it is accepted."
      />

      <SectionShell
        title="Application"
        description="Your profile information has been prefilled from your active-member record where available."
      >
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <SummaryCard opportunity={opportunity} />
          <MentorshipOpportunityApplicationForm
            opportunity={opportunity}
            defaults={applicantDefaults}
          />
        </div>
      </SectionShell>
    </>
  );
}