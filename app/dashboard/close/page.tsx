'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Zap, 
  Search,
  ShieldCheck,
  Building,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

interface Blocker {
  id: string;
  name: string;
  impact: string;
  risk: 'High' | 'Medium' | 'Low';
  severity: 'Critical' | 'Warning';
  sapCode: string;
}

interface EntityCloseData {
  code: string;
  name: string;
  progress: number;
  currentPhase: 'Reconciliation' | 'Validation' | 'Reporting';
  reconciliationProgress: number;
  validationProgress: number;
  reportingProgress: number;
  blockers: Blocker[];
  varianceCommentary: string;
}

const entityData: Record<string, EntityCloseData> = {
  '1000': {
    code: '1000',
    name: 'US Central Corporate',
    progress: 72,
    currentPhase: 'Validation',
    reconciliationProgress: 100,
    validationProgress: 60,
    reportingProgress: 0,
    blockers: [
      { id: 'b1', name: 'GL-104 AP/AR Unreconciled Balances', impact: '$642,500 Risk', risk: 'High', severity: 'Critical', sapCode: 'ACDOCA_L1_MATCH' },
      { id: 'b2', name: 'PO-409 High Value Open Purchase Orders', impact: '$202,500 Risk', risk: 'Medium', severity: 'Warning', sapCode: 'EKKO_OPEN_VAL' }
    ],
    varianceCommentary: 'FICO Ledger Entity-1000 exhibits a 4.2% variance drift compared to Period 03. This is primarily attributed to unposted accrued travel expenses inside Cost Center 4022 ($380,000) and minor depreciation mismatches ($62,500) under S/4HANA Asset Ledger.'
  },
  '2000': {
    code: '2000',
    name: 'EMEA Operations',
    progress: 45,
    currentPhase: 'Reconciliation',
    reconciliationProgress: 80,
    validationProgress: 0,
    reportingProgress: 0,
    blockers: [
      { id: 'b3', name: 'GL-302 Intercompany Mismatches (Frankfurt/London)', impact: '$890,000 Risk', risk: 'High', severity: 'Critical', sapCode: 'IC_BAL_CHECK' },
      { id: 'b4', name: 'Tax-201 VAT Input Ledger Lockout', impact: '$120,000 Risk', risk: 'Medium', severity: 'Warning', sapCode: 'TAX_BSET_POST' }
    ],
    varianceCommentary: 'EMEA Entity-2000 is currently flagged at 8.7% variance due to currency fluctuations between GBP and EUR causing a translation reserve drift ($750,000). A further VAT validation lockout in the German instance has deferred the reconciliation sequence.'
  },
  '3000': {
    code: '3000',
    name: 'APJ Services Division',
    progress: 96,
    currentPhase: 'Reporting',
    reconciliationProgress: 100,
    validationProgress: 100,
    reportingProgress: 90,
    blockers: [
      { id: 'b5', name: 'REP-901 Minor Rounding Variance', impact: '$8,400 Risk', risk: 'Low', severity: 'Warning', sapCode: 'ROUNDING_T001' }
    ],
    varianceCommentary: 'APJ Entity-3000 is operating within clean cognitive parameters. Variance drift is limited to 0.08%, which is well below the established IFRS 17 materiality threshold ($50,000). Ready for formal reporting dispatch.'
  }
};

export default function ClosePage() {
  const [selectedEntity, setSelectedEntity] = React.useState<'1000' | '2000' | '3000'>('1000');
  const [chatQuery, setChatQuery] = React.useState('');
  const [chatLogs, setChatLogs] = React.useState<Array<{ role: 'user' | 'agent'; text: string; citations?: string[] }>>([
    { role: 'agent', text: 'Month-End Close Agent active. You can ask me specific questions about entities, blockers, or variance commentary.' }
  ]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [isFixing, setIsFixing] = React.useState<string | null>(null);
  const [isGeneratingNarrative, setIsGeneratingNarrative] = React.useState(false);
  const [activeData, setActiveData] = React.useState<EntityCloseData>(entityData['1000']);

  React.useEffect(() => {
    setActiveData(entityData[selectedEntity]);
  }, [selectedEntity]);

  const handleAutoFix = async (blockerId: string) => {
    setIsFixing(blockerId);
    // Simulate SAP S/4HANA OData transaction
    await new Promise(r => setTimeout(r, 2000));
    
    setActiveData(prev => {
      const updatedBlockers = prev.blockers.filter(b => b.id !== blockerId);
      const isReconciliation = prev.currentPhase === 'Reconciliation';
      const newProgress = Math.min(100, prev.progress + 15);
      
      return {
        ...prev,
        progress: newProgress,
        blockers: updatedBlockers,
        varianceCommentary: `Reconciliation successful for resolved blocker. Balance matched. ${prev.varianceCommentary}`
      };
    });
    
    setIsFixing(null);
  };

  const handleGenerateNarrative = async () => {
    setIsGeneratingNarrative(true);
    await new Promise(r => setTimeout(r, 1500));
    
    setActiveData(prev => ({
      ...prev,
      varianceCommentary: `[COGNITIVE RUN: ACCRUED REVERSALS MATCHED] ${prev.varianceCommentary} \nHeuristic projection confirms that applying the suggested journal adjustment resolves the ${prev.blockers[0]?.name || 'outstanding blockers'} and restores normal budget bounds.`
    }));
    
    setIsGeneratingNarrative(false);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    const userMsg = chatQuery;
    setChatLogs(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatQuery('');
    setIsTyping(true);

    // Simulate Agent Reasoning based on query
    await new Promise(r => setTimeout(r, 1800));

    let agentResponse = "Analyzing institutional parameters... Under S/4HANA rules, please target specific entity queries.";
    let citations: string[] = [];

    if (userMsg.toLowerCase().includes('1000') || userMsg.toLowerCase().includes('ico')) {
      agentResponse = "FICO Close for Entity 1000 is currently BLOCKED in the Validation phase due to two high-priority items. The critical path is blocked by GL-104 (AP/AR Unreconciled Balances) representing a $642,500 liquidity drift inside ACDOCA.";
      citations = ['SAP_ACDOCA_L1_MATCH', 'US_TAX_LEDGER_V2'];
    } else if (userMsg.toLowerCase().includes('2000') || userMsg.toLowerCase().includes('emea')) {
      agentResponse = "EMEA Operations (Entity 2000) is held back in the Reconciliation phase. It is exhibiting an 8.7% variance drift ($890,000 risk) linked directly to intercompany mismatches between Frankfurt and London instances.";
      citations = ['SAP_IC_BAL_CHECK', 'EUR_FX_TRANSLATION'];
    } else if (userMsg.toLowerCase().includes('3000') || userMsg.toLowerCase().includes('apj')) {
      agentResponse = "APJ Services (Entity 3000) has completed Validation and is 96% complete in the Reporting phase. Only a minor rounding variance of $8,400 is flagged, which is well below the materiality thresholds.";
      citations = ['SAP_ROUNDING_T001'];
    }

    setChatLogs(prev => [...prev, { role: 'agent', text: agentResponse, citations }]);
    setIsTyping(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-20 pb-40 animate-fade-in px-4">
      {/* Header Deck */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">CLOSE ORCHESTRATION NEXUS</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             FISCAL <br/> <span className="text-gradient">CLOSE</span>
          </h1>
        </div>
        
        {/* Entity Selector Tabs */}
        <div className="flex items-center gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
          {(['1000', '2000', '3000'] as const).map((code) => (
            <motion.button
              key={code}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedEntity(code)}
              className={cn(
                "px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all duration-500 flex items-center gap-3",
                selectedEntity === code 
                  ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.25)]" 
                  : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Building size={12} />
              Entity {code}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Global Telemetry HUD */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[4rem] p-16 lg:p-24 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute inset-0 bg-neural-mesh opacity-5" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-20">
           <div className="relative shrink-0">
              <svg className="w-64 h-64 lg:w-80 lg:h-80 transform -rotate-90">
                 <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                 <motion.circle 
                   cx="50%" cy="50%" r="45%" 
                   stroke="url(#closeGrad)" strokeWidth="10" fill="transparent"
                   strokeDasharray="283 283"
                   initial={{ strokeDashoffset: 283 }}
                   animate={{ strokeDashoffset: 283 - (283 * activeData.progress / 100) }}
                   transition={{ duration: 1.5, ease: "easeOut" }}
                   strokeLinecap="round"
                 />
                 <defs>
                   <linearGradient id="closeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="var(--primary)" />
                     <stop offset="100%" stopColor="var(--secondary)" />
                   </linearGradient>
                 </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-2">Entity {activeData.code}</span>
                 <span className="text-7xl lg:text-8xl font-black text-white leading-none">{activeData.progress}%</span>
              </div>
           </div>

           <div className="flex-1 space-y-10">
              <div>
                 <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Operational Node Name</span>
                 <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mt-1">{activeData.name}</h2>
              </div>

              <div className="grid grid-cols-2 gap-10">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Active Blockers</p>
                    <span className={cn("text-5xl font-black", activeData.blockers.length > 0 ? "text-rose-400" : "text-emerald-400")}>
                      {activeData.blockers.length}
                    </span>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">Active Phase</p>
                    <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/5 inline-flex text-xs font-black text-white uppercase tracking-widest">
                       {activeData.currentPhase}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Progress Tracker (Horizontal Timeline) */}
      <div className="space-y-8 relative z-10">
         <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] ml-4">Close Progress Pipeline</h3>
         <div className="glass-card p-12 lg:p-16 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
            {/* Timeline Segment 1: Reconciliation */}
            <div className="flex-1 flex items-center gap-6 w-full relative z-10">
               <div className={cn(
                 "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                 activeData.reconciliationProgress === 100 
                   ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.2)]" 
                   : "bg-primary/10 text-primary border-primary/20 animate-pulse shadow-[0_0_20px_rgba(124,58,237,0.2)]"
               )}>
                  {activeData.reconciliationProgress === 100 ? <CheckCircle2 size={24} /> : <Clock size={24} />}
               </div>
               <div className="space-y-1">
                  <h4 className="text-lg font-black text-white uppercase">1. Reconciliation</h4>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{activeData.reconciliationProgress}% COMPLETE</p>
               </div>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-white/5 shrink-0" />

            {/* Timeline Segment 2: Validation */}
            <div className="flex-1 flex items-center gap-6 w-full relative z-10">
               <div className={cn(
                 "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                 activeData.validationProgress === 100 
                   ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.2)]" 
                   : activeData.validationProgress > 0 
                   ? "bg-primary/10 text-primary border-primary/20 animate-pulse"
                   : "bg-white/5 text-text-muted border-white/5"
               )}>
                  {activeData.validationProgress === 100 ? <CheckCircle2 size={24} /> : <Clock size={24} />}
               </div>
               <div className="space-y-1">
                  <h4 className="text-lg font-black text-white uppercase">2. Validation</h4>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{activeData.validationProgress}% COMPLETE</p>
               </div>
            </div>

            <div className="hidden md:block w-16 h-0.5 bg-white/5 shrink-0" />

            {/* Timeline Segment 3: Reporting */}
            <div className="flex-1 flex items-center gap-6 w-full relative z-10">
               <div className={cn(
                 "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-500",
                 activeData.reportingProgress === 100 
                   ? "bg-emerald-400/10 text-emerald-400 border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.2)]" 
                   : activeData.reportingProgress > 0 
                   ? "bg-primary/10 text-primary border-primary/20 animate-pulse"
                   : "bg-white/5 text-text-muted border-white/5"
               )}>
                  {activeData.reportingProgress === 100 ? <CheckCircle2 size={24} /> : <Clock size={24} />}
               </div>
               <div className="space-y-1">
                  <h4 className="text-lg font-black text-white uppercase">3. Reporting</h4>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{activeData.reportingProgress}% COMPLETE</p>
               </div>
            </div>
         </div>
      </div>

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
         
         {/* Blocker Management (Left 2 Columns) */}
         <div className="lg:col-span-2 space-y-12">
            <div className="space-y-8">
               <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] ml-4">Close Blocker Registry</h3>
               <AnimatePresence mode="popLayout">
                  {activeData.blockers.length === 0 ? (
                    <motion.div 
                      key="no-blockers"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-16 border border-dashed border-emerald-400/20 bg-emerald-400/[0.02] rounded-[3rem] text-center space-y-4"
                    >
                       <CheckCircle2 className="mx-auto text-emerald-400" size={48} />
                       <h4 className="text-2xl font-black text-white uppercase">Close Sequence Uninhibited</h4>
                       <p className="text-sm text-text-muted uppercase tracking-widest">No outstanding blockers in entity registry. Ready for ledger signoff.</p>
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      {activeData.blockers.map((blocker) => (
                        <motion.div
                          key={blocker.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="glass-card p-10 rounded-[2.5rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-white/5 hover:border-primary/20 transition-all"
                        >
                           <div className="space-y-3 flex-1">
                              <div className="flex items-center gap-3">
                                 <span className={cn(
                                   "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                   blocker.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                 )}>
                                    {blocker.severity}
                                 </span>
                                 <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{blocker.sapCode}</span>
                              </div>
                              <h4 className="text-xl font-black text-white uppercase tracking-tight">{blocker.name}</h4>
                           </div>

                           <div className="flex items-center gap-8 shrink-0">
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Est. Financial Risk</p>
                                 <p className="text-lg font-black text-rose-400 mt-0.5">{blocker.impact}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Time Risk</p>
                                 <p className="text-lg font-black text-white mt-0.5">{blocker.risk}</p>
                              </div>

                              <button 
                                onClick={() => handleAutoFix(blocker.id)}
                                disabled={isFixing === blocker.id}
                                className={cn(
                                  "px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3",
                                  isFixing === blocker.id 
                                    ? "bg-emerald-500/20 text-emerald-400" 
                                    : "bg-white text-black hover:scale-105"
                                )}
                              >
                                 {isFixing === blocker.id ? (
                                   <>
                                     <div className="w-3.5 h-3.5 border border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin" />
                                     Executing...
                                   </>
                                 ) : (
                                   <>
                                     <Zap size={12} />
                                     Auto-Fix
                                   </>
                                 )}
                              </button>
                           </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
               </AnimatePresence>
            </div>

            {/* AI Variance Commentary */}
            <div className="space-y-8">
               <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] ml-4">AI Variance Commentary</h3>
               <div className="glass-card p-12 rounded-[3rem] relative overflow-hidden group border-primary/20">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                     <TrendingUp size={160} />
                  </div>
                  
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <Sparkles size={16} className="text-primary" />
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">Natural Generation Feed</span>
                        </div>
                        <button 
                          onClick={handleGenerateNarrative}
                          disabled={isGeneratingNarrative}
                          className="text-[9px] font-black text-primary hover:text-white uppercase tracking-widest flex items-center gap-2 transition-colors"
                        >
                           {isGeneratingNarrative ? <div className="w-3 h-3 border border-primary/20 border-t-primary rounded-full animate-spin" /> : <Sparkles size={12} />}
                           Enforce Accrued Sweep
                        </button>
                     </div>

                     <p className="text-lg font-bold text-text-secondary leading-relaxed italic">
                        {activeData.varianceCommentary}
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Interactive Close Agent Column */}
         <aside className="space-y-8">
            <h3 className="text-[11px] font-black text-text-muted uppercase tracking-[0.5em] ml-4">Close Agent Integration</h3>
            <div className="glass-card rounded-[3rem] p-10 border-primary/20 flex flex-col h-[650px] overflow-hidden">
               {/* Chat Header */}
               <div className="flex items-center gap-4 pb-6 border-b border-white/5">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-glow-primary">
                     <MessageSquare size={20} />
                  </div>
                  <div>
                     <h4 className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Close Expert</h4>
                     <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-1 inline-block">ACDOCA COGNITION</span>
                  </div>
               </div>

               {/* Chat Streams */}
               <div className="flex-1 overflow-y-auto py-8 space-y-6 custom-scrollbar pr-2">
                  <AnimatePresence initial={false}>
                     {chatLogs.map((log, index) => (
                       <motion.div
                         key={index}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         className={cn(
                           "p-5 rounded-[2rem] max-w-[85%] text-xs font-semibold leading-relaxed relative",
                           log.role === 'user'
                             ? "bg-white/5 border border-white/5 text-white ml-auto rounded-tr-sm"
                             : "bg-primary/10 border border-primary/20 text-text-secondary mr-auto rounded-tl-sm"
                         )}
                       >
                          <p>{log.text}</p>
                          {log.citations && log.citations.length > 0 && (
                            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-2 items-center">
                               <Info size={10} className="text-primary" />
                               <span className="text-[8px] font-black uppercase text-text-muted tracking-widest">Citations:</span>
                               {log.citations.map((c) => (
                                 <span key={c} className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-black text-white">{c}</span>
                               ))}
                            </div>
                          )}
                       </motion.div>
                     ))}

                     {isTyping && (
                       <motion.div
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         className="bg-primary/10 border border-primary/20 p-5 rounded-[2rem] max-w-[80%] text-xs mr-auto flex items-center gap-2"
                       >
                          <div className="flex gap-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                             <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-primary">REASONING DIRECTIVE</span>
                       </motion.div>
                     )}
                  </AnimatePresence>
               </div>

               {/* Chat Input */}
               <form onSubmit={handleChatSubmit} className="pt-6 border-t border-white/5">
                  <div className="relative">
                     <input
                       type="text"
                       placeholder="Ask the close agent..."
                       value={chatQuery}
                       onChange={(e) => setChatQuery(e.target.value)}
                       className="w-full h-14 bg-white/[0.02] border border-white/10 rounded-2xl px-6 pr-14 text-xs font-semibold text-white placeholder:text-text-muted focus:border-primary/50 focus:bg-white/[0.04] transition-all outline-none"
                     />
                     <button
                       type="submit"
                       className="absolute right-2 top-2 p-3 bg-primary text-white rounded-xl hover:scale-105 transition-all outline-none"
                     >
                        <ArrowRight size={14} />
                     </button>
                  </div>
               </form>
            </div>
         </aside>
      </div>
    </div>
  );
}
