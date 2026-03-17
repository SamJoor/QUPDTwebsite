import { AdminDeleteButton } from '@/components/admin/admin-delete-button';
import { AdminEditLink } from '@/components/admin/admin-edit-link';

type Row = {
  id: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  badge?: string;
};

export function AdminTable({ title, rows, deleteEndpoint, exportHref, editBaseHref }: { title: string; rows: Row[]; deleteEndpoint?: string; exportHref?: string; editBaseHref?: string }) {
  return (
    <div className="surface p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl">{title}</h2>
        {exportHref ? (
          <a href={exportHref} className="rounded-full border border-fraternity-burgundy/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-fraternity-burgundy transition hover:bg-fraternity-parchment">
            Export CSV
          </a>
        ) : null}
      </div>
      <div className="mt-5 divide-y divide-black/5">
        {rows.length ? rows.map((row) => (
          <div key={row.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-fraternity-charcoal">{row.primary}</p>
              <p className="text-sm text-fraternity-slate">{row.secondary}</p>
              {row.tertiary ? <p className="text-xs text-fraternity-slate/80">{row.tertiary}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              {row.badge ? <span className="w-fit rounded-full bg-fraternity-parchment px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">{row.badge}</span> : null}
              {editBaseHref ? <AdminEditLink href={`${editBaseHref}/${row.id}/edit`} /> : null}
              {deleteEndpoint ? <AdminDeleteButton endpoint={deleteEndpoint} id={row.id} /> : null}
            </div>
          </div>
        )) : <p className="py-6 text-sm text-fraternity-slate">No records available yet.</p>}
      </div>
    </div>
  );
}
