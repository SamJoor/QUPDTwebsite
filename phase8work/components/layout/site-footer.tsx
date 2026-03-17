import Link from 'next/link';
import { Container } from '@/components/layout/container';

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/70 py-12">
      <Container className="grid gap-10 md:grid-cols-3">
        <div>
          <h3 className="text-xl font-semibold text-fraternity-burgundy">Phi Delta Theta</h3>
          <p className="mt-3 max-w-md text-sm">
            Built to preserve chapter legacy, strengthen alumni connection, and create a lasting digital home for lifelong brotherhood.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-slate">Explore</h4>
          <div className="mt-4 space-y-2 text-sm">
            <Link href="/alumni" className="block hover:text-fraternity-burgundy">Alumni Directory</Link>
            <Link href="/events" className="block hover:text-fraternity-burgundy">Events</Link>
            <Link href="/mentorship" className="block hover:text-fraternity-burgundy">Mentorship</Link>
            <Link href="/legacy-vault" className="block hover:text-fraternity-burgundy">Legacy Vault</Link>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-fraternity-slate">Contact</h4>
          <div className="mt-4 space-y-2 text-sm text-fraternity-slate">
            <p>alumni@phidelt.example</p>
            <p>Chapter Communications Office</p>
            <p>Built for long-term chapter stewardship</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
