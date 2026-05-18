'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ModuleUsageChartProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const usageData = [
  { module: 'FICO', users: 142, transactions: 18400, health: 98, color: '#7c3aed', glow: 'rgba(124,58,237,0.5)' },
  { module: 'SD', users: 89, transactions: 12200, health: 95, color: '#06b6d4', glow: 'rgba(6,182,212,0.5)' },
  { module: 'MM', users: 56, transactions: 9800, health: 72, color: '#10b981', glow: 'rgba(16,185,129,0.5)' },
  { module: 'HR', users: 34, transactions: 5100, health: 89, color: '#f59e0b', glow: 'rgba(245,158,11,0.5)' },
  { module: 'PP', users: 21, transactions: 3200, health: 91, color: '#ec4899', glow: 'rgba(236,72,153,0.5)' },
];

const maxTx = Math.max(...usageData.map((d) => d.transactions));

export const ModuleUsageChart = ({ title = 'Module Usage', subtitle = 'Active Users & Transaction Volume', className }: ModuleUsageChartProps) => {
  const [activeRow, setActiveRow] = React.useState<string | null>(null);

  return (
    <div className={cn('w-full glass-card rounded-[3rem] p-10 flex flex-col gap-8 relative overflow-hidden', className)}>
      <div className="absolute bottom-0 right-0 w-80 h-40 bg-secondary/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 space-y-1">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{subtitle}</p>
        <h4 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h4>
      </div>

      {/* Column Headers */}
      <div className="relative z-10 grid grid-cols-12 gap-4 px-2 pb-2 border-b border-white/5">
        <span className="col-span-2 text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">Module</span>
        <span className="col-span-2 text-[8px] font-black text-text-muted uppercase tracking-[0.3em] text-center">Users</span>
        <span className="col-span-5 text-[8px] font-black text-text-muted uppercase tracking-[0.3em]">Tx Volume</span>
        <span className="col-span-3 text-[8px] font-black text-text-muted uppercase tracking-[0.3em] text-right">Health</span>
      </div>

      {/* Data Rows */}
      <div className="relative z-10 space-y-4">
        {usageData.map((row, i) => {
          const pct = (row.transactions / maxTx) * 100;
          const isActive = activeRow === row.module;

          return (
            <motion.div
              key={row.module}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ x: 6 }}
              onMouseEnter={() => setActiveRow(row.module)}
              onMouseLeave={() => setActiveRow(null)}
              className={cn(
                'grid grid-cols-12 gap-4 items-center px-4 py-5 rounded-2xl transition-all duration-300 cursor-pointer',
                isActive ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
              )}
            >
              {/* Module Badge */}
              <div className="col-span-2">
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl"
                  style={{
                    color: row.color,
                    backgroundColor: `${row.color}18`,
                    boxShadow: isActive ? `0 0 12px ${row.glow}` : 'none',
                  }}
                >
                  {row.module}
                </span>
              </div>

              {/* User Count */}
              <div className="col-span-2 text-center">
                <span className="text-2xl font-black text-white">{row.users}</span>
              </div>

              {/* Volume Bar */}
              <div className="col-span-5 space-y-1.5">
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                      background: `linear-gradient(90deg, ${row.color}60, ${row.color})`,
                      boxShadow: isActive ? `0 0 12px ${row.glow}` : 'none',
                    }}
                  >
                    <motion.div
                      animate={{ left: ['-40%', '140%'] }}
                      transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  </motion.div>
                </div>
                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">
                  {(row.transactions / 1000).toFixed(1)}K txns
                </span>
              </div>

              {/* Health Score */}
              <div className="col-span-3 flex items-center justify-end gap-3">
                <span
                  className={cn(
                    'text-xs font-black',
                    row.health >= 90 ? 'text-emerald-400' : row.health >= 75 ? 'text-amber-400' : 'text-rose-400'
                  )}
                >
                  {row.health}%
                </span>
                {/* Mini spark indicator */}
                <div className="flex gap-0.5 items-end h-5">
                  {[0.4, 0.7, 0.5, 0.9, row.health / 100].map((h, si) => (
                    <motion.div
                      key={si}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 + si * 0.05 }}
                      className="w-1 rounded-sm origin-bottom"
                      style={{
                        height: `${h * 100}%`,
                        backgroundColor: row.health >= 90 ? '#10b981' : row.health >= 75 ? '#f59e0b' : '#f43f5e',
                        opacity: si === 4 ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
