import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type ApplicationRow = {
  id: string;
  opportunity_id: string;
  alumni_profile_id: string;
  applicant_email: string;
  major: string | null;
  graduation_year: number | null;
  status: string | null;
  verification_status: string | null;
  why_interested: string | null;
  alumni_notes: string | null;
  created_at: string | null;
};

type OpportunityRow = {
  id: string;
  title: string;
  slug: string | null;
  company: string | null;
  location: string | null;
  opportunity_type: string | null;
};

function formatLabel(value?: string | null) {
  if (!value) return "—";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getCurrentActiveApplications() {
  const session = await requireSession("active");
  const supabase = createServerSupabaseClient();

  if (!session || !supabase) {
    return {
      error: !session
        ? "You must be logged in to view your applications."
        : "Database connection unavailable.",
      applications: [] as (ApplicationRow & { opportunity: OpportunityRow | null })[],
    };
  }

  const privateDetailsRes = await supabase
    .from("alumni_private_details")
    .select("alumni_profile_id")
    .eq("email", session.email)
    .maybeSingle();

  if (privateDetailsRes.error || !privateDetailsRes.data?.alumni_profile_id) {
    return {
      error:
        "We could not connect this session to an active-member record.",
      applications: [] as (ApplicationRow & { opportunity: OpportunityRow | null })[],
    };
  }

  const alumniProfileId = privateDetailsRes.data.alumni_profile_id;

  const applicationsRes = await supabase
    .from("mentorship_opportunity_applications")
    .select(
      "id, opportunity_id, alumni_profile_id, applicant_email, major, graduation_year, status, verification_status, why_interested, alumni_notes, created_at"
    )
    .eq("alumni_profile_id", alumniProfileId)
    .order("created_at", { ascending: false });

  if (applicationsRes.error) {
    return {
      error: applicationsRes.error.message,
      applications: [] as (ApplicationRow & { opportunity: OpportunityRow | null })[],
    };
  }

  const applications = (applicationsRes.data || []) as ApplicationRow[];

  const opportunityIds = applications.map((app) => app.opportunity_id).filter(Boolean);

  let opportunitiesById: Record<string, OpportunityRow> = {};

  if (opportunityIds.length) {
    const opportunitiesRes = await supabase
      .from("mentorship_opportunities")
      .select("id, title, slug, company, location, opportunity_type")
      .in("id", opportunityIds);

    if (!opportunitiesRes.error) {
      opportunitiesById = Object.fromEntries(
        ((opportunitiesRes.data || []) as OpportunityRow[]).map((opp) => [opp.id, opp])
      );
    }
  }

  return {
    error: "",
    applications: applications.map((application) => ({
      ...application,
      opportunity: opportunitiesById[application.opportunity_id] || null,
    })),
  };
}

export default async function ActiveApplicationsPage() {
  const { error, applications } = await getCurrentActiveApplications();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Applications
        </p>
        <h1 className="mt-3 text-4xl">My applications</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Track the status of your submitted mentorship and internship
          applications and review any messages from the alumni reviewer.
        </p>
      </div>

      {error ? (
        <div className="surface p-8">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      <div className="surface p-8">
        <div className="mt-2 space-y-4">
          {applications.length ? (
            applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl border border-black/10 bg-white/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {application.opportunity?.title || "Opportunity"}
                    </p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      {formatLabel(application.opportunity?.opportunity_type)} ·{" "}
                      {application.opportunity?.company || "—"} ·{" "}
                      {application.opportunity?.location || "—"}
                    </p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      Status: {formatLabel(application.status)} · Verification:{" "}
                      {formatLabel(application.verification_status)}
                    </p>
                  </div>

                  {application.opportunity ? (
                    <Link
                      href={`/mentorship/${application.opportunity.slug || application.opportunity.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-fraternity-charcoal/15 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
                    >
                      View opportunity
                    </Link>
                  ) : null}
                </div>

                <div className="mt-4 space-y-3 text-sm text-fraternity-slate">
                  <div>
                    <p className="font-semibold text-fraternity-charcoal">
                      Why you were interested
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {application.why_interested || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-fraternity-charcoal">
                      Alumni message
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {application.alumni_notes ||
                        "No follow-up message has been added yet."}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-fraternity-slate">
              You have not submitted any mentorship applications yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}