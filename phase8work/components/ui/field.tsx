import { ReactNode } from 'react';

export function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <div>
        <span className="text-sm font-medium text-fraternity-charcoal">{label}</span>
        {hint ? <p className="mt-1 text-xs text-fraternity-slate">{hint}</p> : null}
      </div>
      {children}
      {error ? <p className="text-xs font-medium text-red-700">{error}</p> : null}
    </label>
  );
}
