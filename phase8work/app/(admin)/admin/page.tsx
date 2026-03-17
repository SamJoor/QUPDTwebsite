import { AdminListCard } from '@/components/admin/admin-list-card';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { getAdminOverview, getAdminRecentItems } from '@/lib/queries/admin';

export default async function AdminPage() {
  const [{ stats, dataSource }, recent] = await Promise.all([getAdminOverview(), getAdminRecentItems()]);

  return (
    <div className="space-y-8 py-2">
      <div className="surface p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Admin overview</p>
        <h1 className="mt-3 text-4xl">Chapter operations dashboard foundation</h1>
        <p className="mt-4 max-w-3xl text-fraternity-slate">
          This is no longer a placeholder page. It already reads structured records and shows whether the project is currently operating in <strong>{dataSource}</strong> mode.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Alumni profiles" value={stats.alumniCount} helper="Public-safe directory records or sample profiles." />
        <AdminStatCard label="Available mentors" value={stats.mentorsCount} helper="Brothers marked ready to support mentorship." />
        <AdminStatCard label="Published events" value={stats.upcomingEvents} helper="Flagship and recurring alumni touchpoints." />
        <AdminStatCard label="Newsletter issues" value={stats.newsletterCount} helper="Archiveable communications ready for email workflows later." />
        <AdminStatCard label="Pending legacy items" value={stats.pendingLegacySubmissions} helper="Archive submissions awaiting review in a real workflow." />
        <AdminStatCard label="Contact submissions" value={stats.unreadContacts} helper="General inquiries and reconnection requests." />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <AdminListCard title="Recent alumni" description="Most recent records or sample profiles." items={recent.recentAlumni} />
        <AdminListCard title="Recent events" description="Latest published events and featured programming." items={recent.recentEvents} />
        <AdminListCard title="Recent newsletters" description="Communication archive status and issue cadence." items={recent.recentNewsletters} />
      </div>
    </div>
  );
}
