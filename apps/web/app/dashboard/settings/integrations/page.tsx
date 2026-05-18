'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Link, Mail, MessageSquare, ShieldCheck, Server, Webhook } from 'lucide-react';

export default function IntegrationsPage() {
  const [sapConnected, setSapConnected] = React.useState(true);
  const [isTesting, setIsTesting] = React.useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSapConnected(true);
    setIsTesting(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-16 pb-40 animate-fade-in relative px-4">
      {/* Header */}
      <div className="pt-6 border-b border-white/5 pb-12">
         <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none mb-4">
            Ecosystem <span className="text-primary">Integrations</span>
         </h1>
         <p className="text-text-secondary text-lg max-w-2xl font-medium">
            Configure SAP S/4HANA OData connections and secure third-party webhook relays for neural alerts.
         </p>
      </div>

      <div className="space-y-12">
         {/* Core SAP Connector */}
         <section className="space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Database size={20} />
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">SAP S/4HANA Core</h2>
            </div>
            
            <Card className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col xl:flex-row gap-12 relative overflow-hidden">
               <div className="flex-1 space-y-8 relative z-10">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Instance URL (OData V4)</label>
                     <input 
                        type="text" 
                        defaultValue="https://s4hana-prod.enterprise.internal:44300/sap/opu/odata/"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:outline-none focus:border-primary/50 transition-colors"
                     />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Client ID</label>
                        <input 
                           type="text" 
                           defaultValue="genaisap-service-449"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Client Secret</label>
                        <input 
                           type="password" 
                           defaultValue="••••••••••••••••"
                           className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        />
                     </div>
                  </div>

                  <div className="pt-4 flex items-center gap-6">
                     <Button 
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className="px-10 py-6 bg-white text-black font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-neutral-200 transition-all text-[11px]"
                     >
                        {isTesting ? 'Initiating Handshake...' : 'Test Connection'}
                     </Button>
                     {sapConnected && !isTesting && (
                        <div className="flex items-center gap-3 text-emerald-400">
                           <ShieldCheck size={20} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Verified • Latency: 42ms</span>
                        </div>
                     )}
                  </div>
               </div>

               <div className="w-full xl:w-80 bg-white/[0.02] rounded-3xl border border-white/5 p-8 flex flex-col justify-center space-y-6 relative z-10">
                  <div className="space-y-1">
                     <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Active Modules</h4>
                     <p className="text-sm text-white font-medium">Neural Sync Status</p>
                  </div>
                  <div className="space-y-4">
                     {['FICO_CORE', 'MM_INVENTORY', 'SD_SALES'].map((mod) => (
                        <div key={mod} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                           <span className="text-[10px] font-black text-white uppercase tracking-widest">{mod}</span>
                           <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="absolute right-0 top-0 w-96 h-96 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
            </Card>
         </section>

         {/* Third-Party Connectors */}
         <section className="space-y-6 pt-10 border-t border-white/5">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <Webhook size={20} />
               </div>
               <h2 className="text-2xl font-black text-white uppercase tracking-widest">Notification Relays</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Slack Integration */}
               <div className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col gap-8 relative group hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start">
                     <div className="w-16 h-16 rounded-2xl bg-[#E01E5A]/10 text-[#E01E5A] flex items-center justify-center">
                        <MessageSquare size={28} />
                     </div>
                     <div className="px-4 py-1.5 rounded-full bg-[#E01E5A]/10 border border-[#E01E5A]/20 text-[#E01E5A] text-[9px] font-black uppercase tracking-widest">
                        Connected
                     </div>
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Slack Enterprise</h3>
                     <p className="text-xs text-text-secondary leading-relaxed font-medium">
                        Routes critical ML anomaly alerts and month-end close blockers to #finance-alerts.
                     </p>
                  </div>
                  <Button variant="outline" className="mt-auto border-white/10 text-white hover:bg-white/5 rounded-xl uppercase tracking-widest text-[10px] font-black h-12">
                     Configure Routing
                  </Button>
               </div>

               {/* Email Reports */}
               <div className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col gap-8 relative group hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start">
                     <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <Mail size={28} />
                     </div>
                     <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-text-muted text-[9px] font-black uppercase tracking-widest">
                        Not Configured
                     </div>
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">SMTP Mail Relay</h3>
                     <p className="text-xs text-text-secondary leading-relaxed font-medium">
                        Automatically distribute PDF and Excel neural manifests to executive distribution lists.
                     </p>
                  </div>
                  <Button className="mt-auto bg-white text-black hover:bg-neutral-200 rounded-xl uppercase tracking-widest text-[10px] font-black h-12">
                     Connect SMTP Server
                  </Button>
               </div>
            </div>
         </section>
      </div>
    </div>
  );
}
