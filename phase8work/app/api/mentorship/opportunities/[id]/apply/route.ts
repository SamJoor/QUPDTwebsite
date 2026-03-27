import crypto from "crypto";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mentorshipOpportunityApplicationSchema } from "@/lib/validations/mentorship";

const BUCKET_NAME = "mentorship-applications";
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeOptional(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

function splitName(fullName?: string | null) {
  const value = (fullName || "").trim();
  if (!value) return { firstName: "", lastName: "" };

  const parts = value.split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return { firstName, lastName };
}

function sameLoose(a?: string | null, b?: string | null) {
  return (a || "").trim().toLowerCase() === (b || "").trim().toLowerCase();
}

function isEligibleMemberStatus(status?: string | null) {
  const normalized = (status || "").trim().toLowerCase();

  return [
    "active",
    "member",
    "undergraduate",
    "brother",
    "active member",
  ].includes(normalized);
}

function validateUpload(file: File | null, label: string, required = false) {
  if (!file || file.size === 0) {
    if (required) {
      return `${label} is required.`;
    }
    return null;
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return `${label} must be a PDF, DOC, or DOCX file.`;
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `${label} must be 5 MB or smaller.`;
  }

  return null;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: opportunityId } = await context.params;
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection unavailable." },
        { status: 500 }
      );
    }

    const opportunityRes = await supabase
      .from("mentorship_opportunities")
      .select("id, title, is_active, review_status, expires_at")
      .eq("id", opportunityId)
      .maybeSingle();

    if (opportunityRes.error) {
      return NextResponse.json(
        { error: opportunityRes.error.message || "Unable to load opportunity." },
        { status: 500 }
      );
    }

    const opportunity = opportunityRes.data as
      | {
          id: string;
          title?: string | null;
          is_active?: boolean | null;
          review_status?: string | null;
          expires_at?: string | null;
        }
      | null;

    if (!opportunity?.id) {
      return NextResponse.json(
        { error: "Opportunity not found." },
        { status: 404 }
      );
    }

    if (opportunity.is_active === false) {
      return NextResponse.json(
        { error: "This opportunity is no longer accepting applications." },
        { status: 400 }
      );
    }

    if (opportunity.review_status && opportunity.review_status !== "approved") {
      return NextResponse.json(
        { error: "This opportunity is not currently open for applications." },
        { status: 400 }
      );
    }

    if (
      opportunity.expires_at &&
      new Date(opportunity.expires_at).getTime() < Date.now()
    ) {
      return NextResponse.json(
        { error: "This opportunity has expired." },
        { status: 400 }
      );
    }

    const formData = (await request.formData()) as any;

    const resume = formData.get("resume") as File | null;
    const coverLetter = formData.get("coverLetter") as File | null;

    const resumeError = validateUpload(resume, "Resume", true);
    if (resumeError) {
      return NextResponse.json({ error: resumeError }, { status: 400 });
    }

    const coverLetterError = validateUpload(
      coverLetter && coverLetter.size > 0 ? coverLetter : null,
      "Cover letter",
      false
    );
    if (coverLetterError) {
      return NextResponse.json({ error: coverLetterError }, { status: 400 });
    }

    const parsed = mentorshipOpportunityApplicationSchema.safeParse({
      firstName: getString(formData, "firstName"),
      lastName: getString(formData, "lastName"),
      bondNumber: getString(formData, "bondNumber"),
      email: getString(formData, "email"),
      phone: getString(formData, "phone"),
      graduationYear: getString(formData, "graduationYear"),
      major: getString(formData, "major"),
      linkedinUrl: getString(formData, "linkedinUrl"),
      message: getString(formData, "message"),
      whyInterested: getString(formData, "whyInterested"),
      experienceSummary: getString(formData, "experienceSummary"),
      preferredContactMethod: getString(formData, "preferredContactMethod"),
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid application submission.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const input = parsed.data;

    const profileRes = await supabase
      .from("alumni_profiles")
      .select("id, full_name, graduation_year, member_status, alumni_access_enabled")
      .eq("graduation_year", input.graduationYear);

    if (profileRes.error) {
      return NextResponse.json(
        { error: profileRes.error.message || "Unable to verify applicant." },
        { status: 500 }
      );
    }

    const candidateProfiles = (profileRes.data || []) as Array<{
      id: string;
      full_name?: string | null;
      graduation_year?: number | null;
      member_status?: string | null;
      alumni_access_enabled?: boolean | null;
    }>;

    let matchedProfile:
      | {
          id: string;
          full_name?: string | null;
          graduation_year?: number | null;
          member_status?: string | null;
          alumni_access_enabled?: boolean | null;
        }
      | undefined;

    for (const profile of candidateProfiles) {
      const split = splitName(profile.full_name);
      const firstMatches = sameLoose(split.firstName, input.firstName);
      const lastMatches = sameLoose(split.lastName, input.lastName);

      if (firstMatches && lastMatches) {
        matchedProfile = profile;
        break;
      }
    }

    if (!matchedProfile?.id) {
      return NextResponse.json(
        {
          error:
            "We could not verify your record from the submitted first name, last name, and graduation year.",
        },
        { status: 403 }
      );
    }

    const privateDetailsRes = await supabase
      .from("alumni_private_details")
      .select("alumni_profile_id, email, phone, bond_number")
      .eq("alumni_profile_id", matchedProfile.id)
      .maybeSingle();

    if (privateDetailsRes.error) {
      return NextResponse.json(
        {
          error:
            privateDetailsRes.error.message ||
            "Unable to verify private member details.",
        },
        { status: 500 }
      );
    }

    const privateDetails = privateDetailsRes.data as
      | {
          alumni_profile_id?: string | null;
          email?: string | null;
          phone?: string | null;
          bond_number?: string | null;
        }
      | null;

    if (!privateDetails?.alumni_profile_id) {
      return NextResponse.json(
        { error: "No private member record was found for this applicant." },
        { status: 403 }
      );
    }

    if (!sameLoose(privateDetails.bond_number, input.bondNumber)) {
      return NextResponse.json(
        { error: "Bond number did not match our records." },
        { status: 403 }
      );
    }

    if (!isEligibleMemberStatus(matchedProfile.member_status)) {
      return NextResponse.json(
        { error: "Only eligible active members can apply." },
        { status: 403 }
      );
    }

    const duplicateRes = await supabase
      .from("mentorship_opportunity_applications")
      .select("id")
      .eq("opportunity_id", opportunityId)
      .eq("alumni_profile_id", matchedProfile.id)
      .limit(1)
      .maybeSingle();

    if (duplicateRes.error && duplicateRes.error.code !== "PGRST116") {
      return NextResponse.json(
        { error: duplicateRes.error.message || "Unable to check for duplicates." },
        { status: 500 }
      );
    }

    if (duplicateRes.data?.id) {
      return NextResponse.json(
        { error: "You have already applied to this opportunity." },
        { status: 400 }
      );
    }

    const applicationId = crypto.randomUUID();

    const resumeExt = resume?.name?.split(".").pop()?.toLowerCase() || "pdf";
    const resumePath = `resumes/${opportunityId}/${applicationId}-resume.${sanitizeFileName(
      resumeExt
    )}`;

    const resumeArrayBuffer = await resume!.arrayBuffer();
    const resumeUploadRes = await supabase.storage
      .from(BUCKET_NAME)
      .upload(resumePath, Buffer.from(resumeArrayBuffer), {
        contentType: resume!.type,
        upsert: false,
      });

    if (resumeUploadRes.error) {
      return NextResponse.json(
        { error: resumeUploadRes.error.message || "Failed to upload resume." },
        { status: 500 }
      );
    }

    let coverLetterPath: string | null = null;

    if (coverLetter && coverLetter.size > 0) {
      const coverExt =
        coverLetter.name?.split(".").pop()?.toLowerCase() || "pdf";
      coverLetterPath = `cover-letters/${opportunityId}/${applicationId}-cover-letter.${sanitizeFileName(
        coverExt
      )}`;

      const coverArrayBuffer = await coverLetter.arrayBuffer();
      const coverUploadRes = await supabase.storage
        .from(BUCKET_NAME)
        .upload(coverLetterPath, Buffer.from(coverArrayBuffer), {
          contentType: coverLetter.type,
          upsert: false,
        });

      if (coverUploadRes.error) {
        await supabase.storage.from(BUCKET_NAME).remove([resumePath]);

        return NextResponse.json(
          {
            error:
              coverUploadRes.error.message || "Failed to upload cover letter.",
          },
          { status: 500 }
        );
      }
    }

    const insertPayload = {
      id: applicationId,
      opportunity_id: opportunityId,
      alumni_profile_id: matchedProfile.id,
      applicant_email: input.email,
      applicant_phone: normalizeOptional(input.phone),
      major: input.major,
      graduation_year: input.graduationYear,
      linkedin_url: normalizeOptional(input.linkedinUrl),
      message: input.message,
      why_interested: input.whyInterested,
      experience_summary: normalizeOptional(input.experienceSummary),
      preferred_contact_method: normalizeOptional(input.preferredContactMethod),
      status: "submitted",
      verification_status: "verified",
      resume_path: resumePath,
      cover_letter_path: coverLetterPath,
      updated_at: new Date().toISOString(),
    };

    const insertRes = await supabase
      .from("mentorship_opportunity_applications")
      .insert(insertPayload)
      .select("id")
      .single();

    if (insertRes.error) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([resumePath, coverLetterPath].filter(Boolean) as string[]);

      return NextResponse.json(
        {
          error:
            insertRes.error.message || "Failed to save opportunity application.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Application submitted successfully. The alumni poster and admin team can now review it.",
        applicationId: insertRes.data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/mentorship/opportunities/[id]/apply]", error);

    return NextResponse.json(
      { error: "Unexpected server error while submitting application." },
      { status: 500 }
    );
  }
}