import { createServerSupabaseClient } from "@/lib/supabase/server";

export type MentorshipOpportunityRecord = {
  id: string;
  alumni_profile_id: string;
  title: string;
  slug: string | null;
  opportunity_type: string;
  company: string | null;
  location: string | null;
  location_type: string | null;
  industry: string | null;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  preferred_major: string | null;
  preferred_years: string | null;
  preferred_skills: string | null;
  application_instructions: string | null;
  contact_method: string | null;
  is_paid: boolean | null;
  compensation: string | null;
  is_active: boolean | null;
  is_public: boolean | null;
  review_status: string | null;
  expires_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type MentorshipOpportunityApplicationRecord = {
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
  admin_notes: string | null;
  alumni_notes: string | null;
  created_at: string | null;
  updated_at?: string | null;
};

function isOpportunityPubliclyVisible(
  opportunity: MentorshipOpportunityRecord | null
) {
  if (!opportunity) return false;
  if (opportunity.is_active === false) return false;
  if (opportunity.is_public === false) return false;
  if (opportunity.review_status && opportunity.review_status !== "approved") {
    return false;
  }

  if (opportunity.expires_at) {
    const expiresAtMs = new Date(opportunity.expires_at).getTime();
    if (!Number.isNaN(expiresAtMs) && expiresAtMs < Date.now()) {
      return false;
    }
  }

  return true;
}

export async function getPublicMentorshipOpportunities() {
  const supabase = createServerSupabaseClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("mentorship_opportunities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getPublicMentorshipOpportunities]", error);
    return [];
  }

  return ((data || []) as MentorshipOpportunityRecord[]).filter(
    isOpportunityPubliclyVisible
  );
}

export async function getMentorshipOpportunityBySlug(slugOrId: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) return null;

  const looksLikeUuid = /^[0-9a-fA-F-]{32,36}$/.test(slugOrId);

  let query = supabase
    .from("mentorship_opportunities")
    .select("*")
    .limit(1);

  if (looksLikeUuid) {
    query = query.eq("id", slugOrId);
  } else {
    query = query.eq("slug", slugOrId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("[getMentorshipOpportunityBySlug]", error);
    return null;
  }

  const opportunity = (data as MentorshipOpportunityRecord | null) || null;

  if (!isOpportunityPubliclyVisible(opportunity)) {
    return null;
  }

  return opportunity;
}

export async function getMentorshipOpportunityById(id: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("mentorship_opportunities")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[getMentorshipOpportunityById]", error);
    return null;
  }

  return (data as MentorshipOpportunityRecord | null) || null;
}

export async function getAlumniMentorshipOpportunities(
  alumniProfileId: string
) {
  const supabase = createServerSupabaseClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("mentorship_opportunities")
    .select("*")
    .eq("alumni_profile_id", alumniProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAlumniMentorshipOpportunities]", error);
    return [];
  }

  return (data || []) as MentorshipOpportunityRecord[];
}

export async function getApplicationsForOpportunity(opportunityId: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("mentorship_opportunity_applications")
    .select("*")
    .eq("opportunity_id", opportunityId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getApplicationsForOpportunity]", error);
    return [];
  }

  return (data || []) as MentorshipOpportunityApplicationRecord[];
}

export async function getApplicationsForApplicant(alumniProfileId: string) {
  const supabase = createServerSupabaseClient();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("mentorship_opportunity_applications")
    .select("*")
    .eq("alumni_profile_id", alumniProfileId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getApplicationsForApplicant]", error);
    return [];
  }

  return (data || []) as MentorshipOpportunityApplicationRecord[];
}