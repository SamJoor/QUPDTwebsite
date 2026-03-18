import Link from "next/link";

export default function MemberHomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
          Phase 8
        </p>
        <h2 className="mt-3 text-4xl">
          Your alumni account is now connected to your profile
        </h2>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          This member area now supports profile claiming, Supabase-backed alumni
          sign-in, self-service editing, and alumni-posted mentorship and
          internship opportunities.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/member/profile"
            className="rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-medium text-white"
          >
            Edit my profile
          </Link>

          <Link
            href="/member/directory"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10"
          >
            View private directory
          </Link>

          <Link
            href="/member/mentorship"
            className="rounded-full bg-fraternity-cream px-5 py-3 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10 transition hover:opacity-90"
          >
            Post opportunity
          </Link>

          <Link
            href="/contact"
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10"
          >
            Return to public site
          </Link>
        </div>
      </div>

      <div className="surface p-8">
        <h3 className="text-2xl">What improved in this phase</h3>
        <ul className="mt-4 space-y-3 text-sm text-fraternity-slate">
          <li>• real member account creation linked to alumni records</li>
          <li>• self-service profile editing instead of request-only updates</li>
          <li>• privacy controls for email, phone, and LinkedIn visibility</li>
          <li>• alumni can now post mentorship and internship opportunities</li>
          <li>• active members can apply through verified fraternity records</li>
        </ul>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-4">
          <p className="text-sm font-semibold text-fraternity-charcoal">
            Mentorship & internship posting
          </p>
          <p className="mt-2 text-sm text-fraternity-slate">
            Share internships, mentorship opportunities, coffee chats, job
            shadowing, and career advice with active brothers through the member
            portal.
          </p>
          <Link
            href="/member/mentorship"
            className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10"
          >
            Go to mentorship portal
          </Link>
        </div>
      </div>
    </div>
  );
}