'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Zap, Shield, Database, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  module?: string;
  confidence?: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
  module,
  confidence,
}) => {
  const isAI = role === 'assistant';

  return (
    <div
      className={cn(
        'flex w-full animate-fade-in group',
        isAI ? 'justify-start' : 'justify-end'
      )}
    >
      <div className={cn(
        "flex flex-col gap-4 max-w-[85%]",
        isAI ? "items-start" : "items-end"
      )}>
        <div className="flex items-center gap-4 px-2">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">
            {isAI ? 'GenAISAP Intelligence' : 'Executive Directive'}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span className="text-[10px] font-bold text-text-muted uppercase">{timestamp}</span>
        </div>

        <div className={cn(
          "p-10 rounded-[2.5rem] text-lg font-semibold tracking-tight leading-relaxed relative overflow-hidden transition-all duration-700",
          isAI 
            ? "glass-card text-white border-white/10 hover:border-white/20" 
            : "bg-gradient-to-br from-violet-600 to-violet-900 text-white shadow-[0_20px_50px_rgba(124,58,237,0.2)]"
        )}>
          {isAI && (
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={60} />
            </div>
          )}
          {content ? (
            <div className="space-y-4">
              {content.split('\n').map((line, i) => {
                const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={j} className="text-primary font-black">{part.slice(2, -2)}</strong>;
                  }
                  return part;
                });

                if (line.trim().startsWith('- ') || line.trim().match(/^\d\./)) {
                   return <p key={i} className="pl-4 border-l-2 border-primary/30 py-1">{formattedLine}</p>;
                }
                return <p key={i}>{formattedLine}</p>;
              })}
            </div>
          ) : (
            <div className="flex gap-2">
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 rounded-full bg-white/40" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 rounded-full bg-white/40" />
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 rounded-full bg-white/40" />
            </div>
          )}
        </div>

        {isAI && (module || confidence) && (
          <div className="flex gap-3 px-4">
            {module && (
              <Badge className="bg-violet-500/10 text-violet-400 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                {module} CLUSTER
              </Badge>
            )}
            {confidence && (
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
                Confidence {confidence}%
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
