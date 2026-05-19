'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertNarrativeCard } from '@/components/alerts/alert-narrative-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Sparkles, 
  TrendingUp, 
  HelpCircle,
  AlertCircle
} from 'lucide-react';

const initialAlerts = [
  {
    id: '1',
    severity: 'critical' as const,
    title: 'MM Inventory Level Anomaly (EMEA)',
    narrative: 'Warehouse 012 in Frankfurt is showing stock levels 42% above historical variance for high-value components. AI predicts potential liquidity constraints if not addressed within 10 days.',
    confidence: 96,
    timestamp: '14 MIN AGO',
    module: 'MM_CORE_V4',
    isNew: true,
    color: 'violet'
  },
  {
    id: '2',
    severity: 'warning' as const,
    title: 'Unusual Sales Growth in APJ Region',
    narrative: 'Detected 18% spike in SD order volume from three key accounts in Singapore. While positive, current supply chain velocity may result in delivery delays (ETA +4 days).',
    confidence: 89,
    timestamp: '2 HOURS AGO',
    module: 'SD_PERF_P2',
    color: 'cyan'
  },
  {
    id: '3',
    severity: 'info' as const,
    title: 'FICO Reconciliation Complete',
    narrative: 'Monthly reconciliation for entity 1000 completed with 0.02% variance. All balances within acceptable audit thresholds.',
    confidence: 99,
    timestamp: '4 HOURS AGO',
    module: 'FICO_REPORT',
    color: 'emerald'
  }
];

export default function AlertsPage() {
  const [filter, setFilter] = React.useState('all');
  const [activeAlerts, setActiveAlerts] = React.useState(initialAlerts);
  const [systemHealth, setSystemHealth] = React.useState(99.4);
  const [baselineScore, setBaselineScore] = React.useState(96.8);

  // Live WebSocket/SSE streaming feed simulator
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const streamingAlert = {
        id: 'streamed-1',
        severity: 'critical' as const,
        title: 'FICO Journal Voucher Discrepancy',
        narrative: 'A manual journal entry was posted to account 400100 outside of standard operational business hours (02:14:02 UTC). The entry size ($320,000) represents a significant outlier.',
        confidence: 98,
        timestamp: 'JUST NOW (LIVE STREAM)',
        module: 'FICO_ACDOCA',
        isNew: true,
        color: 'violet'
      };

      setActiveAlerts(prev => [streamingAlert, ...prev]);
      setSystemHealth(94.2);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleAction = (id: string) => {
    console.log(`Autonomous Fix Executed for Alert ${id}`);
    // Simulate resolving the alert
    setTimeout(() => {
      setActiveAlerts(prev => prev.filter(a => a.id !== id));
      if (id === 'streamed-1') {
        setSystemHealth(99.4);
      }
    }, 1200);
  };

  const handleTrace = (id: string) => {
    console.log(`Evidence Trace initiated for Alert ${id}`);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-20 pb-40 relative animate-fade-in px-4">
      {/* Narrative Deck Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Autonomous Anomaly Feed</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             NEURAL <br/> <span className="text-gradient">ALERTS</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
          {['all', 'critical', 'warning'].map((f) => (
            <motion.button
              key={f}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={cn(
                "px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-700",
                filter === f 
                  ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.25)]" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Baseline Profiler HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
         {/* Baseline Profiler Card */}
         <div className="glass-card p-10 rounded-[3rem] space-y-6 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
               <Activity size={100} />
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Cognitive Baseline</span>
               <div className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-black uppercase tracking-widest">Active</div>
            </div>
            <div className="space-y-2">
               <h3 className="text-5xl font-black text-white">{baselineScore}%</h3>
               <p className="text-xs font-semibold text-text-secondary">Normal behavior alignment index per user account and Cost Center.</p>
            </div>
         </div>

         {/* System Health HUD */}
         <div className="glass-card p-10 rounded-[3rem] space-y-6 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
               <Terminal size={100} />
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">System Health Index</span>
               <div className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[9px] font-black uppercase tracking-widest">Synced</div>
            </div>
            <div className="space-y-2">
               <h3 className="text-5xl font-black text-white">{systemHealth}%</h3>
               <p className="text-xs font-semibold text-text-secondary">Global operational telemetry stability score for EMEA/APJ instances.</p>
            </div>
         </div>

         {/* Live Stream Monitor */}
         <div className="glass-card p-10 rounded-[3rem] space-y-6 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] pointer-events-none">
               <Sparkles size={100} />
            </div>
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">WebSocket SSE Core</span>
               <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">Streaming</div>
               </div>
            </div>
            <div className="space-y-2">
               <h3 className="text-5xl font-black text-white">4 Active</h3>
               <p className="text-xs font-semibold text-text-secondary">Live anomalies queue. Real-time updates pushed straight from Prophet models.</p>
            </div>
         </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-12 relative z-10">
        <AnimatePresence mode="popLayout">
          {activeAlerts
            .filter(a => filter === 'all' || a.severity === filter)
            .map((alert, idx) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -50, filter: 'blur(20px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                className="group relative"
              >
                {/* Neon Flare */}
                <div className={cn(
                  "absolute -inset-4 rounded-[4rem] blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-700",
                  alert.color === 'violet' ? "bg-violet-500" : alert.color === 'cyan' ? "bg-cyan-500" : "bg-emerald-500"
                )} />
                <AlertNarrativeCard 
                  {...alert} 
                  onAction={() => handleAction(alert.id)}
                  onTrace={() => handleTrace(alert.id)}
                />
              </motion.div>
            ))
          }
        </AnimatePresence>
      </div>

      {/* Ecosystem Stability */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <Card className="glass-card p-24 rounded-[6rem] flex flex-col items-center text-center group overflow-hidden relative border-dashed border-white/10 bg-white/[0.01]">
          <div className="absolute inset-0 bg-neural-mesh opacity-5" />
          
          <motion.div
            animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 8 }}
            className="w-48 h-48 rounded-full border border-white/5 flex items-center justify-center mb-16 shadow-inner relative"
          >
             <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20" />
             <svg className="w-24 h-24 text-primary opacity-30 group-hover:opacity-100 transition-all duration-1000" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
             </svg>
          </motion.div>
          
          <h3 className="text-6xl font-black text-white uppercase tracking-[0.3em] mb-10 leading-none">ECOSYSTEM ACTIVE</h3>
          <p className="text-2xl text-text-secondary max-w-4xl leading-relaxed font-semibold">
             All neural telemetry clusters report active synchronization. S/4HANA instances are operating within established cognitive baselines.
          </p>
          
          <div className="mt-20 flex gap-10">
             <Button className="h-20 px-20 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-3xl hover:scale-105 transition-all shadow-glow-primary text-xs">
                Recalibrate Neural Core
             </Button>
             <Button variant="outline" className="h-20 px-20 glass-card text-white font-bold uppercase tracking-[0.4em] rounded-3xl hover:bg-white/10 transition-all text-xs border-white/10">
                Full Instance Sweep
             </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
