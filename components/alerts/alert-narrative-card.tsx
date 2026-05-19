'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  Zap, 
  ChevronRight, 
  Share2, 
  Terminal, 
  Users, 
  Activity, 
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface AlertNarrativeCardProps {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  narrative: string;
  confidence: number;
  timestamp: string;
  module: string;
  isNew?: boolean;
  color?: string;
  onAction?: () => void;
  onTrace?: () => void;
}

export const AlertNarrativeCard: React.FC<AlertNarrativeCardProps> = ({
  id, severity, title, narrative, confidence, timestamp, module, isNew, color = 'violet',
  onAction, onTrace
}) => {
  const [isFixing, setIsFixing] = React.useState(false);
  const [isTracing, setIsTracing] = React.useState(false);
  const [showTracePanel, setShowTracePanel] = React.useState(false);
  const [escalationPath, setEscalationPath] = React.useState<'cfo' | 'controller'>('controller');
  const [isActionProposed, setIsActionProposed] = React.useState(false);

  React.useEffect(() => {
    // Automatically set default escalation path based on severity
    if (severity === 'critical') {
      setEscalationPath('cfo');
    }
  }, [severity]);

  const handleAction = async () => {
    setIsFixing(true);
    await new Promise(r => setTimeout(r, 2000));
    onAction?.();
    setIsActionProposed(true);
    setIsFixing(false);
  };

  const handleTraceToggle = async () => {
    if (!showTracePanel) {
      setIsTracing(true);
      await new Promise(r => setTimeout(r, 1200));
      onTrace?.();
      setIsTracing(false);
      setShowTracePanel(true);
    } else {
      setShowTracePanel(false);
    }
  };

  const iconMap = {
    critical: ShieldAlert,
    warning: AlertTriangle,
    info: Info,
  };

  const Icon = iconMap[severity];

  const severityColors = {
    critical: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
    warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    info: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.005 }}
      className="glass-card rounded-[3.5rem] overflow-hidden group/card relative border-white/5"
    >
      {/* Flare Background */}
      <div className={cn(
        "absolute top-0 right-0 w-96 h-96 blur-[120px] opacity-0 group-hover/card:opacity-10 transition-opacity duration-1000 -translate-y-1/2 translate-x-1/2",
        severity === 'critical' ? 'bg-rose-500' : severity === 'warning' ? 'bg-amber-500' : 'bg-cyan-500'
      )} />

      <div className="p-12 relative z-10 space-y-10">
        
        {/* Main Card View */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Metadata & Icon */}
          <div className="flex flex-col items-center lg:items-start gap-8 lg:border-r lg:border-white/5 lg:pr-12 lg:w-48 shrink-0">
             <div className={cn(
               "w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-700 group-hover/card:rotate-12",
               severity === 'critical' ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]' : severity === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
             )}>
                <Icon size={32} />
             </div>
             <div className="text-center lg:text-left space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Confidence</p>
                <p className="text-2xl font-black text-white leading-none">{confidence}%</p>
             </div>
             <div className="flex flex-col gap-2 w-full">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted text-center lg:text-left">Module Cluster</span>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white text-center">
                   {module}
                </div>
             </div>
          </div>

          {/* Center Content: Narrative Hub */}
          <div className="flex-1 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
               <div className="flex items-center gap-4">
                  <div className={cn("px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border", severityColors[severity])}>
                     {severity} PROTOCOL
                  </div>
                  {isNew && (
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse">
                       <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                       STREAMING
                    </div>
                  )}
               </div>
               <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{timestamp}</span>
            </div>

            <div className="space-y-4">
               <h3 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] group-hover/card:text-gradient transition-all duration-700">
                 {title}
               </h3>
               <p className="text-xl text-text-secondary leading-relaxed font-medium max-w-5xl">
                 {narrative}
               </p>
            </div>

            {/* Smart Actions Row */}
            <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-8">
               <div className="flex gap-4">
                  <button 
                    onClick={handleTraceToggle}
                    disabled={isTracing}
                    className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] transition-all border border-white/5 group/btn"
                  >
                     {isTracing ? (
                       <div className="w-3 h-3 border border-primary/20 border-t-primary rounded-full animate-spin" />
                     ) : (
                       <Terminal size={14} className="text-primary group-hover/btn:scale-125 transition-transform" />
                     )}
                     {isTracing ? 'Tracing...' : showTracePanel ? 'Hide Evidence' : 'Trace Evidence'}
                  </button>
                  
                  {/* Smart Escalation Selector */}
                  <div className="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <button 
                      onClick={() => setEscalationPath('controller')}
                      className={cn("px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all", escalationPath === 'controller' ? 'bg-white/10 text-white' : 'text-text-muted hover:text-white')}
                    >
                      Controller
                    </button>
                    <button 
                      onClick={() => setEscalationPath('cfo')}
                      className={cn("px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all", escalationPath === 'cfo' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 'text-text-muted hover:text-white')}
                    >
                      CFO Escalate
                    </button>
                  </div>
               </div>
               
               <button 
                 onClick={handleAction}
                 disabled={isFixing || isActionProposed}
                 className={cn(
                   "flex items-center gap-4 px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all group/action",
                   isActionProposed
                     ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                     : isFixing 
                     ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                     : "bg-primary text-white shadow-glow-primary hover:scale-105 active:scale-95"
                 )}
               >
                  {isFixing ? (
                    <div className="w-4 h-4 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
                  ) : isActionProposed ? (
                    <CheckCircle2 size={16} />
                  ) : null}
                  {isActionProposed ? 'Fix Deployed Successfully' : isFixing ? 'Executing Autonomous Fix...' : 'Initiate Autonomous Fix'}
                  {!isFixing && !isActionProposed && <ChevronRight size={16} className="group-hover/action:translate-x-2 transition-transform" />}
               </button>
            </div>
          </div>
        </div>

        {/* Expandable Trace Panel */}
        <AnimatePresence>
          {showTracePanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-white/5 pt-10 space-y-8"
            >
               <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Evidence Trace Console</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Trace 1: Posting Docs */}
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                     <div className="flex items-center gap-3 text-text-muted">
                        <Activity size={12} className="text-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Posting Document</span>
                     </div>
                     <div className="font-mono text-[11px] text-white space-y-1.5">
                        <p className="font-bold text-primary">ID: SAP-ACDOCA-2026-F104</p>
                        <p>Ledger: Universal Journal (0L)</p>
                        <p>Cost Center: CC-DE-EMEA-4022</p>
                        <p>Material Group: MAT-HI-VAL-01</p>
                     </div>
                  </div>

                  {/* Trace 2: User Behavioral Patterns */}
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                     <div className="flex items-center gap-3 text-text-muted">
                        <Users size={12} className="text-secondary" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Behavioral Pattern</span>
                     </div>
                     <div className="font-mono text-[11px] text-white space-y-1.5">
                        <p className="font-bold text-secondary">Operator: darshil@sap.corp</p>
                        <p>Execution Drift: +15 Days</p>
                        <p>Trigger Time: 23:14:02 UTC</p>
                        <p>Alert Source: Pattern Matcher</p>
                     </div>
                  </div>

                  {/* Trace 3: Baseline Classifier */}
                  <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                     <div className="flex items-center gap-3 text-text-muted">
                        <Sliders size={12} className="text-accent" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Heuristic Baselines</span>
                     </div>
                     <div className="font-mono text-[11px] text-white space-y-1.5">
                        <p className="font-bold text-accent">Anomaly Confidence: {confidence}%</p>
                        <p>Prophet Drift: MoM 4.2%</p>
                        <p>Isolation Forest: Outlier Flag</p>
                        <p>Smart Escalation: Active ({escalationPath.toUpperCase()})</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  );
};
