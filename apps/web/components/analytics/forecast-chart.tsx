'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Neural Forecast Chart
 * Uses Framer Motion for high-fidelity path animations and executive aesthetics.
 */
export const ForecastChart = () => {
  // Mock time-series data
  const historicalData = [10, 15, 12, 18, 22, 20, 25];
  const forecastData = [25, 28, 32, 30, 35, 40];
  const confidenceUpper = [25, 30, 36, 35, 42, 50];
  const confidenceLower = [25, 26, 28, 25, 28, 30];

  const width = 800;
  const height = 300;
  const padding = 40;

  const getX = (i: number, total: number) => (i / (total - 1)) * (width - padding * 2) + padding;
  const getY = (val: number) => height - ((val / 50) * (height - padding * 2) + padding);

  const historicalPath = historicalData
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i, historicalData.length + forecastData.length - 1)} ${getY(v)}`)
    .join(' ');

  const forecastStartIdx = historicalData.length - 1;
  const forecastPath = forecastData
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i + forecastStartIdx, historicalData.length + forecastData.length - 1)} ${getY(v)}`)
    .join(' ');

  const areaPath = [
    ...confidenceUpper.map((v, i) => `${i === 0 ? 'M' : 'L'} ${getX(i + forecastStartIdx, historicalData.length + forecastData.length - 1)} ${getY(v)}`),
    ...[...confidenceLower].reverse().map((v, i) => `L ${getX((forecastData.length - 1 - i) + forecastStartIdx, historicalData.length + forecastData.length - 1)} ${getY(v)}`),
    'Z'
  ].join(' ');

  return (
    <div className="w-full h-[400px] glass-card rounded-[3rem] p-10 flex flex-col gap-6 relative overflow-hidden group">
      <div className="flex items-center justify-between relative z-10">
         <div className="space-y-1">
            <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">ML Projections</h4>
            <p className="text-2xl font-black text-white uppercase tracking-tight">Revenue Forecast <span className="text-primary">Q3-Q4</span></p>
         </div>
         <div className="flex gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
               <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Historical</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2.5 h-2.5 rounded-full bg-primary" />
               <span className="text-[9px] font-black text-primary uppercase tracking-widest">Neural AI</span>
            </div>
         </div>
      </div>

      <div className="flex-1 relative mt-10">
        <svg width="100%" height="100%" viewBox={`0 ${height} ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
          {/* Grid Lines */}
          {[0, 10, 20, 30, 40, 50].map((v) => (
            <line 
              key={v} 
              x1={padding} y1={getY(v)} x2={width - padding} y2={getY(v)} 
              stroke="white" strokeWidth="0.5" strokeOpacity="0.05" 
            />
          ))}

          {/* Confidence Area */}
          <motion.path 
            d={areaPath} 
            fill="url(#forecast-gradient)" 
            fillOpacity="0.1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
          />

          {/* Historical Line */}
          <motion.path 
            d={historicalPath} 
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Forecast Line */}
          <motion.path 
            d={forecastPath} 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="4"
            strokeDasharray="8 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 1.5, ease: "easeInOut" }}
          />

          {/* Data Points */}
          {historicalData.map((v, i) => (
            <motion.circle 
              key={`h-${i}`} 
              cx={getX(i, historicalData.length + forecastData.length - 1)} cy={getY(v)} 
              r="4" fill="white" 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}

          <defs>
            <linearGradient id="forecast-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>

        {/* Floating Tooltip Mock */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3 }}
          className="absolute right-10 top-1/2 -translate-y-1/2 glass-card p-6 border-primary/30 rounded-2xl shadow-glow-primary"
        >
           <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">AI Projection</p>
           <p className="text-xl font-black text-white leading-none">$42.4M</p>
           <p className="text-[8px] font-bold text-text-muted mt-2 uppercase tracking-widest">Confidence: 94.2%</p>
        </motion.div>
      </div>

      {/* Decorative Neural Mesh */}
      <div className="absolute inset-0 bg-neural-mesh opacity-[0.03] pointer-events-none" />
    </div>
  );
};
