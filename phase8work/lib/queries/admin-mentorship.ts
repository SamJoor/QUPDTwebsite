import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getTopMentorSuggestions,
  type MentorRecord,
  type MenteeRequestRecord,
} from "@/lib/mentorship/matching";

type MatchRow = {
  id: string;
  mentor_id: string;
  mentee_request_id: string;
  match_status: string | null;
  match_score: number | null;
  match_reason: string[] | null;
  admin_notes: string | null;
  created_by: string | null;
  created_at: string | null;
};

type OpportunityRow = {
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
  preferred_major: string | null;
  preferred_years: string | null;
  is_active: boolean | null;
  is_public: boolean | null;
  review_status: string | null;
  expires_at: string | null;
  created_at: string | null;
};

type OpportunityApplicationRow = {
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
};

export async function getAdminMentorshipDashboard() {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return {
      mentors: [],
      mentees: [],
      matches: [],
      opportunities: [],
      applications: [],
      suggestionsByMentee: {} as Record<string, ReturnType<typeof getTopMentorSuggestions>>,
    };
  }

  const [
    mentorsRes,
    menteesRes,
    matchesRes,
    opportunitiesRes,
    applicationsRes,
  ] = await Promise.all([
    supabase.from("mentors").select("*").order("created_at", { ascending: false }),
    supabase.from("mentee_requests").select("*").order("created_at", { ascending: false }),
    supabase.from("mentorship_matches").select("*").order("created_at", { ascending: false }),
    supabase.from("mentorship_opportunities").select("*").order("created_at", { ascending: false }),
    supabase.from("mentorship_opportunity_applications").select("*").order("created_at", { ascending: false }),
  ]);

  const mentors = ((mentorsRes.data || []) as MentorRecord[]).filter(
    (mentor) => (mentor.status || "approved") === "approved"
  );

  const mentees = (menteesRes.data || []) as MenteeRequestRecord[];
  const matches = (matchesRes.data || []) as MatchRow[];
  const opportunities = (opportunitiesRes.data || []) as OpportunityRow[];
  const applications = (applicationsRes.data || []) as OpportunityApplicationRow[];

  const suggestionsByMentee: Record<string, ReturnType<typeof getTopMentorSuggestions>> = {};

  for (const mentee of mentees) {
    if ((mentee.status || "open") !== "open") continue;
    suggestionsByMentee[mentee.id] = getTopMentorSuggestions(mentors, mentee, 3);
  }

  return {
    mentors,
    mentees,
    matches,
    opportunities,
    applications,
    suggestionsByMentee,
  };
}