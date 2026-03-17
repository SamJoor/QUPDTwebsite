export function AdminListCard({ title, description, items }: { title: string; description: string; items: { primary: string; secondary: string; status: string }[] }) {
  return (
    <div className="surface p-6">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-3 text-sm text-fraternity-slate">{description}</p>
      <div className="mt-6 space-y-4">
        {items.length ? items.map((item) => (
          <div key={`${item.primary}-${item.secondary}`} className="rounded-2xl border border-fraternity-charcoal/10 bg-white/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-fraternity-charcoal">{item.primary}</p>
                <p className="mt-1 text-sm text-fraternity-slate">{item.secondary}</p>
              </div>
              <span className="rounded-full bg-fraternity-burgundy/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">{item.status}</span>
            </div>
          </div>
        )) : <p className="text-sm text-fraternity-slate">No items yet.</p>}
      </div>
    </div>
  );
}
