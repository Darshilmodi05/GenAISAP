'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'offline' | 'away';
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, initials, size = 'md', status, ...props }, ref) => {
    const sizeStyles = {
      sm: 'w-10 h-10 text-[10px]',
      md: 'w-14 h-14 text-xs',
      lg: 'w-20 h-20 text-xl',
      xl: 'w-32 h-32 text-3xl',
    };

    const statusStyles = {
      active: 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]',
      offline: 'bg-white/10 shadow-none',
      away: 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    };

    return (
      <div ref={ref} className="relative group/avatar" {...props}>
        <div
          className={cn(
            'relative flex items-center justify-center rounded-[35%] glass-card border-white/10 overflow-hidden transition-all duration-700 group-hover/avatar:rounded-[25%] group-hover/avatar:border-primary/40 group-hover/avatar:scale-105',
            sizeStyles[size],
            className
          )}
        >
          {src ? (
            <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
          ) : (
            <span className="font-black text-white uppercase tracking-widest">{initials}</span>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
        </div>
        
        {status && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#030305] z-10',
              statusStyles[status]
            )}
          >
             {status === 'active' && (
               <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-40" />
             )}
          </motion.div>
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };

