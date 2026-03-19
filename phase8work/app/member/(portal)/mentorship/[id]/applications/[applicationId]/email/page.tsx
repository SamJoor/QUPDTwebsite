import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MentorshipEmailComposer } from "@/components/member/mentorship-email-composer";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
    applicationId: string;
  }>;
};

async function getComposeEmailData(
  opportunityId: string,
  applicationId: string
) {
  const session = await requireSession("alumni");
  const supabase = createServerSupabaseClient();

  if (!session || !supabase) {
    return {
      error: !session
        ? "You must be logged in to access this page."
        : "Database connection unavailable.",
      record: null as null | {
        applicationId: string;
        applicantEmail: string;
        applicantName: string | null;
        opportunityId: string;
        opportunityTitle: string;
        company: string | null;
        alumniNotes: string | null;
        reviewerName: string | null;
        reviewerEmail: string;
      },
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
      record: null,
    };
  }

  const alumniProfileId = privateDetailsRes.data.alumni_profile_id;

  const applicationRes = await supabase
    .from("mentorship_opportunity_applications")
    .select(`
      id,
      opportunity_id,
      applicant_email,
      alumni_notes,
      alumni_profiles (
        full_name
      )
    `)
    .eq("id", applicationId)
    .eq("opportunity_id", opportunityId)
    .maybeSingle();

  if (applicationRes.error || !applicationRes.data?.id) {
    return {
      error: "Application not found.",
      record: null,
    };
  }

  const application = applicationRes.data as {
    id: string;
    opportunity_id: string;
    applicant_email: string;
    alumni_notes: string | null;
    alumni_profiles?: {
      full_name?: string | null;
    } | null;
  };

  const opportunityRes = await supabase
    .from("mentorship_opportunities")
    .select("id, alumni_profile_id, title, company")
    .eq("id", opportunityId)
    .maybeSingle();

  if (opportunityRes.error || !opportunityRes.data?.id) {
    return {
      error: "Opportunity not found.",
      record: null,
    };
  }

  const opportunity = opportunityRes.data as {
    id: string;
    alumni_profile_id: string;
    title: string;
    company: string | null;
  };

  if (opportunity.alumni_profile_id !== alumniProfileId) {
    return {
      error: "You do not have access to this application.",
      record: null,
    };
  }

  const reviewerRes = await supabase
    .from("alumni_profiles")
    .select("full_name")
    .eq("id", alumniProfileId)
    .maybeSingle();

  const reviewerName =
    (reviewerRes.data as { full_name?: string | null } | null)?.full_name ||
    null;

  return {
    error: "",
    record: {
      applicationId: application.id,
      applicantEmail: application.applicant_email,
      applicantName: application.alumni_profiles?.full_name || null,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      company: opportunity.company,
      alumniNotes: application.alumni_notes,
      reviewerName,
      reviewerEmail: session.email,
    },
  };
}

export default async function MentorshipApplicationEmailPage({
  params,
}: PageProps) {
  const { id, applicationId } = await params;
  const { error, record } = await getComposeEmailData(id, applicationId);

  if (!record && error === "Application not found.") {
    notFound();
  }

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Mentorship outreach
        </p>
        <h1 className="mt-3 text-4xl">Compose acceptance email</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Edit the message below, then open your default email app to send it
          from your own email address.
        </p>
      </div>

      {error ? (
        <div className="surface p-8">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      {record ? (
        <MentorshipEmailComposer
          applicantEmail={record.applicantEmail}
          applicantName={record.applicantName}
          opportunityId={record.opportunityId}
          opportunityTitle={record.opportunityTitle}
          company={record.company}
          alumniNotes={record.alumniNotes}
          reviewerName={record.reviewerName}
          reviewerEmail={record.reviewerEmail}
        />
      ) : null}
    </div>
  );
}