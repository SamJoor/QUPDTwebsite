import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { OpportunityApplicationReviewForm } from "@/components/member/opportunity-application-review-form";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type OpportunityRow = {
  id: string;
  alumni_profile_id: string;
  title: string;
  slug: string | null;
  opportunity_type: string | null;
  company: string | null;
  location: string | null;
  description: string | null;
};

type ApplicationRow = {
  id: string;
  opportunity_id: string;
  alumni_profile_id: string;
  applicant_email: string;
  applicant_phone: string | null;
  major: string | null;
  graduation_year: number | null;
  linkedin_url: string | null;
  message: string | null;
  why_interested: string | null;
  experience_summary: string | null;
  preferred_contact_method: string | null;
  status: string | null;
  verification_status: string | null;
  resume_path: string | null;
  cover_letter_path: string | null;
  alumni_notes: string | null;
  created_at: string | null;
  alumni_profiles?: {
    full_name?: string | null;
  } | null;
};

function formatLabel(value?: string | null) {
  if (!value) return "—";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getReviewPageData(opportunityId: string) {
  const session = await requireSession("alumni");
  const supabase = createServerSupabaseClient();

  if (!session || !supabase) {
    return {
      error: !session
        ? "You must be logged in to review applications."
        : "Database connection unavailable.",
      opportunity: null as OpportunityRow | null,
      applications: [] as ApplicationRow[],
      resumeUrls: {} as Record<string, string>,
      coverLetterUrls: {} as Record<string, string>,
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
        "We could not connect this session to an alumni record. Make sure your portal email matches the alumni database.",
      opportunity: null as OpportunityRow | null,
      applications: [] as ApplicationRow[],
      resumeUrls: {} as Record<string, string>,
      coverLetterUrls: {} as Record<string, string>,
    };
  }

  const alumniProfileId = privateDetailsRes.data.alumni_profile_id;

  const opportunityRes = await supabase
    .from("mentorship_opportunities")
    .select(
      "id, alumni_profile_id, title, slug, opportunity_type, company, location, description"
    )
    .eq("id", opportunityId)
    .maybeSingle();

  if (opportunityRes.error) {
    return {
      error: opportunityRes.error.message,
      opportunity: null as OpportunityRow | null,
      applications: [] as ApplicationRow[],
      resumeUrls: {} as Record<string, string>,
      coverLetterUrls: {} as Record<string, string>,
    };
  }

  const opportunity = (opportunityRes.data as OpportunityRow | null) || null;

  if (!opportunity) {
    return {
      error: "Opportunity not found.",
      opportunity: null as OpportunityRow | null,
      applications: [] as ApplicationRow[],
      resumeUrls: {} as Record<string, string>,
      coverLetterUrls: {} as Record<string, string>,
    };
  }

  if (opportunity.alumni_profile_id !== alumniProfileId) {
    return {
      error: "You do not have access to review applications for this opportunity.",
      opportunity: null as OpportunityRow | null,
      applications: [] as ApplicationRow[],
      resumeUrls: {} as Record<string, string>,
      coverLetterUrls: {} as Record<string, string>,
    };
  }

  const applicationsRes = await supabase
    .from("mentorship_opportunity_applications")
    .select(`
      *,
      alumni_profiles (
        full_name
      )
    `)
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });

  if (applicationsRes.error) {
    return {
      error: applicationsRes.error.message,
      opportunity,
      applications: [] as ApplicationRow[],
      resumeUrls: {} as Record<string, string>,
      coverLetterUrls: {} as Record<string, string>,
    };
  }

  const applications = (applicationsRes.data || []) as ApplicationRow[];

  const resumeUrls: Record<string, string> = {};
  const coverLetterUrls: Record<string, string> = {};

  await Promise.all(
    applications.map(async (application) => {
      if (application.resume_path) {
        const signedResume = await supabase.storage
          .from("mentorship-applications")
          .createSignedUrl(application.resume_path, 60 * 30);

        if (!signedResume.error && signedResume.data?.signedUrl) {
          resumeUrls[application.id] = signedResume.data.signedUrl;
        }
      }

      if (application.cover_letter_path) {
        const signedCover = await supabase.storage
          .from("mentorship-applications")
          .createSignedUrl(application.cover_letter_path, 60 * 30);

        if (!signedCover.error && signedCover.data?.signedUrl) {
          coverLetterUrls[application.id] = signedCover.data.signedUrl;
        }
      }
    })
  );

  return {
    error: "",
    opportunity,
    applications,
    resumeUrls,
    coverLetterUrls,
  };
}

export default async function OpportunityApplicantsPage({ params }: PageProps) {
  const { id } = await params;
  const { error, opportunity, applications, resumeUrls, coverLetterUrls } =
    await getReviewPageData(id);

  if (!opportunity && error === "Opportunity not found.") {
    notFound();
  }

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Applicant review
        </p>
        <h1 className="mt-3 text-4xl">
          {opportunity ? opportunity.title : "Opportunity review"}
        </h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Review verified applications, open supporting materials, and accept or
          decline applicants with a message.
        </p>
      </div>

      {error ? (
        <div className="surface p-8">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      {opportunity ? (
        <div className="surface p-8">
          <h2 className="text-2xl">Opportunity summary</h2>
          <div className="mt-4 space-y-2 text-sm text-fraternity-slate">
            <p>
              {formatLabel(opportunity.opportunity_type)} · {opportunity.company || "—"} ·{" "}
              {opportunity.location || "—"}
            </p>
            <p>{opportunity.description || "No description provided."}</p>
          </div>
        </div>
      ) : null}

      <div className="surface p-8">
        <h2 className="text-2xl">Applications</h2>

        <div className="mt-6 space-y-6">
          {applications.length ? (
            applications.map((application) => (
              <div
                key={application.id}
                className="rounded-2xl border border-black/10 bg-white/70 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {application.alumni_profiles?.full_name || application.applicant_email}
                    </p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      Email: {application.applicant_email}
                    </p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      Status: {formatLabel(application.status)} · Verification:{" "}
                      {formatLabel(application.verification_status)}
                    </p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      Major: {application.major || "—"} · Graduation year:{" "}
                      {application.graduation_year || "—"}
                    </p>
                    {application.applicant_phone ? (
                      <p className="mt-1 text-sm text-fraternity-slate">
                        Phone: {application.applicant_phone}
                      </p>
                    ) : null}
                    {application.linkedin_url ? (
                      <p className="mt-1 text-sm text-fraternity-slate">
                        LinkedIn: {application.linkedin_url}
                      </p>
                    ) : null}
                    {application.preferred_contact_method ? (
                      <p className="mt-1 text-sm text-fraternity-slate">
                        Preferred contact: {application.preferred_contact_method}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm text-fraternity-slate">
                  <div>
                    <p className="font-semibold text-fraternity-charcoal">
                      Introductory message
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {application.message || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-fraternity-charcoal">
                      Why interested
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">
                      {application.why_interested || "—"}
                    </p>
                  </div>

                  {application.experience_summary ? (
                    <div>
                      <p className="font-semibold text-fraternity-charcoal">
                        Experience summary
                      </p>
                      <p className="mt-1 whitespace-pre-wrap">
                        {application.experience_summary}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {resumeUrls[application.id] ? (
                    <a
                      href={resumeUrls[application.id]}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
                    >
                      Open resume
                    </a>
                  ) : (
                    <span className="text-sm text-fraternity-slate">
                      Resume unavailable
                    </span>
                  )}

                  {coverLetterUrls[application.id] ? (
                    <a
                      href={coverLetterUrls[application.id]}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
                    >
                      Open cover letter
                    </a>
                  ) : (
                    <span className="text-sm text-fraternity-slate">
                      No cover letter
                    </span>
                  )}
                </div>

                <OpportunityApplicationReviewForm
                  applicationId={application.id}
                  initialNotes={application.alumni_notes}
                />
              </div>
            ))
          ) : (
            <p className="text-sm text-fraternity-slate">
              No applications have been submitted for this opportunity yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}