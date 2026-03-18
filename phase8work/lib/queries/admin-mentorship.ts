export type MentorRecord = {
  id: string;
  full_name: string;
  industry?: string | null;
  company?: string | null;
  job_title?: string | null;
  location?: string | null;
  major?: string | null;
  years_experience?: number | null;
  preferred_mentoring_areas?: string[] | null;
  availability?: string | null;
  preferred_contact_method?: string | null;
  status?: string | null;
};

export type MenteeRequestRecord = {
  id: string;
  full_name: string;
  industry?: string | null;
  desired_industry?: string | null;
  location?: string | null;
  location_preference?: string | null;
  major?: string | null;
  goals?: string | null;
  preferred_contact_method?: string | null;
  status?: string | null;
};

export type MatchSuggestion = {
  mentorId: string;
  score: number;
  reasons: string[];
};

function norm(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function includesLoose(haystack?: string | null, needle?: string | null) {
  const h = norm(haystack);
  const n = norm(needle);
  if (!h || !n) return false;
  return h.includes(n) || n.includes(h);
}

function overlaps(a?: string[] | null, bText?: string | null) {
  const b = norm(bText);
  if (!a?.length || !b) return false;
  return a.some((item) => includesLoose(item, b));
}

export function scoreMentorForMentee(
  mentor: MentorRecord,
  mentee: MenteeRequestRecord
): MatchSuggestion {
  let score = 0;
  const reasons: string[] = [];

  if (mentor.status && mentor.status !== "approved") {
    return { mentorId: mentor.id, score: -1, reasons: ["mentor not approved"] };
  }

  if (
    includesLoose(mentor.industry, mentee.desired_industry) ||
    includesLoose(mentor.industry, mentee.industry)
  ) {
    score += 40;
    reasons.push("industry match");
  }

  if (includesLoose(mentor.major, mentee.major)) {
    score += 25;
    reasons.push("major match");
  }

  if (
    includesLoose(mentor.location, mentee.location_preference) ||
    includesLoose(mentor.location, mentee.location)
  ) {
    score += 15;
    reasons.push("location match");
  }

  if (overlaps(mentor.preferred_mentoring_areas, mentee.goals)) {
    score += 30;
    reasons.push("mentoring goals overlap");
  }

  if (
    includesLoose(mentor.preferred_contact_method, mentee.preferred_contact_method)
  ) {
    score += 5;
    reasons.push("contact preference match");
  }

  if ((mentor.years_experience || 0) >= 3) {
    score += 10;
    reasons.push("experienced mentor");
  }

  if (norm(mentor.availability)) {
    score += 5;
    reasons.push("availability provided");
  }

  return {
    mentorId: mentor.id,
    score,
    reasons,
  };
}

export function getTopMentorSuggestions(
  mentors: MentorRecord[],
  mentee: MenteeRequestRecord,
  limit = 3
) {
  return mentors
    .map((mentor) => scoreMentorForMentee(mentor, mentee))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}