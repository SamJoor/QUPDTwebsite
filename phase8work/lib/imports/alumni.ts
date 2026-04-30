import { adminAlumniSchema, type AdminAlumniInput } from "@/lib/validations/admin";
import { parseBoolean } from "@/lib/utils/csv";

type RawValue = string | number | boolean | null | undefined;
export type RawAlumniRecord = Record<string, RawValue>;

function normalizeCell(value: RawValue, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value).trim();
}

function pickFirst(record: RawAlumniRecord, keys: string[]) {
  for (const key of keys) {
    if (key in record) {
      const value = record[key];
      if (value !== null && value !== undefined && String(value).trim() !== "") {
        return value;
      }
    }
  }

  return undefined;
}

function getTermEndMonth(term: string) {
  switch (term) {
    case "spring":
      return 4;
    case "summer":
      return 7;
    case "fall":
      return 12;
    case "winter":
      return 1;
    default:
      return 4;
  }
}

function deriveMemberStatus(graduationYearValue: RawValue, graduationTermValue: RawValue) {
  const graduationYear = Number(normalizeCell(graduationYearValue, "0"));
  const graduationTerm = normalizeCell(graduationTermValue, "spring").toLowerCase();

  if (!graduationYear) {
    return "alumni";
  }

  const cutoff = new Date(graduationYear, getTermEndMonth(graduationTerm), 1);
  return Date.now() < cutoff.getTime() ? "active" : "alumni";
}

function parseBooleanLike(value: RawValue, fallback = false) {
  return parseBoolean(normalizeCell(value), fallback);
}

export function normalizeAlumniImportRecord(record: RawAlumniRecord): {
  data?: AdminAlumniInput;
  error?: string;
} {
  const fullName = pickFirst(record, ["full_name", "fullName", "Full name", "Name"]);
  const graduationYear = pickFirst(record, ["graduation_year", "graduationYear", "Graduation year"]);
  const graduationTerm = pickFirst(record, ["graduation_term", "graduationTerm", "Graduation term"]);
  const derivedMemberStatus = deriveMemberStatus(graduationYear, graduationTerm);

  const parsed = adminAlumniSchema.safeParse({
    fullName,
    graduationYear,
    graduationTerm: normalizeCell(graduationTerm, "spring").toLowerCase(),
    memberStatus: derivedMemberStatus,
    alumniAccessEnabled: parseBooleanLike(
      pickFirst(record, ["alumni_access_enabled", "alumniAccessEnabled", "Alumni access enabled"]),
      derivedMemberStatus === "alumni"
    ),
    major: normalizeCell(pickFirst(record, ["major", "Major"])),
    company: normalizeCell(pickFirst(record, ["company", "Company"]), "Chapter Network"),
    jobTitle: normalizeCell(pickFirst(record, ["job_title", "jobTitle", "Job title"]), "Brother"),
    industry: normalizeCell(pickFirst(record, ["industry", "Industry"]), "General"),
    location: normalizeCell(pickFirst(record, ["location", "Location"]), "TBD"),
    shortBio: normalizeCell(
      pickFirst(record, ["short_bio", "shortBio", "Short bio"]),
      "Imported alumni profile awaiting a fuller chapter biography."
    ),
    linkedinUrl: normalizeCell(pickFirst(record, ["linkedin_url", "linkedinUrl", "LinkedIn"]), ""),
    email: normalizeCell(pickFirst(record, ["email", "Email"]), ""),
    phone: normalizeCell(pickFirst(record, ["phone", "Phone"]), ""),
    bondNumber: normalizeCell(pickFirst(record, ["bond_number", "bondNumber", "Bond number"]), ""),
    willingToMentor: parseBooleanLike(
      pickFirst(record, ["willing_to_mentor", "willingToMentor", "Willing to mentor"]),
      false
    ),
    isPublic: parseBooleanLike(pickFirst(record, ["is_public", "isPublic", "Is public"]), true),
    isFeatured: parseBooleanLike(pickFirst(record, ["is_featured", "isFeatured", "Is featured"]), false),
  });

  if (!parsed.success) {
    return {
      error: `Invalid import row for ${normalizeCell(fullName, "unknown record")}.`
    };
  }

  return { data: parsed.data };
}
