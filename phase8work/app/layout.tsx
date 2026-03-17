import type { ReactNode } from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/constants/site';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
