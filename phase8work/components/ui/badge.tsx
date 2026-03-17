import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex rounded-full bg-fraternity-parchment px-3 py-1 text-xs font-semibold text-fraternity-burgundy', className)}>
      {children}
    </span>
  );
}
