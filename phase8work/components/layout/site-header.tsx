'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navItems, siteConfig } from '@/lib/constants/site';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import type { SessionRole } from '@/types';

function getPortalLink(role: SessionRole | null) {
  if (role === 'active') {
    return {
      href: '/active',
      label: 'Member Portal',
    };
  }

  if (role === 'alumni') {
    return {
      href: '/member',
      label: 'Alumni Portal',
    };
  }

  if (role === 'admin') {
    return {
      href: '/admin',
      label: 'Admin Portal',
    };
  }

  return {
    href: '/active/login',
    label: 'Active Member Sign In',
  };
}

export function SiteHeader({ role }: { role: SessionRole | null }) {
  const [open, setOpen] = useState(false);
  const portalLink = getPortalLink(role);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-fraternity-cream/90 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-lg font-semibold text-fraternity-burgundy">
            {siteConfig.name}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-fraternity-slate">
            {siteConfig.chapter}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-fraternity-charcoal transition hover:text-fraternity-burgundy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href={portalLink.href} variant="secondary">
            {portalLink.label}
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-fraternity-charcoal lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      <div
        className={cn(
          'border-t border-black/5 bg-fraternity-cream lg:hidden',
          open ? 'block' : 'hidden'
        )}
      >
        <Container className="grid gap-2 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-fraternity-charcoal transition hover:bg-white hover:text-fraternity-burgundy"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <Button
              href={portalLink.href}
              variant="secondary"
              className="w-full"
            >
              {portalLink.label}
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}