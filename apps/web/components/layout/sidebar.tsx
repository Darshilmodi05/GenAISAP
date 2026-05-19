'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/use-ui-store';
import {
  Home,
  MessageSquare,
  BarChart3,
  FileText,
  AlertCircle,
  History,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';

const navItems: { href: string; label: string; icon: any; color: string; badge?: string }[] = [
  { href: '/dashboard/home', label: 'HOME', icon: Home, color: 'violet' },
  { href: '/dashboard', label: 'DASHBOARD', icon: MessageSquare, color: 'cyan', badge: 'AI' },
  { href: '/dashboard/data-nodes', label: 'DATA NODES', icon: FileText, color: 'emerald' },
  { href: '/dashboard/analytics', label: 'ANALYTICS', icon: BarChart3, color: 'violet' },
  { href: '/dashboard/history', label: 'HISTORY', icon: History, color: 'cyan' },
  { href: '/dashboard/audit-logs', label: 'AUDIT LOGS', icon: ShieldCheck, color: 'emerald' },
  { href: '/dashboard/settings', label: 'SETTINGS', icon: Settings, color: 'violet' },
];

export const Sidebar = () => {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative h-screen bg-surface border-r border-border transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-50 overflow-hidden",
        !isSidebarOpen ? "w-[100px]" : "w-[320px]"
      )}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-primary/5 blur-[100px] pointer-events-none" />

      {/* Brand Section */}
      <div className="h-[140px] flex items-center justify-center border-b border-border relative">
        <Link href="/dashboard/home" className="flex items-center gap-5 group/logo">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="w-14 h-14 bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center rounded-2xl shadow-glow-primary"
          >
            <span className="text-white font-black text-3xl">G</span>
          </motion.div>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="text-xl font-black tracking-tighter text-text-primary leading-none">GenAISAP</span>
              <span className="text-[9px] font-black tracking-[0.4em] text-primary uppercase mt-1">Intelligence Hub</span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 py-12 px-5 space-y-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-5 p-5 rounded-[2rem] transition-all duration-500 group relative overflow-hidden",
                active
                  ? "text-text-inverse shadow-[0_4px_12px_rgba(0,20,255,0.25)]"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-hover"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-primary"
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                />
              )}
              <Icon size={24} className={cn("flex-shrink-0 relative z-10 transition-transform duration-500", active ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6")} />
              {isSidebarOpen && (
                <span className="text-[11px] font-black uppercase tracking-[0.3em] flex-1 relative z-10">{item.label}</span>
              )}
              {item.badge && isSidebarOpen && (
                <span className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-xl relative z-10",
                  active ? "bg-text-inverse/10 text-text-inverse" : "bg-primary/10 text-primary"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="p-8 border-t border-border space-y-6">
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 p-5 bg-surface-elevated rounded-[2.5rem] border border-border group hover:border-primary/30 transition-all cursor-pointer"
          >
            <Avatar initials="DM" size="md" status="active" className="rounded-2xl border-border" />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-black text-text-primary truncate">DARSHIL MODI</span>
              <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5">EXECUTIVE NODE</span>
            </div>
          </motion.div>
        )}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="w-full h-14 flex items-center justify-center bg-surface-elevated hover:bg-primary hover:text-text-inverse transition-all rounded-[2rem] shadow-2xl group"
        >
          {!isSidebarOpen ? <ChevronRight size={24} className="group-hover:scale-110 transition-transform" /> : <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />}
        </button>
      </div>


      {/* Ecosystem Pulse */}
      {isSidebarOpen && (
        <div className="px-12 pb-12 flex items-center justify-between opacity-50">
          <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Neural Status</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                className="w-1.5 h-1.5 rounded-full bg-accent"
              />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

function isActive(href: string, pathname: string) {
  if (href === '/dashboard') {
    return pathname === '/dashboard';
  }
  return pathname === href || pathname.startsWith(href + '/');
}
