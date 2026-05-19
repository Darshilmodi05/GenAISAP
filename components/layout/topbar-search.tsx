'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, Database, Zap, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const TopbarSearch = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleClusterClick = (name: string) => {
    setSearchQuery(name);
    // In a real app, this might trigger a search or navigate
    console.log(`Searching for cluster: ${name}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Executing search for: ${searchQuery}`);
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-6 px-8 py-4 glass-card rounded-2xl text-text-muted hover:text-white transition-all group w-full max-w-md border-white/5 hover:border-primary/30"
      >
        <Search size={18} className="group-hover:text-primary transition-colors duration-500" />
        <span className="text-xs font-black uppercase tracking-[0.2em] flex-1 text-left">Search Neural Archives...</span>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 group-hover:bg-primary/20 transition-all duration-500">
           <Command size={10} />
           <span className="text-[10px] font-black">K</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#030305]/90 backdrop-blur-xl" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-3xl glass-card rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.8)] z-10 overflow-hidden border-white/10"
            >
              <form onSubmit={handleSearch} className="p-8 border-b border-white/5 flex items-center gap-6 bg-white/[0.02]">
                <Search size={24} className="text-primary animate-pulse" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query FICO, SD, MM or Neural Narratives..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-2xl font-bold outline-none text-white placeholder:text-text-muted"
                />
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-3 hover:bg-white/5 rounded-2xl text-text-muted transition-all"
                >
                  <X size={20} />
                </button>
              </form>

              <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Intelligence Clusters</h4>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { n: 'FICO_LEDGER_ACDOCA', i: Database, c: 'text-violet-400' },
                       { n: 'SD_SALES_PIPELINE', i: Zap, c: 'text-cyan-400' },
                       { n: 'MM_INVENTORY_DRIFT', i: Database, c: 'text-emerald-400' },
                       { n: 'NEURAL_NARRATIVES', i: Zap, c: 'text-amber-400' }
                     ].map((item, i) => (
                       <button 
                         key={i} 
                         onClick={() => handleClusterClick(item.n)}
                         className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 hover:border-primary/30 transition-all group/item text-left"
                       >
                          <div className="flex items-center gap-4">
                             <item.i size={18} className={cn(item.c, "group-hover/item:scale-110 transition-transform")} />
                             <span className="text-[11px] font-black text-white uppercase tracking-wider">{item.n}</span>
                          </div>
                          <ArrowRight size={14} className="text-text-muted group-hover/item:text-white transition-all opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-2" />
                       </button>
                     ))}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-10 text-center opacity-40 border-t border-white/5">
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Command size={24} className="text-text-muted" />
                   </div>
                   <p className="text-sm font-black text-white uppercase tracking-[0.2em]">Global Command Synthesis</p>
                   <p className="text-xs text-text-muted mt-2 font-medium tracking-tight">Access across all telemetry nodes and SAP S/4HANA instances.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

