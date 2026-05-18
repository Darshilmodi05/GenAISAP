'use client';

import * as React from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { getDashboardMetrics, type DashboardMetrics } from '@/lib/sap/dashboard-service';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// --- Animated Counter ---
const AnimatedNumber = ({ value }: { value: string }) => {
  // Simple version for now, could use motion for true counter
  return <span className="text-glow-white">{value}</span>;
};

// --- 3D Command Card ---
const CommandCard = ({ title, value, trend, icon: Icon, color = 'primary', delay = 0 }: any) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const colors: any = {
    primary: 'from-violet-500/20 to-violet-900/40',
    secondary: 'from-cyan-500/20 to-cyan-900/40',
    accent: 'from-emerald-500/20 to-emerald-900/40',
    danger: 'from-rose-500/20 to-rose-900/40'
  };

  const borderColors: any = {
    primary: 'hover:border-violet-500/50',
    secondary: 'hover:border-cyan-500/50',
    accent: 'hover:border-emerald-500/50',
    danger: 'hover:border-rose-500/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative h-72 rounded-[2.5rem] glass-card p-10 flex flex-col justify-between transition-all duration-700",
        borderColors[color]
      )}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[2.5rem]", colors[color])} />
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">{title}</p>
          <div className="flex items-center gap-3">
             <div className={cn("w-2 h-2 rounded-full animate-pulse", `bg-${color === 'primary' ? 'violet-500' : color === 'secondary' ? 'cyan-500' : 'emerald-500'}`)} />
             <span className="text-[10px] font-bold text-text-secondary uppercase">Active Node</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-text-primary group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-2xl">
           {Icon && <Icon size={24} />}
        </div>
      </div>

      <div className="relative z-10 space-y-2">
        <h2 className="text-5xl font-black tracking-tight text-text-primary"><AnimatedNumber value={value} /></h2>
        <div className="flex items-center gap-2">
           <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
              {trend}
           </span>
           <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest">Growth Vector</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [metrics, setMetrics] = React.useState<DashboardMetrics | null>(null);

  React.useEffect(() => { getDashboardMetrics().then(setMetrics); }, []);

  if (!metrics) return null;

  return (
    <div className="space-y-16 pb-32">
      {/* Hero Nexus */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-8">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Instance: ALPHA-01</span>
          </div>
          <h1 className="text-7xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             EXECUTIVE <br/> <span className="text-gradient">HOME</span>
          </h1>
          <p className="text-xl text-text-secondary font-medium max-w-xl leading-relaxed tracking-tight">
             Orchestrating SAP S/4HANA intelligence with quantum precision. 
             Current cognitive load at <span className="text-white font-bold">14.2%</span>.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-end gap-6"
        >
           <div className="flex gap-4">
              <Link href="/dashboard" className="px-10 py-5 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] text-xs">
                 Initiate Synthesis
              </Link>
              <button className="p-5 glass-card rounded-2xl hover:bg-white/10 transition-all">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
              </button>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">System Integrity</p>
              <div className="flex gap-1">
                 {[...Array(8)].map((_, i) => (
                   <motion.div 
                    key={i} 
                    animate={{ height: [8, 16, 8] }} 
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                    className="w-1.5 h-4 bg-primary/40 rounded-full" 
                   />
                 ))}
              </div>
           </div>
        </motion.div>
      </div>

      {/* 3D Command Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <CommandCard title="Revenue (MTD)" value={metrics.revenueMTD} trend={`+${metrics.revenueTrend}`} color="primary" delay={0.1} />
        <CommandCard title="Open Orders" value={metrics.openPOs.toString()} trend="-12.4%" color="secondary" delay={0.2} />
        <CommandCard title="DSO Performance" value={metrics.dso} trend={`+${metrics.dsoTrend}`} color="accent" delay={0.3} />
        <CommandCard title="Cognitive Sync" value={metrics.systemHealth} trend="+0.02%" color="primary" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Live Intelligence Feed */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card rounded-[3.5rem] p-12 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
             <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
          
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black tracking-tight text-white uppercase">Intelligence Stream</h2>
            <div className="flex gap-3">
               <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-text-secondary">32,442 Logs Parsed</span>
            </div>
          </div>
          
          <div className="space-y-4">
             {[
               { m: 'FICO', t: 'Neural reconciliation of EMEA ledger entity-1000 initiated.', s: 'Critical', c: 'primary' },
               { m: 'MM', t: 'Detected 14% drift in inventory turnover within APJ region.', s: 'Warning', c: 'secondary' },
               { m: 'SD', t: 'Sales pipeline velocity increased by 8.4% since last sync.', s: 'Success', c: 'accent' }
             ].map((a, i) => (
               <motion.div 
                key={i}
                whileHover={{ x: 10, scale: 1.01 }}
                className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer group/item"
               >
                 <div className="flex items-center gap-8">
                    <div className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center text-[10px] font-black text-white">{a.m}</div>
                    <div>
                      <p className="text-lg font-bold text-white group-hover/item:text-primary transition-colors">{a.t}</p>
                      <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest mt-1 block">Latency: 14ms &nbsp;•&nbsp; Heuristic v3.4</span>
                    </div>
                 </div>
                 <div className={cn("text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full", a.c === 'primary' ? 'bg-violet-500/10 text-violet-400' : a.c === 'secondary' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-emerald-500/10 text-emerald-400')}>
                    {a.s}
                 </div>
               </motion.div>
             ))}
          </div>
        </motion.div>

        {/* Global Action Hub */}
        <div className="space-y-10">
           <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="h-full"
           >
              <Card className="glass-card rounded-[3.5rem] p-12 flex flex-col justify-between h-full group hover:shadow-[0_0_60px_rgba(124,58,237,0.1)] transition-all duration-700 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                 
                 <div className="space-y-8 relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-text-muted">Orchestrator</h3>
                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-text-secondary uppercase">Task Completion</span>
                          <span className="text-2xl font-black text-white">33%</span>
                       </div>
                       <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/10">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '33%' }}
                            transition={{ duration: 2, delay: 1 }}
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" 
                          />
                       </div>
                       <p className="text-sm text-text-secondary leading-relaxed font-medium">
                          Detecting child ledgers reconciliation drift. Ready for neural stabilization.
                       </p>
                    </div>
                 </div>
                 
                 <button className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-glow-primary hover:scale-105 active:scale-95 transition-all text-xs relative z-10 mt-12">
                    Stabilize Core
                 </button>
              </Card>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
