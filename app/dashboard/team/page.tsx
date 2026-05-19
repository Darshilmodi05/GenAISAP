'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Shield, 
  MoreHorizontal, 
  Circle,
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const team = [
  { name: 'Sarah Miller',    email: 's.miller@enterprise.corp',    role: 'Financial Controller', module: 'FICO', status: 'active', color: 'violet' },
  { name: 'Marcus Chen',     email: 'm.chen@enterprise.corp',      role: 'Supply Chain Lead',    module: 'MM',   status: 'active', color: 'emerald' },
  { name: 'Elena Rodriguez', email: 'e.rodriguez@enterprise.corp', role: 'Sales Director',       module: 'SD',   status: 'away',   color: 'cyan' },
  { name: 'David Hoffman',   email: 'd.hoffman@enterprise.corp',   role: 'System Architect',     module: 'ROOT', status: 'active', color: 'violet' },
];

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="max-w-[1400px] mx-auto space-y-20 pb-40 animate-fade-in px-4">
      {/* Header Deck */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pt-6 relative z-10 border-b border-white/5 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-xl">
             <div className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Institutional Access Hub</span>
          </div>
          <h1 className="text-8xl lg:text-9xl font-black tracking-[-0.06em] leading-[0.8] text-white">
             TEAM <br/> <span className="text-gradient">NODES</span>
          </h1>
        </div>
        
        <button className="flex items-center gap-4 px-12 py-6 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all group">
           <UserPlus size={16} />
           Provision New Node
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-8 relative z-10">
         <div className="relative group w-full max-w-xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
            <input 
              placeholder="Search by name, role or module cluster..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/5 rounded-[2rem] py-6 pl-16 pr-8 text-lg font-medium text-white outline-none focus:border-primary/50 transition-all"
            />
         </div>
         
         <div className="flex items-center gap-4">
            <button className="p-6 glass-card rounded-2xl text-text-muted hover:text-white transition-all flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border-white/5">
               <Filter size={16} />
               Filter
            </button>
            <div className="h-10 w-[1px] bg-white/10 mx-2" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{team.length} Nodes Active</span>
         </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 relative z-10">
         <AnimatePresence mode="popLayout">
           {team
             .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.role.toLowerCase().includes(searchQuery.toLowerCase()))
             .map((member, i) => (
               <motion.div
                 key={member.email}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                 whileHover={{ y: -10 }}
                 className="glass-card rounded-[3.5rem] p-12 space-y-10 group/card relative overflow-hidden"
               >
                  <div className={cn(
                    "absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-0 group-hover/card:opacity-10 transition-opacity duration-1000",
                    member.color === 'violet' ? 'bg-violet-500' : member.color === 'cyan' ? 'bg-cyan-500' : 'bg-emerald-500'
                  )} />

                  <div className="flex justify-between items-start">
                     <Avatar 
                        initials={member.name.split(' ').map(n => n[0]).join('')} 
                        size="lg" 
                        status={member.status as any}
                        className="w-20 h-20 rounded-[2rem] border-white/10 group-hover/card:border-primary/50 transition-all duration-700"
                     />
                     <button className="p-4 rounded-2xl hover:bg-white/5 text-text-muted transition-all">
                        <MoreHorizontal size={20} />
                     </button>
                  </div>

                  <div className="space-y-3">
                     <h3 className="text-3xl font-black text-white leading-tight">{member.name}</h3>
                     <p className="text-lg text-text-secondary font-medium">{member.role}</p>
                  </div>

                  <div className="flex flex-col gap-4 pt-10 border-t border-white/5">
                     <div className="flex items-center gap-4 text-text-muted group-hover/card:text-white transition-colors">
                        <Mail size={14} />
                        <span className="text-sm font-medium">{member.email}</span>
                     </div>
                     <div className="flex items-center gap-4 text-text-muted group-hover/card:text-white transition-colors">
                        <Shield size={14} />
                        <span className="text-sm font-medium uppercase tracking-widest text-[10px] font-black">{member.module} CLUSTER ACCESS</span>
                     </div>
                  </div>

                  <button className="w-full py-5 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 group/btn">
                     Manage Permissions
                     <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </button>
               </motion.div>
             ))}
         </AnimatePresence>
      </div>

      {/* Access Governance HUD */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-20"
      >
         <div className="glass-card rounded-[4rem] p-16 lg:p-24 flex flex-col lg:flex-row items-center gap-16 border-dashed border-white/10 bg-white/[0.01] relative overflow-hidden group">
            <div className="absolute inset-0 bg-neural-mesh opacity-5 group-hover:opacity-10 transition-opacity" />
            
            <div className="w-32 h-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shrink-0">
               <Shield size={48} />
            </div>

            <div className="flex-1 space-y-6 text-center lg:text-left relative z-10">
               <h3 className="text-4xl font-black text-white uppercase tracking-tight">Access Governance Protocol</h3>
               <p className="text-xl text-text-secondary font-medium max-w-4xl leading-relaxed">
                  Enforcing Role-Based Access Control (RBAC) across all SAP S/4HANA OData nodes. 
                  Audit logs are being synthesized in real-time. Last compliance sweep: <span className="text-white">12 MIN AGO</span>.
               </p>
            </div>

            <button className="px-12 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all shrink-0 relative z-10">
               Policy Designer
            </button>
         </div>
      </motion.div>
    </div>
  );
}

