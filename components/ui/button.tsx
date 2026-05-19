'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border-active disabled:opacity-35 disabled:cursor-not-allowed select-none';

    const variantStyles = {
      primary: 'bg-primary text-text-inverse hover:bg-primary-hover active:scale-[0.98]',
      secondary:
        'bg-surface-elevated text-text-secondary border border-border hover:bg-surface-highlight hover:text-text-primary hover:border-border-hover active:scale-[0.98]',
      ghost:
        'text-text-muted hover:bg-surface-elevated hover:text-text-secondary active:scale-[0.98]',
      danger: 'bg-accent-danger/10 text-accent-danger border border-accent-danger/20 hover:bg-accent-danger/20 active:scale-[0.98]',
      outline:
        'border border-border text-text-secondary hover:border-border-hover hover:text-text-primary active:scale-[0.98]',
    };

    const sizeStyles = {
      xs: 'h-6 px-2.5 text-[11px] tracking-wide',
      sm: 'h-8 px-3 text-[12px] tracking-wide',
      md: 'h-9 px-4 text-[13px]',
      lg: 'h-11 px-5 text-[14px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
