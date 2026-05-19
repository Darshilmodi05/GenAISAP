'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, Zap, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VoiceInput } from './voice-input';

interface ChatInputProps {
  input: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onVoiceInput: (text: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ input, onInputChange, onVoiceInput, onSend, isLoading }) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="glass-card rounded-[3rem] p-4 lg:p-6 shadow-md border-border group-focus-within:border-primary/40 transition-all duration-700">
        <div className="flex items-end gap-6">
          <div className="flex gap-2 mb-3">
             <motion.button 
               whileHover={{ scale: 1.1, backgroundColor: 'var(--surface-hover)' }}
               className="p-4 rounded-2xl text-text-muted hover:text-text-primary transition-all"
             >
               <Paperclip size={20} />
             </motion.button>
             <VoiceInput onTranscription={onVoiceInput} disabled={isLoading} />
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={onInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask GenAISAP about FICO, SD or MM telemetry..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-medium py-4 resize-none max-h-64 min-h-[60px] outline-none text-text-primary placeholder:text-text-muted custom-scrollbar"
            rows={1}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-6 px-2">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">SAP S/4HANA CONNECTED</span>
             </div>
             <div className="h-4 w-[1px] bg-border" />
             <div className="flex items-center gap-3">
                <Zap size={12} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted">HEURISTIC v4.0 ACTIVE</span>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface rounded-xl border border-border">
                <Database size={12} className="text-secondary" />
                <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">MTD_REV_DELTA_SYNC</span>
             </div>
             <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mr-4">
                Press <kbd className="px-2 py-1 bg-surface-elevated rounded border border-border text-text-primary mx-1">ENTER</kbd> to Send
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

