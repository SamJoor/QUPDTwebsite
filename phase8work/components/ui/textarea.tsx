import { TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'min-h-32 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-fraternity-charcoal outline-none transition focus:border-fraternity-burgundy focus:ring-2 focus:ring-fraternity-burgundy/15',
        className
      )}
      {...props}
    />
  );
}
