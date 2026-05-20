'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KPICard } from '@/components/analytics/kpi-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ForecastChart } from '@/components/analytics/forecast-chart';
import { AnomalyChart } from '@/components/analytics/anomaly-chart';

const metrics = [
  { title: 'MTD Revenue', value: '$12.45M', trend: { value: '8.4%', isPositive: true }, module: 'FICO' as const, color: 'violet' },
  { title: 'Sales Volume', value: '1,245', trend: { value: '12%', isPositive: false }, module: 'SD' as const, color: 'cyan' },
  { title: 'Inventory Turn', value: '4.2x', trend: { value: '0.5x', isPositive: true }, module: 'MM' as const, color: 'emerald' },
  { title: 'System Load', value: '14.2%', trend: { value: '0.02%', isPositive: true }, module: 'SYS' as const, color: 'violet' },
];

export default function AnalyticsDashboard() {
  const [activeModule, setActiveModule] = React.useState('All');

  // Dynamic simulation variables
  const [driftOffset, setDriftOffset] = React.useState(0);
  const [variance, setVariance] = React.useState(0);
  const [inventorySlack, setInventorySlack] = React.useState(0);
  const [severityThreshold, setSeverityThreshold] = React.useState(35);
  const [stabilized, setStabilized] = React.useState(false);

  const filteredMetrics = activeModule === 'All' 
    ? metrics 
    : metrics.filter(m => m.module === activeModule);

  const getModuleColor = (color: string) => {
    switch (color) {
      case 'violet': return 'bg-violet-500';
      case 'cyan': return 'bg-cyan-500';
      case 'emerald': return 'bg-emerald-500';
      case 'violet-500': return 'bg-violet-500';
      case 'cyan-500': return 'bg-cyan-500';
      case 'emerald-500': return 'bg-emerald-500';
      default: return 'bg-primary';
    }
  };

  const handleStabilize = () => {
    console.log('Initiating Neural Stabilization Protocol...');
    setStabilized(true);
    setInventorySlack(0);
    setDriftOffset(0);
    setVariance(0);
    
    // Hold stabilization for 6 seconds, then restore active simulation mode
    setTimeout(() => {
      setStabilized(false);
    }, 6000);
  };

  return (
    <div className="space-y-16 pb-40 animate-fade-in relative">
      {/* Header Deck */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-4">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
             <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Operational Intelligence Deck</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.05em] leading-[0.8] text-white">
             <span className="text-gradient">ANALYTICS</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 p-2 glass-card rounded-[2.5rem] border-white/10">
          {['All', 'FICO', 'SD', 'MM'].map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveModule(m)}
              className={cn(
                "px-10 py-3 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-700",
                activeModule === m 
                  ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredMetrics.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
               <Card className={cn(
                 "glass-card p-10 rounded-[3rem] relative group overflow-hidden h-[340px] flex flex-col justify-between transition-all duration-700 hover:-translate-y-2",
                 m.color === 'violet' ? "hover:border-violet-500/50" : m.color === 'cyan' ? "hover:border-cyan-500/50" : "hover:border-emerald-500/50"
               )}>
                  <div className={cn(
                    "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-20 transition-opacity group-hover:opacity-40",
                    m.color === 'violet' ? "bg-violet-500" : m.color === 'cyan' ? "bg-cyan-500" : "bg-emerald-500"
                  )} />
                  
                  <div className="flex justify-between items-start">
                     <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>
                     </div>
                     <Badge className="bg-white/5 border-none text-text-muted px-3 py-1 text-[9px] font-black tracking-widest uppercase">{m.module}</Badge>
                  </div>
                  
                  <div className="relative z-10">
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted mb-4">{m.title}</p>
                     <div className="flex items-baseline gap-4">
                        <span className="text-6xl font-black tracking-tighter text-white">
                          {m.title === 'MTD Revenue' && driftOffset !== 0
                            ? `$${(12.45 + driftOffset * 0.1).toFixed(2)}M`
                            : m.value}
                        </span>
                        <span className={cn("text-xs font-bold", m.trend.isPositive ? "text-emerald-400" : "text-rose-400")}>
                          {m.title === 'MTD Revenue' && driftOffset !== 0
                            ? `${(driftOffset > 0 ? '+' : '')}${(8.4 + driftOffset * 0.5).toFixed(1)}%`
                            : m.trend.value}
                        </span>
                     </div>
                  </div>
               </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Massive Intelligence Deck Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card rounded-[4rem] p-16 h-[650px] flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity">
               <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
            </div>
            
            <div className="flex items-center justify-between mb-16">
              <div>
                <h3 className="text-4xl font-black text-white uppercase tracking-tight mb-2">Neural Trajectory</h3>
                <p className="text-xs text-text-muted uppercase tracking-[0.5em] font-black">Predictive Revenue Vectors • Q2_SYNC_V4</p>
              </div>
              <div className="flex gap-10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Actualized</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">Neural Forecast</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex items-end gap-5 px-6 relative">
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none py-6">
                {[...Array(6)].map((_, i) => <div key={i} className="w-full h-[1px] bg-white" />)}
              </div>

              {[45, 62, 55, 78, 88, 72, 85, 95, 82, 98, 92, 100].map((val, i) => {
                const dynamicVal = stabilized ? Math.round(50 + (i % 4) * 8) : Math.max(15, val + driftOffset * 1.5);
                return (
                  <div key={i} className="flex-1 flex flex-col gap-5 items-center h-full relative group/bar">
                    <div className="w-full relative h-full flex items-end justify-center">
                      {/* Forecast Bar */}
                      <div className="absolute bottom-0 w-full bg-secondary/10 border border-secondary/20 rounded-t-3xl transition-all duration-700" style={{ height: `${dynamicVal}%` }} />
                      {/* Actual Bar */}
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(10, dynamicVal - 12 - variance * 0.5)}%` }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full bg-gradient-to-t from-primary/20 via-primary/50 to-primary group-hover/bar:brightness-125 transition-all rounded-t-3xl shadow-[0_0_30px_rgba(124,58,237,0.2)]"
                      >
                         <div className="absolute top-0 inset-x-0 h-1.5 bg-white/40 blur-[2px] rounded-t-3xl" />
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{i+1}M</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>

        {/* Intelligence Instrument Clusters */}
        <div className="space-y-10 flex flex-col h-[650px]">
          <Card className="glass-card rounded-[4rem] p-12 flex-1 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.5em] mb-12">Modular Health</h3>
             <div className="space-y-12">
                {[
                  { m: 'FICO RECON', v: stabilized ? 99 : Math.max(60, Math.min(100, 88 + driftOffset * 0.5)), c: 'violet-500' },
                  { m: 'MM LOGISTICS', v: stabilized ? 98 : Math.max(30, Math.min(100, 74 - inventorySlack)), c: 'cyan-500' },
                  { m: 'SD PIPELINE', v: stabilized ? 95 : Math.max(20, Math.min(100, 42 - variance * 2)), c: 'emerald-500' }
                ].map((item, i) => (
                  <div key={i} className="space-y-5">
                    <div className="flex justify-between items-end">
                      <span className="text-[11px] font-black text-text-secondary uppercase tracking-[0.3em]">{item.m}</span>
                      <span className="text-3xl font-black text-white tracking-tighter">{item.v}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 relative rounded-full overflow-hidden p-[1px] border border-white/5">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.v}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={cn("h-full rounded-full shadow-glow-primary", getModuleColor(item.c))} 
                       />
                       <motion.div 
                        animate={{ left: ['-20%', '120%'] }} 
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }} 
                        className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                       />
                    </div>
                  </div>
                ))}
             </div>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-violet-900 text-white p-12 rounded-[4rem] relative overflow-hidden group h-[260px] flex flex-col justify-center shadow-[0_0_60px_rgba(124,58,237,0.3)] transition-all duration-700">
             <div className="absolute inset-0 bg-neural-mesh opacity-20" />
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-8 h-8 rounded-xl bg-white text-primary flex items-center justify-center font-black text-xs">AI</div>
                   <h4 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Heuristic Engine</h4>
                </div>
                <p className="text-xl font-black leading-tight tracking-tighter mb-8 uppercase h-14 overflow-hidden">
                   {stabilized 
                     ? "Ecosystem Calibrated. Parameters within high-accuracy baseline bounds." 
                     : (inventorySlack > 18
                        ? "CRITICAL MM INVENTORY OVERRUN DETECTED. EXECUTE CALIBRATION." 
                        : "DETECTED MM INVENTORY DRIFT. EXECUTE OPTIMIZATION PROTOCOL."
                       )}
                </p>
                <button 
                  onClick={handleStabilize}
                  disabled={stabilized}
                  className={cn(
                    "w-full h-16 transition-all text-[11px] font-black uppercase tracking-[0.4em] rounded-2xl shadow-2xl active:scale-95",
                    stabilized 
                      ? "bg-emerald-500 text-white cursor-default" 
                      : "bg-white text-black hover:bg-neutral-100"
                  )}
                >
                   {stabilized ? "Ecosystem Stable" : "Stabilize Ecosystem"}
                </button>
             </div>
          </Card>
        </div>
      </div>

      {/* Dynamic Sandbox Control Deck */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="glass-card rounded-[4rem] p-12 border-white/5 relative overflow-hidden group shadow-[0_0_50px_rgba(124,58,237,0.15)] mt-10"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-10 pb-8 border-b border-white/5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary">
              Interactive ML Simulation Suite
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Neural Simulation Control Deck</h3>
            <p className="text-xs text-text-muted">Manually manipulate SAP system variables in real time to simulate variance scenarios, load stress, and test cognitive anomaly triggers.</p>
          </div>
          
          <Button
            onClick={handleStabilize}
            disabled={stabilized}
            className={cn(
              "h-14 px-10 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all duration-700 active:scale-95",
              stabilized
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                : "bg-white text-black hover:bg-neutral-100"
            )}
          >
            {stabilized ? "Ecosystem Standardized • 99.9% Health" : "Stabilize Ecosystem"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Slider 1 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Revenue Drift Offset</span>
              <span className="text-sm font-black text-primary font-mono">{driftOffset > 0 ? `+${driftOffset}` : driftOffset}M</span>
            </div>
            <input
              type="range"
              min="-10"
              max="20"
              step="1"
              value={driftOffset}
              onChange={(e) => {
                setDriftOffset(Number(e.target.value));
                if (stabilized) setStabilized(false);
              }}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p className="text-[9px] text-text-muted">Simulate overall ledger revenue growth or compression drift.</p>
          </div>

          {/* Slider 2 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Forecast Volatility</span>
              <span className="text-sm font-black text-secondary font-mono">{variance > 0 ? `+${variance}` : variance}</span>
            </div>
            <input
              type="range"
              min="-5"
              max="10"
              step="0.5"
              value={variance}
              onChange={(e) => {
                setVariance(Number(e.target.value));
                if (stabilized) setStabilized(false);
              }}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <p className="text-[9px] text-text-muted">Warp future variance projection confidence paths.</p>
          </div>

          {/* Slider 3 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Logistics Inventory Slack</span>
              <span className="text-sm font-black text-rose-400 font-mono">{inventorySlack > 0 ? `+${inventorySlack}` : inventorySlack}%</span>
            </div>
            <input
              type="range"
              min="-10"
              max="35"
              step="1"
              value={inventorySlack}
              onChange={(e) => {
                setInventorySlack(Number(e.target.value));
                if (stabilized) setStabilized(false);
              }}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <p className="text-[9px] text-text-muted">Inject inventory supply chain lags and logistics stress factors.</p>
          </div>

          {/* Slider 4 */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Anomaly Severity Bound</span>
              <span className="text-sm font-black text-white font-mono">{severityThreshold}</span>
            </div>
            <input
              type="range"
              min="20"
              max="55"
              step="1"
              value={severityThreshold}
              onChange={(e) => {
                setSeverityThreshold(Number(e.target.value));
                if (stabilized) setStabilized(false);
              }}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <p className="text-[9px] text-text-muted">Redefine heuristic triggers (lower bounds detect more anomalies).</p>
          </div>
        </div>
      </motion.div>

      {/* Advanced ML Data Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <ForecastChart driftOffset={driftOffset} variance={variance} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1 }}
        >
          <AnomalyChart inventorySlack={inventorySlack} severityThreshold={severityThreshold} stabilized={stabilized} />
        </motion.div>
      </div>

    </div>
  );
}
