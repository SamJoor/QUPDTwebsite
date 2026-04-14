import Link from 'next/link';
import { ActiveClaimCompleteForm } from '@/components/forms/active-claim-complete-form';
import { getActiveClaimTokenRecord, isActiveClaimTokenUsable } from '@/lib/auth/active-claim';

export default async function ActiveClaimCompletePage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token || '';
  const record = token ? await getActiveClaimTokenRecord(token) : null;
  const usable = isActiveClaimTokenUsable(record);

  return (
    <main className="min-h-screen bg-fraternity-cream px-6 py-16">
      {usable && record ? (
        <ActiveClaimCompleteForm token={token} email={record.auth_email} />
      ) : (
        <div className="surface mx-auto max-w-2xl p-8 md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">
            Active access
          </p>
          <h1 className="mt-3 text-4xl">This setup link is no longer valid</h1>
          <p className="mt-4 text-fraternity-slate">
            Claim links expire after a short window or become invalid once they are used. Request a new link to finish setting up your account.
          </p>
          <div className="mt-6">
            <Link href="/active/claim" className="inline-flex rounded-full bg-fraternity-burgundy px-4 py-2 font-medium text-white">
              Request a new link
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
