import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const subscribeSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  graduationYear: z
    .string()
    .trim()
    .max(20)
    .optional()
    .transform((value) => (value && value.length ? value : null)),
  subscriberType: z.enum(["alumni", "parent", "supporter", "friend", "active"]),
  consent: z.boolean().refine((value) => value === true, {
    message: "Consent is required.",
  }),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function getBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "on" || normalized === "1";
  }
  return false;
}

async function parseRequestBody(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const json = await request.json().catch(() => null);
    return {
      firstName: json?.firstName,
      lastName: json?.lastName,
      email: json?.email,
      graduationYear: json?.graduationYear,
      subscriberType: json?.subscriberType,
      consent: getBoolean(json?.consent),
    };
  }

  const formData = (await request.formData()) as any;

  return {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    graduationYear: formData.get("graduationYear"),
    subscriberType: formData.get("subscriberType"),
    consent: getBoolean(formData.get("consent")),
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createServerSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection unavailable." },
        { status: 500 }
      );
    }

    const rawBody = await parseRequestBody(request);

    const parsed = subscribeSchema.safeParse({
      firstName: rawBody.firstName,
      lastName: rawBody.lastName,
      email: rawBody.email,
      graduationYear: rawBody.graduationYear,
      subscriberType: rawBody.subscriberType,
      consent: rawBody.consent,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid newsletter signup submission.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const input = parsed.data;
    const email = normalizeEmail(input.email);

    const existingRes = await supabase
      .from("newsletter_subscribers")
      .select("id, email, is_active")
      .eq("email", email)
      .maybeSingle();

    if (existingRes.error) {
      return NextResponse.json(
        {
          error:
            existingRes.error.message ||
            "Unable to check existing newsletter subscription.",
        },
        { status: 500 }
      );
    }

    if (existingRes.data?.id) {
      const updateRes = await supabase
        .from("newsletter_subscribers")
        .update({
          first_name: input.firstName,
          last_name: input.lastName,
          subscriber_type: input.subscriberType,
          is_active: true,
          subscribed_at: new Date().toISOString(),
        })
        .eq("id", existingRes.data.id)
        .select("id")
        .single();

      if (updateRes.error) {
        return NextResponse.json(
          {
            error:
              updateRes.error.message ||
              "Unable to update newsletter subscription.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Your newsletter subscription has been updated.",
        subscriberId: updateRes.data.id,
      });
    }

    const insertRes = await supabase
      .from("newsletter_subscribers")
      .insert({
        first_name: input.firstName,
        last_name: input.lastName,
        email,
        graduation_year: input.graduationYear,
        subscriber_type: input.subscriberType,
        is_active: true,
        subscribed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertRes.error) {
      return NextResponse.json(
        {
          error:
            insertRes.error.message ||
            "Unable to create newsletter subscription.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thanks for joining the newsletter.",
        subscriberId: insertRes.data.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/newsletter/subscribe]", error);

    return NextResponse.json(
      { error: "Unexpected server error while subscribing." },
      { status: 500 }
    );
  }
}