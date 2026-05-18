'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const trendData = [22, 30, 27, 40, 38, 50, 45, 62, 58, 70, 65, 80];
const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const W = 800;
const H = 220;
const PAD = 40;

const minVal = Math.min(...trendData);
const maxValT = Math.max(...trendData);

const getX = (i: number) => (i / (trendData.length - 1)) * (W - PAD * 2) + PAD;
const getY = (v: number) => H - ((v - minVal) / (maxValT - minVal)) * (H - PAD * 2) - PAD;

const linePath = trendData.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`).join(' ');
const areaPath = [
  ...trendData.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`),
  `L ${getX(trendData.length - 1)} ${H - PAD}`,
  `L ${getX(0)} ${H - PAD}`,
  'Z',
].join(' ');

export const TrendChart = ({ title = 'Growth Trajectory', subtitle = 'Year-on-Year Neural Momentum', className }: TrendChartProps) => {
  const [activePoint, setActivePoint] = React.useState<number | null>(null);

  return (
    <div className={cn('w-full glass-card rounded-[3rem] p-10 flex flex-col gap-8 relative overflow-hidden group', className)}>
      {/* Subtle glow */}
      <div className="absolute bottom-0 right-0 w-96 h-48 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{subtitle}</p>
          <h4 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h4>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <TrendingUp size={14} className="text-emerald-400" />
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.3em]">+62% YoY</span>
        </div>
      </div>

      <div className="relative z-10 flex-1" style={{ height: H }}>
        <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="overflow-visible">
          <defs>
            <linearGradient id="trend-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => {
            const y = H - PAD - (pct / 100) * (H - PAD * 2);
            return (
              <line key={pct} x1={PAD} y1={y} x2={W - PAD} y2={y}
                stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
            );
          })}

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill="url(#trend-area-gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {trendData.map((v, i) => (
            <g key={i}>
              {/* Invisible larger hit area */}
              <circle
                cx={getX(i)} cy={getY(v)} r={16}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setActivePoint(i)}
                onMouseLeave={() => setActivePoint(null)}
              />
              <motion.circle
                cx={getX(i)} cy={getY(v)}
                r={activePoint === i ? 7 : 4}
                fill={activePoint === i ? '#10b981' : 'white'}
                stroke={activePoint === i ? '#10b981' : 'transparent'}
                strokeWidth="6"
                strokeOpacity="0.2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2 + i * 0.05, type: 'spring' }}
                style={{ filter: activePoint === i ? '0 0 12px rgba(16,185,129,0.8)' : 'none' }}
              />
              {/* Tooltip */}
              {activePoint === i && (
                <g>
                  <rect
                    x={getX(i) - 30} y={getY(v) - 40}
                    width={60} height={28} rx={8}
                    fill="rgba(16,185,129,0.15)"
                    stroke="rgba(16,185,129,0.3)"
                    strokeWidth="1"
                  />
                  <text
                    x={getX(i)} y={getY(v) - 22}
                    textAnchor="middle"
                    fill="white"
                    fontSize="12"
                    fontWeight="900"
                  >
                    {v}M
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between px-10 mt-2">
          {labels.map((l, i) => (
            <span
              key={l}
              className={cn(
                'text-[8px] font-black uppercase tracking-widest transition-colors duration-300',
                activePoint === i ? 'text-emerald-400' : 'text-text-muted/40'
              )}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
