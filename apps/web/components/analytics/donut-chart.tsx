'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DonutChartProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const segments = [
  { label: 'FICO', value: 42, color: '#7c3aed', glowColor: 'rgba(124,58,237,0.6)' },
  { label: 'SD', value: 28, color: '#06b6d4', glowColor: 'rgba(6,182,212,0.6)' },
  { label: 'MM', value: 20, color: '#10b981', glowColor: 'rgba(16,185,129,0.6)' },
  { label: 'HR', value: 10, color: 'rgba(255,255,255,0.15)', glowColor: 'rgba(255,255,255,0.1)' },
];

// SVG donut math
const SIZE = 200;
const STROKE = 28;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

function getSegments() {
  let offset = 0;
  return segments.map((seg) => {
    const pct = seg.value / 100;
    const dash = pct * CIRCUMFERENCE;
    const gap = CIRCUMFERENCE - dash;
    const result = { ...seg, dash, gap, offset };
    offset += dash;
    return result;
  });
}

const computed = getSegments();

export const DonutChart = ({ title = 'Module Distribution', subtitle = 'Resource Allocation by SAP Node', className }: DonutChartProps) => {
  const [hovered, setHovered] = React.useState<string | null>(null);

  const activeSegment = hovered ? segments.find((s) => s.label === hovered) : null;

  return (
    <div className={cn('w-full glass-card rounded-[3rem] p-10 flex flex-col gap-8 relative overflow-hidden group', className)}>
      <div className="relative z-10 space-y-1">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{subtitle}</p>
        <h4 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h4>
      </div>

      <div className="flex items-center gap-10 relative z-10">
        {/* SVG Donut */}
        <div className="relative shrink-0 w-[200px] h-[200px]">
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
            {/* Track */}
            <circle
              cx={CENTER} cy={CENTER} r={RADIUS}
              fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={STROKE}
            />
            {computed.map((seg) => (
              <motion.circle
                key={seg.label}
                cx={CENTER} cy={CENTER} r={RADIUS}
                fill="none"
                stroke={seg.color}
                strokeWidth={hovered === seg.label ? STROKE + 6 : STROKE}
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={-seg.offset}
                strokeLinecap="round"
                style={{ filter: hovered === seg.label ? `drop-shadow(0 0 8px ${seg.glowColor})` : 'none' }}
                initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
                animate={{ strokeDasharray: `${seg.dash} ${seg.gap}` }}
                transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(seg.label)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer transition-all duration-300"
              />
            ))}
          </svg>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {activeSegment ? (
              <>
                <motion.span
                  key={activeSegment.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-4xl font-black text-white leading-none"
                >
                  {activeSegment.value}%
                </motion.span>
                <span className="text-[9px] font-black uppercase tracking-widest mt-1" style={{ color: activeSegment.color }}>
                  {activeSegment.label}
                </span>
              </>
            ) : (
              <>
                <span className="text-4xl font-black text-white leading-none">100%</span>
                <span className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-1">Allocation</span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-5">
          {segments.map((seg) => (
            <motion.div
              key={seg.label}
              whileHover={{ x: 6 }}
              onMouseEnter={() => setHovered(seg.label)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'flex items-center justify-between p-4 rounded-2xl transition-all duration-300 cursor-pointer',
                hovered === seg.label ? 'bg-white/5' : 'hover:bg-white/[0.02]'
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color, boxShadow: hovered === seg.label ? `0 0 10px ${seg.glowColor}` : 'none' }} />
                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">{seg.label}</span>
              </div>
              <span className="text-lg font-black text-white">{seg.value}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
