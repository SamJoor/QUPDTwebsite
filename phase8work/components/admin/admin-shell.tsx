import Link from 'next/link';
import { ReactNode } from 'react';
import { siteConfig } from '@/lib/constants/site';
import { SessionUser } from '@/types';
import { LogoutButton } from '@/components/auth/logout-button';

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/alumni', label: 'Alumni' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/newsletters', label: 'Newsletters' },
  { href: '/admin/content', label: 'Site Content' },
  { href: '/admin/import', label: 'CSV Import' },
  { href: '/admin/mentorship', label: 'Mentorship' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/review', label: 'Review Queue' },
  { href: '/admin/submissions', label: 'Submissions' }
];

export function AdminShell({ children, session }: { children: ReactNode; session: SessionUser }) {
  return (
    <main className="min-h-screen bg-fraternity-cream">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="surface h-fit p-6 lg:sticky lg:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-fraternity-burgundy/80">Phi Delta Theta</p>
          <h1 className="mt-3 text-2xl">Admin Workspace</h1>
          <p className="mt-3 text-sm text-fraternity-slate">Signed in as {session.email}. This officer workspace now includes protected routes and starter CRUD flows.</p>
          <nav className="mt-6 space-y-2">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-xl px-3 py-2 text-sm font-medium text-fraternity-charcoal transition hover:bg-fraternity-burgundy hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-2xl bg-fraternity-burgundy px-4 py-5 text-sm text-white/90">
            <p className="font-semibold text-white">Phase 8 note</p>
            <p className="mt-2">Home/About content is now officer-editable, alumni imports can come in by CSV, and graduation-based alumni access can be managed without creating a second profile table.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-fraternity-parchment px-4 py-2 text-sm font-medium text-fraternity-charcoal">Public site</Link>
            <LogoutButton redirectTo="/" />
          </div>
          <p className="mt-6 text-xs text-fraternity-slate">{siteConfig.chapter}</p>
        </aside>
        <section>{children}</section>
      </div>
    </main>
  );
}
