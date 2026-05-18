'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/components/dashboard/chat-message';
import { ChatInput } from '@/components/dashboard/chat-input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
  module?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'QUANTUM LINK ESTABLISHED. S/4HANA CORE ACCESSIBLE. STANDING BY FOR NEURAL INTERROGATION.',
      timestamp: '10:00 AM',
      confidence: 100,
      module: 'ROOT'
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = { 
      id: Date.now().toString(), 
      role: 'user' as const, 
      content: input, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: currentMessages }),
      });

      if (!response.ok) throw new Error('Neural Link Severed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      const assistantId = (Date.now() + 1).toString();

      // Add placeholder assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 98,
        module: 'ROOT'
      }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const { text } = JSON.parse(data);
              assistantContent += text;
              setMessages(prev => prev.map(msg => 
                msg.id === assistantId ? { ...msg, content: assistantContent } : msg
              ));
            } catch (e) {
              console.error('Data parsing error:', e);
            }
          }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 10).toString(),
        role: 'assistant',
        content: 'CRITICAL ERROR: NEURAL LINK SEVERED. ATTEMPTING RECONNECTION...',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 0,
        module: 'SYSTEM'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-10 p-2 relative animate-fade-in">
      
      {/* Left HUD: Cognitive Archives */}
      <aside className="w-80 flex flex-col gap-8 hidden xl:flex z-10">
        <div className="glass-card rounded-[3rem] p-10 flex-1 flex flex-col relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
           </div>
           <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-12">Cognitive Logs</h4>
           <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
              {[
                { t: 'Q2 Variance Recon', m: 'FICO', d: '2h', c: 'primary' },
                { t: 'Inventory Drift Opt', m: 'MM', d: '5h', c: 'secondary' },
                { t: 'Sales Risk Modeling', m: 'SD', d: '1d', c: 'accent' }
              ].map((s, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="p-5 border border-white/5 rounded-[2rem] cursor-pointer transition-all group/item"
                >
                  <div className="flex justify-between mb-2">
                    <span className={cn("text-[10px] font-black uppercase tracking-widest", s.c === 'primary' ? 'text-violet-400' : s.c === 'secondary' ? 'text-cyan-400' : 'text-emerald-400')}>{s.m}</span>
                    <span className="text-[10px] text-text-muted font-bold">{s.d}</span>
                  </div>
                  <p className="text-sm font-bold text-text-secondary group-hover/item:text-white transition-colors">{s.t}</p>
                </motion.div>
              ))}
           </div>
           
           <div className="pt-8 mt-8 border-t border-white/5">
              <button className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                 Load Archive
              </button>
           </div>
        </div>
      </aside>

      {/* Center: Quantum Intelligence Nexus */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-8 pr-6 custom-scrollbar mb-8 scroll-smooth"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <ChatMessage 
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  module={msg.module}
                  confidence={msg.confidence}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 pl-4">
               <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                     <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-primary" />
                     <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-primary" />
                     <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.5em] text-primary animate-pulse">Orchestrating Neural Response</span>
               </div>
            </motion.div>
          )}
        </div>

        <div className="mt-auto relative group">
           <div className="absolute -inset-10 bg-primary/10 blur-[120px] opacity-0 group-focus-within:opacity-100 transition-opacity duration-[2s]" />
           <div className="relative">
              <ChatInput 
                input={input} 
                onInputChange={(e) => setInput(e.target.value)} 
                onVoiceInput={(text) => {
                  setInput(text);
                }}
                onSend={handleSend}
                isLoading={isLoading} 
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-8 bottom-8 w-16 h-16 bg-white text-black rounded-3xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] z-20 group/btn"
              >
                <svg className="group-hover:rotate-12 transition-transform duration-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m12 19 9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
              </button>
           </div>
        </div>
      </div>

      {/* Right HUD: Intelligence Context */}
      <aside className="w-80 flex flex-col gap-8 hidden 2xl:flex z-10">
         <div className="glass-card rounded-[3rem] p-10 space-y-12 h-full flex flex-col">
            <div>
               <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-secondary mb-10">Heuristic Engine</h4>
               <div className="space-y-6">
                  {[
                    { l: 'LATENCY', v: '14ms', c: 'emerald-400' },
                    { l: 'THROUGHPUT', v: '1.4k/s', c: 'cyan-400' },
                    { l: 'CORE SYNC', v: 'ACTIVE', c: 'violet-400' }
                  ].map((t, i) => (
                    <div key={i} className="flex justify-between items-end border-b border-white/5 pb-5 last:border-0">
                       <span className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">{t.l}</span>
                       <span className={cn("text-lg font-black tracking-tighter", `text-${t.c}`)}>{t.v}</span>
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="flex-1 flex flex-col justify-end gap-6 pt-10 border-t border-white/5">
               <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Data Lineage Trace</span>
               <div className="p-6 bg-black/40 border border-white/5 rounded-2xl font-mono text-[10px] text-text-secondary leading-loose">
                  <span className="text-violet-400">INIT:</span> QUANTUM_CORE_V8 <br/>
                  <span className="text-cyan-400">PULL:</span> S4_ACDOCA_DELTA <br/>
                  <span className="text-emerald-400">MAP:</span> ENTITY_1000_LEDGER <br/>
                  <span className="text-white/40">CALC:</span> VARIANCE_VECTOR_P9
               </div>
               <button className="w-full py-4 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-2xl text-[10px] shadow-glow-primary">
                  Export Narrative
               </button>
            </div>
         </div>
      </aside>
    </div>
  );
}
