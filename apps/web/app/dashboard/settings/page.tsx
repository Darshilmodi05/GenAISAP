'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Cpu, 
  Network, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight,
  Database,
  Zap,
  Globe,
  Activity,
  Key,
  ToggleLeft,
  ToggleRight,
  Server,
  Lock,
  QrCode,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

const tabs = [
  { id: 'general',      label: 'Core Configuration', icon: Settings, color: 'violet' },
  { id: 'ai-config',    label: 'Neural Engine',      icon: Cpu,      color: 'cyan' },
  { id: 'integrations', label: 'Telemetry Nodes',    icon: Network,  color: 'emerald' },
  { id: 'security',     label: 'Quantum Security',   icon: ShieldCheck, color: 'violet' },
  { id: 'billing',      label: 'Resource Allocation', icon: CreditCard, color: 'cyan' },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');

  // MFA Interactive enrollment states
  const [isMfaModalOpen, setIsMfaModalOpen] = React.useState(false);
  const [isMfaActive, setIsMfaActive] = React.useState(false);
  const [mfaCode, setMfaCode] = React.useState('');
  const [isMfaVerifying, setIsMfaVerifying] = React.useState(false);
  const [mfaSuccess, setMfaSuccess] = React.useState<boolean | null>(null);

  // Trigger MFA setup wizard
  const handleToggleMfa = (nextState: boolean) => {
    if (nextState) {
      // Open TOTP enrollment modal
      setMfaCode('');
      setMfaSuccess(null);
      setIsMfaVerifying(false);
      setIsMfaModalOpen(true);
    } else {
      // Direct disable
      setIsMfaActive(false);
    }
  };

  // Verify TOTP enrollment code
  const handleVerifyMfa = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length !== 6) return;

    setIsMfaVerifying(true);
    setMfaSuccess(null);

    setTimeout(() => {
      setIsMfaVerifying(false);
      // Mock code verification - accept any 6-digit numeric combination
      const isValid = /^\d{6}$/.test(mfaCode);
      if (isValid) {
        setMfaSuccess(true);
        setIsMfaActive(true);
        setTimeout(() => {
          setIsMfaModalOpen(false);
        }, 1200);
      } else {
        setMfaSuccess(false);
      }
    }, 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-20 pb-40 animate-fade-in px-4">
      {/* Header Deck */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">System Governance Console</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             NEXUS <br/> <span className="text-gradient">STATIONS</span>
          </h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 relative z-10">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 space-y-4">
           {tabs.map((tab) => {
             const active = activeTab === tab.id;
             const Icon = tab.icon;
             return (
               <motion.button
                 key={tab.id}
                 whileHover={{ x: 10, scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 onClick={() => setActiveTab(tab.id)}
                 className={cn(
                   "w-full flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500 group relative overflow-hidden",
                   active 
                     ? "text-black shadow-[0_0_40px_rgba(255,255,255,0.2)]" 
                     : "text-text-muted hover:text-white hover:bg-white/5"
                 )}
               >
                 {active && (
                   <motion.div 
                     layoutId="settings-active"
                     className="absolute inset-0 bg-white"
                     transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                   />
                 )}
                 <div className="flex items-center gap-5 relative z-10">
                    <Icon size={20} className={cn("transition-transform duration-500", active ? "scale-110" : "group-hover:scale-110")} />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
                 </div>
                 <ChevronRight size={16} className={cn("relative z-10 transition-all opacity-0 group-hover:opacity-100", active ? "translate-x-0" : "translate-x-4")} />
               </motion.button>
             );
           })}
        </aside>

        {/* Content Station */}
        <main className="flex-1">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
               className="glass-card rounded-[4rem] p-12 lg:p-20 relative overflow-hidden group"
             >
                <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Settings size={200} />
                </div>

                {activeTab === 'general' && (
                  <div className="space-y-16 relative z-10">
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black text-white uppercase tracking-tight">Core Instance</h3>
                       <p className="text-lg text-text-secondary font-medium">Configure high-level workspace metadata and regional SAP telemetry.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted ml-4">Workspace Identity</label>
                          <input 
                            defaultValue="GenAISAP ALPHA-01"
                            className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 text-xl font-bold text-white outline-none focus:border-primary/50 transition-all" 
                          />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted ml-4">Institutional Domain</label>
                          <input 
                            defaultValue="intelligence.sap.corp"
                            className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 text-xl font-bold text-white outline-none focus:border-primary/50 transition-all" 
                          />
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'ai-config' && (
                  <div className="space-y-16 relative z-10">
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black text-white uppercase tracking-tight">Neural Engine</h3>
                       <p className="text-lg text-text-secondary font-medium">Configure foundational LLM cognitive controls and temperature indexes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted ml-4">Inference Node Model</label>
                          <select className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 text-xl font-bold text-white outline-none focus:border-primary/50 appearance-none">
                            <option className="bg-black">Claude 3.5 Sonnet (Primary)</option>
                            <option className="bg-black">GPT-4o Omnidirectional</option>
                          </select>
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted ml-4">RAG Chunk Capacity</label>
                          <input 
                            type="number"
                            defaultValue={20}
                            className="w-full bg-white/5 border border-white/5 rounded-[2rem] p-8 text-xl font-bold text-white outline-none focus:border-primary/50 transition-all" 
                          />
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'integrations' && (
                  <div className="space-y-16 relative z-10">
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black text-white uppercase tracking-tight">Telemetry Nodes</h3>
                       <p className="text-lg text-text-secondary font-medium">Monitor and sync active SAP OData connections and REST mesh nodes.</p>
                    </div>
                    <div className="space-y-6">
                      {[
                        { label: 'SAP Production Gateway', status: 'connected', latency: '45ms' },
                        { label: 'SAP Cloud Sandbox', status: 'connected', latency: '120ms' },
                        { label: 'Local Intelligence Engine', status: 'connected', latency: '5ms' },
                      ].map((node) => (
                        <div key={node.label} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] flex items-center justify-between hover:bg-white/[0.04] transition-all">
                           <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                               <Server size={20} />
                             </div>
                             <div>
                               <p className="text-base font-black text-white uppercase tracking-tight">{node.label}</p>
                               <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">LATENCY: {node.latency}</p>
                             </div>
                           </div>
                           <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 px-4 py-2 border-none rounded-xl tracking-widest">
                             {node.status}
                           </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-8 border-t border-white/5 flex justify-end">
                      <button className="px-12 py-6 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all">
                        Sync All Nodes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-16 relative z-10">
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black text-white uppercase tracking-tight">Quantum Security</h3>
                       <p className="text-lg text-text-secondary font-medium">Configure 256-bit encryption, MFA protocols and institutional access controls.</p>
                    </div>
                    <div className="space-y-6">
                      <SecurityToggle 
                        label="AES-256 Data Encryption" 
                        desc="All at-rest and in-transit data encrypted" 
                        enabled={true} 
                      />
                      <SecurityToggle 
                        label="Multi-Factor Authentication" 
                        desc="TOTP-based MFA setup for executive roles" 
                        enabled={isMfaActive} 
                        onToggle={handleToggleMfa}
                      />
                      <SecurityToggle 
                        label="IP Allowlist Enforcement" 
                        desc="Restrict access to corporate CIDR ranges" 
                        enabled={false} 
                      />
                      <SecurityToggle 
                        label="Audit Log Streaming" 
                        desc="Real-time log forwarding to SIEM" 
                        enabled={true} 
                      />
                    </div>
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] flex items-center gap-6">
                      <ShieldCheck size={28} className="text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-base font-black text-white uppercase tracking-tight">
                          Security Score: {isMfaActive ? '94/100' : '82/100'}
                        </p>
                        <p className="text-xs text-text-muted font-bold uppercase tracking-widest mt-1">
                          {isMfaActive 
                            ? 'MFA verified. Enable IP Allowlist for perfect 100/100 score.' 
                            : 'Enable TOTP-based Multi-Factor Authentication to raise security score.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-16 relative z-10">
                    <div className="space-y-4">
                       <h3 className="text-4xl font-black text-white uppercase tracking-tight">Resource Allocation</h3>
                       <p className="text-lg text-text-secondary font-medium">Monitor compute credits, API call quotas and neural inference budgets.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {[
                        { label: 'AI Inferences', used: 8420, total: 10000, color: 'violet' },
                        { label: 'API Calls', used: 54200, total: 100000, color: 'cyan' },
                        { label: 'Vector Queries', used: 12800, total: 50000, color: 'emerald' },
                      ].map((res) => {
                        const pct = Math.round((res.used / res.total) * 100);
                        return (
                          <div key={res.label} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em]">{res.label}</p>
                            <p className="text-4xl font-black text-white">{pct}%</p>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                className={cn('h-full rounded-full', res.color === 'violet' ? 'bg-primary' : res.color === 'cyan' ? 'bg-secondary' : 'bg-emerald-500')}
                              />
                            </div>
                            <p className="text-xs text-text-muted font-bold">{res.used.toLocaleString()} / {res.total.toLocaleString()}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-black text-white uppercase">Enterprise Tier</p>
                        <p className="text-sm text-text-muted font-bold uppercase tracking-widest mt-1">Renews Jun 01, 2026 • $2,400/mo</p>
                      </div>
                      <button className="px-10 py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all">
                        Upgrade Cluster
                      </button>
                    </div>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>

      {/* TOTP Multi-Factor Authentication setup modal */}
      <AnimatePresence>
        {isMfaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMfaModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-[550px] bg-[#0c0c14] border border-white/10 p-12 rounded-[3.5rem] shadow-[0_0_80px_rgba(0,0,0,0.9)] text-center overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] pointer-events-none rounded-full" />
              
              <button 
                onClick={() => setIsMfaModalOpen(false)}
                className="absolute top-8 right-8 w-12 h-12 bg-white/5 hover:bg-white hover:text-black rounded-full flex items-center justify-center text-text-secondary transition-all border border-white/5"
              >
                <X size={16} />
              </button>

              <div className="space-y-10">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-4">
                    <Lock size={28} />
                  </div>
                  <h3 className="text-3xl font-black text-white uppercase tracking-tight">Configure TOTP MFA</h3>
                  <p className="text-xs text-text-muted uppercase tracking-widest font-bold max-w-sm mx-auto">
                    Secure your SAP governance node using an authenticator app.
                  </p>
                </div>

                {/* Abstract Glowing QR Code Matrix */}
                <div className="p-6 bg-white rounded-3xl w-[210px] mx-auto shadow-2xl relative group">
                  <svg width="162" height="162" viewBox="0 0 100 100" className="mx-auto">
                    <rect x="2" y="2" width="26" height="26" fill="black" stroke="black" strokeWidth="1.5"/>
                    <rect x="7" y="7" width="16" height="16" fill="white"/>
                    <rect x="10" y="10" width="10" height="10" fill="black"/>
                    
                    <rect x="72" y="2" width="26" height="26" fill="black" stroke="black" strokeWidth="1.5"/>
                    <rect x="77" y="7" width="16" height="16" fill="white"/>
                    <rect x="80" y="10" width="10" height="10" fill="black"/>

                    <rect x="2" y="72" width="26" height="26" fill="black" stroke="black" strokeWidth="1.5"/>
                    <rect x="7" y="77" width="16" height="16" fill="white"/>
                    <rect x="10" y="80" width="10" height="10" fill="black"/>

                    <rect x="35" y="10" width="6" height="6" fill="black"/>
                    <rect x="45" y="4" width="10" height="6" fill="black"/>
                    <rect x="38" y="22" width="6" height="12" fill="black"/>
                    <rect x="58" y="16" width="6" height="6" fill="black"/>
                    
                    <rect x="8" y="38" width="6" height="6" fill="black"/>
                    <rect x="22" y="48" width="12" height="6" fill="black"/>
                    <rect x="14" y="54" width="6" height="12" fill="black"/>
                    <rect x="28" y="62" width="6" height="6" fill="black"/>

                    <rect x="36" y="36" width="28" height="28" fill="black"/>
                    <rect x="42" y="42" width="16" height="16" fill="white"/>
                    <rect x="46" y="46" width="8" height="8" fill="black"/>

                    <rect x="72" y="36" width="6" height="16" fill="black"/>
                    <rect x="82" y="48" width="16" height="6" fill="black"/>
                    
                    <rect x="36" y="72" width="16" height="6" fill="black"/>
                    <rect x="42" y="82" width="6" height="16" fill="black"/>
                    <rect x="56" y="86" width="16" height="6" fill="black"/>
                    
                    <rect x="76" y="76" width="12" height="12" fill="black"/>
                  </svg>
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] rounded-3xl">
                    <QrCode size={40} className="text-primary animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">SECRET CODE KEY</p>
                  <code className="bg-[#050508] border border-white/5 rounded-2xl px-6 py-3 font-mono text-xs text-primary font-black select-all">
                    JBSW Y3DP EHPK 3PXP
                  </code>
                </div>

                {/* Form to submit and verify */}
                <form onSubmit={handleVerifyMfa} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.25em] text-text-muted">Enter Authenticator Verification Code</label>
                    <input 
                      type="text"
                      maxLength={6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      required
                      className="w-48 bg-white/5 border border-white/5 rounded-2xl p-4 text-center text-2xl font-mono font-black text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all tracking-[0.3em] mx-auto block"
                    />
                  </div>

                  {/* Telemetry output */}
                  <AnimatePresence mode="wait">
                    {isMfaVerifying && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3 text-cyan-400 text-xs font-bold uppercase tracking-wider"
                      >
                        <RefreshCw size={14} className="animate-spin" />
                        Validating TOTP signature...
                      </motion.div>
                    )}

                    {mfaSuccess === true && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider"
                      >
                        <CheckCircle2 size={16} />
                        MFA verified successfully!
                      </motion.div>
                    )}

                    {mfaSuccess === false && (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider"
                      >
                        <AlertCircle size={16} />
                        Invalid verification code.
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setIsMfaModalOpen(false)}
                      className="flex-1 h-14 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[9px] transition-all border border-white/5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isMfaVerifying || mfaCode.length !== 6}
                      className="flex-1 h-14 bg-primary hover:bg-primary-hover disabled:bg-primary/40 disabled:text-white/40 text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[9px] transition-all shadow-glow-primary border border-primary/30"
                    >
                      Verify setup
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SecurityToggleProps {
  label: string;
  desc: string;
  enabled: boolean;
  onToggle?: (newState: boolean) => void;
}

function SecurityToggle({ label, desc, enabled, onToggle }: SecurityToggleProps) {
  return (
    <div
      className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:bg-white/[0.04] transition-all cursor-pointer"
      onClick={() => {
        if (onToggle) {
          onToggle(!enabled);
        }
      }}
    >
      <div className="space-y-1">
        <p className="text-base font-black text-white uppercase tracking-tight">{label}</p>
        <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest">{desc}</p>
      </div>
      <div className={cn('transition-all duration-300', enabled ? 'text-emerald-400' : 'text-text-muted')}>
        {enabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
      </div>
    </div>
  );
}
