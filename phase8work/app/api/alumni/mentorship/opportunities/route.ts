import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  mentorshipOpportunitySchema,
  slugifyOpportunityTitle,
} from "@/lib/validations/mentorship";

type ResolvedAlumniProfile =
  | {
      error: string;
    }
  | {
      supabase: NonNullable<ReturnType<typeof createServerSupabaseClient>>;
      profile: {
        id: string;
        full_name?: string | null;
        member_status?: string | null;
        alumni_access_enabled?: boolean | null;
      };
    };

function normalizeOptional(value: unknown) {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function toBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value === "true" || value === "on" || value === "1";
  }
  return false;
}

async function resolveAuthenticatedAlumniProfileId(
  email: string
): Promise<ResolvedAlumniProfile> {
  const supabase = createServerSupabaseClient();

  if (!supabase) {
    return { error: "Database connection unavailable." };
  }

  const privateDetailsRes = await supabase
    .from("alumni_private_details")
    .select("alumni_profile_id, email")
    .eq("email", email)
    .maybeSingle();

  if (privateDetailsRes.error) {
    return { error: privateDetailsRes.error.message };
  }

  const privateDetails = privateDetailsRes.data as
    | {
        alumni_profile_id?: string | null;
        email?: string | null;
      }
    | null;

  if (!privateDetails?.alumni_profile_id) {
    return {
      error:
        "No alumni record is linked to this session email. Make sure the logged-in alumni email matches the alumni database.",
    };
  }

  const profileRes = await supabase
    .from("alumni_profiles")
    .select("id, full_name, member_status, alumni_access_enabled")
    .eq("id", privateDetails.alumni_profile_id)
    .maybeSingle();

  if (profileRes.error) {
    return { error: profileRes.error.message };
  }

  const profile = profileRes.data as
    | {
        id: string;
        full_name?: string | null;
        member_status?: string | null;
        alumni_access_enabled?: boolean | null;
      }
    | null;

  if (!profile?.id) {
    return { error: "Associated alumni profile was not found." };
  }

  if (profile.alumni_access_enabled === false) {
    return {
      error:
        "This alumni record does not currently have alumni portal access enabled.",
    };
  }

  return {
    supabase,
    profile,
  };
}

async function createUniqueSlug(
  supabase: NonNullable<ReturnType<typeof createServerSupabaseClient>>,
  title: string
) {
  const base = slugifyOpportunityTitle(title) || "opportunity";

  const { data } = await supabase
    .from("mentorship_opportunities")
    .select("slug")
    .ilike("slug", `${base}%`);

  const existing = new Set(
    (data || []).map((row: any) => row.slug).filter(Boolean)
  );

  if (!existing.has(base)) return base;

  let counter = 2;
  while (existing.has(`${base}-${counter}`)) {
    counter += 1;
  }

  return `${base}-${counter}`;
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to post an opportunity." },
        { status: 401 }
      );
    }

    const resolved = await resolveAuthenticatedAlumniProfileId(session.email);

    if ("error" in resolved) {
      return NextResponse.json({ error: resolved.error }, { status: 403 });
    }

    const { supabase, profile } = resolved;

    const body = await request.json();

    const parsed = mentorshipOpportunitySchema.safeParse({
      title: body.title,
      opportunityType: body.opportunityType,
      company: body.company,
      location: body.location,
      locationType: body.locationType,
      industry: body.industry,
      description: body.description,
      responsibilities: body.responsibilities,
      requirements: body.requirements,
      preferredMajor: body.preferredMajor,
      preferredYears: body.preferredYears,
      preferredSkills: body.preferredSkills,
      applicationInstructions: body.applicationInstructions,
      contactMethod: body.contactMethod,
      isPaid: toBoolean(body.isPaid),
      compensation: body.compensation,
      isPublic: body.isPublic === undefined ? true : toBoolean(body.isPublic),
      expiresAt: body.expiresAt,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid opportunity submission.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const slug = await createUniqueSlug(supabase, input.title);

    const insertPayload = {
      alumni_profile_id: profile.id,
      title: input.title,
      slug,
      opportunity_type: input.opportunityType,
      company: normalizeOptional(input.company),
      location: normalizeOptional(input.location),
      location_type: normalizeOptional(input.locationType),
      industry: normalizeOptional(input.industry),
      description: input.description,
      responsibilities: normalizeOptional(input.responsibilities),
      requirements: normalizeOptional(input.requirements),
      preferred_major: normalizeOptional(input.preferredMajor),
      preferred_years: normalizeOptional(input.preferredYears),
      preferred_skills: normalizeOptional(input.preferredSkills),
      application_instructions: normalizeOptional(input.applicationInstructions),
      contact_method: normalizeOptional(input.contactMethod),
      is_paid: input.isPaid,
      compensation: normalizeOptional(input.compensation),
      is_active: true,
      is_public: input.isPublic,
      review_status: "approved",
      expires_at: input.expiresAt
        ? new Date(input.expiresAt).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    };

    const insertRes = await supabase
      .from("mentorship_opportunities")
      .insert(insertPayload)
      .select("*")
      .single();

    if (insertRes.error) {
      return NextResponse.json(
        { error: insertRes.error.message || "Failed to create opportunity." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Opportunity created successfully.",
        opportunity: insertRes.data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/alumni/mentorship/opportunities]", error);

    return NextResponse.json(
      { error: "Unexpected server error while creating opportunity." },
      { status: 500 }
    );
  }
}