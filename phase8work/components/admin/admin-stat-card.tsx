export function AdminStatCard({ label, value, helper }: { label: string; value: string | number; helper?: string }) {
  return (
    <div className="surface p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-fraternity-slate">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-fraternity-charcoal">{value}</p>
      {helper ? <p className="mt-3 text-sm text-fraternity-slate">{helper}</p> : null}
    </div>
  );
}
