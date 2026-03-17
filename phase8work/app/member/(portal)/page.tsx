import Link from 'next/link';

export default function MemberHomePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Phase 7</p>
        <h2 className="mt-3 text-4xl">Your alumni account is now connected to your profile</h2>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          This member area now supports profile claiming, Supabase-backed alumni sign-in, and self-service editing for core professional details and privacy settings.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/member/profile" className="rounded-full bg-fraternity-burgundy px-5 py-3 text-sm font-medium text-white">Edit my profile</Link>
          <Link href="/member/directory" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10">View private directory</Link>
          <Link href="/contact" className="rounded-full bg-white px-5 py-3 text-sm font-medium text-fraternity-charcoal ring-1 ring-black/10">Return to public site</Link>
        </div>
      </div>
      <div className="surface p-8">
        <h3 className="text-2xl">What improved in this phase</h3>
        <ul className="mt-4 space-y-3 text-sm text-fraternity-slate">
          <li>• real member account creation linked to alumni records</li>
          <li>• self-service profile editing instead of request-only updates</li>
          <li>• privacy controls for email, phone, and LinkedIn visibility</li>
          <li>• better base for future reunion, mentorship, and donor features</li>
        </ul>
      </div>
    </div>
  );
}
