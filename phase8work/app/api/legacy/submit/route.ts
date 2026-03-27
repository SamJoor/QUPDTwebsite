import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getGraduationDate, getReleaseDate, type GraduationTerm } from "@/lib/legacy";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const formData = (await request.formData()) as any;

    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    const getNumber = (key: string) => {
      const value = formData.get(key);
      if (typeof value !== "string") return 0;
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    const firstName = getString("firstName");
    const lastName = getString("lastName");
    const graduationYear = getNumber("graduationYear");
    const title = getString("title");
    const memoryBody = getString("memoryBody");
    const mediaType = getString("mediaType") || "memory";
    const consentToPublish = getString("consentToPublish") === "true";

    if (
      !firstName ||
      !lastName ||
      !graduationYear ||
      !title ||
      !memoryBody ||
      !consentToPublish
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`.replace(/\s+/g, " ").trim();

    const { data: profile, error: profileError } = await supabase
      .from("alumni_profiles")
      .select("id, full_name, graduation_year, graduation_term, member_status, alumni_access_enabled")
      .ilike("full_name", fullName)
      .eq("graduation_year", graduationYear)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json(
        { error: "We could not find a matching member/alumni record." },
        { status: 403 }
      );
    }

    const { data: privateDetails, error: privateError } = await supabase
      .from("alumni_private_details")
      .select("alumni_profile_id, email")
      .eq("alumni_profile_id", profile.id)
      .maybeSingle();

    if (privateError) {
      return NextResponse.json({ error: privateError.message }, { status: 500 });
    }

    if (!privateDetails) {
      return NextResponse.json(
        { error: "Your private record could not be found." },
        { status: 403 }
      );
    }

    const allowedStatuses = ["active", "graduating", "alumni"];
    const hasAllowedStatus = allowedStatuses.includes(profile.member_status);

    if (!hasAllowedStatus && !profile.alumni_access_enabled) {
      return NextResponse.json(
        { error: "This record is not currently eligible to submit archive memories." },
        { status: 403 }
      );
    }

    const graduationTerm = (profile.graduation_term || "spring") as GraduationTerm;
    const resolvedGraduationYear = profile.graduation_year;

    if (!resolvedGraduationYear) {
      return NextResponse.json(
        { error: "This record is missing graduation information." },
        { status: 400 }
      );
    }

    const graduationDate = getGraduationDate(resolvedGraduationYear, graduationTerm);
    const releaseAt = getReleaseDate(resolvedGraduationYear, graduationTerm);

    const fileValue = formData.get("file");
    const file =
      fileValue &&
      typeof fileValue === "object" &&
      "arrayBuffer" in fileValue &&
      "size" in fileValue
        ? (fileValue as File)
        : null;

    let storageBucket: string | null = null;
    let storagePath: string | null = null;
    let fileUrl: string | null = null;

    if (file && file.size > 0) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Only JPG, PNG, WEBP, and PDF files are allowed." },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { error: "File is too large. Maximum size is 10 MB." },
          { status: 400 }
        );
      }

      storageBucket = "legacy-submissions";

      const extension = file.name.includes(".")
        ? file.name.split(".").pop()?.toLowerCase()
        : "bin";

      const safeExtension = extension || "bin";
      const uniquePath = `${profile.id}/${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;

      const bytes = Buffer.from(await file.arrayBuffer());

      const upload = await supabase.storage.from(storageBucket).upload(uniquePath, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

      if (upload.error) {
        return NextResponse.json({ error: upload.error.message }, { status: 500 });
      }

      storagePath = uniquePath;
    }

    const { error } = await supabase.from("legacy_submissions").insert({
      submitted_by_profile_id: profile.id,
      submitted_by_user_id: null,
      member_status_at_submission: profile.member_status,
      full_name: profile.full_name,
      email: privateDetails.email,
      graduation_year: resolvedGraduationYear,
      graduation_term: graduationTerm,
      graduation_date: graduationDate.toISOString().slice(0, 10),
      title,
      memory_body: memoryBody,
      media_type: mediaType,
      storage_bucket: storageBucket,
      storage_path: storagePath,
      file_url: fileUrl,
      consent_to_publish: consentToPublish,
      status: "submitted",
      release_at: releaseAt.toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Submission failed." },
      { status: 500 }
    );
  }
}