import { Stat } from '@/types';

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="surface p-6">
      <div className="text-3xl font-semibold text-fraternity-burgundy">{stat.value}</div>
      <div className="mt-2 text-sm font-medium text-fraternity-charcoal">{stat.label}</div>
      {stat.description ? <p className="mt-3 text-sm">{stat.description}</p> : null}
    </div>
  );
}
