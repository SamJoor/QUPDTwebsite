import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variants = {
  primary: 'bg-fraternity-burgundy text-white hover:bg-fraternity-burgundyDeep',
  secondary: 'bg-white text-fraternity-charcoal ring-1 ring-black/10 hover:bg-fraternity-parchment',
  ghost: 'text-fraternity-burgundy hover:bg-fraternity-parchment'
};

export function Button({ children, href, variant = 'primary', className, type = 'submit', ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors',
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
