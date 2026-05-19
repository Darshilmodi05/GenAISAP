'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BarChartProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const barData = [
  { label: 'Jan', value: 65, color: 'violet' },
  { label: 'Feb', value: 82, color: 'violet' },
  { label: 'Mar', value: 74, color: 'violet' },
  { label: 'Apr', value: 91, color: 'cyan' },
  { label: 'May', value: 88, color: 'cyan' },
  { label: 'Jun', value: 100, color: 'cyan' },
];

const maxVal = Math.max(...barData.map((d) => d.value));

export const BarChart = ({ title = 'Revenue Cluster', subtitle = 'H1 Actualized vs. Neural Target', className }: BarChartProps) => {
  return (
    <div className={cn('w-full glass-card rounded-[3rem] p-10 flex flex-col gap-8 relative overflow-hidden group', className)}>
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{subtitle}</p>
          <h4 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h4>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-primary/10 border border-primary/20">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Live Feed</span>
        </div>
      </div>

      <div className="flex items-end gap-4 h-48 relative z-10 px-2">
        {/* Horizontal grid lines */}
        <div className="absolute inset-x-2 inset-y-0 flex flex-col justify-between pointer-events-none">
          {[100, 75, 50, 25].map((v) => (
            <div key={v} className="flex items-center gap-3">
              <span className="text-[8px] font-black text-text-muted/40 uppercase w-6 text-right shrink-0">{v}</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
          ))}
        </div>

        {barData.map((bar, i) => {
          const heightPct = (bar.value / maxVal) * 100;
          return (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group/bar relative">
              {/* Value tooltip on hover */}
              <div className="absolute bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] font-black text-white bg-white/10 backdrop-blur px-2 py-1 rounded-lg">
                  {bar.value}%
                </span>
              </div>

              {/* Bar */}
              <div className="w-full relative flex items-end justify-center" style={{ height: '100%' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 1.2, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className={cn(
                    'w-full rounded-t-2xl relative overflow-hidden cursor-pointer group-hover/bar:brightness-125 transition-all duration-500',
                    bar.color === 'violet'
                      ? 'bg-gradient-to-t from-primary/30 via-primary/60 to-primary shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                      : 'bg-gradient-to-t from-secondary/30 via-secondary/60 to-secondary shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                  )}
                >
                  {/* Shine cap */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/30 rounded-t-2xl" />
                  {/* Shimmer */}
                  <motion.div
                    animate={{ left: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                </motion.div>
              </div>

              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{bar.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
