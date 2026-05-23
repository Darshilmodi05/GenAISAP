'use client';

import * as React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store/use-ui-store';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Background Neural Particles / Mesh */}
      <div className="fixed inset-0 z-0 bg-neural-mesh pointer-events-none" />
      <div className="noise-overlay" />

      {/* Dynamic Animated Blobs — suppressHydrationWarning prevents SSR/client mismatch on motion values */}
      <div className="fixed inset-0 z-0 pointer-events-none" suppressHydrationWarning>
        <motion.div
          animate={{
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full transform-gpu"
        />
        <motion.div
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] rounded-full transform-gpu"
        />
      </div>

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 relative z-10">
        <Topbar onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden pt-[100px] custom-scrollbar"
        >
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
