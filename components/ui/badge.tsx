'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-primary-muted text-primary',
      success: 'bg-[rgba(16,185,129,0.12)] text-accent-success',
      warning: 'bg-[rgba(245,158,11,0.12)] text-accent-warning',
      danger: 'bg-[rgba(239,68,68,0.12)] text-accent-danger',
      info: 'bg-[rgba(6,182,212,0.12)] text-accent-info',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';

export { Badge };
