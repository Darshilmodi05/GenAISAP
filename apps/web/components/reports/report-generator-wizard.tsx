'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Database, 
  BarChart3, 
  FileText, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { id: 1, title: 'Module Cluster', description: 'Select the institutional domain for synthesis.' },
  { id: 2, title: 'Metric Vectors', description: 'Define the telemetry nodes to interrogate.' },
  { id: 3, title: 'Manifest Format', description: 'Choose the executive delivery structure.' },
  { id: 4, title: 'Neural Synthesis', description: 'AI is orchestrating the final manifest.' },
];

const modules = [
  { id: 'FICO', label: 'Financial Core', icon: Database, color: 'text-violet-400' },
  { id: 'SD', label: 'Sales & Distribution', icon: Zap, color: 'text-cyan-400' },
  { id: 'MM', label: 'Materials Management', icon: BarChart3, color: 'text-emerald-400' },
];

export const ReportGeneratorWizard = ({ onClose }: { onClose: () => void }) => {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedModule, setSelectedModule] = React.useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = React.useState(false);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setCurrentStep(4);
      startSynthesis();
    }
  };

  const startSynthesis = async () => {
    setIsSynthesizing(true);
    // Simulated AI Synthesis Pipeline
    await new Promise(r => setTimeout(r, 4000));
    setIsSynthesizing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-5xl bg-[#080808] border border-white/10 rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row h-[700px]"
      >
        {/* Sidebar Steps */}
        <div className="w-full lg:w-80 bg-white/[0.02] border-r border-white/5 p-12 flex flex-col gap-12">
           <div className="space-y-4">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-glow-primary">
                 <Cpu size={24} />
              </div>
              <h2 className="text-xs font-black text-white uppercase tracking-[0.4em]">Synthesis Wizard</h2>
           </div>

           <div className="flex-1 space-y-8">
              {steps.map((step) => (
                <div key={step.id} className={cn(
                  "flex items-center gap-4 transition-all duration-500",
                  currentStep === step.id ? "opacity-100 scale-105" : "opacity-30"
                )}>
                   <div className={cn(
                     "w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-black",
                     currentStep >= step.id ? "border-primary bg-primary text-white" : "border-white/20 text-white"
                   )}>
                      {step.id}
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{step.title}</p>
                      <p className="text-[8px] text-text-muted uppercase tracking-tighter leading-tight">{step.description}</p>
                   </div>
                </div>
              ))}
           </div>

           <button onClick={onClose} className="text-[10px] font-black text-text-muted hover:text-white uppercase tracking-[0.3em] transition-all">
              Cancel Operation
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-16 lg:p-24 flex flex-col relative overflow-hidden">
           <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 flex-1"
                >
                   <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">Select Module <br/> <span className="text-primary">Domain</span></h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                      {modules.map((m) => {
                        const Icon = m.icon;
                        return (
                          <button
                            key={m.id}
                            onClick={() => setSelectedModule(m.id)}
                            className={cn(
                              "glass-card p-10 rounded-[3rem] border-white/5 hover:border-primary/40 transition-all group flex flex-col items-center gap-6 text-center",
                              selectedModule === m.id && "border-primary bg-primary/5"
                            )}
                          >
                             <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center transition-all duration-700 group-hover:scale-110", m.color)}>
                                <Icon size={28} />
                             </div>
                             <span className="text-xs font-black text-white uppercase tracking-[0.2em]">{m.label}</span>
                          </button>
                        );
                      })}
                   </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 flex-1"
                >
                   <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">Configure <br/> <span className="text-primary">Telemetry</span></h3>
                   <div className="space-y-6 pt-8">
                      {['Transactional Velocity', 'Fiscal Variance', 'Supply Chain Latency'].map((metric) => (
                        <div key={metric} className="p-8 glass-card rounded-3xl border-white/5 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer">
                           <span className="text-sm font-black text-white uppercase tracking-wider">{metric}</span>
                           <div className="w-6 h-6 rounded-lg border-2 border-primary bg-primary/10" />
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12 flex-1"
                >
                   <h3 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">Delivery <br/> <span className="text-primary">Format</span></h3>
                   <div className="grid grid-cols-2 gap-8 pt-8">
                      {['Executive Narrative', 'Full Technical Manifest'].map((format) => (
                        <div key={format} className="p-12 glass-card rounded-[3rem] border-white/5 hover:border-primary/40 transition-all flex flex-col gap-6 cursor-pointer">
                           <FileText className="text-primary" size={32} />
                           <span className="text-sm font-black text-white uppercase tracking-wider">{format}</span>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center text-center gap-12"
                >
                   {isSynthesizing ? (
                     <>
                        <div className="relative">
                           <div className="w-32 h-32 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <Cpu className="text-primary animate-pulse" size={40} />
                           </div>
                        </div>
                        <div className="space-y-4">
                           <h3 className="text-4xl font-black text-white uppercase tracking-widest">Neural Synthesis Active</h3>
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em]">Orchestrating SAP S/4HANA Contextual Vectors</p>
                        </div>
                     </>
                   ) : (
                     <>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-[0_0_60px_rgba(16,185,129,0.4)]"
                        >
                           <CheckCircle2 size={60} />
                        </motion.div>
                        <div className="space-y-4">
                           <h3 className="text-4xl font-black text-white uppercase tracking-widest">Manifest Ready</h3>
                           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.5em]">Synthesis Complete — Verified for Executive Delivery</p>
                        </div>
                        <button 
                          onClick={onClose}
                          className="px-16 py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-3xl shadow-2xl hover:scale-105 transition-all text-xs"
                        >
                           Download Manifest
                        </button>
                     </>
                   )}
                </motion.div>
              )}
           </AnimatePresence>

           {currentStep < 4 && (
             <div className="mt-auto flex justify-between items-center pt-12 border-t border-white/5">
                <button 
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="p-4 rounded-full border border-white/10 text-white disabled:opacity-0 transition-all hover:bg-white/5"
                >
                   <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={currentStep === 1 && !selectedModule}
                  className="px-12 py-5 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-glow-primary hover:scale-105 active:scale-95 transition-all flex items-center gap-4 disabled:opacity-50"
                >
                   {currentStep === 3 ? 'Initiate Synthesis' : 'Next Step'}
                   <ChevronRight size={16} />
                </button>
             </div>
           )}
           
           <div className="absolute inset-0 bg-neural-mesh opacity-[0.02] pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
