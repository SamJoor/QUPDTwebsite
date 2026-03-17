import { ReactNode } from 'react';

export function AdminRecordCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="surface p-6">
      <div className="mb-5">
        <h2 className="text-2xl">{title}</h2>
        <p className="mt-2 text-sm text-fraternity-slate">{description}</p>
      </div>
      {children}
    </div>
  );
}
