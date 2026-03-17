import { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export function Checkbox({ className, label, ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  if (label) {
    return (
      <label className="inline-flex items-center gap-3 text-sm font-medium text-fraternity-charcoal">
        <input type="checkbox" className={cn('h-4 w-4 rounded border-black/20 text-fraternity-burgundy focus:ring-fraternity-burgundy/20', className)} {...props} />
        <span>{label}</span>
      </label>
    );
  }

  return <input type="checkbox" className={cn('h-4 w-4 rounded border-black/20 text-fraternity-burgundy focus:ring-fraternity-burgundy/20', className)} {...props} />;
}
