'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { ReportGeneratorWizard } from '@/components/reports/report-generator-wizard';
import { ExportOptions } from '@/components/reports/export-options';

const reports = [
  { id: '1', title: 'Q2 Financial Variance Narrative', type: 'Analytical Synthesis', module: 'FICO_ALPHA', date: 'MAY 08, 2026', size: '2.4 MB', color: 'violet' },
  { id: '2', title: 'Annual Supply Chain Risk Profile', type: 'Predictive Vector', module: 'MM_CORE_V4', date: 'MAY 06, 2026', size: '4.1 MB', color: 'cyan' },
  { id: '3', title: 'Regional Sales Velocity - EMEA', type: 'Transactional Flow', module: 'SD_PERF_P2', date: 'MAY 05, 2026', size: '1.8 MB', color: 'emerald' },
  { id: '4', title: 'Mismatched Invoices Audit', type: 'Audit Heuristic', module: 'FICO_RECON', date: 'MAY 02, 2026', size: '0.9 MB', color: 'violet' },
];

export default function ReportsPage() {
  const [isWizardOpen, setIsWizardOpen] = React.useState(false);
  const [exportTarget, setExportTarget] = React.useState<string | null>(null);

  return (
    <div className="max-w-[1600px] mx-auto space-y-24 pb-40 relative animate-fade-in px-4">
      {/* Manifest Deck Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Neural Manifest Repository</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             EXECUTIVE <br/> <span className="text-gradient">MANIFESTS</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button 
                onClick={() => setIsWizardOpen(true)}
                className="h-20 px-16 bg-white text-black font-black uppercase tracking-[0.3em] rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-105 transition-all text-xs"
              >
                Generate Neural Synthesis
              </button>
           </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 relative z-10">
        {reports.map((r, idx) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: idx * 0.1 }}
          >
            <Card className={cn(
              "glass-card rounded-[4rem] p-0 overflow-hidden flex flex-col transition-all duration-1000 group h-[520px] shadow-2xl relative border-white/5 bg-white/[0.01]",
              r.color === 'violet' ? "hover:border-violet-500/30 hover:shadow-[0_0_60px_rgba(124,58,237,0.1)]" :
              r.color === 'cyan' ? "hover:border-cyan-500/30 hover:shadow-[0_0_60px_rgba(6,182,212,0.1)]" :
              "hover:border-emerald-500/30 hover:shadow-[0_0_60px_rgba(16,185,129,0.1)]"
            )}>
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-20 transition-opacity">
                 <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              </div>
              
              <div className="p-12 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-16">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl">
                     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/><path d="M14 2v6h6m-8 5h4m-4 4h4"/></svg>
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-black px-4 py-1.5 border-none tracking-widest rounded-xl uppercase",
                    r.color === 'violet' ? "bg-violet-500/10 text-violet-400" :
                    r.color === 'cyan' ? "bg-cyan-500/10 text-cyan-400" :
                    "bg-emerald-500/10 text-emerald-400"
                  )}>
                    {r.module}
                  </Badge>
                </div>
                <h3 className="text-4xl font-black text-white mb-6 tracking-tighter leading-[1.1] uppercase group-hover:text-primary transition-colors flex-1">{r.title}</h3>
                <p className="text-[11px] text-text-muted uppercase tracking-[0.5em] font-black">{r.type}</p>
              </div>
              
              <div className="px-12 py-10 bg-white/[0.03] border-t border-white/5 flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] text-text-secondary font-black uppercase tracking-[0.3em]">{r.date}</span>
                  <span className="text-[10px] text-white/20 font-mono italic uppercase tracking-widest">{r.size} NEURAL_ARCHIVE</span>
                </div>
                <motion.button 
                  onClick={() => setExportTarget(r.title)}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-primary hover:border-primary transition-all shadow-2xl"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                </motion.button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <ExportOptions 
        isOpen={!!exportTarget} 
        onClose={() => setExportTarget(null)} 
        reportTitle={exportTarget || ''} 
      />

      {isWizardOpen && (
        <ReportGeneratorWizard onClose={() => setIsWizardOpen(false)} />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <Card className="glass-card p-32 rounded-[7rem] flex flex-col items-center justify-center text-center group overflow-hidden relative border-dashed border-white/10 bg-white/[0.01]">
          <div className="absolute inset-0 bg-neural-mesh opacity-5" />
          
          <h3 className="text-6xl font-black text-white/20 uppercase tracking-[0.5em] mb-10 group-hover:text-white transition-all duration-1000 leading-none">ORCHESTRATED DELIVERY</h3>
          <p className="text-2xl text-text-secondary max-w-5xl mb-20 font-semibold leading-relaxed">
            Automate the generation of high-fidelity institutional manifestations across the entire SAP cognitive ecosystem. Configure narrative triggers for event-driven audit excellence.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className="h-20 px-20 border border-white/10 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all shadow-2xl">
              Configure Recursive Triggers
            </button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
