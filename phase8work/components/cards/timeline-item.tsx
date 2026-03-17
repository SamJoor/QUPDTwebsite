import { TimelineEntry } from '@/types';

export function TimelineItem({ item }: { item: TimelineEntry }) {
  return (
    <div className="relative border-l border-fraternity-gold pl-6">
      <div className="absolute left-[-6px] top-1 h-3 w-3 rounded-full bg-fraternity-burgundy" />
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">{item.year}</p>
      <h3 className="mt-2 text-2xl">{item.title}</h3>
      <p className="mt-3">{item.description}</p>
    </div>
  );
}
