'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, TrendingUp } from 'lucide-react';

/**
 * Institutional Anomaly Detection Chart
 * Visualizes transactional spikes and neural cluster shifts.
 */
export const AnomalyChart = () => {
  // Mock data for anomaly points
  const data = [12, 14, 13, 45, 15, 12, 16, 52, 14, 18, 15, 13];
  const anomalies = [3, 7]; // Indices of anomalous spikes

  const width = 800;
  const height = 300;
  const padding = 40;

  const getX = (i: number) => (i / (data.length - 1)) * (width - padding * 2) + padding;
  const getY = (val: number) => height - ((val / 60) * (height - padding * 2) + padding);

  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`)
    .join(' ');

  return (
    <div className="w-full h-[400px] glass-card rounded-[3rem] p-10 flex flex-col gap-6 relative overflow-hidden group border-rose-500/10">
      <div className="flex items-center justify-between relative z-10">
         <div className="space-y-1">
            <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">Anomaly Intelligence</h4>
            <p className="text-2xl font-black text-white uppercase tracking-tight">Transactional <span className="text-rose-400">Spike Detection</span></p>
         </div>
         <div className="flex gap-4">
            <div className="px-6 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
               <ShieldAlert size={14} className="text-rose-400" />
               <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">2 Anomalies Detected</span>
            </div>
         </div>
      </div>

      <div className="flex-1 relative mt-10">
        <svg width="100%" height="100%" viewBox={`0 ${height} ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
          {/* Baseline Area */}
          <rect 
            x={padding} y={getY(25)} width={width - padding * 2} height={height - getY(25) - padding} 
            fill="white" fillOpacity="0.02" 
          />
          <line 
            x1={padding} y1={getY(25)} x2={width - padding} y2={getY(25)} 
            stroke="white" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.1" 
          />

          {/* Main Data Path */}
          <motion.path 
            d={path} 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeOpacity="0.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Anomaly Indicators */}
          {anomalies.map((idx) => {
            const x = getX(idx);
            const y = getY(data[idx]);
            return (
              <React.Fragment key={idx}>
                {/* Connection Line */}
                <motion.line 
                  x1={x} y1={y} x2={x} y2={height - padding} 
                  stroke="var(--rose-400)" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                />
                {/* Pulse Ring */}
                <motion.circle 
                  cx={x} cy={y} r="12" fill="var(--rose-400)" fillOpacity="0.1"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                {/* Spike Point */}
                <motion.circle 
                  cx={x} cy={y} r="4" fill="var(--rose-400)" 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  className="shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* Neural Analysis Overlay */}
        <div className="absolute left-10 bottom-10 flex gap-8">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-rose-400">
                 <Zap size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Heuristic Sync</p>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">Active</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                 <TrendingUp size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Confidence</p>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">98.4%</p>
              </div>
           </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-neural-mesh opacity-[0.02] pointer-events-none" />
    </div>
  );
};
