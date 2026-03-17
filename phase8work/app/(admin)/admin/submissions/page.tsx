import { getAdminOverview } from '@/lib/queries/admin';

export default async function SubmissionsAdminPage() {
  const overview = await getAdminOverview();

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin module</p>
        <h1 className="mt-3 text-4xl capitalize">submissions management</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          This module is now positioned as a real continuation point instead of a dead-end placeholder. Current data source: <strong>{overview.dataSource}</strong>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface p-6">
          <h2 className="text-2xl">What to implement next here</h2>
          <ul className="mt-4 space-y-3 text-sm text-fraternity-slate">
            <li>• server actions or route handlers for create/update/archive workflows</li>
            <li>• row tables with filters and moderation status badges</li>
            <li>• edit drawers or dedicated create/edit pages</li>
            <li>• role-based guardrails for officers vs super admins</li>
          </ul>
        </div>
        <div className="surface p-6">
          <h2 className="text-2xl">Why this matters</h2>
          <p className="mt-4 text-fraternity-slate">
            In your build sequence, this page becomes the operational home for officers after the public site is live. The layout, navigation, and data plumbing are already in place to support that expansion.
          </p>
        </div>
      </div>
    </div>
  );
}
