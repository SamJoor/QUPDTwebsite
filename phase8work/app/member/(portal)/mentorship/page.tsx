import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MentorshipOpportunityForm } from "@/components/forms/mentorship-opportunity-form";

export const dynamic = "force-dynamic";

type OpportunityRow = {
  id: string;
  title: string;
  slug: string | null;
  opportunity_type: string;
  company: string | null;
  location: string | null;
  is_active: boolean | null;
  is_public: boolean | null;
  review_status: string | null;
  created_at: string | null;
};

function formatLabel(value?: string | null) {
  if (!value) return "—";
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function getCurrentUserOpportunities() {
  const session = await requireSession();
  const supabase = createServerSupabaseClient();

  if (!session || !supabase) {
    return {
      opportunities: [] as OpportunityRow[],
      error:
        !session
          ? "You must be logged in to access the mentorship portal."
          : "Database connection unavailable.",
    };
  }

  const privateDetailsRes = await supabase
    .from("alumni_private_details")
    .select("alumni_profile_id, email")
    .eq("email", session.email)
    .maybeSingle();

  if (privateDetailsRes.error || !privateDetailsRes.data?.alumni_profile_id) {
    return {
      opportunities: [] as OpportunityRow[],
      error:
        "We could not connect this session to an alumni record. Make sure your portal email matches the alumni database.",
    };
  }

  const opportunitiesRes = await supabase
    .from("mentorship_opportunities")
    .select(
      "id, title, slug, opportunity_type, company, location, is_active, is_public, review_status, created_at"
    )
    .eq("alumni_profile_id", privateDetailsRes.data.alumni_profile_id)
    .order("created_at", { ascending: false });

  if (opportunitiesRes.error) {
    return {
      opportunities: [] as OpportunityRow[],
      error: opportunitiesRes.error.message,
    };
  }

  return {
    opportunities: (opportunitiesRes.data || []) as OpportunityRow[],
    error: "",
  };
}

export default async function MemberMentorshipPortalPage() {
  const { opportunities, error } = await getCurrentUserOpportunities();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Member portal
        </p>
        <h1 className="mt-3 text-4xl">Mentorship opportunities</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Alumni can post mentorship, internship, job shadowing, and career
          opportunities here. Approved public posts appear on the website
          mentorship page for active members to apply to.
        </p>
      </div>

      {error ? (
        <div className="surface p-8">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : null}

      <MentorshipOpportunityForm />

      <div className="surface p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
              Your posts
            </p>
            <h2 className="mt-3 text-2xl">Existing opportunities</h2>
          </div>
          <Link
            href="/mentorship"
            className="inline-flex items-center justify-center rounded-full border border-fraternity-charcoal/15 bg-white px-5 py-3 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
          >
            View public mentorship page
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {opportunities.length ? (
            opportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className="rounded-2xl border border-black/10 bg-white/70 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{opportunity.title}</p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      {formatLabel(opportunity.opportunity_type)} ·{" "}
                      {opportunity.company || "—"} · {opportunity.location || "—"}
                    </p>
                    <p className="mt-1 text-sm text-fraternity-slate">
                      Status: {formatLabel(opportunity.review_status)} · Active:{" "}
                      {opportunity.is_active ? "Yes" : "No"} · Public:{" "}
                      {opportunity.is_public ? "Yes" : "No"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/mentorship/${opportunity.slug || opportunity.id}`}
                      className="inline-flex items-center justify-center rounded-full border border-fraternity-charcoal/15 bg-white px-4 py-2 text-sm font-semibold text-fraternity-charcoal transition hover:bg-fraternity-cream"
                    >
                      View
                    </Link>

                    <Link
                      href={`/member/mentorship/${opportunity.id}`}
                      className="inline-flex items-center justify-center rounded-full bg-fraternity-burgundy px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      View applicants
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-fraternity-slate">
              You have not created any mentorship opportunities yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}