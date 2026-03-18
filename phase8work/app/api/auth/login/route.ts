import { NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validations/admin";
import { createSessionToken } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  createSupabaseAnonServerClient,
  hasSupabaseAuthEnv,
} from "@/lib/supabase/auth";

type LoginScope = "admin" | "alumni" | "active";

function isActiveMemberStatus(status?: string | null) {
  const normalized = (status || "").trim().toLowerCase();
  return ["active", "member", "undergraduate", "brother", "active member"].includes(
    normalized
  );
}

function isAlumniMemberStatus(status?: string | null) {
  const normalized = (status || "").trim().toLowerCase();
  return ["alumni", "graduate", "alumnus"].includes(normalized);
}

async function emailAllowedForRole(scope: LoginScope, email: string) {
  const supabase = createServerSupabaseClient();
  if (!supabase) return true;

  if (scope === "admin") {
    const { data, error } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("[emailAllowedForRole][admin]", error);
      return false;
    }

    return Boolean(data?.email);
  }

  const accountRes = await supabase
    .from("member_accounts")
    .select("alumni_profile_id, auth_email, claim_status")
    .eq("auth_email", email)
    .maybeSingle();

  if (accountRes.error) {
    console.error("[emailAllowedForRole][member_accounts]", accountRes.error);
    return false;
  }

  if (!accountRes.data?.alumni_profile_id) {
    console.error("[emailAllowedForRole] no member_accounts row for", email);
    return false;
  }

  const profileRes = await supabase
    .from("alumni_profiles")
    .select("id, member_status, alumni_access_enabled")
    .eq("id", accountRes.data.alumni_profile_id)
    .maybeSingle();

  if (profileRes.error) {
    console.error("[emailAllowedForRole][alumni_profiles]", profileRes.error);
    return false;
  }

  const profile = profileRes.data as
    | {
        id: string;
        member_status?: string | null;
        alumni_access_enabled?: boolean | null;
      }
    | null;

  if (!profile?.id) {
    console.error(
      "[emailAllowedForRole] no linked alumni_profiles row for",
      email
    );
    return false;
  }

  if (scope === "active") {
    return isActiveMemberStatus(profile.member_status);
  }

  if (scope === "alumni") {
    if (profile.alumni_access_enabled === false) {
      console.error("[emailAllowedForRole] alumni access disabled for", email);
      return false;
    }

    return isAlumniMemberStatus(profile.member_status);
  }

  return false;
}

async function verifyScopedCredentials(
  scope: Exclude<LoginScope, "admin">,
  email: string,
  password: string
) {
  if (hasSupabaseAuthEnv()) {
    const anon = createSupabaseAnonServerClient();
    if (anon) {
      const { data, error } = await anon.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.user) {
        return {
          ok: false as const,
          error: error?.message || "Unable to sign in with Supabase Auth.",
        };
      }

      return {
        ok: true as const,
        email: data.user.email || email,
        authUserId: data.user.id,
      };
    }
  }

  const expectedPassword =
    scope === "active"
      ? process.env.ACTIVE_MEMBER_LOGIN_PASSWORD
      : process.env.ALUMNI_LOGIN_PASSWORD;

  if (!expectedPassword) {
    return {
      ok: false as const,
      error:
        scope === "active"
          ? "Missing ACTIVE_MEMBER_LOGIN_PASSWORD or Supabase Auth environment."
          : "Missing ALUMNI_LOGIN_PASSWORD or Supabase Auth environment.",
    };
  }

  if (password !== expectedPassword) {
    return { ok: false as const, error: "Incorrect password." };
  }

  return { ok: true as const, email, authUserId: null };
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid login submission." },
      { status: 400 }
    );
  }

  const { email, password, scope } = parsed.data as {
    email: string;
    password: string;
    scope: LoginScope;
  };

  if (scope === "admin") {
    const expectedPassword = process.env.ADMIN_LOGIN_PASSWORD;

    if (!expectedPassword) {
      return NextResponse.json(
        { error: "Missing ADMIN_LOGIN_PASSWORD in environment." },
        { status: 500 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }
  } else {
    const verified = await verifyScopedCredentials(scope, email, password);

    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 401 });
    }
  }

  const allowed = await emailAllowedForRole(scope, email);

  if (!allowed) {
    return NextResponse.json(
      {
        error:
          scope === "active"
            ? "This email is not linked to an eligible active-member record."
            : "This email is not linked to an eligible alumni record.",
      },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: createSessionToken({
      role: scope,
      email,
      name: email.split("@")[0],
    }),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}