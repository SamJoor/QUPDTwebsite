import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/sections/page-hero";
import { SectionShell } from "@/components/sections/section-shell";
import { getMentorshipOpportunityBySlug } from "@/lib/queries/mentorship-opportunities";

export const dynamic = "force-dynamic";

function formatLabel(value?: string | null) {
  if (!value) return "—";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function MentorshipOpportunityDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  const opportunity = await getMentorshipOpportunityBySlug(slug);

  if (!opportunity) {
    notFound();
  }

  return (
    <>
      <PageHero
        eyebrow="Opportunity"
        title={opportunity.title}
        description={
          opportunity.description ||
          "Learn more about this alumni-posted mentorship opportunity."
        }
      />

      <SectionShell
        title="Opportunity details"
        description="Review the opportunity carefully before applying."
      >
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="surface p-8">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-fraternity-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">
                {formatLabel(opportunity.opportunity_type)}
              </span>

              {opportunity.location_type ? (
                <span className="rounded-full border border-fraternity-charcoal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-slate">
                  {formatLabel(opportunity.location_type)}
                </span>
              ) : null}

              {opportunity.is_paid ? (
                <span className="rounded-full border border-fraternity-charcoal/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-slate">
                  Paid
                </span>
              ) : null}
            </div>

            <div className="mt-6 space-y-3 text-fraternity-slate">
              <p>
                <span className="font-semibold text-fraternity-charcoal">
                  Company:
                </span>{" "}
                {opportunity.company || "Phi Delta Theta Alumni Opportunity"}
              </p>
              <p>
                <span className="font-semibold text-fraternity-charcoal">
                  Location:
                </span>{" "}
                {opportunity.location || "—"}
              </p>
              <p>
                <span className="font-semibold text-fraternity-charcoal">
                  Industry:
                </span>{" "}
                {opportunity.industry || "—"}
              </p>
              <p>
                <span className="font-semibold text-fraternity-charcoal">
                  Preferred major:
                </span>{" "}
                {opportunity.preferred_major || "—"}
              </p>
              <p>
                <span className="font-semibold text-fraternity-charcoal">
                  Preferred class years:
                </span>{" "}
                {opportunity.preferred_years || "—"}
              </p>
              <p>
                <span className="font-semibold text-fraternity-charcoal">
                  Contact method:
                </span>{" "}
                {opportunity.contact_method || "—"}
              </p>
              {opportunity.compensation ? (
                <p>
                  <span className="font-semibold text-fraternity-charcoal">
                    Compensation:
                  </span>{" "}
                  {opportunity.compensation}
                </p>
              ) : null}
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <h2 className="text-2xl">Description</h2>
                <p className="mt-3 whitespace-pre-wrap text-fraternity-slate">
                  {opportunity.description}
                </p>
              </div>

              {opportunity.responsibilities ? (
                <div>
                  <h2 className="text-2xl">Responsibilities</h2>
                  <p className="mt-3 whitespace-pre-wrap text-fraternity-slate">
                    {opportunity.responsibilities}
                  </p>
                </div>
              ) : null}

              {opportunity.requirements ? (
                <div>
                  <h2 className="text-2xl">Requirements</h2>
                  <p className="mt-3 whitespace-pre-wrap text-fraternity-slate">
                    {opportunity.requirements}
                  </p>
                </div>
              ) : null}

              {opportunity.preferred_skills ? (
                <div>
                  <h2 className="text-2xl">Preferred skills</h2>
                  <p className="mt-3 whitespace-pre-wrap text-fraternity-slate">
                    {opportunity.preferred_skills}
                  </p>
                </div>
              ) : null}

              {opportunity.application_instructions ? (
                <div>
                  <h2 className="text-2xl">Application instructions</h2>
                  <p className="mt-3 whitespace-pre-wrap text-fraternity-slate">
                    {opportunity.application_instructions}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          <aside className="surface h-fit p-8">
            <h2 className="text-2xl">Apply</h2>
            <p className="mt-3 text-fraternity-slate">
              Active members can apply using verified fraternity information,
              including bond number and matching contact details.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href={`/mentorship/${opportunity.slug || opportunity.id}/apply`}
                className="inline-flex items-center justify-center rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Apply now
              </Link>

              <Link
                href="/mentorship"
                className="inline-flex items-center justify-center rounded-full border border-fraternity-charcoal/15 bg-white px-5 py-3 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
              >
                Back to opportunities
              </Link>
            </div>
          </aside>
        </div>
      </SectionShell>
    </>
  );
}