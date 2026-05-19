'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const historyItems = [
  { id: '1', title: 'Q2 Revenue Variance Analysis', module: 'FICO_ALPHA', user: 'SARAH MILLER', date: 'MAY 08, 2026', queries: 14, status: 'Completed', color: 'violet' },
  { id: '2', title: 'MM Inventory Turn Optimization', module: 'MM_CORE_V4', user: 'SARAH MILLER', date: 'MAY 08, 2026', queries: 8, status: 'Completed', color: 'cyan' },
  { id: '3', title: 'SD Late Delivery Investigation', module: 'SD_PERF_P2', user: 'SARAH MILLER', date: 'MAY 07, 2026', queries: 22, status: 'Archived', color: 'emerald' },
  { id: '4', title: 'HR Headcount Forecast FY25', module: 'HR_NEXUS_9', user: 'SARAH MILLER', date: 'MAY 05, 2026', queries: 5, status: 'Completed', color: 'violet' },
  { id: '5', title: 'FICO Audit Trail Export', module: 'FICO_RECON', user: 'SARAH MILLER', date: 'MAY 04, 2026', queries: 2, status: 'Archived', color: 'cyan' },
];

export default function HistoryPage() {
  return (
    <div className="max-w-[1500px] mx-auto space-y-24 pb-40 relative animate-fade-in px-4">
      {/* Archive Deck Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Institutional Audit Deck</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             <span className="text-gradient">HISTORY</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
             <button className="h-20 px-12 glass-card text-white font-black uppercase tracking-[0.3em] rounded-3xl hover:bg-white hover:text-black transition-all text-xs border-white/10 shadow-2xl">
              Initialize Log Synthesis
            </button>
           </motion.div>
        </div>
      </div>

      <Card className="glass-card rounded-[4rem] overflow-hidden shadow-2xl relative z-10 border-white/5 bg-white/[0.01]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-14 py-14 text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">Orchestrated Session</th>
                <th className="px-14 py-14 text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">Cognitive Node</th>
                <th className="px-14 py-14 text-[10px] font-black uppercase tracking-[0.5em] text-text-muted text-center">Interrogations</th>
                <th className="px-14 py-14 text-[10px] font-black uppercase tracking-[0.5em] text-text-muted">Timestamp</th>
                <th className="px-14 py-14 text-[10px] font-black uppercase tracking-[0.5em] text-text-muted text-right">Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {historyItems.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.05 }}
                  className="group hover:bg-white/[0.03] transition-all duration-700 cursor-crosshair"
                >
                  <td className="px-14 py-12">
                    <div className="flex flex-col gap-3">
                      <span className="text-4xl font-black text-white group-hover:text-primary transition-colors tracking-tighter uppercase leading-none">{item.title}</span>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{item.user}</span>
                    </div>
                  </td>
                  <td className="px-14 py-12">
                    <span className={cn(
                      "text-[10px] font-black px-4 py-2 rounded-xl border tracking-widest uppercase",
                      item.color === 'violet' ? "border-violet-500/20 bg-violet-500/10 text-violet-400" :
                      item.color === 'cyan' ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-400" :
                      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                    )}>
                      {item.module}
                    </span>
                  </td>
                  <td className="px-14 py-12 text-center">
                    <span className="text-5xl font-black text-white/10 group-hover:text-white transition-all duration-500 font-mono tracking-tighter leading-none">{item.queries}</span>
                  </td>
                  <td className="px-14 py-12">
                    <span className="text-[11px] font-black text-text-secondary uppercase tracking-[0.3em]">{item.date}</span>
                  </td>
                  <td className="px-14 py-12 text-right">
                    <motion.button 
                      whileHover={{ scale: 1.1, x: 10 }}
                      className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-primary group-hover:border-primary transition-all ml-auto shadow-2xl"
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m9 18 6-6-6-6"/></svg>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex justify-center pt-24 relative z-10">
        <button className="text-[11px] font-black uppercase tracking-[0.8em] text-text-muted hover:text-white transition-all">
          Synchronize Deep Intelligence Archives
        </button>
      </div>
    </div>
  );
}
