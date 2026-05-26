'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { TopbarSearch } from './topbar-search';
import { Menu, Bell, Zap, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';

interface TopbarProps {
  onMenuClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.id === 'main-content') {
        setIsScrolled(target.scrollTop > 20);
      }
    };

    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  return (
    <header
      className={cn(
        "absolute top-0 left-0 right-0 z-40 h-[100px] flex items-center justify-between px-10 transition-all duration-300",
        isScrolled 
          ? "bg-background/80 backdrop-blur-2xl border-b border-border shadow-md" 
          : "bg-transparent"
      )}
    >
      {/* Left Section: Contextual Intelligence */}
      <div className="flex items-center gap-10 flex-1">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onMenuClick}
          className="lg:hidden p-4 glass-card rounded-2xl text-text-muted hover:text-text-primary transition-all"
        >
          <Menu size={20} />
        </motion.button>

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-success animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-accent-success animate-ping opacity-50" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-text-primary">S/4HANA LIVE SYNCHRONIZATION</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
             <ShieldCheck size={10} className="text-primary" />
             <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">End-to-End Neural Encryption Active</span>
          </div>
        </div>
      </div>

      {/* Center: Command Search */}
      <div className="hidden lg:flex flex-1 justify-center max-w-2xl px-10">
        <TopbarSearch />
      </div>

      {/* Right Section: System Metrics & User */}
      <div className="flex items-center gap-8 justify-end flex-1">
        <div className="hidden xl:flex items-center gap-8 px-8 border-r border-border">
           <div className="text-right">
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Latency</p>
              <p className="text-sm font-black text-accent-success">14ms</p>
           </div>
           <div className="text-right">
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] mb-1">Compute</p>
              <p className="text-sm font-black text-text-primary">8.4 TFLOPS</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Switcher Button */}
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'var(--surface-hover)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-4 glass-card rounded-2xl text-text-muted hover:text-text-primary transition-all relative group"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'var(--surface-hover)' }}
            whileTap={{ scale: 0.9 }}
            className="p-4 glass-card rounded-2xl text-text-muted hover:text-text-primary transition-all relative group"
          >
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-background shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
          </motion.button>

          <div className="flex items-center gap-5 pl-4 group cursor-pointer">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-black text-text-primary uppercase tracking-wider group-hover:text-primary transition-colors">Darshil Modi</p>
              <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mt-0.5">Quantum Admin</p>
            </div>
            <Avatar 
              initials="DM" 
              size="md" 
              status="active" 
              className="border-border group-hover:border-primary/50 transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

