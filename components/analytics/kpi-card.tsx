'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Activity, Database, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  module?: 'FICO' | 'SD' | 'MM' | 'SYS' | 'PP';
  className?: string;
  color?: 'violet' | 'cyan' | 'emerald';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  icon,
  module,
  className,
  color = 'violet',
}) => {
  const colorStyles = {
    violet: 'hover:border-primary/50 group-hover:bg-primary/5',
    cyan: 'hover:border-secondary/50 group-hover:bg-secondary/5',
    emerald: 'hover:border-accent/50 group-hover:bg-accent/5',
  };

  const accentColors = {
    violet: 'text-primary',
    cyan: 'text-secondary',
    emerald: 'text-accent',
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className={cn(
        'glass-card p-10 rounded-[3rem] relative group overflow-hidden h-full flex flex-col justify-between transition-all duration-700',
        colorStyles[color],
        className
      )}>
        {/* Animated Accent Glow */}
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 transition-opacity duration-1000",
          color === 'violet' ? "bg-primary" : color === 'cyan' ? "bg-secondary" : "bg-accent"
        )} />

        <div className="flex justify-between items-start relative z-10">
           <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl">
              {icon || <Activity size={24} />}
           </div>
           {module && (
             <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black tracking-widest text-text-muted uppercase">
               {module} NODE
             </span>
           )}
        </div>

        <div className="relative z-10 space-y-4">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">{title}</p>
           <div className="space-y-2">
              <h2 className="text-5xl font-black tracking-tighter text-white leading-none">
                 {value}
              </h2>
              {trend && (
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "px-3 py-0.5 rounded-full text-[10px] font-black tracking-widest flex items-center gap-1.5",
                     trend.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                   )}>
                      {trend.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {trend.value}
                   </div>
                   <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Growth Delta</span>
                </div>
              )}
           </div>
        </div>
      </Card>
    </motion.div>
  );
};

