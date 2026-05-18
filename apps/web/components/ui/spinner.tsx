'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizeStyles = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
    };

    return (
      <div ref={ref} {...props}>
        <div
          className={cn(
            'border-2 border-current border-t-transparent rounded-full animate-spin',
            sizeStyles[size],
            className
          )}
        />
      </div>
    );
  }
);
Spinner.displayName = 'Spinner';

export { Spinner };
