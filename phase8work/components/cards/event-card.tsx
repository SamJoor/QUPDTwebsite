import Link from 'next/link';
import { EventItem } from '@/types';
import { Badge } from '@/components/ui/badge';

export function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="surface flex h-full flex-col p-6">
      <div className="flex items-center justify-between gap-3">
        <Badge>{event.date}</Badge>
        {event.featured ? <Badge className="bg-fraternity-burgundy text-white">Featured</Badge> : null}
      </div>
      <h3 className="mt-5 text-2xl">{event.title}</h3>
      <p className="mt-3 text-sm font-medium text-fraternity-charcoal">{event.time} · {event.location}</p>
      <p className="mt-4 flex-1">{event.description}</p>
      <Link href={`/events/${event.slug}`} className="mt-6 text-sm font-semibold text-fraternity-burgundy hover:underline">
        View details
      </Link>
    </div>
  );
}
