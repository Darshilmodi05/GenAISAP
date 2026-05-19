'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-sm bg-surface border border-border px-3 py-2 text-body placeholder:text-text-muted focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-glow-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-fast',
        error && 'border-accent-danger focus-visible:shadow-glow-danger',
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
