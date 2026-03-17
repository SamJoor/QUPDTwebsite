import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export default function MemberLoginPage() {
  return (
    <main className="min-h-screen bg-fraternity-cream px-6 py-16">
      <div className="mx-auto max-w-xl space-y-6">
        <LoginForm
          scope="alumni"
          title="Alumni member access"
          description="Phase 7 upgrades alumni login from the old shared-password bridge to real Supabase email/password auth whenever your project keys are connected."
          redirectTo="/member"
        />
        <div className="surface p-6 text-sm text-fraternity-slate">
          <p className="font-semibold text-fraternity-charcoal">Need an account first?</p>
          <p className="mt-2">Claim your alumni profile to link your directory record, create your credentials, and unlock self-service profile editing.</p>
          <Link href="/member/claim" className="mt-4 inline-flex rounded-full bg-fraternity-burgundy px-4 py-2 font-medium text-white">Claim your profile</Link>
        </div>
      </div>
    </main>
  );
}
