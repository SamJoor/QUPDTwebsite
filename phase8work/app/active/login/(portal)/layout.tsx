import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function ActivePortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession("active");
  if (!session) redirect("/active/login");

  return (
    <main className="min-h-screen bg-fraternity-cream">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="surface mb-8 flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
              Active member portal
            </p>
            <h1 className="mt-3 text-3xl">Current brother access</h1>
            <p className="mt-2 text-sm text-fraternity-slate">
              Signed in as {session.email}. Use this portal to track mentorship
              applications and access protected internal resources.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/active"
              className="rounded-full bg-fraternity-parchment px-4 py-2 text-sm font-medium text-fraternity-charcoal"
            >
              Overview
            </Link>

            <Link
              href="/active/applications"
              className="rounded-full bg-fraternity-parchment px-4 py-2 text-sm font-medium text-fraternity-charcoal"
            >
              My Applications
            </Link>

            <LogoutButton redirectTo="/" />
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}