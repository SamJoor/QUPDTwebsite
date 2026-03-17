import { Spotlight } from '@/types';

export function SpotlightCard({ spotlight }: { spotlight: Spotlight }) {
  return (
    <div className="surface p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-burgundy">Alumni Spotlight</p>
      <h3 className="mt-4 text-3xl">{spotlight.name}</h3>
      <p className="mt-2 text-sm font-medium text-fraternity-charcoal">{spotlight.role}</p>
      <blockquote className="mt-6 border-l-2 border-fraternity-gold pl-4 font-serif text-xl text-fraternity-charcoal">
        “{spotlight.quote}”
      </blockquote>
      <p className="mt-6">{spotlight.story}</p>
    </div>
  );
}
