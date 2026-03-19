import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { alumniProfiles } from "@/lib/constants/site";
import { ProfileCard } from "@/components/cards/profile-card";
import { MentorSignupForm } from "@/components/forms/mentor-signup-form";
import { MenteeRequestForm } from "@/components/forms/mentee-request-form";
import { getPublicMentorshipOpportunities } from "@/lib/queries/mentorship-opportunities";

export const dynamic = "force-dynamic";

function formatOpportunityType(value?: string | null) {
  if (!value) return "Opportunity";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function MentorshipPage() {
  const mentors = alumniProfiles.filter((profile) => profile.mentor);
  const opportunities = await getPublicMentorshipOpportunities();

  return (
    <>
      <PageHero
        eyebrow="Mentorship"
        title="Connect alumni experience with the next generation of brothers"
        description="Brothers can connect through one-on-one mentorship, career conversations, and alumni-posted opportunities including internships, office hours, and professional guidance."
      />

      <SectionShell
        eyebrow="Live opportunities"
        title="Explore alumni-posted mentorship and internship opportunities"
        description="Verified alumni can post real mentorship and internship opportunities through the alumni portal. Active members can apply with verified profile information and supporting materials."
      >
        {opportunities.length ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {opportunities.map((opportunity) => (
              <article
                key={opportunity.id}
                className="surface flex h-full flex-col p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-fraternity-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">
                    {formatOpportunityType(opportunity.opportunity_type)}
                  </span>
                  {opportunity.location_type ? (
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-fraternity-slate">
                      {formatOpportunityType(opportunity.location_type)}
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-4 text-2xl">{opportunity.title}</h3>

                <div className="mt-3 space-y-1 text-sm text-fraternity-slate">
                  <p>
                    {opportunity.company || "Phi Delta Theta Alumni Opportunity"}
                    {opportunity.location ? ` · ${opportunity.location}` : ""}
                  </p>
                  <p>
                    Industry: {opportunity.industry || "—"}
                    {opportunity.preferred_major
                      ? ` · Preferred major: ${opportunity.preferred_major}`
                      : ""}
                  </p>
                  {opportunity.preferred_years ? (
                    <p>Preferred class years: {opportunity.preferred_years}</p>
                  ) : null}
                </div>

                <p className="mt-4 text-fraternity-slate">
                  {opportunity.description}
                </p>

                {opportunity.requirements ? (
                  <p className="mt-4 text-sm text-fraternity-slate">
                    <span className="font-semibold text-fraternity-charcoal">
                      Requirements:
                    </span>{" "}
                    {opportunity.requirements}
                  </p>
                ) : null}

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/mentorship/${opportunity.slug || opportunity.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View details
                  </Link>
                  <Link
                    href={`/mentorship/${opportunity.slug || opportunity.id}/apply`}
                    className="inline-flex items-center justify-center rounded-full border border-fraternity-charcoal/15 bg-white px-5 py-3 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
                  >
                    Apply now
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="surface p-8">
            <p className="text-fraternity-slate">
              No live opportunities are posted yet. Alumni can create new mentorship or internship opportunities from the alumni portal.
            </p>
          </div>
        )}
      </SectionShell>

      <SectionShell
        title="Mentor spotlights"
        description="Highlight willing alumni so the program feels active and credible from the first launch."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mentors.map((profile) => (
            <ProfileCard key={profile.name} profile={profile} />
          ))}
        </div>
      </SectionShell>
    </>
  );
}