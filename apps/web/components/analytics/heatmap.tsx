'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeatmapProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const MODULES = ['FICO', 'SD', 'MM', 'HR', 'PP'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Simulated transaction intensity grid [module][day]
const heatData: number[][] = [
  [85, 92, 78, 95, 88, 42, 30],
  [70, 65, 80, 75, 90, 38, 20],
  [55, 72, 68, 82, 76, 60, 35],
  [40, 45, 50, 48, 55, 25, 12],
  [90, 88, 95, 100, 92, 48, 22],
];

function getColor(value: number): { bg: string; text: string } {
  if (value >= 90) return { bg: 'rgba(124,58,237,0.9)', text: 'white' };
  if (value >= 75) return { bg: 'rgba(124,58,237,0.6)', text: 'white' };
  if (value >= 55) return { bg: 'rgba(124,58,237,0.35)', text: 'rgba(255,255,255,0.7)' };
  if (value >= 35) return { bg: 'rgba(124,58,237,0.18)', text: 'rgba(255,255,255,0.5)' };
  return { bg: 'rgba(255,255,255,0.04)', text: 'rgba(255,255,255,0.25)' };
}

export const Heatmap = ({ title = 'Transaction Heatmap', subtitle = 'Weekly Module Activity Intensity', className }: HeatmapProps) => {
  const [hovered, setHovered] = React.useState<{ m: number; d: number } | null>(null);

  return (
    <div className={cn('w-full glass-card rounded-[3rem] p-10 flex flex-col gap-8 relative overflow-hidden', className)}>
      {/* Background glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{subtitle}</p>
          <h4 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h4>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">Low</span>
          {[0.08, 0.2, 0.4, 0.65, 0.9].map((op, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-lg"
              style={{ backgroundColor: `rgba(124,58,237,${op})` }}
            />
          ))}
          <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">High</span>
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        {/* Day headers */}
        <div className="flex gap-3 pl-20">
          {DAYS.map((d) => (
            <div key={d} className="flex-1 text-center">
              <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">{d}</span>
            </div>
          ))}
        </div>

        {/* Grid rows */}
        {MODULES.map((mod, mIdx) => (
          <div key={mod} className="flex items-center gap-3">
            {/* Module label */}
            <div className="w-16 shrink-0 text-right">
              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{mod}</span>
            </div>

            {/* Cells */}
            {DAYS.map((_, dIdx) => {
              const val = heatData[mIdx][dIdx];
              const { bg, text } = getColor(val);
              const isHovered = hovered?.m === mIdx && hovered?.d === dIdx;

              return (
                <motion.div
                  key={dIdx}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (mIdx * 7 + dIdx) * 0.015, duration: 0.4 }}
                  whileHover={{ scale: 1.15, zIndex: 10 }}
                  onMouseEnter={() => setHovered({ m: mIdx, d: dIdx })}
                  onMouseLeave={() => setHovered(null)}
                  className="flex-1 aspect-square rounded-2xl flex items-center justify-center cursor-pointer relative transition-all duration-200"
                  style={{
                    backgroundColor: bg,
                    boxShadow: isHovered ? `0 0 20px ${bg}` : 'none',
                  }}
                >
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.8 }}
                      animate={{ opacity: 1, y: -44, scale: 1 }}
                      className="absolute top-0 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                    >
                      <div className="bg-black/80 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-center whitespace-nowrap">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest">{mod} • {DAYS[dIdx]}</p>
                        <p className="text-lg font-black text-white leading-none">{val}</p>
                      </div>
                    </motion.div>
                  )}
                  <span className="text-[9px] font-black" style={{ color: text }}>{val}</span>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
