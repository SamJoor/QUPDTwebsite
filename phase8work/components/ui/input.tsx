import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-fraternity-charcoal outline-none transition focus:border-fraternity-burgundy focus:ring-2 focus:ring-fraternity-burgundy/15',
        className
      )}
      {...props}
    />
  );
}
