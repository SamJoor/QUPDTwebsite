import Link from "next/link";

export default function ActivePortalHomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Active portal
        </p>
        <h2 className="mt-3 text-4xl">Track your mentorship applications</h2>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          Apply to alumni-posted opportunities, review the status of your
          submissions, and read any follow-up notes from the alumnus who posted
          the role.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/mentorship"
            className="rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-medium text-white"
          >
            Browse opportunities
          </Link>

          <Link
            href="/active/applications"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10"
          >
            View my applications
          </Link>
        </div>
      </div>

      <div className="surface p-8">
        <h3 className="text-2xl">What you can do here</h3>
        <ul className="mt-4 space-y-3 text-sm text-fraternity-slate">
          <li>• apply to alumni mentorship and internship opportunities</li>
          <li>• track application status in one place</li>
          <li>• read alumni follow-up notes and next steps</li>
          <li>• keep internal workflows inside verified chapter access</li>
        </ul>
      </div>
    </div>
  );
}