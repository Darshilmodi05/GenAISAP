'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Institutional Anomaly Detection Chart
 * Visualizes transactional spikes and neural cluster shifts.
 */
export const AnomalyChart = ({
  inventorySlack = 0,
  severityThreshold = 35,
  stabilized = false
}: {
  inventorySlack?: number;
  severityThreshold?: number;
  stabilized?: boolean;
}) => {
  // Base mock data for transaction telemetry
  const baseData = [12, 14, 13, 45, 15, 12, 16, 52, 14, 18, 15, 13];

  // Dynamic values based on inventory slack and system stabilization state
  const data = baseData.map((v, i) => {
    if (stabilized) {
      // Dampen spikes completely to a smooth healthy variance
      return Math.round(12 + (i % 3) * 1.5);
    }
    if (i === 3 || i === 7) {
      return Math.max(10, v + inventorySlack);
    }
    return v;
  });

  // Calculate anomalies dynamically based on the current threshold
  const anomalies = data.reduce((acc, val, idx) => {
    if (val > severityThreshold) {
      acc.push(idx);
    }
    return acc;
  }, [] as number[]);

  const width = 800;
  const height = 300;
  const padding = 40;

  // Auto-scale the Y-axis to accommodate high simulated anomalies
  const maxVal = Math.max(...data, severityThreshold, 70);

  const getX = (i: number) => (i / (data.length - 1)) * (width - padding * 2) + padding;
  const getY = (val: number) => height - ((val / maxVal) * (height - padding * 2) + padding);

  const path = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(v)}`)
    .join(' ');

  return (
    <div className={cn(
      "w-full h-[400px] glass-card rounded-[3rem] p-10 flex flex-col gap-6 relative overflow-hidden group border-white/5 transition-all duration-700",
      anomalies.length > 0 ? "border-rose-500/10 hover:border-rose-500/30" : "border-emerald-500/10 hover:border-emerald-500/30"
    )}>
      <div className="flex items-center justify-between relative z-10">
         <div className="space-y-1">
            <h4 className={cn(
              "text-[10px] font-black uppercase tracking-[0.4em]",
              anomalies.length > 0 ? "text-rose-400" : "text-emerald-400"
            )}>Anomaly Intelligence</h4>
            <p className="text-2xl font-black text-white uppercase tracking-tight">Transactional <span className={anomalies.length > 0 ? "text-rose-400" : "text-emerald-400"}>Spike Detection</span></p>
         </div>
         <div className="flex gap-4">
            <div className={cn(
              "px-6 py-2 rounded-2xl border flex items-center gap-3 transition-colors duration-500 shadow-xl",
              anomalies.length > 0
                ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
            )}>
               {anomalies.length > 0 ? (
                 <ShieldAlert size={14} className="text-rose-400 animate-pulse" />
               ) : (
                 <ShieldCheck size={14} className="text-emerald-400" />
               )}
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                 {anomalies.length > 0 ? `${anomalies.length} Anomalies Detected` : 'Ecosystem Stable'}
               </span>
            </div>
         </div>
      </div>

      <div className="flex-1 relative mt-10">
        <svg width="100%" height="100%" viewBox={`0 ${height} ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
          {/* Dynamic Baseline Shading Area */}
          <motion.rect 
            x={padding} 
            y={getY(severityThreshold)} 
            width={width - padding * 2} 
            height={Math.max(0, height - getY(severityThreshold) - padding)} 
            fill="var(--rose-500)" 
            fillOpacity={anomalies.length > 0 ? "0.02" : "0.0"} 
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />
          
          {/* Dynamic Boundary Threshold Line */}
          <motion.line 
            x1={padding} 
            y1={getY(severityThreshold)} 
            x2={width - padding} 
            y2={getY(severityThreshold)} 
            stroke="var(--rose-400)" 
            strokeWidth="1.5" 
            strokeDasharray="6 4" 
            strokeOpacity="0.4"
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
          />

          <text x={padding + 10} y={getY(severityThreshold) - 6} fill="var(--rose-400)" fillOpacity="0.6" fontSize="8" fontWeight="bold" letterSpacing="1">
            CRITICAL THRESHOLD: {severityThreshold}
          </text>

          {/* Grid lines */}
          {[10, 20, 30, 40, 50, 60].map((v) => (
            <line 
              key={v} 
              x1={padding} y1={getY(v)} x2={width - padding} y2={getY(v)} 
              stroke="white" strokeWidth="0.5" strokeOpacity="0.03" 
            />
          ))}

          {/* Main Data Path */}
          <motion.path 
            d={path} 
            fill="none" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeOpacity="0.25"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
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
                  stroke="var(--rose-400)" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                />
                {/* Pulse Ring */}
                <motion.circle 
                  cx={x} cy={y} r="14" fill="var(--rose-400)" fillOpacity="0.15"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                {/* Spike Point */}
                <motion.circle 
                  cx={x} cy={y} r="5" fill="var(--rose-400)" 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                />
              </React.Fragment>
            );
          })}
        </svg>

        {/* Neural Analysis Overlay */}
        <div className="absolute left-10 bottom-10 flex gap-8">
           <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-500",
                anomalies.length > 0 ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
              )}>
                 <Zap size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Heuristic Sync</p>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">
                   {stabilized ? "Stabilized" : "Active Simulation"}
                 </p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                 <TrendingUp size={18} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Model Precision</p>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">
                   {stabilized ? "99.9%" : "98.4%"}
                 </p>
              </div>
           </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-neural-mesh opacity-[0.02] pointer-events-none" />
    </div>
  );
};
