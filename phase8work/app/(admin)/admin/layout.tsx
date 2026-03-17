import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/logout-button";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/alumni", label: "Alumni" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/newsletters", label: "Newsletters" },
  { href: "/admin/content", label: "Site Content" },
  { href: "/admin/import", label: "CSV Import" },
  { href: "/admin/mentorship", label: "Mentorship" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/legacy-review", label: "Legacy Review" },
  { href: "/admin/review", label: "Review Queue" },
  { href: "/admin/submissions", label: "Submissions" },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession("admin");
  if (!session) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-fraternity-cream">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
        <aside className="surface w-full shrink-0 p-6 md:sticky md:top-6 md:w-72 md:self-start">
          <div>
            <h1 className="text-4xl">Admin Workspace</h1>
            <p className="mt-4 text-fraternity-slate">
              Signed in as {session.email}. This officer workspace now includes
              protected routes and starter CRUD flows.
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-base font-medium text-fraternity-charcoal transition hover:bg-black/5"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-8">
            <LogoutButton redirectTo="/" />
          </div>
        </aside>

        <section className="min-w-0 flex-1">{children}</section>
      </div>
    </main>
  );
}