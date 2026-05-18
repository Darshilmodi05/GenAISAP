'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Zap, 
  ChevronRight, 
  Plus, 
  Settings, 
  X, 
  Network, 
  Lock, 
  Globe, 
  Cpu, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface Node {
  id: string;
  name: string;
  type: string;
  status: string;
  latency: string;
  module: string;
  color: string;
  sapUrl: string;
  username: string;
}

const initialNodes: Node[] = [
  { id: 'sap-prd', name: 'SAP S/4HANA Production', type: 'OData', status: 'connected', latency: '45ms', module: 'FICO/SD/MM', color: 'violet', sapUrl: 'https://prd-s4.sap.corp:8443', username: 'SAP_MGR_PRD' },
  { id: 'sap-sandbox', name: 'SAP Cloud Sandbox', type: 'OData', status: 'connected', latency: '120ms', module: 'FICO', color: 'cyan', sapUrl: 'https://sandbox.sap.corp:8443', username: 'SANDBOX_USER' },
  { id: 'ml-local', name: 'Local Intelligence Engine', type: 'REST', status: 'connected', latency: '5ms', module: 'ML', color: 'emerald', sapUrl: 'http://localhost:8000', username: 'LOCAL_AI_AGENT' },
];

export default function DataNodesPage() {
  const [nodes, setNodes] = React.useState<Node[]>(initialNodes);
  const [activeModal, setActiveModal] = React.useState<'configure' | 'provision' | null>(null);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  
  // Form states
  const [formName, setFormName] = React.useState('');
  const [formType, setFormType] = React.useState('OData');
  const [formSapUrl, setFormSapUrl] = React.useState('');
  const [formUsername, setFormUsername] = React.useState('');
  const [formModule, setFormModule] = React.useState('FICO');
  const [formColor, setFormColor] = React.useState('violet');

  // Connection testing states
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<'success' | 'failed' | null>(null);

  // Trigger modal for editing/configuring an existing node
  const handleOpenConfigure = (node: Node) => {
    setSelectedNode(node);
    setFormName(node.name);
    setFormType(node.type);
    setFormSapUrl(node.sapUrl);
    setFormUsername(node.username);
    setFormModule(node.module);
    setFormColor(node.color);
    setTestResult(null);
    setActiveModal('configure');
  };

  // Trigger modal for creating/provisioning a new node
  const handleOpenProvision = () => {
    setFormName('');
    setFormType('OData');
    setFormSapUrl('https://instance.sap.corp:8443');
    setFormUsername('SAP_DEV_USER');
    setFormModule('SD');
    setFormColor('violet');
    setTestResult(null);
    setActiveModal('provision');
  };

  // Simulate Testing Connection
  const handleTestConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      // Randomly succeed or fail just to show premium interactivity, leaning toward success
      const success = formSapUrl.trim().length > 10;
      setTestResult(success ? 'success' : 'failed');
    }, 1500);
  };

  // Handle saving configurations
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNode) return;

    setNodes(prev => prev.map(n => {
      if (n.id === selectedNode.id) {
        return {
          ...n,
          name: formName,
          type: formType,
          sapUrl: formSapUrl,
          username: formUsername,
          module: formModule,
          color: formColor,
          status: testResult === 'success' ? 'connected' : testResult === 'failed' ? 'error' : n.status,
          latency: testResult === 'success' ? `${Math.floor(Math.random() * 80) + 15}ms` : n.latency
        };
      }
      return n;
    }));
    setActiveModal(null);
  };

  // Handle provisioning a new node
  const handleProvisionNode = (e: React.FormEvent) => {
    e.preventDefault();
    const colors = ['violet', 'cyan', 'emerald'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newNode: Node = {
      id: `node_${Date.now()}`,
      name: formName || 'New Institutional Node',
      type: formType,
      sapUrl: formSapUrl,
      username: formUsername,
      module: formModule,
      color: formColor || randomColor,
      status: testResult === 'success' ? 'connected' : 'disconnected',
      latency: testResult === 'success' ? `${Math.floor(Math.random() * 50) + 10}ms` : 'N/A'
    };

    setNodes(prev => [...prev, newNode]);
    setActiveModal(null);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-24 pb-40 relative animate-fade-in px-4">
      {/* Node Deck Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Institutional Connectivity Mesh</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             DATA <br/> <span className="text-gradient">NODES</span>
          </h1>
        </div>
        <div className="flex gap-4">
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
             <button 
               onClick={handleOpenProvision}
               className="h-20 px-12 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-3xl shadow-glow-primary hover:scale-105 transition-all text-xs flex items-center gap-4 border border-primary/30"
             >
               <Plus size={16} strokeWidth={3} />
               Provision New Node
             </button>
           </motion.div>
        </div>
      </div>

      {/* Grid of Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 relative z-10">
        {nodes.map((node, idx) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
          >
            <Card className={cn(
              "glass-card rounded-[4rem] p-12 overflow-hidden flex flex-col transition-all duration-700 group h-[520px] shadow-2xl relative border-white/5 bg-white/[0.01]",
              node.color === 'violet' ? "hover:border-violet-500/30" :
              node.color === 'cyan' ? "hover:border-cyan-500/30" :
              "hover:border-emerald-500/30"
            )}>
              <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                 <Database size={200} />
              </div>
              
              <div className="flex-1 space-y-12">
                <div className="flex justify-between items-start">
                   <div className={cn(
                     "w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:rotate-12",
                     node.color === 'violet' ? "bg-violet-500/20 text-violet-400" :
                     node.color === 'cyan' ? "bg-cyan-500/20 text-cyan-400" :
                     "bg-emerald-500/20 text-emerald-400"
                   )}>
                      <Zap size={32} />
                   </div>
                   <div className="flex flex-col items-end gap-2">
                      <Badge className={cn(
                        "text-[9px] font-black px-4 py-1.5 border-none tracking-widest rounded-xl uppercase",
                        node.status === 'connected' ? "bg-emerald-500/10 text-emerald-400" : 
                        node.status === 'error' ? "bg-rose-500/10 text-rose-400" : "bg-zinc-500/10 text-zinc-400"
                      )}>
                        {node.status}
                      </Badge>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{node.type} GATEWAY</span>
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-5xl font-black text-white tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">{node.name}</h3>
                   <div className="flex items-center gap-4">
                      <div className="px-5 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                         {node.module} CLUSTER
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Latency</p>
                      <p className="text-3xl font-black text-white tracking-tighter">{node.latency}</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Telemetry</p>
                      <p className="text-3xl font-black text-white tracking-tighter uppercase">
                        {node.status === 'connected' ? 'LIVE' : node.status === 'error' ? 'OFFLINE' : 'STBY'}
                      </p>
                   </div>
                </div>
              </div>

              <div className="mt-auto pt-10 flex gap-4 relative z-10">
                 <button 
                   onClick={() => handleOpenConfigure(node)}
                   className="flex-1 h-20 bg-white/5 hover:bg-white/10 rounded-[2rem] text-[10px] font-black text-white uppercase tracking-[0.4em] transition-all border border-white/5 flex items-center justify-center gap-4 group/btn"
                 >
                    <Settings size={16} className="group-hover/btn:rotate-90 transition-transform" />
                    Configure
                 </button>
                 <button 
                   onClick={() => handleOpenConfigure(node)}
                   className="w-20 h-20 bg-white/5 hover:bg-primary rounded-[2rem] flex items-center justify-center text-white/40 hover:text-white transition-all border border-white/5 hover:border-primary"
                 >
                    <ChevronRight size={24} />
                 </button>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Provision Placeholder Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card 
            onClick={handleOpenProvision}
            className="glass-card rounded-[4rem] p-12 border-dashed border-white/10 bg-white/[0.01] h-[520px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white/[0.02] transition-all"
          >
             <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:scale-110 transition-all mb-10 shadow-2xl">
                <Plus size={40} strokeWidth={3} />
             </div>
             <h4 className="text-3xl font-black text-white/40 uppercase tracking-tight group-hover:text-white transition-all mb-4">Neural Instance</h4>
             <p className="text-sm font-bold text-text-muted uppercase tracking-widest max-w-[200px]">Provision additional SAP OData endpoints</p>
          </Card>
        </motion.div>
      </div>

      {/* Telemetry Governance Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative z-10"
      >
        <Card className="glass-card p-24 rounded-[6rem] flex flex-col items-center text-center group overflow-hidden relative border-dashed border-white/10 bg-white/[0.01]">
          <h3 className="text-5xl font-black text-white/20 uppercase tracking-[0.5em] mb-10 group-hover:text-white transition-all duration-1000 leading-none">TELEMETRY GOVERNANCE</h3>
          <p className="text-2xl text-text-secondary max-w-5xl font-semibold leading-relaxed">
            Manage institutional data connections across global S/4HANA instances. Ensure 256-bit quantum encryption across all OData and REST endpoints.
          </p>
        </Card>
      </motion.div>

      {/* Modern High-Fidelity Dialog Overlay Panels */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[800px] bg-[#0c0c14] border border-white/10 p-12 lg:p-16 rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Corner Glow effect */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none rounded-full" />

              {/* Close Button */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-10 right-10 w-14 h-14 bg-white/5 hover:bg-white hover:text-black rounded-full flex items-center justify-center text-text-secondary transition-all border border-white/5"
              >
                <X size={20} />
              </button>

              <div className="space-y-12">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/20">
                    <Network size={12} className="text-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                      {activeModal === 'configure' ? 'Station Configuration' : 'System Provisioning'}
                    </span>
                  </div>
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                    {activeModal === 'configure' ? 'Configure Gateway Node' : 'Provision Gateway Node'}
                  </h2>
                  <p className="text-sm font-semibold text-text-muted">
                    Configure OData credentials and latency thresholds for corporate SAP environments.
                  </p>
                </div>

                <form onSubmit={activeModal === 'configure' ? handleSaveChanges : handleProvisionNode} className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Node Name */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-3">Node Identity</label>
                      <input 
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. SAP Cloud Sandbox"
                        required
                        className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-6 text-base font-bold text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
                      />
                    </div>

                    {/* Gateway Type */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-3">Protocol Type</label>
                      <select 
                        value={formType}
                        onChange={(e) => setFormType(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-6 text-base font-bold text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all appearance-none"
                      >
                        <option value="OData" className="bg-[#0c0c14] text-white">SAP OData v4 Gateway</option>
                        <option value="REST" className="bg-[#0c0c14] text-white">REST HTTPS Endpoint</option>
                        <option value="GraphQL" className="bg-[#0c0c14] text-white">GraphQL Mesh Node</option>
                      </select>
                    </div>

                    {/* SAP URL */}
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-3">Endpoint Endpoint URL</label>
                      <div className="relative">
                        <input 
                          type="url"
                          value={formSapUrl}
                          onChange={(e) => setFormSapUrl(e.target.value)}
                          placeholder="https://prd-s4.sap.corp:8443"
                          required
                          className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-6 pl-14 text-base font-bold text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
                        />
                        <Globe size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-3">Client Username / ID</label>
                      <div className="relative">
                        <input 
                          type="text"
                          value={formUsername}
                          onChange={(e) => setFormUsername(e.target.value)}
                          placeholder="SAP_MGR_PRD"
                          required
                          className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-6 pl-14 text-base font-bold text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
                        />
                        <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted" />
                      </div>
                    </div>

                    {/* SAP Modules */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted ml-3">Target Modules</label>
                      <input 
                        type="text"
                        value={formModule}
                        onChange={(e) => setFormModule(e.target.value)}
                        placeholder="FICO/SD"
                        required
                        className="w-full bg-white/5 border border-white/5 rounded-[1.8rem] p-6 text-base font-bold text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all"
                      />
                    </div>
                  </div>

                  {/* Telemetry Testing Board */}
                  <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Cpu size={16} className="text-text-muted" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">Connection Validator</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleTestConnection}
                        disabled={isTesting}
                        className={cn(
                          "h-12 px-6 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2",
                          isTesting 
                            ? "bg-white/10 text-white cursor-not-allowed" 
                            : "bg-white/5 hover:bg-white hover:text-black text-white"
                        )}
                      >
                        <RefreshCw size={12} className={cn("transition-transform duration-1000", isTesting && "animate-spin")} />
                        {isTesting ? 'Testing Link...' : 'Test Connection'}
                      </button>
                    </div>

                    {/* Telemetry Status Output */}
                    <AnimatePresence mode="wait">
                      {isTesting && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0 }} 
                          className="flex items-center gap-4 text-cyan-400"
                        >
                          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                          <span className="text-xs font-bold uppercase tracking-widest">Handshaking client certificates...</span>
                        </motion.div>
                      )}
                      
                      {!isTesting && testResult === 'success' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        >
                          <CheckCircle2 size={18} />
                          <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-wider">Gateway Link Validated</span>
                            <span className="text-[10px] font-medium opacity-80">Encryption validated. Telemetry successfully returned ping in 32ms.</span>
                          </div>
                        </motion.div>
                      )}

                      {!isTesting && testResult === 'failed' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="flex items-center gap-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400"
                        >
                          <AlertTriangle size={18} />
                          <div className="flex flex-col">
                            <span className="text-xs font-black uppercase tracking-wider">Handshake Failure</span>
                            <span className="text-[10px] font-medium opacity-80">Invalid credentials or URL endpoint unresponsive. Ensure 8443 is exposed.</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-6 border-t border-white/5 flex gap-4 justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="h-16 px-10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[10px] transition-all border border-white/5"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="h-16 px-10 bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-[0.2em] rounded-2xl text-[10px] transition-all shadow-glow-primary border border-primary/30"
                    >
                      {activeModal === 'configure' ? 'Save Configurations' : 'Provision Gateway'}
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
